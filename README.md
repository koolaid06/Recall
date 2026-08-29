# RECALL

RECALL is a multimodal memory system that processes uploaded video/audio into structured memories, transcript chunks, and searchable evidence.

## Backend Flow

text
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


Question answering:

text
Question + recording_id
↓
POST /ask
↓
Retrieve relevant transcript chunks
↓
Send context to AI
↓
Return answer + evidence


## Supabase Tables

### recordings

Stores recording metadata.

text
id
filename
file_size_bytes
mime_type
duration_seconds
status
error_message
created_at


### memories

Stores structured information extracted from the recording.

text
recording_id
participants
events
decisions
context_items
unresolved_items
overall_audio_quality


### transcripts

Stores timestamped transcript chunks.

text
recording_id
start_time
end_time
speaker
text
is_inaudible
audio_quality_note
embedding


## Backend Setup

bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt


Create `backend/.env`:

env
SUPABASE_URL=
SUPABASE_KEY=

GEMINI_API_KEY=
REKA_API_KEY=

AI_PROVIDER=gemini


Do not commit `.env`.

## FFmpeg

Used for media duration extraction.

macOS:

bash
brew install ffmpeg


## Run Backend

From the `backend/` folder:

bash
source venv/bin/activate
uvicorn app.main:app --reload


Swagger:

text
http://127.0.0.1:8000/docs


## Main Endpoints

text
POST /upload
POST /ask
GET  /recordings/{recording_id}
GET  /health


## Main Dependencies

text
fastapi
uvicorn
python-multipart
python-dotenv
supabase
google-genai
pydantic


## Local Development

Uploaded media is stored locally in:

text
backend/uploads/


Frontend

The RECALL frontend is a React-based web application that provides the user interface for uploading recordings, viewing processed memories, exploring transcript evidence, and asking questions about recordings.

Frontend Flow
User opens RECALL
        ↓
Home page
        ↓
Upload recording
        ↓
POST /upload
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
Frontend Structure
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── Processing.jsx
│   │   ├── Recordings.jsx
│   │   └── Memory.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│   └── recall-logo.svg
│
├── package.json
└── vite.config.js
Main Frontend Pages
Home

The landing page introduces RECALL and its core concept of reconstructing recordings into searchable memory.

It includes:

Product introduction
Memory reconstruction concept
Temporal memory visualization
Evidence demonstration
Navigation to upload a new recording
Upload

Allows the user to select and upload a video or audio recording.

Select video/audio
        ↓
Upload to backend
        ↓
Receive recording_id
        ↓
Track processing

The frontend communicates with the backend through the /upload endpoint.

Processing

Displays the processing state while the backend analyzes the recording.

The frontend uses the recording status to determine when processing is complete or has failed.

processing
    ↓
completed
    ↓
Memory view
Recordings

Displays available recordings and their processing status.

Users can select a recording to view its reconstructed memory and transcript.

Memory

Displays the information extracted from a recording, including:

Participants
Events
Decisions
Context
Unresolved items
Transcript chunks
Timestamped evidence
Question answering

The memory view is designed around the idea that a recording should become queryable context, rather than simply a transcript.

Question Answering Flow

The frontend provides a question interface for a selected recording.

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

Answers are presented alongside their supporting evidence so users can trace an answer back to the original recording.

Frontend API

The frontend communicates with the FastAPI backend through the following endpoints:

POST /upload
POST /ask
GET /recordings/{recording_id}
GET /health

The frontend should use the configured backend URL rather than hardcoding environment-specific addresses.

Frontend Setup

From the frontend/ folder:

npm install
npm run dev

The Vite development server will provide the local frontend URL in the terminal.

Frontend Environment

If an environment file is required, create:

frontend/.env

and configure the backend API URL used by the application.

Do not commit environment files containing private configuration.

Frontend Design Philosophy

RECALL's interface follows:

Apple product storytelling
        +
Linear-style precision
        +
Spatial / temporal data visualization

The visual system emphasizes:

Large editorial typography
Dark, atmospheric backgrounds
Subtle blue/indigo accents
Temporal vectors
Memory nodes
Timestamp relationships
Scroll-driven storytelling
Minimal UI
Evidence-first presentation

The goal is to visually communicate the distinction between a transcript and memory.

The central product idea is:

RECALL doesn't just tell you what was said. It helps you understand what happened, how it changed, and why it mattered.

```
