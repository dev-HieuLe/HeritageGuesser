from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel
import torch
from transformers import MarianMTModel, MarianTokenizer
from sentence_transformers import SentenceTransformer, util

router = APIRouter(prefix="/heritage", tags=["Heritage Check"])

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
    aliases: list[str] | None = None  # optional

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
