import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";

/*
 * CNHF Gallery Photos
 * Replace each `src` value with your actual lh3.googleusercontent.com thumbnail URL.
 * Format: https://lh3.googleusercontent.com/d/GOOGLE_DRIVE_FILE_ID=w1200
 *
 * To get a file ID: open the file in Google Drive → Share → Copy link
 * The ID is the long string between /d/ and /view in the URL.
 *
 * Drive folder URL: replace FOLDER_ID below with your actual folder ID.
 */
const DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/REPLACE_WITH_YOUR_FOLDER_ID";

const makeThumb = (fileId: string, width = 1200) =>
  `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;

const PHOTOS = [
  { id: 1, src: makeThumb("PHOTO_FILE_ID_1"), alt: "CNHF Residency Orientation — 1" },
  { id: 2, src: makeThumb("PHOTO_FILE_ID_2"), alt: "CNHF Residency Orientation — 2" },
  { id: 3, src: makeThumb("PHOTO_FILE_ID_3"), alt: "CNHF Residency Orientation — 3" },
  { id: 4, src: makeThumb("PHOTO_FILE_ID_4"), alt: "CNHF Residency Orientation — 4" },
  { id: 5, src: makeThumb("PHOTO_FILE_ID_5"), alt: "CNHF Residency Orientation — 5" },
  { id: 6, src: makeThumb("PHOTO_FILE_ID_6"), alt: "CNHF Residency Orientation — 6" },
  { id: 7, src: makeThumb("PHOTO_FILE_ID_7"), alt: "CNHF Residency Orientation — 7" },
  { id: 8, src: makeThumb("PHOTO_FILE_ID_8"), alt: "CNHF Residency Orientation — 8" },
  { id: 9, src: makeThumb("PHOTO_FILE_ID_9"), alt: "CNHF Residency Orientation — 9" },
];

const PLACEHOLDER_HEIGHTS = [320, 240, 280, 360, 220, 300, 260, 340, 280];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean[]>(Array(PHOTOS.length).fill(false));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
  }, []);

  const next = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i + 1) % PHOTOS.length));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const markLoaded = (i: number) => {
    setLoaded(prev => { const n = [...prev]; n[i] = true; return n; });
  };

  const isRealUrl = (url: string) => !url.includes("PHOTO_FILE_ID");

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
          <p className="gallery-hero-tag">Corporate Event Gallery</p>
          <h1 className="gallery-hero-title">
            Central Neighborhood Christian Health<br />
            Residency Orientation
          </h1>
          <div className="gallery-hero-meta">
            <span>June 26, 2026</span>
            <span>Los Angeles, California</span>
            <span>{PHOTOS.length} Photos</span>
          </div>
        </div>
      </div>

      {/* MASONRY GALLERY */}
      <div className="gallery-masonry-section">
        <div className="gallery-masonry-inner">
          <div className="masonry-grid">
            {PHOTOS.map((photo, i) => (
              <div
                key={photo.id}
                className="masonry-item"
                onClick={() => openLightbox(i)}
                role="button"
                tabIndex={0}
                aria-label={photo.alt}
                onKeyDown={e => e.key === "Enter" && openLightbox(i)}
              >
                {isRealUrl(photo.src) ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    onLoad={() => markLoaded(i)}
                    style={{ opacity: loaded[i] ? 1 : 0, transition: "opacity 0.4s" }}
                  />
                ) : (
                  <div
                    className="masonry-item-placeholder"
                    style={{ height: PLACEHOLDER_HEIGHTS[i] }}
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      opacity: 0.25,
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                        Photo {i + 1}
                      </span>
                    </div>
                  </div>
                )}
                <div className="masonry-overlay">
                  <div className="masonry-expand">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <polyline points="15 3 21 3 21 9"/>
                      <polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/>
                      <line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VIEW ALL BUTTON */}
          <div className="gallery-actions">
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view-all"
            >
              View & Download All
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="0" y1="5" x2="12" y2="5"/>
                <polyline points="8 1 12 5 8 9"/>
              </svg>
            </a>
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

      {/* LIGHTBOX */}
      <div
        className={`lightbox${lightboxIndex !== null ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        role="dialog"
        aria-modal="true"
        aria-label="Photo lightbox"
      >
        <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
          ×
        </button>

        {lightboxIndex !== null && (
          <div className="lightbox-img-wrap">
            {isRealUrl(PHOTOS[lightboxIndex].src) ? (
              <img
                src={PHOTOS[lightboxIndex].src}
                alt={PHOTOS[lightboxIndex].alt}
              />
            ) : (
              <div
                className="lightbox-placeholder"
                style={{ height: "min(70vh, 600px)" }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  opacity: 0.2,
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style={{ fontSize: 12, letterSpacing: "0.15em", color: "white", textTransform: "uppercase" }}>
                    Photo {lightboxIndex + 1}
                  </span>
                </div>
              </div>
            )}

            <button
              className="lightbox-arrow prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <button
              className="lightbox-arrow next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <div className="lightbox-counter">
              {lightboxIndex + 1} / {PHOTOS.length}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
