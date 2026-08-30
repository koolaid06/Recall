import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DropZone from "../components/upload/DropZone";
import ProcessingState from "../components/upload/ProcessingState";

import { uploadRecording, getRecording } from "../services/api";
import { useMemory } from "../context/MemoryContext";

export default function Upload() {
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState("preprocessing");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { file, setFile, setRecordingId } = useMemory();

  async function start() {
    if (!file) return;

    setProcessing(true);
    setStage("preprocessing");
    setErrorMsg("");

    try {
      // 1. Upload file to start background task
      const result = await uploadRecording(file);
      const id = result.recording_id;

      if (!id) {
        throw new Error("Backend did not return recording_id");
      }

      setRecordingId(id);

      // 2. Poll GET /recordings/{id} for live progress updates
      const POLL_INTERVAL_MS = 3000;
      let networkFailures = 0;

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

        try {
          const data = await getRecording(id);
          networkFailures = 0;

          const recording = data?.recording;
          const status = recording?.status;
          const currentStage = recording?.progress_stage;

          // Update active processing stage from backend
          if (currentStage) {
            setStage(currentStage);
          }

          if (status === "completed") {
            navigate(`/memory/${id}`);
            break;
          } else if (status === "failed") {
            throw new Error(
              recording?.error_message || "Media processing failed on the server."
            );
          }
        } catch (pollErr) {
          // If the error comes from server-side processing failure, bubble it up
          if (
            pollErr.message &&
            !pollErr.message.includes("fetch") &&
            !pollErr.message.includes("NetworkError")
          ) {
            throw pollErr;
          }

          // Allow up to 5 consecutive network glitches before stopping
          networkFailures++;
          if (networkFailures >= 5) {
            throw new Error(
              "Lost connection to backend server. Verify backend status in console."
            );
          }
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "An error occurred during upload.");
      setProcessing(false);
    }
  }

  return (
    <div className="product-page upload-page">
      <Navbar product />

      <main className="upload-main">
        {!processing ? (
          <>
            <div className="upload-intro">
              <h1>
                Turn a recording
                <br />
                <em>into memory.</em>
              </h1>

              <p>
                Give RECALL a conversation, meeting or recording. We'll
                reconstruct the moments that matter.
              </p>
            </div>

            {errorMsg && (
              <div style={{ color: "#ef4444", marginBottom: "1rem", fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <DropZone file={file} onFile={setFile} />

            <div className="upload-bottom">
              <button
                className={`button upload-button ${file ? "ready" : ""}`}
                disabled={!file}
                onClick={start}
              >
                Build memory
                <span>↗</span>
              </button>
            </div>
          </>
        ) : (
          <ProcessingState stage={stage} />
        )}
      </main>
    </div>
  );
}