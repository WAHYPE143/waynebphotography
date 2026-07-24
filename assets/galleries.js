/**
 * Client gallery helpers.
 *
 * Photos live in Google Drive; `/api/galleries` returns the file ids and Drive's
 * own image CDN serves each one at the width the layout asks for.
 */

const API_PATH = '/api/galleries'
const WIDTHS = [400, 800, 1200, 1600]

export function photoUrl(id, width) {
  return `https://lh3.googleusercontent.com/d/${id}=w${width}`
}

export function photoSrcset(id) {
  return WIDTHS.map((width) => `${photoUrl(id, width)} ${width}w`).join(', ')
}

export async function loadFolder(folderId) {
  const url = folderId ? `${API_PATH}/${encodeURIComponent(folderId)}` : API_PATH
  const res = await fetch(url)
  if (!res.ok) throw new Error(`gallery-api-${res.status}`)
  return res.json()
}

export function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

export function photoCountLabel(count) {
  if (!count) return 'Gallery on Drive'
  return `${count} photo${count === 1 ? '' : 's'}`
}

/** Full-screen viewer with arrow-key, swipe-free click navigation. */
export function createLightbox() {
  let photos = []
  let index = 0

  const root = el('div', 'lightbox')
  const close = el('button', 'lightbox-close', '×')
  close.setAttribute('aria-label', 'Close')
  const prev = el('button', 'lightbox-nav lightbox-prev', '‹')
  prev.setAttribute('aria-label', 'Previous photo')
  const next = el('button', 'lightbox-nav lightbox-next', '›')
  next.setAttribute('aria-label', 'Next photo')
  const img = el('img')
  const caption = el('p', 'lightbox-caption')

  root.append(close, prev, img, next, caption)
  document.body.appendChild(root)

  function show(nextIndex) {
    if (!photos.length) return
    index = (nextIndex + photos.length) % photos.length
    const photo = photos[index]
    img.src = photoUrl(photo.id, 2000)
    img.alt = photo.name || `Photo ${index + 1}`
    caption.textContent = `${index + 1} / ${photos.length}`
  }

  function open(startIndex) {
    show(startIndex)
    root.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function hide() {
    root.classList.remove('active')
    document.body.style.overflow = ''
  }

  close.addEventListener('click', hide)
  prev.addEventListener('click', () => show(index - 1))
  next.addEventListener('click', () => show(index + 1))
  root.addEventListener('click', (event) => {
    if (event.target === root) hide()
  })
  document.addEventListener('keydown', (event) => {
    if (!root.classList.contains('active')) return
    if (event.key === 'Escape') hide()
    if (event.key === 'ArrowRight') show(index + 1)
    if (event.key === 'ArrowLeft') show(index - 1)
  })

  return {
    setPhotos(list) {
      photos = list
    },
    open,
  }
}
