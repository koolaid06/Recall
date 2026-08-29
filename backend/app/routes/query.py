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

    rows = retrieve_context(
        request.question,
        request.recording_id
    )

    context = build_context(rows)

    ai_provider = get_ai_provider()

    result = await ai_provider.answer_question(
        request.question,
        context
    )

    return {
        "answer": result,
        "evidence": rows
    }