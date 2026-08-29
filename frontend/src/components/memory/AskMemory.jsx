import { useState } from "react";
import { queryMemory } from "../../services/api";

export default function AskMemory({ memoryId, answer, onEvidenceClick }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(answer);
  const [loading, setLoading] = useState(false);

  async function ask(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    try {
      setResult(await queryMemory(memoryId, question.trim()));
    } catch {
      setResult({
        question: question.trim(),
        response: "The backend isn't connected yet. This is the demo memory response.",
        evidence: answer.evidence
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="ask-panel">
      <div className="panel-label"><span>ASK YOUR MEMORY</span><span className="ai-badge">AI</span></div>

      <form onSubmit={ask} className="ask-form">
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask what happened..." />
        <button aria-label="Ask">↗</button>
      </form>

      <div className="answer">
        <div className="answer-question">{result.question}</div>
        <p>{loading ? "Reconstructing memory..." : result.response}</p>
      </div>

      <div className="evidence-list">
        <div className="evidence-title">EVIDENCE</div>
        {result.evidence?.map(item => (
          <button className="evidence-row" key={item.time} onClick={() => onEvidenceClick?.(item)}>
            <time>{item.time}</time>
            <span><b>{item.title}</b><small>{item.quote}</small></span>
            <i>↗</i>
          </button>
        ))}
      </div>
    </aside>
  );
}