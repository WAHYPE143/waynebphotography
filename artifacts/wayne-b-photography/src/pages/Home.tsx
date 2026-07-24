import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";

const GRID_CELLS = [
  { label: "Birthday",      className: "gc-birthday"  },
  { label: "Baby Shower",   className: "gc-shower"    },
  { label: "Quinceañera",   className: "gc-quince"    },
  { label: "Sports",        className: "gc-sports"    },
  { label: "Calivibes",     className: "gc-calivibes" },
  { label: "Model",         className: "gc-model"     },
  { label: "Birthday",      className: "gc-birthday"  },
  { label: "Sports",        className: "gc-sports"    },
  { label: "Quinceañera",   className: "gc-quince"    },
];

const SERVICES = [
  { num: "01", name: "Corporate Events" },
  { num: "02", name: "Celebrations" },
  { num: "03", name: "Sports & Action" },
  { num: "04", name: "Culture & Lifestyle" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* NAV */}
      <nav ref={navRef} className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">Wayne B</a>
        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          <li><a href="#work"     onClick={() => scrollTo("work")}>Work</a></li>
          <li><a href="#services" onClick={() => scrollTo("services")}>Services</a></li>
          <li><a href="#about"    onClick={() => scrollTo("about")}>About</a></li>
          <li><a href="#contact"  onClick={() => scrollTo("contact")}>Contact</a></li>
        </ul>
        <button
          className="nav-hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(m => !m)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Wayne B Photography &nbsp;·&nbsp; Los Angeles, CA</p>
          <h1 className="hero-headline">Every moment<br />deserves to last.</h1>
          <p className="hero-sub">Professional Headshot Photography</p>
        </div>
      </section>

      {/* FEATURED CORPORATE */}
      <section id="work" className="featured">
        <div className="featured-inner">
          <p className="section-label">Featured Work</p>
          <Link href="/cnhf-gallery" className="featured-card">
            <div className="featured-image">
              <div className="featured-image-placeholder">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1"/>
                  <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1"/>
                  <polyline points="21 15 16 10 5 21" strokeWidth="1"/>
                </svg>
              </div>
            </div>
            <div className="featured-info">
              <div>
                <p className="featured-tag">Corporate &nbsp;·&nbsp; June 26, 2026</p>
                <h2 className="featured-title">
                  Central Neighborhood Christian Health Residency Orientation
                </h2>
                <p className="featured-meta">Los Angeles, California &nbsp;·&nbsp; 9 Photos</p>
              </div>
              <span className="featured-cta">
                View Gallery
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <line x1="0" y1="6" x2="14" y2="6"/>
                  <polyline points="9 1 14 6 9 11"/>
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* BADÉ COLLECTIVE CARD */}
      <section className="featured bade-featured">
        <div className="featured-inner">
          <a
            href="https://badecollective.com"
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card bade-card"
          >
            <div className="featured-image bade-image">
              <div className="bade-bg-grid">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bade-bg-cell" />
                ))}
              </div>
              <div className="bade-logo-overlay">
                <span className="bade-logo-text">BAD<span className="bade-accent">É</span></span>
                <span className="bade-sub-text">Black American Domestic Export</span>
              </div>
            </div>
            <div className="featured-info">
              <div>
                <p className="featured-tag">Collective &nbsp;·&nbsp; Editorial &nbsp;·&nbsp; 2021–2026</p>
                <h2 className="featured-title">Badé Collective</h2>
                <p className="featured-meta">
                  A creative collective rooted in Black American culture — music, fashion,
                  and documentary work across Los Angeles.
                </p>
              </div>
              <span className="featured-cta">
                View Portfolio
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <line x1="0" y1="6" x2="14" y2="6"/>
                  <polyline points="9 1 14 6 9 11"/>
                </svg>
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* BADÉ PROJECTS EMBED */}
      <section className="bade-embed-section">
        <div className="bade-embed-inner">
          <div className="bade-embed-header">
            <p className="section-label">Badé Collective — Portfolio 2021–2026</p>
            <a
              href="https://badecollective.com/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="bade-embed-link"
            >
              Open full site ↗
            </a>
          </div>
          <div className="bade-embed-frame-wrap">
            <iframe
              src="https://badecollective.com/projects"
              title="Badé Collective Projects"
              className="bade-embed-frame"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="gallery-grid-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p className="section-label" style={{ paddingBottom: 16 }}>Portfolio</p>
        </div>
        <div className="gallery-grid">
          {GRID_CELLS.map((cell, i) => (
            <div key={i} className="grid-cell">
              <div className={`grid-cell-bg ${cell.className}`} />
              <div className="grid-cell-label">{cell.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services">
        <div className="services-inner">
          {SERVICES.map(s => (
            <div key={s.num} className="service-item">
              <p className="service-num">{s.num}</p>
              <p className="service-name">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="about-inner">
          <div className="about-image">
            <div className="about-image-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.7">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <div className="about-text">
            <p className="section-label">About</p>
            <h2>Wayne B — LA's Headshot Photographer</h2>
            <p>
              I'm Wayne B, a professional headshot photographer based in Los Angeles, CA.
              I specialize in capturing portraits that feel authentic — images that
              represent who you are and open doors.
            </p>
            <p>
              Every frame I capture tells a story. My editorial approach focuses on
              real expressions, genuine confidence, and the presence that makes each
              headshot unforgettable. Whether it's an actor, entrepreneur, or creative
              professional, I bring the same intention and craft to every shoot.
            </p>
            <p>
              Follow along on Instagram{" "}
              <a
                href="https://instagram.com/waynebphoto"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 1 }}
              >
                @waynebphoto
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <p className="section-label">Get in Touch</p>
          <h2>Let's work together.</h2>
          <p className="contact-sub">Available for bookings in Los Angeles and beyond</p>
          <a
            href="mailto:waynebphotography@gmail.com"
            className="contact-email"
          >
            waynebphotography@gmail.com
          </a>
          <ul className="contact-social">
            <li>
              <a href="https://instagram.com/waynebphoto" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://waynebphotography.com" target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} Wayne B Photography. All rights reserved.
        </span>
        <span className="footer-copy">Los Angeles, CA</span>
      </footer>
    </>
  );
}
