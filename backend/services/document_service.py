import os
import structlog
from services.document_processor import extract_text, clean_text, chunk_text
from services.retrieval_service import retrieval_service

logger = structlog.get_logger()


class DocumentService:
    """Handles text extraction and TF-IDF indexing for uploaded documents."""

    def process_document(self, file_path: str, doc_metadata: dict):
        """
        Extract → clean → chunk → index into retrieval_service.
        doc_metadata must contain: filename, doc_id, user_id.
        Updates the Document DB record status to 'ready' or 'error'.
        """
        doc_id = doc_metadata.get("doc_id")
        logger.info("processing_document_started", doc_id=doc_id)

        from database import SessionLocal
        from models.document import Document

        db = SessionLocal()
        document = db.query(Document).filter(Document.id == doc_id).first()

        try:
            if document:
                document.status = "processing"
                db.commit()

            raw_text = extract_text(file_path)
            if not raw_text or not raw_text.strip():
                logger.warning("empty_text_extracted", file_path=file_path)
                if document:
                    document.status = "error"
                    db.commit()
                return 0

            cleaned_text = clean_text(raw_text)
            chunks = chunk_text(cleaned_text)

            if not chunks:
                logger.warning("no_chunks_produced", doc_id=doc_id)
                if document:
                    document.status = "error"
                    db.commit()
                return 0

            retrieval_service.index_chunks(chunks)
            logger.info("chunks_indexed", doc_id=doc_id, chunk_count=len(chunks))

            if document:
                document.status = "ready"
                db.commit()
                print(f"[DOC] Document {doc_id} status set to 'ready' ({len(chunks)} chunks indexed)")

            logger.info("processing_document_finished", doc_id=doc_id, chunks=len(chunks))
            return len(chunks)

        except Exception as exc:
            if document:
                document.status = "error"
                db.commit()
            logger.error("document_processing_failed", doc_id=doc_id, error=str(exc), exc_info=True)
            return 0
        finally:
            db.close()


document_service = DocumentService()
