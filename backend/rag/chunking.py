def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """
    Splits text into word-based chunks (default ~500 words) with overlap.
    """
    words = text.split(" ")
    chunks = []
    start = 0
    step = max(1, chunk_size - overlap)

    while start < len(words):
        end = min(len(words), start + chunk_size)
        chunk = " ".join(words[start:end]).strip()
        if chunk and len(chunk) > 10:
            chunks.append(chunk)
        if end == len(words):
            break
        start += step

    return chunks

def clean_text(text: str) -> str:
    """
    Basic text cleaning: removes extra whitespaces and newlines.
    """
    import re
    text = re.sub(r"\s+", " ", text or "")
    return text.strip()
