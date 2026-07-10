// Silently warm the read-only list endpoints on an online load so they're in the
// service-worker cache for offline use. Without this, the map only caches
// /api/camps + /api/art, so the Events list (and any page you didn't open online)
// is empty offline. Best-effort and deferred — never blocks rendering.
const WARM = ['/api/camps', '/api/art', '/api/events']

export default defineNuxtPlugin(() => {
  if (typeof navigator === 'undefined' || !navigator.onLine)
    return
  const run = () => {
    for (const url of WARM)
      fetch(url).catch(() => {})
  }
  // defer past first paint / hydration so it doesn't compete with the map load
  if ('requestIdleCallback' in window)
    (window as any).requestIdleCallback(run, { timeout: 5000 })
  else
    setTimeout(run, 3000)
})
