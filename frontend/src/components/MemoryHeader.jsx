export default function MemoryHeader({ memory }) {
  return (
    <div className="memory-header">
      <div>
        <h1>{memory.title}</h1>
        <div className="memory-meta">
          <span>{memory.date}</span><i />
          <span>{memory.duration}</span><i />
          <span>{memory.participants} participants</span>
        </div>
      </div>
    </div>
  );
}
