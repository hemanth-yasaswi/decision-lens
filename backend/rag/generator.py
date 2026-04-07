from services.rag_service import rag_service
from schemas.chat_schema import ChatResponse

class Generator:
    async def generate(self, query: str, context: list) -> ChatResponse:
        """
        Generates a structured AI response using query and context.
        """
        return await rag_service.generate_response(query, context)

generator = Generator()
