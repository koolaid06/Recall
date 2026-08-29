const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export async function uploadRecording(file) {
  const body = new FormData();

  body.append("file", file);

  const response = await fetch(
    `${API_BASE}/upload`,
    {
      method: "POST",
      body,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Upload failed");
  }

  return response.json();
}

export async function getRecording(recordingId) {
  const response = await fetch(
    `${API_BASE}/recordings/${recordingId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load recording");
  }

  return response.json();
}

export async function queryMemory(
  recordingId,
  question
) {
  const response = await fetch(
    `${API_BASE}/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recording_id: recordingId,
        question,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Query failed");
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(
    `${API_BASE}/health`
  );

  if (!response.ok) {
    throw new Error("Backend unavailable");
  }

  return response.json();
}