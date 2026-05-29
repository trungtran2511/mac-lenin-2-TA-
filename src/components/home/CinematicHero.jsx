import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/hero.css";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const NAV_ITEMS = [
  { label: "Trang chủ", to: "/", active: true },
  { label: "Bài học", to: "/courses" },
  { label: "Quiz", to: "/quiz" },
  { label: "Memory Lab", to: "/flip" },
  { label: "Live Quiz", to: "/live-quiz" },
];

const CinematicHero = () => {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ──── Custom Fade-In / Fade-Out Video Loop ────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.5; // seconds

    const updateOpacity = () => {
      if (!video || video.paused) {
        rafRef.current = requestAnimationFrame(updateOpacity);
        return;
      }

      const { currentTime, duration } = video;

      if (duration && duration > 0) {
        // Fade in at the start
        if (currentTime < FADE_DURATION) {
          video.style.opacity = Math.min(currentTime / FADE_DURATION, 1);
        }
        // Fade out before the end
        else if (currentTime > duration - FADE_DURATION) {
          const remaining = duration - currentTime;
          video.style.opacity = Math.max(remaining / FADE_DURATION, 0);
        }
        // Full opacity in between
        else {
          video.style.opacity = 1;
        }
      }

      rafRef.current = requestAnimationFrame(updateOpacity);
    };

    // Handle ended event for seamless loop
    const handleEnded = () => {
      video.style.opacity = 0;
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    };

    // Start opacity at 0
    video.style.opacity = 0;

    // Start monitoring
    rafRef.current = requestAnimationFrame(updateOpacity);
    video.addEventListener("ended", handleEnded);

    // Attempt autoplay
    video.play().catch(() => {
      console.log("Video autoplay was prevented");
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <section className="cinematic-hero" id="cinematic-hero">
      {/* ── Video Background ── */}
      <div className="hero-video-layer">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        {/* Gradient overlay */}
        <div className="hero-video-overlay" />
      </div>

      {/* ── Navigation Bar ── */}
      <nav className="hero-navbar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="hero-logo" aria-label="Nhóm 2 - Trang chủ">
          Nhóm 2<sup>®</sup>
        </Link>

        {/* Desktop Menu */}
        <ul className="hero-nav-menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className={`hero-nav-link${item.active ? " active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/courses" className="hero-nav-cta">
              Bắt đầu học
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className={`hero-menu-toggle${mobileMenuOpen ? " open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── Mobile Navigation Overlay ── */}
      <div className={`hero-mobile-nav${mobileMenuOpen ? " open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`hero-nav-link${item.active ? " active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/courses"
          className="hero-nav-cta"
          onClick={() => setMobileMenuOpen(false)}
        >
          Bắt đầu học
        </Link>
      </div>

      {/* ── Hero Content ── */}
      <div className="hero-content">
        <h1 className="hero-headline animate-fade-rise">
          Khám phá <span className="muted">Triết học,</span> hiểu sâu{" "}
          <span className="muted">thế giới quan.</span>
        </h1>

        <p className="hero-description animate-fade-rise-delay">
          Không gian học tập Triết học Mác&nbsp;‑&nbsp;Lênin dành cho sinh viên
          AI1901. Học theo chủ đề, ôn thi bằng quiz, lật thẻ ghi nhớ và khám
          phá lá số tử vi cùng AI.
        </p>

        <Link to="/courses" className="hero-cta animate-fade-rise-delay-2">
          Bắt đầu học
        </Link>
      </div>
    </section>
  );
};

export default CinematicHero;
