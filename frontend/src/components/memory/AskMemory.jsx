import { useState } from "react";
import { queryMemory } from "../../services/api";

export default function AskMemory({
memoryId,
onEvidenceClick,
}) {
const [question, setQuestion] = useState("");
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function ask(e) {
e.preventDefault();


const value = question.trim();

if (!value || loading) return;

setLoading(true);
setError("");

try {
  const response = await queryMemory(memoryId, value);

  setResult({
    question: value,
    response: response.answer,
    evidence: normalizeEvidence(response.evidence),
  });
} catch (err) {
  setError(
    err.message || "Unable to reconstruct an answer."
  );
} finally {
  setLoading(false);
}


}

return ( <aside className="ask-panel"> 
{/* <div className="ask-panel-header"> <span>ASK RECALL</span> <span>TRACE THE ANSWER</span> </div> */}


  <div className="ask-panel-body">
    <p className="ask-hand">
      what do you want to know?
    </p>

    <form
      onSubmit={ask}
      className="ask-form"
    >
      <input
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        placeholder="Ask what happened..."
        disabled={loading}
      />

      <button
        type="submit"
        aria-label="Ask RECALL"
        disabled={loading || !question.trim()}
      >
        ↗
      </button>
    </form>

    <div className="answer">
      {result?.question && (
        <div className="answer-question">
          {result.question}
        </div>
      )}

      <p>
        {loading
          ? "Reconstructing the answer..."
          : result?.response ||
            "Ask something specific about this conversation."}
      </p>
    </div>

    {error && (
      <div className="ask-error">
        {error}
      </div>
    )}

    <div className="evidence-list">
      <div className="evidence-title">
        <span>EVIDENCE</span>

        {result?.evidence?.length > 0 && (
          <small>
            {result.evidence.length} FOUND
          </small>
        )}
      </div>

      {result?.evidence?.length > 0 ? (
        result.evidence.map((item, index) => (
          <button
            type="button"
            className="evidence-row"
            key={`${item.time}-${index}`}
            onClick={() =>
              onEvidenceClick?.(item)
            }
          >
            <time>{item.time}</time>

            <span className="evidence-copy">
              <b>{item.title}</b>

              {item.quote && (
                <small>{item.quote}</small>
              )}
            </span>

            <i>↗</i>
          </button>
        ))
      ) : (
        <div className="evidence-empty">
          Ask RECALL a question and the supporting
          moments will appear here.
        </div>
      )}
    </div>
  </div>
</aside>


);
}

function normalizeEvidence(evidence) {
if (!Array.isArray(evidence)) {
return [];
}

return evidence.map((item) => {
const seconds =
item.seconds ??
item.start_time ??
parseTime(item.time);


return {
  ...item,
  seconds,
  time: item.time || formatTime(seconds),
  title:
    item.title ||
    item.name ||
    "Supporting evidence",
  quote:
    item.quote ||
    item.text ||
    "",
};


});
}

function parseTime(value) {
if (typeof value === "number") {
return value;
}

if (!value || typeof value !== "string") {
return 0;
}

const parts = value.split(":").map(Number);

if (parts.length === 2) {
return parts[0] * 60 + parts[1];
}

if (parts.length === 3) {
return (
parts[0] * 3600 +
parts[1] * 60 +
parts[2]
);
}

return 0;
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
