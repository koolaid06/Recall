export default function EventList({
items = [],
variant = "",
}) {
if (!items.length) {
return ( <div className="event-empty">
Nothing was found here. </div>
);
}

return (
<section className={`event-list ${variant}`}> <div className="event-items">
{items.map((item, index) => (
<article
className="event-item"
key={`${item.time}-${item.title}-${index}`}
> <time>{item.time}</time>


        <div className="event-copy">
          <b>{item.title}</b>

          {(item.reason || item.detail) && (
            <span>
              {item.reason || item.detail}
            </span>
          )}
        </div>

        <i>↗</i>
      </article>
    ))}
  </div>
</section>


);
}
