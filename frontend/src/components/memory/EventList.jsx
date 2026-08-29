export default function EventList({ title, items, variant = "" }) {
  return (
    <section className={`event-list ${variant}`}>
      <div className="panel-label"><span>{title}</span><span>{items.length}</span></div>
      <div className="event-items">
        {items.map(item => (
          <div className="event-item" key={`${item.time}-${item.title}`}>
            <time>{item.time}</time>
            <div>
              <b>{item.title}</b>
              {item.reason && <span>{item.reason}</span>}
              {item.detail && <span>{item.detail}</span>}
            </div>
            <i>↗</i>
          </div>
        ))}
      </div>
    </section>
  );
}
