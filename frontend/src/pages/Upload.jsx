import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DropZone from "../components/upload/DropZone";
import ProcessingState from "../components/upload/ProcessingState";
import { uploadRecording } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  async function start() {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await uploadRecording(file);
      navigate(`/memory/${result.id || "product-strategy"}`);
    } catch {
      setTimeout(() => navigate("/memory/product-strategy"), 1400);
    }
  }

  return (
    <div className="product-page upload-page">
      <Navbar product />
      <main className="upload-main">
        {!processing ? (
          <>
            <div className="upload-intro">
              <h1>Turn a recording<br /><em>into memory.</em></h1>
              <p>Give RECALL a conversation, meeting or recording. We'll reconstruct the moments that matter.</p>
            </div>
            <DropZone file={file} onFile={setFile} />
            <div className="upload-bottom">
              <button className={`button upload-button ${file ? "ready" : ""}`} disabled={!file} onClick={start}>
                Build memory <span>↗</span>
              </button>
            </div>
          </>
        ) : <ProcessingState />}
      </main>
    </div>
  );
}
