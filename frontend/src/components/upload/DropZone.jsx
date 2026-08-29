import { useRef } from "react";

export default function DropZone({ file, onFile }) {
  const inputRef = useRef(null);

  function choose(f) {
    if (f) onFile(f);
  }

  function drop(e) {
    e.preventDefault();
    choose(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      className={`drop-zone ${file ? "drop-zone--selected" : ""}`}
      onDragOver={e => e.preventDefault()}
      onDrop={drop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="video/*,audio/*"
        onChange={e => choose(e.target.files?.[0])}
      />
      <div className="upload-icon">↑</div>
      <div className="drop-title">{file ? file.name : "Drop your recording here"}</div>
      <div className="drop-subtitle">
        {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB · Ready to process` : "or click to browse your files"}
      </div>
      {!file && <div className="file-types">MP4 · MOV · MP3 · WAV · M4A</div>}
    </div>
  );
}
