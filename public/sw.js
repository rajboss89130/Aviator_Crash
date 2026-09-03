// ============================================================================
// AVIATOR CASINO PWA SERVICE WORKER
// Enables offline capability, instant loading, and standalone app experience
// ============================================================================

const CACHE_NAME = "aviator-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icon.svg",
  "/logo192.png",
  "/logo384.png",
  "/logo512.png",
  "/apple-touch-icon.png",
  "/pixifont.css",
  "/Roboto-Regular.ttf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Failed to precache some assets:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Ignore cross-origin non-GET or chrome-extension schemes
  if (!url.protocol.startsWith("http")) return;

  // Cache-first for images, fonts, and static assets
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|webp|ttf|woff|woff2|css)$/i) ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // Network-first with cache fallback for navigation / HTML
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
        });
      })
  );
});
