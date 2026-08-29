import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MemoryHeader from "../components/MemoryHeader";
import VideoPlayer from "../components/memory/VideoPlayer";
import Timeline from "../components/memory/Timeline";
import AskMemory from "../components/memory/AskMemory";
import EventList from "../components/memory/EventList";
import { memory } from "../data/mockMemory";

export default function Memory() {
  const { id } = useParams();
  const [activeSeconds, setActiveSeconds] = useState(97);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const selectEvidence = item => {
    setActiveSeconds(item.seconds);
    setSelectedEvent(item);
  };

  const selectTimeline = event => {
    setActiveSeconds(event.seconds);
    setSelectedEvent(event);
  };

  return (
    <div className="product-page memory-page">
      <Navbar product />
      <main className="memory-main">
        <MemoryHeader memory={memory} />

        <div className="memory-workspace">
          <div className="media-column">
            <VideoPlayer activeSeconds={activeSeconds} onTimeChange={setActiveSeconds} />
            <Timeline events={memory.events} activeSeconds={activeSeconds} onSelect={selectTimeline} />
          </div>
          <AskMemory memoryId={id} answer={memory.answer} onEvidenceClick={selectEvidence} />
        </div>

        {selectedEvent && (
          <div className="selected-memory">
            <span>{selectedEvent.time}</span>
            <div><b>{selectedEvent.title}</b><p>{selectedEvent.detail || selectedEvent.quote}</p></div>
            <button onClick={() => setSelectedEvent(null)}>×</button>
          </div>
        )}

        <div className="memory-lower">
          <EventList title="EVENTS" items={memory.events.slice(0, 4)} />
          <EventList title="DECISIONS" items={memory.decisions} variant="decisions" />
          <EventList title="UNRESOLVED" items={memory.unresolved} variant="unresolved" />
        </div>
      </main>
    </div>
  );
}
