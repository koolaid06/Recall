from app.database.supabase import supabase


async def save_extraction(recording_id: str, result):

    # Save high-level memory
    memory_data = {
        "recording_id": recording_id,
        "overall_audio_quality": result.overall_audio_quality,
        "participants": [p.model_dump() for p in result.participants],
        "events": [e.model_dump() for e in result.events],
        "decisions": [d.model_dump() for d in result.decisions],
        "context_items": [c.model_dump() for c in result.context_items],
        "unresolved_items": [u.model_dump() for u in result.unresolved_items],
    }

    supabase.table("memories").insert(memory_data).execute()

    # Save transcript chunks
    transcript_rows = []

    for chunk in result.transcript_chunks:
        transcript_rows.append({
            "recording_id": recording_id,
            "start_time": chunk.start_time,
            "end_time": chunk.end_time,
            "speaker": chunk.speaker,
            "text": chunk.text,
            "is_inaudible": chunk.is_inaudible,
            "audio_quality_note": chunk.audio_quality_note,
        })

    if transcript_rows:
        supabase.table("transcripts").insert(transcript_rows).execute()

    return {
        "memory_saved": True,
        "transcript_chunks_saved": len(transcript_rows)
    }