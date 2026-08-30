import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import MemoryHeader from "../components/MemoryHeader";
import VideoPlayer from "../components/memory/VideoPlayer";
import Timeline from "../components/memory/Timeline";
import AskMemory from "../components/memory/AskMemory";
import EventList from "../components/memory/EventList";

import { getRecording } from "../services/api";
import { useMemory } from "../context/MemoryContext";

export default function Memory() {
  const { id } = useParams();

  const { file } = useMemory();

  const [data, setData] = useState(null);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [videoUrl, setVideoUrl] = useState(null);

  /*
   * Create a browser-local URL for the uploaded file.
   *
   * The backend can delete its temporary copy.
   * This browser copy remains available while the
   * File object exists in MemoryContext.
   */
  useEffect(() => {
    if (!file) {
      setVideoUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);

    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  /*
   * Load memory data from backend.
   */
  useEffect(() => {
    async function loadRecording() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getRecording(id);

        if (!result.recording) {
          throw new Error(
            "Recording not found"
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load this memory."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRecording();
    }
  }, [id]);

  function selectEvidence(item) {
    const seconds =
      item.seconds ??
      parseTime(item.time);

    setActiveSeconds(seconds);
    setSelectedEvent(item);
  }

  function selectTimeline(event) {
    setActiveSeconds(
      event.seconds || 0
    );

    setSelectedEvent(event);
  }

  if (loading) {
    return (
      <div className="product-page memory-page">
        <Navbar product />

        <main className="memory-main">
          <div className="memory-state">
            <span className="memory-state-label">RECALL ENGINE / 01</span>
            <h1>
              Reconstructing
              <br />
              <em>memory.</em>
            </h1>
            <p>Loading the recording, events and evidence.</p>

            <div className="state-line">
              <i />
            </div>
          </div>
        </main>
      </div>
    );
    }

    if (error) {
    return (
      <div className="product-page memory-page">
        <Navbar product />

        <main className="memory-main">
          <div className="memory-state memory-state-error">
            <span className="memory-state-label">RECALL ENGINE / ERROR</span>
            <h1>
              Memory
              <br />
              <em>unavailable.</em>
            </h1>
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
    }

    const recording = data.recording;
    const rawMemory = data.memory || {};
    const transcripts = data.transcripts || [];

    const memory = normalizeMemory(
    recording,
    rawMemory,
    transcripts
    );

    return (
    <div className="product-page memory-page">
      <Navbar product />

      <main className="memory-main">

        {/* =====================================================
            MEMORY HEADER
        ===================================================== */}

        <header className="memory-hero">
          <div className="memory-hero-top">
            <span>FIELD NOTES / MEMORY {memory.id}</span>
            <span>RECONSTRUCTED</span>
          </div>

          <div className="memory-hero-body">
            <div>
              <p className="memory-kicker">
                what happened here
              </p>

              <h2>{memory.title}</h2>

              <p className="memory-intro">
                A reconstructed view of the conversation —
                its moments, decisions, and what was left open.
              </p>
            </div>

            <div className="memory-facts">
              <div>
                <span>DATE</span>
                <strong>{memory.date}</strong>
              </div>

              <div>
                <span>DURATION</span>
                <strong>{memory.duration}</strong>
              </div>

              <div>
                <span>PEOPLE</span>
                <strong>{memory.participants}</strong>
              </div>
            </div>
          </div>
{/* 
          <div className="memory-hero-bottom">
            <span>01 / RECORDING</span>
            <span>THE ORIGINAL</span>
          </div> */}
        </header>


        {/* =====================================================
            RECORDING
        ===================================================== */}

        <section className="memory-recording">
          {/* <div className="section-label">
            <span>01</span>
            <div />
            <span>ORIGINAL CONVERSATION</span>
          </div> */}

          <div className="recording-heading">
            <h2>
              Start with
              <br />
              <em>what was said.</em>
            </h2>

            <span>{memory.duration}</span>
          </div>

          <div className="recording-frame">
            {videoUrl ? (
              <VideoPlayer
                src={videoUrl}
                activeSeconds={activeSeconds}
                onTimeChange={setActiveSeconds}
              />
            ) : (
              <div className="recording-empty">
                <span>RECORDING / 00</span>

                <h3>
                  Recording unavailable.
                </h3>

                <p>
                  The original recording is no longer
                  available in this browser session.
                </p>
              </div>
            )}
          </div>
        </section>


        {/* =====================================================
            THREAD
        ===================================================== */}

        <section className="memory-thread">
{/* 
          <div className="section-label">
            <span>02</span>
            <div />
            <span>THE THREAD</span>
          </div> */}

          <div className="thread-heading">
            <div>
              <p className="memory-kicker">
                follow the conversation
              </p>
              <br></br>
              <h2>
                Where the
                <br />
                <em>story moved.</em>
              </h2>
            </div>

            <p>
              Jump between the moments that changed the
              direction of the conversation.
            </p>
          </div>

          <div className="thread-layout">

            <div className="timeline-panel">
              {/* <div className="panel-heading">
                <span>TIMELINE</span>
                <span>
                  {memory.events.length} MOMENTS
                </span>
              </div> */}

              <Timeline
                events={memory.events}
                activeSeconds={activeSeconds}
                onSelect={selectTimeline}
              />
            </div>


            <div className="ask-panel">
              {/* <div className="panel-heading">
                <span>ASK RECALL</span>
                <span>TRACE AN ANSWER</span>
              </div> */}

              <div className="ask-panel-inner">
                <p className="ask-hand">
                  ask what you remember
                </p>

                <AskMemory
                  memoryId={id}
                  onEvidenceClick={selectEvidence}
                />
              </div>
            </div>

          </div>
        </section>


        {/* =====================================================
            SELECTED MOMENT
        ===================================================== */}

        {selectedEvent && (
          <section className="memory-evidence">
            <div className="section-label">
              <span>03</span>
              <div />
              <span>SELECTED EVIDENCE</span>
            </div>

            <div className="evidence-strip">

              <div className="evidence-time">
                <span>TIME</span>
                <strong>
                  {selectedEvent.time ||
                    formatTime(selectedEvent.seconds)}
                </strong>
              </div>

              <div className="evidence-content">
                <p className="memory-kicker">
                  moment in the recording
                </p>

                <br></br>

                <h3>{selectedEvent.title}</h3>

                <p>
                  {selectedEvent.detail ||
                    selectedEvent.quote ||
                    "No additional detail available."}
                </p>
              </div>

              <button
                type="button"
                className="evidence-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close selected evidence"
              >
                ×
              </button>

            </div>
          </section>
        )}


        {/* =====================================================
            WHAT WE FOUND
        ===================================================== */}

        <section className="memory-findings">
{/* 
          <div className="section-label">
            <span>04</span>
            <div />
            <span>WHAT WE FOUND</span>
          </div> */}

          <div className="findings-heading">
            <h2>
              The parts worth
              <br />
              <em>keeping.</em>
            </h2>

            <p>
              RECALL separates the conversation into the
              things that happened, the choices that were
              made, and the things nobody resolved.
            </p>
          </div>

          <div className="findings-grid">

            <section className="finding-column">
              <div className="finding-header">
                <span>01</span>
                <h3>Events</h3>
              </div>

              <EventList
                title=""
                items={memory.events.slice(0, 4)}
              />
            </section>


            <section className="finding-column finding-column-marked">
              <div className="finding-header">
                <span>02</span>
                <h3>Decisions</h3>
              </div>

              <EventList
                title=""
                items={memory.decisions}
                variant="decisions"
              />
            </section>


            <section className="finding-column">
              <div className="finding-header">
                <span>03</span>
                <h3>Unresolved</h3>
              </div>

              <EventList
                title=""
                items={memory.unresolved}
                variant="unresolved"
              />
            </section>

          </div>
        </section>


        {/* =====================================================
            FOOTER NOTE
        ===================================================== */}

        <footer className="memory-footer-note">
          <div>
            <span>RECALL / MEMORY {memory.id}</span>
            <span>END OF RECONSTRUCTION</span>
          </div>
        </footer>

      </main>
    </div>
    );
}


/* ------------------------------------------------ */
/* NORMALIZE MEMORY */
/* ------------------------------------------------ */

function normalizeMemory(
  recording,
  rawMemory,
  transcripts
) {
  const events =
    Array.isArray(
      rawMemory.events
    )
      ? rawMemory.events
      : [];

  const decisions =
    Array.isArray(
      rawMemory.decisions
    )
      ? rawMemory.decisions
      : [];

  const unresolved =
    Array.isArray(
      rawMemory.unresolved_items
    )
      ? rawMemory.unresolved_items
      : [];

  return {
    id: recording.id,

    title:
      recording.filename ||
      "Untitled recording",

    date: formatDate(
      recording.created_at
    ),

    duration: formatTime(
      recording.duration_seconds
    ),

    participants:
      Array.isArray(
        rawMemory.participants
      )
        ? rawMemory.participants.length
        : 0,

    events:
      events.map(normalizeEvent),

    decisions:
      decisions.map(
        normalizeDecision
      ),

    unresolved:
      unresolved.map(
        normalizeUnresolved
      ),

    transcripts,
  };
}


/* ------------------------------------------------ */
/* EVENT */
/* ------------------------------------------------ */

function normalizeEvent(event) {
  const seconds =
    event.seconds ??
    event.start_time ??
    parseTime(event.time);

  return {
    ...event,

    seconds,

    time:
      event.time ||
      formatTime(seconds),

    title:
      event.title ||
      event.name ||
      "Memory event",

    detail:
      event.detail ||
      event.description ||
      "",
  };
}


/* ------------------------------------------------ */
/* DECISION */
/* ------------------------------------------------ */

function normalizeDecision(
  decision
) {
  const seconds =
    decision.seconds ??
    decision.start_time ??
    parseTime(decision.time);

  return {
    ...decision,

    seconds,

    time:
      decision.time ||
      formatTime(seconds),

    title:
      decision.title ||
      decision.name ||
      "Decision",

    reason:
      decision.reason ||
      decision.detail ||
      "",
  };
}


/* ------------------------------------------------ */
/* UNRESOLVED */
/* ------------------------------------------------ */

function normalizeUnresolved(
  item
) {
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
      "Unresolved",

    detail:
      item.detail ||
      item.description ||
      "",
  };
}


/* ------------------------------------------------ */
/* PARSE TIME */
/* ------------------------------------------------ */

function parseTime(value) {
  if (typeof value === "number") {
    return value;
  }

  if (
    !value ||
    typeof value !== "string"
  ) {
    return 0;
  }

  const parts = value
    .split(":")
    .map(Number);

  if (parts.length === 2) {
    return (
      parts[0] * 60 +
      parts[1]
    );
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


/* ------------------------------------------------ */
/* FORMAT TIME */
/* ------------------------------------------------ */

function formatTime(total) {
  const seconds = Math.floor(
    Number(total) || 0
  );

  const hours = Math.floor(
    seconds / 3600
  );

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(
    2,
    "0"
  )}`;
}


/* ------------------------------------------------ */
/* FORMAT DATE */
/* ------------------------------------------------ */

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unknown date";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}