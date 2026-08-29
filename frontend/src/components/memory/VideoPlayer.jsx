import { useRef, useState } from "react";

export default function VideoPlayer({ activeSeconds = 0, onTimeChange }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      try { await videoRef.current.play(); } catch {}
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const seek = (delta) => {
    const next = Math.max(0, activeSeconds + delta);
    if (videoRef.current) videoRef.current.currentTime = next;
    onTimeChange?.(next);
  };

  return (
    <div className="video-shell">
      <video
        ref={videoRef}
        className="video-element"
        onTimeUpdate={(e) => onTimeChange?.(e.currentTarget.currentTime)}
      />
      <div className="video-placeholder">
        <div className="video-grid" />
        <div className="video-brandmark"><span /> RECORDING</div>
        <div className="video-time">{formatTime(activeSeconds)}</div>
      </div>
      <div className="video-overlay">
        <button className="play-button" onClick={toggle}>{playing ? "Ⅱ" : "▶"}</button>
        <div className="video-progress"><span style={{ width: `${Math.min((activeSeconds / 2901) * 100, 100)}%` }} /></div>
        <button className="time-button" onClick={() => seek(-10)}>−10</button>
        <button className="time-button" onClick={() => seek(10)}>+10</button>
        <span className="duration">48:21</span>
      </div>
    </div>
  );
}

function formatTime(total) {
  const seconds = Math.floor(total || 0);
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
