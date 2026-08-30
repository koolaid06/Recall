import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  {
    number: "01",
    title: "Capture",
    description:
      "Every recording becomes a structured memory — people, decisions, open questions, and the moments that mattered.",
  },
  {
    number: "02",
    title: "Trace",
    description:
      "Watch an idea move: where it started, what pushed back on it, and the moment it became a decision.",
  },
  {
    number: "03",
    title: "Confirm",
    description:
      "No answer without a source. Every insight links back to the exact second it happened.",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);


  useEffect(() => {
    const sections = document.querySelectorAll(".notebook-page");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
<Navbar home />

      {/* =====================================================
          NOTEBOOK COVER / HERO
      ===================================================== */}

      <section className="notebook-cover" aria-label="RECALL introduction">
        <div className="paper-noise" />

        <div className="cover-margin">
          <span>FIELD NOTES / 2026</span>
          <span>VOL. 01</span>
        </div>

        <div className="cover-content">
          <div className="hand-note note-top">
            i luv u gdg!! <span>— feature not bug</span>
          </div>

          <div className="hero-logo-lockup">
            <div className="hero-wordmark">
              RE
              <span className="hero-c-letter">C</span>
              ALL
              <span className="hero-period">.</span>
            </div>

            <div className="logo-pencil-line" />
          </div>

          <p className="cover-subtitle">
            Turn moments into memory.
          </p>

          <p className="cover-description">
            RECALL turns conversations and recordings into
            something you can actually return to: what happened,
            why it changed, and what still matters.
          </p>
        </div>

        {/* <div className="cover-doodle doodle-bracket">
          <span />
          <span />
        </div> */}

        {/* <div className="cover-doodle doodle-star">
          <span>i luv u gdg!!</span>
        </div>

        <div className="paper-plane plane-one" aria-hidden="true">
          <span className="plane-body" />
          <span className="plane-trail" />
        </div> */}
{/* 
        <div className="cover-footer">
          <span>RECORD → REMEMBER</span>
          <span className="cover-page-number">01</span>
        </div> */}

        <div className="turn-hint">
          <span>keep going</span>
          <i />
        </div>
      </section>

      {/* =====================================================
          INTRO / FIRST NOTEBOOK PAGE
      ===================================================== */}

      <section className="notebook-page intro-page" id="intro">
        <div className="page-inner">
          <div className="page-topline">
            <span>01 / THE PROBLEM</span>
            <span>RECALL FIELD NOTES</span>
          </div>

          <div className="intro-content">
            <div className="margin-note">
              <span>NOTE</span>
              <p>
                A transcript tells you
                what was said.
              </p>
            </div>

            <div className="intro-main">
              <p className="hand-label">
                what gets lost
              </p>

              <h2>
                Your recordings
                <br />
                remember nothing.
                <em> RECALL does.</em>
              </h2>

              <div className="intro-rule" />

              <p className="intro-lead">
                We connect moments across time to reconstruct
                the story behind a recording.
              </p>

              <p className="intro-body">
                RECALL reconstructs those moments into a
                searchable memory. Ask what happened, when it
                happened, who was involved, why a decision
                changed, or what was left unresolved.
              </p>
            </div>

            <div className="page-stamp">
              <span>RECALL</span>
              <small>MEMORY / 001</small>
            </div>
          </div>

          {/* <div className="page-bottom">
            <span>keep scrolling →</span>
            <span>02</span>
          </div> */}
        </div>
      </section>

      {/* =====================================================
          MEMORY / FEATURES
      ===================================================== */}

      <section className="notebook-page memory-page" id="features">
        <div className="page-inner">
          <div className="page-topline">
            <span>02 / HOW IT WORKS</span>
            <span>THE MEMORY METHOD</span>
          </div>

          <div className="memory-heading">
            <div>
              <p className="hand-label">
                read between the lines
              </p>

              <h2>
                This is memory,
                <br />
                <em>not a transcript.</em>
              </h2>
            </div>

            <p>
              A transcript records words. RECALL follows the
              thread: how an idea started, where it hit
              friction, and what it became.
            </p>
          </div>

          <div className="memory-layout">
            <div className="feature-list">
              {features.map((feature, index) => (
                <button
                  key={feature.number}
                  className={`feature-row ${
                    active === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="feature-number">
                    {feature.number}
                  </span>

                  <strong>{feature.title}</strong>

                  <span className="feature-arrow">
                    ↗
                  </span>
                </button>
              ))}
            </div>

            <div className="memory-paper">
              <div className="memory-paper-header">
                <span>MEMORY / LAUNCH PLANNING</span>
                <span>00:54:31</span>
              </div>

              <div className="memory-map">
                {/* <div className="scribble-path path-one" />
                <div className="scribble-path path-two" /> */}

                <div className="memory-pin pin-one">
                  <small>00:08</small>
                  <strong>Idea raised</strong>
                  <span>Ship in October</span>
                </div>

                <div className="memory-pin pin-two">
                  <small>00:31</small>
                  <strong>Pushback</strong>
                  <span>QA flags a risk</span>
                </div>

                <div className="memory-pin pin-three">
                  <small>00:47</small>
                  <strong>Resolved</strong>
                  <span>Delayed to November</span>
                </div>

                {/* <div className="memory-thread-label">
                  <span>THE THREAD</span>
                  <i />
                </div> */}
              </div>

              <div className="memory-caption">
                <span>
                  {features[active].number} /{" "}
                  {features[active].title}
                </span>

                <p>
                  {features[active].description}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="margin-arrow">
            <span>the important part</span>
            <i>→</i>
          </div> */}

          {/* <div className="page-bottom">
            <span>03 / EVIDENCE</span>
            <span>03</span>
          </div> */}
        </div>
      </section>

      {/* =====================================================
          EVIDENCE
      ===================================================== */}

      <section className="notebook-page evidence-page" id="about">
        <div className="page-inner">
          <div className="page-topline">
            <span>03 / EVIDENCE</span>
            <span>NOTHING WITHOUT A SOURCE</span>
          </div>

          <div className="evidence-layout">
            <div className="evidence-copy">
              <p className="hand-label">
                so cool
              </p>

              <h2>
                No answer
                <br />
                without a
                <em> source.</em>
              </h2>

              <div className="red-pencil-mark" />

              <p>
                RECALL won't hand you a conclusion and ask
                you to trust it.
              </p>

              <p>
                Every insight is a timestamp away from the
                moment it came from.
              </p>
            </div>

            <div className="evidence-paper">
              <div className="evidence-question">
                Why did launch get pushed to November?
              </div>

              <div className="evidence-answer">
                QA raised a risk in testing that made the
                October date unrealistic. The team weighed
                the tradeoff and agreed to delay rather than
                ship with the issue open.
              </div>

              <div className="evidence-items">
                <div className="evidence-item">
                  <time>00:31</time>

                  <div>
                    <strong>Risk flagged</strong>
                    <span>
                      "We haven't finished regression
                      testing on checkout..."
                    </span>
                  </div>

                  <button>Jump ↗</button>
                </div>

                <div className="evidence-item">
                  <time>00:47</time>

                  <div>
                    <strong>Decision made</strong>
                    <span>
                      "Let's push to November and do this
                      right."
                    </span>
                  </div>

                  <button>Jump ↗</button>
                </div>
              </div>

              <div className="evidence-pencil">
                verified against recording
              </div>
            </div>
          </div>

          <div className="paper-plane plane-two" aria-hidden="true">
            <span className="plane-body" />
            <span className="plane-trail" />
          </div>

          {/* <div className="page-bottom">
            <span>04 / YOUR MEMORY</span>
            <span>04</span>
          </div> */}
        </div>
      </section>

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="notebook-page closing-page">
        <div className="closing-paper">
          <div className="closing-margin" />

          <h2>
            Don't just
            <br />
            record.
            <br />
            <em>Remember.</em>
          </h2>

          <p className="closing-copy">
            Give the moments you care about somewhere
            better to live.
          </p>

          <Link to="/upload" className="paper-button paper-button-dark">
            Start with a memory
            <span>↗</span>
          </Link>

          <div className="closing-doodle">
            <span />
            <span />
            <span />
          </div>

          <div className="closing-signature">
            — RECALL
          </div>

          {/* <div className="closing-page-number">
            05
          </div> */}
        </div>
      </section>

      <footer className="notebook-footer">
        <Link to="/" className="footer-mark">
          <img src="/recall-logo.svg" alt="" />
          <span>RECALL</span>
        </Link>

        <span>© 2026 RECALL</span>

        <span>Memory, reconstructed.</span>
      </footer>
    </div>
  );
}