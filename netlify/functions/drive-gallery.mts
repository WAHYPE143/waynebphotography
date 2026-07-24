import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

/**
 * Lists a public Google Drive folder so client galleries stay in sync with Drive.
 *
 * GET /api/galleries              -> the root client-galleries folder
 * GET /api/galleries/:folderId    -> one gallery folder (must be a child of the root)
 *
 * Listings are cached in Netlify Blobs. If Drive is unreachable or the folder is
 * not shared publicly, the last good listing is served instead, and if there has
 * never been one the response reports `available: false` so the page can fall
 * back to a plain "open in Drive" link.
 */

const FALLBACK_ROOT_FOLDER_ID = '108HdgZoiORmD3pswZS3ElaZh2Ur3yJHt'
const CACHE_TTL_MS = 30 * 60 * 1000
const IMAGE_NAME = /\.(jpe?g|png|webp|gif|avif|heics?|heif|tiff?)$/i

type DriveItem = { id: string; name: string }
type Listing = { id: string; name: string; folders: DriveItem[]; photos: DriveItem[] }
type CachedListing = Listing & { fetchedAt: number }

function rootFolderId(): string {
  return process.env.DRIVE_GALLERIES_FOLDER_ID || FALLBACK_ROOT_FOLDER_ID
}

function folderUrl(id: string): string {
  return `https://drive.google.com/drive/folders/${id}`
}

function isFolderId(value: string): boolean {
  return /^[A-Za-z0-9_-]{10,80}$/.test(value)
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

/** Turns Drive's embedded folder view HTML into a listing of subfolders and images. */
export function parseListing(folderId: string, html: string): Listing {
  const folders: DriveItem[] = []
  const photos: DriveItem[] = []

  const entries = html.split(/<div class="flip-entry"/).slice(1)
  for (const entry of entries) {
    const idMatch = entry.match(/id="entry-([A-Za-z0-9_-]{10,80})"/)
    const titleMatch = entry.match(/class="flip-entry-title"[^>]*>([\s\S]*?)<\//)
    if (!idMatch || !titleMatch) continue

    const id = idMatch[1]
    const name = decodeEntities(titleMatch[1].replace(/<[^>]+>/g, ''))
    if (!name) continue

    const iconMatch = entry.match(/<img[^>]+src="([^"]*)"/)
    const icon = iconMatch ? iconMatch[1] : ''
    // Drive marks folders with a folder/collection icon; names without a file
    // extension are folders too (its icon markup has changed over the years).
    // Everything else is classified by extension — icon URLs are not a reliable
    // signal for file types because the path itself contains "images".
    const looksLikeFolder = /folder|collection/i.test(icon) || !/\.[A-Za-z0-9]{2,5}$/.test(name)

    if (IMAGE_NAME.test(name)) {
      photos.push({ id, name })
    } else if (looksLikeFolder) {
      folders.push({ id, name })
    }
  }

  if (folders.length === 0 && photos.length === 0) {
    throw new Error('no-entries')
  }

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/)
  const name = titleMatch ? decodeEntities(titleMatch[1]).replace(/\s*-\s*Google Drive\s*$/i, '') : ''

  const collate = (a: DriveItem, b: DriveItem) => a.name.localeCompare(b.name, 'en', { numeric: true })
  return { id: folderId, name, folders: folders.sort(collate), photos: photos.sort(collate) }
}

async function fetchListing(folderId: string): Promise<Listing> {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#list`, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml',
      'accept-language': 'en-US,en;q=0.9',
    },
  })
  if (!res.ok) throw new Error(`drive-status-${res.status}`)
  return parseListing(folderId, await res.text())
}

/**
 * Returns a listing plus how it was obtained. Fresh cache wins, then Drive,
 * then stale cache. `null` means Drive has never been listed successfully.
 */
async function getListing(folderId: string): Promise<{ listing: CachedListing; stale: boolean } | null> {
  // Caching is an optimisation, so a store that is unavailable degrades to
  // fetching Drive on every request rather than failing the response.
  let store: ReturnType<typeof getStore> | null = null
  try {
    store = getStore('drive-galleries')
  } catch {
    store = null
  }
  const key = `folder-${folderId}`

  let cached: CachedListing | null = null
  try {
    cached = ((await store?.get(key, { type: 'json' })) as CachedListing | null) ?? null
  } catch {
    cached = null
  }

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { listing: cached, stale: false }
  }

  try {
    const fresh: CachedListing = { ...(await fetchListing(folderId)), fetchedAt: Date.now() }
    if (!fresh.name && cached?.name) fresh.name = cached.name
    try {
      await store?.setJSON(key, fresh)
    } catch {
      // Cache writes are best effort; a failed write must not fail the request.
    }
    return { listing: fresh, stale: false }
  } catch {
    return cached ? { listing: cached, stale: true } : null
  }
}

function unavailable(folderId: string, reason: string) {
  return Response.json(
    {
      folderId,
      driveUrl: folderUrl(folderId),
      available: false,
      reason,
      name: '',
      folders: [],
      photos: [],
    },
    { headers: { 'cache-control': 'public, max-age=60' } },
  )
}

export default async (req: Request, context: Context) => {
  const root = rootFolderId()
  const requested = context.params?.folderId || new URL(req.url).searchParams.get('folder') || root

  if (!isFolderId(requested)) {
    return Response.json({ error: 'Invalid folder id' }, { status: 400 })
  }

  // Only the configured root folder and the galleries inside it may be listed,
  // so this endpoint can never be used as a general-purpose Drive proxy.
  if (requested !== root) {
    const rootResult = await getListing(root)
    if (!rootResult) return unavailable(requested, 'root-unavailable')
    if (!rootResult.listing.folders.some((folder) => folder.id === requested)) {
      return Response.json({ error: 'Unknown gallery' }, { status: 404 })
    }
  }

  const result = await getListing(requested)
  if (!result) return unavailable(requested, 'drive-unavailable')

  const { listing, stale } = result
  return Response.json(
    {
      folderId: listing.id,
      name: listing.name,
      driveUrl: folderUrl(listing.id),
      available: true,
      stale,
      updatedAt: new Date(listing.fetchedAt).toISOString(),
      isRoot: listing.id === root,
      folders: listing.folders.map((folder) => ({ ...folder, driveUrl: folderUrl(folder.id) })),
      photos: listing.photos,
    },
    { headers: { 'cache-control': 'public, max-age=300' } },
  )
}

export const config: Config = {
  path: ['/api/galleries', '/api/galleries/:folderId'],
  method: 'GET',
}
