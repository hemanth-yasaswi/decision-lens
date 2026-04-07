import threading
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


import spacy

try:
    nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

def _normalize_query(query: str) -> str:
    """Normalize and expand query using spaCy lemmas to improve TF-IDF matching."""
    doc = nlp(query.lower())
    lemmas = [token.lemma_ for token in doc if not token.is_punct and not token.is_stop]
    return query + " " + (" ".join(lemmas))

class RetrievalService:
    """
    In-memory TF-IDF index. One index per document (keyed by doc_id).
    Thread-safe for concurrent uploads.
    """

    def __init__(self):
        self._lock = threading.Lock()
        # { doc_id: { "chunks": [...], "vectorizer": ..., "matrix": ... } }
        self._index: dict = {}

    def index_document(self, doc_id: int, chunks: list[str]):
        """Fit TF-IDF vectorizer on chunks and store in memory."""
        if not chunks:
            print(f"[RETRIEVAL] No chunks to index for doc_id={doc_id}")
            return

        vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words="english",
            ngram_range=(1, 2)
        )
        matrix = vectorizer.fit_transform(chunks)

        with self._lock:
            self._index[doc_id] = {
                "chunks": chunks,
                "vectorizer": vectorizer,
                "matrix": matrix,
            }

        print(f"[RETRIEVAL] Indexed doc_id={doc_id} with {len(chunks)} chunks")

    def search(self, query: str, doc_ids: list[int] | None = None, top_k: int = 5) -> list[dict]:
        """
        Search across specified doc_ids (or all indexed docs if None/empty).
        Returns top_k chunks sorted by relevance score descending.
        Minimum score threshold: 0.05 (filters completely irrelevant chunks).
        """
        results = []
        expanded_query = _normalize_query(query)

        with self._lock:
            target_ids = list(doc_ids) if doc_ids else list(self._index.keys())

        for doc_id in target_ids:
            with self._lock:
                entry = self._index.get(doc_id)

            if not entry:
                print(f"[RETRIEVAL] doc_id={doc_id} not in index — was it uploaded this session?")
                continue

            query_vec = entry["vectorizer"].transform([expanded_query])
            scores = cosine_similarity(query_vec, entry["matrix"])[0]

            for i, score in enumerate(scores):
                if score >= 0.05:
                    results.append({
                        "doc_id": doc_id,
                        "chunk": entry["chunks"][i],
                        "score": float(score),
                    })

        results.sort(key=lambda x: x["score"], reverse=True)
        
        # Deduplication to ensure context diversity
        unique_results = []
        seen_texts = set()
        
        for r in results:
            text = r["chunk"]
            is_dup = False
            words_r = set(text.lower().split())
            
            for seen in seen_texts:
                words_s = set(seen.lower().split())
                # If they share >60% vocabulary, consider it a duplicate
                if len(words_r & words_s) / max(len(words_r), 1) > 0.6:
                    is_dup = True
                    break
                    
            if not is_dup:
                seen_texts.add(text)
                unique_results.append(r)
                
            if len(unique_results) == top_k:
                break

        top = unique_results

        print(f"[RETRIEVAL] Query='{query[:60]}' -> {len(top)} chunks returned (from {len(target_ids)} docs)")
        return top

    def is_indexed(self, doc_id: int) -> bool:
        with self._lock:
            return doc_id in self._index

    def get_all_indexed_ids(self) -> list[int]:
        with self._lock:
            return list(self._index.keys())

    def remove_document(self, doc_id: int):
        with self._lock:
            self._index.pop(doc_id, None)
        print(f"[RETRIEVAL] Removed doc_id={doc_id} from index")


# Singleton — import this everywhere
retrieval_service = RetrievalService()
