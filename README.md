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


Media files, `.env`, and `venv/` should not be committed.


```
