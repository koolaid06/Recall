from fastapi import APIRouter, UploadFile, File
import os
import shutil

from services.gemini import analyze_media

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = await analyze_media(file_path)

    return result