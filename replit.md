# Wayne B Photography

A professional events photography portfolio website for waynebphotography.com — two-page editorial static site built with React + Vite.

## Run & Operate

- `pnpm --filter @workspace/wayne-b-photography run dev` — run the site (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing
- Styling: Custom CSS (Inter + Georgia, near-black #0d0d0d / white)
- No backend required — fully static site

## Where things live

- `artifacts/wayne-b-photography/src/pages/Home.tsx` — main portfolio page
- `artifacts/wayne-b-photography/src/pages/Gallery.tsx` — CNHF gallery page with lightbox
- `artifacts/wayne-b-photography/src/index.css` — all styles (design tokens, layout, responsive)
- `artifacts/wayne-b-photography/src/App.tsx` — routing (/ and /cnhf-gallery)

## Product

Two-page photography portfolio:
1. **Home (/)** — Fixed nav, full-screen hero "Every moment deserves to last.", featured CNHF corporate card → gallery, 9-cell asymmetric grid (Birthday / Baby Shower / Quinceañera / Sports / Calivibes / Model), services strip (4 categories), about section, dark contact section
2. **Gallery (/cnhf-gallery)** — Event hero header, 3-column masonry gallery (9 photos), lightbox with ←/→/Escape keyboard nav, "View & Download All" button to Google Drive folder

## User preferences

- Design: Inter font body, Georgia serif headlines, #0d0d0d near-black background, white text, 3px grid gaps
- Hover zoom on all photo cells and masonry items
- Mobile responsive (breakpoints at 768px and 480px)
- Location: Los Angeles, CA
- Domain: waynebphotography.com
- Instagram: @waynebphoto
- Email: waynebphotography@gmail.com

## Gotchas

- **Google Drive photos**: Replace `PHOTO_FILE_ID_1` through `PHOTO_FILE_ID_9` in `Gallery.tsx` with real Google Drive file IDs. Also replace `REPLACE_WITH_YOUR_FOLDER_ID` in `DRIVE_FOLDER_URL` with the actual folder ID. File ID is the long string in a Drive share link: `drive.google.com/file/d/FILE_ID/view`
- Portfolio grid uses CSS gradient placeholders — swap with real `<img>` tags when photos are available
- The site is served at previewPath `/` so it occupies the root

## Architecture decisions

- Presentation-first: no API, no database — all static content in React components
- CSS custom properties for the design system (no Tailwind utility classes in main layout)
- Masonry via CSS `columns` for true masonry flow without JS libraries
- Lightbox is fully custom — no external dependency, keyboard + click-outside to close
