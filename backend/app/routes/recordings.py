import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.auth import get_current_user
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


async def process_recording_task(
    recording_id: str,
    raw_file_path: str,
    mime_type: str,
):
    """
    Background task for preprocessing,
    AI extraction and Supabase persistence.
    """

    processed_file_path = raw_file_path

    try:
        # Stage 1: Preprocessing
        supabase.table("recordings").update(
            {
                "progress_stage": "preprocessing"
            }
        ).eq("id", recording_id).execute()

        processed_file_path = await preprocess_media(
            raw_file_path,
            mime_type
        )

        # Extract original media duration
        duration = await get_duration(raw_file_path)

        # Stage 2: Gemini / AI analysis
        supabase.table("recordings").update(
            {
                "progress_stage": "analyzing"
            }
        ).eq("id", recording_id).execute()

        ai_provider = get_ai_provider()

        ai_result = await ai_provider.analyze_media(
            processed_file_path
        )

        # Stage 3: Save structured memory
        supabase.table("recordings").update(
            {
                "progress_stage": "saving"
            }
        ).eq("id", recording_id).execute()

        await save_extraction(
            recording_id,
            ai_result
        )

        # Stage 4: Completed
        supabase.table("recordings").update(
            {
                "duration_seconds": duration,
                "status": "completed",
                "progress_stage": "completed",
                "error_message": None,
            }
        ).eq("id", recording_id).execute()

    except Exception as e:

        supabase.table("recordings").update(
            {
                "status": "failed",
                "progress_stage": "failed",
                "error_message": str(e),
            }
        ).eq("id", recording_id).execute()

    finally:
        # Remove temporary media files
        for path in {raw_file_path, processed_file_path}:
            if path and os.path.exists(path):
                os.remove(path)


@router.post(
    "/upload",
    status_code=status.HTTP_202_ACCEPTED
)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):

    # 1. Validate media format
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type",
        )

    # 2. Ensure temporary upload directory exists
    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    # 3. Store uploaded media temporarily
    extension = os.path.splitext(
        file.filename or ""
    )[1]

    stored_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    raw_file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename
    )

    try:
        with open(
            raw_file_path,
            "wb"
        ) as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        file_size = os.path.getsize(
            raw_file_path
        )

        # 4. Create recording owned by authenticated user
        db_response = (
            supabase.table("recordings")
            .insert(
                {
                    "user_id": current_user.id,
                    "filename": file.filename,
                    "file_size_bytes": file_size,
                    "mime_type": file.content_type,
                    "status": "processing",
                    "progress_stage": "queued",
                }
            )
            .execute()
        )

        if not db_response.data:
            raise HTTPException(
                status_code=500,
                detail="Could not create recording",
            )

        recording = db_response.data[0]
        recording_id = recording["id"]

        # 5. Process media asynchronously
        background_tasks.add_task(
            process_recording_task,
            recording_id=recording_id,
            raw_file_path=raw_file_path,
            mime_type=file.content_type,
        )

        # 6. Respond immediately
        return {
            "recording_id": recording_id,
            "filename": file.filename,
            "status": "processing",
            "message": (
                "File upload received. "
                "Processing started in background."
            ),
        }

    except Exception:
        # If scheduling/DB creation fails before the
        # background task takes ownership of the file
        if os.path.exists(raw_file_path):
            os.remove(raw_file_path)

        raise


@router.get("/recordings/{recording_id}")
async def get_recording(
    recording_id: str,
    current_user=Depends(get_current_user),
):

    # Only retrieve a recording owned by this user
    recording = (
        supabase.table("recordings")
        .select("*")
        .eq("id", recording_id)
        .eq("user_id", current_user.id)
        .execute()
    )

    if not recording.data:
        raise HTTPException(
            status_code=404,
            detail="Recording not found",
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
        "recording": recording.data[0],
        "memory": (
            memory.data[0]
            if memory.data
            else None
        ),
        "transcripts": transcripts.data,
    }