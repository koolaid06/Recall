import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMemory } from "../context/MemoryContext";

export default function Navbar({ product = false, home = false }) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { startNewMemory } = useMemory();

  function goToTop() {
    setOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }

  function scrollToSection(id) {
    setOpen(false);

    const scrollWithOffset = (targetId) => {
      const element = document.getElementById(targetId);

      if (!element) return;

      const headerOffset = 5;
      const elementPosition =
        element.getBoundingClientRect().top;

      const offsetPosition =
        elementPosition +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    };

    if (location.pathname === "/") {
      scrollWithOffset(id);
    } else {
      navigate(`/#${id}`);

      setTimeout(() => {
        scrollWithOffset(id);
      }, 100);
    }
  }

  function handleNewMemory() {
    /*
      Clear the currently stored File and recording ID.

      This is intentionally ONLY called when the user
      explicitly chooses "New memory".
    */
    startNewMemory();

    setOpen(false);

    navigate("/upload");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }

  return (
    <header
      className={`navbar ${home ? "navbar--home" : ""} ${
        product ? "navbar--product" : ""
      }`}
    >
      {/* LOGO */}

      <Link
        className="brand"
        to="/"
        onClick={goToTop}
      >
        <img src="/recall-logo.svg" alt="RECALL" />
      </Link>

      {/* NAVIGATION */}

      <nav
        className={`nav-links ${
          open ? "nav-links--open" : ""
        }`}
      >
        <button
          onClick={() => scrollToSection("intro")}
        >
          Overview
        </button>

        <button
          onClick={() => scrollToSection("features")}
        >
          Features
        </button>

        <button
          onClick={() => scrollToSection("about")}
        >
          About
        </button>
      </nav>

      {/* NEW MEMORY */}

      <button
        className="nav-cta"
        onClick={handleNewMemory}
      >
        New memory <span>↗</span>
      </button>

      {/* MOBILE MENU */}

      <button
        className="menu-button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span />
        <span />
      </button>
    </header>
  );
}