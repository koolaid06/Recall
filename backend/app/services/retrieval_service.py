from app.database.supabase import supabase


from typing import Optional

def retrieve_context(question: str, recording_id: Optional[str] = None):
    query = (
        supabase
        .table("transcripts")
        .select("recording_id,start_time,end_time,speaker,text")
    )

    if recording_id:
        query = query.eq("recording_id", recording_id)

    response = query.order("start_time").execute()

    rows = response.data or []

    # Simple MVP retrieval for now
    question_lower = question.lower()

    matched_rows = []

    for row in rows:
        speaker = (row.get("speaker") or "").lower()
        text = (row.get("text") or "").lower()

        # Match words from the question against speaker/text
        words = [
            word
            for word in question_lower.split()
            if len(word) > 2
        ]

        score = 0

        for word in words:
            if word in speaker:
                score += 2

            if word in text:
                score += 1

        if score > 0:
            matched_rows.append((score, row))

    # Best matches first
    matched_rows.sort(
        key=lambda item: item[0],
        reverse=True
    )

    # Only send top few chunks to AI
    selected_rows = [
        row for _, row in matched_rows[:5]
    ]

    return selected_rows

def build_context(rows):

    if not rows:
        return ""

    parts = []

    for row in rows:
        parts.append(
            f"[{row['start_time']}-{row['end_time']} seconds] "
            f"{row['speaker']}: {row['text']}"
        )

    return "\n".join(parts)