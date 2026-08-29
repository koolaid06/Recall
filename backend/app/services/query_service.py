from app.ai.factory import get_ai_provider

async def ask_memory(question: str, context):
    ai = get_ai_provider()
    return await ai.answer_question(question, context)