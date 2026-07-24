import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";

const FOLDER_ID = "1_bw9AstwZWO8Sfs2Di5-2GyESaBi7NCi";
const DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}?usp=sharing`;
const DRIVE_EMBED_URL = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#grid`;

// Parsed from Drive folder — CNHF Residency Orientation headshots
const PEOPLE = [
  { num: "01", name: "Samuel Yoo",          title: "MD"   },
  { num: "02", name: "Bereket Gebreslasie", title: "MD"   },
  { num: "03", name: "Joshua Dang",         title: "MD"   },
  { num: "04", name: "Daniel Pryor",        title: ""     },
  { num: "05", name: "Roberto Madrid",      title: "MD"   },
  { num: "06", name: "Breanna Montes",      title: ""     },
  { num: "07", name: "Nicole Villacreses",  title: ""     },
  { num: "08", name: "Angela Duran",        title: ""     },
  { num: "09", name: "Pamala Molina",       title: "LCSW" },
  { num: "10", name: "Renne Aldestein",     title: ""     },
  { num: "11", name: "Chelsea Grenfell",    title: "ACSW" },
  { num: "12", name: "Michael Guitron",     title: ""     },
  { num: "13", name: "Alejandra Vega",      title: "LCSW" },
  { num: "14", name: "Jared Peralta",       title: "MD"   },
  { num: "15", name: "Marlena Arredondo",   title: "ACSW" },
  { num: "16", name: "Nicole Opara",        title: "ACSW" },
  { num: "17", name: "Isaac Kim",           title: "MD"   },
  { num: "18", name: "Fadi Soliman",        title: "MD"   },
  { num: "19", name: "Ashley Cano",         title: ""     },
];

function formatName(p: typeof PEOPLE[number]) {
  const prefix = p.title === "MD" ? "Dr. " : "";
  const suffix = p.title && p.title !== "MD" ? `, ${p.title}` : "";
  return { prefix, base: p.name, suffix };
}

export default function Gallery() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = PEOPLE.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">Wayne B</Link>
        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link href="/#work" onClick={() => setMenuOpen(false)}>Work</Link></li>
          <li><Link href="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
        <button
          className="nav-hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(m => !m)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* GALLERY HERO */}
      <div className="gallery-hero">
        <div className="gallery-hero-inner">
          <p className="gallery-hero-tag">Headshots &nbsp;·&nbsp; Corporate Gallery</p>
          <h1 className="gallery-hero-title">
            Central Neighborhood Christian<br />
            Health — Residency Orientation
          </h1>
          <div className="gallery-hero-meta">
            <span>June 26, 2026</span>
            <span>Los Angeles, California</span>
            <span>{PEOPLE.length} Subjects</span>
          </div>
        </div>
      </div>

      {/* PEOPLE DIRECTORY */}
      <div className="hs-section">
        <div className="hs-inner">

          {/* SEARCH */}
          <div className="hs-search-row">
            <p className="section-label">Resident Directory</p>
            <div className="hs-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="hs-search"
                type="text"
                placeholder="Search by name or title…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* GRID */}
          <div className="hs-grid">
            {filtered.map(p => {
              const { prefix, base, suffix } = formatName(p);
              return (
                <a
                  key={p.num}
                  href={DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hs-card"
                >
                  <div className="hs-card-photo">
                    <div className="hs-photo-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.8">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="hs-card-overlay">
                      <span className="hs-download-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        View &amp; Download
                      </span>
                    </div>
                  </div>
                  <div className="hs-card-info">
                    <p className="hs-card-num">{p.num}</p>
                    <p className="hs-card-name">
                      {prefix}<strong>{base}</strong>{suffix}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="hs-empty">
              <p>No results for "{search}"</p>
            </div>
          )}
        </div>
      </div>

      {/* DRIVE EMBED */}
      <div className="hs-embed-section">
        <div className="hs-inner">
          <div className="hs-embed-header">
            <p className="section-label">Full Photo Folder — Google Drive</p>
            <a href={DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer" className="btn-view-all" style={{ marginTop: 0 }}>
              View &amp; Download All
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="0" y1="5" x2="12" y2="5"/>
                <polyline points="8 1 12 5 8 9"/>
              </svg>
            </a>
          </div>
          <div className="drive-embed-wrap">
            <iframe
              src={DRIVE_EMBED_URL}
              title="CNHF Headshots — Google Drive"
              className="drive-embed-frame"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-copy">© {new Date().getFullYear()} Wayne B Photography</span>
        <Link href="/" className="footer-copy" style={{ cursor: "pointer", opacity: 0.5 }}>
          ← Back to Portfolio
        </Link>
      </footer>
    </>
  );
}
