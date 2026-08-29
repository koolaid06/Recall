import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.recordings import router as recordings_router
from app.routes.query import router as query_router
from app.database.supabase import supabase
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health_check():
    try:
        supabase.table("recordings").select("id").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        db_status = f"unreachable ({str(e)})"

    upload_dir = os.path.abspath("uploads")
    storage_status = "ready" if os.path.exists(upload_dir) else "missing_upload_folder"

    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))

    overall_healthy = db_status == "connected" and gemini_key_present

    return {
        "status": "healthy" if overall_healthy else "degraded",
        "services": {
            "database": db_status,
            "storage_directory": storage_status,
            "gemini_api_configured": gemini_key_present
        }
    }
    
@app.get("/")
def home():
    return {"message": "RECALL backend is running!"}

@app.get("/test-db")
def test_db():
    response = supabase.table("recordings").select("*").execute()

    return {
        "status": "ok",
        "data": response.data
    }
app.include_router(query_router)
app.include_router(recordings_router)