from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.factory import get_ai_provider

router = APIRouter()


class AskRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(request: AskRequest):

    context = []

    ai_provider = get_ai_provider()

    result = await ai_provider.answer_question(
        request.question,
        context
    )

    return result