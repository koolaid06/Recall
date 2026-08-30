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
            <header className="upload-hero">

              {/* <div className="upload-topline">
                <span>FIELD NOTES / NEW MEMORY</span>
                <span>RECORD → REMEMBER</span>
              </div> */}

              <div className="upload-heading">
                <p className="upload-kicker">
                  start somewhere
                </p>
                <br></br>
                <h1>
                  Give RECALL
                  <br />
                  <em>something to remember.</em>
                </h1>

                <p>
                  Drop in a conversation, meeting or recording.
                  RECALL will reconstruct the moments that matter.
                </p>
              </div>

            </header>


            {errorMsg && (
              <div className="upload-error" role="alert">
                <span>ERROR</span>
                <p>{errorMsg}</p>
              </div>
            )}


            <section className="upload-workspace">
{/* 
              <div className="upload-section-label">
                <span>01</span>
                <div />
                <span>ORIGINAL RECORDING</span>
              </div> */}

              <DropZone
                file={file}
                onFile={setFile}
              />

              <div className="upload-actions">

                <div className="upload-note">
                  <span>NOTE</span>
                  <p>
                    Your recording stays available in this
                    session while RECALL builds the memory.
                  </p>
                </div>

                <button
                  type="button"
                  className={`upload-button ${
                    file ? "ready" : ""
                  }`}
                  disabled={!file}
                  onClick={start}
                >
                  <span>
                    {file
                      ? "Build memory"
                      : "Choose a recording"}
                  </span>

                  <strong>↗</strong>
                </button>

              </div>

            </section>

            <footer className="upload-footer">
              <span>RECALL / NEW MEMORY</span>
            </footer>
          </>
        ) : (
          <section className="processing-page">
            <div className="processing-content">
              <p className="upload-kicker">
                stay with it
              </p>
              <br></br>
              <h1>
                Reconstructing
                <br />
                <em>your memory.</em>
              </h1>

              <p>
                RECALL is working through the recording,
                finding the moments, decisions and open threads.
              </p>

              <ProcessingState stage={stage} />
            </div>
          </section>
        )}

      </main>
    </div>
  );
}