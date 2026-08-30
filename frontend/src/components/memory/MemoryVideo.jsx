import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

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
return ( <section className="memory-video-section"> <div className="memory-video-empty"> <span>RECORDING / UNAVAILABLE</span>

```
      <h3>
        The original isn't here.
      </h3>

      <p>
        This memory can still be explored, but the
        original recording is no longer available in
        this browser session.
      </p>
    </div>
  </section>
);

}

return ( <section className="memory-video-section"> <div className="memory-video-meta-row"> <span>{file.name}</span>

    <span>
      {(file.size / 1024 / 1024).toFixed(1)} MB
    </span>
  </div>

  <div className="memory-video-frame">
    <VideoPlayer
      src={videoUrl}
      activeSeconds={activeSeconds}
      onTimeChange={onTimeChange}
    />
  </div>
</section>

);
}
