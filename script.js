/* =========================================================
   GROUND UP FITNESS — script.js

   HOW THIS FILE IS ORGANIZED
   Each feature lives in its own setupSomething() block below.
   To add a new feature later:
     1. Write a new function, e.g. function setupWorkoutLog() { ... }
     2. Add its name to the FEATURES list just below.
   If one feature has an error, the others keep working.

   Links: features can teach the router new addresses with
   addRoute(pattern, handler). See setupPrograms() for an example.

   Pages: the site has one HTML file per menu tab. The header, menus,
   footer, and "Jump to" dialog are built once, in setupLayout(), from
   SITE_NAV below, so a menu change only happens in one place.
   Each feature checks for its own elements and quietly does nothing
   on pages that don't have them.
   ========================================================= */

/* ---------- CONTACT FORM SETTINGS (the one place you need to edit) ----------
   1. Go to https://web3forms.com, enter the email you want messages
      sent to, and they email you a free access key.
   2. Paste the key between the quotes below.
   fallbackEmail is optional: if the key is empty, the form opens the
   visitor's email app addressed to this email. */
const CONTACT_CONFIG = {
    web3formsKey: "",
    fallbackEmail: ""
};

/* ---------- Feature list: add new setup functions here ---------- */
const FEATURES = [
    setupLayout,     // keep first: builds the header and footer the others use
    setupTheme,
    setupMenu,
    setupDropdowns,
    setupActiveNav,
    setupExerciseGuide,
    setupPrograms,
    setupProgressPanel,
    setupHero,
    setupChecklists,
    setupRestTimer,
    setupLibrary,
    setupWeightTrend,
    setupTools,
    setupContactForm,
    setupLinks,      // keep after features that add routes
    setupJump
];

/* ---------- Site menu: one place for every page's header and footer ----------
   Each top-level entry is a page. "items" become its dropdown.
   An item is [title, short description, link], or "divider".
   The Programs dropdown is filled in from PROGRAMS automatically. */
const SITE_NAV = [
    { label: "Start here", href: "start.html", page: "start", items: [
        ["I'm new to the gym", "Your first two weeks, step by step", "start.html#path-new"],
        ["I want to lose weight", "Eat a little less, keep your muscle", "start.html#path-lose"],
        ["I want to get stronger", "Barbell basics and steady progress", "start.html#path-strength"],
        "divider",
        ["Your first day", "What to bring, what to do, start to finish", "start.html#first-day"],
        ["The 5-minute warm-up", "Do this before every workout", "start.html#warm-up"],
        ["Gym words, decoded", "Sets, reps, failure, deload, and more", "start.html#glossary"]
    ] },
    { label: "Programs", href: "programs.html", page: "programs", items: "programs" },
    { label: "Exercises", href: "exercises.html", page: "exercises", items: [
        ["Exercise library", "Every exercise, with form guides and demos", "exercises.html"],
        "divider",
        ["Legs", "Squats, lunges, hinges, calves", "exercises.html#legs"],
        ["Chest", "Presses and flys", "exercises.html#chest"],
        ["Back", "Pulldowns, pull-ups, rows", "exercises.html#back"],
        ["Shoulders", "Presses and raises", "exercises.html#shoulders"],
        ["Arms", "Curls and triceps", "exercises.html#arms"],
        ["Core", "Planks, carries, crunches", "exercises.html#core"],
        ["Cardio", "Intervals and steady work", "exercises.html#cardio"]
    ] },
    { label: "Pros", href: "pros.html", page: "pros", items: [
        ["Train like a pro", "Six habits every champion shares", "pros.html"],
        ["Learn from the pros", "Olympia champions and record holders", "pros.html#pro-links"],
        "divider",
        ["Classic Physique plan", "A bodybuilding split to follow", "programs.html#program-classic"]
    ] },
    { label: "Tools", href: "tools.html", page: "tools", items: [
        ["Calorie estimator", "Daily calories and protein", "tools.html#tool-calories"],
        ["One-rep max", "Estimate your max and working weights", "tools.html#tool-1rm"],
        ["Plate loader", "Which plates go on the bar", "tools.html#tool-plates"],
        ["Weight trend", "Your 7-day average, not daily noise", "tools.html#tool-weight"]
    ] },
    { label: "Gym basics", href: "basics.html", page: "basics", items: [
        ["What weight should I use?", "", "basics.html#faq-weight"],
        ["How often should I train?", "", "basics.html#faq-often"],
        ["Will lifting make me bulky?", "", "basics.html#faq-bulky"],
        ["Cardio or weights for fat loss?", "", "basics.html#faq-cardio"],
        ["I'm sore. Should I skip?", "", "basics.html#faq-sore"],
        ["The unwritten gym rules", "", "basics.html#faq-etiquette"],
        ["How much protein do I need?", "", "basics.html#faq-protein"]
    ] },
    { label: "Contact", href: "contact.html", page: "contact", items: [
        ["Send a message", "Any question at all", "contact.html#contact-general"],
        ["Help getting started", "Not sure where to begin?", "contact.html#contact-beginner"],
        ["Ask about a program", "Swaps, schedules, sticking points", "contact.html#contact-program"]
    ] }
];

// Unsplash photos used on the site (free under the Unsplash License), credited in the footer
const PHOTO_CREDITS = [
    ["Victor Freitas", "https://unsplash.com/@victorfreitas"],
    ["Sven Mieke", "https://unsplash.com/@sxoxm"],
    ["Edgar Chaparro", "https://unsplash.com/@echaparro"],
    ["Anastase Maragos", "https://unsplash.com/@visualsbyroyalz"],
    ["Karsten Winegeart", "https://unsplash.com/@_karsten"],
    ["Tyler Raye", "https://unsplash.com/@tcraye"],
    ["Ambitious Studio | Rick Barrett", "https://unsplash.com/@weareambitious"]
];

/* ---------- Shared app state and helpers ---------- */
const App = {
    routes: [],
    closeMenus: () => {}
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function addRoute(pattern, handler) {
    App.routes.push({ pattern, handler });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const store = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (e) { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
    },
    remove(key) {
        try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
};

const fmt = (n) => Math.round(n).toLocaleString("en-US");

// Which page we're on, as named in <body data-page="...">
const currentPage = () => document.body.dataset.page || "home";

// Normalize a path so ".../" and ".../index.html" count as the same page
const pagePath = (path) => path.replace(/index\.html$/, "");

// True when a link points somewhere on the page that's already open
function isSamePage(href) {
    try {
        const url = new URL(href, location.href);
        return url.origin === location.origin && pagePath(url.pathname) === pagePath(location.pathname);
    } catch (e) { return false; }
}

// Send the visitor to a link: scroll if it's on this page, otherwise load the other page
function navigate(href) {
    const url = new URL(href, location.href);
    if (isSamePage(href) && url.hash && goTo(url.hash)) return;
    location.href = url.href;
}

document.addEventListener("DOMContentLoaded", () => {
    FEATURES.forEach((feature) => {
        try { feature(); } catch (err) { console.error(`${feature.name} failed:`, err); }
    });
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});

/* =========================================================
   FEATURE: Shared header, footer, and Jump-to dialog
   Built from SITE_NAV so every page has the same menus.
   ========================================================= */
function setupLayout() {
    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");
    const page = currentPage();

    const programItems = () => Object.entries(PROGRAMS).map(([key, p]) => [
        p.name,
        `${Object.keys(p.plans).join(" or ")} days · ${p.tagline || ""}`.replace(/ · $/, ""),
        `programs.html#program-${key}`
    ]);

    const menuItem = (item) => item === "divider"
        ? `<li class="divider" role="separator"></li>`
        : `<li><a href="${item[2]}"><strong>${escapeHtml(item[0])}</strong>${item[1] ? `<span class="sub-desc">${escapeHtml(item[1])}</span>` : ""}</a></li>`;

    const navHtml = SITE_NAV.map((entry) => {
        const items = entry.items === "programs" ? programItems() : entry.items;
        const id = `menu-${entry.page}`;
        const here = entry.page === page;
        return `
            <li class="nav-item has-menu">
                <a class="nav-link${here ? " active" : ""}" href="${entry.href}"${here ? ' aria-current="page"' : ""}>${escapeHtml(entry.label)}</a>
                <button class="submenu-toggle" type="button" aria-expanded="false" aria-controls="${id}">
                    <span class="visually-hidden">Show ${escapeHtml(entry.label)} links</span>
                </button>
                <ul class="submenu" id="${id}">${items.map(menuItem).join("")}</ul>
            </li>`;
    }).join("");

    if (headerSlot) {
        headerSlot.outerHTML = `
<header class="site-header">
    <div class="header-inner">
        <a class="brand" href="index.html"${page === "home" ? ' aria-current="page"' : ""}><span class="brand-mark" aria-hidden="true"></span>Ground Up</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" aria-label="Main">
            <ul class="nav-list">${navHtml}</ul>
        </nav>
        <button class="jump-toggle" type="button" aria-haspopup="dialog" aria-controls="jump">Search <kbd>/</kbd></button>
        <button class="theme-toggle" type="button" aria-pressed="false">Dark mode</button>
    </div>
</header>`;
    }

    if (footerSlot) {
        const credits = PHOTO_CREDITS.map(([name, url]) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>`).join(", ");
        footerSlot.outerHTML = `
<footer class="site-footer">
    <div class="footer-inner">
        <div class="footer-brand">
            <a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"></span>Ground Up</a>
            <p>Free plans for real people. Start where you are.</p>
        </div>
        <nav class="footer-nav" aria-label="Footer">
            <a href="start.html">Start here</a>
            <a href="programs.html">Programs</a>
            <a href="exercises.html">Exercise library</a>
            <a href="pros.html">Train like a pro</a>
            <a href="tools.html">Tools</a>
            <a href="basics.html">Gym basics</a>
            <a href="contact.html">Contact</a>
        </nav>
    </div>
    <div class="footer-fine">
        <p>&copy; <span id="year">2026</span> Ground Up Fitness &middot; Built by Christopher Dippold for ISCI 250</p>
        <p>Information on this site is general fitness education, not medical advice. Check with a doctor before starting if you have a health condition.</p>
        <p>Photos from Unsplash by ${credits}.</p>
        <p class="footer-hint">Press <kbd>/</kbd> anywhere to search the site. <a href="#main">Back to top</a></p>
    </div>
</footer>`;
    }

    if (!document.getElementById("jump")) {
        document.body.insertAdjacentHTML("beforeend", `
<dialog id="jump" class="jump" aria-label="Search the site">
    <div class="jump-inner">
        <label class="visually-hidden" for="jump-input">Where do you want to go?</label>
        <input id="jump-input" type="text" placeholder="Where do you want to go?" autocomplete="off"
               role="combobox" aria-controls="jump-list" aria-expanded="true" aria-autocomplete="list">
        <ul id="jump-list" role="listbox" aria-label="Destinations"></ul>
        <p class="jump-hint">Arrow keys to move, Enter to open, Esc to close</p>
    </div>
</dialog>`);
    }
}

/* =========================================================
   FEATURE: Theme toggle (remembers your choice)
   ========================================================= */
function setupTheme() {
    const root = document.documentElement;
    const button = document.querySelector(".theme-toggle");

    const saved = store.get("theme");
    if (saved) root.dataset.theme = saved;

    const isDark = () =>
        root.dataset.theme
            ? root.dataset.theme === "dark"
            : window.matchMedia("(prefers-color-scheme: dark)").matches;

    const updateLabel = () => {
        // A sun or moon keeps the header compact; the label says what it does
        button.innerHTML = isDark() ? '<span aria-hidden="true">&#9728;</span>' : '<span aria-hidden="true">&#9790;</span>';
        button.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
        button.title = isDark() ? "Light mode" : "Dark mode";
        button.setAttribute("aria-pressed", String(isDark()));
    };

    updateLabel();
    button.addEventListener("click", () => {
        root.dataset.theme = isDark() ? "light" : "dark";
        store.set("theme", root.dataset.theme);
        updateLabel();
    });
}

/* =========================================================
   FEATURE: Mobile menu
   ========================================================= */
function setupMenu() {
    const button = document.querySelector(".menu-toggle");
    const nav = document.getElementById("site-nav");

    button.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
            nav.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        }
    });
}

/* =========================================================
   FEATURE: Dropdown menus
   Desktop: hover or click the arrow. Mobile: tap the arrow.
   Keyboard: Enter/Space opens, arrow keys move, Escape closes.
   ========================================================= */
function setupDropdowns() {
    const items = [...document.querySelectorAll(".has-menu")];

    function setOpen(li, open) {
        li.classList.toggle("open", open);
        li.querySelector(".submenu-toggle").setAttribute("aria-expanded", String(open));
    }
    const closeAll = (except) => items.forEach((li) => { if (li !== except) setOpen(li, false); });

    items.forEach((li) => {
        const btn = li.querySelector(".submenu-toggle");
        const links = () => [...li.querySelectorAll(".submenu a")];

        btn.addEventListener("click", () => {
            const open = !li.classList.contains("open");
            closeAll(li);
            setOpen(li, open);
        });

        li.addEventListener("keydown", (e) => {
            const list = links();
            const i = list.indexOf(document.activeElement);
            if (e.key === "Escape" && li.classList.contains("open")) {
                setOpen(li, false);
                btn.focus();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (!li.classList.contains("open")) { closeAll(li); setOpen(li, true); }
                list[(i + 1) % list.length].focus();
            } else if (e.key === "ArrowUp" && i >= 0) {
                e.preventDefault();
                list[(i - 1 + list.length) % list.length].focus();
            }
        });

        li.addEventListener("focusout", (e) => {
            if (!li.contains(e.relatedTarget)) setOpen(li, false);
        });

        // After picking a link, don't let hover keep the menu open
        li.querySelector(".submenu").addEventListener("click", (e) => {
            if (e.target.closest("a")) li.classList.add("hover-off");
        });
        li.addEventListener("mouseleave", () => li.classList.remove("hover-off"));
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".has-menu")) closeAll();
    });

    App.closeMenus = () => closeAll();
}

/* =========================================================
   FEATURE: Highlight the nav link for the section on screen
   ========================================================= */
function setupActiveNav() {
    // The current page's tab is marked in setupLayout. Here we also mark the dropdown
    // entry for the part of the page you're looking at, and keep it in step as you move.
    const mark = () => {
        document.querySelectorAll("#site-nav .submenu a").forEach((a) => {
            const url = new URL(a.getAttribute("href"), location.href);
            const on = isSamePage(a.href) && url.hash !== "" && url.hash === location.hash;
            a.classList.toggle("is-current", on);
            if (on) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
        });
    };
    mark();
    window.addEventListener("hashchange", mark);
    window.addEventListener("popstate", mark);
    window.addEventListener("routechange", mark);
}

/* =========================================================
   Link router
   Every in-page link goes through goTo(). Features add special
   addresses with addRoute(); anything else is a normal section ID.
     #program-strength      opens the builder on the strength plan
     #program-strength-4    ...with 4 days a week
     #contact-program       opens the form with that topic picked
   ========================================================= */
function goTo(hash, { push = true } = {}) {
    if (!hash || hash === "#") hash = "#top";
    let target = null;
    let afterScroll = null;

    for (const route of App.routes) {
        const match = hash.match(route.pattern);
        if (!match) continue;
        const result = route.handler(match);
        if (result && result.target) {
            target = result.target;
            afterScroll = result.afterScroll || null;
            break;
        }
    }

    if (!target) {
        try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { target = null; }
    }
    if (!target) return false;

    // FAQ answers open when you link straight to them
    if (target.tagName === "DETAILS") target.open = true;

    if (push && location.hash !== hash) history.pushState(null, "", hash);
    window.dispatchEvent(new Event("routechange"));
    App.closeMenus();

    target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });

    if (afterScroll) {
        setTimeout(afterScroll, reduceMotion.matches ? 0 : 500);
    } else {
        if (!target.matches("a, button, input, select, textarea")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
    }

    // Briefly outline smaller targets so you can see where you landed
    if (!target.matches(".block, .hero, main")) {
        target.classList.remove("flash");
        void target.offsetWidth; // restart the animation if clicked twice
        target.classList.add("flash");
        target.addEventListener("animationend", () => target.classList.remove("flash"), { once: true });
    }
    return true;
}

function setupLinks() {
    document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href]");
        if (!a || a.target === "_blank" || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        // Links to a spot on the page that's already open scroll there smoothly;
        // links to other pages load normally (and the hash is handled on arrival)
        if (!isSamePage(a.href)) return;
        const hash = new URL(a.href, location.href).hash;
        if (hash && goTo(hash)) e.preventDefault();
    });

    window.addEventListener("popstate", () => goTo(location.hash, { push: false }));

    // Opening a shared link like index.html#program-fatloss-4
    if (location.hash) requestAnimationFrame(() => goTo(location.hash, { push: false }));
}

/* =========================================================
   FEATURE: Jump-to dialog (press / or Ctrl+K)
   The list is built from the main menu, so new menu links
   show up here automatically.
   ========================================================= */
function setupJump() {
    const dialog = document.getElementById("jump");
    const opener = document.querySelector(".jump-toggle");
    if (typeof dialog.showModal !== "function") { opener.hidden = true; return; }

    const input = document.getElementById("jump-input");
    const list = document.getElementById("jump-list");

    const seen = new Set();
    const destinations = [];
    document.querySelectorAll("#site-nav a").forEach((a) => {
        const href = a.getAttribute("href");
        if (seen.has(href)) return;
        seen.add(href);
        const title = (a.querySelector("strong") || a).textContent.trim();
        const parent = a.closest(".has-menu");
        const group = parent && parent.querySelector(".submenu").contains(a)
            ? parent.querySelector(".nav-link").textContent.trim()
            : "Page";
        destinations.push({ href, title, group });
    });

    let matches = destinations;
    let selected = 0;

    function render() {
        const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        matches = destinations.filter((d) => {
            const text = (d.title + " " + d.group).toLowerCase();
            return words.every((w) => text.includes(w));
        });
        selected = Math.min(selected, Math.max(0, matches.length - 1));

        if (!matches.length) {
            list.innerHTML = `<li class="jump-empty">Nothing matches "${escapeHtml(input.value)}". Try a section name like programs or tools.</li>`;
            input.removeAttribute("aria-activedescendant");
            return;
        }
        list.innerHTML = matches.map((d, i) => `
            <li role="option" id="jump-opt-${i}" data-i="${i}" aria-selected="${i === selected}">
                <span>${escapeHtml(d.title)}</span><span class="jump-group">${escapeHtml(d.group)}</span>
            </li>`).join("");
        input.setAttribute("aria-activedescendant", "jump-opt-" + selected);
        const current = list.children[selected];
        if (current) current.scrollIntoView({ block: "nearest" });
    }

    function open() {
        input.value = "";
        selected = 0;
        render();
        dialog.showModal();
        input.focus();
    }

    function choose(i) {
        const d = matches[i];
        if (!d) return;
        dialog.close();
        navigate(d.href);
    }

    opener.addEventListener("click", open);
    input.addEventListener("input", () => { selected = 0; render(); });
    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); selected = (selected + 1) % Math.max(1, matches.length); render(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); selected = (selected - 1 + matches.length) % Math.max(1, matches.length); render(); }
        else if (e.key === "Enter") { e.preventDefault(); choose(selected); }
    });
    list.addEventListener("click", (e) => {
        const li = e.target.closest("[data-i]");
        if (li) choose(Number(li.dataset.i));
    });
    list.addEventListener("mousemove", (e) => {
        const li = e.target.closest("[data-i]");
        if (li && Number(li.dataset.i) !== selected) { selected = Number(li.dataset.i); render(); }
    });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

    document.addEventListener("keydown", (e) => {
        if (dialog.open) return;
        const typing = e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
        if ((e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
            e.preventDefault();
            open();
        }
    });
}

/* =========================================================
   DATA: Training programs
   To add a program: copy one block below, give it a new key
   (lowercase letters only), and add a matching radio button in
   index.html. To change an exercise, edit its ex(...) line:
     ex(name, sets x reps, rest, easier swap)
   ========================================================= */
const ex = (n, d, rest = "", swap = "") => ({ n, d, rest, swap });

const BEGINNER_A = [
    ex("Goblet squat", "3 × 8–10", "90 s", "Squat down to a bench"),
    ex("Dumbbell bench press", "3 × 8–10", "90 s", "Push-ups with hands on a bench"),
    ex("Lat pulldown", "3 × 10–12", "90 s"),
    ex("Dumbbell Romanian deadlift", "2 × 10", "90 s"),
    ex("Plank", "3 × 20–40 s", "45 s", "Plank on your knees")
];

const PROGRAMS = {
    beginner: {
        name: "New to lifting",
        tagline: "machines and dumbbells",
        rotation: "block", // beginners keep the same exercises for 4 weeks so they can learn them
        summary: "Full-body sessions using machines and dumbbells, so you learn the basic movements without worrying about balance or heavy barbells.",
        session: "45 to 60 minutes",
        effort: "Stop each set with about 2 or 3 good reps left in the tank.",
        progression: "When you hit the top of the rep range on every set, add the smallest jump in weight next time (usually 5 lb or 2.5 kg).",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between, like Mon, Wed, Fri.",
                days: [
                    { title: "Full body A", items: BEGINNER_A },
                    { title: "Full body B", items: [
                        ex("Leg press", "3 × 10–12", "90 s"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "90 s"),
                        ex("Glute bridge", "3 × 12", "60 s"),
                        ex("Dead bug", "3 × 8 per side", "45 s")
                    ] },
                    { title: "Full body A", items: BEGINNER_A }
                ]
            },
            4: {
                schedule: "Upper and lower days, like Mon, Tue, Thu, Fri.",
                days: [
                    { title: "Upper A", items: [
                        ex("Dumbbell bench press", "3 × 8–10", "90 s", "Push-ups with hands on a bench"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Seated dumbbell shoulder press", "2 × 10–12", "90 s"),
                        ex("Lat pulldown", "2 × 10–12", "90 s"),
                        ex("Dumbbell curl", "2 × 12", "60 s")
                    ] },
                    { title: "Lower A", items: [
                        ex("Goblet squat", "3 × 8–10", "90 s", "Squat down to a bench"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "90 s"),
                        ex("Walking lunge", "2 × 10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Standing calf raise", "3 × 12", "60 s"),
                        ex("Plank", "3 × 30 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Upper B", items: [
                        ex("Incline dumbbell press", "3 × 8–10", "90 s"),
                        ex("Chest-supported dumbbell row", "3 × 10", "90 s"),
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Lateral raise", "2 × 12–15", "60 s"),
                        ex("Triceps pushdown", "2 × 12", "60 s")
                    ] },
                    { title: "Lower B", items: [
                        ex("Leg press", "3 × 10–12", "90 s"),
                        ex("Hamstring curl machine", "3 × 10–12", "60 s"),
                        ex("Step-up", "2 × 10 per leg", "60 s", "Lower box or step"),
                        ex("Glute bridge", "3 × 12", "60 s"),
                        ex("Side plank", "2 × 20 s per side", "45 s", "Side plank on your knees")
                    ] }
                ]
            }
        }
    },

    fatloss: {
        name: "Lose fat",
        tagline: "lifting plus conditioning",
        summary: "Lifting keeps the muscle you have while you eat a little less. Short finishers and daily walking add to what you burn. The scale moves because of your eating; the training decides whether you lose fat or muscle.",
        session: "40 to 50 minutes, plus a daily walk",
        effort: "Lifts: 2 reps in reserve. Finishers: hard but controlled, enough that you can only talk in short phrases.",
        progression: "Try to keep your weights the same or slowly going up while you lose. If your strength drops two weeks in a row, eat a little more.",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between. Walk every day.",
                days: [
                    { title: "Full body + intervals", items: [
                        ex("Goblet squat", "3 × 10", "75 s"),
                        ex("Push-up", "3 × 8–12", "75 s", "Hands on a bench"),
                        ex("Seated cable row", "3 × 12", "75 s"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "75 s"),
                        ex("Bike intervals", "6 × 30 s hard, 90 s easy", "", "Brisk incline walk, 15 min")
                    ] },
                    { title: "Full body + carries", items: [
                        ex("Leg press", "3 × 12", "75 s"),
                        ex("Dumbbell shoulder press", "3 × 10", "75 s"),
                        ex("Lat pulldown", "3 × 12", "75 s"),
                        ex("Reverse lunge", "2 × 10 per leg", "75 s", "Split squat holding a rail"),
                        ex("Farmer carry", "4 × 40 steps", "60 s")
                    ] },
                    { title: "Full body + steady cardio", items: [
                        ex("Dumbbell or trap bar deadlift", "3 × 8", "90 s"),
                        ex("Incline dumbbell press", "3 × 10", "75 s"),
                        ex("Chest-supported dumbbell row", "3 × 12", "75 s"),
                        ex("Glute bridge", "3 × 15", "60 s"),
                        ex("Incline treadmill walk", "15 min steady", "")
                    ] }
                ]
            },
            4: {
                schedule: "3 lifting days and 1 conditioning day. Walk every day.",
                days: [
                    { title: "Full body + intervals", items: [
                        ex("Goblet squat", "3 × 10", "75 s"),
                        ex("Push-up", "3 × 8–12", "75 s", "Hands on a bench"),
                        ex("Seated cable row", "3 × 12", "75 s"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "75 s"),
                        ex("Bike intervals", "6 × 30 s hard, 90 s easy", "", "Brisk incline walk, 15 min")
                    ] },
                    { title: "Full body + carries", items: [
                        ex("Leg press", "3 × 12", "75 s"),
                        ex("Dumbbell shoulder press", "3 × 10", "75 s"),
                        ex("Lat pulldown", "3 × 12", "75 s"),
                        ex("Reverse lunge", "2 × 10 per leg", "75 s", "Split squat holding a rail"),
                        ex("Farmer carry", "4 × 40 steps", "60 s")
                    ] },
                    { title: "Conditioning + core", items: [
                        ex("Incline walk or easy bike", "30–40 min", ""),
                        ex("Dead bug", "3 × 8 per side", "45 s"),
                        ex("Side plank", "2 × 20 s per side", "45 s", "Side plank on your knees"),
                        ex("Stretching or mobility", "10 min", "")
                    ] },
                    { title: "Full body + steady cardio", items: [
                        ex("Dumbbell or trap bar deadlift", "3 × 8", "90 s"),
                        ex("Incline dumbbell press", "3 × 10", "75 s"),
                        ex("Chest-supported dumbbell row", "3 × 12", "75 s"),
                        ex("Glute bridge", "3 × 15", "60 s"),
                        ex("Incline treadmill walk", "15 min steady", "")
                    ] }
                ]
            }
        }
    },

    strength: {
        name: "Get stronger",
        tagline: "squat, bench, deadlift",
        summary: "Barbell training built around the squat, bench press, deadlift, and overhead press. Best once you're comfortable with the basic movements.",
        session: "60 to 75 minutes",
        effort: "Main lifts: the last set should feel hard, with clean form. Rest longer on heavy sets.",
        progression: "Add 5 lb (2.5 kg) to upper-body lifts and 10 lb (5 kg) to squats and deadlifts each week while every set is clean. If you stall twice in a row, drop 10% and build back up.",
        plans: {
            3: {
                schedule: "Mon, Wed, Fri, or any 3 days with a rest day between.",
                days: [
                    { title: "Squat + bench", items: [
                        ex("Back squat", "3 × 5", "3 min", "Goblet squat"),
                        ex("Bench press", "3 × 5", "3 min", "Dumbbell bench press"),
                        ex("Barbell row", "3 × 8", "2 min", "Chest-supported dumbbell row"),
                        ex("Plank", "3 × 30 s", "45 s")
                    ] },
                    { title: "Deadlift + press", items: [
                        ex("Deadlift", "3 × 5", "3 min", "Trap bar deadlift"),
                        ex("Overhead press", "3 × 5", "2–3 min", "Seated dumbbell press"),
                        ex("Pull-up", "3 × 6–10", "2 min", "Lat pulldown"),
                        ex("Back extension", "2 × 12", "90 s")
                    ] },
                    { title: "Squat + bench (volume)", items: [
                        ex("Back squat", "3 × 5", "3 min", "Goblet squat"),
                        ex("Bench press", "3 × 5", "3 min", "Dumbbell bench press"),
                        ex("Romanian deadlift", "3 × 8", "2 min"),
                        ex("Hanging knee raise", "3 × 10", "60 s", "Lying leg raise")
                    ] }
                ]
            },
            4: {
                schedule: "Upper and lower days, like Mon, Tue, Thu, Fri.",
                days: [
                    { title: "Upper heavy", items: [
                        ex("Bench press", "4 × 5", "3 min", "Dumbbell bench press"),
                        ex("Barbell row", "4 × 6", "2 min", "Chest-supported dumbbell row"),
                        ex("Overhead press", "3 × 8", "2 min", "Seated dumbbell press"),
                        ex("Pull-up", "3 × 6–10", "2 min", "Lat pulldown"),
                        ex("Barbell curl", "2 × 10", "60 s")
                    ] },
                    { title: "Lower heavy", items: [
                        ex("Back squat", "4 × 5", "3 min", "Goblet squat"),
                        ex("Romanian deadlift", "3 × 8", "2 min"),
                        ex("Leg press", "3 × 10", "90 s"),
                        ex("Standing calf raise", "3 × 12", "60 s")
                    ] },
                    { title: "Upper volume", items: [
                        ex("Overhead press", "4 × 5", "2–3 min", "Seated dumbbell press"),
                        ex("Incline dumbbell press", "3 × 10", "90 s"),
                        ex("Lat pulldown", "3 × 10", "90 s"),
                        ex("Face pull", "3 × 15", "60 s")
                    ] },
                    { title: "Lower volume", items: [
                        ex("Deadlift", "3 × 5", "3 min", "Trap bar deadlift"),
                        ex("Front squat", "3 × 8", "2 min", "Goblet squat"),
                        ex("Walking lunge", "2 × 10 per leg", "90 s"),
                        ex("Ab wheel rollout", "3 × 8", "60 s", "Plank")
                    ] }
                ]
            }
        }
    },

    classic: {
        name: "Classic Physique",
        tagline: "bodybuilding split",
        summary: "A bodybuilding split in the style many physique competitors favor: more weekly sets, every muscle trained hard, and extra work for the shoulders, upper back, and arms that build a V-taper. Best after six months of steady lifting.",
        session: "60 to 75 minutes",
        effort: "Most sets end 1 or 2 reps short of failure. The last set of an isolation move (raises, curls, extensions) can go to failure with clean form.",
        progression: "Double progression: once you hit the top of the rep range on every set, add the smallest weight jump. Log every set; small rep gains each week add up.",
        plans: {
            4: {
                schedule: "Upper and lower days, like Mon, Tue, Thu, Fri.",
                days: [
                    { title: "Upper A", items: [
                        ex("Incline dumbbell press", "3 × 6–8", "2 min", "Incline machine press"),
                        ex("Chest-supported row", "3 × 8–10", "2 min"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "90 s"),
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Cable lateral raise", "3 × 12–15", "60 s", "Dumbbell lateral raise"),
                        ex("EZ-bar curl", "2 × 10–12", "60 s"),
                        ex("Overhead triceps extension", "2 × 10–12", "60 s")
                    ] },
                    { title: "Lower A", items: [
                        ex("Back squat", "3 × 6–8", "3 min", "Hack squat or goblet squat"),
                        ex("Romanian deadlift", "3 × 8–10", "2 min"),
                        ex("Leg press", "3 × 10–12", "90 s"),
                        ex("Leg extension", "2 × 12–15", "60 s"),
                        ex("Seated hamstring curl", "2 × 10–12", "60 s"),
                        ex("Standing calf raise", "4 × 10–15", "60 s")
                    ] },
                    { title: "Upper B", items: [
                        ex("Pull-up", "3 × 6–10", "2 min", "Lat pulldown"),
                        ex("Dumbbell bench press", "3 × 8–10", "2 min"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Cable fly", "2 × 12–15", "60 s"),
                        ex("Lateral raise", "3 × 15–20", "60 s"),
                        ex("Rear delt fly", "3 × 15", "60 s"),
                        ex("Incline dumbbell curl", "2 × 10–12", "60 s"),
                        ex("Triceps pushdown", "2 × 12–15", "60 s")
                    ] },
                    { title: "Lower B", items: [
                        ex("Hack squat", "3 × 8–10", "2 min", "Goblet squat"),
                        ex("Hip thrust", "3 × 8–10", "2 min", "Glute bridge"),
                        ex("Bulgarian split squat", "2 × 10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Lying hamstring curl", "3 × 10–12", "60 s"),
                        ex("Seated calf raise", "4 × 12–15", "60 s"),
                        ex("Cable crunch", "3 × 12–15", "60 s", "Dead bug")
                    ] }
                ]
            },
            5: {
                schedule: "Push, Pull, Legs, rest, Upper, Lower, rest. Or Monday to Friday.",
                days: [
                    { title: "Push", items: [
                        ex("Incline barbell press", "4 × 6–8", "2–3 min", "Incline dumbbell press"),
                        ex("Machine chest press", "3 × 8–10", "2 min", "Flat dumbbell press"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "90 s"),
                        ex("Cable lateral raise", "4 × 12–15", "60 s", "Dumbbell lateral raise"),
                        ex("Cable fly", "2 × 12–15", "60 s"),
                        ex("Overhead triceps extension", "3 × 10–12", "60 s")
                    ] },
                    { title: "Pull", items: [
                        ex("Pull-up", "4 × 6–10", "2 min", "Lat pulldown"),
                        ex("Chest-supported row", "3 × 8–10", "2 min"),
                        ex("Single-arm cable row", "2 × 10–12 per side", "90 s"),
                        ex("Rear delt fly", "3 × 15", "60 s"),
                        ex("EZ-bar curl", "3 × 10–12", "60 s"),
                        ex("Hammer curl", "2 × 12", "60 s")
                    ] },
                    { title: "Legs", items: [
                        ex("Back squat", "4 × 6–8", "3 min", "Hack squat or goblet squat"),
                        ex("Romanian deadlift", "3 × 8–10", "2 min"),
                        ex("Leg press", "3 × 10–12", "90 s"),
                        ex("Leg extension", "3 × 12–15", "60 s"),
                        ex("Seated hamstring curl", "3 × 10–12", "60 s"),
                        ex("Standing calf raise", "4 × 10–15", "60 s")
                    ] },
                    { title: "Upper (shoulders + arms)", items: [
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "2 min"),
                        ex("Close-grip lat pulldown", "3 × 10–12", "90 s"),
                        ex("Incline dumbbell press", "3 × 10", "90 s"),
                        ex("Lateral raise", "4 × 15–20", "60 s"),
                        ex("Incline dumbbell curl", "3 × 10–12", "60 s"),
                        ex("Triceps pushdown", "3 × 12–15", "60 s")
                    ] },
                    { title: "Lower + core", items: [
                        ex("Hack squat", "3 × 8–10", "2 min", "Goblet squat"),
                        ex("Hip thrust", "3 × 8–10", "2 min", "Glute bridge"),
                        ex("Walking lunge", "2 × 10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Lying hamstring curl", "3 × 10–12", "60 s"),
                        ex("Seated calf raise", "4 × 12–15", "60 s"),
                        ex("Hanging knee raise", "3 × 10–15", "60 s", "Lying leg raise")
                    ] }
                ]
            }
        }
    }
};

/* =========================================================
   TRAINING ENGINE: weekly rotation, your log, targets, projections
   Plain functions (no page code), so they're easy to test and reuse.
   ========================================================= */

const ROTATION_BLOCK_WEEKS = 4;
const LOG_KEY = "gu-log";
const PROFILE_KEY = "gu-profile";

// "3 × 8–10" -> { sets: 3, low: 8, high: 10 }. Timed or distance work is marked so it isn't weight-logged.
function parseDose(dose) {
    const m = String(dose).match(/^(\d+)\s*×\s*(\d+)(?:\s*[–-]\s*(\d+))?(.*)$/);
    if (!m) return { sets: 1, low: null, high: null, timed: true, rest: dose };
    const tail = m[4] || "";
    const timed = /\bs\b|min|steps|hard|easy/.test(tail);
    return { sets: Number(m[1]), low: Number(m[2]), high: Number(m[3] || m[2]), timed, rest: tail.trim() };
}
const formatDose = (d, original) => (d.timed ? original : original.replace(/^\d+/, String(d.sets)));

// A small, stable hash so everyone sees the same rotation for the same week
function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
}

function familyFor(name) {
    if (typeof EXERCISE_FAMILIES === "undefined") return null;
    return EXERCISE_FAMILIES.find((f) => f[0] === name) || EXERCISE_FAMILIES.find((f) => f.includes(name)) || null;
}

// Which version of a slot to show in a given week. It never repeats last week's choice.
function rotatedName(name, ctx) {
    const fam = familyFor(name);
    if (!fam || fam.length < 2) return name;
    const period = ctx.mode === "block" ? Math.floor((ctx.week - 1) / ROTATION_BLOCK_WEEKS) : ctx.week - 1;
    let idx = Math.max(0, fam.indexOf(name));
    for (let p = 1; p <= period; p++) {
        idx = (idx + 1 + (hashString(`${ctx.program}|${ctx.days}|${ctx.day}|${ctx.slot}|${p}`) % (fam.length - 1))) % fam.length;
    }
    return fam[idx];
}

// Every exercise in a day for a given week, with swaps applied and no repeats within the day
function dayLineup(program, days, dayIndex, items, week, swaps) {
    const used = new Set();
    return items.map((x, slot) => {
        const mode = PROGRAMS[program].rotation === "block" || slot === 0 ? "block" : "weekly";
        let name = rotatedName(x.n, { program, days, day: dayIndex, slot, week, mode });
        const fam = familyFor(x.n);
        if (fam && used.has(name)) name = fam.find((n) => !used.has(n)) || name;
        const swapped = swaps[`w${week}:${dayIndex}-${slot}`];
        if (swapped) name = swapped;
        used.add(name);
        return { ...x, name, mode, swapped: Boolean(swapped), canRotate: Boolean(fam && fam.length > 1) };
    });
}

// How many different weekly versions a plan can produce
function planCombinations(plan) {
    return plan.days.reduce((total, day) => day.items.reduce((t, x) => {
        const fam = familyFor(x.n);
        return t * (fam ? fam.length : 1);
    }, total), 1);
}
function bigNumber(n) {
    if (n >= 1e9) return "over a billion";
    if (n >= 1e6) return `over ${Math.floor(n / 1e6)} million`;
    if (n >= 1e3) return `over ${fmt(Math.floor(n / 1000) * 1000)}`;
    return fmt(n);
}

/* ---------- Weeks ---------- */
function mondayOf(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const shift = (d.getDay() + 6) % 7; // Monday = 0
    d.setDate(d.getDate() - shift);
    return d;
}
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const c = new Date(d); c.setDate(c.getDate() + n); return c; };
const shortDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

// The Monday a person started a program (saved the first time they open it)
function programStart(program) {
    const key = `gu-start-${program}`;
    let start = store.get(key);
    if (!start) { start = isoDate(mondayOf(new Date())); store.set(key, start); }
    return parseIso(start);
}
const weekOf = (start, date = new Date()) => Math.floor((mondayOf(date) - start) / (7 * 864e5)) + 1;

/* ---------- Profile ---------- */
function getProfile() {
    const p = store.get(PROFILE_KEY, {}) || {};
    return {
        experience: p.experience || "new",
        bodyweight: p.bodyweight || "",
        unit: p.unit || (store.get("gu-unit") === "kg" ? "kg" : "lb"),
        focus: p.focus || ""
    };
}

// Main muscle of an exercise, from the library ("Side shoulders" -> shoulders)
function muscleGroup(name) {
    const m = ((typeof EXERCISES === "object" && EXERCISES[name]) ? EXERCISES[name].m : "").split(",")[0].toLowerCase();
    if (/shoulder|delt/.test(m)) return "shoulders";
    if (/lat|back/.test(m)) return "back";
    if (/chest/.test(m)) return "chest";
    if (/biceps|triceps|forearm/.test(m)) return "arms";
    if (/quad|glute|hamstring|calf|calves|adductor/.test(m)) return "legs";
    return "";
}

// Classic Physique adapts to the person: fewer accessory sets for newer lifters, one extra set for their focus muscle
function personalDose(program, item, slot, profile) {
    const d = parseDose(item.d);
    const notes = [];
    if (program !== "classic" || d.timed) return { text: item.d, notes };
    if (profile.experience === "new" && slot > 0 && d.sets > 2) { d.sets -= 1; notes.push("1 fewer set while you're new"); }
    if (profile.focus && muscleGroup(item.name) === profile.focus && d.sets < 5) { d.sets += 1; notes.push("+1 set for your focus"); }
    return { text: formatDose(d, item.d), notes };
}

/* ---------- Your log ----------
   Saved on this device as { "Exercise name": [ { date, unit, sets: [{ w, r }] } ] } */
const getLog = () => store.get(LOG_KEY, {}) || {};
const toUnit = (w, from, to) => (from === to ? w : to === "kg" ? w / 2.20462 : w * 2.20462);
const roundWeight = (w, unit) => { const step = unit === "kg" ? 1.25 : 2.5; return Math.round(w / step) * step; };
const trimNum = (n) => String(Math.round(n * 100) / 100);

function logFor(name) {
    return (getLog()[name] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
}
function saveSession(name, date, unit, sets) {
    const log = getLog();
    const list = (log[name] || []).filter((e) => e.date !== date);
    list.push({ date, unit, sets });
    log[name] = list;
    store.set(LOG_KEY, log);
    window.dispatchEvent(new CustomEvent("logchange", { detail: { name } }));
}

// Estimated one-rep max (Epley). Very high-rep sets are capped so they don't inflate it.
const e1rm = (w, r) => (r <= 1 ? w : w * (1 + Math.min(r, 15) / 30));
const sessionBest = (entry, unit) => Math.max(...entry.sets.map((s) => e1rm(toUnit(s.w, entry.unit, unit), s.r)));

// Weight jumps: bigger for leg compounds, smaller for everything else
function weightStep(name, unit) {
    const legCompound = muscleGroup(name) === "legs" && !/curl|extension|bridge|calf|raise/i.test(name);
    return unit === "kg" ? (legCompound ? 5 : 2.5) : (legCompound ? 10 : 5);
}

// What to lift next time, based on last time (double progression)
function nextTarget(name, dose, unit) {
    const entries = logFor(name);
    const d = parseDose(dose);
    if (d.timed) return null;
    if (!entries.length) {
        return { first: true, text: `First time? Pick a weight you could do for about 2 more reps than ${d.high}. Log it and you'll get a target next time.` };
    }
    const last = entries[entries.length - 1];
    const sets = last.sets.map((s) => ({ w: roundWeight(toUnit(s.w, last.unit, unit), unit), r: s.r }));
    const lastText = sets.map((s) => (s.w ? `${trimNum(s.w)}×${s.r}` : `${s.r}`)).join(", ");
    const top = Math.max(...sets.map((s) => s.w));
    const working = sets.filter((s) => s.w === top);
    const allTop = working.length >= Math.min(d.sets, sets.length) && working.every((s) => s.r >= d.high);
    const anyLow = working.some((s) => s.r < d.low);

    if (top === 0) {
        return { weight: 0, lastText, text: allTop ? "You hit every rep. Add a rep or two, or try the harder version." : "Aim for one more rep than last time." };
    }
    if (allTop) {
        const w = top + weightStep(name, unit);
        return { weight: w, reps: d.low, lastText, up: true, text: `Go up to ${trimNum(w)} ${unit} for ${d.low}+ reps. You hit the top of the range on every set.` };
    }
    if (anyLow) {
        const prev = entries[entries.length - 2];
        const prevLow = prev && prev.sets.some((s) => roundWeight(toUnit(s.w, prev.unit, unit), unit) === top && s.r < d.low);
        if (prevLow) {
            const w = roundWeight(top * 0.9, unit);
            return { weight: w, reps: d.high, lastText, text: `Two tough sessions in a row. Drop to ${trimNum(w)} ${unit} and build back up. That's normal.` };
        }
        return { weight: top, reps: d.low, lastText, text: `Stay at ${trimNum(top)} ${unit} and try to get ${d.low} reps on every set.` };
    }
    return { weight: top, reps: d.high, lastText, text: `Stay at ${trimNum(top)} ${unit}. Aim for one more rep on your hardest set.` };
}

// Typical weekly strength gain by experience. Conservative on purpose; progress slows over time.
const WEEKLY_GAIN = { new: 0.015, some: 0.0075, lots: 0.0035 };

// Project an exercise's estimated max forward, from its history and the person's experience
function projectLift(name, unit, experience, weeksAhead = 8) {
    const entries = logFor(name);
    if (!entries.length) return null;
    const points = entries.map((e) => ({ date: parseIso(e.date), value: sessionBest(e, unit) }));
    const base = WEEKLY_GAIN[experience] || WEEKLY_GAIN.new;
    let rate = base;
    const first = points[0], last = points[points.length - 1];
    const spanWeeks = (last.date - first.date) / (7 * 864e5);
    if (points.length >= 3 && spanWeeks >= 2) {
        // Least-squares slope, as a share of the starting value per week
        const xs = points.map((p) => (p.date - first.date) / (7 * 864e5));
        const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
        const my = points.reduce((a, p) => a + p.value, 0) / points.length;
        const slope = xs.reduce((a, x, i) => a + (x - mx) * (points[i].value - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);
        const observed = slope / my;
        rate = Math.min(Math.max((observed + base) / 2, 0), base * 2);
    }
    const projection = [];
    for (let w = 1; w <= weeksAhead; w++) {
        projection.push({ date: addDays(last.date, w * 7), value: last.value * Math.pow(1 + rate, w) });
    }
    return { points, projection, rate };
}

/* =========================================================
   FEATURE: Program builder
   Weekly rotation, week-by-week navigation, Swap, How-to,
   set logging with next-session targets, and the personal
   settings that tailor Classic Physique.
   ========================================================= */
function setupPrograms() {
    const $ = (id) => document.getElementById(id);
    const els = {
        head: $("program-head"),
        grid: $("day-grid"),
        label: $("progress-label"),
        fill: $("progress-fill"),
        reset: $("reset-week"),
        copyBtn: $("copy-plan"),
        copyStatus: $("copy-status"),
        goalInputs: [...document.querySelectorAll('input[name="goal"]')],
        dayInputs: [...document.querySelectorAll('input[name="days"]')],
        weekLabel: $("week-label"),
        weekDates: $("week-dates"),
        weekPrev: $("week-prev"),
        weekNext: $("week-next"),
        weekToday: $("week-today"),
        variety: $("week-variety"),
        profileForm: $("profile-form"),
        profileSummary: $("profile-summary"),
        profileNote: $("profile-note")
    };
    if (!els.grid || !els.head) return; // not on the Programs page

    // Open on the plan this person used last time
    const last = store.get("gu-last-plan", {}) || {};
    const state = { goal: PROGRAMS[last.goal] ? last.goal : "beginner", days: Number(last.days) || 3, week: null };
    const swapsKey = () => `gu-swaps-${state.goal}-${state.days}`;
    const progressKey = () => `gu-progress-${state.goal}-${state.days}-w${state.week}`;
    const viewHash = () => `#program-${state.goal}-${state.days}`;
    const currentWeek = () => Math.max(1, weekOf(programStart(state.goal)));
    let lineups = []; // what's on screen, per day
    let firstTipShown = new Set();

    function render({ syncUrl = false } = {}) {
        const p = PROGRAMS[state.goal];
        const available = Object.keys(p.plans).map(Number);
        if (!p.plans[state.days]) {
            state.days = available.reduce((best, d) => (Math.abs(d - state.days) < Math.abs(best - state.days) ? d : best));
        }
        if (!state.week) state.week = currentWeek();
        const plan = p.plans[state.days];
        const profile = getProfile();
        const swaps = store.get(swapsKey(), {}) || {};
        const done = new Set(store.get(progressKey(), []));

        els.goalInputs.forEach((r) => { r.checked = r.value === state.goal; });
        els.dayInputs.forEach((r) => {
            const offered = available.includes(Number(r.value));
            r.disabled = !offered;
            r.closest("label").classList.toggle("is-off", !offered);
            r.closest("label").title = offered ? "" : `${p.name} doesn't have a ${r.value}-day version`;
            r.checked = Number(r.value) === state.days;
        });

        els.head.innerHTML = `
            <div>
                <h3>${escapeHtml(p.name)} &middot; ${state.days} days</h3>
                <p>${escapeHtml(p.summary)}</p>
            </div>
            <dl class="program-meta">
                <div><dt>Schedule</dt><dd>${escapeHtml(plan.schedule)}</dd></div>
                <div><dt>Session</dt><dd>${escapeHtml(p.session)}</dd></div>
                <div><dt>How hard</dt><dd>${escapeHtml(p.effort)}</dd></div>
                <div><dt>Progress by</dt><dd>${escapeHtml(p.progression)}</dd></div>
            </dl>`;

        // Week bar
        const start = programStart(state.goal);
        const monday = addDays(start, (state.week - 1) * 7);
        const now = currentWeek();
        els.weekLabel.textContent = `Week ${state.week}${state.week === now ? " · this week" : state.week > now ? " · preview" : ""}`;
        els.weekDates.textContent = `${shortDate(monday)} – ${shortDate(addDays(monday, 6))}`;
        els.weekPrev.disabled = state.week <= 1;
        els.weekToday.hidden = state.week === now;
        const combos = planCombinations(plan);
        els.variety.textContent = combos > 1
            ? `This plan can be put together ${bigNumber(combos)} different ways. ${p.rotation === "block" ? "Exercises change every 4 weeks." : "Accessories rotate weekly; main lifts every 4 weeks."}`
            : "";

        // Days
        lineups = plan.days.map((day, di) => dayLineup(state.goal, state.days, di, day.items, state.week, swaps));
        const lastWeek = state.week > 1
            ? plan.days.map((day, di) => dayLineup(state.goal, state.days, di, day.items, state.week - 1, swaps))
            : null;

        firstTipShown = new Set();
        els.grid.innerHTML = plan.days.map((day, di) => `
            <article class="day-card" data-day="${di}">
                <header>
                    <span class="day-num">Day ${di + 1} <span class="day-status"></span></span>
                    <h4>${escapeHtml(day.title)}</h4>
                </header>
                <ul class="ex-list">
                    ${lineups[di].map((x, xi) => exerciseRow(x, di, xi, done, profile, lastWeek && lastWeek[di][xi].name !== x.name)).join("")}
                </ul>
            </article>`).join("");

        updateProgress();
        renderProfileNote(profile);
        store.set("gu-last-plan", { goal: state.goal, days: state.days });
        if (syncUrl) history.replaceState(null, "", viewHash());
    }

    function exerciseRow(x, di, xi, done, profile, isNew) {
        const key = `${di}-${xi}`;
        const id = `ex-${key}`;
        const dose = personalDose(state.goal, x, xi, profile);
        const parsed = parseDose(x.d);
        const info = typeof EXERCISES === "object" ? EXERCISES[x.name] : null;
        const easier = x.name === x.n && x.swap ? x.swap : (info && info.easier) || "";
        let target = nextTarget(x.name, dose.text, profile.unit);
        // The "first time" tip shows once per day card, not on every exercise
        if (target && target.first) {
            if (firstTipShown.has(di)) target = null;
            else firstTipShown.add(di);
        }
        const badges = [
            xi === 0 && x.canRotate ? `<span class="badge">Main lift</span>` : "",
            isNew && !x.swapped ? `<span class="badge badge-new">New this week</span>` : "",
            x.swapped ? `<span class="badge">Swapped</span>` : "",
            ...dose.notes.map((n) => `<span class="badge badge-you">${escapeHtml(n)}</span>`)
        ].join("");
        return `
            <li class="ex-row" data-slot="${key}">
                <input type="checkbox" id="${id}" data-key="${key}" ${done.has(key) ? "checked" : ""} aria-label="Done: ${escapeHtml(x.name)}">
                <div class="ex-main">
                    <label for="${id}" class="ex-name">${escapeHtml(x.name)}</label>
                    <span class="ex-dose">${escapeHtml(dose.text)}</span>
                    ${badges ? `<span class="ex-badges">${badges}</span>` : ""}
                    ${x.rest ? (restSeconds(x.rest)
                        ? `<button type="button" class="rest-btn" data-rest="${restSeconds(x.rest)}" data-rest-name="${escapeHtml(x.name)}"><span aria-hidden="true">&#9654;</span> Rest ${escapeHtml(x.rest)}<span class="visually-hidden">: start rest timer</span></button>`
                        : `<span class="ex-rest">Rest ${escapeHtml(x.rest)}</span>`) : ""}
                    ${easier ? `<span class="ex-swap">Easier option: ${escapeHtml(easier)}</span>` : ""}
                    ${target ? `<span class="ex-target${target.up ? " is-up" : ""}">${target.lastText ? `<span class="ex-last">Last time: ${escapeHtml(target.lastText)}</span>` : ""}${escapeHtml(target.text)}</span>` : ""}
                    <span class="ex-actions">
                        ${info ? `<button type="button" class="chip" data-howto="${escapeHtml(x.name)}">How to</button>` : ""}
                        ${x.canRotate ? `<button type="button" class="chip" data-swap="${key}">Swap</button>` : ""}
                        ${!parsed.timed ? `<button type="button" class="chip" data-log="${key}" aria-expanded="false" aria-controls="log-${key}">Log sets</button>` : ""}
                    </span>
                    ${!parsed.timed ? logForm(x, key, parseDose(dose.text), target, profile.unit) : ""}
                </div>
            </li>`;
    }

    function logForm(x, key, dose, target, unit) {
        const weight = target && target.weight ? trimNum(target.weight) : "";
        const rows = Array.from({ length: dose.sets }, (_, i) => `
            <div class="log-set">
                <span class="log-set-num">Set ${i + 1}</span>
                <label><span class="visually-hidden">Set ${i + 1} weight</span><input type="number" inputmode="decimal" min="0" step="any" name="w" value="${weight}" placeholder="0"><span class="log-unit">${unit}</span></label>
                <label><span class="visually-hidden">Set ${i + 1} reps</span><input type="number" inputmode="numeric" min="0" step="1" name="r" placeholder="${dose.high || ""}"><span class="log-unit">reps</span></label>
            </div>`).join("");
        return `
            <form class="log-form" id="log-${key}" data-exercise="${escapeHtml(x.name)}" hidden novalidate>
                <div class="log-date"><label>Date <input type="date" name="date" value="${isoDate(new Date())}" max="${isoDate(new Date())}"></label></div>
                ${rows}
                <p class="log-help">Leave weight at 0 for bodyweight moves. Change the date to add a past workout.</p>
                <div class="log-buttons">
                    <button type="submit" class="btn btn-primary btn-compact">Save sets</button>
                    <button type="button" class="text-button" data-log-cancel="${key}">Cancel</button>
                </div>
                <p class="log-status" role="status"></p>
            </form>`;
    }

    function renderProfileNote(profile) {
        if (!els.profileForm) return;
        const levels = { new: "Newer lifter", some: "6 months to 2 years", lots: "2+ years" };
        const bits = [levels[profile.experience]];
        if (profile.bodyweight) bits.push(`${profile.bodyweight} ${profile.unit}`);
        if (profile.focus) bits.push(`focus: ${profile.focus}`);
        // Until someone fills it in, invite them rather than guessing
        els.profileSummary.textContent = store.get(PROFILE_KEY)
            ? bits.join(" · ")
            : "Tell us your experience and goals for personal targets";
        const notes = [];
        if (profile.bodyweight) {
            const kg = profile.unit === "kg" ? Number(profile.bodyweight) : Number(profile.bodyweight) / 2.20462;
            if (kg > 30) notes.push(`A good daily protein target for you is about ${fmt(kg * 1.6)}–${fmt(kg * 2.2)} g.`);
        }
        if (state.goal === "classic") {
            notes.push(profile.experience === "new"
                ? "Classic Physique is set to 1 fewer set on accessories while you build up."
                : "Classic Physique is using full volume for your experience.");
            if (profile.focus) notes.push(`Exercises for your ${profile.focus} get one extra set.`);
        } else {
            notes.push("Your targets come from what you log. Pick Classic Physique to have the sets tailored too.");
        }
        els.profileNote.textContent = notes.join(" ");
    }

    function updateProgress() {
        const boxes = [...els.grid.querySelectorAll('input[type="checkbox"]')];
        const checked = boxes.filter((b) => b.checked).length;
        const total = boxes.length;
        els.label.textContent = checked === total && total > 0
            ? `Week ${state.week} done. Nice work. Next week's plan is ready when you are.`
            : `${checked} of ${total} exercises done this week`;
        els.fill.style.width = total ? (checked / total) * 100 + "%" : "0";
        let nextFound = false;
        els.grid.querySelectorAll(".day-card").forEach((card) => {
            const dayBoxes = [...card.querySelectorAll('input[type="checkbox"]')];
            const complete = dayBoxes.length > 0 && dayBoxes.every((b) => b.checked);
            card.classList.toggle("complete", complete);
            // The first unfinished day is "up next", so you know where to start at the gym
            const isNext = !complete && !nextFound && state.week === currentWeek();
            if (isNext) nextFound = true;
            card.classList.toggle("is-next", isNext);
            const tag = card.querySelector(".day-status");
            if (tag) tag.textContent = complete ? "Done" : isNext ? "Up next" : "";
        });
    }

    /* ----- Events ----- */
    els.grid.addEventListener("change", (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;
        const keys = [...els.grid.querySelectorAll('input[type="checkbox"]:checked')].map((b) => b.dataset.key);
        store.set(progressKey(), keys);
        updateProgress();
    });

    els.grid.addEventListener("click", (e) => {
        const swapBtn = e.target.closest("[data-swap]");
        if (swapBtn) {
            const [di, xi] = swapBtn.dataset.swap.split("-").map(Number);
            const current = lineups[di][xi];
            const fam = familyFor(current.n) || [current.name];
            const usedToday = new Set(lineups[di].map((x) => x.name));
            let i = fam.indexOf(current.name);
            let next = current.name;
            for (let step = 1; step <= fam.length; step++) {
                const candidate = fam[(i + step) % fam.length];
                if (!usedToday.has(candidate)) { next = candidate; break; }
            }
            const swaps = store.get(swapsKey(), {}) || {};
            swaps[`w${state.week}:${di}-${xi}`] = next;
            store.set(swapsKey(), swaps);
            render();
            const again = els.grid.querySelector(`[data-swap="${di}-${xi}"]`);
            if (again) again.focus();
            return;
        }
        const logBtn = e.target.closest("[data-log]");
        if (logBtn) {
            const form = document.getElementById(`log-${logBtn.dataset.log}`);
            const open = form.hidden;
            form.hidden = !open;
            logBtn.setAttribute("aria-expanded", String(open));
            if (open) {
                const firstEmpty = form.querySelector('input[name="r"]');
                if (firstEmpty) firstEmpty.focus();
            }
            return;
        }
        const cancel = e.target.closest("[data-log-cancel]");
        if (cancel) {
            const key = cancel.dataset.logCancel;
            document.getElementById(`log-${key}`).hidden = true;
            const btn = els.grid.querySelector(`[data-log="${key}"]`);
            btn.setAttribute("aria-expanded", "false");
            btn.focus();
        }
    });

    els.grid.addEventListener("submit", (e) => {
        const form = e.target.closest(".log-form");
        if (!form) return;
        e.preventDefault();
        const unit = getProfile().unit;
        const ws = [...form.querySelectorAll('input[name="w"]')];
        const rs = [...form.querySelectorAll('input[name="r"]')];
        const sets = rs.map((r, i) => ({ w: Number(ws[i].value) || 0, r: Number(r.value) }))
            .filter((s) => Number.isFinite(s.r) && s.r > 0);
        const status = form.querySelector(".log-status");
        if (!sets.length) { status.textContent = "Add the reps for at least one set."; rs[0].focus(); return; }
        const date = form.elements.date.value || isoDate(new Date());
        saveSession(form.dataset.exercise, date, unit, sets);
        const slot = form.id.replace("log-", "");
        const box = document.getElementById(`ex-${slot}`);
        if (box && !box.checked && date === isoDate(new Date())) {
            box.checked = true;
            box.dispatchEvent(new Event("change", { bubbles: true }));
        }
        render();
        const row = els.grid.querySelector(`[data-slot="${slot}"] .ex-target`);
        if (row) row.classList.add("just-saved");
        const btn = els.grid.querySelector(`[data-log="${slot}"]`);
        if (btn) btn.focus();
    });

    els.reset.addEventListener("click", () => {
        store.remove(progressKey());
        render();
    });

    const goToWeek = (w) => { state.week = Math.max(1, w); render(); };
    els.weekPrev.addEventListener("click", () => goToWeek(state.week - 1));
    els.weekNext.addEventListener("click", () => goToWeek(state.week + 1));
    els.weekToday.addEventListener("click", () => goToWeek(currentWeek()));

    els.goalInputs.forEach((r) => r.addEventListener("change", () => {
        state.goal = r.value;
        state.week = null;
        render({ syncUrl: true });
    }));
    els.dayInputs.forEach((r) => r.addEventListener("change", () => {
        state.days = Number(r.value);
        render({ syncUrl: true });
    }));

    // Personal settings
    if (els.profileForm) {
        const profile = getProfile();
        const f = els.profileForm.elements;
        f.experience.value = profile.experience;
        f.bodyweight.value = profile.bodyweight;
        f.unit.value = profile.unit;
        f.focus.value = profile.focus;
        els.profileForm.addEventListener("submit", (e) => e.preventDefault());
        els.profileForm.addEventListener("change", () => {
            const old = getProfile();
            const next = { experience: f.experience.value, bodyweight: f.bodyweight.value, unit: f.unit.value, focus: f.focus.value };
            // Switching units converts the bodyweight you typed
            if (old.unit !== next.unit && next.bodyweight) {
                next.bodyweight = trimNum(Math.round(toUnit(Number(next.bodyweight), old.unit, next.unit) * 10) / 10);
                f.bodyweight.value = next.bodyweight;
            }
            store.set(PROFILE_KEY, next);
            store.set("gu-unit", next.unit);
            render();
            window.dispatchEvent(new CustomEvent("logchange"));
        });
    }

    window.addEventListener("logchange", (e) => { if (e.detail && e.detail.fromPanel) render(); });

    let copyTimer;
    els.copyBtn.addEventListener("click", async () => {
        const url = location.href.split("#")[0] + viewHash();
        let copied = false;
        try { await navigator.clipboard.writeText(url); copied = true; } catch (err) { /* clipboard blocked */ }
        els.copyStatus.textContent = copied
            ? `Link copied. It opens ${PROGRAMS[state.goal].name}, ${state.days} days a week.`
            : "Copy this link: " + url;
        clearTimeout(copyTimer);
        if (copied) copyTimer = setTimeout(() => { els.copyStatus.textContent = ""; }, 4000);
    });

    // Links like #program-fatloss or #program-strength-4
    addRoute(/^#program-([a-z]+)(?:-(\d))?$/, (m) => {
        if (!PROGRAMS[m[1]]) return null;
        if (state.goal !== m[1]) state.week = null;
        state.goal = m[1];
        if (m[2] && PROGRAMS[m[1]].plans[m[2]]) state.days = Number(m[2]);
        render();
        return { target: document.getElementById("programs") };
    });

    render();
}

// "90 s" -> 90, "2 min" -> 120, "2–3 min" -> 120 (the shorter end)
function restSeconds(text) {
    const m = String(text).match(/(\d+)(?:\s*[–-]\s*\d+)?\s*(s|min)/);
    if (!m) return 0;
    return Number(m[1]) * (m[2] === "min" ? 60 : 1);
}

/* =========================================================
   FEATURE: Rest timer
   Any button with data-rest="seconds" starts a countdown bar
   at the bottom of the screen. It buzzes (on phones that allow
   it) and beeps when rest is over.
   ========================================================= */
function setupRestTimer() {
    if (!document.querySelector("#day-grid")) return;
    document.body.insertAdjacentHTML("beforeend", `
<div class="rest-timer" id="rest-timer" hidden>
    <div class="rest-timer-inner">
        <div class="rest-timer-text">
            <span class="rest-timer-label" id="rest-timer-label">Rest</span>
            <strong class="rest-timer-time" id="rest-timer-time" role="timer">0:00</strong>
        </div>
        <div class="rest-timer-bar" aria-hidden="true"><div id="rest-timer-fill"></div></div>
        <div class="rest-timer-buttons">
            <button type="button" class="chip" id="rest-plus">+15 s</button>
            <button type="button" class="chip" id="rest-stop">Done resting</button>
        </div>
    </div>
    <p class="visually-hidden" id="rest-timer-announce" aria-live="assertive"></p>
</div>`);
    const box = document.getElementById("rest-timer");
    const time = document.getElementById("rest-timer-time");
    const label = document.getElementById("rest-timer-label");
    const fill = document.getElementById("rest-timer-fill");
    const announce = document.getElementById("rest-timer-announce");
    let endAt = 0, total = 0, tick = null, audio = null;
    const show = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

    function beep() {
        try {
            audio = audio || new (window.AudioContext || window.webkitAudioContext)();
            [0, 0.25, 0.5].forEach((t) => {
                const o = audio.createOscillator(), g = audio.createGain();
                o.frequency.value = 880;
                g.gain.setValueAtTime(0.18, audio.currentTime + t);
                g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + t + 0.18);
                o.connect(g).connect(audio.destination);
                o.start(audio.currentTime + t);
                o.stop(audio.currentTime + t + 0.2);
            });
        } catch (e) { /* no sound available */ }
    }

    function update() {
        const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
        time.textContent = show(left);
        fill.style.width = total ? `${(left / total) * 100}%` : "0";
        if (left === 0) finish();
    }
    function finish() {
        clearInterval(tick);
        tick = null;
        box.classList.add("is-done");
        label.textContent = "Rest over";
        time.textContent = "Go!";
        announce.textContent = "Rest over. Time for your next set.";
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        beep();
        setTimeout(() => { if (!tick) box.hidden = true; }, 6000);
    }
    function start(seconds, name) {
        total = seconds;
        endAt = Date.now() + seconds * 1000;
        label.textContent = name ? `Rest · ${name}` : "Rest";
        box.hidden = false;
        box.classList.remove("is-done");
        announce.textContent = "";
        clearInterval(tick);
        tick = setInterval(update, 250);
        update();
        // Unlock audio on phones while we still have the tap
        try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === "suspended") audio.resume(); } catch (e) { /* ignore */ }
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-rest]");
        if (btn) start(Number(btn.dataset.rest), btn.dataset.restName);
    });
    document.getElementById("rest-plus").addEventListener("click", () => {
        if (!tick) return;
        endAt += 15000;
        total += 15;
        update();
    });
    document.getElementById("rest-stop").addEventListener("click", () => {
        clearInterval(tick);
        tick = null;
        box.hidden = true;
    });
}

/* =========================================================
   FEATURE: Exercise library page
   Search and filter every exercise; links like exercises.html#back
   open with that muscle picked.
   ========================================================= */
function libraryGroup(name) {
    const x = EXERCISES[name];
    const m = x.m.split(",")[0].toLowerCase();
    if (/heart|lungs/.test(x.m.toLowerCase()) || name === "Stretching or mobility") return "cardio";
    if (/core|abs|oblique/.test(m) || /carry/i.test(name)) return "core";
    return muscleGroup(name) || "core";
}

function setupLibrary() {
    const grid = document.getElementById("library-grid");
    if (!grid || typeof EXERCISES !== "object") return;
    const search = document.getElementById("library-search");
    const count = document.getElementById("library-count");
    const radios = [...document.querySelectorAll('input[name="muscle"]')];
    const names = Object.keys(EXERCISES).sort((a, b) => a.localeCompare(b));
    const group = Object.fromEntries(names.map((n) => [n, libraryGroup(n)]));
    const label = { legs: "Legs", chest: "Chest", back: "Back", shoulders: "Shoulders", arms: "Arms", core: "Core", cardio: "Cardio" };

    function render() {
        const q = search.value.trim().toLowerCase();
        const muscle = (radios.find((r) => r.checked) || {}).value || "";
        const shown = names.filter((n) => (!muscle || group[n] === muscle)
            && (!q || `${n} ${EXERCISES[n].m} ${EXERCISES[n].eq}`.toLowerCase().includes(q)));
        count.textContent = shown.length
            ? `${shown.length} exercise${shown.length === 1 ? "" : "s"}${muscle ? ` for ${label[muscle].toLowerCase()}` : ""}`
            : `No exercises match "${search.value}". Try a simpler word, like press or row.`;
        grid.innerHTML = shown.map((n) => {
            const x = EXERCISES[n];
            return `
                <li class="library-card">
                    <span class="library-tag">${label[group[n]]}</span>
                    <h3>${escapeHtml(n)}</h3>
                    <p class="library-muscles">${escapeHtml(x.m)}</p>
                    <p class="library-eq">${escapeHtml(x.eq)}</p>
                    <p class="library-tip">${escapeHtml(x.tip)}</p>
                    <button type="button" class="btn btn-small" data-howto="${escapeHtml(n)}">How to do it</button>
                </li>`;
        }).join("");
    }

    search.addEventListener("input", render);
    radios.forEach((r) => r.addEventListener("change", () => {
        history.replaceState(null, "", r.value ? `#${r.value}` : location.pathname);
        render();
    }));
    // exercises.html#back opens with Back picked
    radios.forEach((r) => {
        addRoute(new RegExp(`^#${r.value || "all"}$`), () => {
            r.checked = true;
            render();
            return { target: document.getElementById("library") };
        });
    });
    const fromHash = location.hash.slice(1);
    const match = radios.find((r) => r.value && r.value === fromHash);
    if (match) match.checked = true;
    render();
}

/* =========================================================
   FEATURE: Weight trend (Tools page)
   Saved on this device as [{ date, w, unit }]. Shows daily weigh-ins,
   the 7-day average, and the weekly rate of change, with a gentle
   note if loss is faster than generally recommended.
   ========================================================= */
function setupWeightTrend() {
    const form = document.getElementById("weight-form");
    if (!form) return;
    const KEY = "gu-weights";
    const list = document.getElementById("weight-list");
    const svg = document.getElementById("weight-chart");
    const out = document.getElementById("weight-results");
    const status = document.getElementById("weight-status");
    const unit = () => (store.get("gu-unit") === "kg" ? "kg" : "lb");
    form.elements.date.value = isoDate(new Date());
    form.elements.date.max = isoDate(new Date());

    const entries = () => (store.get(KEY, []) || [])
        .map((e) => ({ date: e.date, w: toUnit(e.w, e.unit, unit()) }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Average of the weigh-ins in the 7 days ending on each date
    function averages(items) {
        return items.map((e) => {
            const end = parseIso(e.date);
            const start = addDays(end, -6);
            const win = items.filter((x) => { const d = parseIso(x.date); return d >= start && d <= end; });
            return { date: end, value: win.reduce((s, x) => s + x.w, 0) / win.length };
        });
    }

    function render() {
        const items = entries();
        const u = unit();
        list.innerHTML = items.slice(-7).reverse().map((e) => `
            <li><span>${shortDate(parseIso(e.date))}</span><strong>${trimNum(Math.round(e.w * 10) / 10)} ${u}</strong>
                <button type="button" class="text-button" data-remove-weight="${e.date}" aria-label="Remove ${shortDate(parseIso(e.date))}">Remove</button></li>`).join("");

        if (!items.length) {
            svg.innerHTML = `<text x="260" y="120" text-anchor="middle" class="chart-empty">Add a weigh-in to start your chart.</text>`;
            out.innerHTML = `<p class="result-empty">Add at least a week of weigh-ins to see your trend.</p>`;
            return;
        }

        const avg = averages(items);
        const W = 520, H = 240, pad = { l: 44, r: 14, t: 14, b: 28 };
        const t0 = parseIso(items[0].date).getTime(), t1 = Math.max(parseIso(items[items.length - 1].date).getTime(), t0 + 6 * 864e5);
        const vals = items.map((e) => e.w);
        const lo = Math.min(...vals) - 1, hi = Math.max(...vals) + 1;
        const x = (d) => pad.l + ((d.getTime() - t0) / (t1 - t0)) * (W - pad.l - pad.r);
        const y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
        let g = "";
        for (let i = 0; i <= 3; i++) {
            const v = lo + ((hi - lo) * i) / 3;
            g += `<line class="chart-grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/><text class="chart-label" x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`;
        }
        g += items.map((e) => `<circle class="weight-dot" cx="${x(parseIso(e.date))}" cy="${y(e.w)}" r="3.5"><title>${shortDate(parseIso(e.date))}: ${trimNum(e.w)} ${u}</title></circle>`).join("");
        g += `<path class="chart-line" d="${avg.map((p, i) => `${i ? "L" : "M"}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join("")}"/>`;
        g += `<text class="chart-label" x="${pad.l}" y="${H - 8}">${shortDate(parseIso(items[0].date))}</text>`;
        svg.innerHTML = g;

        const now = avg[avg.length - 1].value;
        const spanDays = (parseIso(items[items.length - 1].date) - parseIso(items[0].date)) / 864e5;
        let trend = `<p class="result-note">Keep logging. Your weekly trend shows up after about a week.</p>`;
        if (spanDays >= 7 && items.length >= 4) {
            // Compare today's 7-day average with the one from about two weeks (or as far as we have) back
            const back = Math.min(14, spanDays);
            const target = addDays(avg[avg.length - 1].date, -back);
            const earlier = avg.reduce((best, p) => (Math.abs(p.date - target) < Math.abs(best.date - target) ? p : best));
            const weeks = Math.max(1, (avg[avg.length - 1].date - earlier.date) / (7 * 864e5));
            const perWeek = (now - earlier.value) / weeks;
            const pct = (perWeek / now) * 100;
            const dir = perWeek < -0.05 ? "losing" : perWeek > 0.05 ? "gaining" : "holding steady at";
            trend = `<div class="result-grid">
                    <div class="result"><span class="result-label">7-day average</span><span class="result-value">${trimNum(Math.round(now * 10) / 10)}<span class="result-unit">${u}</span></span></div>
                    <div class="result"><span class="result-label">Weekly change</span><span class="result-value">${perWeek > 0 ? "+" : ""}${trimNum(Math.round(perWeek * 10) / 10)}<span class="result-unit">${u} / week</span></span></div>
                </div>
                <p class="result-note">You're ${dir} ${dir === "holding steady at" ? "your weight" : `about ${trimNum(Math.abs(Math.round(perWeek * 10) / 10))} ${u} a week (${Math.abs(pct).toFixed(1)}% of your bodyweight)`}.</p>
                ${pct < -1 ? `<p class="result-note warn">That's faster than the 0.5 to 1% a week most experts suggest. Eating a little more can help you keep your muscle and energy. If you're worried about how you're eating, a doctor or registered dietitian can help.</p>` : ""}`;
        } else {
            trend = `<div class="result"><span class="result-label">7-day average</span><span class="result-value">${trimNum(Math.round(now * 10) / 10)}<span class="result-unit">${u}</span></span></div>` + trend;
        }
        out.innerHTML = trend;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const w = Number(form.elements.weight.value);
        const date = form.elements.date.value || isoDate(new Date());
        const kg = unit() === "kg" ? w : w / 2.20462;
        if (!w || kg < 30 || kg > 350) { status.textContent = "Enter your weight to save it."; form.elements.weight.focus(); return; }
        status.textContent = "";
        const all = (store.get(KEY, []) || []).filter((x) => x.date !== date);
        all.push({ date, w, unit: unit() });
        store.set(KEY, all);
        form.elements.weight.value = "";
        render();
    });
    list.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-remove-weight]");
        if (!btn) return;
        store.set(KEY, (store.get(KEY, []) || []).filter((x) => x.date !== btn.dataset.removeWeight));
        render();
    });
    document.querySelectorAll('input[name="unit"]').forEach((r) => r.addEventListener("change", () => setTimeout(render, 0)));
    render();
}

/* =========================================================
   FEATURE: Saved checklists
   Any <div data-checklist="name"> full of checkboxes remembers
   what's ticked on this device.
   ========================================================= */
function setupChecklists() {
    document.querySelectorAll("[data-checklist]").forEach((list) => {
        const key = `gu-checklist-${list.dataset.checklist}`;
        const saved = new Set(store.get(key, []));
        const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
        boxes.forEach((b) => { b.checked = saved.has(b.value); });
        list.addEventListener("change", () => {
            store.set(key, boxes.filter((b) => b.checked).map((b) => b.value));
        });
    });
}

/* =========================================================
   FEATURE: "How to" guide for any exercise
   Any button with data-howto="Exercise name" opens it.
   ========================================================= */
function setupExerciseGuide() {
    if (typeof EXERCISES !== "object") return;
    document.body.insertAdjacentHTML("beforeend", `
<dialog id="howto" class="howto" aria-labelledby="howto-title">
    <div class="howto-inner">
        <div class="howto-head">
            <div>
                <p class="kicker" id="howto-muscles"></p>
                <h2 id="howto-title"></h2>
                <p class="howto-eq" id="howto-eq"></p>
            </div>
            <button type="button" class="howto-close" id="howto-close" aria-label="Close">&times;</button>
        </div>
        <div class="howto-body" id="howto-body"></div>
    </div>
</dialog>`);
    const dialog = document.getElementById("howto");
    if (typeof dialog.showModal !== "function") return;
    let opener = null;

    function open(name) {
        const x = EXERCISES[name];
        if (!x) return;
        const demo = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " proper form")}`;
        const fam = (familyFor(name) || []).filter((n) => n !== name);
        document.getElementById("howto-title").textContent = name;
        document.getElementById("howto-muscles").textContent = x.m;
        document.getElementById("howto-eq").textContent = x.eq;
        document.getElementById("howto-body").innerHTML = `
            <a class="btn btn-primary howto-demo" href="${demo}" target="_blank" rel="noopener noreferrer">Watch a demo on YouTube <span aria-hidden="true">&nearr;</span><span class="visually-hidden">(opens in a new tab)</span></a>
            <h3>Setup</h3>
            <p>${escapeHtml(x.setup)}</p>
            <h3>The movement</h3>
            <ol class="howto-steps">${x.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
            <div class="howto-tip"><strong>The one thing to remember:</strong> ${escapeHtml(x.tip)}</div>
            <h3>Avoid these</h3>
            <ul class="howto-mistakes">${x.mistakes.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
            ${x.easier || x.harder ? `<dl class="howto-levels">
                ${x.easier ? `<div><dt>Too hard?</dt><dd>${escapeHtml(x.easier)}</dd></div>` : ""}
                ${x.harder ? `<div><dt>Too easy?</dt><dd>${escapeHtml(x.harder)}</dd></div>` : ""}
            </dl>` : ""}
            ${fam.length ? `<h3>Works the same muscles</h3><p class="howto-alts">${fam.map((n) => `<button type="button" class="chip" data-howto="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join(" ")}</p>` : ""}
            <p class="fine-print">Stop if something hurts (sharp or joint pain, not muscle burn). Form guides are general advice, not medical advice.</p>`;
        if (!dialog.open) dialog.showModal();
        dialog.querySelector(".howto-inner").scrollTop = 0;
        document.getElementById("howto-close").focus();
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-howto]");
        if (!btn) return;
        if (!dialog.contains(btn)) opener = btn;
        open(btn.dataset.howto);
    });
    document.getElementById("howto-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { if (opener) opener.focus(); });
}

/* =========================================================
   FEATURE: My progress (chart + projection) on the Programs page
   ========================================================= */
function setupProgressPanel() {
    const select = document.getElementById("progress-exercise");
    const svg = document.getElementById("progress-chart");
    const summary = document.getElementById("progress-summary");
    if (!select || !svg) return;

    function exercisesWithLogs() {
        const log = getLog();
        return Object.keys(log)
            .filter((n) => log[n] && log[n].length)
            .sort((a, b) => {
                const la = log[a].map((e) => e.date).sort().pop();
                const lb = log[b].map((e) => e.date).sort().pop();
                return lb.localeCompare(la);
            });
    }

    function fillSelect(preferred) {
        const names = exercisesWithLogs();
        const keep = preferred && names.includes(preferred) ? preferred : names.includes(select.value) ? select.value : names[0];
        select.innerHTML = names.length
            ? names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("")
            : `<option value="">No sessions logged yet</option>`;
        select.disabled = !names.length;
        if (keep) select.value = keep;
    }

    function draw() {
        const profile = getProfile();
        const unit = profile.unit;
        const name = select.value;
        const result = name ? projectLift(name, unit, profile.experience) : null;
        const W = 720, H = 300, pad = { l: 56, r: 20, t: 20, b: 36 };

        if (!result) {
            svg.innerHTML = `<text x="${W / 2}" y="${H / 2}" text-anchor="middle" class="chart-empty">Your chart appears after your first logged session.</text>`;
            summary.innerHTML = `<p>Open any exercise on your plan, tap <strong>Log sets</strong>, and save what you lifted. You can change the date to add workouts you've already done, so your history starts with what you've been doing.</p>`;
            return;
        }

        const all = [...result.points, ...result.projection];
        const t0 = all[0].date.getTime(), t1 = all[all.length - 1].date.getTime();
        const vals = all.map((p) => p.value);
        const lo = Math.min(...vals) * 0.92, hi = Math.max(...vals) * 1.05;
        const x = (d) => pad.l + ((d.getTime() - t0) / Math.max(1, t1 - t0)) * (W - pad.l - pad.r);
        const y = (v) => pad.t + (1 - (v - lo) / Math.max(1, hi - lo)) * (H - pad.t - pad.b);
        const line = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join("");

        let out = "";
        for (let i = 0; i <= 4; i++) {
            const v = lo + ((hi - lo) * i) / 4;
            out += `<line class="chart-grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/>`;
            out += `<text class="chart-label" x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${fmt(v)}</text>`;
        }
        const lastPoint = result.points[result.points.length - 1];
        out += `<text class="chart-label" x="${pad.l}" y="${H - 10}">${shortDate(result.points[0].date)}</text>`;
        out += `<text class="chart-label" x="${x(lastPoint.date)}" y="${H - 10}" text-anchor="middle">Last: ${shortDate(lastPoint.date)}</text>`;
        out += `<text class="chart-label" x="${W - pad.r}" y="${H - 10}" text-anchor="end">${shortDate(result.projection[result.projection.length - 1].date)}</text>`;
        out += `<path class="chart-proj" d="${line([lastPoint, ...result.projection])}"/>`;
        out += `<path class="chart-line" d="${line(result.points)}"/>`;
        out += result.points.map((p) => `<circle class="chart-dot" cx="${x(p.date)}" cy="${y(p.value)}" r="4.5"><title>${shortDate(p.date)}: about ${fmt(p.value)} ${unit}</title></circle>`).join("");
        svg.innerHTML = out;

        const end = result.projection[result.projection.length - 1];
        const target8 = end.value / (1 + 10 / 30);
        summary.innerHTML = `
            <div class="progress-stats">
                <div><span>Estimated max now</span><strong>${fmt(lastPoint.value)} ${unit}</strong></div>
                <div><span>Projected by ${shortDate(end.date)}</span><strong>${fmt(end.value)} ${unit}</strong></div>
                <div><span>Then you'd train with</span><strong>${trimNum(roundWeight(target8, unit))} ${unit} &times; 10</strong></div>
            </div>
            <p>Based on ${result.points.length} logged session${result.points.length === 1 ? "" : "s"}${result.points.length >= 3 ? " and your recent trend" : " and typical progress for your experience"} (about ${(result.rate * 100).toFixed(1)}% a week). This is a projection, not a promise: progress slows as you get stronger, and sleep, food, and stress all play a part. Solid line: what you did. Dashed: where you're headed.</p>`;
    }

    select.addEventListener("change", draw);
    window.addEventListener("logchange", (e) => { fillSelect(e.detail && e.detail.name); draw(); });

    document.getElementById("export-log").addEventListener("click", () => {
        const log = getLog();
        const rows = [["Date", "Exercise", "Set", "Weight", "Unit", "Reps"]];
        Object.entries(log).forEach(([name, entries]) => entries.forEach((e) =>
            e.sets.forEach((s, i) => rows.push([e.date, name, i + 1, s.w, e.unit, s.r]))));
        rows.sort((a, b) => (a[0] === "Date" ? -1 : b[0] === "Date" ? 1 : a[0].localeCompare(b[0])));
        const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = `ground-up-log-${isoDate(new Date())}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    });

    document.getElementById("clear-log").addEventListener("click", () => {
        if (!window.confirm("Delete every logged set on this device? This can't be undone. (Tip: download your log first.)")) return;
        store.remove(LOG_KEY);
        fillSelect();
        draw();
        window.dispatchEvent(new CustomEvent("logchange", { detail: { fromPanel: true } }));
    });

    fillSelect();
    draw();
}

/* =========================================================
   FEATURE: Front page (live stats, quick start card, ticker)
   ========================================================= */
function setupHero() {
    // Stats count what's actually on the site, so they stay right as plans and tools are added
    const counts = {
        goals: Object.keys(PROGRAMS).length,
        plans: Object.values(PROGRAMS).reduce((n, p) => n + Object.keys(p.plans).length, 0),
        tools: 4,
        exercises: typeof EXERCISES === "object" ? Object.keys(EXERCISES).length : 0
    };
    document.querySelectorAll("[data-stat]").forEach((el) => {
        const n = counts[el.dataset.stat];
        if (n === undefined) return;
        el.textContent = n;
        if (!n) el.closest("li").hidden = true; // don't brag about zero
    });

    // Quick start: pick a goal and days, jump straight into that plan
    const form = document.getElementById("quickstart");
    const dayList = document.getElementById("qs-days");
    if (form && dayList) {
        let days = 3;
        const goal = () => (form.querySelector('input[name="qs-goal"]:checked') || {}).value;

        function renderDays() {
            const p = PROGRAMS[goal()];
            if (!p) return;
            const options = Object.keys(p.plans).map(Number);
            if (!options.includes(days)) days = options[0];
            dayList.innerHTML = options.map((d) => `
                <label><input type="radio" name="qs-days" value="${d}" ${d === days ? "checked" : ""}><span>${d} days</span></label>`).join("");
        }

        form.addEventListener("change", (e) => {
            if (e.target.name === "qs-goal") renderDays();
            if (e.target.name === "qs-days") days = Number(e.target.value);
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (PROGRAMS[goal()]) navigate(`programs.html#program-${goal()}-${days}`);
        });
        renderDays();
    }

    // Returning visitors get a shortcut back to their plan
    const last = store.get("gu-last-plan");
    const actions = document.querySelector(".hero-actions");
    if (last && PROGRAMS[last.goal] && actions) {
        const week = Math.max(1, weekOf(programStart(last.goal)));
        actions.insertAdjacentHTML("afterbegin",
            `<a class="btn btn-light" href="programs.html#program-${last.goal}-${last.days}">Continue: ${escapeHtml(PROGRAMS[last.goal].name)}, week ${week}</a>`);
        const second = actions.querySelector('a[href="#get-plan"]');
        if (second) { second.classList.remove("btn-light"); second.classList.add("btn-outline-light"); second.textContent = "Pick a different plan"; }
        const never = actions.querySelector('a[href="start.html"]');
        if (never) never.remove();
    }

    // Ticker: every exercise in every plan, listed twice so the loop is seamless
    const track = document.getElementById("ticker-track");
    if (track) {
        const names = new Set();
        Object.values(PROGRAMS).forEach((p) => Object.values(p.plans).forEach((plan) =>
            plan.days.forEach((d) => d.items.forEach((x) => names.add(x.n)))));
        const row = [...names].map((n) => `<span>${escapeHtml(n)}</span>`).join("");
        track.innerHTML = row + row;
    }
}

/* =========================================================
   DATA: Tool settings
   ========================================================= */
const LB_PER_KG = 2.20462;

const PLATES = {
    lb: [45, 35, 25, 10, 5, 2.5],
    kg: [25, 20, 15, 10, 5, 2.5, 1.25]
};
const PLATE_LOOK = [
    { h: 110, c: "#2b2f36" },
    { h: 100, c: "#3a5a8c" },
    { h: 88,  c: "#c8a227" },
    { h: 72,  c: "#3f7d4a" },
    { h: 58,  c: "#8a9099" },
    { h: 46,  c: "#b23a3a" },
    { h: 38,  c: "#6c6f75" }
];
const BARS = {
    lb: [[45, "Standard bar (45 lb)"], [35, "Lighter bar (35 lb)"]],
    kg: [[20, "Standard bar (20 kg)"], [15, "Lighter bar (15 kg)"]]
};

// Rough guide for training at a percentage of your max
const PERCENT_GUIDE = [
    [95, "2 reps"],
    [90, "3 reps"],
    [85, "5 reps"],
    [80, "6 to 8 reps"],
    [75, "8 to 10 reps"],
    [70, "10 to 12 reps"],
    [60, "Warm-ups and technique"]
];

/* =========================================================
   FEATURE: Tools (calories, one-rep max, plate loader)
   ========================================================= */
function setupTools() {
    const $ = (id) => document.getElementById(id);
    const els = {
        unitInputs: [...document.querySelectorAll('input[name="unit"]')],
        calForm: $("cal-form"),
        calOut: $("cal-results"),
        rmForm: $("rm-form"),
        rmOut: $("rm-results"),
        plateForm: $("plate-form"),
        plateOut: $("plate-results"),
        bar: $("plate-bar")
    };
    if (!els.calForm || !els.rmForm || !els.plateForm) return; // not on the Tools page

    let unit = store.get("gu-unit") === "kg" ? "kg" : "lb";
    const num = (el) => (el.value === "" ? NaN : Number(el.value));
    const roundTo = (n, step) => Math.round(n / step) * step;
    const trim = (n) => String(Math.round(n * 100) / 100);

    /* ----- Units ----- */
    function convertFields(next) {
        const factor = next === "kg" ? 1 / LB_PER_KG : LB_PER_KG;
        ["cal-weight", "rm-weight", "plate-target"].forEach((id) => {
            const el = $(id);
            if (el.value !== "") el.value = trim(Math.round(Number(el.value) * factor * 10) / 10);
        });

        const ft = $("cal-ft"), inch = $("cal-in"), cm = $("cal-cm");
        if (next === "kg" && (ft.value !== "" || inch.value !== "")) {
            cm.value = Math.round(((Number(ft.value) || 0) * 12 + (Number(inch.value) || 0)) * 2.54);
        } else if (next === "lb" && cm.value !== "") {
            const totalIn = Number(cm.value) / 2.54;
            let f = Math.floor(totalIn / 12);
            let i = Math.round(totalIn - f * 12);
            if (i === 12) { f += 1; i = 0; }
            ft.value = f;
            inch.value = i;
        }
    }

    function fillBars() {
        const prevIndex = Math.max(0, els.bar.selectedIndex);
        els.bar.innerHTML = BARS[unit].map(([w, label]) => `<option value="${w}">${label}</option>`).join("");
        els.bar.selectedIndex = Math.min(prevIndex, BARS[unit].length - 1);
    }

    function setUnit(next, { convert = true } = {}) {
        if (convert && next !== unit) convertFields(next);
        unit = next;
        store.set("gu-unit", unit);
        els.unitInputs.forEach((r) => { r.checked = r.value === unit; });
        document.querySelectorAll(".unit-w").forEach((s) => { s.textContent = unit; });
        document.querySelectorAll(".imperial-only").forEach((el) => { el.hidden = unit !== "lb"; });
        document.querySelectorAll(".metric-only").forEach((el) => { el.hidden = unit !== "kg"; });
        fillBars();
        runAll();
    }

    /* ----- Calorie estimator (Mifflin-St Jeor) ----- */
    function calcCalories() {
        const f = els.calForm.elements;
        const age = num(f.age);
        const weight = num(f.weight);
        const kg = unit === "lb" ? weight / LB_PER_KG : weight;
        const cm = unit === "lb"
            ? ((Number(f.ft.value) || 0) * 12 + (Number(f.in.value) || 0)) * 2.54
            : num(f.cm);
        const heightGiven = unit === "lb" ? f.ft.value !== "" : f.cm.value !== "";

        if (isNaN(age) || isNaN(weight) || !heightGiven) {
            els.calOut.innerHTML = `<p class="result-empty">Fill in your age, height, and weight to see your estimate.</p>`;
            return;
        }
        if (age < 18 || age > 90) {
            els.calOut.innerHTML = `<p class="result-empty">This estimator is built for adults 18 to 90.</p>`;
            return;
        }
        if (kg < 35 || kg > 300 || cm < 120 || cm > 230) {
            els.calOut.innerHTML = `<p class="result-empty">Check your height and weight. One of them looks out of range.</p>`;
            return;
        }

        const sex = f.sex.value;
        const bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
        const maintenance = bmr * Number(f.activity.value);
        const delta = Number(f.goal.value);
        const floor = sex === "male" ? 1500 : 1200;
        let target = maintenance + delta;
        const floored = target < floor;
        if (floored) target = floor;

        const proteinLow = 1.6 * kg;
        const proteinHigh = 2.2 * kg;
        const r10 = (n) => Math.round(n / 10) * 10;

        const goalWord = delta < 0 ? "To lose weight" : delta > 0 ? "To gain slowly" : "To maintain";

        els.calOut.innerHTML = `
            <div class="result-grid">
                <div class="result big">
                    <span class="result-label">${goalWord}, eat about</span>
                    <span class="result-value">${fmt(r10(target))}<span class="result-unit">calories a day</span></span>
                </div>
                <div class="result">
                    <span class="result-label">You burn about</span>
                    <span class="result-value">${fmt(r10(maintenance))}<span class="result-unit">cal / day</span></span>
                </div>
                <div class="result">
                    <span class="result-label">Protein</span>
                    <span class="result-value">${fmt(proteinLow)}–${fmt(proteinHigh)}<span class="result-unit">g / day</span></span>
                </div>
            </div>
            ${floored ? `<p class="result-note warn">Your goal would put you below ${fmt(floor)} calories a day, so the target is held at ${fmt(floor)}. Try the slower option instead.</p>` : ""}
            <p class="result-note">This is a starting estimate. Follow it for 2 to 3 weeks, watch your average weight, and adjust by about 100 to 200 calories if it isn't moving the way you want.</p>`;
    }

    /* ----- One-rep max (Epley formula) ----- */
    function calcOneRep() {
        const f = els.rmForm.elements;
        const weight = num(f.weight);
        const reps = num(f.reps);

        if (isNaN(weight) || isNaN(reps)) {
            els.rmOut.innerHTML = `<p class="result-empty">Enter a weight and the reps you did with it.</p>`;
            return;
        }
        if (weight <= 0 || reps < 1 || reps > 12 || !Number.isInteger(reps)) {
            els.rmOut.innerHTML = `<p class="result-empty">Use a whole number of reps from 1 to 12. Estimates get unreliable past 12.</p>`;
            return;
        }

        const max = reps === 1 ? weight : weight * (1 + reps / 30);
        const step = unit === "lb" ? 5 : 2.5;

        els.rmOut.innerHTML = `
            <div class="result big">
                <span class="result-label">Estimated one-rep max</span>
                <span class="result-value">${trim(roundTo(max, step))}<span class="result-unit">${unit}</span></span>
            </div>
            <table class="pct-table">
                <thead><tr><th>% of max</th><th>Weight</th><th>Good for about</th></tr></thead>
                <tbody>
                    ${PERCENT_GUIDE.map(([pct, use]) => `
                        <tr><td>${pct}%</td><td>${trim(roundTo((max * pct) / 100, step))} ${unit}</td><td>${use}</td></tr>`).join("")}
                </tbody>
            </table>`;
    }

    /* ----- Plate loader ----- */
    function calcPlates() {
        const target = num(els.plateForm.elements.target);
        const bar = Number(els.bar.value);

        if (isNaN(target)) {
            els.plateOut.innerHTML = `<p class="result-empty">Enter the total weight you want on the bar, including the bar.</p>`;
            return;
        }
        if (target < bar) {
            els.plateOut.innerHTML = `<p class="result-empty">That's less than the bar by itself, which weighs ${bar} ${unit}.</p>`;
            return;
        }
        if (target > 2000) {
            els.plateOut.innerHTML = `<p class="result-empty">That's more than any bar can hold. Check the number.</p>`;
            return;
        }

        let left = (target - bar) / 2;
        const loaded = [];
        PLATES[unit].forEach((p) => {
            while (left >= p - 1e-9) { loaded.push(p); left -= p; }
        });
        const actual = bar + 2 * loaded.reduce((s, p) => s + p, 0);
        const exact = left < 1e-6;

        const drawing = `
            <div class="barbell" aria-hidden="true">
                <div class="bar-shaft"></div><div class="bar-collar"></div>
                ${loaded.map((p) => {
                    const look = PLATE_LOOK[PLATES[unit].indexOf(p)] || PLATE_LOOK[PLATE_LOOK.length - 1];
                    return `<div class="plate" style="height:${look.h}px;--c:${look.c}" title="${p} ${unit}"></div>`;
                }).join("")}
                <div class="bar-sleeve-end"></div>
            </div>`;

        els.plateOut.innerHTML = `
            ${drawing}
            <p class="plate-list">${loaded.length ? "Each side: " + loaded.map((p) => trim(p)).join(" + ") + " " + unit : "Just the bar. No plates needed."}</p>
            ${exact
                ? `<p class="result-note">Total on the bar: ${trim(actual)} ${unit}.</p>`
                : `<p class="result-note warn">You can't load exactly ${trim(target)} ${unit} with standard plates. The closest you can load below it is ${trim(actual)} ${unit}.</p>`}`;
    }

    function runAll() {
        calcCalories();
        calcOneRep();
        calcPlates();
    }

    els.unitInputs.forEach((r) => r.addEventListener("change", () => setUnit(r.value)));
    els.calForm.addEventListener("input", calcCalories);
    els.calForm.addEventListener("change", calcCalories);
    els.rmForm.addEventListener("input", calcOneRep);
    els.plateForm.addEventListener("input", calcPlates);
    els.plateForm.addEventListener("change", calcPlates);
    [els.calForm, els.rmForm, els.plateForm].forEach((f) => f.addEventListener("submit", (e) => e.preventDefault()));

    setUnit(unit, { convert: false });
}

/* =========================================================
   FEATURE: Contact form (validation, draft saving, sending)
   ========================================================= */
function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return; // not on the Contact page
    const fields = form.elements;
    const status = document.getElementById("form-status");
    const counter = document.getElementById("message-count");
    const draftNote = document.getElementById("draft-note");
    const sendBtn = document.getElementById("send-btn");
    const sendLabel = sendBtn.querySelector(".btn-label");
    const sent = document.getElementById("sent");
    const sentTitle = document.getElementById("sent-title");
    const sentDetail = document.getElementById("sent-detail");
    const DRAFT_KEY = "gu-contact-draft";
    const touched = new Set();

    const rules = {
        name: (v) => (v.trim() ? "" : "Enter your name."),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter an email address like name@example.com."),
        message: (v) => (v.trim().length >= 10 ? "" : "Write a message of at least 10 characters.")
    };

    function check(name) {
        const field = fields[name];
        const error = rules[name](field.value);
        const wrap = field.closest(".field");
        wrap.classList.toggle("invalid", Boolean(error));
        wrap.classList.toggle("valid", !error);
        field.setAttribute("aria-invalid", String(Boolean(error)));
        field.setAttribute("aria-describedby", name + "-error");
        document.getElementById(name + "-error").textContent = error;
        return !error;
    }

    function clearChecks() {
        touched.clear();
        form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
        Object.keys(rules).forEach((n) => {
            fields[n].removeAttribute("aria-invalid");
            document.getElementById(n + "-error").textContent = "";
        });
    }

    Object.keys(rules).forEach((name) => {
        fields[name].addEventListener("blur", () => {
            if (fields[name].value || touched.has(name)) { touched.add(name); check(name); }
        });
        fields[name].addEventListener("input", () => { if (touched.has(name)) check(name); });
    });

    function updateCounter() {
        const n = fields.message.value.length;
        counter.textContent = `${n} / 500`;
        counter.classList.toggle("near", n >= 450);
    }
    fields.message.addEventListener("input", updateCounter);

    /* Draft saving: nothing is lost if you close the tab */
    const draftFields = ["name", "email", "topic", "message"];
    const draft = store.get(DRAFT_KEY);
    if (draft && (draft.name || draft.message)) {
        draftFields.forEach((n) => { if (draft[n]) fields[n].value = draft[n]; });
        draftNote.textContent = "Your unsent draft was restored.";
    }
    updateCounter();

    let draftTimer;
    form.addEventListener("input", () => {
        clearTimeout(draftTimer);
        draftTimer = setTimeout(() => {
            const d = {};
            draftFields.forEach((n) => { d[n] = fields[n].value; });
            store.set(DRAFT_KEY, d);
            draftNote.textContent = "Draft saved on this device.";
        }, 500);
    });

    function setBusy(busy) {
        sendBtn.disabled = busy;
        sendBtn.setAttribute("aria-busy", String(busy));
        sendLabel.textContent = busy ? "Sending..." : "Send message";
    }

    function showStatus(text, isError) {
        status.textContent = text;
        status.classList.toggle("is-error", Boolean(isError));
    }

    function showSent(title, detail) {
        sentTitle.textContent = title;
        sentDetail.textContent = detail;
        form.hidden = true;
        sent.hidden = false;
        sent.focus();
    }

    function finish() {
        store.remove(DRAFT_KEY);
        form.reset();
        clearChecks();
        updateCounter();
        draftNote.textContent = "";
        showStatus("");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (fields.botcheck.checked) return; // a bot filled the hidden box

        Object.keys(rules).forEach((n) => touched.add(n));
        const ok = Object.keys(rules).map(check).every(Boolean);
        if (!ok) {
            showStatus("Fix the highlighted fields, then send again.", true);
            form.querySelector(".invalid input, .invalid textarea").focus();
            return;
        }

        const name = fields.name.value.trim();
        const email = fields.email.value.trim();
        const topic = fields.topic.options[fields.topic.selectedIndex].text;
        const message = fields.message.value.trim();
        const firstName = name.split(" ")[0];
        const { web3formsKey, fallbackEmail } = CONTACT_CONFIG;

        if (!web3formsKey && !fallbackEmail) {
            showStatus("This form isn't connected yet. Add a Web3Forms key or an email at the top of script.js.", true);
            return;
        }

        if (!web3formsKey) {
            const subject = encodeURIComponent(`Website message: ${topic}`);
            const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
            window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
            finish();
            showSent("Almost done", `Your email app opened with the message filled in, ${firstName}. Press send there to finish.`);
            return;
        }

        setBusy(true);
        showStatus("");
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: web3formsKey,
                    subject: `Website message: ${topic}`,
                    from_name: "Ground Up Fitness website",
                    replyto: email,
                    name, email, topic, message
                })
            });
            const result = await res.json().catch(() => ({}));
            if (!res.ok || !result.success) {
                throw new Error(result.message || "The form service didn't accept the message.");
            }
            finish();
            showSent("Message sent", `Thanks, ${firstName}. I'll reply to ${email} about ${topic.toLowerCase()}.`);
        } catch (err) {
            const reason = err instanceof TypeError ? "Couldn't reach the form service." : err.message;
            const backup = fallbackEmail ? ` You can also email ${fallbackEmail} directly.` : "";
            showStatus(`Message not sent. ${reason} Check your connection and send again. Your draft is saved.${backup}`, true);
        } finally {
            setBusy(false);
        }
    });

    document.getElementById("send-another").addEventListener("click", () => {
        sent.hidden = true;
        form.hidden = false;
        fields.name.focus();
    });

    // Links like #contact-program open the form with that topic picked
    const topicValues = [...fields.topic.options].map((o) => o.value);
    addRoute(/^#contact-([a-z]+)$/, (m) => {
        if (!topicValues.includes(m[1])) return null;
        fields.topic.value = m[1];
        if (!sent.hidden) { sent.hidden = true; form.hidden = false; }
        return {
            target: document.getElementById("contact"),
            afterScroll: () => (fields.name.value ? fields.message : fields.name).focus({ preventScroll: true })
        };
    });
}