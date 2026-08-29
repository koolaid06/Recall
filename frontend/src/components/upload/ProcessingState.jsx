const stages = [
  "Reading recording",
  "Transcribing conversation",
  "Extracting events",
  "Connecting decisions",
  "Building memory graph"
];

export default function ProcessingState({ stage = 3 }) {
  return (
    <div className="processing-card">
      <div className="processing-orb" />
      <div className="product-kicker">RECALL ENGINE</div>
      <h2>Building your memory.</h2>
      <p>RECALL is reconstructing the recording into events, decisions and evidence.</p>
      <div className="processing-progress"><span style={{ width: `${(stage / stages.length) * 100}%` }} /></div>
      <div className="processing-stages">
        {stages.map((name, i) => (
          <div className={`processing-stage ${i < stage ? "done" : ""} ${i === stage ? "current" : ""}`} key={name}>
            <span>{i < stage ? "✓" : i === stage ? "•" : "○"}</span>{name}
          </div>
        ))}
      </div>
    </div>
  );
}
