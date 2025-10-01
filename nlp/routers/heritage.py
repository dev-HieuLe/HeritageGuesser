# routers/heritage.py
from fastapi import APIRouter, HTTPException
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

# === 2. Embedding model ===
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# === 3. Request model ===
class CheckRequest(BaseModel):
    answer: str
    expected: str
    aliases: list[str] | None = None  # optional

# === 4. Endpoint ===
@router.post("/check")
def check_answer(req: CheckRequest):
    # translate if contains Vietnamese diacritics
    if any(ch in req.answer for ch in "ăâđêôơưÁÀẢÃẠĂÂĐÊÔƠƯáàảãạăâđêôơư"):
        user_input = translate_vi_to_en(req.answer)
    else:
        user_input = req.answer

    # Candidates = expected + aliases
    candidates = [req.expected]
    if req.aliases:
        candidates.extend(req.aliases)

    # Embed user input
    emb_answer = embedder.encode(user_input, convert_to_tensor=True)
    emb_candidates = embedder.encode(candidates, convert_to_tensor=True)

    # Cosine similarity
    cos_scores = util.cos_sim(emb_answer, emb_candidates)[0]
    best_score = cos_scores.max().item()

    # Convert similarity 0–1 → nameScore 0–5
    nameScore = round(best_score * 5)

    return {
        "user_input": req.answer,
        "translated_input": user_input,
        "expected": req.expected,
        "aliases": req.aliases,
        "similarity": best_score,
        "nameScore": nameScore
    }
