from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth import get_current_user
from app.ai.factory import get_ai_provider
from app.database.supabase import supabase
from app.services.retrieval_service import (
    retrieve_context,
    build_context,
)

router = APIRouter()


class AskRequest(BaseModel):
    question: str
    recording_id: str


@router.post("/ask")
async def ask_question(
    request: AskRequest,
    current_user=Depends(get_current_user),
):

    # 1. Make sure this recording belongs to the logged-in user
    recording = (
        supabase.table("recordings")
        .select("id")
        .eq("id", request.recording_id)
        .eq("user_id", current_user.id)
        .execute()
    )

    if not recording.data:
        raise HTTPException(
            status_code=404,
            detail="Recording not found",
        )

    # 2. Retrieve transcript evidence only from this recording
    rows = retrieve_context(
        request.question,
        request.recording_id
    )
    print("RETRIEVED ROWS:", rows)

    context = build_context(rows)

    print("BUILT CONTEXT:", context)

    # 3. Build context for AI
    context = build_context(rows)

    # 4. Ask AI
    ai_provider = get_ai_provider()

    result = await ai_provider.answer_question(
        request.question,
        context
    )

    # 5. Return answer + supporting evidence
    return {
        "answer": result,
        "evidence": rows
    }