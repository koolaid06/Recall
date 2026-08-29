const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadRecording(file) {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${API_BASE}/recordings`, {
    method: "POST",
    body,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
}

export async function queryMemory(memoryId, question) {
  const response = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memory_id: memoryId, question }),
  });

  if (!response.ok) throw new Error("Query failed");
  return response.json();
}
