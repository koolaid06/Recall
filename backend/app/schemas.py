from pydantic import BaseModel, Field
from typing import List, Optional

class Participant(BaseModel):
    name: str = Field(..., description="Name, speaker ID, or identifier of participant")
    role: Optional[str] = Field(None, description="Role or title of the participant if mentioned or inferred")

class Event(BaseModel):
    title: str = Field(..., description="Short title of topic, milestone, or event discussed")
    description: str = Field(..., description="Detailed summary of what happened during this segment")
    timestamp_start: float = Field(..., description="Start time in total seconds from beginning of recording")
    timestamp_end: float = Field(..., description="End time in total seconds from beginning of recording")

class Decision(BaseModel):
    topic: str = Field(..., description="Topic or issue decided upon")
    decision: str = Field(..., description="Concrete outcome or decision reached")
    timestamp: float = Field(..., description="Approximate timestamp in seconds where the decision occurred")
    evidence_quote: str = Field(..., description="Exact quote or phrase supporting this decision")

class ContextItem(BaseModel):
    category: str = Field(..., description="Category (e.g., Technical Spec, Architecture, Scope, Budget)")
    details: str = Field(..., description="Background context or constraints discussed")
    timestamp: float = Field(..., description="Timestamp in seconds")

class UnresolvedItem(BaseModel):
    issue: str = Field(..., description="Open question, blocker, or pending task")
    assignee: Optional[str] = Field(None, description="Person assigned to resolve it, if mentioned")
    timestamp: float = Field(..., description="Timestamp in seconds")

class TranscriptChunk(BaseModel):
    start_time: float = Field(..., description="Start time in seconds")
    end_time: float = Field(..., description="End time in seconds")
    speaker: str = Field(..., description="Speaker name or 'Unidentified Speaker'")
    text: str = Field(..., description="Verbatim spoken text. Use '[inaudible]' or '[unclear]' for garbled segments")
    is_inaudible: bool = Field(
        default=False, 
        description="Set to true if audio in this segment is muffled, noisy, or unintelligible"
    )
    audio_quality_note: Optional[str] = Field(
        None, 
        description="Reason for extraction difficulty (e.g., 'Heavy background noise', 'Overlapping speakers')"
    )

class CompleteExtractionPayload(BaseModel):
    overall_audio_quality: str = Field(
        ..., description="Assessment of overall recording audio quality: 'clear', 'fair', 'poor', or 'unusable'"
    )
    participants: List[Participant] = Field(default_factory=list)
    events: List[Event] = Field(default_factory=list)
    decisions: List[Decision] = Field(default_factory=list)
    context_items: List[ContextItem] = Field(default_factory=list)
    unresolved_items: List[UnresolvedItem] = Field(default_factory=list)
    transcript_chunks: List[TranscriptChunk] = Field(default_factory=list)