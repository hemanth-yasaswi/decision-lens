# This file is kept to avoid breaking any imports elsewhere in the codebase.
# All real logic has moved to retrieval_service.py.
# DO NOT use this file for new code.

from services.retrieval_service import retrieval_service

class EmbeddingService:
    """Thin compatibility shim. Delegates to RetrievalService."""

    def index_document(self, doc_id: int, chunks: list[str]):
        retrieval_service.index_document(doc_id, chunks)

    def search(self, query: str, doc_ids=None, top_k=3):
        return retrieval_service.search(query, doc_ids, top_k)

    def is_indexed(self, doc_id: int) -> bool:
        return retrieval_service.is_indexed(doc_id)


embedding_service = EmbeddingService()
