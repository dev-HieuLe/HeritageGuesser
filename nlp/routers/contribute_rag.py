"""
RAG-assisted metadata generation + heritage validation for contributions.
Uses Qwen/Qwen3-35B-A3B via Deep Infra with ChromaDB knowledge retrieval.

Flow:
  1. Receive { name, lat, lng, userDescription } from Node.js backend
  2. Search knowledge base → get top-3 relevant context chunks + their names
  3. Build a single augmented prompt that asks Qwen to:
       a) Validate: is this a real Vietnamese heritage/historical/cultural site?
       b) If yes: generate structured metadata
  4. Parse response → return metadata WITH source tracing fields
  5. If not a heritage site → return 422 with rejection reason
"""

import os
import json
import re
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

from rag.knowledge_base import knowledge_base

load_dotenv()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/heritage", tags=["Contribute RAG"])

# ── Deep Infra client (OpenAI-compatible) ─────────────────────────────────────
_client = OpenAI(
    base_url="https://api.deepinfra.com/v1/openai",
    api_key=os.getenv("DEEPINFRA_API_KEY", ""),
)
_QWEN_MODEL = os.getenv("DEEPINFRA_QWEN_MODEL", "Qwen/Qwen3-35B-A3B")


# ── Request / Response schemas ────────────────────────────────────────────────
class ContributeRequest(BaseModel):
    name: str
    lat: float
    lng: float
    userDescription: str = ""


class ContributeMetadata(BaseModel):
    # Core metadata
    description: str
    era: str | None
    built_year: int | None
    region: str
    aliases: str | None
    difficulty: int

    # Source tracing — tells caller WHERE the info came from
    rag_context_used: bool          # True if KB returned relevant docs
    rag_sources: list[str]          # Names of KB docs retrieved (may be empty)
    rag_similarity_note: str        # Human-readable note on context quality


# ── Helpers ───────────────────────────────────────────────────────────────────
_JSON_FENCE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)


def _extract_json(raw: str) -> dict:
    """Strip markdown fences and parse the first JSON object found."""
    m = _JSON_FENCE.search(raw)
    cleaned = m.group(1) if m else raw.strip()
    # If model prepended text before the JSON, find the first { … }
    brace = cleaned.find("{")
    if brace > 0:
        cleaned = cleaned[brace:]
    return json.loads(cleaned)


def _build_prompt(
    name: str,
    lat: float,
    lng: float,
    description_hint: str,
    context: str,
    context_names: list[str],
) -> str:
    if context:
        context_block = (
            f"KNOWLEDGE BASE CONTEXT (retrieved from trusted sources — dsvh.gov.vn, UNESCO):\n"
            f"[Matched documents: {', '.join(context_names)}]\n\n"
            f"{context}"
        )
    else:
        context_block = (
            "KNOWLEDGE BASE CONTEXT: No close match found in local KB. "
            "Use your own expert knowledge of Vietnamese heritage."
        )

    return f"""You are a strict expert curator for a Vietnamese cultural heritage database.
A user wants to contribute a new location. Your job is to:
  1. VALIDATE: decide if this is a genuine Vietnamese heritage, historical, or significant cultural site.
     - REJECT if it is: a restaurant, hotel, shop, random street, personal home, amusement park, or non-notable place.
     - ACCEPT if it is: a temple, pagoda, citadel, UNESCO site, national monument, historical battlefield,
       colonial building, ethnic cultural site, natural wonder with heritage status, or any site with recognised
       cultural/historical value in Vietnam.
  2. If ACCEPTED: generate rich structured metadata using the context below and your knowledge.

{context_block}

SUBMITTED LOCATION:
- Name: "{name}"
- Coordinates: latitude {lat}, longitude {lng}
- User hint: "{description_hint or 'None provided'}"

Return ONLY valid JSON, no explanation, no markdown fences:
{{
  "is_heritage": true or false,
  "rejection_reason": "Explain why rejected in 1 sentence, or null if accepted",
  "description": "3-sentence description: historical context + cultural significance + architecture/nature (null if rejected)",
  "era": "Historical era/dynasty e.g. 'Lý Dynasty', 'Chăm Pa', 'French Colonial', 'Modern Era' — or null",
  "built_year": <integer year or null>,
  "region": "Vietnamese province or city name",
  "aliases": "3 comma-separated alternative names (Vietnamese and English) or null",
  "difficulty": <1=famous tourist site, 2=moderately known, 3=obscure — integer>
}}"""


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/rag-contribute", response_model=ContributeMetadata)
async def rag_contribute(req: ContributeRequest):
    """
    RAG-assisted metadata generation + heritage validation.
    Called by the Node.js backend during POST /api/contribute.

    Returns 422 if the submitted location is not a recognised heritage site.
    Returns ContributeMetadata with source-tracing fields on success.
    """
    name = req.name.strip()
    description_hint = req.userDescription.strip()

    # ── Step 1: Retrieve relevant context from knowledge base ─────────────────
    context_chunks, context_names = knowledge_base.search_with_names(name, n_results=3)
    context = "\n\n---\n\n".join(context_chunks)
    rag_context_used = len(context_chunks) > 0

    # ── Step 2: Build augmented prompt ────────────────────────────────────────
    prompt = _build_prompt(name, req.lat, req.lng, description_hint, context, context_names)

    # ── Step 3: Call Qwen via Deep Infra ──────────────────────────────────────
    completion = _client.chat.completions.create(
        model=_QWEN_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,    # Low temp → factual, consistent
        max_tokens=1024,
    )
    raw = completion.choices[0].message.content.strip()
    logger.info("[rag-contribute] raw Qwen output: %s", raw[:300])

    # ── Step 4: Parse JSON ────────────────────────────────────────────────────
    try:
        parsed = _extract_json(raw)
    except (json.JSONDecodeError, ValueError) as exc:
        logger.error("[rag-contribute] JSON parse error: %s | raw: %s", exc, raw)
        raise HTTPException(status_code=502, detail="Model returned unparseable output. Please retry.")

    # ── Step 5: Heritage gate — reject non-heritage submissions ───────────────
    is_heritage = parsed.get("is_heritage", True)
    if not is_heritage:
        reason = parsed.get("rejection_reason") or "This location does not appear to be a recognised heritage or historical site."
        raise HTTPException(
            status_code=422,
            detail={"error": "not_a_heritage_site", "reason": reason},
        )

    # ── Step 6: Sanitise metadata fields ─────────────────────────────────────
    description = (parsed.get("description") or "").strip()
    if not description:
        description = description_hint or f"{name} is a heritage site submitted for review."

    era = parsed.get("era")
    era = era.strip() if isinstance(era, str) and era.strip() else None

    built_year = parsed.get("built_year")
    if not (isinstance(built_year, int) and 1 <= built_year <= 2100):
        built_year = None

    region = (parsed.get("region") or "Vietnam").strip()

    aliases = parsed.get("aliases")
    aliases = aliases.strip() if isinstance(aliases, str) and aliases.strip() else None

    difficulty = parsed.get("difficulty")
    difficulty = difficulty if difficulty in (1, 2, 3) else 2

    # ── Step 7: Build source-tracing note ────────────────────────────────────
    if rag_context_used:
        similarity_note = f"KB matched {len(context_chunks)} document(s): {', '.join(context_names)}. Qwen used this context to enrich the output."
    else:
        similarity_note = "No relevant KB document found. Qwen generated metadata from its own training knowledge only."

    return ContributeMetadata(
        description=description,
        era=era,
        built_year=built_year,
        region=region,
        aliases=aliases,
        difficulty=difficulty,
        rag_context_used=rag_context_used,
        rag_sources=context_names,
        rag_similarity_note=similarity_note,
    )


@router.get("/rag-status")
async def rag_status():
    """Inspect the knowledge base: doc count, model in use, seed names."""
    names = knowledge_base.all_names()
    return {
        "model": _QWEN_MODEL,
        "kb_document_count": knowledge_base.count(),
        "kb_documents": names,
        "embed_model": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        "vector_db": "ChromaDB (local persistent)",
    }


@router.post("/rag-search-debug")
async def rag_search_debug(body: dict):
    """
    Debug endpoint: show which KB documents would be retrieved for a query.
    Body: { "query": "Vịnh Hạ Long" }
    """
    query = (body.get("query") or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="query is required")
    chunks, names = knowledge_base.search_with_names(query, n_results=5)
    return {
        "query": query,
        "results": [{"name": n, "preview": c[:200]} for n, c in zip(names, chunks)],
    }
