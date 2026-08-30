import os
import shutil
import uuid
from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile, status

from app.ai.factory import get_ai_provider
from app.database.supabase import supabase
from app.services.media_service import get_duration, preprocess_media
from app.services.memory_service import save_extraction

router = APIRouter()

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


async def process_recording_task(recording_id: str, raw_file_path: str, mime_type: str):
    """Background task handler for non-blocking media preprocessing and AI extraction."""
    processed_file_path = raw_file_path

    try:
        # 1. Run media preprocessing asynchronously
        processed_file_path = await preprocess_media(raw_file_path, mime_type)

        # 2. Extract media duration
        duration = await get_duration(raw_file_path)

        # 3. Analyze processed media with AI provider
        ai_provider = get_ai_provider()
        ai_result = await ai_provider.analyze_media(processed_file_path)

        # 4. Save extracted memories and transcript entries
        await save_extraction(recording_id, ai_result)

        # 5. Mark recording as completed in Supabase
        supabase.table("recordings").update(
            {
                "duration_seconds": duration,
                "status": "completed",
                "error_message": None,
            }
        ).eq("id", recording_id).execute()

    except Exception as e:
        # Update database with failure reason
        supabase.table("recordings").update(
            {"status": "failed", "error_message": str(e)}
        ).eq("id", recording_id).execute()

    finally:
        # Clean up temporary staging files from disk
        for path in set([raw_file_path, processed_file_path]):
            if path and os.path.exists(path):
                os.remove(path)


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_file(
    background_tasks: BackgroundTasks, file: UploadFile = File(...)
):
    # 1. Validate file format
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400, detail="Unsupported file type"
        )

    # 2. Ensure upload folder exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 3. Save payload to local temporary file
    extension = os.path.splitext(file.filename)[1]
    stored_filename = f"{uuid.uuid4()}{extension}"
    raw_file_path = os.path.join(UPLOAD_DIR, stored_filename)

    with open(raw_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(raw_file_path)

    # 4. Create record in Supabase with 'processing' status
    db_response = (
        supabase.table("recordings")
        .insert(
            {
                "filename": file.filename,
                "file_size_bytes": file_size,
                "mime_type": file.content_type,
                "status": "processing",
            }
        )
        .execute()
    )

    recording = db_response.data[0]
    recording_id = recording["id"]

    # 5. Schedule heavy background processing
    background_tasks.add_task(
        process_recording_task,
        recording_id=recording_id,
        raw_file_path=raw_file_path,
        mime_type=file.content_type,
    )

    # 6. Return response immediately (HTTP 202)
    return {
        "recording_id": recording_id,
        "filename": file.filename,
        "status": "processing",
        "message": "File upload received. Processing started in background.",
    }


@router.get("/recordings/{recording_id}")
async def get_recording(recording_id: str):

    recording = (
        supabase.table("recordings")
        .select("*")
        .eq("id", recording_id)
        .execute()
    )

    memory = (
        supabase.table("memories")
        .select("*")
        .eq("recording_id", recording_id)
        .execute()
    )

    transcripts = (
        supabase.table("transcripts")
        .select("*")
        .eq("recording_id", recording_id)
        .order("start_time")
        .execute()
    )

    return {
        "recording": recording.data[0] if recording.data else None,
        "memory": memory.data[0] if memory.data else None,
        "transcripts": transcripts.data,
    }
    
async def process_recording_task(
    recording_id: str, raw_file_path: str, mime_type: str
):
    processed_file_path = raw_file_path
    try:
        # Stage 1: Preprocessing
        supabase.table("recordings").update(
            {"progress_stage": "preprocessing"}
        ).eq("id", recording_id).execute()
        processed_file_path = await preprocess_media(raw_file_path, mime_type)

        # Stage 2: Gemini Analysis
        supabase.table("recordings").update(
            {"progress_stage": "analyzing"}
        ).eq("id", recording_id).execute()
        ai_provider = get_ai_provider()
        ai_result = await ai_provider.analyze_media(processed_file_path)

        # Stage 3: Saving to Supabase
        supabase.table("recordings").update(
            {"progress_stage": "saving"}
        ).eq("id", recording_id).execute()
        await save_extraction(recording_id, ai_result)

        # Stage 4: Done
        supabase.table("recordings").update(
            {"status": "completed", "progress_stage": "completed"}
        ).eq("id", recording_id).execute()

    except Exception as e:
        supabase.table("recordings").update(
            {"status": "failed", "error_message": str(e)}
        ).eq("id", recording_id).execute()
    finally:
        for path in set([raw_file_path, processed_file_path]):
            if path and os.path.exists(path):
                os.remove(path)    