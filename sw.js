/* =========================================================
   Offline support for the installed app (and the website).
   Pages and files: always try the network first, so updates show up
   right away, and fall back to the saved copy when there's no signal.
   Photos and fonts: use the saved copy if there is one.
   Nothing personal is stored here: logs stay in localStorage.
   ========================================================= */
const CACHE = "gu-site-v1";
const RUNTIME = "gu-media-v1";
const CORE = [
    "./", "index.html", "start.html", "programs.html", "me.html", "exercises.html", "pros.html",
    "tools.html", "basics.html", "supplements.html", "contact.html",
    "styles.css", "splash.js", "script.js", "exercises.js", "muscle-art.js", "manifest.webmanifest",
    "icons/icon-192.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE).then((cache) => Promise.all(CORE.map((url) => cache.add(url).catch(() => null)))));
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys()
        .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k))))
        .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);

    // Our own pages and files: network first, saved copy when offline
    if (url.origin === self.location.origin) {
        event.respondWith(fetch(req).then((res) => {
            if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
            return res;
        }).catch(() => caches.match(req, { ignoreSearch: true })
            .then((hit) => hit || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))));
        return;
    }

    // Photos and fonts: saved copy first
    if (/images\.unsplash\.com|fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
        event.respondWith(caches.open(RUNTIME).then((cache) => cache.match(req).then((hit) => hit || fetch(req).then((res) => {
            if (res.ok || res.type === "opaque") cache.put(req, res.clone());
            return res;
        }))));
    }
});

// Tapping a rest-timer alert opens the app (or brings it to the front)
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || "programs.html";
    event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
        const open = list.find((c) => "focus" in c);
        return open ? open.focus() : self.clients.openWindow(url);
    }));
});
