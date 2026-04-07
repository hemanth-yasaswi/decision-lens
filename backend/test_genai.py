import asyncio
from google import genai
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

async def test():
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    response = await client.aio.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello",
        config={"response_mime_type": "application/json"}
    )
    print("Success:", response.text)

asyncio.run(test())
