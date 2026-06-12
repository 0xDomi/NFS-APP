/* ============ NFS Lernapp – Service Worker ============ */
const CACHE = "nfs-app-v3"; // Bei jedem Release erhöhen (zusammen mit APP_VERSION in js/app.js)
const ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./js/views.js",
  "./js/search.js",
  "./manifest.webmanifest",
  "./data/meds_herz.json",
  "./data/meds_acs_rr.json",
  "./data/meds_atemwege.json",
  "./data/meds_analgesie.json",
  "./data/meds_narkose_weitere.json",
  "./data/grundlagen.json",
  "./data/aml.json",
  "./assets/aml/AML_OOe_V5.1_2025.pdf",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // cache:"reload" umgeht den HTTP-Zwischenspeicher → garantiert frische Dateien
      Promise.all(ASSETS.map(a =>
        c.add(new Request(a, { cache: "reload" })).catch(() => c.add(a).catch(() => null))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("message", e => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Navigation (index.html): network-first, damit neue Versionen sofort sichtbar werden
  if (req.mode === "navigate" || (req.destination === "document")) {
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", clone));
        return res;
      }).catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // Alles andere: cache-first (offline-fähig), Netz als Fallback + Nachcachen
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
