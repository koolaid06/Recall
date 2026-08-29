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