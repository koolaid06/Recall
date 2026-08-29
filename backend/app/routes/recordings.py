from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import subprocess
import uuid

from app.database.supabase import supabase
from app.ai.providers.gemini import analyze_media
from app.services.memory_service import save_extraction

router = APIRouter()


# Absolute uploads folder
UPLOAD_DIR = os.path.abspath("uploads")

ALLOWED_TYPES = {
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
}


def get_duration(file_path: str):
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                file_path,
            ],
            capture_output=True,
            text=True,
            check=True,
        )

        return float(result.stdout.strip())

    except Exception:
        return None


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # 1. Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    # 2. Make uploads directory
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 3. Give file a unique stored name
    extension = os.path.splitext(file.filename)[1]

    stored_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename
    )

    # 4. Save actual file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 5. Read metadata
    file_size = os.path.getsize(file_path)
    duration = get_duration(file_path)

    # 6. Create recording in Supabase
    db_response = (
        supabase
        .table("recordings")
        .insert({
            "filename": file.filename,
            "file_size_bytes": file_size,
            "mime_type": file.content_type,
            "duration_seconds": duration,
            "status": "processing"
        })
        .execute()
    )

    recording = db_response.data[0]
    recording_id = recording["id"]

    try:

        # 7. Hand file to processing layer
        ai_result = await analyze_media(file_path)

        # 8. Save memories + transcript chunks
        await save_extraction(
            recording_id,
            ai_result
        )

        # 9. Mark complete
        supabase.table("recordings").update({
            "status": "completed",
            "error_message": None
        }).eq(
            "id",
            recording_id
        ).execute()

        return {
            "recording_id": recording_id,
            "filename": file.filename,
            "duration_seconds": duration,
            "status": "completed",
            "ai_result": ai_result
        }

    except Exception as e:

        # 10. Record failure
        supabase.table("recordings").update({
            "status": "failed",
            "error_message": str(e)
        }).eq(
            "id",
            recording_id
        ).execute()

        raise