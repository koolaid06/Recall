import { useEffect, useMemo, useState } from "react";

const stages = [
{
id: "preprocessing",
label: "Reading recording",
},
{
id: "transcribing",
label: "Transcribing conversation",
},
{
id: "extracting_events",
label: "Extracting important moments",
},
{
id: "connecting_decisions",
label: "Connecting decisions",
},
{
id: "building_memory",
label: "Building memory",
},
];

function getStageIndex(stage) {
const normalized = String(stage || "")
.toLowerCase()
.replace(/[\s-]+/g, "_");

const index = stages.findIndex(
(item) => item.id === normalized
);

if (index !== -1) {
return index;
}

const aliases = {
reading: 0,
preprocessing: 0,


transcription: 1,
transcribing: 1,

events: 2,
extracting: 2,
extracting_events: 2,

decisions: 3,
connecting: 3,
connecting_decisions: 3,

memory: 4,
building: 4,
building_memory: 4,


};

return aliases[normalized] ?? 0;
}

export default function ProcessingState({
stage = "preprocessing",
}) {
const currentStage = useMemo(
() => getStageIndex(stage),
[stage]
);

const [displayStage, setDisplayStage] =
useState(currentStage);

useEffect(() => {
setDisplayStage(currentStage);
}, [currentStage]);

const progress =
((displayStage + 1) / stages.length) * 100;

return ( <section className="processing-card"> <div className="processing-topline"> <span>RECALL ENGINE</span>


    <span>
      {Math.round(progress)}% COMPLETE
    </span>
  </div>

  <div className="processing-header">
    <div className="processing-signal">
      <span />
      <span />
      <span />
    </div>

    <div>
      <p className="processing-hand">
        one moment...
      </p>

      <h2>
        Building your memory.
      </h2>
    </div>
  </div>

  <p className="processing-description">
    RECALL is tracing the recording,
    identifying important moments, and
    connecting them into something you can
    return to.
  </p>

  <div className="processing-progress">
    <span
      style={{
        width: `${progress}%`,
      }}
    />
  </div>

  <div className="processing-stages">
    {stages.map((item, index) => {
      const done =
        index < displayStage;

      const current =
        index === displayStage;

      return (
        <div
          className={`processing-stage ${
            done
              ? "done"
              : ""
          } ${
            current
              ? "current"
              : ""
          }`}
          key={item.id}
        >
          <span className="stage-number">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </span>

          <span className="stage-name">
            {item.label}
          </span>

          <span className="stage-status">
            {done
              ? "DONE"
              : current
                ? "WORKING"
                : "WAITING"}
          </span>
        </div>
      );
    })}
  </div>

  <div className="processing-current">
    <span className="processing-pulse" />

    <span>
      {stages[displayStage].label}
    </span>
  </div>
</section>


);
}
