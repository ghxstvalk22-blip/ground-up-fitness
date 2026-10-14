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

    // Our own pages and files: network first, saved copy when offline.
    // On weak signal (a gym basement), don't wait more than 3 seconds: show the saved copy
    // and let the network finish in the background so the next visit is up to date.
    if (url.origin === self.location.origin) {
        const network = fetch(req).then((res) => {
            if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
            return res;
        });
        const saved = () => caches.match(req, { ignoreSearch: true });
        event.respondWith(new Promise((resolve) => {
            let done = false;
            const finish = (res) => { if (!done && res) { done = true; resolve(res); } };
            const timer = setTimeout(() => saved().then(finish), 3000);
            network.then((res) => { clearTimeout(timer); finish(res); })
                .catch(() => { clearTimeout(timer); saved().then((hit) => hit || (req.mode === "navigate" ? caches.match("index.html") : null)).then((r) => finish(r || Response.error())); });
        }));
        event.waitUntil(network.catch(() => null));
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

// Rest alarms: the site's Worker sends a push when rest is over (works locked or in another app)
self.addEventListener("push", (event) => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }
    const title = typeof data.title === "string" ? data.title.slice(0, 60) : "Rest over. Go!";
    const body = typeof data.body === "string" ? data.body.slice(0, 120) : "Time for your next set.";
    event.waitUntil(self.registration.showNotification(title, {
        body, tag: "gu-rest", renotify: true, vibrate: [300, 100, 300, 100, 300], requireInteraction: false,
        icon: "icons/icon-192.png", badge: "icons/icon-192.png", data: { url: "programs.html?today=1" }
    }));
});
