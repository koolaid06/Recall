
from app.database.supabase import supabase


def retrieve_context(question: str, recording_id: str):

    response = (
        supabase
        .table("transcripts")
        .select("recording_id,start_time,end_time,speaker,text")
        .eq("recording_id", recording_id)
        .order("start_time")
        .execute()
    )

    rows = response.data or []

    if not rows:
        return []

    question_lower = question.lower()

    words = [
        word
        for word in question_lower.split()
        if len(word) > 2
    ]

    matched_rows = []

    for row in rows:

        speaker = (row.get("speaker") or "").lower()
        text = (row.get("text") or "").lower()

        score = 0

        for word in words:

            if word in speaker:
                score += 2

            if word in text:
                score += 1

        if score > 0:
            matched_rows.append((score, row))

    # If we found keyword matches, use best matches
    if matched_rows:

        matched_rows.sort(
            key=lambda item: item[0],
            reverse=True
        )

        return [
            row
            for _, row in matched_rows[:5]
        ]

    # FALLBACK:
    # If no words match, still give Gemini transcript context
    return rows[:8]


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