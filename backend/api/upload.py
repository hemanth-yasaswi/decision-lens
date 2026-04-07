from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from models.document import Document
from services.auth_service import get_current_user
from services.document_service import document_service
from utils.file_handler import save_upload_file
from config import settings
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=2)

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Validate file size
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    # 2. Validate file type
    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in [".pdf", ".txt"]:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are allowed")

    # 3. Save file locally — use a unique filename to avoid collisions
    safe_filename = f"{current_user.id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    save_upload_file(file, file_path)

    # 4. Create document record in DB
    new_doc = Document(
        filename=file.filename,
        file_path=file_path,
        user_id=current_user.id,
        file_type=extension,
        status="processing",
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # 5. Process document in background
    from services.document_processor import extract_text, clean_text, chunk_text
    from services.retrieval_service import retrieval_service
    from database import SessionLocal

    def process_and_index(doc_id: int, file_path: str):
        db_job = SessionLocal()
        try:
            print(f"[UPLOAD] Starting processing for doc_id={doc_id}, path={file_path}")
            doc = db_job.query(Document).filter(Document.id == doc_id).first()
            
            raw_text = extract_text(file_path)
            if not raw_text.strip():
                print(f"[UPLOAD] WARNING: Extracted empty text from {file_path}")
                if doc:
                    doc.status = "error"
                    db_job.commit()
                return
                
            cleaned = clean_text(raw_text)
            chunks = chunk_text(cleaned, chunk_size=1000)
            
            if not chunks:
                print(f"[UPLOAD] WARNING: No chunks generated for {file_path}")
                if doc:
                    doc.status = "error"
                    db_job.commit()
                return
                
            print(f"[UPLOAD] Chunks created: {len(chunks)}")
            retrieval_service.index_document(doc_id, chunks)
            print(f"[UPLOAD] doc_id={doc_id} indexed successfully")
            
            if doc:
                doc.status = "ready"
                db_job.commit()
                
        except Exception as e:
            print(f"[UPLOAD] ERROR processing doc_id={doc_id}: {e}")
            import traceback; traceback.print_exc()
            try:
                # Need fresh doc object if transaction failed
                db_job.rollback()
                doc = db_job.query(Document).filter(Document.id == doc_id).first()
                if doc:
                    doc.status = "error"
                    db_job.commit()
            except Exception:
                pass
        finally:
            db_job.close()

    background_tasks.add_task(process_and_index, new_doc.id, file_path)

    return {
        "id": new_doc.id,
        "filename": new_doc.filename,
        "status": "processing",
    }
