from __future__ import annotations

"""
ChromaDB-backed knowledge base for Vietnamese heritage RAG.
Auto-seeds from seed_data.py on first run.
"""

import os
import chromadb
from sentence_transformers import SentenceTransformer
from .seed_data import SEED_DOCUMENTS

# ── Config ────────────────────────────────────────────────────────────────────
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(_BASE_DIR, "chroma_db")
COLLECTION_NAME = "vietnamese_heritage"
EMBED_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


class HeritageKnowledgeBase:
    """Wraps ChromaDB + sentence embedder for heritage RAG retrieval."""

    def __init__(self):
        self._client = chromadb.PersistentClient(path=DB_PATH)
        # Reuse the same embedding model already loaded by heritage.py router
        self._embedder = SentenceTransformer(EMBED_MODEL)
        self._col = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        if self._col.count() == 0:
            self._seed()

    # ── Public API ────────────────────────────────────────────────────────────

    def search(self, query: str, n_results: int = 3) -> list[str]:
        """Return up to n_results relevant document strings for query."""
        chunks, _ = self.search_with_names(query, n_results)
        return chunks

    def search_with_names(self, query: str, n_results: int = 3) -> tuple[list[str], list[str]]:
        """Return (documents, names) for the top n_results matches."""
        count = self._col.count()
        if count == 0:
            return [], []
        k = min(n_results, count)
        embedding = self._embedder.encode(query, convert_to_numpy=True).tolist()
        results = self._col.query(
            query_embeddings=[embedding],
            n_results=k,
            include=["documents", "metadatas"],
        )
        docs = results["documents"][0] if results["documents"] else []
        metas = results["metadatas"][0] if results["metadatas"] else []
        names = [m.get("name", "unknown") for m in metas]
        return docs, names

    def all_names(self) -> list[str]:
        """Return all document names in the knowledge base."""
        result = self._col.get(include=["metadatas"])
        return [m.get("name", "?") for m in result["metadatas"]]

    def add_document(self, doc_id: str, content: str, metadata: dict) -> None:
        """Index a new document (e.g., after a contribution is approved)."""
        embedding = self._embedder.encode(content, convert_to_numpy=True).tolist()
        self._col.upsert(
            ids=[doc_id],
            embeddings=[embedding],
            documents=[content],
            metadatas=[metadata],
        )

    def count(self) -> int:
        return self._col.count()

    # ── Private ───────────────────────────────────────────────────────────────

    def _seed(self) -> None:
        """Populate the collection with built-in seed data on first run."""
        print(f"[KB] Seeding knowledge base with {len(SEED_DOCUMENTS)} documents…")
        ids, embeddings, documents, metadatas = [], [], [], []
        for i, doc in enumerate(SEED_DOCUMENTS):
            emb = self._embedder.encode(doc["content"], convert_to_numpy=True).tolist()
            ids.append(f"seed_{i:04d}")
            embeddings.append(emb)
            documents.append(doc["content"])
            metadatas.append({"name": doc["name"], "source": doc["source"]})

        self._col.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)
        print(f"[KB] Seeded {self._col.count()} documents.")


# Singleton — imported once when FastAPI starts
knowledge_base = HeritageKnowledgeBase()
