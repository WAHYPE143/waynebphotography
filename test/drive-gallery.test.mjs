import assert from 'node:assert/strict'
import handler from '../netlify/functions/drive-gallery.mts'

const ROOT = process.env.DRIVE_GALLERIES_FOLDER_ID || '108HdgZoiORmD3pswZS3ElaZh2Ur3yJHt'
const GALLERY = '1AveRy8kLmQ2pXcZs4TnV7dHjB0wGfUyR'

const entry = (id, name, icon) =>
  `<div class="flip-entry" id="entry-${id}"><div class="flip-entry-icon"><img src="${icon}"></div>` +
  `<div class="flip-entry-title">${name}</div></div>`

const FOLDER_ICON = 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_folder_x16.png'
const THUMB = 'https://lh3.googleusercontent.com/drive-viewer/AKGpih-abc=w200'

const pages = {
  [ROOT]:
    `<html><head><title>Client Galleries - Google Drive</title></head><body>` +
    entry(GALLERY, 'Avery Birthday — April 2026', FOLDER_ICON) +
    `</body></html>`,
  [GALLERY]:
    `<html><head><title>Avery Birthday - Google Drive</title></head><body>` +
    entry('1Ph02aBcDeFgHiJkLmNoPqRsTuVwXyZ12', 'IMG_0002.jpg', THUMB) +
    `</body></html>`,
}

let driveReachable = true
globalThis.fetch = async (url) => {
  if (!driveReachable) throw new Error('network down')
  const id = new URL(url).searchParams.get('id')
  const html = pages[id]
  if (!html) return new Response('Sign in to your Google Account', { status: 200 })
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html' } })
}

const call = (path, params = {}) =>
  handler(new Request(`https://waynebphoto.netlify.app${path}`), { params })

// Root listing exposes the galleries inside the folder.
const root = await (await call('/api/galleries')).json()
assert.equal(root.available, true)
assert.equal(root.isRoot, true)
assert.equal(root.name, 'Client Galleries')
assert.deepEqual(root.folders.map((f) => f.id), [GALLERY])
assert.equal(root.folders[0].driveUrl, `https://drive.google.com/drive/folders/${GALLERY}`)

// A gallery inside the root resolves to its photos.
const gallery = await (await call(`/api/galleries/${GALLERY}`, { folderId: GALLERY })).json()
assert.equal(gallery.available, true)
assert.equal(gallery.name, 'Avery Birthday')
assert.equal(gallery.photos.length, 1)

// Folders outside the configured root are refused, so this is not an open proxy.
const stranger = '1NotMineBcDeFgHiJkLmNoPqRsTuVwXyZ9'
const strangerRes = await call(`/api/galleries/${stranger}`, { folderId: stranger })
assert.equal(strangerRes.status, 404)

// Malformed ids never reach Drive.
const badRes = await call('/api/galleries/nope!', { folderId: 'nope!' })
assert.equal(badRes.status, 400)

// With Drive unreachable and no cache available, the response says so instead of
// erroring, which is what makes the pages fall back to a plain Drive link.
driveReachable = false
const offline = await (await call('/api/galleries')).json()
assert.equal(offline.available, false)
assert.equal(offline.reason, 'drive-unavailable')
assert.equal(offline.driveUrl, `https://drive.google.com/drive/folders/${ROOT}`)
assert.deepEqual(offline.photos, [])

console.log('drive-gallery handler: all assertions passed')
