from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.ai.factory import get_ai_provider
from app.services.retrieval_service import (
    retrieve_context,
    build_context,
)

router = APIRouter()


class AskRequest(BaseModel):
    question: str
    recording_id: Optional[str] = None


@router.post("/ask")
async def ask_question(request: AskRequest):

    # 1. Retrieve relevant transcript chunks
    rows = retrieve_context(
        request.question,
        request.recording_id
    )

    # 2. Turn retrieved rows into context text
    context = build_context(rows)

    # 3. Get AI provider
    ai_provider = get_ai_provider()

    # 4. Ask AI using retrieved transcript context
    result = await ai_provider.answer_question(
        request.question,
        context
    )

    # 5. Return answer + retrieved evidence
    return {
        "answer": result,
        "evidence": rows
    }