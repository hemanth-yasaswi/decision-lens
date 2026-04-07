import re
import pdfplumber
import spacy

nlp = spacy.load("en_core_web_sm")


def extract_text(file_path: str) -> str:
    """Extract raw text from PDF or TXT file."""
    if file_path.endswith(".pdf"):
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    elif file_path.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file type: {file_path}")


def clean_text(text: str) -> str:
    """Normalize whitespace and remove junk characters."""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x20-\x7E\n]', '', text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = 1000) -> list[str]:
    """
    Split text into fixed-size character chunks at sentence boundaries.
    Skips chunks shorter than 50 characters.
    """
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current = ""

    for sentence in sentences:
        if len(current) + len(sentence) <= chunk_size:
            current += " " + sentence
        else:
            if len(current.strip()) >= 50:
                chunks.append(current.strip())
            current = sentence

    if len(current.strip()) >= 50:
        chunks.append(current.strip())

    return chunks


def extract_nlp_metadata(chunk: str) -> dict:
    """
    Run spaCy on a chunk. Returns keywords and named entities.
    Used to enrich chunk metadata — not sent to LLM directly.
    """
    doc = nlp(chunk[:5000])  # cap for performance
    keywords = list(set(
        token.lemma_.lower()
        for token in doc
        if token.is_alpha and not token.is_stop and len(token.text) > 2
    ))
    entities = list(set(
        f"{ent.text} ({ent.label_})"
        for ent in doc.ents
    ))
    return {"keywords": keywords[:20], "entities": entities[:10]}
