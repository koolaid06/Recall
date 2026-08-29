export default function Timeline({ events, activeSeconds, onSelect }) {
  return (
    <section className="timeline-section">
      <div className="panel-label"><span>TIMELINE</span><span>{events.length} moments detected</span></div>
      <div className="timeline-track">
        <div className="timeline-line" />
        {events.map((event) => {
          const left = Math.min((event.seconds / 2901) * 100, 96);
          const active = Math.abs(activeSeconds - event.seconds) < 5;
          return (
            <button
              key={`${event.time}-${event.title}`}
              className={`timeline-point ${active ? "timeline-point--active" : ""}`}
              style={{ left: `${Math.max(left, 2)}%` }}
              onClick={() => onSelect(event)}
            >
              <span className="point-mark" />
              <span className="point-time">{event.time}</span>
              <span className="point-title">{event.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}