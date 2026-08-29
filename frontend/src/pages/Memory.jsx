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

  const {
    file,
    setFile,
    recordingId,
    setRecordingId,
  } = useMemory();

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
          <div className="memory-loading">
            <span>RECALL ENGINE</span>

            <h2>
              Reconstructing memory.
            </h2>

            <p>
              Loading the recording,
              events and evidence.
            </p>
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
          <div className="memory-error">
            <span>RECALL ENGINE</span>

            <h2>
              Memory unavailable.
            </h2>

            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const recording = data.recording;
  const rawMemory = data.memory || {};
  const transcripts =
    data.transcripts || [];

  const memory = normalizeMemory(
    recording,
    rawMemory,
    transcripts
  );

  return (
    <div className="product-page memory-page">
      <Navbar product />

      <main className="memory-main">

        <MemoryHeader
          memory={memory}
        />

        {/* RECORDING */}
        <section className="memory-video-section">

          <div className="memory-section-heading">
            <div>
              <span>RECORDING</span>

              <h2>
                Original conversation
              </h2>
            </div>

            <span className="memory-video-duration">
              {memory.duration}
            </span>
          </div>

          <div className="memory-video-container">

            {videoUrl ? (
              <VideoPlayer
                src={videoUrl}
                activeSeconds={
                  activeSeconds
                }
                onTimeChange={
                  setActiveSeconds
                }
              />
            ) : (
              <div className="memory-video-unavailable">
                <span>
                  RECORDING
                </span>

                <h3>
                  Recording unavailable
                </h3>

                <p>
                  The original recording
                  is no longer available
                  in this browser session.
                </p>
              </div>
            )}

          </div>

        </section>

        {/* TIMELINE + ASK */}
        <div className="memory-workspace">

          <div className="media-column">

            <Timeline
              events={memory.events}
              activeSeconds={
                activeSeconds
              }
              onSelect={
                selectTimeline
              }
            />

          </div>

          <AskMemory
            memoryId={id}
            onEvidenceClick={
              selectEvidence
            }
          />

        </div>

        {/* SELECTED EVENT */}
        {selectedEvent && (
          <div className="selected-memory">

            <span>
              {selectedEvent.time ||
                formatTime(
                  selectedEvent.seconds
                )}
            </span>

            <div>
              <b>
                {selectedEvent.title}
              </b>

              <p>
                {selectedEvent.detail ||
                  selectedEvent.quote ||
                  ""}
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedEvent(null)
              }
              aria-label="Close"
            >
              ×
            </button>

          </div>
        )}

        {/* MEMORY BREAKDOWN */}
        <div className="memory-lower">

          <EventList
            title="EVENTS"
            items={memory.events.slice(
              0,
              4
            )}
          />

          <EventList
            title="DECISIONS"
            items={
              memory.decisions
            }
            variant="decisions"
          />

          <EventList
            title="UNRESOLVED"
            items={
              memory.unresolved
            }
            variant="unresolved"
          />

        </div>

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