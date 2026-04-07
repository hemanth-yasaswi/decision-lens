from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.document import Document
from services.auth_service import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "upload_date": doc.upload_date,
            "file_type": doc.file_type,
            "status": doc.status
        }
        for doc in documents
    ]
