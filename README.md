# RECALL

RECALL is a multimodal memory system that processes uploaded video/audio into structured memories, transcript chunks, and searchable evidence.

## Project Structure

```text
Recall/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   │   ├── recordings.py
│   │   │   └── query.py
│   │   ├── services/
│   │   │   ├── memory_service.py
│   │   │   └── retrieval_service.py
│   │   ├── ai/
│   │   │   ├── factory.py
│   │   │   └── providers/
│   │   │       ├── gemini.py
│   │   │       └── reka.py
│   │   └── database/
│   │       └── supabase.py
│   ├── uploads/
│   ├── requirements.txt
│   └── .env
├── frontend/
├── .gitignore
└── README.md
```

---

## Backend Flow

```text
Upload video/audio
        ↓
POST /upload
        ↓
Save media locally
        ↓
Create recording in Supabase
        ↓
AI processes recording
        ↓
Save memory + transcript chunks
        ↓
status = completed
```

### Question Answering

```text
Question + recording_id
        ↓
POST /ask
        ↓
Retrieve relevant transcript chunks
        ↓
Send context to AI
        ↓
Return answer + evidence
```

---

## Supabase Tables

### `recordings`

Stores recording metadata.

```text
id
filename
file_size_bytes
mime_type
duration_seconds
status
error_message
created_at
```

### `memories`

Stores structured information extracted from the recording.

```text
recording_id
participants
events
decisions
context_items
unresolved_items
overall_audio_quality
```

### `transcripts`

Stores timestamped transcript chunks.

```text
recording_id
start_time
end_time
speaker
text
is_inaudible
audio_quality_note
embedding
```

---

## Backend Setup

From the project root:

```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
SUPABASE_URL=
SUPABASE_KEY=

GEMINI_API_KEY=
REKA_API_KEY=

AI_PROVIDER=gemini
```

Do not commit `.env`.

---

## FFmpeg

FFmpeg is used for media duration extraction.

### macOS

```bash
brew install ffmpeg
```

Make sure FFmpeg is available in your system PATH.

---

## Run Backend

From the `backend/` folder:

```bash
source venv/bin/activate
uvicorn app.main:app --reload
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Main Backend Endpoints

```text
POST /upload
POST /ask
GET  /recordings/{recording_id}
GET  /health
```

---

## Main Backend Dependencies

```text
fastapi
uvicorn
python-multipart
python-dotenv
supabase
google-genai
pydantic
```

---

## Local Development

Uploaded media is stored locally in:

```text
backend/uploads/
```

The following should not be committed:

```text
backend/uploads/
.env
venv/
```

---

# Frontend

The RECALL frontend is a React-based web application that provides the interface for uploading recordings, viewing reconstructed memories, exploring transcript evidence, and asking questions about recordings.

The frontend is built with React and Vite.

---

## Frontend Flow

```text
User opens RECALL
        ↓
Home page
        ↓
Upload recording
        ↓
POST /upload
        ↓
Receive recording_id
        ↓
Processing status
        ↓
Recording / Memory view
        ↓
Structured memory + transcript
        ↓
Ask a question
        ↓
POST /ask
        ↓
Answer + timestamped evidence
```

---

## Main Frontend Pages

### Home

The landing page introduces RECALL and its core concept of reconstructing recordings into searchable memory.

The page includes:

- Product introduction
- Memory reconstruction concept
- Temporal memory visualization
- Evidence demonstration
- Navigation to upload a new recording

The homepage uses scroll-driven storytelling to visually communicate the difference between a conventional transcript and reconstructed memory.

---

### Upload

Allows the user to select and upload a video or audio recording.

```text
Select video/audio
        ↓
Upload to backend
        ↓
Receive recording_id
        ↓
Track processing
```

The frontend communicates with the backend through the `/upload` endpoint.

---

### Processing

Displays the processing state while the backend analyzes the recording.

The frontend uses the recording status to determine when processing is complete or has failed.

```text
processing
    ↓
completed
    ↓
Memory view
```

---

### Recordings

Displays available recordings and their processing status.

Users can select a recording to view its reconstructed memory and transcript.

---

### Memory

Displays the information extracted from a recording, including:

- Participants
- Events
- Decisions
- Context
- Unresolved items
- Transcript chunks
- Timestamped evidence

The memory interface is designed around the idea that a recording should become queryable context rather than simply a transcript.

---

## Question Answering

The memory view provides a question interface for a selected recording.

```text
User enters question
        ↓
POST /ask
        ↓
recording_id + question
        ↓
Backend retrieves relevant transcript chunks
        ↓
AI generates answer
        ↓
Frontend displays answer
        ↓
Evidence + timestamps
```

Answers are presented alongside their supporting evidence so users can trace an answer back to the original recording.

---

## Frontend API

The frontend communicates with the FastAPI backend through:

```text
POST /upload
POST /ask
GET  /recordings/{recording_id}
GET  /health
```

The frontend should use the configured backend URL rather than hardcoding environment-specific addresses.

---

## Frontend Setup

From the `frontend/` folder:

```bash
cd frontend

npm install
npm run dev
```

The Vite development server will display the local frontend URL in the terminal.

---

## Frontend Environment

If an environment file is required, create:

```text
frontend/.env
```

Configure the backend API URL used by the application.

For example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Do not commit environment files containing private configuration.

---

## Frontend Design Philosophy

RECALL's interface combines:

```text
Apple product storytelling
        +
Linear-style precision
        +
Spatial / temporal data visualization
```

The visual system emphasizes:

- Large editorial typography
- Dark atmospheric backgrounds
- Subtle blue and indigo accents
- Temporal vectors
- Memory nodes
- Timestamp relationships
- Scroll-driven storytelling
- Minimal UI
- Evidence-first presentation

The interface is intentionally restrained rather than relying on excessive animations, decorative cards, gradients, or generic dashboard patterns.

---

## Scroll-Driven Experience

The homepage uses a continuous, Apple-inspired scroll experience.

As the user scrolls, the visual environment gradually changes rather than having independent elements animate randomly.

```text
"Turn moments into memory."
        ↓
Atmospheric depth and subtle movement

"Your recordings remember nothing. RECALL does."
        ↓
Background vectors begin connecting

"This is memory, not a transcript."
        ↓
Memory interface becomes the focal point

"No answer without a source."
        ↓
Visual noise settles and evidence becomes clear

"Remember."
        ↓
Experience simplifies into a final focused CTA
```

The goal is to make the interface itself demonstrate RECALL's core concept:

> A recording should not remain a passive transcript. It should become connected, searchable memory.

---

## Core Product Concept

RECALL is designed to go beyond simply transcribing audio or video.

A conventional transcription system primarily answers:

```text
"What was said?"
```

RECALL is designed to answer:

```text
"What happened?"
"Who was involved?"
"What changed?"
"Why did it change?"
"What was decided?"
"What remains unresolved?"
"Where is the evidence?"
```

The system combines structured memory, timestamped transcript chunks, retrieval, and evidence-backed question answering to reconstruct the context contained within a recording.

---

## Key Differentiator

RECALL does not treat a recording as a long block of text.

Instead, it transforms the recording into a structured memory containing:

```text
People
   ↓
Events
   ↓
Decisions
   ↓
Context
   ↓
Unresolved items
   ↓
Timestamped evidence
```

This allows users to move from a question directly to the relevant moment in the original recording.

---

## Development Notes

Keep the frontend and backend independently configurable.

The backend is responsible for:

- Media processing
- AI analysis
- Memory extraction
- Transcript generation
- Retrieval
- Question answering
- Evidence generation
- Database persistence

The frontend is responsible for:

- User interaction
- Uploading recordings
- Processing state
- Memory visualization
- Transcript exploration
- Question answering UI
- Evidence presentation
- Navigation and storytelling
