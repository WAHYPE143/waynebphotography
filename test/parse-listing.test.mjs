import assert from 'node:assert/strict'
import { parseListing } from '../netlify/functions/drive-gallery.mts'

const entry = (id, name, icon) =>
  `<div class="flip-entry" id="entry-${id}"><div class="flip-entry-info">` +
  `<div class="flip-entry-icon"><img class="flip-entry-icon-img" src="${icon}"></div>` +
  `<div class="flip-entry-title">${name}</div>` +
  `<div class="flip-entry-last-modified"><div>Jul 24, 2026</div></div></div></div>`

const FOLDER_ICON = 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_folder_x16.png'
const IMAGE_ICON = 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_image_x16.png'
const PDF_ICON = 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_pdf_x16.png'
const THUMB = 'https://lh3.googleusercontent.com/drive-viewer/AKGpih-abc=w200-h190'

// A folder of folders — the "client galleries" collection case.
const collection = parseListing(
  'root',
  `<html><head><title>Client Galleries - Google Drive</title></head><body>` +
    entry('1FbQm7xKp3aVhNz9RtLcY0sJdWuE2gTnB', 'Ramirez Quincea&#241;era &#8212; May 2026', FOLDER_ICON) +
    entry('1AveRy8kLmQ2pXcZs4TnV7dHjB0wGfUyR', 'Avery Birthday — April 2026', FOLDER_ICON) +
    `</body></html>`,
)
assert.equal(collection.name, 'Client Galleries')
assert.equal(collection.photos.length, 0)
assert.deepEqual(
  collection.folders.map((f) => f.name),
  ['Avery Birthday — April 2026', 'Ramirez Quinceañera — May 2026'],
  'folders are sorted by name and HTML entities decoded',
)

// A folder of photos — a single gallery. Non-images are ignored.
const gallery = parseListing(
  '1AveRy8kLmQ2pXcZs4TnV7dHjB0wGfUyR',
  `<html><head><title>Avery Birthday - Google Drive</title></head><body>` +
    entry('1Ph10zXqLmT4vNbC8sYdKjR2wGfUeHaQp', 'IMG_0010.JPG', THUMB) +
    entry('1Ph02aBcDeFgHiJkLmNoPqRsTuVwXyZ12', 'IMG_0002.jpg', IMAGE_ICON) +
    entry('1Ph03aBcDeFgHiJkLmNoPqRsTuVwXyZ34', 'wide-shot.webp', THUMB) +
    entry('1Doc01BcDeFgHiJkLmNoPqRsTuVwXyZ56', 'invoice.pdf', PDF_ICON) +
    entry('1Sub01BcDeFgHiJkLmNoPqRsTuVwXyZ78', 'Print selects', FOLDER_ICON) +
    `</body></html>`,
)
assert.equal(gallery.name, 'Avery Birthday')
assert.deepEqual(
  gallery.photos.map((p) => p.id),
  ['1Ph02aBcDeFgHiJkLmNoPqRsTuVwXyZ12', '1Ph10zXqLmT4vNbC8sYdKjR2wGfUeHaQp', '1Ph03aBcDeFgHiJkLmNoPqRsTuVwXyZ34'],
  'images sorted naturally, pdf excluded',
)
assert.deepEqual(gallery.folders.map((f) => f.id), ['1Sub01BcDeFgHiJkLmNoPqRsTuVwXyZ78'])

// An empty or sign-in-walled response must be treated as a failure so the
// caller can fall back to cached data instead of publishing an empty gallery.
assert.throws(() => parseListing('root', '<html><body>Sign in to your Google Account</body></html>'))

console.log('parseListing: all assertions passed')
