export default function Timeline({
events = [],
activeSeconds = 0,
onSelect,
}) {
const maxSeconds = Math.max(
...events.map(
(event) => Number(event.seconds) || 0
),
1
);

return ( <section className="timeline-section"> <div className="timeline-header"> <span>TIMELINE</span>


    <span>
      {events.length} MOMENTS
    </span>
  </div>

  {events.length > 0 ? (
    <div className="timeline-track">
      <div className="timeline-line" />

      {events.map((event, index) => {
        const seconds =
          Number(event.seconds) || 0;

        const left =
          3 +
          (seconds / maxSeconds) * 94;

        const active =
          Math.abs(
            activeSeconds - seconds
          ) < 5;

        return (
          <button
            type="button"
            key={`${event.time}-${event.title}-${index}`}
            className={`timeline-point ${
              active
                ? "timeline-point--active"
                : ""
            }`}
            style={{
              left: `${Math.min(
                Math.max(left, 3),
                97
              )}%`,
            }}
            onClick={() => onSelect(event)}
          >
            <span className="point-mark" />

            <span className="point-time">
              {event.time}
            </span>

            <span className="point-title">
              {event.title}
            </span>
          </button>
        );
      })}
    </div>
  ) : (
    <div className="timeline-empty">
      No distinct moments were detected.
    </div>
  )}
</section>


);
}
