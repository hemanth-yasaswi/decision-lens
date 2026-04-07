from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.document import Document
from schemas.chat_schema import ChatRequest, ChatResponse
from services.auth_service import get_current_user
from services.rag_service import generate_response
from services.retrieval_service import retrieval_service
import structlog

logger = structlog.get_logger()

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):

    # 1. Normalize document_ids — treat [] same as None
    doc_ids = request.document_ids if request.document_ids else None

    # 2. Build a { doc_id: filename } map for source attribution
    if doc_ids:
        docs = db.query(Document).filter(
            Document.id.in_(doc_ids),
            Document.user_id == current_user.id
        ).all()
    else:
        docs = db.query(Document).filter(
            Document.user_id == current_user.id
        ).all()

    document_names = {doc.id: doc.filename for doc in docs}

    # 3. Check if any documents are indexed
    indexed_ids = retrieval_service.get_all_indexed_ids()
    if not indexed_ids:
        return ChatResponse(
            summary="No documents have been processed yet.",
            key_points=["Upload a PDF or TXT file first."],
            explanation="The retrieval index is empty. Documents are indexed in memory on upload.",
            sources=[]
        )

    # 4. Run the RAG pipeline
    result = generate_response(
        query=request.query,
        document_ids=doc_ids,
        document_names=document_names
    )

    # 5. Map result dict → ChatResponse schema
    key_points = (
        ["PRO: " + p for p in result.get("pros", [])] +
        ["CON: " + c for c in result.get("cons", [])] +
        ["RISK: " + r for r in result.get("risks", [])]
    ) or [result.get("reasoning", "")]

    formatted_sources = [{"filename": s, "content": ""} for s in result.get("sources", [])]

    return ChatResponse(
        summary=result["answer"],
        key_points=key_points,
        explanation=result.get("reasoning", ""),
        sources=formatted_sources
    )
