from fastapi import APIRouter, UploadFile, File
import os
import shutil

from app.database.supabase import supabase
from app.ai.factory import get_ai_provider
from app.services.memory_service import save_extraction

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # 1. Save file locally
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Get file size
    file_size = os.path.getsize(file_path)

    # 3. Insert recording metadata into Supabase
    db_response = (
        supabase
        .table("recordings")
        .insert({
            "filename": file.filename,
            "file_size_bytes": file_size,
            "mime_type": file.content_type or "application/octet-stream",
            "status": "processing"
        })
        .execute()
    )

    recording = db_response.data[0]
    recording_id = recording["id"]

    try:
        # 4. Get the currently selected AI provider
        ai_provider = get_ai_provider()

        # 5. Process the recording with Gemini
        ai_result = await ai_provider.analyze_media(file_path)

        # 6. Save extracted memories and transcript
        await save_extraction(recording_id, ai_result)

        # 7. Mark recording as completed
        supabase.table("recordings").update({
            "status": "completed"
        }).eq("id", recording_id).execute()

        # 8. Return result
        return {
            "recording_id": recording_id,
            "filename": file.filename,
            "status": "completed",
            "ai_result": ai_result
        }

    except Exception as e:

        # 9. Mark recording as failed
        supabase.table("recordings").update({
            "status": "failed",
            "error_message": str(e)
        }).eq("id", recording_id).execute()

        raise