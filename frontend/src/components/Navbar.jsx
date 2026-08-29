import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ product = false, home = false }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goToTop = () => {
    setOpen(false);

    // Always go to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  const scrollToSection = (id) => {
    setOpen(false);

    const scrollWithOffset = (targetId) => {
      const element = document.getElementById(targetId);
      if (!element) return;

      const headerOffset = 5;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

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
  };

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
        <img src="/recall-logo.svg" alt="" />
      </Link>

      {/* NAVIGATION */}
      <nav className={`nav-links ${open ? "nav-links--open" : ""}`}>
        <button onClick={() => scrollToSection("intro")}>
          Overview
        </button>

        <button onClick={() => scrollToSection("features")}>
          Features
        </button>

        <button onClick={() => scrollToSection("about")}>
          About
        </button>
      </nav>

      {/* NEW MEMORY */}
      <Link
        className="nav-cta"
        to="/upload"
        onClick={goToTop}
      >
        New memory <span>↗</span>
      </Link>

      {/* MOBILE MENU */}
      <button
        className="menu-button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>
    </header>
  );
}