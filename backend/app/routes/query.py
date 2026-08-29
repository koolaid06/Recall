from fastapi import APIRouter
from pydantic import BaseModel

from services.gemini import answer_question

router = APIRouter()


class AskRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(request: AskRequest):
    context = []

    result = await answer_question(
        request.question,
        context
    )

    return result