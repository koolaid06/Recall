import {
useEffect,
useRef,
useState,
} from "react";

export default function VideoPlayer({
src,
activeSeconds = 0,
onTimeChange,
}) {
const videoRef = useRef(null);

const [playing, setPlaying] = useState(false);
const [duration, setDuration] = useState(0);

useEffect(() => {
const video = videoRef.current;


if (!video || !src) return;

video.load();
setPlaying(false);


}, [src]);

useEffect(() => {
const video = videoRef.current;


if (!video) return;

if (
  Number.isFinite(activeSeconds) &&
  Math.abs(
    video.currentTime - activeSeconds
  ) > 1
) {
  video.currentTime = activeSeconds;
}


}, [activeSeconds]);

async function toggle() {
const video = videoRef.current;


if (!video || !src) return;

if (video.paused) {
  try {
    await video.play();
    setPlaying(true);
  } catch (err) {
    console.error(
      "Video playback failed:",
      err
    );
  }
} else {
  video.pause();
  setPlaying(false);
}


}

function seek(delta) {
const video = videoRef.current;


if (!video) return;

const next = Math.max(
  0,
  Math.min(
    video.duration || Infinity,
    video.currentTime + delta
  )
);

video.currentTime = next;

onTimeChange?.(next);


}

function handleTimeUpdate(e) {
onTimeChange?.(
e.currentTarget.currentTime
);
}

function handleLoadedMetadata(e) {
setDuration(
e.currentTarget.duration || 0
);
}

function handleEnded() {
setPlaying(false);
}

const progress =
duration > 0
? Math.min(
(activeSeconds / duration) * 100,
100
)
: 0;

return ( <div className="video-shell">
<video
ref={videoRef}
className="video-element"
src={src || undefined}
onTimeUpdate={handleTimeUpdate}
onLoadedMetadata={handleLoadedMetadata}
onEnded={handleEnded}
playsInline
/>


  {!src && (
    <div className="video-placeholder">
      <div className="video-grid" />

      <div className="video-brandmark">
        <span />
        RECORDING
      </div>

      <div className="video-time">
        {formatTime(activeSeconds)}
      </div>
    </div>
  )}

  <div className="video-overlay">
    <button
      type="button"
      className="play-button"
      onClick={toggle}
      aria-label={
        playing ? "Pause" : "Play"
      }
      disabled={!src}
    >
      {playing ? "Ⅱ" : "▶"}
    </button>

    <div className="video-progress">
      <span
        style={{
          width: `${progress}%`,
        }}
      />
    </div>

    <button
      type="button"
      className="time-button"
      onClick={() => seek(-10)}
      aria-label="Back 10 seconds"
      disabled={!src}
    >
      −10
    </button>

    <button
      type="button"
      className="time-button"
      onClick={() => seek(10)}
      aria-label="Forward 10 seconds"
      disabled={!src}
    >
      +10
    </button>

    <span className="duration">
      {formatTime(duration)}
    </span>
  </div>
</div>


);
}

function formatTime(total) {
const seconds = Math.floor(
Number(total) || 0
);

const minutes = Math.floor(seconds / 60);
const secs = seconds % 60;

return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}
