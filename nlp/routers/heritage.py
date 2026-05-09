import os
import json
import re
import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import torch
from transformers import MarianMTModel, MarianTokenizer
from sentence_transformers import SentenceTransformer, util
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/heritage", tags=["Heritage Check"])

# Qwen client (Deep Infra, OpenAI-compatible) — used for name-guess scoring
_qwen_client = OpenAI(
    base_url="https://api.deepinfra.com/v1/openai",
    api_key=os.getenv("DEEPINFRA_API_KEY", ""),
)
_QWEN_MODEL = os.getenv("DEEPINFRA_QWEN_MODEL", "Qwen/Qwen3.6-35B-A3B")
_JSON_FENCE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)


def _extract_json(raw: str) -> dict:
    m = _JSON_FENCE.search(raw)
    cleaned = m.group(1) if m else raw.strip()
    brace = cleaned.find("{")
    if brace > 0:
        cleaned = cleaned[brace:]
    return json.loads(cleaned)

# === 1. Translation model (Vietnamese → English) ===
translator_name = "Helsinki-NLP/opus-mt-vi-en"
tokenizer = MarianTokenizer.from_pretrained(translator_name)
translator = MarianMTModel.from_pretrained(translator_name)

def translate_vi_to_en(text: str) -> str:
    """Translate Vietnamese text to English"""
    batch = tokenizer([text], return_tensors="pt", padding=True)
    with torch.no_grad():
        generated = translator.generate(**batch)
    return tokenizer.decode(generated[0], skip_special_tokens=True)

# === 2. Multilingual embedding model (handles Vietnamese + English) ===
embedder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# === 3. Smart translation rule ===
def maybe_translate(text: str) -> str:
    """
    Translate only if the text looks like a long Vietnamese sentence
    (to avoid changing proper names like 'Địa Đạo Củ Chi').
    """
    viet_chars = "ăâđêôơưÁÀẢÃẠĂÂĐÊÔƠƯáàảãạăâđêôơư"
    viet_count = sum(ch in viet_chars for ch in text)
    # If text is long and contains multiple Vietnamese diacritics → probably a full sentence
    if viet_count > 3 and len(text.split()) > 3:
        return translate_vi_to_en(text)
    return text

# === 4. Request model ===
class CheckRequest(BaseModel):
    answer: str
    expected: str
    aliases: Optional[List[str]] = None  # optional

# === 5. Endpoint ===
@router.post("/check")
def check_answer(req: CheckRequest):
    # Step 1. Optionally translate (for full sentences only)
    user_input = maybe_translate(req.answer)

    # Step 2. Build candidate list
    candidates = [req.expected]
    if req.aliases:
        candidates.extend(req.aliases)

    # Step 3. Embed both user input and candidates
    emb_answer = embedder.encode(user_input, convert_to_tensor=True)
    emb_candidates = embedder.encode(candidates, convert_to_tensor=True)

    # Step 4. Compute cosine similarity
    cos_scores = util.cos_sim(emb_answer, emb_candidates)[0]
    best_score = cos_scores.max().item()

    # Step 5. Convert similarity (0–1) → nameScore (0–5)
    nameScore = round(best_score * 5)

    # Step 6. Return full debug info
    return {
        "user_input": req.answer,
        "translated_input": user_input,
        "expected": req.expected,
        "aliases": req.aliases,
        "similarity": best_score,
        "nameScore": nameScore
    }


# ── Qwen-based partial-credit name rating ─────────────────────────────────────

class RateNameRequest(BaseModel):
    answer: str
    expected: str
    aliases: Optional[List[str]] = None
    region: Optional[str] = None
    description: Optional[str] = None


def _build_rate_prompt(answer: str, expected: str, aliases: List[str],
                       region: Optional[str], description: Optional[str]) -> str:
    alias_block = ", ".join(aliases) if aliases else "none"
    region_block = region or "unknown"
    desc_block = (description or "").strip() or "no description provided"
    return f"""You are scoring a player's guess in a Vietnamese heritage location guessing game.
The player sees a Street View image and must name the heritage site.

CORRECT SITE:
- Official name: "{expected}"
- Known aliases: {alias_block}
- Region / city: {region_block}
- Brief description: {desc_block}

PLAYER'S GUESS: "{answer}"

Award a partial-credit score from 0 to 5 using THIS STRICT rubric:
- 5: Exact official name, a registered alias, or a clearly equivalent translation/spelling — essentially correct (~95-100% match).
- 4: Strong, distinctive partial match (~75-90%): recognisable site name with minor typos / missing word / wrong diacritics, OR names the exact key keyword + the correct figure/dynasty the site honours.
- 3: Moderate partial match (~50-70%): mentions ONE distinctive part of the site — e.g. just the founder/figure the site honours, or the specific monument keyword without the qualifier — but not the full identity.
- 2: Weak match (~25-45%): names the exact city/town the site sits in, but does not identify the site itself.
- 1: Very vague (~10-25%): names only the broader province, the country (Vietnam), or a loosely related era/figure with no clear tie to this specific site.
- 0: Completely wrong, blank, gibberish, generic word ("temple", "pagoda"), or unrelated.

BE STRICT. Do not round up. If the guess feels roughly 80% related, that is a 4 — not a 5.
A 5 should be reserved for genuinely correct answers. A 4 means clearly the right site but with a flaw (typo, missing word, partial rendering).
Never award 5 for "close enough" — only for essentially correct.

Return ONLY valid JSON, no markdown fences, no explanation outside JSON:
{{
  "nameScore": <integer 0-5>,
  "reasoning": "<one short sentence>"
}}"""


@router.post("/rate-name")
def rate_name(req: RateNameRequest):
    """
    Qwen-based partial-credit scoring of the player's name guess (0–5).
    Falls back to the embedding-based score if Qwen fails or returns junk.
    """
    answer = (req.answer or "").strip()
    expected = (req.expected or "").strip()
    aliases = req.aliases or []

    if not answer or not expected:
        return {"nameScore": 0, "similarity": 0.0, "reasoning": "empty input", "source": "fallback"}

    # Embedding similarity always computed — used as the fallback / debug signal.
    candidates = [expected] + aliases
    emb_answer = embedder.encode(answer, convert_to_tensor=True)
    emb_candidates = embedder.encode(candidates, convert_to_tensor=True)
    cos_scores = util.cos_sim(emb_answer, emb_candidates)[0]
    best_score = float(cos_scores.max().item())
    fallback_score = round(best_score * 5)

    prompt = _build_rate_prompt(answer, expected, aliases, req.region, req.description)

    try:
        completion = _qwen_client.chat.completions.create(
            model=_QWEN_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=128,
            extra_body={"enable_thinking": False},
        )
        raw = (completion.choices[0].message.content or "").strip()
        parsed = _extract_json(raw)
        score = parsed.get("nameScore")
        if not isinstance(score, int) or score < 0 or score > 5:
            raise ValueError(f"invalid nameScore: {score!r}")
        reasoning = (parsed.get("reasoning") or "").strip()[:200]
        return {
            "nameScore": score,
            "similarity": best_score,
            "reasoning": reasoning,
            "source": "qwen",
        }
    except Exception as exc:
        logger.warning("[rate-name] Qwen failed, falling back to embedding: %s", exc)
        return {
            "nameScore": fallback_score,
            "similarity": best_score,
            "reasoning": "embedding fallback",
            "source": "fallback",
        }
