from app.ai.factory import get_ai_provider

async def analyze_recording(file_path: str):
    ai = get_ai_provider()
    return await ai.analyze_media(file_path)