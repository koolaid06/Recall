import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DropZone from "../components/upload/DropZone";
import ProcessingState from "../components/upload/ProcessingState";

import { uploadRecording } from "../services/api";
import { useMemory } from "../context/MemoryContext";

export default function Upload() {
  const [processing, setProcessing] =
    useState(false);

  const navigate = useNavigate();

  const {
    file,
    setFile,
    setRecordingId,
  } = useMemory();

  async function start() {
    if (!file) return;

    setProcessing(true);

    try {
      const result =
        await uploadRecording(file);

      const id =
        result.recording_id;

      if (!id) {
        throw new Error(
          "Backend did not return recording_id"
        );
      }

      setRecordingId(id);

      navigate(`/memory/${id}`);

    } catch (err) {
      console.error(err);

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
                Give RECALL a conversation,
                meeting or recording. We'll
                reconstruct the moments that matter.
              </p>

            </div>

            <DropZone
              file={file}
              onFile={setFile}
            />

            <div className="upload-bottom">

              <button
                className={`button upload-button ${
                  file ? "ready" : ""
                }`}
                disabled={!file}
                onClick={start}
              >
                Build memory
                <span>↗</span>
              </button>

            </div>
          </>
        ) : (
          <ProcessingState />
        )}

      </main>

    </div>
  );
}