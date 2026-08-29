import { useEffect, useState } from "react";

const stages = [
  "Reading recording",
  "Transcribing conversation",
  "Extracting events",
  "Connecting decisions",
  "Building memory graph",
];

export default function ProcessingState() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((current) => {
        if (current >= stages.length - 1) return current;
        return current + 1;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const progress = ((stage + 1) / stages.length) * 100;

  return (
    <div className="processing-card">
      <div className="processing-orb" />

      <div className="product-kicker">RECALL ENGINE</div>

      <h2>Building your memory.</h2>

      <p>
        RECALL is reconstructing the recording into events, decisions and
        evidence.
      </p>

      <div className="processing-progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="processing-stages">
        {stages.map((name, i) => {
          const done = i < stage;
          const current = i === stage;

          return (
            <div
              className={`processing-stage ${
                done ? "done" : ""
              } ${current ? "current" : ""}`}
              key={name}
            >
              <span className="stage-indicator">
                {done ? "✓" : current ? "•" : "○"}
              </span>

              <span>{name}</span>
            </div>
          );
        })}
      </div>

      <div className="processing-current">
        <span className="processing-pulse" />
        {stages[stage]}
      </div>
    </div>
  );
}