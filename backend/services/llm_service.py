import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"
OLLAMA_TIMEOUT = 120  # seconds


def call_llama(prompt: str) -> str:
    """
    Call the local Ollama Llama3 model.
    Returns the response text, or raises an exception with a clear message.
    """
    print("[LLM] Sending request to Ollama")

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=OLLAMA_TIMEOUT,
        )
        print("[LLM] Response received")
        
        if response.status_code != 200:
            print("LLM ERROR:", response.text)
            return "Error: Unable to generate response"
            
        answer = response.json().get("response", "")
        return answer
        
    except Exception as e:
        print("LLM ERROR:", str(e))
        return "Error: Unable to generate response"


def build_reasoning_prompt(query: str, context: str) -> str:
    """
    Build the prompt sent to Llama3.
    Context is pre-retrieved chunks — never the full document.
    """
    return f"""You are a helpful document analysis assistant.

You have been given relevant excerpts from a document. Use them to answer
the user's question clearly and accurately.

DOCUMENT EXCERPTS:
{context}

USER QUESTION:
{query}

INSTRUCTIONS:
- Base your answer primarily on the document excerpts above.
- If the excerpts do not fully answer the question, use general knowledge
  to supplement, but clearly indicate when you are doing so.
- Be concise. Do not repeat the question. Do not say "based on the context".
- Do not hallucinate facts that are not in the excerpts or common knowledge.
- Answer in plain prose. No bullet points unless the question asks for a list.

ANSWER:"""
