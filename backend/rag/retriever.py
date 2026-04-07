from services.embedding_service import embedding_service

class Retriever:
    def __init__(self, k: int = 5):
        self.k = k

    def retrieve(self, query: str) -> list:
        """
        Retrieves top-k relevant chunks for a given query.
        """
        return embedding_service.search(query, k=self.k)

retriever = Retriever()
