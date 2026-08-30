import { useRef } from "react";

export default function DropZone({ file, onFile }) {
const inputRef = useRef(null);

function choose(selectedFile) {
if (selectedFile) {
onFile(selectedFile);
}
}

function drop(e) {
e.preventDefault();
choose(e.dataTransfer.files?.[0]);
}

function openFilePicker() {
inputRef.current?.click();
}

function handleKeyDown(e) {
if (e.key === "Enter" || e.key === " ") {
e.preventDefault();
openFilePicker();
}
}

return (
<div
className={`drop-zone ${
        file ? "drop-zone--selected" : ""
      }`}
onDragOver={(e) => e.preventDefault()}
onDrop={drop}
onClick={openFilePicker}
onKeyDown={handleKeyDown}
role="button"
tabIndex={0}
>
<input
ref={inputRef}
hidden
type="file"
accept="video/*,audio/*"
onChange={(e) =>
choose(e.target.files?.[0])
}
/>


  <div className="drop-zone-topline">
    <span>RECORDING</span>
    <span>
      {file ? "READY" : "INPUT REQUIRED"}
    </span>
  </div>

  <div className="drop-zone-main">
    <div className="upload-mark">
      <span>↑</span>
    </div>

    <div className="drop-copy">
      <div className="drop-title">
        {file
          ? file.name
          : "Drop the recording here."}
      </div>

      <div className="drop-subtitle">
        {file
          ? `${(
              file.size /
              1024 /
              1024
            ).toFixed(1)} MB · Ready to process`
          : "Drag a file here, or click anywhere to browse."}
      </div>
    </div>
  </div>

  <div className="drop-zone-footer">
    <span>
      {file
        ? file.type ||
          "MEDIA FILE"
        : "VIDEO"}
    </span>

    {!file && (
      <span>
        MP4 · MOV
      </span>
    )}

    {file && (
      <span className="file-ready">
        FILE ATTACHED
      </span>
    )}
  </div>
</div>


);
}
