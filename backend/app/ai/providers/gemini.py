async def analyze_media(file_path: str):
    return {
        "provider": "gemini",
        "file": file_path,
        "events": []
    }


async def answer_question(question: str, context):
    return {
        "provider": "gemini",
        "answer": f"Placeholder answer for: {question}",
        "evidence": []
    }

#temp code, rehan will replace later