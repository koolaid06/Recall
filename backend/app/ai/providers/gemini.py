import asyncio
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas import CompleteExtractionPayload
from app.ai.base import AIProvider

load_dotenv()

PROMPT = """
You are RECALL, an episodic memory extraction system.

Analyze this recording and extract all structured details:
- overall_audio_quality
- participants
- events
- decisions
- context_items
- unresolved_items
- transcript_chunks

Use timestamps in TOTAL SECONDS.
Do not invent information. If an element is absent, return an empty list or appropriate null value.
"""


class GeminiProvider(AIProvider):

    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    async def analyze_media(self, file_path: str) -> CompleteExtractionPayload:

        # 1. Upload media file to Gemini Files API
        uploaded_file = self.client.files.upload(file=file_path)

        # 2. Wait for audio/video file processing to complete (Non-blocking async wait)
        while uploaded_file.state.name == "PROCESSING":
            await asyncio.sleep(2)
            uploaded_file = self.client.files.get(name=uploaded_file.name)

        if uploaded_file.state.name == "FAILED":
            raise RuntimeError(
                "Gemini media file processing failed on the server."
            )

        # 3. Generate structured content matching CompleteExtractionPayload schema
        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[uploaded_file, PROMPT],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CompleteExtractionPayload,
            ),
        )

        # 4. Return parsed Pydantic object
        if response.parsed:
            return response.parsed

        return CompleteExtractionPayload.model_validate_json(response.text)

    async def answer_question(self, question: str, context) -> str:
        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                f"""
                Answer the question using ONLY the provided context.

                Question:
                {question}

                Context:
                {context}
                """
            ],
        )
        return response.text