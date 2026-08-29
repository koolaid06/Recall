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
      const response = await queryMemory(
        memoryId,
        value
      );

      setResult({
        question: value,
        response: response.answer,
        evidence: normalizeEvidence(
          response.evidence
        ),
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to reconstruct an answer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="ask-panel">
      <div className="panel-label">
        <span>ASK YOUR MEMORY</span>
      </div>

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
          aria-label="Ask"
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
            ? "Reconstructing memory..."
            : result?.response ||
              "Ask a question about this recording."}
        </p>
      </div>

      {error && (
        <div className="ask-error">
          {error}
        </div>
      )}

      <div className="evidence-list">
        <div className="evidence-title">
          EVIDENCE
        </div>

        {result?.evidence?.length > 0 ? (
          result.evidence.map(
            (item, index) => (
              <button
                className="evidence-row"
                key={`${item.time}-${index}`}
                onClick={() =>
                  onEvidenceClick?.(item)
                }
              >
                <time>{item.time}</time>

                <span>
                  <b>{item.title}</b>

                  <small>
                    {item.quote}
                  </small>
                </span>

                <i>↗</i>
              </button>
            )
          )
        ) : (
          <div className="evidence-empty">
            Ask a question to find supporting moments.
          </div>
        )}
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
      time:
        item.time ||
        formatTime(seconds),
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