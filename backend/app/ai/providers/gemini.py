from google import genai
from dotenv import load_dotenv
from app.schemas import CompleteExtractionPayload
from app.ai.base import AIProvider

import os
import json

load_dotenv()


class GeminiProvider(AIProvider):

    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

    async def analyze_media(
        self, file_path: str
    ) -> CompleteExtractionPayload:

        uploaded_file = self.client.files.upload(
            file=file_path
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                PROMPT,
                uploaded_file
            ]
        )

        data = json.loads(response.text)

        return CompleteExtractionPayload.model_validate(data)

    async def answer_question(self, question: str, context):

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                f"""
                Answer the question using ONLY the provided context.

                Question:
                {question}

                Context:
                {context}
                """
            ]
        )

        return response.text


PROMPT = """
You are RECALL, an episodic memory extraction system.

Analyze this recording and return ONLY valid JSON.

Extract:
- overall_audio_quality
- participants
- events
- decisions
- context_items
- unresolved_items
- transcript_chunks

Use timestamps in TOTAL SECONDS.

Do not invent information.
If something is not present in the recording, use an empty list
or appropriate null value.

Return JSON matching the CompleteExtractionPayload structure.
"""