import { useEffect, useState } from "react";

export default function MemoryVideo({
  file,
  activeSeconds = 0,
  onTimeChange,
}) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setVideoUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);

    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file || !videoUrl) {
    return (
      <section className="memory-video-section">
        <div className="memory-video-empty">
          <span>RECORDING</span>
          <p>Original recording is unavailable.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="memory-video-section">
      <div className="memory-video-header">
        <div>
          <span className="panel-label">
            ORIGINAL RECORDING
          </span>

          <h2>{file.name}</h2>
        </div>

        <span className="memory-video-meta">
          {(file.size / 1024 / 1024).toFixed(1)} MB
        </span>
      </div>

      <div className="memory-video-frame">
        <video
          src={videoUrl}
          controls
          onTimeUpdate={(e) =>
            onTimeChange?.(
              e.currentTarget.currentTime
            )
          }
          onLoadedMetadata={(e) => {
            if (
              activeSeconds > 0 &&
              activeSeconds < e.currentTarget.duration
            ) {
              e.currentTarget.currentTime =
                activeSeconds;
            }
          }}
        />
      </div>
    </section>
  );
}