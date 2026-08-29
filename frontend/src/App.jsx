import { useEffect, useRef, useState } from "react";
import "./index.css";

const features = [
  {
    number: "01",
    title: "Understand",
    text: "Turn hours of video and audio into structured memories of events, decisions, people and context.",
  },
  {
    number: "02",
    title: "Connect",
    text: "Follow how conversations evolve — from the first idea to the decision that finally stuck.",
  },
  {
    number: "03",
    title: "Verify",
    text: "Every answer is grounded in the original recording, with a timestamp that takes you back to the moment.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${e.clientX - 90}px, ${e.clientY - 90}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate3d(${e.clientX * 0.025}px, ${e.clientY * 0.018}px, 0)`;
      }
    };
    window.addEventListener("pointermove", move);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div className="app">
      <div className="ambient-cursor" ref={cursorRef} />
      <div className="page-glow" ref={glowRef} />

      <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="RECALL home">
          <img src="/recall-logo.svg" alt="" />
          <span>RECALL</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <a href="#overview" onClick={() => setMenuOpen(false)}>Overview</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>

        <button className="nav-cta" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
          Sign in
        </button>

        <button
          className="menu-button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="top">
        <section className="hero" id="overview">
          <div className="orb orb--top" />
          <div className="orb orb--bottom" />
          <div className="orb orb--violet" />

          <div className="hero-noise" />

          <div className="hero-content">
            <div className="eyebrow reveal">
              <span className="eyebrow-dot" />
              MULTIMODAL EPISODIC MEMORY
            </div>

            <h1 className="hero-title reveal reveal-delay-1">
              <span>RECALL</span><i>.</i>
            </h1>

            <p className="hero-subtitle reveal reveal-delay-2">
              Turn moments into memory.
            </p>

            <p className="hero-description reveal reveal-delay-3">
              Transform recordings into a living memory of what happened,
              why it changed, and what still matters.
            </p>

            <div className="hero-actions reveal reveal-delay-4" id="demo">
              <button className="button button--primary" onClick={() => alert("Upload flow coming next.")}>
                Start remembering
                <span>↗</span>
              </button>
              <button
                className="button button--ghost"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore RECALL
              </button>
            </div>

            <div className="hero-proof reveal reveal-delay-5">
              <span>VIDEO</span>
              <b />
              <span>AUDIO</span>
              <b />
              <span>CONTEXT</span>
              <b />
              <span>EVIDENCE</span>
            </div>
          </div>

          <div className="scroll-cue">
            <span>Scroll to explore</span>
            <span className="scroll-line" />
          </div>
        </section>

        <section className="intro" id="story">
          <div className="section-kicker">A different kind of search</div>
          <div className="intro-grid">
            <h2>
              Your recordings remember nothing.
              <em> RECALL does.</em>
            </h2>
            <div>
              <p className="intro-lead">
                We record meetings, conversations, ideas and decisions — then
                leave them buried inside hours of footage.
              </p>
              <p>
                RECALL reconstructs those moments into a searchable memory.
                Ask what happened, when it happened, who was involved, why a
                decision changed, or what was left unresolved.
              </p>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <div>
              <div className="section-kicker">The memory layer</div>
              <h2>More than a transcript.</h2>
            </div>
            <p>
              RECALL connects moments across time to reconstruct the story
              behind a recording.
            </p>
          </div>

          <div className="feature-layout">
            <div className="feature-list">
              {features.map((feature, index) => (
                <button
                  className={`feature-row ${activeFeature === index ? "feature-row--active" : ""}`}
                  key={feature.number}
                  onMouseEnter={() => setActiveFeature(index)}
                  onClick={() => setActiveFeature(index)}
                >
                  <span>{feature.number}</span>
                  <strong>{feature.title}</strong>
                  <i>↗</i>
                </button>
              ))}
            </div>

            <div className="memory-preview">
              <div className="preview-top">
                <span>MEMORY / PRODUCT STRATEGY</span>
                <span>01:42:18</span>
              </div>

              <div className="preview-visual">
                <div className="preview-orbit orbit-one" />
                <div className="preview-orbit orbit-two" />
                <div className="preview-center">
                  <span className="center-dot" />
                  <span>MEMORY</span>
                </div>

                <div className="memory-node node-a">
                  <small>01:12</small>
                  <b>Decision</b>
                  <span>Firebase selected</span>
                </div>
                <div className="memory-node node-b">
                  <small>01:37</small>
                  <b>Problem</b>
                  <span>Integration issue</span>
                </div>
                <div className="memory-node node-c">
                  <small>02:04</small>
                  <b>Decision changed</b>
                  <span>Supabase selected</span>
                </div>
              </div>

              <div className="preview-caption">
                <span>{features[activeFeature].title}</span>
                <p>{features[activeFeature].text}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="evidence-section">
          <div className="evidence-copy">
            <div className="section-kicker">Trust the answer. Verify the moment.</div>
            <h2>Every memory has evidence.</h2>
            <p>
              AI shouldn't ask you to simply trust its answer. RECALL anchors
              insights to the original recording with precise timestamps.
            </p>
            <button className="text-button">
              See how evidence works <span>→</span>
            </button>
          </div>

          <div className="evidence-card">
            <div className="evidence-card-head">
              <span>RECALL ANSWER</span>
              <span className="live-dot">● LIVE MEMORY</span>
            </div>
            <h3>Why did the team switch databases?</h3>
            <p>
              The team changed direction after an integration issue made the
              original architecture impractical. A new option was proposed,
              discussed, and approved.
            </p>

            <div className="evidence-items">
              <div className="evidence-item">
                <time>01:37</time>
                <div>
                  <b>Integration issue</b>
                  <span>"Firebase isn't working with our current flow..."</span>
                </div>
                <button>Jump ↗</button>
              </div>
              <div className="evidence-item">
                <time>02:04</time>
                <div>
                  <b>Final decision</b>
                  <span>"Let's switch to Supabase."</span>
                </div>
                <button>Jump ↗</button>
              </div>
            </div>
          </div>
        </section>

        <section className="closing" id="about">
          <div className="closing-orb" />
          <div className="section-kicker">Don't just record.</div>
          <h2>Remember.</h2>
          <p>
            Turn passive recordings into an interactive, verifiable source of
            knowledge that stays useful long after the moment has passed.
          </p>
          <button className="button button--light" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Start with a memory <span>↗</span>
          </button>
        </section>
      </main>

      <footer>
        <a className="footer-brand" href="#top">
          <img src="/recall-logo.svg" alt="" />
          <span>RECALL</span>
        </a>
        <span>© 2026 RECALL</span>
        <span>Memory, reconstructed.</span>
      </footer>
    </div>
  );
}

export default App;
