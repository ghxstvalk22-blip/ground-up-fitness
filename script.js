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

/* ---------- ACCOUNT SETTINGS (optional) ----------
   Paste the firebaseConfig values from your Firebase project here
   (Project settings > Your apps > Web app). These values are public by
   design; your Firestore security rules are what keep data private.
   Leave them empty and the site keeps everything on the device only. */
const FIREBASE_CONFIG = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
};

/* ---------- FITNESS COACH AI (optional) ----------
   Paste the web address of your Cloudflare Worker here (see coach-ai/README.md),
   e.g. "https://ground-up-coach.yourname.workers.dev". Also add that address to
   connect-src in the Content-Security-Policy on every page. Leave it empty and
   Fitness Coach uses its built-in rules, with nothing sent anywhere. */
const COACH_AI_URL = "https://ground-up-coach.ghxstvalk22.workers.dev";

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
    setupMeTabs,
    setupLogHistory,
    setupActiveWorkout,
    setupAddToWorkout,
    setupMuscleMap,
    setupLevelBar,
    setupStartingPoint,
    setupBuilder,
    setupPlansView,
    setupPlanBar,
    setupSessions,
    setupMyDashboard,
    setupApp,
    setupCoach,
    setupWeightTrend,
    setupDashboard,
    setupResetProgress,
    setupAccount,
    setupTools,
    setupContactForm,
    setupShareWorkout,
    setupLinks,      // keep after features that add routes
    setupPageTransitions,
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
        ["Your first day", "What to bring, what to do, start to finish", "start.html#first-day"]
    ], more: [
        ["The 5-minute warm-up", "Do this before every workout", "start.html#warm-up"],
        ["Gym words, decoded", "Sets, reps, failure, deload, and more", "start.html#glossary"]
    ] },
    { label: "Programs", href: "programs.html", page: "programs", items: "programs", more: [
        ["Build your own workout", "Pick your exercises, get your weights", "programs.html#build"]
    ] },
    { label: "Exercises", href: "exercises.html", page: "exercises", items: [
        ["Find by muscle", "Tap a muscle, see how to train it", "exercises.html#muscle-map"],
        ["Exercise library", "Every exercise, with form guides and demos", "exercises.html#library"]
    ], more: [
        ["Leg exercises", "Squats, lunges, hinges, calves", "exercises.html#legs"],
        ["Chest exercises", "Presses and flys", "exercises.html#chest"],
        ["Back exercises", "Pulldowns, pull-ups, rows", "exercises.html#back"],
        ["Shoulder exercises", "Presses and raises", "exercises.html#shoulders"],
        ["Arm exercises", "Curls and triceps", "exercises.html#arms"],
        ["Core exercises", "Planks, carries, crunches", "exercises.html#core"],
        ["Cardio exercises", "Intervals and steady work", "exercises.html#cardio"]
    ] },
    // Pros and Gym basics are off the menus (owner's call, 2026-10-12); their pages stay up and searchable
    { label: "Pros", href: "pros.html", page: "pros", menu: false, items: [
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
    ], more: [
        ["Workout log", "Every set and rep you've logged", "me.html#log"]
    ] },
    { label: "Gym basics", href: "basics.html", page: "basics", also: ["supplements"], menu: false, items: [
        ["What weight should I use?", "", "basics.html#faq-weight"],
        ["How often should I train?", "", "basics.html#faq-often"],
        ["I'm sore. Should I skip?", "", "basics.html#faq-sore"],
        ["The unwritten gym rules", "", "basics.html#faq-etiquette"],
        ["Do I need supplements?", "", "supplements.html"]
    ], more: [
        ["Will lifting make me bulky?", "", "basics.html#faq-bulky"],
        ["Cardio or weights for fat loss?", "", "basics.html#faq-cardio"],
        ["How much protein do I need?", "", "basics.html#faq-protein"],
        ["Should women train differently?", "", "basics.html#faq-women"],
        ["Use it like an app on your phone", "", "basics.html#faq-app"],
        ["Who can see my logs?", "", "basics.html#faq-privacy"],
        ["Clear my progress", "Start over: delete logs, records, or settings", "me.html#reset-progress"]
    ] },
    { label: "Contact", href: "contact.html", page: "contact", items: [
        ["Send a message", "Any question at all", "contact.html#contact-general"],
        ["Help getting started", "Not sure where to begin?", "contact.html#contact-beginner"],
        ["Ask about a program", "Swaps, schedules, sticking points", "contact.html#contact-program"]
    ] }
];

// "Where to next?" row at the bottom of each page: [label, short reason, link]
const NEXT_STEPS = {
    start: [["Start the beginner plan", "3 days, machines and dumbbells", "programs.html#program-beginner"],
            ["Not ready for a gym?", "Begin at home, no equipment", "programs.html#program-home"],
            ["Browse every exercise", "With how-tos and demos", "exercises.html"]],
    programs: [["Stuck on an exercise?", "Search the exercise library", "exercises.html"],
               ["How much should I eat?", "Calories and protein for your goal", "tools.html#tool-calories"],
               ["Get weights that fit you", "Add your bodyweight", "index.html#setup"]],
    exercises: [["Put them together", "Pick a ready-made plan", "programs.html"],
                ["First time at the gym?", "What to expect, start to finish", "start.html#first-day"],
                ["Gym words, decoded", "Sets, reps, failure, deload", "start.html#glossary"]],
    pros: [["Try the Classic Physique plan", "A bodybuilding split, 4 or 5 days", "programs.html#program-classic"],
           ["Hit your protein", "Find your daily target", "tools.html#tool-calories"],
           ["Check your form", "Every exercise, step by step", "exercises.html"]],
    tools: [["Get a plan that fits", "Two quick questions", "index.html#get-plan"],
            ["Track your lifts", "Log sets on any program", "programs.html#my-progress"],
            ["Get weights that fit you", "Set your level and bodyweight", "index.html#setup"]],
    basics: [["Your first day", "What to bring and what to do", "start.html#first-day"],
             ["Find your plan", "Two quick questions", "index.html#get-plan"],
             ["Still have a question?", "Ask a real person", "contact.html#contact-general"]],
    me: [["Pick up where you left off", "Back to your plan", "programs.html"],
         ["How much should I eat?", "Calories and protein", "tools.html#tool-calories"],
         ["Track your bodyweight", "7-day average trend", "tools.html#tool-weight"]],
    supplements: [["Hit your protein with food first", "Find your daily target", "tools.html#tool-calories"],
                  ["Get a plan that fits", "Two quick questions", "index.html#get-plan"],
                  ["Browse every exercise", "With how-tos and demos", "exercises.html"]],
    contact: [["New here?", "Start with the basics", "start.html"],
              ["See the programs", "Pick one and start this week", "programs.html"]]
};

// Unsplash photos used on the site (free under the Unsplash License), credited in the footer
const PHOTO_CREDITS = [
    ["Victor Freitas", "https://unsplash.com/@victorfreitas"],
    ["Sven Mieke", "https://unsplash.com/@sxoxm"],
    ["Edgar Chaparro", "https://unsplash.com/@echaparro"],
    ["Anastase Maragos", "https://unsplash.com/@visualsbyroyalz"],
    ["Karsten Winegeart", "https://unsplash.com/@_karsten"],
    ["Tyler Raye", "https://unsplash.com/@tcraye"],
    ["Ambitious Studio | Rick Barrett", "https://unsplash.com/@weareambitious"],
    ["John Arano", "https://unsplash.com/@johnarano"],
    ["John Fornander", "https://unsplash.com/@johnfo"]
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

    // The menu lists the main plans; the rest are one click away on the Programs page (and in search)
    const programItems = () => [
        ...Object.entries(PROGRAMS).filter(([, p]) => p.main).map(([key, p]) => [
            p.name,
            `${Object.keys(p.plans).join(" or ")} days · ${p.tagline || ""}`.replace(/ · $/, ""),
            `programs.html#program-${key}`
        ]),
        "divider",
        [`More plans by level`, "Intermediate, Advanced, and Expert", "programs.html#all-plans"]
    ];

    const menuItem = (item) => item === "divider"
        ? `<li class="divider" role="separator"></li>`
        : `<li><a href="${item[2]}"><strong>${escapeHtml(item[0])}</strong>${item[1] ? `<span class="sub-desc">${escapeHtml(item[1])}</span>` : ""}</a></li>`;

    const navHtml = SITE_NAV.filter((entry) => entry.menu !== false).map((entry) => {
        const items = entry.items === "programs" ? programItems() : entry.items;
        const id = `menu-${entry.page}`;
        const here = entry.page === page || (entry.also || []).includes(page);
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
        <a class="me-link build-link" href="programs.html#build"><span class="build-plus" aria-hidden="true">+</span>Build a workout</a>
        <a class="me-link${page === "me" ? " active" : ""}" href="me.html"${page === "me" ? ' aria-current="page"' : ""}><span class="me-dot" aria-hidden="true"></span>My progress</a>
        <button class="jump-toggle" type="button" aria-haspopup="dialog" aria-controls="jump">Search <kbd>/</kbd></button>
        <button class="theme-toggle" type="button" aria-pressed="false">Dark mode</button>
    </div>
</header>`;
    }

    // Phones: an app-style tab bar along the bottom with the places people use most
    const TABS = [
        ["home", "index.html", "Home", '<path d="M4 11.5 12 5l8 6.5V20h-5.5v-5h-5v5H4z"/>'],
        ["programs", "programs.html", "Plans", '<path d="M5 5h14v3H5zM5 10.5h14v3H5zM5 16h9v3H5z"/>'],
        ["build", "programs.html#build", "Build", '<path d="M10.5 4h3v6.5H20v3h-6.5V20h-3v-6.5H4v-3h6.5z"/>'],
        ["exercises", "exercises.html", "Exercises", '<path d="M2 10h3V8h2v8H5v-2H2zM22 10h-3V8h-2v8h2v-2h3zM8 11h8v2H8z"/>'],
        ["me", "me.html", "Progress", '<path d="M4 19h16v2H4zM5 12h3v6H5zM10.5 8h3v10h-3zM16 4h3v14h-3z"/>']
    ];
    if (!document.querySelector(".tabbar")) {
        document.body.insertAdjacentHTML("beforeend", `
<nav class="tabbar" aria-label="Quick links">
    ${TABS.map(([key, href, label, icon]) => `<a href="${href}"${key === page && !(key === "programs" && location.hash === "#build") || (key === "build" && page === "programs" && location.hash === "#build") ? ' aria-current="page"' : ""}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg><span>${label}</span></a>`).join("")}
</nav>`);
        document.body.classList.add("has-tabbar");
        // Plans vs Build share a page; keep the right tab lit when only the #build part changes
        window.addEventListener("hashchange", () => {
            if (page !== "programs") return;
            const build = location.hash === "#build";
            document.querySelectorAll(".tabbar a").forEach((a) => {
                const on = a.getAttribute("href") === (build ? "programs.html#build" : "programs.html");
                if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
            });
        });
    }

    const next = NEXT_STEPS[page];
    if (next && footerSlot) {
        footerSlot.insertAdjacentHTML("beforebegin", `
<nav class="next-steps" aria-labelledby="next-title">
    <div class="container wide">
        <h2 id="next-title">Where to next?</h2>
        <ul>${next.map(([label, why, href]) => `
            <li><a href="${href}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(why)}</span></a></li>`).join("")}
        </ul>
    </div>
</nav>`);
    }

    if (footerSlot) {
        const credits = PHOTO_CREDITS.map(([name, url]) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>`).join(", ");
        footerSlot.outerHTML = `
<footer class="site-footer">
    <div class="footer-inner">
        <div class="footer-brand">
            <a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"></span>Ground Up</a>
            <p>Plans for real people. Start where you are.</p>
        </div>
        <nav class="footer-nav" aria-label="Footer">
            <a href="start.html">Start here</a>
            <a href="programs.html">Programs</a>
            <a href="me.html">My progress</a>
            <a href="exercises.html">Exercise library</a>
            <a href="tools.html">Tools</a>
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

    // "You are here" trail at the top of inner pages
    const banner = document.querySelector(".page-banner-inner");
    const here = SITE_NAV.find((n) => n.page === page) || { me: { label: "My progress" }, supplements: { label: "Supplements" } }[page];
    if (banner && here && !banner.querySelector(".breadcrumbs")) {
        banner.insertAdjacentHTML("afterbegin", `
            <nav class="breadcrumbs" aria-label="You are here">
                <a href="index.html">Ground Up Fitness</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">${escapeHtml(here.label)}</span>
            </nav>`);
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
   FEATURE: Calm page changes
   Moving to another page fades the current one out with a thin
   loading bar, then the new page fades and slides in, so the change
   is visible and nobody loses their place. Skipped for people who
   ask their device to reduce motion.
   ========================================================= */
function setupPageTransitions() {
    if (!document.querySelector(".page-progress")) {
        document.body.insertAdjacentHTML("afterbegin", '<div class="page-progress" aria-hidden="true"></div>');
    }
    // Coming back with the browser's Back button: make sure the page isn't left faded out
    window.addEventListener("pageshow", () => document.documentElement.classList.remove("is-leaving"));

    document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href]");
        if (!a || e.defaultPrevented || a.target === "_blank" || a.hasAttribute("download")) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        let url;
        try { url = new URL(a.href, location.href); } catch (err) { return; }
        if (url.origin !== location.origin || isSamePage(a.href) || !/\.html$|\/$/.test(url.pathname)) return;
        if (reduceMotion.matches) return; // go straight there
        e.preventDefault();
        document.documentElement.classList.add("is-leaving");
        setTimeout(() => { location.href = url.href; }, 260);
    });
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
    // Links trimmed from the menus (and whole sections taken off them), and every plan, are still searchable
    SITE_NAV.forEach((entry) => {
        const extra = entry.menu === false ? [[entry.label, "", entry.href], ...(Array.isArray(entry.items) ? entry.items : []).filter(Array.isArray)] : [];
        [...extra, ...(entry.more || [])].forEach(([title, , href]) => {
            if (!seen.has(href)) { seen.add(href); destinations.push({ href, title, group: entry.label }); }
        });
    });
    Object.entries(PROGRAMS).forEach(([key, p]) => {
        const href = `programs.html#program-${key}`;
        if (!seen.has(href)) { seen.add(href); destinations.push({ href, title: p.name, group: `Programs · ${p.level}` }); }
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
        level: "Beginner", main: true,
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
        level: "Beginner", main: true,
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
        level: "Intermediate",
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

    build: {
        level: "Intermediate",
        name: "Build muscle",
        tagline: "full body",
        summary: "Three full-body sessions a week built for muscle: moderate weights, 8 to 15 reps, and every muscle trained three times a week. A great next step after the beginner plan, and before a bodybuilding split like Classic Physique.",
        session: "50 to 60 minutes",
        effort: "Most sets end 1 or 2 reps short of failure. Control the lowering on every rep; that's where a lot of the muscle-building happens.",
        progression: "Double progression: work up to the top of the rep range on every set, then add the smallest weight jump and build back up.",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between, like Mon, Wed, Fri.",
                days: [
                    { title: "Full body A", items: [
                        ex("Leg press", "3 × 10–12", "2 min"),
                        ex("Incline dumbbell press", "3 × 8–12", "2 min", "Incline machine press"),
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Seated hamstring curl", "3 × 10–12", "60 s"),
                        ex("Lateral raise", "3 × 12–15", "60 s"),
                        ex("Dumbbell curl", "2 × 10–12", "60 s")
                    ] },
                    { title: "Full body B", items: [
                        ex("Hack squat", "3 × 8–12", "2 min", "Goblet squat"),
                        ex("Machine chest press", "3 × 10–12", "90 s"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "2 min"),
                        ex("Triceps pushdown", "2 × 12–15", "60 s"),
                        ex("Standing calf raise", "3 × 12–15", "60 s")
                    ] },
                    { title: "Full body C", items: [
                        ex("Bulgarian split squat", "3 × 10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Dumbbell bench press", "3 × 8–12", "2 min"),
                        ex("Chest-supported row", "3 × 10–12", "90 s"),
                        ex("Hip thrust", "3 × 10–12", "90 s", "Glute bridge"),
                        ex("Rear delt fly", "2 × 15", "60 s"),
                        ex("Hammer curl", "2 × 12", "60 s")
                    ] }
                ]
            }
        }
    },

    glutes: {
        level: "Advanced",
        name: "Glutes & legs focus",
        tagline: "lower body first",
        summary: "For anyone, man or woman, who wants stronger, more shapely glutes and legs. Hip thrusts, hinges, and single-leg work come first each lower day, and upper body still gets trained so you stay balanced.",
        session: "50 to 60 minutes",
        effort: "Stop most sets with 1 or 2 good reps left. On hip thrusts and kickbacks, pause and squeeze at the top of every rep.",
        progression: "Double progression: reach the top of the rep range on every set, then add the smallest weight jump. Single-leg moves: add reps before weight.",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between, like Mon, Wed, Fri.",
                days: [
                    { title: "Glutes & hamstrings", items: [
                        ex("Hip thrust", "4 × 8–12", "2 min", "Glute bridge"),
                        ex("Romanian deadlift", "3 × 8–10", "2 min", "Dumbbell Romanian deadlift"),
                        ex("Hip abduction machine", "3 × 15–20", "60 s"),
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Seated dumbbell shoulder press", "2 × 10–12", "90 s"),
                        ex("Dead bug", "2 × 8 per side", "45 s")
                    ] },
                    { title: "Quads & glutes", items: [
                        ex("Leg press", "3 × 10–12", "2 min", "Goblet squat"),
                        ex("Bulgarian split squat", "3 × 8–10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Cable glute kickback", "3 × 12–15 per leg", "45 s"),
                        ex("Machine chest press", "3 × 10–12", "90 s"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Standing calf raise", "3 × 12–15", "60 s")
                    ] },
                    { title: "Glutes & full body", items: [
                        ex("Hip thrust", "3 × 10–12", "2 min", "Glute bridge"),
                        ex("Step-up", "3 × 10 per leg", "90 s", "Use a lower step"),
                        ex("Seated hamstring curl", "3 × 10–12", "60 s"),
                        ex("Incline dumbbell press", "3 × 10–12", "90 s"),
                        ex("Single-arm dumbbell row", "3 × 10 per side", "60 s"),
                        ex("Hip abduction machine", "2 × 15–20", "60 s")
                    ] }
                ]
            },
            4: {
                schedule: "Lower and upper days, like Mon, Tue, Thu, Fri.",
                days: [
                    { title: "Lower A: glutes", items: [
                        ex("Hip thrust", "4 × 8–12", "2 min", "Glute bridge"),
                        ex("Romanian deadlift", "3 × 8–10", "2 min", "Dumbbell Romanian deadlift"),
                        ex("Bulgarian split squat", "3 × 8–10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Seated hamstring curl", "3 × 10–12", "60 s"),
                        ex("Hip abduction machine", "3 × 15–20", "60 s")
                    ] },
                    { title: "Upper A", items: [
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Machine chest press", "3 × 10–12", "90 s"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Lateral raise", "3 × 12–15", "60 s"),
                        ex("Triceps pushdown", "2 × 12–15", "60 s")
                    ] },
                    { title: "Lower B: quads & glutes", items: [
                        ex("Leg press", "3 × 10–12", "2 min", "Goblet squat"),
                        ex("Cable pull-through", "3 × 12–15", "90 s"),
                        ex("Walking lunge", "3 × 10 per leg", "90 s", "Reverse lunge"),
                        ex("Cable glute kickback", "3 × 12–15 per leg", "45 s"),
                        ex("Standing calf raise", "3 × 12–15", "60 s")
                    ] },
                    { title: "Upper B", items: [
                        ex("Incline dumbbell press", "3 × 10–12", "90 s"),
                        ex("Chest-supported row", "3 × 10–12", "90 s"),
                        ex("Seated dumbbell shoulder press", "3 × 10–12", "90 s"),
                        ex("Face pull", "2 × 15", "60 s"),
                        ex("Dumbbell curl", "2 × 10–12", "60 s"),
                        ex("Plank", "3 × 30 s", "45 s", "Plank on your knees")
                    ] }
                ]
            }
        }
    },

    upper: {
        level: "Advanced",
        name: "Upper body focus",
        tagline: "chest, back, shoulders, arms",
        summary: "For anyone, man or woman, who wants a stronger, more defined upper body. Upper body gets trained more often, and legs still get a full session each week so nothing falls behind.",
        session: "45 to 60 minutes",
        effort: "Stop most sets with 1 or 2 good reps left. Upper-body lifts move in small jumps, so be patient: an extra rep counts as progress.",
        progression: "Double progression: reach the top of the rep range on every set, then add the smallest weight jump (often 2.5 lb or 1 kg on lighter lifts).",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between, like Mon, Wed, Fri.",
                days: [
                    { title: "Upper A: push focus", items: [
                        ex("Dumbbell bench press", "3 × 8–12", "2 min", "Push-up"),
                        ex("Seated dumbbell shoulder press", "3 × 8–12", "90 s"),
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Cable fly", "2 × 12–15", "60 s"),
                        ex("Lateral raise", "3 × 12–15", "60 s"),
                        ex("Triceps pushdown", "2 × 12–15", "60 s")
                    ] },
                    { title: "Legs & core", items: [
                        ex("Leg press", "3 × 10–12", "2 min", "Goblet squat"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "2 min"),
                        ex("Walking lunge", "2 × 10 per leg", "90 s", "Reverse lunge"),
                        ex("Standing calf raise", "3 × 12–15", "60 s"),
                        ex("Dead bug", "3 × 8 per side", "45 s")
                    ] },
                    { title: "Upper B: pull focus", items: [
                        ex("Chest-supported row", "3 × 8–12", "90 s"),
                        ex("Assisted pull-up", "3 × 6–10", "2 min", "Lat pulldown"),
                        ex("Incline dumbbell press", "3 × 8–12", "2 min"),
                        ex("Face pull", "3 × 15", "60 s"),
                        ex("Dumbbell curl", "3 × 10–12", "60 s"),
                        ex("Overhead triceps extension", "2 × 10–12", "60 s")
                    ] }
                ]
            },
            4: {
                schedule: "Like Mon, Tue, Thu, Fri. Legs get one full day; upper body gets three.",
                days: [
                    { title: "Chest & back", items: [
                        ex("Dumbbell bench press", "3 × 8–12", "2 min", "Push-up"),
                        ex("Lat pulldown", "3 × 10–12", "90 s"),
                        ex("Incline machine press", "3 × 10–12", "90 s"),
                        ex("Seated cable row", "3 × 10–12", "90 s"),
                        ex("Cable fly", "2 × 12–15", "60 s")
                    ] },
                    { title: "Legs & core", items: [
                        ex("Leg press", "3 × 10–12", "2 min", "Goblet squat"),
                        ex("Romanian deadlift", "3 × 8–10", "2 min", "Dumbbell Romanian deadlift"),
                        ex("Bulgarian split squat", "2 × 8–10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Standing calf raise", "3 × 12–15", "60 s"),
                        ex("Plank", "3 × 30 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Shoulders & arms", items: [
                        ex("Seated dumbbell shoulder press", "3 × 8–12", "90 s"),
                        ex("Lateral raise", "4 × 12–15", "60 s"),
                        ex("Rear delt fly", "3 × 15", "60 s"),
                        ex("Dumbbell curl", "3 × 10–12", "60 s"),
                        ex("Triceps pushdown", "3 × 12–15", "60 s")
                    ] },
                    { title: "Back & chest", items: [
                        ex("Chest-supported row", "3 × 8–12", "90 s"),
                        ex("Assisted pull-up", "3 × 6–10", "2 min", "Lat pulldown"),
                        ex("Incline dumbbell press", "3 × 8–12", "2 min"),
                        ex("Face pull", "2 × 15", "60 s"),
                        ex("Hammer curl", "2 × 10–12", "60 s"),
                        ex("Overhead triceps extension", "2 × 10–12", "60 s")
                    ] }
                ]
            }
        }
    },

    c25k: {
        level: "Beginner", main: true,
        name: "Couch to 5K",
        tagline: "from walking to a 30-minute run",
        summary: "Go from walking to running 30 minutes without stopping in 9 weeks, 3 runs a week. Each week steps up a little. This page shows that week's runs automatically.",
        session: "About 30 minutes, including a 5-minute walk before and after",
        effort: "Run slowly enough to talk. If a week feels too hard, repeat it; plenty of people do.",
        progression: "The plan does it for you: use the week arrows to see what's coming. After week 9, keep running 3 times a week or try the Cardio plan.",
        source: ["the NHS Couch to 5K running plan", "https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/couch-to-5k-running-plan/"],
        waves: false,
        rotation: "none",
        plans: {
            3: {
                schedule: "3 runs a week with a rest day between each, like Mon, Wed, Fri.",
                weeks: [
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1 min, walk 1½ min. 8 runs in all, ending on a run", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1 min, walk 1½ min. 8 runs in all, ending on a run", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1 min, walk 1½ min. 8 runs in all, ending on a run", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1½ min, walk 2 min. 6 runs in all, ending on a run", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1½ min, walk 2 min. 6 runs in all, ending on a run", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1½ min, walk 2 min. 6 runs in all, ending on a run", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1½ min, walk 1½ min, run 3 min, walk 3 min. Do it twice (skip the last walk)", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1½ min, walk 1½ min, run 3 min, walk 3 min. Do it twice (skip the last walk)", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 1½ min, walk 1½ min, run 3 min, walk 3 min. Do it twice (skip the last walk)", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 3 min, walk 1½ min, run 5 min, walk 2½ min, run 3 min, walk 1½ min, run 5 min", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 3 min, walk 1½ min, run 5 min, walk 2½ min, run 3 min, walk 1½ min, run 5 min", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 3 min, walk 1½ min, run 5 min, walk 2½ min, run 3 min, walk 1½ min, run 5 min", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 5 min, walk 3 min, run 5 min, walk 3 min, run 5 min", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 8 min, walk 5 min, run 8 min", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "20 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 5 min, walk 3 min, run 8 min, walk 3 min, run 5 min", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Run/walk intervals", "Run 10 min, walk 3 min, run 10 min", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "25 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "25 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "25 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "25 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "28 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "28 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "28 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] }],
                [{ title: "Run 1", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "30 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 2", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "30 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] },
                 { title: "Run 3", items: [ex("Brisk walk", "5 min warm-up", ""), ex("Continuous run", "30 min without stopping", ""), ex("Brisk walk", "5 min cool-down", "")] }]
                ]
            }
        }
    },

    gzclp: {
        level: "Advanced",
        name: "Next-level strength",
        tagline: "squat, bench, deadlift, press",
        summary: "A popular free strength program in three tiers: a heavy main lift (Tier 1), a lighter second lift for more reps (Tier 2), and an accessory for high reps (Tier 3). Best after a few months of lifting, once you know the barbell lifts.",
        session: "60 to 75 minutes",
        effort: "Tier 1: 5 sets of 3, with the last set as many good reps as you can. Tier 2: 3 sets of 10. Tier 3: 3 sets of 15, last set as many as you can. Stop any set when your form slips.",
        progression: "Add weight every session you hit all your reps: about 10 lb (5 kg) on squats and deadlifts, 5 lb (2.5 kg) on bench and overhead press. In the original, if you miss reps you switch to 6 × 2, then 10 × 1 at the same weight before resetting.",
        source: ["GZCLP by coach Cody LeFever (community guide)", "https://thefitness.wiki/routines/gzclp/"],
        waves: false,
        plans: {
            4: {
                schedule: "4 days, like Mon, Tue, Thu, Fri. The original also works 3 days a week by rotating through the 4 workouts in order.",
                days: [
                    { title: "A1: Squat day", items: [
                        ex("Back squat", "5 × 3+", "3 min", "Goblet squat"),
                        ex("Bench press", "3 × 10", "2 min", "Dumbbell bench press"),
                        ex("Lat pulldown", "3 × 15+", "60 s")
                    ] },
                    { title: "B1: Press day", items: [
                        ex("Overhead press", "5 × 3+", "3 min", "Seated dumbbell shoulder press"),
                        ex("Deadlift", "3 × 10", "2 min", "Dumbbell or trap bar deadlift"),
                        ex("Single-arm dumbbell row", "3 × 15+ per side", "60 s")
                    ] },
                    { title: "A2: Bench day", items: [
                        ex("Bench press", "5 × 3+", "3 min", "Dumbbell bench press"),
                        ex("Back squat", "3 × 10", "2 min", "Goblet squat"),
                        ex("Lat pulldown", "3 × 15+", "60 s")
                    ] },
                    { title: "B2: Deadlift day", items: [
                        ex("Deadlift", "5 × 3+", "3 min", "Dumbbell or trap bar deadlift"),
                        ex("Overhead press", "3 × 10", "2 min", "Seated dumbbell shoulder press"),
                        ex("Single-arm dumbbell row", "3 × 15+ per side", "60 s")
                    ] }
                ]
            }
        }
    },

    endurance: {
        level: "Advanced",
        name: "Light weights, high reps",
        tagline: "lighter weights, more reps",
        summary: "Lighter weights for 15 to 20 reps with short rest, done as a circuit. Builds muscles that keep going: great for fitness tests, hiking, sports, and anyone who prefers lighter weights to heavy ones.",
        session: "35 to 45 minutes",
        effort: "Pick weights you could lift about 25 times, and stop each set around 15 to 20 with a few reps left. Move between exercises with 30 to 60 seconds of rest.",
        progression: "Add reps up to 20 on every set, then add a little weight and start back at 15. Rests can shrink toward 30 seconds as you get fitter.",
        source: ["the American College of Sports Medicine's resistance training guidelines (2009)", "https://pubmed.ncbi.nlm.nih.gov/19204579/"],
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between. Go around each circuit 2 or 3 times.",
                days: [
                    { title: "Circuit A", items: [
                        ex("Goblet squat", "3 × 15–20", "45 s", "Bodyweight squat"),
                        ex("Push-up", "3 × 12–20", "45 s", "Incline push-up"),
                        ex("Seated cable row", "3 × 15–20", "45 s"),
                        ex("Walking lunge", "3 × 12 per leg", "45 s", "Reverse lunge"),
                        ex("Plank", "3 × 30–45 s", "30 s", "Plank on your knees")
                    ] },
                    { title: "Circuit B", items: [
                        ex("Leg press", "3 × 15–20", "45 s"),
                        ex("Lat pulldown", "3 × 15–20", "45 s"),
                        ex("Dumbbell shoulder press", "3 × 15", "45 s"),
                        ex("Glute bridge", "3 × 20", "45 s"),
                        ex("Dead bug", "3 × 10 per side", "30 s")
                    ] },
                    { title: "Circuit C", items: [
                        ex("Step-up", "3 × 12 per leg", "45 s", "Use a lower step"),
                        ex("Machine chest press", "3 × 15–20", "45 s"),
                        ex("Single-arm dumbbell row", "3 × 15 per side", "45 s"),
                        ex("Lateral raise", "3 × 15–20", "30 s"),
                        ex("Farmer carry", "3 × 40 steps", "45 s")
                    ] }
                ]
            }
        }
    },

    cardio: {
        level: "Intermediate",
        name: "Cardio & conditioning",
        tagline: "heart, lungs, endurance",
        summary: "Cardio done the smart way: mostly easy sessions you could hold a conversation through, plus one harder interval day. Great on its own or added to a lifting plan. Use Swap to pick the machine or activity you like.",
        session: "30 to 60 minutes",
        effort: "Easy days: you can talk in full sentences. Interval days: the hard parts are about an 8 out of 10, the easy parts are truly easy.",
        progression: "Add about 5 minutes to your easy sessions each week, up to an hour. Most experts suggest at least 150 minutes of moderate cardio a week for health.",
        plans: {
            3: {
                schedule: "Any 3 days. Easy days can be back to back; keep a rest day after intervals.",
                days: [
                    { title: "Steady and easy", items: [
                        ex("Incline treadmill walk", "30–40 min", ""),
                        ex("Stretching or mobility", "10 min", "")
                    ] },
                    { title: "Intervals", items: [
                        ex("Bike intervals", "8 × 30 s hard, 90 s easy", "", "Brisk incline walk, 20 min"),
                        ex("Plank", "3 × 30 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Long and easy", items: [
                        ex("Incline walk or easy bike", "45–60 min", "")
                    ] }
                ]
            },
            4: {
                schedule: "4 days, like Mon, Tue, Thu, Sat. Keep the interval and mixed days apart.",
                days: [
                    { title: "Steady and easy", items: [
                        ex("Incline treadmill walk", "30–40 min", ""),
                        ex("Stretching or mobility", "10 min", "")
                    ] },
                    { title: "Intervals", items: [
                        ex("Bike intervals", "8 × 30 s hard, 90 s easy", "", "Brisk incline walk, 20 min"),
                        ex("Plank", "3 × 30 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Steady and easy", items: [
                        ex("Elliptical", "30–40 min", "")
                    ] },
                    { title: "Mixed conditioning", items: [
                        ex("Rower intervals", "6 × 1 min hard, 1 min easy", ""),
                        ex("Farmer carry", "4 × 40 steps", "60 s"),
                        ex("Incline walk or easy bike", "20 min", "")
                    ] }
                ]
            }
        }
    },

    home: {
        level: "Beginner", main: true,
        name: "No gym needed",
        tagline: "bodyweight at home",
        kit: "none",
        summary: "Three short full-body workouts you can do in your living room with no equipment, just a backpack and a sturdy counter. A great way to build the habit and some strength before you ever set foot in a gym.",
        session: "30 to 40 minutes",
        effort: "Stop each set with 2 or 3 good reps left. Move slowly and with control; that's what makes bodyweight work hard.",
        progression: "When you can do the top of the rep range on every set, make it harder: slow the lowering to 3 seconds, add a pause, use the harder version, or add books to the backpack.",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between. A daily walk is a great bonus.",
                days: [
                    { title: "Full body A", items: [
                        ex("Bodyweight squat", "3 × 12–15", "60 s", "Squat down to a chair"),
                        ex("Incline push-up", "3 × 8–12", "60 s", "Hands on a wall"),
                        ex("Backpack row", "3 × 10–12", "60 s"),
                        ex("Glute bridge", "3 × 15", "45 s"),
                        ex("Plank", "3 × 20–40 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Full body B", items: [
                        ex("Split squat", "3 × 8–10 per leg", "60 s", "Hold a chair for balance"),
                        ex("Pike push-up", "3 × 6–10", "60 s"),
                        ex("Backpack row", "3 × 12", "60 s"),
                        ex("Single-leg glute bridge", "2 × 10 per leg", "45 s"),
                        ex("Dead bug", "3 × 8 per side", "45 s")
                    ] },
                    { title: "Full body C", items: [
                        ex("Step-up", "3 × 10 per leg", "60 s", "Use a lower step"),
                        ex("Push-up", "3 × 5–10", "60 s", "Hands on a counter"),
                        ex("Backpack row", "3 × 10–12", "60 s"),
                        ex("Wall sit", "3 × 20–40 s", "45 s"),
                        ex("Side plank", "2 × 20 s per side", "45 s", "Side plank on your knees"),
                        ex("Brisk walk", "20 min", "")
                    ] }
                ]
            }
        }
    },

    homedb: {
        level: "Beginner",
        name: "Home with dumbbells",
        tagline: "a pair of dumbbells, no bench",
        kit: "db",
        bench: false,
        rotation: "none",
        summary: "Three full-body workouts for your living room with just a pair of dumbbells (adjustable ones are perfect) and the floor. No bench needed. Each session ends with a walk, which makes this a good plan for losing fat at home: lifting keeps your muscle while you eat a little less, and the walking adds up.",
        session: "30 to 40 minutes, plus a 20-minute walk",
        effort: "Stop each set with 2 or 3 good reps left. Move slowly and with control, especially on the way down.",
        progression: "When you hit the top of the rep range on every set, go up to the next dumbbell setting (usually 5 lb or 2 kg). If your dumbbells max out, slow down the lowering, add a pause, or add reps.",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between, like Mon, Wed, Fri. Walk on the other days too if you can.",
                days: [
                    { title: "Full body A", items: [
                        ex("Goblet squat", "3 × 10–12", "60 s", "Bodyweight squat to a chair"),
                        ex("Dumbbell floor press", "3 × 8–12", "60 s", "Push-ups with hands on a counter"),
                        ex("Bent-over dumbbell row", "3 × 10–12", "60 s", "One arm at a time, other hand on a couch"),
                        ex("Dumbbell Romanian deadlift", "3 × 10–12", "60 s"),
                        ex("Dead bug", "3 × 8 per side", "45 s"),
                        ex("Brisk walk", "20 min", "")
                    ] },
                    { title: "Full body B", items: [
                        ex("Reverse lunge", "3 × 8–10 per leg", "60 s", "Hold a chair for balance"),
                        ex("Dumbbell shoulder press", "3 × 8–12", "60 s", "Sit on a sturdy chair"),
                        ex("Bent-over dumbbell row", "3 × 10–12", "60 s"),
                        ex("Glute bridge", "3 × 12–15", "45 s", "No dumbbell on your hips"),
                        ex("Farmer carry", "3 × 40 steps", "60 s"),
                        ex("Brisk walk", "20 min", "")
                    ] },
                    { title: "Full body C", items: [
                        ex("Step-up", "3 × 10 per leg", "60 s", "Use a lower step"),
                        ex("Push-up", "3 × 5–10", "60 s", "Hands on a counter"),
                        ex("Bent-over dumbbell row", "3 × 10–12", "60 s"),
                        ex("Dumbbell Romanian deadlift", "3 × 10–12", "60 s"),
                        ex("Plank", "3 × 20–40 s", "45 s", "Plank on your knees"),
                        ex("Brisk walk", "20 min", "")
                    ] }
                ]
            }
        }
    },

    busy: {
        level: "Beginner", main: true,
        name: "Short on time",
        tagline: "under 45 minutes a session",
        summary: "Two full-body gym sessions a week that hit everything. Short rests and no fluff, for weeks when life is busy. Two good sessions beat four you keep skipping.",
        session: "Under 45 minutes",
        effort: "Stop each set with 1 or 2 good reps left. Keep rests short and stay off your phone between sets.",
        progression: "When you hit the top of the rep range on every set, add the smallest weight jump next time.",
        plans: {
            2: {
                schedule: "Two days with at least two days between, like Monday and Thursday.",
                days: [
                    { title: "Full body A", items: [
                        ex("Goblet squat", "3 × 8–10", "75 s", "Squat down to a bench"),
                        ex("Dumbbell bench press", "3 × 8–10", "75 s", "Push-ups with hands on a bench"),
                        ex("Lat pulldown", "3 × 10–12", "75 s"),
                        ex("Dumbbell Romanian deadlift", "2 × 10", "75 s"),
                        ex("Plank", "2 × 30 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Full body B", items: [
                        ex("Leg press", "3 × 10–12", "75 s"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "75 s"),
                        ex("Seated cable row", "3 × 10–12", "75 s"),
                        ex("Hip thrust", "2 × 10–12", "75 s", "Glute bridge"),
                        ex("Cable crunch", "2 × 12–15", "45 s", "Dead bug")
                    ] }
                ]
            }
        }
    },

    dumbbell: {
        level: "Intermediate",
        name: "Dumbbells only",
        tagline: "home gym or crowded gym",
        kit: "db",
        summary: "A full plan using only a pair of dumbbells and a bench. Works in a garage gym, a hotel gym, or when every machine is taken.",
        session: "45 to 60 minutes",
        effort: "Stop each set with about 2 good reps left. If the dumbbells get too light, slow down the lowering or add reps before buying heavier ones.",
        progression: "When you hit the top of the rep range on every set, move up to the next dumbbell (usually 5 lb or 2 kg).",
        plans: {
            3: {
                schedule: "Any 3 days with a rest day between, like Mon, Wed, Fri.",
                days: [
                    { title: "Full body A", items: [
                        ex("Goblet squat", "3 × 8–12", "90 s", "Squat down to a bench"),
                        ex("Dumbbell bench press", "3 × 8–12", "90 s", "Push-ups with hands on a bench"),
                        ex("Single-arm dumbbell row", "3 × 10 per side", "60 s"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "90 s"),
                        ex("Lateral raise", "2 × 12–15", "60 s"),
                        ex("Dead bug", "2 × 8 per side", "45 s")
                    ] },
                    { title: "Full body B", items: [
                        ex("Bulgarian split squat", "3 × 8–10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "90 s"),
                        ex("Chest-supported dumbbell row", "3 × 10–12", "60 s"),
                        ex("Hip thrust", "3 × 10", "90 s", "Glute bridge"),
                        ex("Dumbbell curl", "2 × 10–12", "60 s"),
                        ex("Overhead triceps extension", "2 × 10–12", "60 s")
                    ] },
                    { title: "Full body C", items: [
                        ex("Goblet squat", "3 × 10–12", "90 s", "Squat down to a bench"),
                        ex("Incline dumbbell press", "3 × 8–10", "90 s"),
                        ex("Single-arm dumbbell row", "3 × 10 per side", "60 s"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "90 s"),
                        ex("Rear delt fly", "2 × 15", "60 s"),
                        ex("Farmer carry", "3 × 40 steps", "60 s")
                    ] }
                ]
            },
            4: {
                schedule: "Upper and lower days, like Mon, Tue, Thu, Fri.",
                days: [
                    { title: "Upper A", items: [
                        ex("Dumbbell bench press", "3 × 8–10", "90 s", "Push-ups with hands on a bench"),
                        ex("Single-arm dumbbell row", "3 × 10 per side", "60 s"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "90 s"),
                        ex("Lateral raise", "3 × 12–15", "60 s"),
                        ex("Dumbbell curl", "2 × 10–12", "60 s"),
                        ex("Overhead triceps extension", "2 × 10–12", "60 s")
                    ] },
                    { title: "Lower A", items: [
                        ex("Goblet squat", "3 × 8–12", "90 s", "Squat down to a bench"),
                        ex("Dumbbell Romanian deadlift", "3 × 10", "90 s"),
                        ex("Reverse lunge", "2 × 10 per leg", "60 s"),
                        ex("Single-leg calf raise", "3 × 12 per leg", "45 s"),
                        ex("Plank", "3 × 30 s", "45 s", "Plank on your knees")
                    ] },
                    { title: "Upper B", items: [
                        ex("Incline dumbbell press", "3 × 8–10", "90 s"),
                        ex("Chest-supported dumbbell row", "3 × 10–12", "60 s"),
                        ex("Arnold press", "3 × 8–10", "90 s"),
                        ex("Rear delt fly", "3 × 15", "60 s"),
                        ex("Hammer curl", "2 × 10–12", "60 s"),
                        ex("Dumbbell fly", "2 × 12", "60 s")
                    ] },
                    { title: "Lower B", items: [
                        ex("Bulgarian split squat", "3 × 8–10 per leg", "90 s", "Split squat holding a rail"),
                        ex("Hip thrust", "3 × 10", "90 s", "Glute bridge"),
                        ex("Step-up", "2 × 10 per leg", "60 s", "Use a lower step"),
                        ex("Standing calf raise", "3 × 12", "45 s"),
                        ex("Dead bug", "3 × 8 per side", "45 s")
                    ] }
                ]
            }
        }
    },

    ppl: {
        level: "Expert",
        name: "Push / pull / legs",
        tagline: "6-day split for experienced lifters",
        summary: "Each muscle twice a week across six hard sessions: push (chest, shoulders, triceps), pull (back, biceps), and legs, twice through. Only for lifters with a year or more of steady training who recover well.",
        session: "60 to 75 minutes",
        effort: "Main lifts: stop 1 or 2 reps short of failure. Isolation work can go to 0 or 1 reps left. Keep form strict when you're tired.",
        progression: "Double progression on everything, plus the 4-week waves. If performance drops two weeks in a row, take the Recover week early.",
        plans: {
            6: {
                schedule: "Push, pull, legs, push, pull, legs, rest. Like Mon to Sat with Sunday off.",
                days: [
                    { title: "Push A", items: [
                        ex("Bench press", "4 × 5–7", "3 min"),
                        ex("Overhead press", "3 × 6–8", "2–3 min"),
                        ex("Incline dumbbell press", "3 × 8–10", "2 min"),
                        ex("Cable lateral raise", "4 × 12–15", "60 s"),
                        ex("Triceps pushdown", "3 × 10–12", "60 s"),
                        ex("Overhead triceps extension", "3 × 12–15", "60 s")
                    ] },
                    { title: "Pull A", items: [
                        ex("Deadlift", "3 × 4–6", "3 min"),
                        ex("Pull-up", "4 × 6–10", "2 min", "Assisted pull-up"),
                        ex("Barbell row", "3 × 6–8", "2 min"),
                        ex("Face pull", "3 × 15", "60 s"),
                        ex("Barbell curl", "3 × 8–10", "60 s"),
                        ex("Hammer curl", "2 × 10–12", "60 s")
                    ] },
                    { title: "Legs A", items: [
                        ex("Back squat", "4 × 5–7", "3 min"),
                        ex("Romanian deadlift", "3 × 8–10", "2 min"),
                        ex("Leg press", "3 × 10–12", "2 min"),
                        ex("Lying hamstring curl", "3 × 10–12", "60 s"),
                        ex("Standing calf raise", "4 × 10–15", "60 s"),
                        ex("Hanging knee raise", "3 × 12", "60 s")
                    ] },
                    { title: "Push B", items: [
                        ex("Incline barbell press", "4 × 6–8", "2–3 min"),
                        ex("Seated dumbbell shoulder press", "3 × 8–10", "2 min"),
                        ex("Machine chest press", "3 × 10–12", "90 s"),
                        ex("Lateral raise", "4 × 15–20", "45 s"),
                        ex("Skull crusher", "3 × 10–12", "60 s"),
                        ex("Cable fly", "3 × 12–15", "60 s")
                    ] },
                    { title: "Pull B", items: [
                        ex("Lat pulldown", "4 × 8–12", "90 s"),
                        ex("Chest-supported row", "4 × 8–12", "90 s"),
                        ex("Single-arm cable row", "3 × 10–12", "60 s"),
                        ex("Reverse pec deck", "3 × 15–20", "45 s"),
                        ex("Incline dumbbell curl", "3 × 10–12", "60 s"),
                        ex("Cable curl", "2 × 12–15", "45 s")
                    ] },
                    { title: "Legs B", items: [
                        ex("Front squat", "4 × 6–8", "2–3 min"),
                        ex("Hip thrust", "3 × 8–10", "2 min"),
                        ex("Bulgarian split squat", "3 × 8–10 per leg", "90 s"),
                        ex("Leg extension", "3 × 12–15", "60 s"),
                        ex("Seated hamstring curl", "3 × 12–15", "60 s"),
                        ex("Seated calf raise", "4 × 12–15", "45 s")
                    ] }
                ]
            }
        }
    },

    classic: {
        level: "Expert",
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

// Equipment: "none" (home) plans only use bodyweight moves; "db" plans also allow dumbbells
function kitAllows(planKit, exerciseKit) {
    const k = exerciseKit || "gym";
    if (planKit === "none") return k === "none";
    if (planKit === "db") return k === "none" || k === "db";
    return true;
}

// Home moves that still need a bench (or a barbell): left out of "no bench" plans and home Coach workouts
const NEEDS_BENCH = /^(Bulgarian split squat|Hip thrust|Dumbbell bench press|Incline dumbbell press|Dumbbell fly|Chest-supported dumbbell row|Seated dumbbell shoulder press|Incline dumbbell curl)$/;
// Exercises that can stand in for this one, limited to the program's equipment
function familyFor(name, program) {
    if (typeof EXERCISE_FAMILIES === "undefined") return null;
    const base = EXERCISE_FAMILIES.find((f) => f[0] === name) || EXERCISE_FAMILIES.find((f) => f.includes(name)) || null;
    const plan = program && PROGRAMS[program] ? PROGRAMS[program] : {};
    const kit = plan.kit || null;
    if (!base || !kit) return base;
    return base.filter((n) => n === name || (kitAllows(kit, typeof EXERCISES === "object" && EXERCISES[n] ? EXERCISES[n].kit : null) && !(plan.bench === false && NEEDS_BENCH.test(n))));
}

// Which version of a slot to show in a given week. It never repeats last week's choice.
function rotatedName(name, ctx) {
    const fam = familyFor(name, ctx.program);
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
    const avoid = getProfile().avoid;
    return items.map((x, slot) => {
        const mode = PROGRAMS[program].rotation === "block" || slot === 0 ? "block" : "weekly";
        let name = PROGRAMS[program].rotation === "none" ? x.n : rotatedName(x.n, { program, days, day: dayIndex, slot, week, mode });
        const fam = familyFor(x.n, program);
        if (fam && used.has(name) && PROGRAMS[program].rotation !== "none") name = fam.find((n) => !used.has(n)) || name;
        const swapped = swaps[`w${week}:${dayIndex}-${slot}`];
        if (swapped) name = swapped;
        // Moves you asked to skip get a stand-in from the same family
        let skipped = null, skipDose = null;
        if (avoid.length && avoidedBy(name, avoid)) {
            const kit = PROGRAMS[program] ? PROGRAMS[program].kit : null;
            const fits = (n) => typeof EXERCISES === "object" && EXERCISES[n] && !avoidedBy(n, avoid) && !used.has(n) && kitAllows(kit, EXERCISES[n].kit) && !(PROGRAMS[program].bench === false && NEEDS_BENCH.test(n));
            const alt = (fam || []).find(fits) || (AVOID_SUBS[avoidedBy(name, avoid)] || []).find(fits);
            if (alt) { skipped = AVOID_MOVES[avoidedBy(name, avoid)][0]; name = alt; }
            if (alt) skipDose = coachDose(alt, COACH_COMPOUND.test(alt), getLevel());
        }
        used.add(name);
        // A stand-in that's done differently (a plank for a dead bug, a one-leg move for a two-leg one) gets its own sets and reps
        let d = skipDose ? skipDose[0] : x.d, rest = skipDose && x.rest ? skipDose[1] : x.rest;
        if (!skipDose && name !== x.n && typeof EXERCISES === "object" && EXERCISES[name]) {
            const kind = (t) => (/steps/.test(t) ? "steps" : /\d\s*s\b/.test(t) ? "hold" : /min\b/.test(t) && !/×/.test(t) ? "time" : "reps");
            const [def, defRest] = coachDose(name, COACH_COMPOUND.test(name), getLevel());
            if (kind(String(x.d)) !== kind(def)) { d = def; if (rest) rest = defRest; }
            else if (/per (side|leg|arm)/.test(x.d) !== /per (side|leg|arm)/.test(def)) d = /per (side|leg|arm)/.test(def) ? `${x.d} per side` : String(x.d).replace(/ per (side|leg|arm)/, "");
        }
        return { ...x, d, rest, name, mode, swapped: Boolean(swapped), skipped, canRotate: Boolean(fam && fam.length > 1) };
    });
}

// How many different weekly versions a plan can produce
function planCombinations(plan, program) {
    if (PROGRAMS[program] && PROGRAMS[program].rotation === "none") return 1;
    return plan.days.reduce((total, day) => day.items.reduce((t, x) => {
        const fam = familyFor(x.n, program);
        return t * (fam ? fam.length : 1);
    }, total), 1);
}
function bigNumber(n) {
    if (n >= 1e9) return "over a billion";
    if (n >= 1e6) return `over ${Math.floor(n / 1e6)} million`;
    if (n >= 1e3) return `over ${fmt(Math.floor(n / 1000) * 1000)}`;
    return fmt(n);
}

// Week-by-week plans (like Couch to 5K) list each week; everything else repeats its days
Object.values(PROGRAMS).forEach((p) => Object.values(p.plans).forEach((plan) => { if (plan.weeks && !plan.days) plan.days = plan.weeks[0]; }));
const weekDays = (plan, week) => (plan.weeks ? plan.weeks[Math.min(Math.max(1, week), plan.weeks.length) - 1] : plan.days);

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
// Only known values get through, so tampered or corrupted saved data can't break or inject into the page
function getProfile() {
    const raw = store.get(PROFILE_KEY, {});
    const p = raw && typeof raw === "object" ? raw : {};
    const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);
    const bw = Number(p.bodyweight);
    const yr = Number(p.years), years = Number.isInteger(yr) && yr >= 18 && yr <= 100 ? yr : 0;
    const hcm = Number(p.heightCm), bf = Number(p.bodyfat);
    return {
        experience: pick(p.experience, ["new", "some", "lots"], "new"),
        bodyweight: bw > 0 && bw < 1000 ? String(p.bodyweight) : "",
        name: typeof p.name === "string" && /^[\p{L}' .-]{1,30}$/u.test(p.name.trim()) ? p.name.trim() : "",
        unit: pick(p.unit, ["lb", "kg"], store.get("gu-unit") === "kg" ? "kg" : "lb"),
        focus: pick(p.focus, ["", "shoulders", "back", "chest", "arms", "legs"], ""),
        sex: pick(p.sex, ["", "female", "male"], ""),
        trainFor: pick(p.trainFor, ["strength", "endurance", "both"], "both"),
        // "About you" answers that tailor every plan (all optional)
        goal: pick(p.goal, ["", "muscle", "strength", "fatloss", "health"], ""),
        place: pick(p.place, ["", "gym", "homedb", "home"], ""),
        days: pick(String(p.days || ""), ["", "2", "3", "4", "5", "6"], ""),
        minutes: pick(String(p.minutes || ""), ["", "30", "45", "60", "90"], ""),
        age: years ? ageBracket(years) : pick(p.age, ["", "18-29", "30-39", "40-49", "50-59", "60+"], ""),
        // Body details for precise calories and protein (all optional; height is always saved in cm)
        years: years ? String(years) : "",
        heightCm: hcm >= 120 && hcm <= 230 ? String(Math.round(hcm)) : "",
        bodyfat: bf >= 3 && bf <= 60 ? String(bf) : "",
        activity: pick(String(p.activity || ""), ["", "1.2", "1.375", "1.55", "1.725"], ""),
        avoid: Array.isArray(p.avoid) ? p.avoid.filter((k) => Object.keys(AVOID_MOVES).includes(k)) : []
    };
}
const ageBracket = (y) => (y >= 60 ? "60+" : y >= 50 ? "50-59" : y >= 40 ? "40-49" : y >= 30 ? "30-39" : "18-29");

/* ---------- Daily energy and protein ----------
   Resting burn from Mifflin-St Jeor (weight, height, age, sex), or Katch-McArdle when body fat
   is known (it uses lean mass, which is more precise for very lean or very muscular people),
   times everyday activity. Protein: 1.6 to 2.2 g per kg (ISSN position stand, 2017); with higher
   body fat it's based on a goal-ish weight (lean mass at 15%/25% fat) so it isn't inflated.
   Returns null until the needed numbers are there. */
function energyEstimate(p = getProfile(), extra = {}) {
    const unit = extra.unit || p.unit;
    const w = extra.weight != null ? extra.weight : Number(p.bodyweight);
    const kg = unit === "kg" ? w : w / 2.20462;
    const cm = extra.cm != null ? extra.cm : Number(p.heightCm);
    const age = extra.age != null ? extra.age : Number(p.years);
    const sex = extra.sex || p.sex;
    const bf = extra.bodyfat != null ? extra.bodyfat : Number(p.bodyfat);
    const activity = Number(extra.activity || p.activity) || 1.375;
    if (!(kg >= 35 && kg <= 300) || !(age >= 18 && age <= 100)) return null;
    const lean = bf >= 3 && bf <= 60 ? kg * (1 - bf / 100) : 0;
    let bmr, method;
    if (lean) { bmr = 370 + 21.6 * lean; method = "katch"; }
    else if (cm >= 120 && cm <= 230 && (sex === "male" || sex === "female")) { bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161); method = "mifflin"; }
    else return null;
    const protKg = lean && bf > (sex === "female" ? 32 : 25) ? lean / (1 - (sex === "female" ? 0.25 : 0.15)) : kg;
    return { bmr, maintenance: bmr * activity, method, kg, lean, proteinLow: 1.6 * protKg, proteinHigh: 2.2 * protKg, activityGiven: Boolean(extra.activity || p.activity) };
}

// Moves someone can ask to skip (for any reason); plans swap them for a stand-in from the same family
const AVOID_MOVES = {
    squat: ["Barbell squats", /^(Back squat|Front squat|Smith machine squat)$/],
    deadlift: ["Deadlifts from the floor", /^(Deadlift|Trap bar deadlift|Dumbbell or trap bar deadlift)$/],
    overhead: ["Pressing overhead", /overhead press|shoulder press|Arnold press|Pike push-up/i],
    lunge: ["Lunges and split squats", /lunge|split squat|step-up/i],
    pullup: ["Pull-ups and chin-ups", /^(Pull-up|Chin-up)$/],
    dip: ["Dips", /\bdip\b/i],
    jump: ["Running and jumping", /jump|burpee|sprint|run\/walk|^Running/i]
};
const avoidedBy = (name, keys) => keys.find((k) => AVOID_MOVES[k][1].test(name)) || null;
// Stand-ins when a skipped move has no family (first one the plan's equipment allows)
const AVOID_SUBS = {
    squat: ["Leg press", "Goblet squat", "Bodyweight squat"],
    deadlift: ["Romanian deadlift", "Dumbbell Romanian deadlift", "Glute bridge"],
    overhead: ["Lateral raise", "Push-up"],
    lunge: ["Leg press", "Goblet squat", "Glute bridge"],
    pullup: ["Lat pulldown", "Single-arm dumbbell row", "Backpack row"],
    dip: ["Triceps pushdown", "Push-up"],
    jump: ["Incline walk or easy bike", "Brisk walk"]
};
// The ready-made plan that fits someone's answers best
// The level your entered lifts point to (from the same strength standards as starting weights), or -1
function liftedLevel(p = getProfile()) {
    const bw = Number(p.bodyweight);
    if (!bw || typeof coachMaxes !== "function") return -1;
    const told = coachMaxes();
    let best = -1;
    Object.keys(START_MAX).forEach((n) => {
        if (!told[n]) return;
        const ratio = toUnit(told[n].m, told[n].u, p.unit) / bw / (p.sex === "male" ? 1 : START_WOMEN[n]);
        START_MAX[n].forEach((r, i) => { if (ratio >= r * 0.95) best = Math.max(best, i); });
    });
    return best;
}
function recommendPlan(p = getProfile()) {
    const lvl = Math.max(levelRank(getLevel()), liftedLevel(p));
    if (p.place === "home") return "home";
    if (p.place === "homedb") return "homedb";
    if (p.minutes === "30") return "busy";
    if (p.goal === "fatloss") return "fatloss";
    if (p.goal === "strength") return lvl >= 1 ? "strength" : "beginner";
    if (p.goal === "muscle") return lvl >= 1 ? "build" : "beginner";
    return "beginner";
}

/* ---------- Your level ----------
   One setting for the whole site. The higher it is, the more plans you see and the more
   detail the how-tos, plans, and muscle map show. Saved on this device as "gu-level". */
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const LEVEL_INFO = {
    Beginner: "New or coming back. Simple plans and the basics of every move.",
    Intermediate: "Training steadily for a few months. More plans, plus the common mistakes and how to make moves harder.",
    Advanced: "A year or more of lifting. Specialized plans, 4-week training waves, and form cues for each move.",
    Expert: "Years of serious training. Every plan, including a 6-day split, with programming notes on every exercise."
};
function getLevel() {
    const saved = store.get("gu-level");
    return LEVELS.includes(saved) ? saved : "Beginner";
}
const levelRank = (l) => Math.max(0, LEVELS.indexOf(l));
const levelAtLeast = (l) => levelRank(getLevel()) >= levelRank(l);
function setLevel(l) {
    if (!LEVELS.includes(l) || l === getLevel()) return;
    store.set("gu-level", l);
    // keep "Make it yours" in step with the level
    const p = store.get(PROFILE_KEY, {}) || {};
    p.experience = { Beginner: "new", Intermediate: "some", Advanced: "lots", Expert: "lots" }[l];
    store.set(PROFILE_KEY, p);
    window.dispatchEvent(new CustomEvent("levelchange", { detail: { level: l } }));
}

/* ---------- "My workout" (built by Coach) ----------
   Saved on this device as "gu-custom": { title, items: [{ n, d, rest }] }. Only exercises
   that exist in the library get through, and text is checked before it's used. */
// My workout can have up to 7 days: { days: [{ title, items }] } (older saves had one { title, items })
function customDaysRaw() {
    const raw = store.get("gu-custom");
    if (!raw || typeof raw !== "object") return [];
    const days = Array.isArray(raw.days) ? raw.days : Array.isArray(raw.items) ? [{ title: raw.title, items: raw.items }] : [];
    return days.filter((d) => d && typeof d === "object" && Array.isArray(d.items)).slice(0, 7);
}
// Swaps on My workout are tied to a day's old list: when a day is edited, its swaps go (so they can't undo the edit)
function clearCustomSwaps(dayIndex = null) {
    try {
        Object.keys(localStorage).filter((k) => k.startsWith("gu-swaps-custom-")).forEach((k) => {
            if (dayIndex === null) { localStorage.removeItem(k); return; }
            const sw = store.get(k, {}) || {};
            Object.keys(sw).forEach((slot) => { if (slot.split(":").pop().split("-")[0] === String(dayIndex)) delete sw[slot]; });
            store.set(k, sw);
        });
    } catch (e) { /* storage blocked */ }
}
function saveCustomDays(days) {
    const list = days.slice(0, 7);
    // day 1 is also kept at the top level for older parts of the site
    store.set("gu-custom", { title: list[0] ? list[0].title : "My workout", items: list[0] ? list[0].items : [], days: list });
}
function loadCustomWorkout() {
    if (typeof EXERCISES !== "object") return null;
    const clean = (v, max) => String(v == null ? "" : v).replace(/[<>]/g, "").slice(0, max);
    const days = customDaysRaw().map((d, i) => ({
        title: clean(d.title, 60) || (i ? `Day ${i + 1}` : "My workout"),
        items: d.items.filter((x) => x && EXERCISES[x.n]).slice(0, 12).map((x) => ex(x.n, clean(x.d, 40), clean(x.rest, 20)))
    })).filter((d) => d.items.length);
    if (!days.length) return null;
    const items = days[0].items;
    const title = days.length > 1 ? `${days.length}-day plan` : days[0].title;
    return {
        level: "Beginner",
        name: "Your plan",
        tagline: title,
        summary: `${title}: a session you built (or your Fitness Coach built) from this site's exercise guides. Do it once, or repeat it 1 to 3 times a week with a rest day between.`,
        session: `About ${Math.max(15, Math.round(items.length * 7.5))} minutes`,
        effort: "Stop most sets with 1 to 3 good reps left. Ask the Fitness Coach to make it easier or harder any time.",
        progression: "Log your sets. Next time you'll get a target for each exercise.",
        rotation: "none",
        waves: false,
        plans: { [days.length]: { schedule: days.length > 1 ? `${days.length} days a week, with a rest day between when you can.` : "Whenever you like.", days } }
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
/* ---------- 4-week training waves ----------
   Every plan cycles Build -> Push -> Heavy -> Recover, so each week asks
   something a little different and the 4th week lets the body catch up.
   Periodized training like this beats doing the same thing every week for
   strength (ACSM position stand, 2009; Williams et al., 2017). */
const WAVE = [
    { key: "build", name: "Build week", tip: "Settle in and hit every set at the plan's numbers with clean form.", challenge: "Log every set you do this week." },
    { key: "push", name: "Push week", tip: "One extra set on each accessory exercise.", challenge: "Beat last week's reps on at least one exercise." },
    { key: "heavy", name: "Heavy week", tip: "Main lifts go heavier: more sets, fewer reps, a little more rest.", challenge: "Set a new personal record on a main lift." },
    { key: "recover", name: "Recover week", tip: "Half the sets at about 10% lighter, so you come back stronger next week.", challenge: "Do the 5-minute warm-up before every session." }
];
const wavePhase = (week) => WAVE[(Math.max(1, week) - 1) % 4];

// "3 × 8–10 per leg" from its parts
function doseText(d) {
    const reps = d.high && d.high !== d.low ? `${d.low}–${d.high}` : `${d.low}`;
    return `${d.sets} × ${reps}${d.rest ? " " + d.rest : ""}`;
}

// The dose for this person this week: the wave first, then Classic Physique's personal tweaks
/* ---------- Light week (deload) ----------
   Anyone can turn a week into a light week: half the sets at about 10% lighter.
   Saved per plan as { "goal-days": [week numbers] } in gu-light-weeks. */
function lightWeeks() {
    const raw = store.get("gu-light-weeks", {});
    const out = {};
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
    Object.keys(raw).forEach((k) => {
        if (!/^[a-z0-9-]{1,40}-\d{1,2}$/.test(k) || !Array.isArray(raw[k])) return;
        const weeks = raw[k].filter((w) => Number.isInteger(w) && w >= 1 && w <= 520).slice(-60);
        if (weeks.length) out[k] = weeks;
    });
    return out;
}
const isLightWeek = (goal, days, week) => (lightWeeks()[`${goal}-${days}`] || []).includes(week);
function setLightWeek(goal, days, week, on) {
    const all = lightWeeks();
    const key = `${goal}-${days}`;
    const weeks = new Set(all[key] || []);
    if (on) weeks.add(week); else weeks.delete(week);
    if (weeks.size) all[key] = [...weeks].sort((a, b) => a - b); else delete all[key];
    store.set("gu-light-weeks", all);
}

function personalDose(program, item, slot, profile, week = 1, light = false) {
    const d = parseDose(item.d);
    const notes = [];
    if (d.timed) return { text: item.d, notes };
    const plan = PROGRAMS[program] || {};
    let changed = false;
    // Personal tweaks set this person's normal dose...
    if (program === "classic") {
        if (profile.experience === "new" && slot > 0 && d.sets > 2) { d.sets -= 1; notes.push("1 fewer set while you're new"); changed = true; }
        if (profile.focus && muscleGroup(item.name) === profile.focus && d.sets < 5) { d.sets += 1; notes.push("+1 set for your focus"); changed = true; }
    }
    // Your answers in Your starting point
    // Strength (NSCA: 1 to 6 reps, 2 to 6 sets, 2 to 5 min rest): the main lift goes heavy
    if (profile.goal === "strength" && slot === 0 && d.high >= 6 && !isCardio(item.name || item.n || "") && equipOf(item.name || item.n || "") !== "body") {
        const newer = !levelAtLeast("Intermediate");
        d.sets = newer ? 3 : 4; d.low = newer ? 5 : 3; d.high = 5;
        notes.push("Your goal: strength. Heavier, fewer reps"); changed = true;
    }
    if (profile.goal === "fatloss" && slot > 0 && d.high <= 12 && d.high >= 6) {
        d.low += 2; d.high += 3;
        notes.push("Your goal: lose fat. A few more reps, short rests"); changed = true;
    }
    if (profile.minutes === "30" && slot >= 2 && d.sets > 2) { d.sets -= 1; notes.push("1 fewer set: 30-minute sessions"); changed = true; }
    if (profile.minutes === "90" && slot <= 1 && d.sets < 5 && profile.goal !== "health") { d.sets += 1; notes.push("+1 set: you have time"); changed = true; }
    if ((profile.age === "50-59" || profile.age === "60+") && slot === 0) notes.push("Warm up with 1 or 2 light sets first");
    // ...then the week's wave changes it from there
    if (plan.waves !== false && levelAtLeast("Advanced")) {
        const phase = wavePhase(week).key;
        if (phase === "push" && slot > 0 && d.sets < 5) { d.sets += 1; notes.push("+1 set: Push week"); changed = true; }
        if (phase === "heavy" && slot === 0 && d.high >= 5) {
            d.low = Math.max(3, d.low - 2); d.high = Math.max(d.low, d.high - 2);
            if (d.sets < 5) d.sets += 1;
            notes.push("Heavy week: more sets, fewer reps"); changed = true;
        }
        if (phase === "recover" && d.sets > 1) { d.sets = Math.max(1, Math.ceil(d.sets / 2)); notes.push("Recover week: half the sets"); changed = true; }
    }
    // A light week the person chose (skipped if the Recover week already halved it)
    if (light && !notes.some((n) => n.startsWith("Recover week")) && d.sets > 1) { d.sets = Math.max(1, Math.ceil(d.sets / 2)); notes.push("Light week: half the sets"); changed = true; }
    return { text: changed ? doseText(d) : item.d, notes };
}

/* ---------- Your log ----------
   Saved on this device as { "Exercise name": [ { date, unit, sets: [{ w, r }] } ] } */
const getLog = () => store.get(LOG_KEY, {}) || {};
const toUnit = (w, from, to) => (from === to ? w : to === "kg" ? w / 2.20462 : w * 2.20462);
// Most gyms can't load 1.25 kg on a barbell or a machine stack, so those round to 2.5 kg
const roundWeight = (w, unit, name) => {
    const big = unit === "kg" && name && typeof equipOf === "function" && ["barbell", "machine", "cable"].includes(equipOf(name));
    const step = unit === "kg" ? (big ? 2.5 : 1.25) : 2.5;
    return Math.round(w / step) * step;
};
const trimNum = (n) => String(Math.round(n * 100) / 100);

function logFor(name) {
    return (getLog()[name] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
}
function saveSession(name, date, unit, sets, plan) {
    const before = logFor(name);
    const log = getLog();
    const list = (log[name] || []).filter((e) => e.date !== date);
    const entry = { date, unit, sets };
    // What the plan asked for that day (sets, rep range, and whether it was a recover/light week),
    // so next time's target is judged against that day's plan, not this week's
    if (plan && [plan.sets, plan.low, plan.high].every((n) => Number.isInteger(n) && n > 0 && n <= 100)) entry.plan = { sets: plan.sets, low: plan.low, high: plan.high, ...(plan.easy ? { easy: true } : {}) };
    list.push(entry);
    log[name] = list;
    store.set(LOG_KEY, log);
    checkLiftRecord(name, before, { date, unit, sets });
    window.dispatchEvent(new CustomEvent("logchange", { detail: { name } }));
}

/* ---------- Rewards: personal records, streaks, milestones ---------- */
const PR_KEY = "gu-prs";
const getPRs = () => store.get(PR_KEY, []) || [];
function addPR(pr) {
    const all = getPRs();
    all.push(pr);
    store.set(PR_KEY, all);
}

// Did this session beat everything before it? (estimated max, or more reps at a weight used before)
function checkLiftRecord(name, before, entry) {
    if (!before.length) return; // the first session sets the baseline
    const unit = entry.unit;
    const bestBefore = Math.max(...before.map((e) => sessionBest(e, unit)));
    const now = sessionBest(entry, unit);
    if (now > bestBefore * 1.001 && entry.sets.some((st) => st.w > 0)) {
        addPR({ date: entry.date, name, kind: "max", value: Math.round(now) });
        showToast("New personal record!", `${name}: estimated max about ${fmt(now)} ${unit}, up ${fmt(now - bestBefore)} ${unit}. That's the work paying off.`);
        return;
    }
    for (const st of entry.sets) {
        const sameWeight = before.flatMap((e) => e.sets.filter((x) => Math.abs(toUnit(x.w, e.unit, unit) - st.w) < 0.6));
        if (st.w > 0 && sameWeight.length && st.r > Math.max(...sameWeight.map((x) => x.r))) {
            addPR({ date: entry.date, name, kind: "reps", value: st.r, weight: st.w });
            showToast("Rep record!", `${name}: ${st.r} reps at ${trimNum(st.w)} ${unit}, your most ever at that weight.`);
            return;
        }
    }
}

function checkCardioRecord(entry) {
    const before = getCardio().filter((c) => c.activity === entry.activity);
    if (!before.length) return;
    if (entry.minutes > Math.max(...before.map((c) => c.minutes))) {
        addPR({ date: entry.date, name: entry.activity, kind: "minutes", value: entry.minutes });
        showToast("Longest session yet!", `${entry.activity}: ${entry.minutes} minutes. Your heart and lungs thank you.`);
        return;
    }
    const pace = (c) => (c.distance ? c.minutes / toDist(c.distance, c.dunit, entry.dunit) : Infinity);
    const withDist = before.filter((c) => c.distance);
    if (entry.distance && withDist.length && pace(entry) < Math.min(...withDist.map(pace))) {
        addPR({ date: entry.date, name: entry.activity, kind: "pace", value: pace(entry) });
        showToast("Fastest pace yet!", `${entry.activity}: your quickest ${entry.dunit === "km" ? "kilometer" : "mile"} pace so far.`);
    }
}

/* ---------- One way to count on My progress ----------
   Like the Log tab: lifting counts once you tap Finish workout (a gu-sessions entry
   for that day that includes the exercise). Cardio counts when it's logged. */
const finishedSessions = () => (store.get("gu-sessions", []) || []).filter((x) => x && typeof x.date === "string");
function isFinishedEntry(name, date, sessions = finishedSessions()) {
    return sessions.some((x) => x.date === date && (!Array.isArray(x.names) || x.names.includes(name)));
}
// The log with only finished workouts: { name: [entries] }
function finishedLog() {
    const sessions = finishedSessions(), out = {};
    Object.entries(getLog()).forEach(([name, list]) => {
        const keep = (Array.isArray(list) ? list : []).filter((e) => e && typeof e.date === "string" && Array.isArray(e.sets) && e.sets.length && isFinishedEntry(name, e.date, sessions));
        if (keep.length) out[name] = keep.slice().sort((a, b) => a.date.localeCompare(b.date));
    });
    return out;
}
const finishedSetCount = (log = finishedLog(), keep = () => true) => Object.values(log).reduce((n, list) => n + list.filter((e) => keep(e.date)).reduce((m, e) => m + e.sets.length, 0), 0);
// A weight shown on My progress (best lifts, maxes, gains): one rounding everywhere, so the numbers match
const liftNum = (w, unit) => trimNum(roundWeight(w, unit));

// Workout days: a finished workout or logged cardio
function activeDates() {
    const dates = new Set();
    finishedSessions().forEach((x) => dates.add(x.date));
    getCardio().forEach((c) => dates.add(c.date));
    return dates;
}

// Weeks in a row (counting back from this week, or last week if this one has just started) with 2+ workout days
function weekStreak() {
    const dates = [...activeDates()].map(parseIso);
    const count = (monday) => dates.filter((d) => d >= monday && d < addDays(monday, 7)).length;
    let monday = mondayOf(new Date());
    if (count(monday) < 2) monday = addDays(monday, -7); // this week isn't over yet
    let streak = 0;
    while (count(monday) >= 2) { streak += 1; monday = addDays(monday, -7); }
    return streak;
}

function milestones() {
    const days = activeDates().size;
    const sets = finishedSetCount();
    const prs = getPRs().length;
    const streak = weekStreak();
    let bestCardioWeek = 0;
    getCardio().forEach((c) => { bestCardioWeek = Math.max(bestCardioWeek, cardioMinutesInWeek(parseIso(c.date))); });
    return [
        { name: "First workout", detail: "Log your first session", done: days >= 1 },
        { name: "10 workouts", detail: `${Math.min(days, 10)} of 10 days`, done: days >= 10 },
        { name: "25 workouts", detail: `${Math.min(days, 25)} of 25 days`, done: days >= 25 },
        { name: "50 workouts", detail: `${Math.min(days, 50)} of 50 days`, done: days >= 50 },
        { name: "First personal record", detail: "Beat a past best", done: prs >= 1 },
        { name: "10 personal records", detail: `${Math.min(prs, 10)} of 10`, done: prs >= 10 },
        { name: "2-week streak", detail: "2+ workouts a week, 2 weeks running", done: streak >= 2 },
        { name: "4-week streak", detail: "A full training wave", done: streak >= 4 },
        { name: "12-week streak", detail: "Three months of showing up", done: streak >= 12 },
        { name: "150-minute week", detail: "The recommended weekly cardio", done: bestCardioWeek >= 150 },
        { name: "100 sets", detail: `${Math.min(sets, 100)} of 100 sets`, done: sets >= 100 },
        { name: "1,000 sets", detail: `${fmt(Math.min(sets, 1000))} of 1,000 sets`, done: sets >= 1000 }
    ];
}

// A short celebration in the corner of the screen
function showToast(title, text) {
    let box = document.getElementById("toast");
    if (!box) {
        document.body.insertAdjacentHTML("beforeend", '<div class="toast" id="toast" role="status" aria-live="polite" hidden><strong></strong><span></span><button type="button" class="toast-close" aria-label="Close">&times;</button></div>');
        box = document.getElementById("toast");
        box.querySelector(".toast-close").addEventListener("click", () => { box.hidden = true; });
    }
    box.querySelectorAll(".toast-link").forEach((l) => l.remove());
    box.querySelector("strong").textContent = title;
    box.querySelector("span").textContent = text;
    box.hidden = false;
    box.classList.remove("pop"); void box.offsetWidth; box.classList.add("pop");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { box.hidden = true; }, 7000);
}

// Estimated one-rep max (Epley). Very high-rep sets are capped so they don't inflate it.
const e1rm = (w, r) => (r <= 1 ? w : w * (1 + Math.min(r, 15) / 30));
const sessionBest = (entry, unit) => Math.max(...entry.sets.map((s) => e1rm(toUnit(s.w, entry.unit, unit), s.r)));

// Weight jumps: bigger for leg compounds, smaller for everything else
function weightStep(name, unit, current = Infinity, big = false) {
    const legCompound = muscleGroup(name) === "legs" && !/curl|extension|bridge|calf|raise|kickback|abduction/i.test(name);
    // Lighter upper-body lifts use the smallest jump: 5 lb on a 15 lb lift is a 33% jump (common for newer lifters, often women)
    const light = !legCompound && current < (unit === "kg" ? 20 : 45);
    if (light) return unit === "kg" ? 1.25 : 2.5;
    // Dumbbells: the next dumbbell up (5 lb / 2 kg), even for legs; 20 to 30 lb would be a 50% jump
    if (typeof equipOf === "function" && equipOf(name) === "db") return unit === "kg" ? 2 : 5;
    const base = unit === "kg" ? (legCompound ? 5 : 2.5) : (legCompound ? 10 : 5);
    // Research (ACSM: 2 to 10%) : about 2.5% for upper body and 5% for legs, a bit more when you beat your reps by 2 or more.
    // Rounded down and capped (1 step, or 2 for the bigger jump) so heavy lifts don't leap 20 to 40 lb at once.
    const pct = (legCompound ? 0.05 : 0.025) * (big ? 2 : 1);
    if (!Number.isFinite(current)) return base;
    return Math.min(base * (big ? 2 : 1), Math.max(base, Math.floor((current * pct) / base + 1e-9) * base));
}

/* ---------- Starting weights ----------
   Before someone has logged anything, a starting weight comes from their level and
   bodyweight. Rough one-rep maxes as a multiple of bodyweight for men, by level
   (Beginner, Intermediate, Advanced, Expert), in line with common strength standards;
   women's are scaled down, and so is "prefer not to say", to start on the light side.
   Real logged sets always take over from these. */
const START_MAX = {
    "Bench press": [0.5, 1.0, 1.3, 1.6],
    "Back squat": [0.65, 1.25, 1.65, 2.0],
    Deadlift: [0.8, 1.5, 2.0, 2.4],
    "Overhead press": [0.33, 0.62, 0.8, 1.0],
    "Barbell row": [0.4, 0.8, 1.05, 1.25]
};
const START_WOMEN = { "Bench press": 0.6, "Overhead press": 0.62, "Barbell row": 0.65, "Back squat": 0.75, Deadlift: 0.78 };
// More moves, as a share of a big lift: [big lift, share, dumbbells (weight per hand)?]
const START_EXTRA = {
    "Lat pulldown": [["Bench press", 0.8]],
    "Close-grip lat pulldown": [["Bench press", 0.8]],
    "Seated cable row": [["Bench press", 0.8]],
    "Single-arm dumbbell row": [["Barbell row", 0.4, true]],
    "Bent-over dumbbell row": [["Barbell row", 0.33, true]],
    "Dumbbell floor press": [["Bench press", 0.33, true]],
    "Chest-supported dumbbell row": [["Barbell row", 0.3, true]],
    "Dumbbell curl": [["Bench press", 0.14, true]],
    "Hammer curl": [["Bench press", 0.15, true]],
    "Barbell curl": [["Bench press", 0.35]],
    "EZ-bar curl": [["Bench press", 0.35]],
    "Lateral raise": [["Overhead press", 0.16, true]],
    "Dumbbell shoulder press": [["Overhead press", 0.42, true]],
    "Triceps pushdown": [["Bench press", 0.35]],
    "Rope pushdown": [["Bench press", 0.3]],
    "Goblet squat": [["Back squat", 0.3]],
    "Dumbbell Romanian deadlift": [["Deadlift", 0.25, true]],
    "Hip thrust": [["Deadlift", 0.8]],
    "Trap bar deadlift": [["Deadlift", 1.05]],
    // Machines, cables, and smaller moves: rough starting points (machines differ, so the plan says "about")
    "Leg press": [["Back squat", 1.6]], "Hack squat": [["Back squat", 0.8]], "Smith machine squat": [["Back squat", 0.85]],
    "Leg extension": [["Back squat", 0.45]], "Dumbbell or trap bar deadlift": [["Deadlift", 0.3, true]], "Cable pull-through": [["Deadlift", 0.25]],
    "Hip abduction machine": [["Back squat", 0.5]], "Hip adduction machine": [["Back squat", 0.45]], "Cable glute kickback": [["Back squat", 0.1]],
    "Hamstring curl machine": [["Deadlift", 0.3]], "Seated hamstring curl": [["Deadlift", 0.3]], "Lying hamstring curl": [["Deadlift", 0.28]],
    "Standing calf raise": [["Back squat", 0.2, true]], "Seated calf raise": [["Back squat", 0.5]], "Leg press calf raise": [["Back squat", 1.0]],
    "Machine chest press": [["Bench press", 0.8]], "Incline machine press": [["Bench press", 0.7]], "Pec deck": [["Bench press", 0.5]],
    "Cable fly": [["Bench press", 0.12, true]], "Low-to-high cable fly": [["Bench press", 0.1, true]], "Dumbbell fly": [["Bench press", 0.13, true]],
    "Chest-supported row": [["Barbell row", 0.8]], "Single-arm cable row": [["Barbell row", 0.35]], "Machine row": [["Barbell row", 0.9]],
    "Machine shoulder press": [["Overhead press", 0.9]], "Arnold press": [["Overhead press", 0.32, true]],
    "Cable lateral raise": [["Overhead press", 0.1]], "Machine lateral raise": [["Overhead press", 0.3]], "Lean-away lateral raise": [["Overhead press", 0.12, true]],
    "Rear delt fly": [["Overhead press", 0.12, true]], "Face pull": [["Barbell row", 0.35]], "Reverse pec deck": [["Barbell row", 0.4]], "Cable rear delt fly": [["Overhead press", 0.08]],
    "Incline dumbbell curl": [["Bench press", 0.12, true]], "Cable curl": [["Bench press", 0.3]], "Preacher curl": [["Bench press", 0.3]],
    "Overhead triceps extension": [["Bench press", 0.25]], "Pallof press": [["Bench press", 0.15]], "Cable crunch": [["Back squat", 0.35]],
    // Plate-loaded machines: total plates on the machine (both sides together)
    "Iso-lateral row": [["Barbell row", 0.9]], "Iso-lateral high row": [["Barbell row", 0.9]], "Iso-lateral lat pulldown": [["Bench press", 0.8]],
    "T-bar row": [["Barbell row", 0.8]], "Iso-lateral chest press": [["Bench press", 0.9]], "Iso-lateral incline press": [["Bench press", 0.75]],
    "Smith machine bench press": [["Bench press", 0.9]], "Iso-lateral shoulder press": [["Overhead press", 0.9]], "Pendulum squat": [["Back squat", 0.7]],
    "Belt squat": [["Back squat", 0.9]], "Hip thrust machine": [["Deadlift", 0.8]], "Seated dip machine": [["Bench press", 0.9]],
    "Machine preacher curl": [["Bench press", 0.25]], "Ab crunch machine": [["Back squat", 0.35]],
    "Iso-lateral low row": [["Barbell row", 0.9]], "Iso-lateral decline press": [["Bench press", 0.9]], "Pullover machine": [["Bench press", 0.4]],
    "Shrug machine": [["Deadlift", 0.6]], "Kneeling leg curl": [["Deadlift", 0.15]], "Reverse hyper": [["Deadlift", 0.3]],
    "V-squat machine": [["Back squat", 0.9]], "Glute kickback machine": [["Back squat", 0.25]], "Triceps extension machine": [["Bench press", 0.35]]
};
const BARBELL = /^(Bench press|Incline barbell press|Back squat|Front squat|Deadlift|Romanian deadlift|Overhead press|Barbell row|Hip thrust|Barbell curl)$/;
function startMax(name, unit) {
    const p = getProfile();
    const bw = Number(p.bodyweight);
    const body = bw ? toUnit(bw, p.unit, unit) : 0;
    const i = levelRank(getLevel());
    // A little gentler to start from age 50 (you can always go up next set)
    const ageEase = p.age === "60+" ? 0.85 : p.age === "50-59" ? 0.9 : p.age === "40-49" ? 0.95 : 1;
    // Lifts you told us (Your starting point or the Fitness Coach) beat any guess
    const told = typeof coachMaxes === "function" ? coachMaxes() : {};
    let fromTold = false;
    const base = (n) => {
        if (told[n]) { fromTold = true; return toUnit(told[n].m, told[n].u, unit); }
        fromTold = false;
        return START_MAX[n] && body ? body * START_MAX[n][i] * (p.sex === "male" ? 1 : START_WOMEN[n]) * ageEase : null;
    };
    if (START_MAX[name] || told[name]) { const m = base(name); return m ? { m, each: false, told: fromTold } : null; }
    const via = [...(typeof COACH_RATIOS === "object" && COACH_RATIOS[name] ? COACH_RATIOS[name] : []), ...(START_EXTRA[name] || [])];
    for (const [from, share, each] of via) {
        const b = base(from);
        if (b) return { m: b * share, each: !!each, told: fromTold };
    }
    return null;
}
// A weight to start with for sets of up to "high" reps, leaving 1 or 2 in the tank
function startWeight(name, high, unit, sets = 2) {
    const s = startMax(name, unit);
    if (!s) return null;
    // More sets means more fatigue: about 2% lighter for each set past 2 (5 × 5 starts lighter than 2 × 5)
    const fatigue = 1 - 0.02 * Math.min(4, Math.max(0, sets - 2));
    // Dumbbells come in 5 lb (2 kg) steps in most gyms; tiny ones in 2.5 lb (1 kg)
    const step = s.each ? (unit === "kg" ? (s.m < 15 ? 1 : 2) : (s.m < 25 ? 2.5 : 5)) : unit === "kg" ? 2.5 : 5;
    let w = Math.round(s.m * fatigue / (1 + (high + 1) / 30) / step) * step;
    if (BARBELL.test(name)) w = Math.max(w, unit === "kg" ? 20 : 45);   // the empty bar is the lightest a barbell gets
    else w = Math.max(w, step);
    return { w, each: s.each, told: Boolean(s.told), bar: BARBELL.test(name) && w <= (unit === "kg" ? 20 : 45) };
}

// A lighter weight you can actually load: rounded down to the next plate or dumbbell, and at least one step lighter
// (10% off a 10 lb dumbbell rounds back to 10, which would leave someone stuck)
function loadableDrop(name, unit, top, pct = 0.9, oneStepLess = true) {
    const kind = typeof equipOf === "function" ? equipOf(name) : "";
    // (dumbbells: if you're already on an in-between size like 27.5, your gym has the 2.5 lb steps)
    const step = kind === "db" ? (unit === "kg" ? (top <= 10 || top % 2 ? 1 : 2) : (top <= 25 || top % 5 ? 2.5 : 5))
        : kind === "barbell" || kind === "machine" || kind === "cable" ? (unit === "kg" ? 2.5 : 5) : (unit === "kg" ? 1.25 : 2.5);
    const down = Math.floor((top * pct) / step + 1e-9) * step;
    const w = oneStepLess ? Math.min(down, top - step) : down;
    return Math.max(step, w);
}
// What to lift next time, based on last time (double progression).
// Dumbbell moves logged per hand keep saying "each" after the first log too.
function nextTarget(name, dose, unit) {
    const t = nextTargetCore(name, dose, unit);
    if (t && t.each === undefined && t.weight > 0) {
        const s = startMax(name, unit);
        t.each = s ? s.each : /^two (light |heavy )?dumbbells/i.test(((typeof EXERCISES === "object" && EXERCISES[name]) || {}).eq || "");
    }
    return t;
}
// Rep bands: heavy (up to 6), medium (7 to 12), light (13+). A lift done heavy one day and light
// another (like Next-level strength's tiers) gets its target from sessions in the same band.
const repBand = (high) => (high <= 6 ? 0 : high <= 12 ? 1 : 2);
function nextTargetCore(name, dose, unit) {
    let entries = logFor(name);
    const d = parseDose(dose);
    if (d.timed) return null;
    if (entries.length && d.high) {
        const same = entries.filter((e) => !e.plan || repBand(e.plan.high) === repBand(d.high));
        if (!same.length) {
            // Only done in another rep range so far: work the weight out from that session's estimated max
            const lastE = entries[entries.length - 1];
            const best = sessionBest(lastE, unit);
            const each = lastE.sets.some((st) => st.w > 0);
            if (best > 0 && each) {
                const est = best / (1 + (d.high + 2) / 30) * (1 - 0.02 * Math.max(0, d.sets - 2));
                const w = loadableDrop(name, unit, est, 1, false);
                return { weight: w, reps: d.high, lastText: lastE.sets.map((st) => `${trimNum(roundWeight(toUnit(st.w, lastE.unit, unit), unit, name))}×${st.r}`).join(", "),
                    text: `First time at ${d.low === d.high ? d.high : `${d.low}–${d.high}`} reps: about ${trimNum(w)} ${unit}, worked out from your ${lastE.plan ? `${lastE.plan.low === lastE.plan.high ? lastE.plan.high : `${lastE.plan.low}–${lastE.plan.high}`}-rep sets` : "last session"}. Log it and this range gets its own target.` };
            }
        }
        entries = same.length ? same : entries;
    }
    if (!entries.length) {
        // Fitness Coach workouts can carry a starting weight ("3 × 5 at 230 lb")
        const start = String(dose).match(/at (?:about )?(\d+(?:\.\d+)?) (lb|kg)/);
        if (start) return { first: true, text: `First time? Start at about ${trimNum(roundWeight(toUnit(Number(start[1]), start[2], unit), unit))} ${unit}. Log it and you'll get a target next time.` };
        // From their level and bodyweight
        const sw = startWeight(name, d.high, unit, d.sets);
        if (sw) {
            const how = sw.bar ? `just the empty bar (${unit === "kg" ? "20 kg" : "45 lb"})` : `about ${trimNum(sw.w)} ${unit}${sw.each ? " in each hand" : ""}`;
            return { first: true, weight: sw.w, each: Boolean(sw.each), reps: d.high, start: true,
                text: `First time? Start with ${how}, ${sw.told ? "from the numbers you entered" : "from your level and bodyweight"}. Easy at ${d.high} reps? Go up next set. Form slipping? Go lighter.` };
        }
        if (equipOf(name) === "body" && !isCardio(name)) return { first: true, text: `Your bodyweight. Do ${d.high} clean reps; when every set feels easy, try the harder version in the how-to.` };
        const noBody = !Number(getProfile().bodyweight) && (START_MAX[name] || START_EXTRA[name]);
        return { first: true, text: `First time? Pick a weight you could do for about 2 more reps than ${d.high}. Log it and you'll get a target next time.${noBody ? " Add your bodyweight under Your starting point (home page) for a suggested weight." : ""}` };
    }
    const newest = entries[entries.length - 1];
    const newestSets = newest.sets.map((s) => ({ w: roundWeight(toUnit(s.w, newest.unit, unit), unit), r: s.r }));
    const lastText = newestSets.map((s) => (s.w ? `${trimNum(s.w)}×${s.r}` : `${s.r}`)).join(", ");
    // A recover or light week was lighter on purpose: base the target on the last normal session before it
    const real = entries.filter((e) => !(e.plan && e.plan.easy));
    const last = newest.plan && newest.plan.easy && real.length ? real[real.length - 1] : newest;
    const prevEntries = entries.slice(0, entries.indexOf(last)).filter((e) => !(e.plan && e.plan.easy));
    // Judge the session against what the plan asked for THAT day (a Heavy week's 5 × 3 isn't "missed sets" of 4 × 5)
    const was = last.plan || d;
    const sets = last.sets.map((s) => ({ w: roundWeight(toUnit(s.w, last.unit, unit), unit, last.unit === unit ? null : name), r: s.r }));
    const top = Math.max(...sets.map((s) => s.w));
    const working = sets.filter((s) => s.w === top);
    const allTop = working.length >= Math.min(was.sets, sets.length) && working.every((s) => s.r >= was.high);
    const anyLow = working.some((s) => s.r < was.low);
    if (last !== newest && top > 0 && !allTop) {
        return { weight: top, reps: d.high, lastText, text: `Back to ${trimNum(top)} ${unit} after the lighter week. Aim for ${d.low}–${d.high} reps on every set.` };
    }

    if (top === 0) {
        return { weight: 0, lastText, text: allTop ? "You hit every rep. Add a rep or two, or try the harder version." : "Aim for one more rep than last time." };
    }
    // Fewer sets than planned last time: get all the sets in before adding weight
    if (working.length < was.sets && sets.length < was.sets) {
        return { weight: top, reps: d.high, lastText, text: `Stay at ${trimNum(top)} ${unit}. Last time you did ${sets.length} of ${was.sets} sets; get all ${d.sets} in, then the weight goes up.` };
    }
    if (allTop) {
        // Beat the top of the range by 2 or more on every set (the "2-for-2" idea): a bigger jump
        const big = working.every((s) => s.r >= was.high + 2);
        const w = top + weightStep(name, unit, top, big);
        return { weight: w, reps: d.low, lastText, up: true, text: big
            ? `Go up to ${trimNum(w)} ${unit} for ${d.low}+ reps. You beat ${was.high} reps by 2 or more on every set, so this is a bigger jump.`
            : `Go up to ${trimNum(w)} ${unit} for ${d.low}+ reps. You hit the top of the range on every set.` };
    }
    if (anyLow) {
        const prev = prevEntries[prevEntries.length - 1];
        const prevLow = prev && prev.sets.some((s) => roundWeight(toUnit(s.w, prev.unit, unit), unit) === top && s.r < (prev.plan || d).low);
        if (prevLow) {
            const w = loadableDrop(name, unit, top);
            return { weight: w, reps: d.high, lastText, text: `Two tough sessions in a row. Drop to ${trimNum(w)} ${unit} and build back up. That's normal.` };
        }
        return { weight: top, reps: d.low, lastText, text: `Stay at ${trimNum(top)} ${unit} and try to get ${was.low} reps on every set.` };
    }
    return { weight: top, reps: d.high, lastText, text: `Stay at ${trimNum(top)} ${unit}. Aim for one more rep on your hardest set.` };
}

/* ---------- Cardio log ----------
   Saved as [{ date, activity, minutes, distance, dunit, effort }] */
const CARDIO_KEY = "gu-cardio";
const getCardio = () => (store.get(CARDIO_KEY, []) || []).slice().sort((a, b) => a.date.localeCompare(b.date));
function saveCardio(entry) {
    checkCardioRecord(entry);
    const all = store.get(CARDIO_KEY, []) || [];
    all.push(entry);
    store.set(CARDIO_KEY, all);
    window.dispatchEvent(new CustomEvent("logchange", { detail: { cardio: true } }));
}
const distUnit = (unit) => (unit === "kg" ? "km" : "mi");
/* What each exercise needs, for the small equipment icon shown next to it everywhere.
   Worked out from the guide's kit and equipment text, so new exercises get one automatically. */
const EQUIP_LABEL = { body: "Bodyweight", db: "Dumbbells", barbell: "Barbell", machine: "Machine", cable: "Cable", cardio: "Cardio" };
function equipOf(name) {
    const x = typeof EXERCISES === "object" && EXERCISES[name];
    if (!x) return "body";
    if (/heart and lungs/i.test(x.m)) return "cardio";
    if (x.kit === "none") return "body";
    if (x.kit === "db" || /^(one|two) (light |heavy )?dumbbell/i.test(x.eq)) return "db";
    if (/pull-up bar|ab wheel|stability ball|dip bars/i.test(x.eq) && !/machine/i.test(x.eq.split(" or ")[0])) return "body";
    if (/cable/i.test(x.eq)) return "cable";
    if (/machine|pec deck|row station|sled|back extension/i.test(x.eq)) return "machine";
    if (/barbell|ez|bar\b/i.test(x.eq)) return "barbell";
    return "body";
}
// The icon itself is drawn in CSS (.equip-*), so it also works inside saved Coach messages
const equipIcon = (name, showLabel = false) => {
    const k = equipOf(name);
    return showLabel ? `<span class="equip equip-${k} has-label"><span class="equip-label">${EQUIP_LABEL[k]}</span></span>`
        : `<span class="equip equip-${k}" title="${EQUIP_LABEL[k]}" aria-hidden="true"></span>`;
};
const isCardio = (name) => typeof EXERCISES === "object" && EXERCISES[name] && /heart and lungs/i.test(EXERCISES[name].m);

// Minutes of cardio in the Monday-to-Sunday week that contains `date`
function cardioMinutesInWeek(date = new Date()) {
    const start = mondayOf(date), end = addDays(start, 7);
    return getCardio().filter((c) => { const d = parseIso(c.date); return d >= start && d < end; })
        .reduce((sum, c) => sum + (Number(c.minutes) || 0), 0);
}

// A gentle next-time suggestion for a cardio activity
function nextCardioTarget(activity, unit) {
    const list = getCardio().filter((c) => c.activity === activity);
    if (!list.length) return { first: true, text: "Log how long you went (and how far, if you know) to get a suggestion next time." };
    const last = list[list.length - 1];
    const du = distUnit(unit);
    const dist = last.distance ? `${trimNum(Math.round(toDist(last.distance, last.dunit, du) * 100) / 100)} ${du}` : "";
    const lastText = [`${last.minutes} min`, dist, last.effort ? `effort ${last.effort}/10` : ""].filter(Boolean).join(", ");
    let text;
    if (Number(last.effort) >= 9) text = "That was a hard one. Keep the same time next session and let it feel easier.";
    else if (last.minutes < 60) text = `Next time, try about ${Math.min(60, Math.round(last.minutes * 1.1 / 5) * 5 || last.minutes + 5)} minutes at the same easy effort.`;
    else text = "Great volume. Keep it here, or make one session a week a little faster.";
    return { lastText, text };
}
const toDist = (d, from, to) => (from === to || !from ? Number(d) : to === "km" ? d * 1.60934 : d / 1.60934);

// Typical weekly strength gain by experience. Conservative on purpose; progress slows over time.
const WEEKLY_GAIN = { new: 0.015, some: 0.0075, lots: 0.0035 };

// Project an exercise's estimated max forward, from its history and the person's experience
function projectLift(name, unit, experience, weeksAhead = 8, only = null) {
    const entries = only || logFor(name);
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

    // "My workout": a one-off session built by Coach, if there is one
    const custom = loadCustomWorkout();
    if (custom) PROGRAMS.custom = custom;

    // An exercise added from a how-to while on this page: show it right away
    window.addEventListener("customchange", () => {
        const mine = loadCustomWorkout();
        if (!mine) return;
        PROGRAMS.custom = mine;
        if (state.goal === "custom") { state.days = Number(Object.keys(mine.plans)[0]); render({ syncUrl: true }); }
    });
    // Open on the plan this person used last time
    const last = store.get("gu-last-plan", {}) || {};
    const state = { goal: PROGRAMS[last.goal] ? last.goal : recommendPlan(), days: Number(last.days) || Number(getProfile().days) || 3, week: null };
    const swapsKey = () => `gu-swaps-${state.goal}-${state.days}`;
    const progressKey = () => `gu-progress-${state.goal}-${state.days}-w${state.week}`;
    const viewHash = () => `#program-${state.goal}-${state.days}`;
    const currentWeek = () => Math.max(1, weekOf(programStart(state.goal)));
    // Week-by-week plans (Couch to 5K) repeat a week instead, so they don't get the light-week button
    const lightOn = () => !PROGRAMS[state.goal].plans[state.days].weeks && isLightWeek(state.goal, state.days, state.week);
    // This week is lighter on purpose (Recover week or a light week you chose)
    const easyWeek = () => lightOn() || (PROGRAMS[state.goal].waves !== false && levelAtLeast("Advanced") && wavePhase(state.week).key === "recover");
    // The plan behind a log form ("sets|low|high"), saved with the session
    const formPlan = (form) => {
        const [sets, low, high] = String(form.dataset.plan || "").split("|").map(Number);
        return sets ? { sets, low, high, easy: easyWeek() } : null;
    };
    let lineups = []; // what's on screen, per day
    let firstTipShown = new Set();
    let notesShown = {};
    // Make the plan on screen "your plan": when you start it, log in it, tick something, or tap Switch
    const adopt = () => { store.set("gu-last-plan", { goal: state.goal, days: state.days }); };
    if (!document.getElementById("adopt-note")) els.head.insertAdjacentHTML("beforebegin", '<p class="adopt-note" id="adopt-note" role="status" hidden></p>');
    // Plan details start open on big screens, folded on phones so the workout is closer
    let planDetailsOpen = false;

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
        showLevelPlans();
        els.dayInputs.forEach((r) => {
            const offered = available.includes(Number(r.value));
            r.disabled = !offered;
            r.closest("label").classList.toggle("is-off", !offered);
            r.closest("label").title = offered ? "" : `${p.name} doesn't have a ${r.value}-day version`;
            r.checked = Number(r.value) === state.days;
        });

        // At home: switch between bodyweight only and dumbbells
        const homeKit = document.getElementById("home-kit");
        if (homeKit) {
            // Shown on the home plans, and on Lose fat (so people losing weight at home find their version)
            const atHome = ["home", "homedb", "dumbbell", "fatloss"].includes(state.goal);
            homeKit.hidden = !atHome;
            if (atHome && PROGRAMS.homedb) {
                const opt = (value, icon, text) => `<label><input type="radio" name="home-kit" value="${value}"${state.goal === value ? " checked" : ""}><span>${icon ? `<span class="equip equip-${icon}" aria-hidden="true"></span>` : ""}${text}</span></label>`;
                homeKit.innerHTML = `<p>${state.goal === "fatloss" ? "Where are you training?" : "Training at home? What do you have?"}</p>
                    <fieldset class="segmented compact"><legend class="visually-hidden">Equipment at home</legend>
                        ${state.goal === "fatloss" ? opt("fatloss", "", "Gym") : ""}
                        ${opt("home", "body", state.goal === "fatloss" ? "Home, nothing" : "Nothing")}
                        ${opt("homedb", "db", state.goal === "fatloss" ? "Home, dumbbells" : "Dumbbells")}
                        ${PROGRAMS.dumbbell && (levelAtLeast("Intermediate") || state.goal === "dumbbell") && state.goal !== "fatloss" ? opt("dumbbell", "db", "Dumbbells + bench") : ""}
                    </fieldset>
                    ${state.goal === "dumbbell" && !levelAtLeast("Intermediate") ? `<p class="home-kit-note">This plan is written for Intermediate lifters. As a beginner, start with light dumbbells and stop each set with 2 or 3 reps left.</p>` : ""}`;
            }
        }

        els.head.innerHTML = `
            <div>
                ${(store.get("gu-last-plan") || {}).goal === state.goal ? `<p class="active-plan-tag"><span aria-hidden="true"></span>Your active plan</p>` : ""}
                <h3>${escapeHtml(p.name)} &middot; ${state.goal === "custom" ? (state.days > 1 ? `${state.days} days` : "1 session") : `${state.days} days`} ${state.goal === "custom" ? "" : `<span class="level-tag level-${(p.level || "").toLowerCase()}">${escapeHtml(p.level || "")}</span>`}</h3>
                <p>${escapeHtml(p.summary)}</p>
                ${state.goal === "custom" ? `<p class="plan-edit">${state.days < 7 ? `<button type="button" class="btn btn-small" data-add-day>+ Add Day ${state.days + 1}</button>` : ""} <span>Tap Edit on a day to swap, add, or remove exercises. Your logged sets stay.</span></p>` : ""}
                ${p.source ? `<p class="plan-source">Based on <a href="${p.source[1]}" target="_blank" rel="noopener">${escapeHtml(p.source[0])}</a>. Adapted for this site; not affiliated.</p>` : ""}
            </div>
            ${!levelAtLeast("Intermediate") ? `<p class="plan-simple"><strong>When:</strong> ${escapeHtml(plan.schedule)} <strong>How hard:</strong> ${escapeHtml(p.effort)}</p>` : ""}
            <details class="plan-details"${planDetailsOpen ? " open" : ""}${levelAtLeast("Intermediate") ? "" : " hidden"}>
                <summary>How this plan works</summary>
                <dl class="program-meta">
                    <div><dt>Schedule</dt><dd>${escapeHtml(plan.schedule)}</dd></div>
                    <div><dt>Session</dt><dd>${escapeHtml(p.session)}</dd></div>
                    <div><dt>How hard</dt><dd>${escapeHtml(p.effort)}</dd></div>
                    <div><dt>Progress by</dt><dd>${escapeHtml(p.progression)}</dd></div>
                </dl>
            </details>`;
        els.head.querySelector(".plan-details").addEventListener("toggle", (e) => { planDetailsOpen = e.target.open; });

        // Week bar
        const start = programStart(state.goal);
        const monday = addDays(start, (state.week - 1) * 7);
        const now = currentWeek();
        els.weekLabel.textContent = `Week ${state.week}${state.week === now ? " · this week" : state.week > now ? " · preview" : ""}`;
        els.weekDates.textContent = `${shortDate(monday)} – ${shortDate(addDays(monday, 6))}`;
        els.weekPrev.disabled = state.week <= 1;
        els.weekToday.hidden = state.week === now;
        const combos = planCombinations(plan, state.goal);
        const phaseEl = document.getElementById("week-phase");
        // Detail grows with your level: training waves, the variety count, and the "why it changes"
        // note from Advanced up (and the research notes start open for Experts)
        const seasoned = levelAtLeast("Advanced");
        const why = document.getElementById("why-rotate");
        if (why) { why.hidden = !seasoned; if (getLevel() === "Expert" && !why.dataset.touched) why.open = true; }
        const prof = document.getElementById("profile-panel");
        if (prof) prof.hidden = !levelAtLeast("Intermediate");
        if (phaseEl) {
            if (p.waves === false || !seasoned) { phaseEl.hidden = true; }
            else {
                const ph = wavePhase(state.week);
                const idx = WAVE.indexOf(ph);
                phaseEl.hidden = false;
                phaseEl.innerHTML = `
                    <span class="wave-dots" aria-hidden="true">${WAVE.map((w, i) => `<span class="${i === idx ? "on" : i < idx ? "done" : ""}"></span>`).join("")}</span>
                    <strong>${ph.name}.</strong> ${ph.tip} <span class="week-challenge">This week's challenge: ${ph.challenge}</span>`;
            }
        }
        const lightBox = document.getElementById("week-light");
        if (lightBox) {
            lightBox.hidden = Boolean(plan.weeks);
            const on = lightOn();
            const btn = document.getElementById("week-light-btn");
            const note = document.getElementById("week-light-note");
            lightBox.classList.toggle("is-on", on);
            btn.setAttribute("aria-pressed", String(on));
            btn.textContent = on ? "Light week on \u2713 \u00b7 Back to normal" : "Make this a light week";
            note.textContent = on
                ? "Half the sets at about 10% lighter. Stop each set with a few reps to spare. Next week goes back to normal on its own."
                : "Feeling run down, sore all over, or short on sleep? A light week keeps the habit going while your body catches up.";
        }
        els.variety.hidden = !seasoned;
        els.variety.textContent = combos > 1
            ? `This plan can be put together ${bigNumber(combos)} different ways. ${p.rotation === "block" ? "Exercises change every 4 weeks." : "Accessories rotate weekly; main lifts every 4 weeks."}`
            : "";

        // Days
        const thisWeek = weekDays(plan, state.week);
        lineups = thisWeek.map((day, di) => dayLineup(state.goal, state.days, di, day.items, state.week, swaps));
        const lastWeek = state.week > 1 && !plan.weeks
            ? plan.days.map((day, di) => dayLineup(state.goal, state.days, di, day.items, state.week - 1, swaps))
            : null;

        firstTipShown = new Set();
        notesShown = {};
        const filed = state.week === currentWeek() ? thisWeek.map((_, di) => filedInProgress(di)) : [];
        els.grid.innerHTML = thisWeek.map((day, di) => `
            <article class="day-card${filed[di] ? " is-filed" : ""}" data-day="${di}">
                <header>
                    <span class="day-num">Day ${di + 1} <span class="day-status"></span></span>
                    <h4>${escapeHtml(day.title)}</h4>
                    ${state.goal === "custom" ? `<span class="day-edit"><button type="button" class="chip" data-edit-day="${di}">Edit</button><button type="button" class="chip" data-share-day="${di}">Share</button>${thisWeek.length > 1 ? `${di > 0 ? `<button type="button" class="chip" data-move-day="${di}" data-dir="-1" aria-label="Move Day ${di + 1} up">&uarr;</button>` : ""}${di < thisWeek.length - 1 ? `<button type="button" class="chip" data-move-day="${di}" data-dir="1" aria-label="Move Day ${di + 1} down">&darr;</button>` : ""}<button type="button" class="chip" data-remove-day="${di}">Remove day</button>` : ""}</span>` : ""}
                </header>
                ${filed[di] ? `<div class="day-filed"><p class="day-filed-note"><span class="day-filed-check" aria-hidden="true">&#10003;</span><span><strong>Saved to Progress.</strong> ${escapeHtml(filed[di])}</span></p><p class="day-filed-links"><a class="text-link" href="me.html#log">See it in Progress</a> <button type="button" class="text-button" data-show-filed="${di}" aria-expanded="false">Show the workout</button></p></div>` : ""}
                <ul class="ex-list"${filed[di] ? " hidden" : ""}>
                    ${lineups[di].map((x, xi) => exerciseRow(x, di, xi, done, profile, lastWeek && lastWeek[di][xi].name !== x.name)).join("")}
                </ul>
                ${state.week === currentWeek() ? (() => { const doneToday = (store.get("gu-sessions", []) || []).some((x) => x && x.date === isoDate(new Date()) && x.plan === state.goal && x.day === di); return doneToday
                    ? `<div class="day-finish is-done">${filed[di] ? "" : `<p class="day-finish-note">Finished today \u2713</p>`}${state.goal === "custom" ? `<button type="button" class="btn btn-primary" data-continue="${di}">${escapeHtml(continueLabel(di))} &rarr;</button>` : `<p class="day-finish-next">Rest up. ${thisWeek[di + 1] ? `Day ${di + 2} is for your next training day.` : "That's the last day this week."}</p><button type="button" class="text-button" data-continue="${di}">${escapeHtml(continueLabel(di))} &rarr;</button>`}${state.goal === "custom" && thisWeek[di + 1] ? `<button type="button" class="text-button" data-edit-day="${di + 1}">Edit Day ${di + 2} first</button>` : ""}<button type="button" class="text-button" data-finish="${di}">See summary</button></div>`
                    : `<div class="day-finish"><button type="button" class="btn btn-primary" data-finish="${di}">Finish workout</button>${planPaused() ? `<button type="button" class="text-button" data-resume-plan>Continue this plan</button>` : `<button type="button" class="text-button" data-cancel-workout>Cancel workout</button>`}</div>`; })() : ""}
            </article>`).join("");

        updateProgress();
        renderProfileNote(profile);
        // Only the plan you're actually doing is "your plan" (looking at another one doesn't switch it)
        const cur = store.get("gu-last-plan") || {};
        if (!PROGRAMS[cur.goal] || (cur.goal === state.goal && Number(cur.days) !== state.days)) adopt();
        const adoptNote = document.getElementById("adopt-note");
        if (adoptNote) {
            const mine = PROGRAMS[cur.goal] && cur.goal !== state.goal ? PROGRAMS[cur.goal] : null;
            adoptNote.hidden = !mine;
            if (mine) adoptNote.innerHTML = `You're looking at <strong>${escapeHtml(p.name)}</strong>. Your plan is still <strong>${escapeHtml(mine.name)}</strong>. <button type="button" class="btn btn-compact" data-adopt-plan>Switch to this plan</button> <a class="text-link" href="programs.html?today=1#program-${cur.goal}-${cur.days}">Back to my plan</a>`;
        }
        restoreDrafts();
        if (syncUrl) history.replaceState(null, "", viewHash());
    }

    /* ----- Half-typed sets survive a reload or switching apps (kept for today only) ----- */
    const DRAFT_KEY = "gu-log-draft";
    const draftId = (form) => `${state.goal}-${state.days}-w${state.week}:${form.id.replace("log-", "")}`;
    function saveDraft(form) {
        const all = store.get(DRAFT_KEY, {}) || {};
        all[draftId(form)] = { date: isoDate(new Date()), ex: form.dataset.exercise,
            w: [...form.querySelectorAll('input[name="w"]')].map((i) => i.value.slice(0, 8)),
            r: [...form.querySelectorAll('input[name="r"]')].map((i) => i.value.slice(0, 4)) };
        store.set(DRAFT_KEY, all);
    }
    function dropDraft(form) {
        const all = store.get(DRAFT_KEY, {}) || {};
        delete all[draftId(form)];
        store.set(DRAFT_KEY, all);
    }
    function restoreDrafts() {
        const all = store.get(DRAFT_KEY, {}) || {};
        const today = isoDate(new Date());
        let changed = false;
        Object.entries(all).forEach(([id, dr]) => {
            if (!dr || dr.date !== today) { delete all[id]; changed = true; return; }
            const [plan, slot] = id.split(":");
            if (plan !== `${state.goal}-${state.days}-w${state.week}`) return;
            const form = document.getElementById(`log-${slot}`);
            if (!form || form.classList.contains("cardio-form") || form.dataset.exercise !== dr.ex) return;
            const num = (v) => (/^\d{0,4}(\.\d{0,2})?$/.test(String(v)) ? String(v) : "");
            form.querySelectorAll('input[name="w"]').forEach((i, k) => { if (Array.isArray(dr.w) && dr.w[k] != null) i.value = num(dr.w[k]); });
            form.querySelectorAll('input[name="r"]').forEach((i, k) => { if (Array.isArray(dr.r) && dr.r[k] != null) i.value = num(dr.r[k]); i.closest(".log-set").classList.toggle("is-done", Boolean(i.value)); });
            form.hidden = false;
            const btn = els.grid.querySelector(`[data-log="${slot}"]`);
            if (btn) btn.setAttribute("aria-expanded", "true");
            const st = form.querySelector(".log-status");
            if (st) st.textContent = "Picked up where you left off. Tap Save sets when you're done.";
        });
        if (changed) store.set(DRAFT_KEY, all);
    }

    function exerciseRow(x, di, xi, done, profile, isNew) {
        const key = `${di}-${xi}`;
        const id = `ex-${key}`;
        const dose = personalDose(state.goal, x, xi, profile, state.week, lightOn());
        const parsed = parseDose(x.d);
        const info = typeof EXERCISES === "object" ? EXERCISES[x.name] : null;
        const easier = x.name === x.n && x.swap ? x.swap : (info && info.easier) || "";
        const cardio = isCardio(x.name);
        let target = cardio ? nextCardioTarget(x.name, profile.unit) : nextTarget(x.name, dose.text, profile.unit);
        // Week-by-week plans set the next step themselves
        if (cardio && PROGRAMS[state.goal].plans[state.days].weeks && target && !target.first) target = { ...target, text: "Stick to this week's runs. The plan steps up next week, and repeating a week is fine." };
        // The "first time" tip shows once per day card, not on every exercise
        if (target && target.first && !target.start) {
            if (firstTipShown.has(di)) target = null;
            else firstTipShown.add(di);
        }
        // Recover week: same exercise, about 10% lighter on purpose
        if (target && target.weight > 0 && PROGRAMS[state.goal].waves !== false && levelAtLeast("Advanced") && wavePhase(state.week).key === "recover") {
            const w = loadableDrop(x.name, profile.unit, target.weight);
            target = { ...target, up: false, weight: w, text: `Recover week: about ${trimNum(w)} ${profile.unit}${target.each ? " in each hand" : ""}, roughly 10% lighter than usual. Easy on purpose.` };
        }
        // Light week: the same, when the person asked for it
        else if (target && target.weight > 0 && lightOn()) {
            const w = loadableDrop(x.name, profile.unit, target.weight);
            target = { ...target, up: false, weight: w, text: `Light week: about ${trimNum(w)} ${profile.unit}${target.each ? " in each hand" : ""}, roughly 10% lighter than usual. Stop each set with a few reps to spare.` };
        }
        const badges = [
            xi === 0 && x.canRotate && !cardio && PROGRAMS[state.goal].rotation !== "none" ? `<span class="badge">Main lift</span>` : "",
            isNew && !x.swapped ? `<span class="badge badge-new">New this week</span>` : "",
            x.swapped ? `<span class="badge">Swapped</span>` : "",
            x.skipped ? `<span class="badge badge-you">Instead of ${escapeHtml(x.skipped.toLowerCase())}</span>` : "",
            profile.minutes && xi >= ({ 30: 4, 45: 5, 60: 6 }[profile.minutes] || 99) && !cardio ? `<span class="badge">Optional if you're short on time</span>` : "",
            // Each note once per day card (not "Your goal: ..." on every exercise)
            ...dose.notes.filter((n) => { const seen = notesShown[di] || (notesShown[di] = new Set()); if (seen.has(n)) return false; seen.add(n); return true; }).map((n) => `<span class="badge badge-you">${escapeHtml(n)}</span>`)
        ].join("");
        return `
            <li class="ex-row" data-slot="${key}">
                <input type="checkbox" id="${id}" data-key="${key}" ${done.has(key) ? "checked" : ""} aria-label="Done: ${escapeHtml(x.name)}">
                <div class="ex-main">
                    <label for="${id}" class="ex-name">${equipIcon(x.name)}${escapeHtml(x.name)}</label>
                    <span class="ex-dose">${escapeHtml(dose.text)}${target && target.weight > 0 && !cardio ? ` <span class="ex-dose-weight">· ${trimNum(target.weight)} ${profile.unit}${target.each ? " each" : ""}</span>` : ""}</span>
                    ${state.goal === "custom" && !parsed.timed && !cardio ? `<span class="ex-sets-adjust" role="group" aria-label="Sets for ${escapeHtml(x.name)}">
                        <button type="button" class="chip" data-sets-adjust="${key}" data-dir="-1" aria-label="One less set of ${escapeHtml(x.name)}"${parsed.sets <= 1 ? " disabled" : ""}>&minus; set</button>
                        <button type="button" class="chip" data-sets-adjust="${key}" data-dir="1" aria-label="One more set of ${escapeHtml(x.name)}"${parsed.sets >= 8 ? " disabled" : ""}>+ set</button>
                    </span>` : ""}
                    ${badges ? `<span class="ex-badges">${badges}</span>` : ""}
                    ${x.rest ? (restSeconds(x.rest)
                        ? `<button type="button" class="rest-btn" data-rest="${restSeconds(x.rest)}" data-rest-name="${escapeHtml(x.name)}"><span aria-hidden="true">&#9654;</span> Rest ${escapeHtml(x.rest)}<span class="visually-hidden">: start rest timer</span></button>`
                        : `<span class="ex-rest">Rest ${escapeHtml(x.rest)}</span>`) : ""}
                    ${easier ? `<span class="ex-swap">Easier option: ${escapeHtml(easier)}</span>` : ""}
                    ${target ? `<span class="ex-target${target.up ? " is-up" : ""}">${target.lastText ? `<span class="ex-last">${(logFor(x.name).slice(-1)[0] || {}).date === isoDate(new Date()) ? "Today so far" : "Last time"}: ${escapeHtml(target.lastText)}</span>` : ""}${escapeHtml(target.text)}</span>` : ""}
                    <span class="ex-actions">
                        ${info ? `<button type="button" class="chip" data-howto="${escapeHtml(x.name)}">How to</button>` : ""}
                        ${x.canRotate ? `<button type="button" class="chip" data-swap="${key}">Swap</button>` : ""}
                        ${!parsed.timed ? `<button type="button" class="chip" data-log="${key}" aria-expanded="false" aria-controls="log-${key}">Log sets</button>` : ""}
                        ${cardio ? `<button type="button" class="chip" data-log="${key}" aria-expanded="false" aria-controls="log-${key}">Log cardio</button>` : ""}
                    </span>
                    ${!parsed.timed ? logForm(x, key, parseDose(dose.text), target, profile.unit) : ""}
                    ${cardio ? cardioForm(x, key, profile.unit) : ""}
                </div>
            </li>`;
    }

    function logForm(x, key, dose, target, unit) {
        const weight = target && target.weight ? trimNum(target.weight) : "";
        // Dumbbell moves are logged per hand, so say so right on the box
        const sw = typeof startWeight === "function" ? startWeight(x.name, dose.high || 10, unit) : null;
        const each = Boolean((target && target.each) || (sw && sw.each));
        // Today's target reps show as a hint; only sets you fill in (or tick done) are saved
        const reps = (target && !target.first && target.reps) || dose.low || dose.high || "";
        const head = `<div class="log-set log-set-head" aria-hidden="true"><span></span><span>${unit}${each ? " each" : ""}</span><span>Reps</span><span>Done</span></div>`;
        const rows = head + Array.from({ length: dose.sets }, (_, i) => `
            <div class="log-set">
                <span class="log-set-num">Set ${i + 1}</span>
                <label><span class="visually-hidden">Set ${i + 1} weight${each ? " in each hand" : ""}</span><input type="number" inputmode="decimal" min="0" step="any" name="w" value="${weight}" placeholder="0"><span class="log-unit">${unit}${each ? " each" : ""}</span></label>
                <label><span class="visually-hidden">Set ${i + 1} reps</span><input type="number" inputmode="numeric" min="0" step="1" name="r" placeholder="${reps}"><span class="log-unit">reps</span></label>
                <button type="button" class="log-set-done" data-set-done aria-label="Set ${i + 1} done${reps ? `: ${reps} reps` : ""}, start rest"><span aria-hidden="true">&#10003;</span></button>
            </div>`).join("");
        return `
            <form class="log-form" id="log-${key}" data-exercise="${escapeHtml(x.name)}" data-plan="${dose.sets || 0}|${dose.low || 0}|${dose.high || dose.low || 0}" hidden novalidate>
                <div class="log-date"><label>Date <input type="date" name="date" value="${isoDate(new Date())}" max="${isoDate(new Date())}"></label></div>
                ${rows}
                <p class="log-help">Tap <strong>&#10003;</strong> after each set: it fills in the target reps (change them if you did fewer) and starts your rest. ${each ? "Weight is for one dumbbell. " : ""}Change set 1's weight and the rest follow.</p>
                <div class="log-buttons">
                    <button type="submit" class="btn btn-primary btn-compact">Save sets</button>
                    <button type="button" class="text-button" data-log-cancel="${key}">Cancel</button>
                </div>
                <p class="log-status" role="status"></p>
            </form>`;
    }

    function cardioForm(x, key, unit) {
        const options = (familyFor(x.n, state.goal) || [x.name]).filter(isCardio);
        if (!options.includes(x.name)) options.unshift(x.name);
        return `
            <form class="log-form cardio-form" id="log-${key}" data-exercise="${escapeHtml(x.name)}" hidden novalidate>
                <div class="cardio-grid">
                    <label>Activity
                        <select name="activity">${options.map((n) => `<option${n === x.name ? " selected" : ""}>${escapeHtml(n)}</option>`).join("")}<option>Other cardio</option></select>
                    </label>
                    <label>Date <input type="date" name="date" value="${isoDate(new Date())}" max="${isoDate(new Date())}"></label>
                    <label>Minutes <input type="number" name="minutes" inputmode="numeric" min="1" max="600" placeholder="30"></label>
                    <label>Distance (${distUnit(unit)}, optional) <input type="number" name="distance" inputmode="decimal" min="0" step="0.01" placeholder="2.0"></label>
                    <label>How hard was it?
                        <select name="effort">
                            <option value="3">Easy: could chat the whole time</option>
                            <option value="5" selected>Moderate: short sentences</option>
                            <option value="7">Hard: a few words at a time</option>
                            <option value="9">Very hard: couldn't talk</option>
                        </select>
                    </label>
                </div>
                <div class="log-buttons">
                    <button type="submit" class="btn btn-primary btn-compact">Save cardio</button>
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
        if (profile.sex) {
            notes.push("Every plan here works the same for men and women: research finds both build muscle and strength at similar rates, so you don't need a separate \"women's\" or \"men's\" program. Lighter upper-body lifts move up in smaller steps.");
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
        const streak = weekStreak();
        els.label.textContent = (checked === total && total > 0
            ? `Week ${state.week} done. Nice work. Next week's plan is ready when you are.`
            : `${checked} of ${total} exercises done this week`) + (streak >= 2 ? ` · ${streak}-week streak` : "");
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
            if (isNext) card.id = "up-next"; else if (card.id === "up-next") card.removeAttribute("id");
        });
        // This week: days you've finished drop below the one you're on, under "Done this week"
        const cards = els.grid.querySelectorAll(".day-card");
        const doneN = els.grid.querySelectorAll(".day-card.complete").length;
        const sortDone = state.week === currentWeek() && doneN > 0 && doneN < cards.length;
        els.grid.classList.toggle("sort-done", sortDone);
        let doneLabel = els.grid.querySelector(".done-label");
        if (!doneLabel) { els.grid.insertAdjacentHTML("beforeend", `<p class="done-label"></p>`); doneLabel = els.grid.querySelector(".done-label"); }
        doneLabel.textContent = `Done this week (${doneN})`;
        const jump = document.getElementById("jump-today");
        if (jump) {
            const next = els.grid.querySelector(".day-card.is-next");
            jump.hidden = !next;
            if (next) jump.textContent = `Today's workout: Day ${Number(next.dataset.day) + 1}`;
        }
    }

    /* ----- Continue: from a finished day to the next one (or build it, or next week) ----- */
    function continueFrom(di) {
        const list = weekDays(PROGRAMS[state.goal].plans[state.days], state.week);
        if (list[di + 1]) {
            const card = els.grid.querySelector(`.day-card[data-day="${di + 1}"]`);
            if (card) {
                card.scrollIntoView({ behavior: "smooth", block: "start" });
                card.classList.add("is-flash");
                setTimeout(() => card.classList.remove("is-flash"), 1600);
                const first = card.querySelector("[data-log], .rest-btn, input");
                if (first) setTimeout(() => first.focus({ preventScroll: true }), 500);
            }
        } else if (state.goal === "custom" && list.length < 7) {
            addCustomDay();
        } else {
            goToWeek(state.week + 1);
            window.scrollTo({ top: els.grid.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
        }
    }
    const continueLabel = (di) => {
        const list = weekDays(PROGRAMS[state.goal].plans[state.days], state.week);
        if (list[di + 1]) return `Continue to Day ${di + 2}: ${list[di + 1].title}`;
        if (state.goal === "custom" && list.length < 7) return `Continue to Day ${di + 2}: build it`;
        return "Week done. Go to next week";
    };

    /* ----- Finish workout: save the session, celebrate, and show next time's targets ----- */
    /* A finished day folds away once its data is safely in Progress: a session is saved for today and
       every set logged today for this day's exercises is in the log the Progress tab reads. Returns a short
       summary ("4 exercises · 12 sets") when it's all there, or "" to keep the workout showing. */
    function filedInProgress(di) {
        const today = isoDate(new Date());
        const sess = (store.get("gu-sessions", []) || []).find((x) => x && x.date === today && x.plan === state.goal && x.day === di);
        if (!sess) return "";
        const names = Array.isArray(sess.names) ? sess.names : [];
        const items = lineups[di] || [];
        if (items.some((x) => !names.includes(x.name))) return "";
        // Anything still typed in a form but not saved means it isn't all in Progress yet
        const drafts = store.get("gu-log-draft", {}) || {};
        const pending = Object.values(drafts).some((dr) => dr && dr.date === today && items.some((x) => x.name === dr.ex) && Array.isArray(dr.r) && dr.r.some((v) => Number(v) > 0));
        if (pending) return "";
        const sets = items.reduce((n, x) => { const e = (logFor(x.name) || []).find((en) => en.date === today); return n + (e ? e.sets.length : 0); }, 0);
        const ex = Number(sess.exercises) || items.length;
        return `${ex} exercise${ex === 1 ? "" : "s"}${sets ? ` · ${sets} set${sets === 1 ? "" : "s"} logged` : ""}`;
    }

    function finishWorkout(di) {
        const card00 = els.grid.querySelector(`.day-card[data-day="${di}"]`);
        const today0 = isoDate(new Date());
        const already = (store.get("gu-sessions", []) || []).some((x) => x && x.date === today0 && x.plan === state.goal && x.day === di);
        const anyDone = card00 && ([...card00.querySelectorAll('input[type="checkbox"]')].some((b) => b.checked)
            || [...card00.querySelectorAll('.log-form input[name="r"]')].some((i) => i.value)
            || (lineups[di] || []).some((x) => (logFor(x.name) || []).some((e) => e.date === today0)));
        if (!already && !anyDone && !window.confirm(`Nothing is checked off or logged on Day ${di + 1} yet. Finish Day ${di + 1} anyway?`)) return;
        adopt();
        // Sets you ticked or typed but didn't tap Save on still count
        const card0 = els.grid.querySelector(`.day-card[data-day="${di}"]`);
        if (card0) card0.querySelectorAll(".log-form:not(.cardio-form)").forEach((form) => {
            const ws = [...form.querySelectorAll('input[name="w"]')], rs = [...form.querySelectorAll('input[name="r"]')];
            const sets = rs.map((r, i) => ({ w: Number(ws[i].value) || 0, r: Number(r.value) })).filter((st) => Number.isInteger(st.r) && st.r > 0 && st.r <= 100 && st.w >= 0 && st.w <= 1500);
            if (!sets.length) return;
            const date = (form.elements.date && form.elements.date.value) || isoDate(new Date());
            const already = (logFor(form.dataset.exercise) || []).some((e) => e.date === date && e.sets.length >= sets.length);
            if (!already) saveSession(form.dataset.exercise, date, getProfile().unit, sets, formPlan(form));
            dropDraft(form);
        });
        const profile = getProfile(), unit = profile.unit;
        const today = isoDate(new Date());
        const p = PROGRAMS[state.goal];
        const day = weekDays(p.plans[state.days], state.week)[di];
        const items = lineups[di] || [];
        let sets = 0, reps = 0, volume = 0;
        const lines = items.map((x, xi) => {
            const dose = personalDose(state.goal, x, xi, profile, state.week, lightOn());
            const entry = (logFor(x.name) || []).find((en) => en.date === today);
            const hands = ((startWeight(x.name, 10, unit) || {}).each) ? 2 : 1; // per-hand weights count both dumbbells
            if (entry) entry.sets.forEach((st) => { sets += 1; reps += st.r; volume += toUnit(st.w || 0, entry.unit, unit) * st.r * hands; });
            const cardio = isCardio(x.name);
            const t = cardio ? nextCardioTarget(x.name, unit) : nextTarget(x.name, dose.text, unit);
            const d = parseDose(dose.text);
            // The same advice the plan card gives, so the two never disagree
            let next = t && t.text ? t.text : "";
            if (t && t.first && t.weight > 0) next = `Start with about ${trimNum(t.weight)} ${unit}${t.each ? " each hand" : ""}.`;
            if (cardio) next = isCardio(x.name) && !entry && /min/.test(x.d || "") ? "Same again, or a few minutes longer." : next;
            if (d.timed && !entry) return { name: x.name, logged: false, did: "", next: cardio ? "Same again, or a few minutes longer." : "", up: false, timed: !cardio };
            return { name: x.name, logged: Boolean(entry), did: entry ? entry.sets.map((st) => (st.w ? `${trimNum(toUnit(st.w, entry.unit, unit))}×${st.r}` : `${st.r}`)).join(", ") : "", next, up: Boolean(t && t.up) };
        });
        // How many exercises were actually done: logged today or checked off (finishing with nothing marked counts the whole day)
        const before = new Set(store.get(progressKey(), []));
        // A walk or ride you checked off (without logging it) still counts toward your weekly cardio minutes
        items.forEach((x, xi) => {
            if (!isCardio(x.name) || !before.has(`${di}-${xi}`)) return;
            if (getCardio().some((c) => c.date === today && c.activity === x.name)) return;
            const m = String(x.d || "").match(/(\d{1,3})\s*min/);
            if (m && Number(m[1]) > 0 && Number(m[1]) <= 180) saveCardio({ date: today, activity: x.name, minutes: Number(m[1]), distance: 0, dunit: distUnit(unit), effort: 0 });
        });
        const doneCount = items.filter((_, xi) => lines[xi].logged || before.has(`${di}-${xi}`)).length || items.length;
        // Check the whole day off and keep a record of the session
        const keys = new Set(store.get(progressKey(), []));
        items.forEach((_, xi) => keys.add(`${di}-${xi}`));
        store.set(progressKey(), [...keys]);
        const card = els.grid.querySelector(`.day-card[data-day="${di}"]`);
        if (card) card.querySelectorAll('input[type="checkbox"]').forEach((b) => { b.checked = true; });
        const sessions = (store.get("gu-sessions", []) || []).filter((x) => x && !(x.date === today && x.plan === state.goal && x.day === di));
        sessions.push({ date: today, plan: state.goal, planName: p.name, days: state.days, day: di, title: day.title, names: items.map((x) => x.name).slice(0, 20), exercises: doneCount, sets, reps, volume: Math.round(volume), unit });
        store.set("gu-sessions", sessions.slice(-200));
        updateProgress();
        window.dispatchEvent(new CustomEvent("logchange", { detail: { finished: true } }));
        // Saved. Say so on the button right away, whatever happens with the pop-up
        render();
        try { showFinish(); }
        catch (err) { showToast("Workout saved. Good job!", lines.filter((l) => l.next).slice(0, 3).map((l) => `${l.name}: ${l.next}`).join(" · ") || "Your targets update every time you log."); }
        function showFinish() {
        const prs = getPRs().filter((r) => r.date === today);
        const streak = weekStreak();
        const dayList = weekDays(p.plans[state.days], state.week);
        const nextDay = dayList[di + 1] || null;
        let dlg = document.getElementById("finish-dialog");
        if (!dlg) {
            document.body.insertAdjacentHTML("beforeend", `<dialog id="finish-dialog" class="finish-dialog" aria-labelledby="finish-title"><div class="finish-inner"></div></dialog>`);
            dlg = document.getElementById("finish-dialog");
            dlg.addEventListener("click", (ev) => {
                const shut = () => { if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); document.body.classList.remove("finish-open"); };
                const go = ev.target.closest("[data-finish-continue]");
                if (go) { shut(); continueFrom(Number(go.dataset.finishContinue)); return; }
                const ed = ev.target.closest("[data-finish-editday]");
                if (ed) { shut(); editCustomWorkout(Number(ed.dataset.finishEditday)); return; }
                if (ev.target.closest("[data-finish-addday]")) { shut(); addCustomDay(); return; }
                if (ev.target.closest("[data-finish-plans]")) {
                    shut();
                    const picker = document.getElementById("all-plans") || document.getElementById("goal-picker");
                    if (picker) picker.scrollIntoView({ behavior: "smooth", block: "start" });
                    return;
                }
                if (ev.target === dlg || ev.target.closest("[data-finish-close]")) {
                    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
                    document.body.classList.remove("finish-open");
                    // Land on the day you're on next (finished days sit below it now)
                    const landOn = els.grid.querySelector(".day-card.is-next") || els.grid.querySelector(`.day-card[data-day="${dlg.dataset.day}"]`);
                    if (landOn) landOn.scrollIntoView({ block: "start" });
                }
            });
        }
        dlg.dataset.day = String(di);
        dlg.querySelector(".finish-inner").innerHTML = `
            <div class="finish-burst" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <p class="finish-kicker">${escapeHtml(day.title)} · ${escapeHtml(p.name)}</p>
            <h2 id="finish-title">Good job. Workout done.</h2>
            <ul class="finish-stats">
                <li><strong>${doneCount}</strong> exercise${doneCount === 1 ? "" : "s"}</li>
                <li><strong>${sets}</strong> sets logged</li>
                <li><strong>${fmt(volume)}</strong> ${unit} lifted</li>
                ${streak >= 2 ? `<li><strong>${streak}</strong> week streak</li>` : ""}
            </ul>
            ${prs.length ? `<p class="finish-pr"><strong>New personal record${prs.length > 1 ? "s" : ""}:</strong> ${escapeHtml([...new Set(prs.map((r) => r.name))].join(", "))}</p>` : ""}
            <h3>Next time</h3>
            <ul class="finish-next">${lines.map((l) => `<li>${equipIcon(l.name)}<span><strong>${escapeHtml(l.name)}</strong>${l.did ? `<small>Today: ${escapeHtml(l.did)}</small>` : l.timed ? `<small>Timed: just check it off</small>` : `<small>Not logged today</small>`}</span><em class="${l.up ? "is-up" : ""}">${escapeHtml(l.next || (l.timed ? "Hold a little longer next time" : l.logged ? "" : "Log your sets next time to get a target"))}</em></li>`).join("")}</ul>
            ${sets ? "" : `<p class="finish-tip">Tip: log your weight and reps on each exercise (Log sets) and next time you'll get an exact weight to aim for.</p>`}
            <h3>What's next?</h3>
            ${state.goal !== "custom" && nextDay ? `<p class="finish-tip">Next time: <strong>Day ${di + 2}, ${escapeHtml(nextDay.title)}</strong>. This plan works best with a rest day in between, so your next training day is a good time for it.</p>` : ""}
            <div class="finish-nextup">
                ${state.goal === "custom" ? "" : `<button type="button" class="btn btn-primary" data-finish-close>Done for today</button>`}
                <button type="button" class="${state.goal === "custom" ? "btn btn-primary" : "text-button"}" data-finish-continue="${di}">${escapeHtml(state.goal !== "custom" && nextDay ? `Or do Day ${di + 2} now` : continueLabel(di))} &rarr;</button>
                ${state.goal === "custom" && nextDay ? `<button type="button" class="btn" data-finish-editday="${di + 1}">Edit Day ${di + 2} first</button>` : ""}
                ${state.goal === "custom" && nextDay && dayList.length < 7 ? `<button type="button" class="btn" data-finish-addday>+ Add Day ${dayList.length + 1}</button>` : ""}
                ${state.goal === "custom" ? "" : `<a class="btn" href="programs.html#build">Build my own workout</a>`}
                <button type="button" class="btn" data-finish-plans>Pick a different plan</button>
            </div>
            <p class="finish-saved">Saved on this device${typeof FIREBASE_CONFIG === "object" && FIREBASE_CONFIG.apiKey ? " and to your account when you're signed in" : ""}. Your targets update every time you log.</p>
            <div class="finish-actions">
                <a class="btn" href="me.html">See my progress</a>
                ${state.goal === "custom" ? `<button type="button" class="btn" data-finish-close>Done for today</button>` : ""}
            </div>`;
        if (dlg.open) dlg.close();
        if (typeof dlg.showModal === "function") { try { dlg.showModal(); } catch (e2) { dlg.setAttribute("open", ""); } }
        else dlg.setAttribute("open", "");
        document.body.classList.add("finish-open");
        dlg.addEventListener("close", () => document.body.classList.remove("finish-open"), { once: true });
        if (navigator.vibrate) navigator.vibrate(60);
        const btn = dlg.querySelector("[data-finish-close]");
        if (btn) btn.focus();
        }
    }

    /* ----- Events ----- */
    els.grid.addEventListener("change", (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;
        const keys = [...els.grid.querySelectorAll('input[type="checkbox"]:checked')].map((b) => b.dataset.key);
        store.set(progressKey(), keys);
        if (e.target.checked) adopt();
        updateProgress();
    });

    els.grid.addEventListener("click", (e) => {
        const fin = e.target.closest("[data-finish]");
        if (fin) { finishWorkout(Number(fin.dataset.finish)); return; }
        const cont = e.target.closest("[data-continue]");
        if (cont) { continueFrom(Number(cont.dataset.continue)); return; }
        const sf = e.target.closest("[data-show-filed]");
        if (sf) {
            const list = sf.closest(".day-card").querySelector(".ex-list");
            list.hidden = !list.hidden;
            sf.setAttribute("aria-expanded", String(!list.hidden));
            sf.textContent = list.hidden ? "Show the workout" : "Hide the workout";
            return;
        }
        const ed = e.target.closest("[data-edit-day]");
        if (ed) { editCustomWorkout(Number(ed.dataset.editDay)); return; }
        // Your plan: add or take away a set right here (no need to rebuild the workout)
        const adj = e.target.closest("[data-sets-adjust]");
        if (adj) {
            const [di, xi] = adj.dataset.setsAdjust.split("-").map(Number);
            const days = customDaysRaw();
            const it = days[di] && days[di].items[xi];
            if (!it) return;
            const m = String(it.d).match(/^(\d+)(\s*×.*)$/);
            if (!m) return;
            const n = Math.min(8, Math.max(1, Number(m[1]) + Number(adj.dataset.dir)));
            it.d = `${n}${m[2]}`;
            saveCustomDays(days);
            PROGRAMS.custom = loadCustomWorkout();
            render();
            const again = els.grid.querySelector(`[data-sets-adjust="${di}-${xi}"][data-dir="${adj.dataset.dir}"]`);
            if (again && !again.disabled) again.focus();
            const st = els.grid.querySelector(`[data-slot="${di}-${xi}"] .ex-dose`);
            if (st) st.setAttribute("aria-live", "polite");
            return;
        }
        const mv = e.target.closest("[data-move-day]");
        if (mv) {
            const i = Number(mv.dataset.moveDay), j = i + Number(mv.dataset.dir), days = customDaysRaw();
            if (!days[i] || !days[j]) return;
            [days[i], days[j]] = [days[j], days[i]];
            // Check-offs follow their day
            const key = progressKey();
            const swapIdx = (k) => { const [d, x] = String(k).split("-"); const n = Number(d); return `${n === i ? j : n === j ? i : n}-${x}`; };
            store.set(key, (store.get(key, []) || []).map(swapIdx));
            clearCustomSwaps();
            saveCustomDays(days);
            PROGRAMS.custom = loadCustomWorkout();
            render();
            const again = els.grid.querySelector(`[data-move-day="${j}"]`) || els.grid.querySelector(`.day-card[data-day="${j}"]`);
            if (again) again.focus();
            return;
        }
        const rm = e.target.closest("[data-remove-day]");
        if (rm) {
            const i = Number(rm.dataset.removeDay), days = customDaysRaw();
            if (days.length > 1 && days[i] && window.confirm(`Remove Day ${i + 1} (${days[i].title || "workout"}) from My workout? Your logged sets stay.`)) {
                days.splice(i, 1);
                clearCustomSwaps();
                saveCustomDays(days);
                store.set("gu-last-plan", { goal: "custom", days: days.length });
                location.assign(`programs.html?w=${Date.now()}#program-custom-${days.length}`);
            }
            return;
        }
        const swapBtn = e.target.closest("[data-swap]");
        if (swapBtn) {
            const [di, xi] = swapBtn.dataset.swap.split("-").map(Number);
            const current = lineups[di][xi];
            const fam = familyFor(current.n, state.goal) || [current.name];
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
        const setDone = e.target.closest("[data-set-done]");
        if (setDone) {
            adopt();
            const row = setDone.closest(".log-set"), form = setDone.closest(".log-form");
            const r = row.querySelector('input[name="r"]');
            if (!r.value) r.value = r.placeholder;
            row.classList.add("is-done");
            saveDraft(form);
            // Rest starts right away; the next set's boxes stay above the timer
            const restBtn = form.closest(".ex-row") && form.closest(".ex-row").querySelector("[data-rest]");
            if (restBtn) restBtn.click();
            const next = row.nextElementSibling && row.nextElementSibling.matches(".log-set") ? row.nextElementSibling : form.querySelector("button[type=submit]");
            setTimeout(() => next.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" }), 60);
            return;
        }
        const logBtn = e.target.closest("[data-log]");
        if (logBtn) {
            const form = document.getElementById(`log-${logBtn.dataset.log}`);
            const open = form.hidden;
            form.hidden = !open;
            logBtn.setAttribute("aria-expanded", String(open));
            if (open) {
                // Bring the set boxes into view (not just the date row)
                form.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest" });
                const firstEmpty = [...form.querySelectorAll('input[name="r"]')].find((i) => !i.value);
                if (firstEmpty) firstEmpty.focus({ preventScroll: true });
            }
            return;
        }
        const cancel = e.target.closest("[data-log-cancel]");
        if (cancel) {
            const key = cancel.dataset.logCancel;
            dropDraft(document.getElementById(`log-${key}`));
            document.getElementById(`log-${key}`).hidden = true;
            const btn = els.grid.querySelector(`[data-log="${key}"]`);
            btn.setAttribute("aria-expanded", "false");
            btn.focus();
        }
    });

    // Changing set 1's weight fills the sets below that still had the old value
    els.grid.addEventListener("focusin", (e) => { if (e.target.matches('.log-form input[name="w"]')) e.target.dataset.was = e.target.value; });
    els.grid.addEventListener("input", (e) => {
        const inp = e.target;
        if (inp.matches('.log-form:not(.cardio-form) input[name="r"]')) { saveDraft(inp.closest(".log-form")); return; }
        if (!inp.matches('.log-form input[name="w"]')) return;
        const form = inp.closest(".log-form");
        form.dataset.zeroOk = "";
        const ws = [...form.querySelectorAll('input[name="w"]')];
        const i = ws.indexOf(inp);
        const was = inp.dataset.was ?? "";
        ws.slice(i + 1).forEach((w) => { if (w.value === was || w.dataset.follow === "1") { w.value = inp.value; w.dataset.follow = "1"; } });
        inp.dataset.follow = "";
        inp.dataset.was = inp.value;
        if (!form.classList.contains("cardio-form")) saveDraft(form);
    });

    els.grid.addEventListener("submit", (e) => {
        const form = e.target.closest(".log-form");
        if (!form) return;
        e.preventDefault();
        adopt();
        const unit = getProfile().unit;
        if (form.classList.contains("cardio-form")) {
            const f = form.elements;
            const minutes = Number(f.minutes.value);
            const status = form.querySelector(".log-status");
            if (!minutes || minutes < 1) { status.textContent = "Add how many minutes you did."; f.minutes.focus(); return; }
            if (minutes > 600 || Number(f.distance.value) < 0) { status.textContent = "Check the numbers: up to 600 minutes, and distance can't be negative."; f.minutes.focus(); return; }
            const date = f.date.value || isoDate(new Date());
            saveCardio({ date, activity: f.activity.value, minutes, distance: Number(f.distance.value) || 0, dunit: distUnit(unit), effort: Number(f.effort.value) });
            const slot = form.id.replace("log-", "");
            const box = document.getElementById(`ex-${slot}`);
            if (box && !box.checked && date === isoDate(new Date())) {
                box.checked = true;
                box.dispatchEvent(new Event("change", { bubbles: true }));
            }
            render();
            const btn = els.grid.querySelector(`[data-log="${slot}"]`);
            if (btn) btn.focus();
            return;
        }
        const ws = [...form.querySelectorAll('input[name="w"]')];
        const rs = [...form.querySelectorAll('input[name="r"]')];
        const sets = rs.map((r, i) => ({ w: Number(ws[i].value) || 0, r: Number(r.value) }))
            .filter((s) => Number.isFinite(s.r) && s.r > 0);
        const status = form.querySelector(".log-status");
        if (!sets.length) { status.textContent = "Add the reps for at least one set."; rs[0].focus(); return; }
        // Catch typos before they skew targets and records
        const maxW = unit === "kg" ? 700 : 1500;
        const odd = sets.findIndex((st) => st.w < 0 || st.w > maxW || st.r > 100 || !Number.isInteger(st.r));
        if (odd >= 0) { status.textContent = `Check set ${odd + 1}: weight between 0 and ${maxW} ${unit}, and whole reps up to 100.`; rs[odd].focus(); return; }
        // A weighted lift saved with no weight breaks next time's target: ask once
        if (sets.every((st) => !st.w) && typeof equipOf === "function" && equipOf(form.dataset.exercise) !== "body" && form.dataset.zeroOk !== "1") {
            form.dataset.zeroOk = "1";
            status.textContent = "No weight entered. Add the weight you used, or tap Save again if it really was 0.";
            ws[0].focus();
            return;
        }
        const date = form.elements.date.value || isoDate(new Date());
        dropDraft(form);
        saveSession(form.dataset.exercise, date, unit, sets, formPlan(form));
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

    // Cancel / continue from the day card
    window.addEventListener("planpause", () => { els.grid.querySelectorAll(".log-form").forEach((f) => { f.hidden = true; }); render(); });
    els.grid.addEventListener("click", (e) => {
        if (!e.target.closest("[data-resume-plan]")) return;
        resumePlan();
        render();
        showToast("Welcome back", "Your plan is back on every page. Pick up where you left off.");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest("[data-adopt-plan]")) return;
        adopt();
        render();
        showToast("Plan switched", `${PROGRAMS[state.goal].name} is now your plan. Your old plan's history is still saved.`);
    });
    const jumpToday = document.getElementById("jump-today");
    if (jumpToday) jumpToday.addEventListener("click", () => {
        adopt();
        const next = els.grid.querySelector(".day-card.is-next");
        if (!next) return;
        next.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
        next.setAttribute("tabindex", "-1");
        next.focus({ preventScroll: true });
    });

    const printBtn = document.getElementById("print-week");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    els.reset.addEventListener("click", () => {
        store.remove(progressKey());
        render();
    });

    const goToWeek = (w) => { state.week = Math.max(1, w); render(); };
    els.weekPrev.addEventListener("click", () => goToWeek(state.week - 1));
    els.weekNext.addEventListener("click", () => goToWeek(state.week + 1));
    els.weekToday.addEventListener("click", () => goToWeek(currentWeek()));
    const lightBtn = document.getElementById("week-light-btn");
    if (lightBtn) lightBtn.addEventListener("click", () => {
        setLightWeek(state.goal, state.days, state.week, !lightOn());
        render();
        lightBtn.focus({ preventScroll: true });
    });

    els.goalInputs.forEach((r) => r.addEventListener("change", () => {
        state.goal = r.value;
        state.week = null;
        render({ syncUrl: true });
    }));
    els.dayInputs.forEach((r) => r.addEventListener("change", () => {
        state.days = Number(r.value);
        render({ syncUrl: true });
    }));
    els.head.addEventListener("click", (e) => {
        if (e.target.closest("[data-edit-custom]")) editCustomWorkout(0);
        if (e.target.closest("[data-add-day]")) addCustomDay();
    });
    const homeKitBox = document.getElementById("home-kit");
    if (homeKitBox) homeKitBox.addEventListener("change", (e) => {
        if (e.target.name !== "home-kit" || !PROGRAMS[e.target.value]) return;
        state.goal = e.target.value;
        state.week = null;
        render({ syncUrl: true });
        const again = homeKitBox.querySelector(`input[value="${e.target.value}"]`);
        if (again) again.focus();
    });

    // Personal settings
    if (els.profileForm) {
        const profile = getProfile();
        const f = els.profileForm.elements;
        f.experience.value = profile.experience;
        f.bodyweight.value = profile.bodyweight;
        f.unit.value = profile.unit;
        f.focus.value = profile.focus;
        if (f.sex) f.sex.value = profile.sex;
        els.profileForm.addEventListener("submit", (e) => e.preventDefault());
        els.profileForm.addEventListener("change", () => {
            const old = getProfile();
            const next = { ...old, experience: f.experience.value, bodyweight: f.bodyweight.value, unit: f.unit.value, focus: f.focus.value, sex: f.sex ? f.sex.value : old.sex };
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

    // Plans above your level stay out of sight; a note says what the next level adds
    function showLevelPlans() {
        const rank = levelRank(getLevel());
        els.goalInputs.forEach((r) => {
            const label = r.closest("label");
            const lvl = PROGRAMS[r.value] ? PROGRAMS[r.value].level : "Beginner";
            label.hidden = !PROGRAMS[r.value] || (levelRank(lvl) > rank && r.value !== state.goal) || (label.dataset.sub !== undefined && r.value !== state.goal);
            label.classList.toggle("is-above", levelRank(lvl) > rank);
            label.classList.toggle("is-active-plan", (store.get("gu-last-plan") || {}).goal === r.value);
        });
        const note = document.getElementById("level-unlock");
        const next = LEVELS[rank + 1];
        if (!note) return;
        const more = next ? Object.values(PROGRAMS).filter((p) => p.level === next).length : 0;
        note.hidden = !next;
        if (next) note.innerHTML = `${more} more plan${more === 1 ? "" : "s"} at ${next}. <button type="button" class="text-button" data-set-level="${next}">Show ${next} plans</button>`;
    }
    document.addEventListener("click", (e) => { const b = e.target.closest("[data-set-level]"); if (b) setLevel(b.dataset.setLevel); });
    window.addEventListener("levelchange", () => render());
    addRoute(/^#all-plans$/, () => ({ target: document.querySelector("[data-level-bar]") || document.getElementById("goal-picker") }));

    // Links like #program-fatloss or #program-strength-4
    addRoute(/^#program-([a-z0-9]+)(?:-(\d))?$/, (m) => {
        if (!PROGRAMS[m[1]]) return null;
        // Opening the plan you're doing (or "Start" / "Continue" / a saved workout): go straight to today's day, not the settings
        const mine = (store.get("gu-last-plan") || {}).goal === m[1];
        const params = new URLSearchParams(location.search);
        const doing = mine || m[1] === "custom" || ["today", "w", "a", "edit"].some((k) => params.has(k));
        if (params.has("today") || params.has("w")) resumePlan();
        const intent = ["today", "w", "a", "edit"].some((k) => params.has(k));
        if (state.goal !== m[1]) state.week = null;
        state.goal = m[1];
        if (m[2] && PROGRAMS[m[1]].plans[m[2]]) state.days = Number(m[2]);
        if (intent) adopt();
        render();
        const day = doing ? (els.grid.querySelector(".day-card.is-next") || els.grid.querySelector(".day-card")) : null;
        if (day) { day.classList.add("is-flash"); setTimeout(() => day.classList.remove("is-flash"), 1800); }
        return { target: day || document.getElementById("programs") };
    });

    render();
    // Opening Plans with no link (the tab bar): if you're on a plan, go straight to today's day
    if (!location.hash && store.get("gu-last-plan") && !new URLSearchParams(location.search).has("add")) {
        const day = els.grid.querySelector(".day-card.is-next");
        if (day) requestAnimationFrame(() => day.scrollIntoView({ block: "start" }));
    }
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
/* The rest timer keeps going if you change pages or leave the app: its end time is saved
   (gu-rest), and with notifications allowed it puts "next set at 7:42 PM" on the lock screen
   and, where the phone lets the app run in the background, a "Rest over" alert. */
const REST_KEY = "gu-rest";
// Opens the "Ground Up Rest" Shortcut with the seconds left (Apple's run-shortcut link format)
const restShortcutUrl = (seconds) => `shortcuts://run-shortcut?name=${encodeURIComponent("Ground Up Rest")}&input=text&text=${Math.max(5, Math.round(seconds))}`;
const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
function restNotify(kind, info) {
    if (!("Notification" in window) || Notification.permission !== "granted" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then((reg) => {
        if (kind === "clear") { reg.getNotifications({ tag: "gu-rest" }).then((ns) => ns.forEach((n) => n.close())).catch(() => {}); return; }
        const at = new Date(info.endAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
        const opts = kind === "done"
            ? { body: info.name ? `Time for your next set of ${info.name}.` : "Time for your next set.", tag: "gu-rest", renotify: true, vibrate: [200, 100, 200], icon: "icons/icon-192.png", badge: "icons/icon-192.png", data: { url: "programs.html" } }
            : { body: `Next set at ${at}${info.name ? ` · ${info.name}` : ""}${IS_IOS && store.get("gu-push") !== true ? ". This won't ring: use Lock Screen timer for an alarm." : ""}`, tag: "gu-rest", silent: true, icon: "icons/icon-192.png", badge: "icons/icon-192.png", data: { url: "programs.html" } };
        reg.showNotification(kind === "done" ? "Rest over. Go!" : `Resting${info.name ? `: ${info.name}` : ""}`, opts).catch(() => {});
    }).catch(() => {});
}

function setupRestTimer() {
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
        <p class="rest-timer-at" id="rest-timer-at"></p>
        <button type="button" class="rest-timer-alerts" id="rest-alerts" hidden>Show the timer on my lock screen</button>
        <div class="rest-push-wrap" id="rest-push-wrap" hidden>
            <button type="button" class="chip rest-timer-push" id="rest-push">Buzz me when rest is over</button>
            <p class="rest-ios-note" id="rest-push-note">One tap, once. After that every rest buzzes your phone when it's up, even locked or in another app. No switching apps.</p>
        </div>
        <div class="rest-ios-wrap" id="rest-ios-wrap" hidden>
            <button type="button" class="chip rest-timer-ios" id="rest-ios">Lock Screen timer</button>
            <p class="rest-ios-note" id="rest-ios-note">iPhone pauses web apps when you leave them, so this screen can't ring. The Lock Screen timer uses your iPhone's own Clock timer, which does.</p>
        </div>
    </div>
    <p class="visually-hidden" id="rest-timer-announce" aria-live="assertive"></p>
</div>`);
    const box = document.getElementById("rest-timer");
    const time = document.getElementById("rest-timer-time");
    const label = document.getElementById("rest-timer-label");
    const fill = document.getElementById("rest-timer-fill");
    const announce = document.getElementById("rest-timer-announce");
    const atEl = document.getElementById("rest-timer-at");
    const alertsBtn = document.getElementById("rest-alerts");
    const iosBtn = document.getElementById("rest-ios");
    const iosWrap = document.getElementById("rest-ios-wrap");
    const pushWrap = document.getElementById("rest-push-wrap");
    const pushBtn = document.getElementById("rest-push");
    const pushNote = document.getElementById("rest-push-note");
    // No more automatic jump to Shortcuts on every rest (the owner didn't want the app switch)
    store.remove("gu-ios-timer-auto");
    let endAt = 0, total = 0, tick = null, audio = null, restName = "";
    /* iPhone: web apps can't put a live countdown on the Lock Screen, but the iPhone's own Clock timer can
       (it shows on the Lock Screen and in the Dynamic Island). A one-time Shortcut ("Ground Up Rest") starts
       that timer with the seconds left; the app opens it with a shortcuts:// link. */
    const SHORTCUT = "Ground Up Rest";
    const runShortcut = () => {
        const left = Math.max(5, Math.round((endAt - Date.now()) / 1000));
        store.set("gu-ios-timer", true);
        location.href = restShortcutUrl(left);
    };
    iosBtn.addEventListener("click", () => {
        if (store.get("gu-ios-timer") === true) { runShortcut(); return; }
        let dlg = document.getElementById("ios-timer-setup");
        if (!dlg) {
            document.body.insertAdjacentHTML("beforeend", `<dialog id="ios-timer-setup" class="finish-dialog" aria-labelledby="ios-timer-title"><div class="finish-inner">
                <p class="finish-kicker">One-time setup · about 1 minute</p>
                <h2 id="ios-timer-title">Rest timer on your Lock Screen</h2>
                <p>iPhones only let their own Clock timer count down on the Lock Screen and in the Dynamic Island. This sets up a tiny shortcut so Ground Up can start that timer for you with your exact rest time.</p>
                <ol class="ios-steps">
                    <li>Open the <strong>Shortcuts</strong> app and tap <strong>+</strong> to make a new shortcut.</li>
                    <li>Tap <strong>Search Actions</strong>, type <strong>Start Timer</strong>, and tap it.</li>
                    <li>In the action, tap the number (it says 30), then tap <strong>Select Variable</strong> and pick <strong>Shortcut Input</strong>.</li>
                    <li>Tap <strong>minutes</strong> and change it to <strong>seconds</strong>.</li>
                    <li>Tap the name at the top, rename it exactly <strong>${SHORTCUT}</strong>, and tap <strong>Done</strong>.</li>
                </ol>
                <p class="finish-tip">After that, tap <strong>Lock Screen timer</strong> during any rest. Your phone switches to Shortcuts for a moment to start the timer; swipe back to Ground Up. Lock your phone and the countdown is there. If you finish resting early, stop the timer from the Lock Screen.</p>
                <p><a class="btn" href="shortcuts://">Open Shortcuts</a></p>
                <p class="finish-tip">These steps stay here when you come back.</p>
                <div class="finish-actions">
                    <button type="button" class="btn btn-primary" data-ios-go>It's set up. Start my timer</button>
                    <button type="button" class="btn" data-ios-close>Not now</button>
                </div>
            </div></dialog>`);
            dlg = document.getElementById("ios-timer-setup");
            dlg.addEventListener("click", (e) => {
                const shut = () => { if (dlg.open && typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); };
                if (e.target.closest("[data-ios-go]")) {
                    shut(); runShortcut();
                }
                else if (e.target.closest("[data-ios-close]") || e.target === dlg) shut();
            });
        }
        if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    });
    /* Rest alarms by push: the site's own Worker (COACH_AI_URL) buzzes the phone when rest ends, so it
       works locked or in another app with no app switching. Only an anonymous push address and the end
       time are sent, and only after the person turns it on. iPhone needs the app on the Home Screen. */
    const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
    const pushSupported = () => typeof coachAiOn === "function" && coachAiOn() && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    // Ask the Worker once per visit whether rest alarms are set up there (until then, nothing changes)
    let pushReady = null;
    const pushProbe = () => {
        if (pushReady !== null || !pushSupported()) return;
        pushReady = false;
        fetch(`${COACH_AI_URL.replace(/\/$/, "")}/push-key`).then((r) => (r.ok ? r.json() : null)).then((d) => {
            pushReady = Boolean(d && typeof d.key === "string" && d.key.length > 40);
            if (pushReady && tick) { showPushChoices(); alertsBtn.hidden = true; }
        }).catch(() => null);
    };
    const pushAble = () => pushSupported() && pushReady === true;
    const pushOn = () => pushAble() && store.get("gu-push") === true && Notification.permission === "granted";
    const pushBase = () => COACH_AI_URL.replace(/\/$/, "");
    const pushSub = () => navigator.serviceWorker.ready.then((reg) => reg.pushManager.getSubscription());
    function pushSchedule() {
        if (!pushOn() || !tick) return;
        const at = endAt;
        pushSub().then((sub) => {
            if (!sub) { store.set("gu-push", false); showPushChoices(); return; }
            return fetch(`${pushBase()}/rest`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sub: sub.toJSON(), at }) })
                .then((r) => { if (!r.ok) throw new Error("push"); if (endAt === at && tick) atEl.textContent = `${nextAtText()} · alarm set \u2713`; });
        }).catch(() => { if (tick) atEl.textContent = `${nextAtText()} · couldn't set the alarm, keep the app open`; });
    }
    function pushCancel() {
        if (!pushOn()) return;
        pushSub().then((sub) => sub && fetch(`${pushBase()}/rest/cancel`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) })).catch(() => null);
    }
    const nextAtText = () => `Next set at ${new Date(endAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}`;
    function showPushChoices() {
        const on = pushOn();
        // Can turn it on here: push works (on iPhone, only from the Home Screen app) and it isn't on yet
        pushWrap.hidden = on || !pushAble() || (IS_IOS && !standalone) || Notification.permission === "denied";
        // The Lock Screen timer (Shortcuts) stays as a backup only when push can't be used
        iosWrap.hidden = !IS_IOS || on || !pushWrap.hidden;
        if (IS_IOS && !standalone && pushAble() && !on) { iosWrap.hidden = false; document.getElementById("rest-ios-note").textContent = "For a buzz when rest is over with no app switching, add Ground Up to your Home Screen (Share, then Add to Home Screen) and open it from there."; }
    }
    pushBtn.addEventListener("click", () => {
        pushNote.textContent = "Setting it up...";
        Notification.requestPermission().then((perm) => {
            if (perm !== "granted") throw new Error("denied");
            return Promise.all([navigator.serviceWorker.ready, fetch(`${pushBase()}/push-key`).then((r) => (r.ok ? r.json() : Promise.reject(new Error("key"))))]);
        }).then(([reg, data]) => reg.pushManager.getSubscription().then((old) => old || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: data.key })))
            .then(() => {
                store.set("gu-push", true);
                announce.textContent = "Rest alarms are on. Your phone will buzz when each rest is over.";
                showPushChoices();
                pushSchedule();
            })
            .catch((err) => {
                pushNote.textContent = err && err.message === "denied"
                    ? "Notifications are off for Ground Up. Turn them on in your phone's Settings, then try again."
                    : "Couldn't turn on rest alarms right now. Try again in a minute.";
            });
    });
    // While the timer is up, keep room for it so it never covers the set boxes you're typing in
    const room = () => {
        const h = box.hidden ? 0 : Math.ceil(box.getBoundingClientRect().height);
        document.documentElement.style.setProperty("--rest-h", `${h}px`);
        document.body.classList.toggle("rest-on", h > 0);
    };
    if ("ResizeObserver" in window) new ResizeObserver(room).observe(box);
    new MutationObserver(room).observe(box, { attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("focusin", (e) => {
        if (box.hidden || !e.target.matches(".log-form input, .log-form select")) return;
        const r = e.target.getBoundingClientRect();
        if (r.bottom > box.getBoundingClientRect().top - 8) e.target.scrollIntoView({ block: "center" });
    });
    const save = () => store.set(REST_KEY, tick ? { endAt, total, name: restName } : null);
    // Offer lock-screen alerts once: needs notifications, which iPhones allow for home-screen apps
    const canAsk = () => "Notification" in window && Notification.permission === "default" && store.get("gu-rest-alerts-no") !== true;
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
        atEl.textContent = "";
        // Out of the app (where the phone lets it run): a lock-screen alert; in the app: clear it.
        // With rest alarms on, the push does the alert, so don't double up.
        if (document.visibilityState === "hidden" && !pushOn()) restNotify("done", { endAt, total, name: restName }); else restNotify("clear");
        if (document.visibilityState === "visible") pushCancel();
        store.set(REST_KEY, null);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        beep();
        setTimeout(() => { if (!tick) box.hidden = true; }, 6000);
    }
    function start(seconds, name, resumeAt) {
        total = seconds;
        endAt = resumeAt || Date.now() + seconds * 1000;
        restName = name || "";
        label.textContent = name ? `Rest · ${name}` : "Rest";
        atEl.textContent = `Next set at ${new Date(endAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}`;
        alertsBtn.hidden = !canAsk() || IS_IOS || pushAble();
        pushProbe();
        showPushChoices();
        // The "why" note shows the first few rests only, then the timer stays compact
        const seen = Number(store.get("gu-ios-note-n")) || 0;
        document.getElementById("rest-ios-note").hidden = store.get("gu-ios-timer") === true || seen >= 3;
        if (IS_IOS && !resumeAt) store.set("gu-ios-note-n", seen + 1);
        box.hidden = false;
        box.classList.remove("is-done");
        announce.textContent = "";
        clearInterval(tick);
        tick = setInterval(update, 250);
        save();
        update();
        // Unlock audio on phones while we still have the tap
        try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === "suspended") audio.resume(); } catch (e) { /* ignore */ }
        if (!resumeAt) pushSchedule();
        else if (pushOn()) atEl.textContent = `${nextAtText()} · alarm set \u2713`;
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-rest]");
        if (btn) start(Number(btn.dataset.rest), btn.dataset.restName);
    });
    document.getElementById("rest-plus").addEventListener("click", () => {
        if (!tick) return;
        endAt += 15000;
        total += 15;
        atEl.textContent = nextAtText();
        save();
        update();
        pushSchedule();
    });
    const stopRest = () => {
        const was = Boolean(tick);
        clearInterval(tick);
        tick = null;
        box.hidden = true;
        save();
        restNotify("clear");
        if (was) pushCancel();
    };
    document.getElementById("rest-stop").addEventListener("click", stopRest);
    // Finishing the workout ends any rest that's still counting
    window.addEventListener("logchange", (e) => { if (e.detail && e.detail.finished) stopRest(); });
    window.addEventListener("reststop", stopRest);
    alertsBtn.addEventListener("click", () => {
        Notification.requestPermission().then((p) => {
            alertsBtn.hidden = true;
            if (p === "granted") announce.textContent = "Lock-screen alerts are on. Leave the app while resting and you'll see when your next set starts.";
            else store.set("gu-rest-alerts-no", true);
        }).catch(() => { alertsBtn.hidden = true; });
    });
    // Coming back to the app or another page: pick the timer up where it is
    const resume = () => {
        const r = store.get(REST_KEY);
        if (!r || typeof r !== "object" || !(Number(r.endAt) > 0) || !(Number(r.total) > 0)) return;
        const name = typeof r.name === "string" ? r.name.slice(0, 60) : "";
        if (Number(r.endAt) > Date.now()) { if (!tick || endAt !== Number(r.endAt)) start(Math.min(600, Number(r.total)), name, Number(r.endAt)); }
        else if (Date.now() - Number(r.endAt) < 120000) { restName = name; endAt = Number(r.endAt); box.hidden = false; tick = 1; finish(); }
        else store.set(REST_KEY, null);
    };
    // Leaving the app mid-rest: put "next set at ..." on the lock screen. Back in the app: tidy it away.
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") { if (tick && endAt > Date.now()) restNotify("start", { endAt, total, name: restName }); }
        else { restNotify("clear"); resume(); }
    });
    resume();
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

/* ---------- Library pictures ----------
   Each card in the exercise library shows the body (from muscle-art.js), zoomed in on
   the muscles that exercise works: the main one in orange, helpers lighter. Built from
   the guide's "muscles worked" text, so new exercises get a picture automatically. */
const LIB_TERMS = [
    [/^upper chest/, ["chest-upper"]], [/^chest/, ["chest-upper", "chest-middle", "chest-lower"]],
    [/^front shoulders/, ["delt-front"]], [/^side shoulders/, ["delt-side"]], [/^(rear shoulders|rotator cuff)/, ["delt-rear"]],
    [/^shoulders/, ["delt-front", "delt-side", "delt-rear"]],
    [/^traps/, ["traps-upper", "traps-middle", "traps-lower"]], [/^upper back/, ["traps-middle", "traps-lower", "rhomboids"]],
    [/^lats/, ["lats"]], [/^lower back/, ["erectors"]], [/^back/, ["lats", "rhomboids", "traps-middle"]],
    [/^biceps \(long/, ["biceps-long"]], [/^biceps/, ["biceps-long", "biceps-short", "brachialis"]],
    [/^triceps \(long/, ["triceps-long"]], [/^triceps/, ["triceps-long", "triceps-lateral", "triceps-medial"]],
    [/^forearms \(brachialis/, ["brachialis"]], [/^(forearms|grip)/, ["forearm-flexors", "forearm-extensors"]],
    [/^abs \(lower/, ["abs-lower"]], [/^abs/, ["abs-upper", "abs-lower"]], [/^core/, ["abs-upper", "abs-lower", "obliques"]], [/^obliques/, ["obliques"]],
    [/^glutes \(side/, ["glute-med"]], [/^(glutes|hips)/, ["glute-max", "glute-med"]],
    [/^quads/, ["quad-outer", "quad-middle", "quad-inner"]], [/^(inner thighs|adductors)/, ["adductors"]], [/^hamstrings/, ["hams-outer", "hams-inner"]],
    [/^calves \(especially the lower/, ["soleus"]], [/^calves/, ["calf-inner", "calf-outer", "soleus"]],
    [/^legs/, ["quad-outer", "quad-middle", "quad-inner", "hams-outer", "hams-inner", "glute-max", "calf-inner", "calf-outer"]]
];
function libMuscles(name) {
    const terms = String((EXERCISES[name] || {}).m || "").toLowerCase().split(",").map((t) => t.trim()).filter(Boolean);
    const partsOf = (t) => { const hit = LIB_TERMS.find(([re]) => re.test(t)); return hit ? hit[1] : []; };
    const main = terms.length ? partsOf(terms[0]) : [];
    const extra = terms.slice(1).flatMap(partsOf).filter((p) => !main.includes(p));
    // Cardio lists "heart and lungs" first; show the legs as the main movers
    if (!main.length && extra.length) return { main: extra, extra: [] };
    return { main, extra };
}
const libShapeCache = {};
function libThumb(name, sex) {
    if (typeof MUSCLE_ART !== "object") return "";
    const { main, extra } = libMuscles(name);
    if (!main.length) return "";
    const score = (view) => mmViewPieces(sex, view).filter((pc) => pc.parts.some((p) => main.includes(p))).length;
    const view = score("front") >= score("back") ? "front" : "back";
    const seen = new Set(), lit = [];
    mmViewPieces(sex, view).forEach((pc) => {
        if (seen.has(pc.d)) return;
        const isMain = pc.parts.some((p) => main.includes(p)), isExtra = !isMain && pc.parts.some((p) => extra.includes(p));
        if (!isMain && !isExtra) return;
        seen.add(pc.d);
        lit.push({ d: pc.d, isMain });
    });
    if (!lit.some((x) => x.isMain)) return "";
    // Zoom in on the main muscles (with a little of the helpers and body around them), in a 4:3 frame
    const box = lit.filter((x) => x.isMain).map((x) => libShapeCache[x.d] || (libShapeCache[x.d] = mmShapes(x.d)[0]))
        .reduce((b, sh) => [Math.min(b[0], sh.x0), Math.min(b[1], sh.y0), Math.max(b[2], sh.x1), Math.max(b[3], sh.y1)], [Infinity, Infinity, -Infinity, -Infinity]);
    let w = Math.max(box[2] - box[0], 260) + 160, h = Math.max(box[3] - box[1], 200) + 140;
    if (w / h > 4 / 3) h = w * 3 / 4; else w = h * 4 / 3;
    const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
    const x = Math.min(Math.max(cx - w / 2, 150), Math.max(150, 874 - w)), y = Math.min(Math.max(cy - h / 2, 30), Math.max(30, 1510 - h));
    return `<svg class="lib-body" viewBox="${x.toFixed(0)} ${y.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <use href="#lib-${sex}-${view}"/>${lit.map((p) => `<path class="${p.isMain ? "lib-main" : "lib-extra"}" d="${p.d}"/>`).join("")}</svg>`;
}
// One copy of each body drawing, reused by every card
function libSprite(sex) {
    if (typeof MUSCLE_ART !== "object" || document.getElementById(`lib-${sex}-front`)) return;
    const views = ["front", "back"].map((v) => {
        const a = MUSCLE_ART[sex][v];
        return `<g id="lib-${sex}-${v}"><g class="lib-outline">${a.outline.map((d) => `<path d="${d}"/>`).join("")}</g><g class="lib-rest">${a.muscles.map(([, d]) => `<path d="${d}"/>`).join("")}</g></g>`;
    }).join("");
    document.body.insertAdjacentHTML("beforeend", `<svg class="lib-sprite" aria-hidden="true" focusable="false" width="0" height="0"><defs>${views}</defs></svg>`);
}

// Search results: names that start with what you typed first, then names that contain it, then other names (aka), then muscles
function searchRank(n, q) {
    if (!q) return 0;
    const name = n.toLowerCase();
    if (name.startsWith(q)) return 0;
    if (name.includes(` ${q}`) || name.includes(`-${q}`)) return 1;
    if ((EXERCISES[n].aka || "").toLowerCase().includes(q)) return 2;
    return 3;
}
function setupLibrary() {
    const grid = document.getElementById("library-grid");
    if (!grid || typeof EXERCISES !== "object") return;
    const search = document.getElementById("library-search");
    const count = document.getElementById("library-count");
    const radios = [...document.querySelectorAll('input[name="muscle"]')];
    const kits = [...document.querySelectorAll('input[name="equip"]')];
    const names = Object.keys(EXERCISES).sort((a, b) => a.localeCompare(b));
    const group = Object.fromEntries(names.map((n) => [n, libraryGroup(n)]));
    const label = { legs: "Legs", chest: "Chest", back: "Back", shoulders: "Shoulders", arms: "Arms", core: "Core", cardio: "Cardio" };
    const sex = getProfile().sex === "female" ? "female" : "male";
    libSprite(sex);

    function render() {
        const q = search.value.trim().toLowerCase();
        const muscle = (radios.find((r) => r.checked) || {}).value || "";
        const kit = (kits.find((r) => r.checked) || {}).value || "";
        // "Dumbbells" also shows bodyweight moves, since anyone with dumbbells can do those too
        const kitOk = (n) => !kit || equipOf(n) === kit || (kit === "db" && equipOf(n) === "body" && !isCardio(n));
        const shown = names.filter((n) => (!muscle || group[n] === muscle) && kitOk(n)
            && (!q || `${n} ${EXERCISES[n].m} ${EXERCISES[n].eq} ${EXERCISES[n].aka || ""}`.toLowerCase().includes(q)))
            .sort((a, b) => searchRank(a, q) - searchRank(b, q));
        count.textContent = shown.length
            ? `${shown.length} exercise${shown.length === 1 ? "" : "s"}${muscle ? ` for ${label[muscle].toLowerCase()}` : ""}`
            : `No exercises match "${search.value}". Try a simpler word, like press or row.`;
        grid.innerHTML = shown.map((n) => {
            const x = EXERCISES[n];
            return `
                <li class="library-card">
                    <div class="library-pic${isCardio(n) ? " is-cardio" : ""}">${libThumb(n, sex) || `<span class="library-pic-icon equip equip-${equipOf(n)}" aria-hidden="true"></span>`}
                        <span class="library-pic-tag">${label[group[n]]}</span></div>
                    <span class="library-tags">${equipIcon(n, true)}</span>
                    <h3>${escapeHtml(n)}</h3>
                    <p class="library-muscles">${escapeHtml(x.m)}</p>
                    <p class="library-eq">${escapeHtml(x.eq)}</p>
                    ${x.aka ? `<p class="library-aka">Also called: ${escapeHtml(x.aka)}</p>` : ""}
                    <p class="library-tip">${escapeHtml(x.tip)}</p>
                    <div class="library-actions">
                        <button type="button" class="btn btn-small" data-howto="${escapeHtml(n)}">How to do it</button>
                        <button type="button" class="btn btn-small btn-primary" data-add-ex="${escapeHtml(n)}" aria-label="Add ${escapeHtml(n)} to my workout">+ Add</button>
                    </div>
                </li>`;
        }).join("");
    }

    search.addEventListener("input", render);
    kits.forEach((r) => r.addEventListener("change", render));
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
   FEATURE: Add to my workout (Exercise library, Muscle map, how-tos)
   Any [data-add-ex="Name"] button asks "Add this to your workout this
   week?" and which day of My workout it goes on (or a new day). The
   exercise gets the same sets, reps, and starting weight as the builder.
   ========================================================= */
// Put one exercise into My workout. dayIndex = a day number from 0, or "new". Returns the day it went to (0-based) or -1.
function addExerciseToCustom(name, dayIndex) {
    if (typeof EXERCISES !== "object" || !EXERCISES[name]) return -1;
    let days = customDaysRaw();
    const oldN = days.length;
    const week = Math.max(1, weekOf(programStart("custom")));
    const done = store.get(`gu-progress-custom-${oldN}-w${week}`, []) || [];
    const base = builderDefault(name, (builderClean(store.get(BUILDER_KEY)) || {}).goal || "muscle");
    const item = { n: name, d: builderDose(base), rest: builderKind(name) === "time" ? "" : base.rest };
    let di;
    if (dayIndex === "new" || !oldN) {
        if (oldN >= 7) return -1;
        days.push({ title: oldN ? `Day ${oldN + 1}` : "My workout", items: [item] });
        di = days.length - 1;
    } else {
        di = Math.min(Math.max(0, Number(dayIndex) || 0), oldN - 1);
        if (days[di].items.some((x) => x && x.n === name)) return di;
        if (days[di].items.length >= 12) return -1;
        days[di].items.push(item); // added at the end, so this week's check-offs stay put
    }
    if (days.length !== oldN) {
        store.remove(`gu-progress-custom-${oldN}-w${week}`);
        store.set(`gu-progress-custom-${days.length}-w${week}`, done);
    }
    saveCustomDays(days);
    // Start using My workout if it's new, or if it's already the plan you're on
    const last = store.get("gu-last-plan");
    if (!oldN && !(last && last.goal && last.goal !== "custom") || (last && last.goal === "custom")) store.set("gu-last-plan", { goal: "custom", days: days.length });
    window.dispatchEvent(new CustomEvent("customchange"));
    return di;
}

function setupAddToWorkout() {
    if (typeof EXERCISES !== "object") return;
    let dlg = null, current = "", opener = null;
    const shut = () => { if (!dlg) return; if (typeof dlg.close === "function" && dlg.open) dlg.close(); else dlg.removeAttribute("open"); if (opener && document.contains(opener)) opener.focus(); };

    function open(name) {
        if (!EXERCISES[name]) return;
        current = name;
        if (!dlg) {
            document.body.insertAdjacentHTML("beforeend", `<dialog id="add-dialog" class="finish-dialog add-dialog" aria-labelledby="add-title"><div class="finish-inner"></div></dialog>`);
            dlg = document.getElementById("add-dialog");
            dlg.addEventListener("click", (e) => {
                if (e.target === dlg || e.target.closest("[data-add-cancel]")) { shut(); return; }
                if (e.target.closest("[data-add-confirm]")) confirm();
            });
            dlg.addEventListener("change", (e) => { if (e.target.name === "add-day") note(); });
        }
        const days = customDaysRaw();
        const last = store.get("gu-last-plan");
        const onOther = last && last.goal && last.goal !== "custom" && PROGRAMS[last.goal];
        let pick = 0;
        if (last && last.goal === "custom") { const info = currentPlanInfo(); if (info && !info.weekDone) pick = info.di; }
        // Better: the day that already trains the same muscles (curls go on Pull day, not Push)
        const m = builderMuscle(name);
        const near = { biceps: ["biceps", "back"], back: ["back", "biceps"], triceps: ["triceps", "chest", "shoulders"], chest: ["chest", "triceps", "shoulders"], shoulders: ["shoulders", "chest", "triceps"],
            quads: ["quads", "glutes", "hamstrings", "calves"], glutes: ["glutes", "quads", "hamstrings"], hamstrings: ["hamstrings", "glutes", "quads"], calves: ["calves", "quads", "hamstrings"] }[m] || [m];
        const score = (d) => d.items.reduce((t, x) => t + (x && EXERCISES[x.n] ? (builderMuscle(x.n) === m ? 2 : near.includes(builderMuscle(x.n)) ? 1 : 0) : 0), 0);
        const best = days.map((d, i) => [score(d), i]).sort((a, b) => b[0] - a[0])[0];
        if (best && best[0] > 0) pick = best[1];
        const base = builderDefault(name, (builderClean(store.get(BUILDER_KEY)) || {}).goal || "muscle");
        let weight = builderWeight(base);
        if (weight === "NEED_BODYWEIGHT") weight = "Pick a weight you could lift a couple more times than the top of the range. Log it and you'll get a target next time.";
        const choices = days.length
            ? days.map((d, i) => `<label class="add-day"><input type="radio" name="add-day" value="${i}"${i === pick ? " checked" : ""}><span><strong>Day ${i + 1}</strong>${d.title && d.title !== `Day ${i + 1}` ? `: ${escapeHtml(String(d.title).slice(0, 40))}` : ""} <small>${d.items.length} exercise${d.items.length === 1 ? "" : "s"}</small></span></label>`).join("")
                + (days.length < 7 ? `<label class="add-day"><input type="radio" name="add-day" value="new"><span><strong>New day</strong> <small>Start Day ${days.length + 1} with it</small></span></label>` : "")
            : "";
        dlg.querySelector(".finish-inner").innerHTML = `
            <p class="finish-kicker">Add to my workout</p>
            <h2 id="add-title">${escapeHtml(name)}</h2>
            <p>${days.length ? "Would you like to add this to your workout for this week? Pick the day." : "Would you like to start your own workout with this? You can add more exercises from the library or the muscle map."}</p>
            <ul class="finish-next"><li>${equipIcon(name)}<span><strong>${escapeHtml(builderDose(base))}</strong><small>${escapeHtml(weight)}</small></span></li></ul>
            ${days.length ? `<fieldset class="add-days"><legend>Which day?</legend>${choices}</fieldset>` : ""}
            ${onOther ? `<p class="finish-tip">This goes into My workout, your own plan. ${escapeHtml(PROGRAMS[last.goal].name)} stays as it is.</p>` : ""}
            <p class="add-note finish-tip" role="status"></p>
            <div class="finish-actions">
                <button type="button" class="btn btn-primary" data-add-confirm>${days.length ? "Add it" : "Start my workout"}</button>
                <button type="button" class="btn" data-add-cancel>Not now</button>
            </div>`;
        note();
        if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
        const first = dlg.querySelector("input[name=add-day]:checked") || dlg.querySelector("[data-add-confirm]");
        first.focus();
    }
    // A heads-up when the day already has it, or already has plenty for that muscle (it never blocks)
    function note() {
        const out = dlg.querySelector(".add-note");
        const choice = (dlg.querySelector("input[name=add-day]:checked") || {}).value;
        const day = customDaysRaw()[Number(choice)];
        out.textContent = "";
        if (!day || choice === "new") return;
        if (day.items.some((x) => x && x.n === current)) { out.textContent = "It's already on this day."; return; }
        const muscle = builderMuscle(current);
        const items = day.items.filter((x) => x && EXERCISES[x.n]);
        const trained = new Set(items.map((x) => builderMuscle(x.n)).concat(muscle)).size;
        const same = items.filter((x) => builderMuscle(x.n) === muscle).length;
        const goal = (builderClean(store.get(BUILDER_KEY)) || {}).goal || "muscle";
        if (muscle && same >= builderLimit(goal, muscle, trained)) out.textContent = `Heads-up: this day already has ${same} exercise${same === 1 ? "" : "s"} for that muscle. More usually doesn't mean more results, but you can still add it.`;
        else if (items.length >= 8) out.textContent = `Heads-up: this day already has ${items.length} exercises. That's a long session.`;
    }
    function confirm() {
        const choice = (dlg.querySelector("input[name=add-day]:checked") || {}).value;
        const before = customDaysRaw().length;
        const di = addExerciseToCustom(current, choice === undefined ? 0 : choice === "new" ? "new" : Number(choice));
        if (di < 0) { dlg.querySelector(".add-note").textContent = "That day is full (12 exercises). Pick another day or start a new one."; return; }
        const days = customDaysRaw();
        shut();
        const n = days.length;
        showToast(`Added to Day ${di + 1}`, `${current} is in My workout${n > before ? ` (now ${n} day${n === 1 ? "" : "s"})` : ""}. Open Plans to do it.`);
        const toast = document.getElementById("toast");
        if (toast && !toast.querySelector(".toast-link")) toast.insertAdjacentHTML("beforeend", '<a class="toast-link text-link" href="programs.html">Open my workout</a>');
        const link = toast && toast.querySelector(".toast-link");
        if (link) link.href = `programs.html?a=${Date.now()}#program-custom-${n}`;
        // refresh the plan bar so it shows the change
        const bar = document.getElementById("planbar");
        if (bar) bar.remove();
        setupPlanBar();
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-add-ex]");
        if (!btn || !btn.dataset.addEx) return;
        const howto = document.getElementById("howto");
        opener = howto && howto.contains(btn) ? null : btn;
        if (howto && howto.open && howto.contains(btn)) howto.close();
        open(btn.dataset.addEx);
    });
}

/* =========================================================
   FEATURE: Coach, the chat helper (every page)
   A built-in assistant that runs on the device, with no AI service
   and nothing sent anywhere. It reads what people type ("shoulders,
   back and abs", "30 min legs, no equipment"), builds a workout from
   the muscle map and exercise guides, answers how-to and plan
   questions, and saves the workout as "My workout" on the Plans page.
   Everything it shows is built from this site's own data.
   ========================================================= */
const COACH_GROUPS = [
    ["chest", /\b(chest|pecs?|pectorals?|bench)\b/],
    ["shoulders", /\b(shoulders?|delts?|deltoids?)\b/],
    ["traps", /\b(traps?|trapezius)\b/],
    ["upper-back", /\b(upper back|mid(dle)? back|rhomboids?)\b/],
    ["lats", /\b(lats?|latissimus|wings?|v[- ]?taper)\b/],
    ["lower-back", /\b(lower back|erectors?)\b/],
    ["biceps", /\b(biceps?|bis|guns)\b/],
    ["triceps", /\b(triceps?|tris)\b/],
    ["forearms", /\b(forearms?|grip)\b/],
    ["abs", /\b(abs|abdominals?|core|six[- ]?pack|stomach|belly)\b/],
    ["obliques", /\b(obliques?|love handles|waist)\b/],
    ["glutes", /\b(glutes?|butt|booty|bum|hips?)\b/],
    ["quads", /\b(quads?|quadriceps|front of (my )?thighs?)\b/],
    ["adductors", /\b(inner thighs?|adductors?)\b/],
    ["hamstrings", /\b(hamstrings?|hams|back of (my )?thighs?)\b/],
    ["calves", /\b(calf|calves)\b/]
];
const COACH_COMBOS = [
    [/\bfull[- ]?body|everything|whole body|total body\b/, ["quads", "chest", "lats", "shoulders", "hamstrings", "abs"]],
    [/\bupper[- ]?body\b/, ["chest", "lats", "shoulders", "upper-back", "biceps", "triceps"]],
    [/\blower[- ]?body\b/, ["quads", "glutes", "hamstrings", "calves"]],
    [/\blegs?\b(?! (raise|press|curl|extension))/, ["quads", "glutes", "hamstrings", "calves"]],
    [/\barms?\b/, ["biceps", "triceps", "forearms"]],
    [/\bback\b/, ["lats", "upper-back"]],
    [/\bpush\b/, ["chest", "shoulders", "triceps"]],
    [/\bpull\b/, ["lats", "upper-back", "biceps"]]
];
const COACH_PARTS = [
    [/\bupper (chest|pecs?)\b/, "chest-upper"], [/\blower (chest|pecs?)\b/, "chest-lower"],
    [/\b(front|anterior) delts?\b/, "delt-front"], [/\b(side|lateral|middle) delts?\b/, "delt-side"], [/\b(rear|back|posterior) delts?\b/, "delt-rear"],
    [/\b(teardrop|inner quads?|vmo)\b/, "quad-inner"], [/\bouter quads?\b/, "quad-outer"],
    [/\blong head\b/, "triceps-long"], [/\blower abs\b/, "abs-lower"], [/\bupper abs\b/, "abs-upper"], [/\bglute med(ius)?|side glutes?\b/, "glute-med"]
];
// Fallback: find exercises for a muscle from the library's own "muscles worked" text
const COACH_MUSCLE_TEXT = {
    chest: /chest/i, shoulders: /shoulder/i, traps: /trap|upper back/i, "upper-back": /upper back/i, lats: /lats/i, "lower-back": /lower back/i,
    biceps: /biceps/i, triceps: /triceps/i, forearms: /forearm|grip/i, abs: /abs|core/i, obliques: /oblique/i, glutes: /glute/i,
    quads: /quad/i, adductors: /adductor|inner thigh/i, hamstrings: /hamstring/i, calves: /calv/i
};
const COACH_COMPOUND = /press|squat|deadlift|row|pull-up|pulldown|lunge|thrust|dip|step-up|push-up|leg press|bridge|carry/i;

// Words Coach knows, so small typos ("excerise", "sholders", "chalenging") still land
const COACH_WORDS = ["shoulders", "shoulder", "chest", "triceps", "biceps", "forearms", "hamstrings", "glutes", "calves", "quads",
    "obliques", "abdominals", "trapezius", "deltoids", "quadriceps", "adductors", "workout", "exercise", "exercises", "training",
    "challenging", "challenge", "intermediate", "advanced", "expert", "beginner", "dumbbells", "dumbbell", "bodyweight", "equipment",
    "minutes", "harder", "easier", "shorter", "longer", "different", "intense", "brutal", "difficult", "toughest", "hardest", "upper", "lower", "stronger", "strength", "deadlift", "hypertrophy", "endurance", "overhead"];
const COACH_KEEP = new Set(["gluten", "shorts", "lighter", "letter", "better", "glute", "should", "chests", "bicep", "tricep", "quad", "calf", "advance", "lowest", "upped", "expect", "export", "beginning", "experts", "loser", "lover", "easter", "power"]);
function coachFixTypos(text) {
    const near = (a, b, max) => {
        if (Math.abs(a.length - b.length) > max) return false;
        let prev = Array.from({ length: b.length + 1 }, (_, i) => i), prev2 = null;
        for (let i = 1; i <= a.length; i++) {
            const cur = [i];
            for (let j = 1; j <= b.length; j++) {
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev2[j - 2] + 1);
            }
            prev2 = prev; prev = cur;
        }
        return prev[b.length] <= max;
    };
    return text.replace(/[a-z]{5,}/g, (w) => {
        if (COACH_WORDS.includes(w) || COACH_KEEP.has(w)) return w;
        const max = w.length >= 8 ? 2 : 1;
        return COACH_WORDS.find((v) => v[0] === w[0] && near(w, v, max)) || w;
    });
}

// How hard someone wants it. "down"/"up" are relative ("easier", "harder"); the rest are absolute.
function coachIntensity(t) {
    if (/\b(too hard|easier|lighter|less intense|tone it down|dial it back|not so hard|calm(er)?)\b/.test(t)) return "down";
    if (/\b(too easy|harder|tougher|more intense|step it up|kick it up|crank it|level up|more challenging)\b/.test(t)) return "up";
    if (/\b(super|very|really|extremely|insanely|ultra|crazy|most|seriously)\s+(hard|challenging|tough|intense|difficult|heavy)\b|\b(hardest|toughest|brutal|savage|beast mode|no mercy|all out|max(imum)? effort|insane|put me (to|through) the test|test me|destroy me|kill me|wreck me|push me to my limit|to failure|leave nothing)\b/.test(t)) return "max";
    if (/\b(hard|challenging|challenge|tough|intense|difficult|push me|heavy|beast|grind|serious)\b/.test(t)) return "hard";
    if (/\b(easy|gentle|light|tired|beginner[- ]friendly|take it easy|go easy|recovery|low key|chill|relaxed|simple)\b/.test(t)) return "easy";
    return null;
}

// A level named outright: "set it for expert", "make it advanced", "beginner friendly"
function coachNamedLevel(t) {
    if (/\b(expert|elite|pro level|professional level)\b/.test(t)) return "Expert";
    if (/\badvanced\b/.test(t)) return "Advanced";
    if (/\bintermediate\b/.test(t)) return "Intermediate";
    if (/\b(beginners?|newbie|novice)\b/.test(t)) return "Beginner";
    return null;
}

// Which level a workout should be built at, starting from "base" (the site level or the last workout's)
function coachLevelFor(req, base) {
    const i = levelRank(base);
    if (req.level) return req.level;
    if (req.intensity === "max") return "Expert";
    if (req.intensity === "hard") return LEVELS[Math.max(2, i)];
    if (req.intensity === "up") return LEVELS[Math.min(3, i + 1)];
    if (req.intensity === "down") return LEVELS[Math.max(0, i - 1)];
    if (req.intensity === "easy") return "Beginner";
    return base;
}

function coachUnderstand(text) {
    const t = coachFixTypos(` ${text.toLowerCase().replace(/[’']/g, "'").replace(/&/g, " and ")} `);
    const groups = new Set(), parts = new Set(), labels = [];
    const where = (re) => { const m = t.match(re); return m ? m.index : -1; };
    const label = (pos, name) => { if (pos >= 0 && !labels.some((l) => l.name === name)) labels.push({ pos, name }); };
    COACH_PARTS.forEach(([re, id]) => { if (re.test(t)) { parts.add(id); groups.add(mmPart(id).g.id); label(where(re), mmPart(id).p.name); } });
    const COMBO_NAMES = ["Full body", "Upper body", "Lower body", "Legs", "Arms", "Back", "Push", "Pull"];
    COACH_COMBOS.forEach(([re, ids], i) => { if (re.test(t)) { ids.forEach((g) => groups.add(g)); label(where(re), COMBO_NAMES[i]); } });
    COACH_GROUPS.forEach(([id, re]) => {
        if (!re.test(t)) return;
        groups.add(id);
        const covered = labels.some((l) => ["Full body", "Upper body", "Lower body", "Legs", "Arms", "Back", "Push", "Pull"].includes(l.name) && COACH_COMBOS[COMBO_NAMES.indexOf(l.name)][1].includes(id));
        const ownPart = [...parts].some((p) => mmPart(p).g.id === id);
        if (!covered && !ownPart) label(where(re), MUSCLE_MAP.find((x) => x.id === id).name);
    });
    // "lower back" and "upper back" shouldn't also pull in the whole back
    if (/\b(lower|upper) back\b/.test(t) && !/\b(my|the|whole) back\b|\bback (and|,)|, back\b|\bback day\b/.test(t.replace(/\b(lower|upper) back\b/g, ""))) {
        if (!/\bback\b/.test(t.replace(/\b(lower|upper) back\b/g, ""))) { groups.delete("lats"); if (!/\bupper back\b/.test(t)) groups.delete("upper-back"); }
    }
    // Dumbbells win over "at home": plenty of people have a pair at home
    const kit = /\b(no equipment|bodyweight|body weight|no weights|nothing)\b/.test(t) ? "none"
        : /\bdumbbells?( only)?\b|\bdbs?\b/.test(t) ? "db"
        : /\b(no gym|at home|home workout|from home|hotel)\b/.test(t) ? "none" : null;
    const min = t.match(/\b(\d{1,3})\s*(?:min|mins|minutes|m)\b/);
    const minutes = min ? Math.min(120, Math.max(10, Number(min[1]))) : /\b(quick|short|fast|little time|busy)\b/.test(t) ? 25 : null;
    const pain = /\b(pain|hurts?|hurting|injur(y|ed|ies)|sprain|strain(ed)?|torn|tear|surgery|dizzy|chest pain|faint)\b/.test(t);
    const howto = /\bhow (do|should|can) (i|you)\b|\bhow to\b|\bform (for|on)\b|\bshow me how\b|\bwhat('s| is) the right way\b/.test(t);
    // "without legs", "no abs", "skip arms": leave those out
    const exclude = new Set();
    for (const m of t.matchAll(/\b(?:without|no|skip|remove|minus|except|drop|leave out|take out|not|don't want|nothing for)\s+(?:my |the |any |doing |training )?([a-z-]+(?: [a-z-]+)?)/g)) {
        const phrase = ` ${m[1]} `;
        COACH_GROUPS.forEach(([id, re]) => { if (re.test(phrase)) exclude.add(id); });
        COACH_COMBOS.forEach(([re, ids]) => { if (re.test(phrase) && !/\bfull/.test(phrase)) ids.forEach((g) => exclude.add(g)); });
    }
    exclude.forEach((g) => groups.delete(g));
    const dropLabel = (l) => {
        const g = MUSCLE_MAP.find((x) => x.name === l.name);
        if (g) return exclude.has(g.id);
        const ci = COMBO_NAMES.indexOf(l.name);
        return ci >= 0 && ci > 0 && COACH_COMBOS[ci][1].every((x) => exclude.has(x));
    };
    // keep the muscles in the order the person said them
    const order = (g) => { const m = COACH_GROUPS.find(([id]) => id === g); const i = m ? where(m[1]) : -1; return i < 0 ? 999 : i; };
    const home = /\b(no gym|at home|home|from home|hotel|living room|no bench)\b/.test(t);
    return { t, groups: [...groups].sort((a, b) => order(a) - order(b)), parts: [...parts], kit, minutes, pain, howto, home,
        exclude: [...exclude], level: coachNamedLevel(t), intensity: coachIntensity(t), goal: coachGoal(t), ...coachLiftFocus(t),
        add: /\b(add|also|plus|throw in|include|as well|and some)\b|\btoo\b(?! (hard|easy|long|short|much|heavy))/.test(t),
        title: labels.filter((l) => !dropLabel(l)).sort((a, b) => a.pos - b.pos).map((l) => l.name) };
}

// Find an exercise named in the text (longest name wins)
// Everyday names for exercises: "how do I do a squat?"
const COACH_EX_ALIASES = [
    [/\bsquats?\b/, "Back squat"], [/\bbench(ing)?\b/, "Bench press"], [/\bdead ?lifts?\b/, "Deadlift"], [/\b(rdls?)\b/, "Romanian deadlift"],
    [/\b(ohp|overhead press|military press|shoulder press)\b/, "Overhead press"], [/\bpull[- ]?ups?\b|\bchin[- ]?ups?\b/, "Pull-up"],
    [/\bpush[- ]?ups?\b/, "Push-up"], [/\blunges?\b/, "Walking lunge"], [/\bcurls?\b/, "Dumbbell curl"], [/\brows?\b/, "Barbell row"],
    [/\bdips?\b/, "Assisted dip"], [/\bplanks?\b/, "Plank"], [/\bhip thrusts?\b/, "Hip thrust"], [/\bcalf raises?\b/, "Standing calf raise"],
    [/\blat(eral)? raises?\b/, "Lateral raise"], [/\bpulldowns?\b/, "Lat pulldown"], [/\bcrunch(es)?\b/, "Cable crunch"], [/\bglute bridges?\b/, "Glute bridge"]
];
function coachFindExercise(t) {
    const exact = coachFindExerciseExact(t);
    if (exact) return exact;
    const alias = COACH_EX_ALIASES.find(([re]) => re.test(t));
    return alias && EXERCISES[alias[1]] ? alias[1] : null;
}
function coachFindExerciseExact(t) {
    let best = null;
    Object.keys(EXERCISES).forEach((name) => {
        String(EXERCISES[name].aka || "").toLowerCase().split(",").map((a) => a.trim()).filter((a) => a.length > 5)
            .forEach((a) => { if (t.includes(a) && (!best || a.length > best.length)) best = name; });
    });
    Object.keys(EXERCISES).forEach((name) => {
        const n = name.toLowerCase();
        const variants = [n, n.replace(/s$/, ""), `${n}s`, n.replace(/-/g, " ")];
        if (variants.some((v) => t.includes(v)) && (!best || n.length > best.length)) best = name;
    });
    return best;
}

function coachDose(name, compound, level, goal) {
    if (/plank|wall sit/i.test(name)) return ["3 × 30–45 s", "45 s"];
    if (/carry/i.test(name)) return ["3 × 40 steps", "60 s"];
    if (/dead bug|bird dog/i.test(name)) return ["3 × 8 per side", "45 s"];
    if (isCardio(name)) return ["10–15 min", ""];
    const per = /single|split squat|lunge|step-up|one-arm|single-arm/i.test(name) ? " per side" : "";
    // A goal sets the reps: heavy and low for strength, moderate for muscle, light and high for endurance
    if (goal) {
        const newer = level === "Beginner", main = compound && COACH_HEAVY.test(name);
        // Sets, reps, and rest by goal, from the NSCA's guidelines and the ACSM position stand on progression:
        // strength 1 to 6 reps for 2 to 6 sets (2 to 5 min rest), muscle 6 to 12 reps for 3 to 6 sets (1 to 2 min),
        // endurance 12+ reps for 2 to 3 sets (short rests). Newer lifters start a little lighter and higher.
        const g = {
            strength: main ? (newer ? ["3 × 5", "2–3 min"] : ["4 × 3–5", "3 min"]) : compound ? (newer ? ["3 × 6–8", "2 min"] : ["3 × 5–6", "2–3 min"]) : ["2 × 8–10", "90 s"],
            muscle: compound ? (newer ? ["3 × 8–12", "90 s"] : ["4 × 6–10", "2 min"]) : ["3 × 10–15", "60–90 s"],
            endurance: compound ? ["3 × 12–15", "60 s"] : ["2 × 15–20", "30–45 s"]
        }[goal];
        return [g[0] + per, g[1]];
    }
    const table = {
        Beginner: compound ? ["3 × 8–12", "90 s"] : ["2 × 12–15", "60 s"],
        Intermediate: compound ? ["3 × 8–10", "2 min"] : ["3 × 10–15", "60 s"],
        Advanced: compound ? ["4 × 6–8", "2–3 min"] : ["3 × 10–15", "60 s"],
        Expert: compound ? ["4 × 5–8", "3 min"] : ["3 × 10–15", "60–90 s"]
    }[level];
    return [table[0] + per, table[1]];
}

// Build a workout for some muscles, a kit ("none", "db", or the full gym), and a time budget
// What the training is for: "get stronger", "build muscle", "endurance / tone"
function coachGoal(t) {
    if (/\b(bigger|heavier|higher|better) (bench|squat|deadlift|lift|lifts|press|total|numbers|max)\b/.test(t)) return "strength";
    if (/\b(stronger|strength|strong|powerlift(ing|er)?|heavier|max out|1 ?rm|one rep max|pr|prs|personal record|lift more)\b/.test(t)) return "strength";
    if (/\b(build muscle|bigger|size|grow|growth|hypertrophy|bulk(ing)?|mass|gain muscle|get big|aesthetics?|muscle gain)\b/.test(t)) return "muscle";
    if (/\b(tone|toned|toning|endurance|definition|more reps|stamina|conditioning|lean out)\b/.test(t)) return "endurance";
    return null;
}
const COACH_GOAL_NAME = { strength: "Get stronger", muscle: "Build muscle", endurance: "Endurance" };

// The big lifts people quote numbers for, most specific first
const COACH_LIFTS = [
    [/\bincline (barbell |bench )?(press|bench)(ing)?\b/, "Incline barbell press"],
    [/\bbench(ing)?( press(ing)?)?\b|\bbp\b/, "Bench press"],
    [/\bfront squats?\b/, "Front squat"],
    [/\b(rdls?|romanian deadlifts?)\b/, "Romanian deadlift"],
    [/\btrap bar deadlifts?\b/, "Trap bar deadlift"],
    [/\b(back )?squat(s|ting)?\b/, "Back squat"],
    [/\bdead ?lift(s|ing)?\b|\bdeads\b|\bpull from the floor\b/, "Deadlift"],
    [/\b(ohp|overhead press(ing)?|military press|strict press)\b/, "Overhead press"],
    [/\b(barbell|bent[- ]over|pendlay) rows?\b/, "Barbell row"],
    [/\bhip thrust(s|ing)?\b/, "Hip thrust"],
    [/\bleg press(ing)?\b/, "Leg press"]
];
// What helps each big lift move up
const COACH_HELPERS = {
    "Bench press": ["Incline dumbbell press", "Overhead press", "Barbell row", "Skull crusher"],
    "Incline barbell press": ["Dumbbell bench press", "Seated dumbbell shoulder press", "Chest-supported row", "Triceps pushdown"],
    "Back squat": ["Romanian deadlift", "Bulgarian split squat", "Leg press", "Plank"],
    "Front squat": ["Back squat", "Bulgarian split squat", "Leg extension", "Plank"],
    Deadlift: ["Romanian deadlift", "Barbell row", "Hip thrust", "Back extension"],
    "Trap bar deadlift": ["Romanian deadlift", "Walking lunge", "Barbell row", "Farmer carry"],
    "Romanian deadlift": ["Hip thrust", "Lying hamstring curl", "Back extension", "Plank"],
    "Overhead press": ["Seated dumbbell shoulder press", "Lateral raise", "Pull-up", "Triceps pushdown"],
    "Barbell row": ["Pull-up", "Chest-supported row", "Face pull", "Hammer curl"],
    "Hip thrust": ["Romanian deadlift", "Bulgarian split squat", "Cable glute kickback", "Hip abduction machine"],
    "Leg press": ["Bulgarian split squat", "Leg extension", "Lying hamstring curl", "Standing calf raise"]
};

// Find lifts and any numbers attached: "I bench 225 for 5", "my squat max is 315", "3x5 at 100kg on deadlift"
function coachLiftFocus(t) {
    const found = [];
    let bare = t;
    COACH_LIFTS.forEach(([re, name]) => {
        bare = bare.replace(new RegExp(re.source, "g"), (m, ...a) => {
            const pos = a[a.length - 2];
            if (EXERCISES[name]) found.push({ name, pos });
            return " ".repeat(m.length);
        });
    });
    found.sort((a, b) => a.pos - b.pos);
    const nums = [];
    let rest = t;
    // sets x reps at weight
    rest = rest.replace(/\b(\d{1,2})\s*[x×]\s*(\d{1,2})\s*(?:@|at|with|of)\s*(\d{2,4}(?:\.\d+)?)\s*(lbs?|pounds?|kgs?|kilos?|kilograms?)?/g, (m, sets, r, w, u, pos) => {
        nums.push({ w: Number(w), r: Number(r), u, pos }); return " ".repeat(m.length);
    });
    for (const m of rest.matchAll(/(\d{2,4}(?:\.\d+)?)\s*(lbs?|pounds?|kgs?|kilos?|kilograms?)?(?:\s*(?:for|x|×|by)\s*(\d{1,2})\b)?/g)) {
        const after = rest.slice(m.index + m[0].length, m.index + m[0].length + 14);
        const before = rest.slice(Math.max(0, m.index - 14), m.index);
        if (/^\s*(min|mins|minutes|m\b|years?|yo\b|y\/o|sec|s\b|%|days?|weeks?|reps?|times a|lbs? (of )?body|pounds? (of )?body)/.test(after)) continue;
        if (/\b(weigh|weight is|bodyweight( is)?|i'm|i am|age|aged|lose|lost|drop|down)\s*$/.test(before)) continue;
        let r = m[3] ? Number(m[3]) : null;
        if (!r) {
            const near = rest.slice(Math.max(0, m.index - 16), m.index + m[0].length + 16).match(/\b(\d{1,2})\s*reps?\b/);
            r = near ? Number(near[1]) : 1;
        }
        nums.push({ w: Number(m[1]), r, u: m[2], pos: m.index });
    }
    const lifts = [];
    if (found.length) {
        nums.forEach((n) => {
            const lift = found.slice().sort((a, b) => Math.abs(a.pos - n.pos) - Math.abs(b.pos - n.pos))[0];
            const u = /kg|kilo/.test(n.u || "") ? "kg" : /lb|pound/.test(n.u || "") ? "lb" : null;
            const lbs = u === "kg" ? n.w * 2.20462 : n.w;
            if (lbs < 20 || lbs > 1500 || n.r < 1 || n.r > 15 || lifts.some((l) => l.name === lift.name)) return;
            lifts.push({ name: lift.name, w: n.w, r: n.r, u });
        });
    }
    // Is the question about one lift? ("get stronger at bench", "how much should I squat")
    const other = COACH_GROUPS.some(([, re]) => re.test(bare)) || COACH_COMBOS.some(([re]) => re.test(bare));
    const asks = /\b(stronger|better|improve|increase|raise|boost|bring up|progress|stuck|plateau(ed)?|how much|what weight|how heavy|how many (sets|reps)|sets and reps|program for|plan for|get my|max|1 ?rm|pr)\b/.test(t);
    const focus = found.length && !other && (asks || lifts.length) ? found[0].name : null;
    return { lifts, focus, liftAsk: asks };
}

/* Numbers people tell Coach ("I bench 225 for 5") are saved on this device as estimated maxes,
   so every workout after that can show real weights. Checked on the way back in. */
const MAXES_KEY = "gu-coach-maxes";
function coachMaxes() {
    const raw = store.get(MAXES_KEY, {});
    const out = {};
    if (raw && typeof raw === "object") Object.keys(raw).forEach((k) => {
        const v = raw[k];
        if (EXERCISES[k] && v && Number(v.m) > 0 && Number(v.m) < 2000 && ["lb", "kg"].includes(v.u)) out[k] = { m: Number(v.m), u: v.u, w: Number(v.w) || 0, r: Number(v.r) || 1 };
    });
    return out;
}
function coachSaveLifts(lifts, unit) {
    if (!lifts.length) return;
    const all = coachMaxes();
    lifts.forEach((l) => { const u = l.u || unit; all[l.name] = { m: Math.round(e1rm(l.w, l.r) * 10) / 10, u, w: l.w, r: l.r }; });
    store.set(MAXES_KEY, all);
}
// Best estimate of someone's max on a lift: what they told Coach, or else their most recent logged session
function coachKnownMax(name, unit) {
    const said = coachMaxes()[name];
    if (said) return { m: toUnit(said.m, said.u, unit), from: "you told me", w: said.w, r: said.r, u: said.u };
    const entries = typeof logFor === "function" ? logFor(name) : [];
    const lastEntry = entries[entries.length - 1];
    if (lastEntry && lastEntry.sets && lastEntry.sets.some((x) => x.w > 0)) return { m: sessionBest(lastEntry, unit), from: "your log" };
    const start = typeof startMax === "function" ? startMax(name, unit) : null;
    if (start && !start.each) return { m: start.m, from: "your level and bodyweight" };
    return null;
}
/* Starting guesses for helper lifts, from a big lift we know: [known lift, share of its max, dumbbells?].
   Typical ratios for people who train these lifts regularly; the card calls them guesses. */
const COACH_RATIOS = {
    "Incline barbell press": [["Bench press", 0.8]],
    "Incline dumbbell press": [["Bench press", 0.32, true]],
    "Dumbbell bench press": [["Bench press", 0.37, true]],
    "Overhead press": [["Bench press", 0.62]],
    "Seated dumbbell shoulder press": [["Overhead press", 0.42, true], ["Bench press", 0.26, true]],
    "Barbell row": [["Bench press", 0.75], ["Deadlift", 0.5]],
    "Skull crusher": [["Bench press", 0.33]],
    "Bench press": [["Incline barbell press", 1.2]],
    "Front squat": [["Back squat", 0.8]],
    "Back squat": [["Front squat", 1.2]],
    "Romanian deadlift": [["Deadlift", 0.7], ["Back squat", 0.75]],
    "Bulgarian split squat": [["Back squat", 0.22, true]]
};
// Put a weight on each lift we have a number for, aiming to finish each set with 1 or 2 reps left
function coachWeigh(w) {
    const saidUnit = w.focus && coachMaxes()[w.focus] ? coachMaxes()[w.focus].u : null;
    const unit = saidUnit || getProfile().unit;
    const step = unit === "kg" ? 2.5 : 5;
    w.unit = unit;
    w.known = [];
    const loadFor = (m, d, each) => { const st = each ? step / 2.5 * (unit === "kg" ? 1 : 2.5) : step; return Math.max(st, Math.round(m / (1 + (d.high + 1) / 30) / st) * st); };
    const first = w.items.map((x) => {
        const d = parseDose(x.d);
        const max = d.timed || /\bat \d/.test(x.d) ? null : coachKnownMax(x.n, unit);
        if (!max) return { ...x, w: 0 };
        w.known.push({ n: x.n, m: max.m, from: max.from });
        return { ...x, w: loadFor(max.m, d) };
    });
    // Then fill in helper lifts from the big lifts we know
    w.items = first.map((x) => {
        const d = parseDose(x.d);
        if (x.w || d.timed || !COACH_RATIOS[x.n] || /\bat \d/.test(x.d)) return x;
        for (const [from, share, each] of COACH_RATIOS[x.n]) {
            const max = coachKnownMax(from, unit);
            if (max) return { ...x, w: loadFor(max.m * share, d, each), guess: true, each: !!each };
        }
        return x;
    });
    return w;
}
// One lift, done right: the lift first with the goal's sets and reps, then what helps it move
function coachFocusBuild(req, level) {
    const lift = req.focus, goal = req.goal || "strength";
    const names = [lift, ...(COACH_HELPERS[lift] || [])].filter((n) => EXERCISES[n] && (!req.kit || kitAllows(req.kit, EXERCISES[n].kit)));
    const items = names.slice(0, level === "Beginner" ? 4 : 5).map((n, i) => {
        const [d, rest] = coachDose(n, COACH_COMPOUND.test(n), level, i === 0 ? goal : goal === "strength" ? "muscle" : goal);
        return { n, d, rest };
    });
    const minutes = Math.round(items.reduce((sum, x) => sum + (parseDose(x.d).sets || 3) * 2.5, 0) + 5);
    return { title: `${lift} focus`, items, minutes, kit: req.kit, bumped: false, level, finisher: null, goal, focus: lift, missing: [] };
}
// Build whatever was asked for, then add weights where we know the numbers
function coachMake(req, level) {
    return coachWeigh(req.focus ? coachFocusBuild(req, level) : coachBuild(req, level));
}

// At Advanced and Expert, barbell and bodyweight strength moves come before machines
const COACH_HEAVY = /^(Back squat|Front squat|Deadlift|Trap bar deadlift|Romanian deadlift|Bench press|Incline barbell press|Barbell row|Pull-up|Overhead press|Hip thrust|Bulgarian split squat|Skull crusher|Barbell curl|EZ-bar curl|Hanging knee raise|Ab wheel rollout|Arnold press|Walking lunge|Standing calf raise|Farmer carry)$/;
const COACH_MACHINE = /machine|assisted|smith|pec deck/i;

function coachBuild(req, level) {
    const groups = (req.groups.length ? req.groups : ["quads", "chest", "lats", "shoulders", "hamstrings", "abs"]).filter((g) => !(req.exclude || []).includes(g));
    const count = req.minutes ? Math.min(9, Math.max(3, Math.round(req.minutes / 8))) : { Beginner: 5, Intermediate: 6, Advanced: 6, Expert: 7 }[level];
    const strong = levelRank(level) >= levelRank("Advanced");
    const pickStrong = strong || req.goal === "strength";
    const rank = (n, main) => (pickStrong ? (COACH_HEAVY.test(n) && main ? -2 : 0) + (COACH_MACHINE.test(n) ? 2 : 0) : 0);
    // Your setup: moves you asked to skip stay out, and home workouts don't need a bench
    const prof = getProfile();
    const atHome = req.home || (Boolean(req.kit) && ["home", "homedb"].includes(prof.place));
    const kitOk = (n) => (!req.kit || kitAllows(req.kit, EXERCISES[n] && EXERCISES[n].kit)) && !avoidedBy(n, prof.avoid) && !(atHome && req.kit && NEEDS_BENCH.test(n));
    const pool = groups.map((gid) => {
        const g = MUSCLE_MAP.find((x) => x.id === gid);
        const named = g.parts.filter((p) => req.parts.includes(p.id));
        const fromMap = (named.length ? named : g.parts).flatMap((p) => p.ex);
        const primary = (n) => COACH_MUSCLE_TEXT[gid].test((EXERCISES[n].m || "").split(",")[0]);
        const fromText = Object.keys(EXERCISES)
            .filter((n) => !isCardio(n) && !/stretch|mobility/i.test(n) && COACH_MUSCLE_TEXT[gid].test((EXERCISES[n].m || "").split(",").slice(0, 2).join(",")))
            .sort((a, b) => Number(primary(b)) - Number(primary(a)));
        // beginners get the assisted version of pull-ups and dips
        // and stronger lifters get the real thing
        const easy = (n) => (level === "Beginner" && (n === "Pull-up" || n === "Dip") ? `Assisted ${n.toLowerCase()}`
            : strong && n === "Assisted pull-up" ? "Pull-up" : n);
        const mapped = fromMap.map(easy).filter((n) => EXERCISES[n] && kitOk(n));
        const list = named.length && mapped.length ? mapped : [...new Set([...mapped, ...fromText.map(easy)])].filter((n) => EXERCISES[n] && kitOk(n));
        return { gid, list: [...new Set(list)].map((n, i) => [n, i]).sort((a, b) => rank(a[0], primary(a[0])) - rank(b[0], primary(b[0])) || a[1] - b[1]).map((x) => x[0]) };
    }).filter((x) => x.list.length);
    const picked = [], used = new Set();
    for (let round = 0; picked.length < count && round < 6; round++) {
        pool.forEach((p) => {
            if (picked.length >= count) return;
            const n = p.list.find((x) => !used.has(x));
            if (n) { used.add(n); picked.push(n); }
        });
    }
    // Big lifts first, smaller moves after
    picked.sort((a, b) => Number(COACH_COMPOUND.test(b)) - Number(COACH_COMPOUND.test(a)));
    let items = picked.map((n) => { const [d, rest] = coachDose(n, COACH_COMPOUND.test(n), level, req.goal); return { n, d, rest }; });
    // Only a couple of moves fit? Add a set to each so it's still a full session
    const bumped = items.length > 0 && items.length < 4;
    if (bumped) items = items.map((x) => ({ ...x, d: x.d.replace(/^(\d+)/, (s) => String(Math.min(5, Number(s) + 1))) }));
    const names = req.title && req.title.length ? req.title : pool.map((p) => MUSCLE_MAP.find((x) => x.id === p.gid).name);
    const title = names.length > 1 ? `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}` : names[0] || "Full body";
    const minutes = Math.round(items.reduce((sum, x) => sum + (parseDose(x.d).sets || 3) * 2, 0) + 5);
    // An all-out request gets a finisher on the last big lift and the last small move
    let finisher = null;
    if (req.intensity === "max" && items.length) {
        const big = items.find((x) => COACH_COMPOUND.test(x.n) && !parseDose(x.d).timed);
        const small = [...items].reverse().find((x) => !COACH_COMPOUND.test(x.n) && !parseDose(x.d).timed)
            || [...items].reverse().find((x) => !parseDose(x.d).timed && (!big || x.n !== big.n));
        finisher = { big: big ? big.n : null, small: small ? small.n : null };
    }
    return { title: req.groups.length ? title : "Full body", items, minutes, kit: req.kit, bumped, level, finisher, goal: req.goal || null,
        missing: req.groups.filter((g) => !pool.some((p) => p.gid === g)) };
}

/* ---------- Fitness Coach AI helpers ----------
   Only when COACH_AI_URL is set. The answer comes back as plain text with light
   formatting; it's escaped first and only simple tags are added back. */
const coachAiOn = () => /^https:\/\/[a-z0-9.-]+(\/[\w\-./]*)?$/i.test(COACH_AI_URL);

function coachMarkdown(md) {
    const inline = (s) => escapeHtml(s)
        .replace(/\[([^\]]{1,80})\]\(([a-z0-9-]+\.html(?:#[\w-]+)?)\)/g, '<a href="$2">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    const out = [];
    let list = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
    String(md).replace(/\r/g, "").split("\n").forEach((line) => {
        const l = line.trim();
        let m;
        if (!l || /^[-*_]{3,}$/.test(l)) { close(); return; }
        if ((m = l.match(/^#{1,6}\s+(.*)$/))) { close(); out.push(`<p class="coach-h"><strong>${inline(m[1].replace(/\*\*/g, ""))}</strong></p>`); return; }
        if ((m = l.match(/^[-*•]\s+(.*)$/))) { if (list !== "ul") { close(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inline(m[1])}</li>`); return; }
        if ((m = l.match(/^\d{1,2}[.)]\s+(.*)$/))) { if (list !== "ol") { close(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inline(m[1])}</li>`); return; }
        close();
        out.push(`<p>${inline(l)}</p>`);
    });
    close();
    return out.join("");
}

// The workout block the AI adds, checked line by line: real exercises only, simple doses, sane weights
function coachAiWorkout(raw) {
    let data;
    try { data = JSON.parse(raw); } catch (e) { return null; }
    if (!data || !Array.isArray(data.items)) return null;
    const names = Object.keys(EXERCISES);
    const items = data.items.slice(0, 10).map((x) => {
        if (!x || typeof x.n !== "string") return null;
        const n = names.find((k) => k.toLowerCase() === x.n.trim().toLowerCase());
        if (!n) return null;
        let d = String(x.d || "").replace(/\s*[x×]\s*/i, " × ").replace(/-/g, "–").trim();
        if (!/^\d{1,2} × \d{1,3}(–\d{1,3})?( ?(s|sec|min|steps))?( per side)?$/.test(d)) d = "3 × 8–12";
        const w = String(x.w || "").trim().match(/^(\d{1,4}(?:\.\d+)?)\s?(lb|lbs|kg)( each( hand)?)?$/i);
        if (w) d = `${d} at ${w[1]} ${w[2].toLowerCase().replace("lbs", "lb")}${w[3] ? " each" : ""}`;
        const rest = /^[\d–\- ]{1,7}\s?(s|sec|min|minutes?)$/.test(String(x.rest || "").trim()) ? String(x.rest).trim() : "";
        return { n, d: d.slice(0, 40), rest, w: 0 };
    }).filter(Boolean);
    if (!items.length) return null;
    const title = String(data.title || "My workout").replace(/[<>]/g, "").slice(0, 50) || "My workout";
    const minutes = Math.round(items.reduce((sum, x) => sum + (parseDose(x.d).sets || 3) * 2.5, 0) + 5);
    return { title, items, minutes, kit: null, bumped: false, level: getLevel(), finisher: null, missing: [], known: [], ai: true };
}

// What the AI is told about this site (no personal data): the exercises, the plans, and the pages
function coachAiContext() {
    const plans = Object.entries(PROGRAMS).filter(([id]) => id !== "custom")
        .map(([id, p]) => `- ${p.name} (${p.level}, ${Object.keys(p.plans || {}).join("/")} days a week): programs.html#program-${id}`).join("\n");
    const pages = SITE_NAV.flatMap((s) => [[s.label, s.href], ...[].concat(Array.isArray(s.items) ? s.items : [], s.more || [])
        .filter((i) => Array.isArray(i)).map((i) => [i[0], i[2]])]).map(([t, h]) => `- ${t}: ${h}`).join("\n");
    return `Exercises (tap-able how-to guides):\n${Object.keys(EXERCISES).join(", ")}\n\nPlans:\n${plans}\n\nPages:\n${pages}\n- My progress: me.html\n- Supplements guide: supplements.html`;
}

function setupCoach() {
    if (typeof EXERCISES !== "object" || typeof MUSCLE_MAP !== "object") return;
    // A loaded barbell
    const ICON = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="1" y="15" width="30" height="2" fill="currentColor"/><rect x="5" y="8" width="3" height="16" fill="var(--volt)"/><rect x="8.5" y="10" width="2.5" height="12" fill="currentColor"/><rect x="11.5" y="13.5" width="1.5" height="5" fill="currentColor"/><rect x="24" y="8" width="3" height="16" fill="var(--volt)"/><rect x="21" y="10" width="2.5" height="12" fill="currentColor"/><rect x="19" y="13.5" width="1.5" height="5" fill="currentColor"/></svg>`;
    document.body.insertAdjacentHTML("beforeend", `
<button type="button" class="coach-fab" id="coach-fab" aria-haspopup="dialog" aria-controls="coach" aria-expanded="false">${ICON}<span>Fitness Coach</span></button>
<section class="coach" id="coach" role="dialog" aria-modal="false" aria-labelledby="coach-title" hidden>
    <header class="coach-head">
        <span class="coach-avatar">${ICON}</span>
        <div><h2 id="coach-title">Fitness Coach</h2><p>${coachAiOn() ? "Ask anything about training" : "Builds a workout for any muscles you want"}</p></div>
        <button type="button" class="coach-clear" id="coach-clear">Clear chat</button>
        <button type="button" class="coach-close" id="coach-close" aria-label="Close Fitness Coach">&times;</button>
    </header>
    <div class="coach-log" id="coach-log" aria-live="polite"></div>
    <div class="coach-chips" id="coach-chips"></div>
    <form class="coach-form" id="coach-form" autocomplete="off">
        <label for="coach-input" class="visually-hidden">Message Fitness Coach</label>
        <input id="coach-input" type="text" maxlength="200" placeholder="e.g. shoulders, back and abs" enterkeyhint="send">
        <button type="submit" class="btn btn-primary btn-compact">Send</button>
    </form>
</section>`);
    const fab = document.getElementById("coach-fab"), panel = document.getElementById("coach");
    const log = document.getElementById("coach-log"), chips = document.getElementById("coach-chips");
    const form = document.getElementById("coach-form"), input = document.getElementById("coach-input");
    let last = null, lastReq = null, started = false;
    const phone = () => window.matchMedia("(max-width: 760px)").matches;

    /* The chat is saved on this device (last 40 messages) so it follows you from page to page.
       Saved messages are cleaned on the way back in: only simple formatting, links to this
       site's pages, and buttons for real exercises survive. */
    const HISTORY_KEY = "gu-coach-history", STATE_KEY = "gu-coach-state", OPEN_KEY = "gu-coach-open";
    const ALLOWED = { P: [], STRONG: [], EM: [], OL: [], UL: [], LI: [], SPAN: [], DIV: [], BR: [], A: ["href"], BUTTON: ["data-howto", "data-coach-start"] };
    function cleanHtml(html) {
        const tpl = document.createElement("template");
        tpl.innerHTML = String(html).slice(0, 6000);
        const walk = (node) => [...node.childNodes].forEach((el) => {
            if (el.nodeType === 3) return;
            if (el.nodeType !== 1 || !ALLOWED[el.tagName]) { el.remove(); return; }
            [...el.attributes].forEach((a) => {
                const keep = a.name === "class" ? /^[\w -]+$/.test(a.value)
                    : a.name === "type" ? el.tagName === "BUTTON"
                    : ALLOWED[el.tagName].includes(a.name);
                if (!keep) el.removeAttribute(a.name);
            });
            if (el.tagName === "A" && !/^[a-z0-9-]+\.html(#[\w-]+)?$/.test(el.getAttribute("href") || "")) el.removeAttribute("href");
            if (el.tagName === "BUTTON") {
                el.setAttribute("type", "button");
                if (el.hasAttribute("data-howto") && !EXERCISES[el.getAttribute("data-howto")]) el.removeAttribute("data-howto");
            }
            walk(el);
        });
        walk(tpl.content);
        return tpl.innerHTML;
    }
    const history = () => { const h = store.get(HISTORY_KEY, []); return Array.isArray(h) ? h.filter((m) => m && (m.who === "you" || m.who === "coach") && typeof m.html === "string").slice(-40) : []; };
    const say = (html, who = "coach", save = true) => {
        log.insertAdjacentHTML("beforeend", `<div class="coach-msg is-${who}">${cleanHtml(html)}</div>`);
        log.scrollTop = log.scrollHeight;
        if (save) store.set(HISTORY_KEY, [...history(), { who, html }].slice(-40));
    };
    // The last workout, so "make it shorter" and "Start" still work on another page
    function saveState() { store.set(STATE_KEY, { last, lastReq }); }
    (function loadState() {
        const s = store.get(STATE_KEY);
        if (!s || typeof s !== "object") return;
        const okGroup = (g) => MUSCLE_MAP.some((x) => x.id === g);
        if (s.lastReq && typeof s.lastReq === "object" && Array.isArray(s.lastReq.groups)) {
            lastReq = {
                t: "", groups: s.lastReq.groups.filter(okGroup), parts: (s.lastReq.parts || []).filter((p) => mmPart(p)),
                kit: ["none", "db"].includes(s.lastReq.kit) ? s.lastReq.kit : null,
                minutes: Number(s.lastReq.minutes) > 0 ? Math.min(120, Number(s.lastReq.minutes)) : null,
                title: (s.lastReq.title || []).filter((x) => typeof x === "string").map((x) => x.slice(0, 30)).slice(0, 6),
                level: LEVELS.includes(s.lastReq.level) ? s.lastReq.level : null,
                intensity: ["max", "hard", "easy"].includes(s.lastReq.intensity) ? s.lastReq.intensity : null,
                exclude: (s.lastReq.exclude || []).filter(okGroup),
                goal: COACH_GOAL_NAME[s.lastReq.goal] ? s.lastReq.goal : null,
                focus: COACH_LIFTS.some(([, n]) => n === s.lastReq.focus) ? s.lastReq.focus : null
            };
        }
        if (s.last && Array.isArray(s.last.items)) {
            const items = s.last.items.filter((x) => x && EXERCISES[x.n]).map((x) => ({ n: x.n, d: String(x.d || "").slice(0, 40), rest: String(x.rest || "").slice(0, 20) }));
            if (items.length) last = { title: String(s.last.title || "Workout").replace(/[<>]/g, "").slice(0, 60), items, minutes: Number(s.last.minutes) || 30, kit: lastReq ? lastReq.kit : null, bumped: false, missing: [], level: (lastReq && lastReq.level) || getLevel(), finisher: null,
                goal: lastReq ? lastReq.goal : null, focus: lastReq ? lastReq.focus : null };
            if (last) last = coachWeigh(last);
        }
    })();
    const suggest = (list) => { chips.innerHTML = list.map((s) => `<button type="button" class="chip" data-coach-say="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join(""); };
    const DEFAULT_CHIPS = ["Shoulders, back & abs", "Legs, 30 minutes", "Full body, no equipment", "How do I do a deadlift?"];

    function open(focus = true) {
        panel.hidden = false;
        fab.setAttribute("aria-expanded", "true");
        document.body.classList.add("coach-open");
        store.set(OPEN_KEY, true);
        if (!started) {
            started = true;
            const saved = history();
            if (saved.length) {
                saved.forEach((m) => say(m.html, m.who, false));
                suggest(last ? ["Make it shorter", "Make it harder", "Start this workout"] : DEFAULT_CHIPS);
                if (focus && !phone()) setTimeout(() => input.focus(), 30);
                return;
            }
            say(`<p><strong>Hey, I'm your Fitness Coach.</strong> Tell me what you want to train and I'll build you a workout from this site's exercise guides. Try "<em>shoulders, back and abs</em>", "<em>30 min legs, no equipment</em>", or "<em>a really hard chest and back workout</em>". You can also say how hard ("easy", "set it for expert") or change it after ("add abs", "without legs").</p>
                ${coachAiOn() ? `<p>Ask me anything, too: "<em>I have 45 minutes 3 days a week and want to lose fat and keep my strength. What should my week look like?</em>"</p>
                <p class="coach-fine">Answers are written by Claude, an AI made by Anthropic. What you type in this chat is sent to write the answer; your logs and settings stay on your phone. AI can make mistakes, so check anything about your health with a professional.</p>`
                : `<p class="coach-fine">I'm a simple built-in helper, not a person and not an AI service. Nothing you type leaves your phone.</p>`}`);
            suggest(DEFAULT_CHIPS);
        }
        if (focus) setTimeout(() => input.focus(), 30);
    }
    function close(moveFocus = true) {
        panel.hidden = true;
        fab.setAttribute("aria-expanded", "false");
        document.body.classList.remove("coach-open");
        store.set(OPEN_KEY, false);
        if (moveFocus) fab.focus();
    }

    function workoutCard(w) {
        const lvl = w.level || getLevel();
        const kitNote = w.kit === "none" ? " · no equipment" : w.kit === "db" ? " · dumbbells only" : "";
        const unit = w.unit || getProfile().unit;
        const known = w.known || [];
        // Say back what was understood, so people can see it got their request right
        const heard = [w.focus || w.title, w.goal ? COACH_GOAL_NAME[w.goal] : "", lvl, kitNote.replace(" · ", ""), ...known.map((k) => `${k.n.toLowerCase()} max about ${trimNum(Math.round(k.m / (unit === "kg" ? 2.5 : 5)) * (unit === "kg" ? 2.5 : 5))} ${unit}`)].filter(Boolean);
        const weighable = w.items.filter((x) => !parseDose(x.d).timed && EXERCISES[x.n] && EXERCISES[x.n].kit !== "none");
        const unweighed = weighable.filter((x) => !x.w);
        const focusStep = w.focus ? weightStep(w.focus, unit) : 0;
        return `<p class="coach-heard"><span>What I heard</span> ${escapeHtml(heard.join(" · "))}</p>
            <p>Here's your <strong>${escapeHtml(w.title)}</strong> workout: ${w.items.length} exercises, about ${w.minutes} minutes${kitNote}. Set for <strong>${lvl}</strong>.</p>
            <ol class="coach-workout">${w.items.map((x) => `<li>${equipIcon(x.n)}<button type="button" class="coach-ex" data-howto="${escapeHtml(x.n)}">${escapeHtml(x.n)}</button><span>${escapeHtml(x.d)}${x.w ? ` at <strong>${x.guess ? "about " : ""}${escapeHtml(trimNum(x.w))} ${unit}</strong>${x.each ? " each hand" : ""}` : ""}${x.rest ? ` · rest ${escapeHtml(x.rest)}` : ""}</span></li>`).join("")}</ol>
            ${w.focus ? `<p><strong>How often:</strong> ${escapeHtml(w.focus.toLowerCase())} 2 times a week, with at least 2 days between. <strong>To keep improving:</strong> when you get the top of the rep range on every set, add ${trimNum(focusStep)} ${unit} next time. Miss the bottom of the range two sessions in a row? Drop about 10% and build back up.</p>` : ""}
            ${known.length ? `<p class="coach-fine">Weights are worked out from ${escapeHtml(known.map((k) => `your ${k.n.toLowerCase()} (${k.from})`).join(" and "))} so each set ends with 1 or 2 reps left. ${lvl === "Beginner" ? "Start about 10% lighter the first week while you learn the movement." : "If the first set feels too heavy or your form slips, drop 5 to 10%."}${w.items.some((x) => x.guess) ? " Weights marked \"about\" are starting guesses from your main lift; adjust after the first set." : ""}</p>` : ""}
            ${unweighed.length ? `<p class="coach-fine">${known.length ? "For the rest, pick" : "Pick"} a weight you can lift for the top of the rep range with 1 or 2 reps left.${!known.length && (w.focus || w.goal === "strength" || w.items.some((x) => COACH_LIFTS.some(([, n]) => n === x.n))) ? ` Tell me your numbers, like "I bench 185 for 5", and I'll put exact weights on these.` : ""}</p>` : ""}
            ${w.finisher && (w.finisher.big || w.finisher.small) ? `<p><strong>Finisher:</strong> ${w.finisher.big ? `on ${escapeHtml(w.finisher.big)}, pause for 1 second at the hardest point of every rep` : ""}${w.finisher.big && w.finisher.small ? "; " : ""}${w.finisher.small ? `on your last set of ${escapeHtml(w.finisher.small)}, drop the weight by about a quarter when you can't do another clean rep, and keep going` : ""}.</p>` : ""}
            ${lvl !== getLevel() ? `<p class="coach-fine">This one workout is set for ${lvl}. Your level for the rest of the site stays ${getLevel()}.</p>` : ""}
            ${levelRank(lvl) >= 2 ? `<p class="coach-fine">Heavy day: warm up with 2 or 3 lighter sets of the first lift, use a spotter or safety pins on presses and squats, and end a set when your form slips.</p>` : ""}
            ${w.bumped ? `<p class="coach-fine">Only a few moves fit that, so each one gets an extra set.</p>` : ""}
            ${w.missing.length ? `<p class="coach-fine">I couldn't find ${escapeHtml(w.missing.join(", "))} exercises for that equipment, so I left them out.</p>` : ""}
            <div class="coach-actions"><button type="button" class="btn btn-primary btn-compact" data-coach-start>Start this workout</button></div>
            <p class="coach-fine">Tap an exercise to see how to do it. Warm up for 5 minutes first.</p>`;
    }

    function reply(text) {
        const req = coachUnderstand(text);
        const t = req.t;
        // Safety first
        if (req.pain) {
            say(`<p>If something hurts, especially sharp pain, joint pain, chest pain, or dizziness, please stop and get it checked by a doctor or physical therapist before training it.</p>
                ${req.groups.length ? `<p>I can build a workout that leaves ${escapeHtml(req.groups.map((g) => MUSCLE_MAP.find((x) => x.id === g).name.toLowerCase()).join(" and "))} alone. Tell me what you'd like to train instead.</p>` : ""}`);
            suggest(["Upper body", "Lower body", "Core only"]);
            return;
        }
        if (/\b(i'?m|i am) (1[0-7]|[5-9]) ?(years? old|yo|y\/o)?\b|\bmy parents?\b.*\blet me\b/.test(t)) {
            say(`<p>This site's plans are written for adults. If you're under 18, please train with a coach, PE teacher, or parent, and ask a doctor before starting a program.</p>`);
            return;
        }
        // Food questions ("how much should I eat to lose weight?") come before anything about lifting weight
        if (/\b(diet|eat|eating|calories?|protein|meal|food|macros?|supplements?|creatine)\b/.test(t) && !req.groups.length && !req.lifts.length) {
            say(`<p>For food, start with the <a href="tools.html#tool-calories">calorie and protein estimator</a>${/\bsupplement|creatine\b/.test(t) ? ` and the <a href="supplements.html">supplements guide</a>` : ""}. It gives a daily range that's safe for losing weight slowly. For a personal eating plan, especially with a health condition, a registered dietitian or your doctor is the right person to ask.</p>`);
            return;
        }
        // Numbers people tell us ("I bench 225 for 5") are saved for every workout after this
        coachSaveLifts(req.lifts, getProfile().unit);
        // Just telling us a number for a lift that's in the current workout: put weights on it
        if (req.lifts.length && last && !req.liftAsk && !req.goal && last.items.some((x) => req.lifts.some((l) => l.name === x.n))) {
            last = coachWeigh(last);
            saveState();
            say(`<p>Got it. Here's the same workout with your weights.</p>` + workoutCard(last));
            suggest(["Make it harder", "Make it shorter", "Start this workout"]);
            return;
        }
        // One lift: "I want to get stronger at bench", "how much should I squat? my max is 315"
        if (req.focus && !req.howto) {
            const mod = { ...req, t: "", groups: [], title: [], focus: req.focus, goal: req.goal || (lastReq && lastReq.focus === req.focus && lastReq.goal) || "strength", kit: req.kit };
            const level = coachLevelFor(req, getLevel());
            mod.level = level !== getLevel() ? level : req.level;
            last = coachMake(mod, level);
            lastReq = mod;
            saveState();
            say(workoutCard(last));
            const verb = { "Bench press": "bench", "Back squat": "squat", Deadlift: "deadlift", "Overhead press": "overhead press" }[req.focus];
            suggest(last.known && last.known.length ? ["Make it harder", "Build muscle instead", "Start this workout"] : [verb ? `I ${verb} 185 for 5` : "Make it easier", "Make it harder", "Start this workout"]);
            return;
        }
        // "How much weight should I use?"
        if (/\bhow (much|heavy)\b.*\b(weight|lift|use|go|load)\b|\bwhat weight\b|\bhow much should i\b/.test(t) && !req.groups.length) {
            say(`<p>Pick a weight you can lift for the top of the rep range with 1 or 2 good reps left. If you get the top of the range on every set, go up next time (about 5 lb on upper-body lifts, 10 lb on squats and deadlifts).</p>
                <p>Tell me a lift and what you can do now, like "<em>I bench 185 for 5</em>" or "<em>my squat max is 275</em>", and I'll work out exact weights and sets for you.</p>`);
            suggest(["I want to get stronger at bench", "How much should I squat?", "Build muscle: chest and back"]);
            return;
        }
        // Follow-ups to the last workout
        // "add abs", "also arms": add muscles to the last workout
        if (last && lastReq && req.groups.length && req.add && !req.exclude.length) {
            const mod = { ...lastReq, groups: [...new Set([...lastReq.groups, ...req.groups])], parts: [...new Set([...lastReq.parts, ...req.parts])],
                title: [...lastReq.title, ...req.title.filter((x) => !lastReq.title.includes(x))].slice(0, 6) };
            if (req.kit) mod.kit = req.kit;
            if (req.minutes) mod.minutes = req.minutes;
            if (req.level || req.intensity) { mod.level = coachLevelFor(req, last.level || getLevel()); mod.intensity = req.intensity === "max" ? "max" : mod.intensity; }
            if (!req.minutes && !mod.minutes) mod.minutes = null;
            mod.focus = null;
            last = coachMake(mod, mod.level || getLevel());
            lastReq = mod;
            saveState();
            say(workoutCard(last));
            suggest(["Make it harder", "Make it shorter", "Different exercises", "Start this workout"]);
            return;
        }
        if (last && lastReq && !req.groups.length) {
            const mod = { ...lastReq };
            let changed = false, note = "";
            if (req.exclude.length) {
                const left = mod.groups.filter((g) => !req.exclude.includes(g));
                if (left.length) {
                    mod.groups = left;
                    mod.parts = mod.parts.filter((p) => left.includes(mmPart(p).g.id));
                    const names = new Set(req.exclude.map((g) => MUSCLE_MAP.find((x) => x.id === g).name));
                    ["Full body", "Upper body", "Lower body", "Legs", "Arms", "Back", "Push", "Pull"].forEach((n, i) => { if (i && COACH_COMBOS[i][1].every((g) => req.exclude.includes(g))) names.add(n); });
                    mod.title = mod.title.filter((x) => !names.has(x));
                    changed = true;
                }
            }
            if (/\b(shorter|less time|quicker|too long)\b/.test(t)) { mod.minutes = Math.max(15, (last.minutes || 45) - 15); changed = true; }
            if (/\b(longer|more exercises|more time|too short)\b/.test(t)) { mod.minutes = Math.min(90, (last.minutes || 45) + 15); changed = true; }
            if (req.kit) { mod.kit = req.kit; changed = true; }
            if (/\b(gym|machines|full gym)\b/.test(t) && !req.kit) { mod.kit = null; changed = true; }
            // Harder, easier, or a named level changes this workout only, not the site level
            if (req.goal && req.goal !== mod.goal) { mod.goal = req.goal; changed = true; }
            if (req.level || req.intensity) {
                // Already at the top? Then "harder" adds a finisher instead
                if ((req.intensity === "up" || req.intensity === "hard") && !req.level && (last.level || getLevel()) === "Expert") { req.intensity = "max"; note = "That's already set for Expert, so I added a finisher."; }
                mod.level = coachLevelFor(req, last.level || getLevel());
                mod.intensity = req.intensity === "max" ? "max" : req.intensity === "down" || req.intensity === "easy" || (req.level && req.level !== "Expert") ? null : mod.intensity;
                changed = true;
            }
            if (/\b(different|other exercises|shuffle|new one)\b/.test(t)) { mod.shuffle = (mod.shuffle || 0) + 1; changed = true; }
            if (changed) {
                last = coachMake(mod, mod.level || getLevel());
                if (mod.shuffle) { const k = mod.shuffle % Math.max(1, last.items.length); last.items = [...last.items.slice(k), ...last.items.slice(0, k)]; }
                lastReq = mod;
                saveState();
                say((note ? `<p>${note}</p>` : "") + workoutCard(last));
                suggest(["Make it shorter", "Make it harder", "No equipment", "Start this workout"]);
                return;
            }
            if (/\bstart\b/.test(t)) { startWorkout(); return; }
        }
        // How do I do an exercise?
        const exName = coachFindExercise(t);
        if (exName && (req.howto || !req.groups.length)) {
            const x = EXERCISES[exName];
            say(`<p><strong>${escapeHtml(exName)}</strong> works your ${escapeHtml(x.m.toLowerCase())}.</p>
                <ol class="coach-steps">${x.steps.slice(0, 3).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
                <p><strong>Remember:</strong> ${escapeHtml(x.tip)}</p>
                <div class="coach-actions"><button type="button" class="btn btn-compact" data-howto="${escapeHtml(exName)}">Full how-to and demo</button></div>`);
            suggest([`Workout with ${exName.toLowerCase()}`, "Shoulders, back & abs", "Legs, 30 minutes"]);
            return;
        }
        if (req.howto && !req.groups.length) {
            say(`<p>Which exercise? Ask like "<em>how do I do a squat?</em>" or "<em>how do I do a lat pulldown?</em>", or browse every move with steps and a demo in the <a href="exercises.html">exercise library</a>.</p>`);
            suggest(["How do I do a squat?", "How do I do a push-up?", "How do I do a deadlift?"]);
            return;
        }
        // What does a muscle do?
        if (/\bwhat (do|does|is|are)\b/.test(t) && req.groups.length === 1 && !/\bworkout|train|exercise for\b/.test(t)) {
            const g = MUSCLE_MAP.find((x) => x.id === req.groups[0]);
            say(`<p><strong>${escapeHtml(g.name)}:</strong> ${escapeHtml(g.does)}</p><p><strong>Tip:</strong> ${escapeHtml(g.tip)}</p>`);
            suggest([`Build me a ${g.name.toLowerCase()} workout`, "Full body, no equipment"]);
            return;
        }
        // Food and weight questions: point to the right tools, and to a professional
        if (/\b(diet|eat|eating|calories?|protein|meal|food|macros?|supplements?|creatine)\b/.test(t) && !req.groups.length) {
            say(`<p>For food, start with the <a href="tools.html#tool-calories">calorie and protein estimator</a>${/\bsupplement|creatine\b/.test(t) ? ` and the <a href="supplements.html">supplements guide</a>` : ""}. For a personal eating plan, especially with a health condition, a registered dietitian or your doctor is the right person to ask.</p>`);
            return;
        }
        // Which plan should I follow?
        const plans = [
            [/\b(lose|losing|burn|cut|drop)\b.*\b(weight|fat|pounds|lbs|kg)\b|\bfat loss|weight loss\b/, "fatloss"],
            [/\b(run|running|5k|jog)\b/, "c25k"],
            [/\b(stronger|strength|powerlift)\b/, "strength"],
            [/\b(build muscle|bulk|get big|bigger|size|gain muscle)\b/, "build"],
            [/\b(new|beginner|never|first time|scared|nervous)\b/, "beginner"]
        ];
        const workoutWords = /\b(workout|train|training|session|exercises?|lift|lifting|routine|something|give me|build me|make me)\b/;
        const plan = !req.groups.length && plans.find(([re, id]) => re.test(t) && !(id === "beginner" && workoutWords.test(t)));
        if (plan) {
            const p = PROGRAMS[plan[1]];
            say(`<p>For that, I'd start with <strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.level)}): ${escapeHtml(p.summary)}</p>
                <div class="coach-actions"><a class="btn btn-primary btn-compact" href="programs.html#program-${plan[1]}">Open ${escapeHtml(p.name)}</a></div>
                <p class="coach-fine">Prefer a one-off session? Tell me the muscles you want to train.</p>`);
            return;
        }
        // Build a workout
        if (req.groups.length || workoutWords.test(t) || req.intensity || req.level || req.minutes) {
            const level = coachLevelFor(req, getLevel());
            last = coachMake(req, level);
            lastReq = { ...req, t: "", level: level !== getLevel() ? level : req.level };
            saveState();
            if (!last.items.length) {
                say(`<p>I couldn't find exercises for that with ${req.kit === "none" ? "no equipment" : "dumbbells only"}. Want a gym version instead?</p>`);
                suggest(["Gym version", "Full body, no equipment"]);
                return;
            }
            say(workoutCard(last));
            suggest(["Make it shorter", "Make it harder", "No equipment", "Different exercises"]);
            return;
        }
        if (/\b(hi|hey|hello|yo|sup)\b/.test(t)) { say(`<p>Hey! What do you want to train today?</p>`); suggest(DEFAULT_CHIPS); return; }
        if (/\b(thanks|thank you|thx|appreciate)\b/.test(t)) { say(`<p>Anytime. Go get it.</p>`); return; }
        say(`<p>I didn't quite get that. I'm best at building workouts. Name some muscles (like "chest and triceps" or "glutes"), add time or equipment if you want ("30 minutes", "no equipment"), or ask "how do I do a squat?"</p>`);
        suggest(DEFAULT_CHIPS);
    }

    // Take a moment to "read" the message: a typing indicator for about 1 to 2 seconds
    // (longer messages take a little longer), then the answer
    let thinking = false;
    const isMinor = (t) => /\b(i'?m|i am) (1[0-7]|[5-9]) ?(years? old|yo|y\/o)?\b|\bmy parents?\b.*\blet me\b/.test(t);
    function think(text) {
        if (thinking) return;
        // With the AI switched on, everything but the safety replies and "start" goes to it
        const quick = coachUnderstand(text);
        if (coachAiOn() && !quick.pain && !isMinor(quick.t) && !(last && /^\s*(start|start this workout|let'?s go|go)\s*[.!]*\s*$/.test(quick.t))) { askAi(text); return; }
        thinking = true;
        const sendBtn = form.querySelector("button[type=submit]");
        sendBtn.disabled = true;
        chips.querySelectorAll("button").forEach((b) => { b.disabled = true; });
        log.insertAdjacentHTML("beforeend", `<div class="coach-msg is-coach coach-typing" role="status"><span class="visually-hidden">Fitness Coach is typing</span><span class="coach-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>`);
        log.scrollTop = log.scrollHeight;
        const delay = Math.min(2000, 1000 + text.length * 15);
        setTimeout(() => {
            const typing = log.querySelector(".coach-typing");
            if (typing) typing.remove();
            thinking = false;
            sendBtn.disabled = false;
            reply(text);
        }, delay);
    }

    // Plain text of the conversation so far (buttons and fine print left out), for the AI
    function aiTurns() {
        return history().map((m) => {
            const tpl = document.createElement("template");
            tpl.innerHTML = cleanHtml(m.html);
            tpl.content.querySelectorAll(".coach-actions, .coach-fine, .coach-heard").forEach((el) => el.remove());
            tpl.content.querySelectorAll("li").forEach((li) => li.prepend("- "));
            tpl.content.querySelectorAll("p, li, ol, ul").forEach((el) => el.append("\n"));
            return { role: m.who === "you" ? "user" : "assistant", content: tpl.content.textContent.replace(/\n{3,}/g, "\n\n").trim().slice(0, 2000) };
        }).filter((m) => m.content).slice(-8);
    }

    // Ask the AI: show what it's doing while it reads and thinks, then the answer.
    // If it can't be reached, the built-in coach answers instead.
    function askAi(text) {
        thinking = true;
        const sendBtn = form.querySelector("button[type=submit]");
        sendBtn.disabled = true;
        chips.querySelectorAll("button").forEach((b) => { b.disabled = true; });
        const steps = ["Reading your question…", "Working out what you need…", "Thinking it through…", "Checking the exercise guides…", "Writing your answer…"];
        log.insertAdjacentHTML("beforeend", `<div class="coach-msg is-coach coach-typing" role="status"><span class="coach-dots" aria-hidden="true"><i></i><i></i><i></i></span> <span class="coach-step">${steps[0]}</span></div>`);
        log.scrollTop = log.scrollHeight;
        let step = 0;
        const timer = setInterval(() => {
            step = Math.min(steps.length - 1, step + 1);
            const el = log.querySelector(".coach-typing .coach-step");
            if (el) el.textContent = steps[step];
        }, 2200);
        const started = Date.now();
        const ctrl = new AbortController();
        const kill = setTimeout(() => ctrl.abort(), 45000);
        const finish = (fn) => {
            // Give it at least a couple of seconds, so it reads as considered rather than instant
            setTimeout(() => {
                clearInterval(timer); clearTimeout(kill);
                const typing = log.querySelector(".coach-typing");
                if (typing) typing.remove();
                thinking = false;
                sendBtn.disabled = false;
                fn();
            }, Math.max(0, 2500 - (Date.now() - started)));
        };
        fetch(COACH_AI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: aiTurns(), context: coachAiContext() }),
            signal: ctrl.signal
        }).then((res) => res.json().then((data) => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                if (!ok || !data || typeof data.text !== "string") throw new Error((data && data.error) || "error");
                finish(() => showAi(data.text));
            })
            .catch((err) => finish(() => {
                const busy = /too many|busy/i.test(String(err && err.message));
                say(`<p class="coach-fine">${busy ? "The AI coach is busy right now" : "I couldn't reach the AI coach (check your connection)"}, so here's my quick built-in answer.</p>`);
                reply(text);
            }));
    }
    function showAi(raw) {
        let text = String(raw).slice(0, 12000);
        let workout = null;
        const m = text.match(/<workout>([\s\S]*?)<\/workout>/i);
        if (m) { workout = coachAiWorkout(m[1]); text = text.replace(m[0], "").trim(); }
        text = text.replace(/<\/?workout>/gi, "");
        let html = coachMarkdown(text);
        if (workout) {
            last = workout;
            lastReq = null;
            saveState();
            html += `<p class="coach-h"><strong>${escapeHtml(workout.title)}</strong></p>
                <ol class="coach-workout">${workout.items.map((x) => `<li>${equipIcon(x.n)}<button type="button" class="coach-ex" data-howto="${escapeHtml(x.n)}">${escapeHtml(x.n)}</button><span>${escapeHtml(x.d)}${x.rest ? ` · rest ${escapeHtml(x.rest)}` : ""}</span></li>`).join("")}</ol>
                <div class="coach-actions"><button type="button" class="btn btn-primary btn-compact" data-coach-start>Start this workout</button></div>`;
        }
        say(`<div class="coach-ai">${html}</div>`);
        suggest(workout ? ["Start this workout", "Make it harder", "Explain why"] : ["Build me a workout for that", "Give me a weekly plan", "Explain more"]);
    }

    function startWorkout() {
        if (!last || !last.items.length) return;
        const unit = last.unit || getProfile().unit;
        store.set("gu-custom", { title: last.title, items: last.items.map((x) => ({ n: x.n, d: x.w ? `${x.d} at ${x.guess ? "about " : ""}${trimNum(x.w)} ${unit}${x.each ? " each" : ""}` : x.d, rest: x.rest })) });
        saveCustomDays([store.get("gu-custom")]);
        store.set("gu-last-plan", { goal: "custom", days: 1 });
        say(`<p>Saved as <strong>My workout</strong>. Opening it on the Plans page, where you can log your sets.</p>`);
        if (phone()) store.set(OPEN_KEY, false);
        setTimeout(() => { location.assign(`programs.html?w=${Date.now()}#program-custom-1`); }, 350);
    }

    // Questions typed somewhere else on the page (like the home page cover)
    window.addEventListener("coach-ask", (e) => {
        const text = String((e.detail && e.detail.text) || "").trim().slice(0, 200);
        if (!text) return;
        if (panel.hidden) open(false);
        say(`<p>${escapeHtml(text)}</p>`, "you");
        think(text);
        if (!phone()) input.focus();
    });
    fab.addEventListener("click", () => (panel.hidden ? open() : close()));
    document.getElementById("coach-close").addEventListener("click", close);
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        say(`<p>${escapeHtml(text)}</p>`, "you");
        input.value = "";
        think(text);
    });
    panel.addEventListener("click", (e) => {
        const c = e.target.closest("[data-coach-say]");
        if (c) {
            if (/^start this workout$/i.test(c.dataset.coachSay)) { startWorkout(); return; }
            say(`<p>${escapeHtml(c.dataset.coachSay)}</p>`, "you");
            think(c.dataset.coachSay);
        }
        if (e.target.closest("[data-coach-start]")) startWorkout();
    });
    document.getElementById("coach-clear").addEventListener("click", () => {
        store.remove(HISTORY_KEY); store.remove(STATE_KEY);
        last = null; lastReq = null; started = false; log.innerHTML = "";
        open();
    });
    // On phones the chat covers the page, so a link out of it closes the panel (the chat itself is kept)
    log.addEventListener("click", (e) => { if (e.target.closest("a[href]") && phone()) store.set(OPEN_KEY, false); });
    // Stay open from page to page; links like #coach open it too
    if (location.hash === "#coach" || store.get(OPEN_KEY) === true) open(location.hash === "#coach");
}

/* =========================================================
   FEATURE: Phone app. Works offline (sw.js) and, on a phone, offers
   once to add Ground Up to the home screen so it opens like an app.
   ========================================================= */
function setupApp() {
    if ("serviceWorker" in navigator && window.isSecureContext && location.protocol !== "file:") {
        navigator.serviceWorker.register("sw.js").catch(() => { /* offline support is a bonus */ });
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    document.documentElement.classList.toggle("is-app", standalone);
    if (standalone) return;
    // Count visits; only suggest installing from the second visit on, and not again after "Not now" for 30 days
    const visits = (Number(store.get("gu-visits")) || 0) + 1;
    store.set("gu-visits", visits);
    const snoozed = Number(store.get("gu-install-snooze")) || 0;
    const phone = window.matchMedia("(max-width: 760px)").matches;
    let deferred = null;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    function offer() {
        if (!phone || visits < 2 || Date.now() < snoozed || document.querySelector(".install-tip")) return;
        if (!ios && !deferred) return;
        document.body.insertAdjacentHTML("beforeend", `
<aside class="install-tip" role="region" aria-label="Add to home screen">
    <p><strong>Use Ground Up like an app.</strong> ${ios
        ? 'Tap the Share button <span class="share-glyph" aria-hidden="true">&#x2191;</span>, then <strong>Add to Home Screen</strong>.'
        : "Add it to your home screen: it opens full screen and works offline."}</p>
    <div class="install-actions">
        ${ios ? "" : '<button type="button" class="btn btn-primary btn-compact" data-install>Add to home screen</button>'}
        <button type="button" class="text-button" data-install-later>Not now</button>
    </div>
</aside>`);
        const tip = document.querySelector(".install-tip");
        tip.addEventListener("click", async (e) => {
            if (e.target.closest("[data-install]") && deferred) { deferred.prompt(); await deferred.userChoice.catch(() => null); deferred = null; tip.remove(); }
            if (e.target.closest("[data-install-later]")) { store.set("gu-install-snooze", Date.now() + 30 * 864e5); tip.remove(); }
        });
    }
    window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; offer(); });
    setTimeout(offer, 1500);
}

/* =========================================================
   FEATURE: Level picker. Any element with data-level-bar gets the
   Beginner / Intermediate / Advanced / Expert switch.
   ========================================================= */
/* =========================================================
   FEATURE: Your dashboard (top of My progress)
   A personal summary: your name, level, the plan you're on and your
   next workout, this week, your last workout, and your best lifts.
   ========================================================= */
function setupMyDashboard() {
    const box = document.getElementById("me-dash");
    if (!box) return;
    const h1 = document.querySelector(".page-banner h1");
    let sug = null;
    box.addEventListener("click", (e) => {
        if (e.target.closest("[data-sug-start]")) startSuggested(sug);
        if (e.target.closest("[data-sug-edit]")) customizeSuggested(sug);
    });
    function render() {
        const prof = getProfile(), unit = prof.unit, lvl = getLevel();
        if (h1) h1.textContent = prof.name ? `${prof.name}'s progress` : "My progress";
        const info = currentPlanInfo();
        const sessions = (store.get("gu-sessions", []) || []).filter((x) => x && typeof x.date === "string");
        const monday = isoDate(mondayOf(new Date()));
        const last = sessions[sessions.length - 1];
        // Only finished workouts, like the Log and Lifts tabs
        const log = finishedLog();
        const best = Object.keys(log).filter((n) => EXERCISES[n] && !isCardio(n)).map((n) => {
            const entries = log[n].filter((e) => e.sets.some((st) => st.w > 0));
            if (!entries.length) return null;
            const top = Math.max(...entries.map((e) => sessionBest(e, unit)));
            const first = sessionBest(entries[0], unit);
            // Gain from the rounded numbers, so it adds up with what's shown
            return { n, top, gain: roundWeight(top, unit) - roundWeight(first, unit), sessions: entries.length };
        }).filter(Boolean).sort((a, b) => b.top - a.top).slice(0, 4);
        const sets = finishedSetCount(log);
        // Workouts this week = workout days (finished workouts or cardio), the same count as the stats below
        const weekDaysDone = [...activeDates()].filter((d) => d >= monday).length;
        const streak = weekStreak();
        // Smart next step: never the same muscles two days running, and a ready-made Day 2 when your split runs out
        const recent = recentlyTrained();
        const musclesOf = (names) => new Set(names.filter((n) => EXERCISES[n] && !isCardio(n)).map((n) => builderMuscle(n)).filter((m) => m !== "core" && m !== "cardio"));
        const nextM = info && !info.weekDone ? musclesOf(info.items.map((x) => x.name)) : new Set();
        const recentM = recent ? musclesOf(recent.names) : new Set();
        const same = [...nextM].filter((m) => recentM.has(m));
        // Same muscles as today/yesterday for at least half of this workout? Then suggest something else
        // (Ready-made plans already space their days out with rest days, so they keep their own order)
        const clash = info && info.goal !== "custom" ? [] : same.length && same.length * 2 >= nextM.size ? same : [];
        const restNote = info && info.goal !== "custom" && !info.weekDone && (info.finishedToday || same.length)
            ? `<p class="dash-sub dash-rest">${info.finishedToday ? "Done for today. Rest up: this one's for your next training day." : "You trained yesterday. This plan works best with a rest day in between."}</p>` : "";
        const needSug = info ? (info.weekDone && info.goal === "custom") || clash.length > 0 : Boolean(recent);
        sug = needSug ? suggestNextWorkout() : null;
        const when = recent && recent.date === isoDate(new Date()) ? "today" : "yesterday";
        const sugCard = sug ? `
            ${clash.length ? `<p class="dash-warn"><strong>${escapeHtml(info.title)}</strong> works your ${escapeHtml(clash.map((m) => BUILD_MUSCLE_NAME[m].toLowerCase()).join(", "))} again, and you trained ${when === "today" ? "them today" : "them yesterday"}. Muscles grow on the days between, so try this instead:</p>` : ""}
            <p class="dash-big">${escapeHtml(info && info.goal === "custom" && info.weekDone ? `Day ${customDaysRaw().length + 1}: ${sug.title}` : sug.title)}</p>
            <p class="dash-sub">Made for you${recent ? ` · skips what you trained ${when}` : ""} · ${sug.items.length} exercises</p>
            <ul class="dash-targets">${sug.items.slice(0, 4).map((x) => { const t = isCardio(x.n) ? null : nextTarget(x.n, x.d, unit); const dose = String(x.d).replace(/ at .*$/, ""); return `<li>${equipIcon(x.n)}<span>${escapeHtml(x.n)}</span><strong>${escapeHtml(t && t.weight > 0 ? `${dose} · ${trimNum(t.weight)} ${unit}${t.each ? " each" : ""}` : dose)}</strong></li>`; }).join("")}</ul>
            <div class="dash-actions">
                <button type="button" class="btn btn-primary btn-compact" data-sug-start>Start it</button>
                <button type="button" class="btn btn-compact" data-sug-edit>Customize it</button>
                <a class="btn btn-compact" href="programs.html#all-plans">Pick a plan</a>
            </div>
            ${clash.length ? `<a class="text-link" href="${info.href}">Do ${escapeHtml(info.title)} anyway</a>` : ""}` : "";
        const nextTargets = info && !info.weekDone ? info.items.slice(0, 3).map((x) => {
            const t = isCardio(x.name) ? null : nextTarget(x.name, x.d, unit);
            return { name: x.name, text: t && t.weight > 0 ? `${trimNum(t.weight)} ${unit}${t.each ? " each" : ""} × ${t.reps || parseDose(x.d).high}` : x.d };
        }) : [];
        box.innerHTML = `
            <div class="dash-hello">
                <p class="kicker">${prof.name ? `Hey ${escapeHtml(prof.name)}` : "Your dashboard"}</p>
                <h2>${weekDaysDone ? `${weekDaysDone} workout day${weekDaysDone === 1 ? "" : "s"} this week. Keep it going.` : sessions.length ? "New week. Let's get the first one in." : "Your progress starts with one workout."}</h2>
                <p class="dash-meta"><span class="level-tag level-${lvl.toLowerCase()}">${lvl}</span>${prof.bodyweight ? ` · ${escapeHtml(prof.bodyweight)} ${unit}` : ""}${streak >= 2 ? ` · ${streak}-week streak` : ""}${!prof.name ? ` · <a href="#setup">Add your name</a>` : ""}</p>
            </div>
            <div class="dash-grid">
                <article class="dash-card dash-next">
                    <h3>Up next</h3>
                    ${sugCard || (info ? `${restNote}<p class="dash-big">${escapeHtml(info.weekDone ? "Week done" : info.title)}</p>
                        <p class="dash-sub">${escapeHtml(info.name)}${info.weekDone ? " · next week's plan is ready" : ` · ${info.items.length} exercise${info.items.length === 1 ? "" : "s"}`}</p>
                        ${nextTargets.length ? `<ul class="dash-targets">${nextTargets.map((t) => `<li>${equipIcon(t.name)}<span>${escapeHtml(t.name)}</span><strong>${escapeHtml(t.text)}</strong></li>`).join("")}</ul>` : ""}
                        <a class="btn btn-primary btn-compact" href="${info.href}">${info.weekDone ? "See my plan" : planPaused() || info.started ? "Continue my workout" : "Start this workout"}</a>${planPaused() ? `<p class="dash-sub">You canceled your last workout. Tap Continue when you're ready.</p>` : ""}`
                    : `<p class="dash-sub">You're not on a plan yet.</p><a class="btn btn-primary btn-compact" href="programs.html">Pick a plan</a> <a class="btn btn-compact" href="programs.html#build">Build my own</a>`)}
                </article>
                <article class="dash-card">
                    <h3>Last workout</h3>
                    ${last ? `<p class="dash-big">${escapeHtml(String(last.title || "Workout").slice(0, 40))}</p>
                        <p class="dash-sub">${escapeHtml(shortDate(parseIso(last.date)))} · ${Number(last.sets) || 0} sets · ${fmt(Number(last.volume) || 0)} ${last.unit === "kg" ? "kg" : "lb"} lifted</p>`
                    : `<p class="dash-sub">Tap <strong>Finish workout</strong> after a session and it shows up here.</p>`}
                    <p class="dash-sub">${sessions.length} workout${sessions.length === 1 ? "" : "s"} finished · ${fmt(sets)} sets logged in all</p>
                    ${sets ? `<a class="text-link" href="me.html#log">See every set you've logged</a>` : ""}
                </article>
                <article class="dash-card">
                    <h3>Your best lifts</h3>
                    ${best.length ? `<ul class="dash-best">${best.map((b) => `<li><span>${escapeHtml(b.n)}</span><strong>${liftNum(b.top, unit)} ${unit}</strong>${roundWeight(b.gain, unit) > 0 ? `<em>+${liftNum(b.gain, unit)} ${unit}</em>` : ""}</li>`).join("")}</ul>
                        <p class="dash-fine">${levelAtLeast("Intermediate") ? "Estimated one-rep max from your logged sets" : "Roughly the most you could lift once, worked out from your logged sets (not something to test)"}, and how much it's gone up since your first log.</p>`
                    : `<p class="dash-sub">Log your sets (weight and reps) and your strongest lifts show up here, with how much they've improved.</p>`}
                </article>
            </div>`;
    }
    ["logchange", "levelchange", "profilechange"].forEach((ev) => window.addEventListener(ev, render));
    render();
}

/* =========================================================
   FEATURE: Finished workouts (My progress)
   Every "Finish workout" is saved as gu-sessions; this lists the recent ones.
   ========================================================= */
function setupSessions() {
    const box = document.getElementById("recent-sessions");
    if (!box) return;
    function render() {
        const raw = store.get("gu-sessions", []);
        const list = (Array.isArray(raw) ? raw : []).filter((x) => x && typeof x.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x.date)).slice(-8).reverse();
        box.innerHTML = list.length ? `
            <h2 class="me-h2 me-h2-gap">Finished workouts</h2>
            <ul class="session-list">${list.map((x) => `<li><span class="session-date">${escapeHtml(shortDate(parseIso(x.date)))}</span>
                <span><strong>${escapeHtml(String(x.title || "Workout").slice(0, 60))}</strong><small>${escapeHtml(String(x.planName || "").slice(0, 40))}</small></span>
                <span class="session-nums">${Number(x.sets) || 0} sets · ${fmt(Number(x.volume) || 0)} ${x.unit === "kg" ? "kg" : "lb"}</span></li>`).join("")}</ul>` : "";
    }
    window.addEventListener("logchange", render);
    render();
}

/* =========================================================
   FEATURE: Your plan bar (every page but Plans)
   A bar along the bottom (above the phone tab bar) with the plan you're
   on and today's workout. Tap to see the exercises; one tap opens the
   full plan to log sets. Custom workouts get an Edit button.
   ========================================================= */
// Load "My workout" into the builder and open it, so it can be changed while it's in use
function addCustomDay() {
    const n = customDaysRaw().length;
    // Start the new day from a suggestion that skips what you trained yesterday (change anything you like)
    const sug = n > 0 ? suggestNextWorkout() : null;
    store.set(BUILDER_KEY, { title: sug ? sug.title : "", goal: (builderClean(store.get(BUILDER_KEY)) || {}).goal || "muscle", addDay: n > 0, items: sug ? toBuilderItems(sug.items) : [] });
    location.assign(`programs.html?add=${Date.now()}#build`);
}
function editCustomWorkout(dayIndex = 0) {
    const mine = loadCustomWorkout();
    if (!mine) { location.assign("programs.html#build"); return; }
    const all = Object.values(mine.plans)[0].days;
    const di = Math.min(Math.max(0, dayIndex), all.length - 1);
    const day = all[di];
    store.set(BUILDER_KEY, { title: day.title === "My workout" ? "" : day.title, goal: (builderClean(store.get(BUILDER_KEY)) || {}).goal || "muscle", editing: true, editDay: di,
        items: day.items.map((it) => {
            const m = String(it.d).match(/^(\d+) × (.+?)( per side)?( at .*)?$/);
            return { n: it.n, sets: m ? Number(m[1]) : 3, amount: m ? m[2] : it.d, rest: it.rest };
        }) });
    location.assign(`programs.html?edit=${Date.now()}#build`);
}
// Where you are in your current plan: today's day and its exercises
function currentPlanInfo() {
    const last = store.get("gu-last-plan");
    if (!last || typeof last !== "object") return null;
    if (last.goal === "custom" && !PROGRAMS.custom) { const c = loadCustomWorkout(); if (c) PROGRAMS.custom = c; }
    const p = PROGRAMS[last.goal];
    const days = Number(last.days);
    if (!p || !p.plans[days]) return null;
    const plan = p.plans[days];
    const week = Math.max(1, weekOf(programStart(last.goal)));
    const done = new Set(store.get(`gu-progress-${last.goal}-${days}-w${week}`, []) || []);
    const swaps = store.get(`gu-swaps-${last.goal}-${days}`, {}) || {};
    const list = weekDays(plan, week);
    let di = list.findIndex((d, i) => !d.items.every((_, xi) => done.has(`${i}-${xi}`)));
    const weekDone = di < 0;
    if (weekDone) di = 0;
    const day = list[di];
    const today = isoDate(new Date());
    // The same sets and reps the plan page shows this week (your goal, time, waves, light week)
    const prof = getProfile(), light = !plan.weeks && isLightWeek(last.goal, days, week);
    const items = dayLineup(last.goal, days, di, day.items, week, swaps).map((x, xi) => ({ name: x.name, d: personalDose(last.goal, x, xi, prof, week, light).text, done: done.has(`${di}-${xi}`) || logFor(x.name).some((e) => e.date === today) }));
    const started = !weekDone && items.some((x) => x.done);
    // A workout from this plan was already finished today
    const finishedToday = (store.get("gu-sessions", []) || []).some((x) => x && x.date === today && x.plan === last.goal);
    return { goal: last.goal, days, week, di, weekDone, started, finishedToday, name: p.name, title: day.title, items, href: `programs.html?today=1#program-${last.goal}-${days}` };
}

// Cancel workout: stop the rest timer, drop half-typed sets, and hide the Your plan bar until you tap Continue.
// Sets you already saved stay saved. Continue (home page, My progress, or Plans with ?today=1) brings it back.
const PAUSE_KEY = "gu-plan-paused";
const planPaused = () => store.get(PAUSE_KEY) === true;
function cancelWorkout() {
    const drafts = store.get("gu-log-draft", {}) || {};
    const typed = Object.values(drafts).some((dr) => dr && Array.isArray(dr.r) && dr.r.some((v) => Number(v) > 0));
    if (typed && !window.confirm("You have sets typed in that aren't saved. Cancel the workout and clear them?")) return;
    store.set(PAUSE_KEY, true);
    store.remove("gu-log-draft");
    window.dispatchEvent(new CustomEvent("reststop"));
    const bar = document.getElementById("planbar");
    if (bar) bar.remove();
    document.body.classList.remove("has-planbar", "planbar-open");
    window.dispatchEvent(new CustomEvent("planpause"));
    showToast("Workout canceled", "Your plan is hidden until you tap Continue on the home page or My progress. Sets you already saved are kept.");
}
function resumePlan() { if (planPaused()) store.remove(PAUSE_KEY); }

/* ---------- What you trained lately, and a smart next workout ----------
   Muscles from the last day or two (finished workouts and logged sets) are grouped into push,
   pull, and legs. The next workout avoids hitting the same ones two days in a row. */
const REGION_OF = { chest: "push", shoulders: "push", triceps: "push", back: "pull", biceps: "pull", quads: "legs", hamstrings: "legs", glutes: "legs", calves: "legs" };
const REGION_WORD = { push: "chest, shoulders, and triceps", pull: "back and biceps", legs: "legs" };
const regionsOf = (names) => new Set(names.filter((n) => typeof EXERCISES === "object" && EXERCISES[n] && !isCardio(n)).map((n) => REGION_OF[builderMuscle(n)]).filter(Boolean));
function sessionExercises(x) {
    if (!x) return [];
    if (Array.isArray(x.names)) return x.names.filter((n) => typeof n === "string");
    // Older saves only know the day number: trust it only if that day still has the same name
    if (x.plan === "custom") { const d = customDaysRaw()[Number(x.day)]; return d && d.title === x.title ? d.items.map((it) => it && it.n).filter(Boolean) : []; }
    const p = PROGRAMS[x.plan], plan = p && p.plans[x.days];
    const d = plan ? weekDays(plan, 1)[Number(x.day)] : null;
    return d ? d.items.map((it) => it.n) : [];
}
// What you trained today and yesterday: { regions, names, title, date } or null
function recentlyTrained() {
    const since = isoDate(addDays(new Date(), -1));
    const sessions = (store.get("gu-sessions", []) || []).filter((x) => x && typeof x.date === "string" && x.date >= since);
    const log = getLog();
    const logged = Object.keys(log).filter((n) => Array.isArray(log[n]) && log[n].some((e) => e && typeof e.date === "string" && e.date >= since));
    const names = [...new Set([...sessions.flatMap(sessionExercises), ...logged])];
    if (!names.length) return null;
    const last = sessions[sessions.length - 1];
    return { regions: regionsOf(names), names, title: last ? String(last.title || "") : "", date: last ? last.date : since };
}
// A workout that skips what you just trained (and moves you asked to skip): { title, items, regions } or null
const NEXT_TEMPLATES = [
    ["Legs & Abs", ["quads", "glutes", "hamstrings", "calves", "abs"], ["legs"]],
    ["Back & Biceps", ["lats", "upper-back", "biceps", "abs"], ["pull"]],
    ["Chest, Shoulders & Triceps", ["chest", "shoulders", "triceps"], ["push"]],
    ["Upper body", ["chest", "lats", "shoulders", "upper-back", "biceps", "triceps"], ["push", "pull"]],
    ["Full body", ["quads", "chest", "lats", "shoulders", "hamstrings", "abs"], ["push", "pull", "legs"]]
];
function suggestNextWorkout() {
    if (typeof MUSCLE_MAP === "undefined" || typeof coachMake !== "function") return null;
    const recent = recentlyTrained();
    const busy = new Set(recent ? recent.regions : []);
    // Building the next day of your own split: it follows your last day, so don't repeat that day's muscles
    const split = customDaysRaw();
    if ((store.get("gu-last-plan") || {}).goal === "custom" && split.length) regionsOf(split[split.length - 1].items.map((it) => it && it.n)).forEach((r) => busy.add(r));
    // Also lean toward what your own split doesn't cover yet
    const covered = regionsOf(customDaysRaw().flatMap((d) => d.items.map((it) => it && it.n)));
    const pick = NEXT_TEMPLATES
        .map(([title, groups, regions], i) => ({ title, groups, regions, clash: regions.filter((r) => busy.has(r)).length, fresh: regions.filter((r) => !covered.has(r)).length, i }))
        .sort((a, b) => a.clash - b.clash || b.fresh - a.fresh || a.i - b.i)[0];
    if (!pick) return null;
    const p = getProfile();
    const req = { groups: pick.groups, parts: [], exclude: [], title: [pick.title], intensity: null,
        kit: p.place === "home" ? "none" : p.place === "homedb" ? "db" : null,
        minutes: Number(p.minutes) || null, goal: p.goal === "strength" ? "strength" : p.goal === "muscle" ? "muscle" : null };
    let w;
    try { w = coachMake(req, getLevel()); } catch (e) { return null; }
    const items = (w.items || []).filter((x) => !avoidedBy(x.n, p.avoid)).slice(0, 7);
    if (!items.length) return null;
    return { title: pick.title, items, regions: pick.regions, clash: pick.clash, recent };
}
// Builder rows from saved items ("3 × 8–12 at 135 lb")
const toBuilderItems = (items) => items.map((it) => {
    const m = String(it.d).match(/^(\d+) × (.+?)( per side)?( at .*)?$/);
    return { n: it.n, sets: m ? Number(m[1]) : 3, amount: m ? m[2] : it.d, rest: it.rest };
});
// Start the suggestion as the next day of My workout (or as My workout if you don't have one)
function startSuggested(sug) {
    if (!sug) return;
    const days = customDaysRaw();
    const oldN = days.length;
    const week = Math.max(1, weekOf(programStart("custom")));
    const done = store.get(`gu-progress-custom-${oldN}-w${week}`, []) || [];
    const onCustom = (store.get("gu-last-plan") || {}).goal === "custom";
    const list = onCustom && oldN && oldN < 7 ? days.concat([{ title: sug.title, items: sug.items }]) : [{ title: sug.title, items: sug.items }];
    if (list.length !== oldN || !onCustom) store.remove(`gu-progress-custom-${oldN}-w${week}`);
    store.set(`gu-progress-custom-${list.length}-w${week}`, onCustom ? done : []);
    if (!onCustom) clearCustomSwaps();
    saveCustomDays(list);
    store.set("gu-last-plan", { goal: "custom", days: list.length });
    resumePlan();
    location.assign(`programs.html?today=1#program-custom-${list.length}`);
}
// Open the suggestion in the builder to change it first
function customizeSuggested(sug) {
    if (!sug) return;
    const onCustom = (store.get("gu-last-plan") || {}).goal === "custom";
    store.set(BUILDER_KEY, { title: sug.title, goal: (builderClean(store.get(BUILDER_KEY)) || {}).goal || "muscle", addDay: onCustom && customDaysRaw().length > 0, items: toBuilderItems(sug.items) });
    location.assign(`programs.html?add=${Date.now()}#build`);
}

/* =========================================================
   FEATURE: Share a workout with a friend
   A day (or all of Your plan) goes into a link: programs.html#share=<code>. The code is the
   workout itself (exercise names, sets and reps, rest; never weights, logs, or settings), so
   nothing goes through a server. When a friend opens it, the workout slots in as the day
   they're on: if they're on Day 3, it becomes their Day 3 and the rest move down one.
   ========================================================= */
const SHARE_HASH = "#share=";
function shareEncode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function shareDecode(code) {
    try {
        const s = String(code).replace(/-/g, "+").replace(/_/g, "/");
        const bin = atob(s + "===".slice((s.length + 3) % 4));
        return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    } catch (e) { return null; }
}
// Only exercises from the library, sane sets and reps, short plain text
function shareClean(p) {
    if (!p || p.v !== 1 || !Array.isArray(p.days) || typeof EXERCISES !== "object") return null;
    const txt = (v, max) => String(v == null ? "" : v).replace(/[<>]/g, "").slice(0, max).trim();
    const days = p.days.slice(0, 7).map((d) => ({
        title: txt(d && d.t, 60) || "Shared workout",
        items: (Array.isArray(d && d.i) ? d.i : []).filter((x) => Array.isArray(x) && typeof x[0] === "string" && EXERCISES[x[0]]).slice(0, 12)
            .map((x) => ({ n: x[0], d: /^\d{1,2} × [0-9A-Za-z–+. -]{1,30}$/.test(String(x[1])) ? String(x[1]) : "3 × 8–12", rest: txt(x[2], 20) }))
    })).filter((d) => d.items.length);
    if (!days.length) return null;
    const from = typeof p.from === "string" && /^[\p{L}' .-]{1,30}$/u.test(p.from.trim()) ? p.from.trim() : "";
    return { days, from };
}
// The link for some days of Your plan (weights are left out: the friend gets their own)
function shareLink(dayIndexes, withName = true) {
    const days = customDaysRaw();
    const pick = dayIndexes.map((i) => days[i]).filter(Boolean).map((d) => ({
        t: String(d.title || "Workout").slice(0, 60),
        i: d.items.filter((x) => x && EXERCISES[x.n]).slice(0, 12).map((x) => [x.n, String(x.d || "").replace(/\s+at\s+.*$/, "").slice(0, 40), String(x.rest || "").slice(0, 20)])
    }));
    const name = getProfile().name;
    const payload = { v: 1, days: pick, ...(withName && name ? { from: name } : {}) };
    return `${location.origin}${location.pathname.replace(/[^/]*$/, "")}programs.html${SHARE_HASH}${shareEncode(payload)}`;
}
// Put shared days into Your plan at position "pos" (the days after it move down), or replace it
function addSharedDays(newDays, pos, replace = false) {
    const days = customDaysRaw();
    const onCustom = (store.get("gu-last-plan") || {}).goal === "custom";
    const week = Math.max(1, weekOf(programStart("custom")));
    const oldKey = `gu-progress-custom-${days.length}-w${week}`;
    const done = onCustom && !replace ? store.get(oldKey, []) || [] : [];
    const k = newDays.length;
    const list = replace ? newDays.slice(0, 7) : days.slice(0, pos).concat(newDays, days.slice(pos)).slice(0, 7);
    // Check-offs stay with their day: days after the new ones move down by k
    const moved = done.map((key) => { const [di, xi] = String(key).split("-").map(Number); return di >= pos ? `${di + k}-${xi}` : `${di}-${xi}`; })
        .filter((key) => Number(key.split("-")[0]) < list.length);
    store.remove(oldKey);
    store.set(`gu-progress-custom-${list.length}-w${week}`, moved);
    clearCustomSwaps();
    saveCustomDays(list);
    store.set("gu-last-plan", { goal: "custom", days: list.length });
    resumePlan();
    return list.length;
}

function setupShareWorkout() {
    // Sending: a Share button on each day of Your plan
    document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-share-day]");
        if (b) { openSend(Number(b.dataset.shareDay)); return; }
        if (e.target.closest("[data-share-paste]")) pasteFromClipboard(document.querySelector(".share-inbox .share-status"));
        if (e.target.closest("[data-share-paste-go]")) {
            const box = document.getElementById("share-inbox-input");
            const st = document.querySelector(".share-inbox .share-status");
            const m = String(box ? box.value : "").match(/#share=([A-Za-z0-9_-]+)/);
            if (!m) { if (st) st.textContent = "That doesn't look like a Ground Up workout link."; return; }
            if (!activateShared(m[1]) && st) st.textContent = "That link didn't work. It may have been cut off. Ask your friend to send it again.";
        }
    });
    const dialog = (id, label) => {
        let dlg = document.getElementById(id);
        if (!dlg) {
            document.body.insertAdjacentHTML("beforeend", `<dialog id="${id}" class="finish-dialog share-dialog" aria-labelledby="${id}-title"><div class="finish-inner"></div></dialog>`);
            dlg = document.getElementById(id);
            dlg.addEventListener("click", (ev) => { if (ev.target === dlg || ev.target.closest("[data-share-close]")) shut(dlg); });
        }
        return dlg;
    };
    const show = (dlg) => { if (typeof dlg.showModal === "function") { try { dlg.showModal(); } catch (e) { dlg.setAttribute("open", ""); } } else dlg.setAttribute("open", ""); };
    const shut = (dlg) => { if (dlg.open && typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); };
    const listHtml = (d) => `<ul class="share-list">${d.items.map((x) => `<li>${equipIcon(x.n)}<span>${escapeHtml(x.n)}</span><strong>${escapeHtml(String(x.d).replace(/\s+at\s+.*$/, ""))}</strong></li>`).join("")}</ul>`;

    function openSend(di) {
        const days = customDaysRaw();
        if (!days[di]) return;
        const name = getProfile().name;
        const dlg = dialog("share-send");
        dlg.querySelector(".finish-inner").innerHTML = `
            <p class="finish-kicker">Share a workout</p>
            <h2 id="share-send-title">${escapeHtml(days[di].title || `Day ${di + 1}`)}</h2>
            <p>Your friend gets the exercises, sets, reps, and rest. Not your weights or logs: their app works out weights for them.</p>
            ${days.length > 1 ? `<fieldset class="segmented compact share-what"><legend>What to send</legend>
                <label><input type="radio" name="share-what" value="day" checked><span>Day ${di + 1} only</span></label>
                <label><input type="radio" name="share-what" value="all"><span>All ${days.length} days</span></label></fieldset>` : ""}
            ${name ? `<label class="share-name"><input type="checkbox" name="share-name" checked> Say it's from ${escapeHtml(name)}</label>` : ""}
            <div class="finish-actions">
                <button type="button" class="btn btn-primary" data-share-go>Send it</button>
                <button type="button" class="btn" data-share-close>Cancel</button>
            </div>
            <p class="share-status" role="status"></p>`;
        dlg.querySelector("[data-share-go]").addEventListener("click", () => {
            const all = (dlg.querySelector('input[name="share-what"]:checked') || {}).value === "all";
            const withName = Boolean((dlg.querySelector('input[name="share-name"]') || {}).checked);
            const url = shareLink(all ? days.map((_, i) => i) : [di], withName);
            const title = all ? `${days.length}-day plan` : days[di].title || "Workout";
            const status = dlg.querySelector(".share-status");
            const text = `${withName && name ? `${name} sent you` : "Here's"} a workout on Ground Up Fitness: ${title}`;
            if (navigator.share) {
                navigator.share({ title: `Workout: ${title}`, text, url }).then(() => shut(dlg)).catch(() => {});
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => { status.textContent = "Link copied. Paste it in a message to your friend."; })
                    .catch(() => { status.innerHTML = `Copy this link: <input class="share-url" readonly value="${escapeHtml(url)}" aria-label="Share link">`; });
            } else {
                status.innerHTML = `Copy this link: <input class="share-url" readonly value="${escapeHtml(url)}" aria-label="Share link">`;
            }
        });
        show(dlg);
    }

    // Receiving: where it goes depends on where the friend is in their week
    function openReceive(code) {
        const shared = shareClean(shareDecode(code));
        const dlg = dialog("share-get");
        const inner = dlg.querySelector(".finish-inner");
        if (!shared) {
            inner.innerHTML = `<h2 id="share-get-title">That link didn't work</h2><p>It may have been cut off when it was copied. Ask your friend to send it again.</p>
                <div class="finish-actions"><button type="button" class="btn" data-share-close>OK</button></div>`;
            show(dlg);
            return;
        }
        const k = shared.days.length;
        const inSafari = IS_IOS && !((window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true);
        const info = typeof currentPlanInfo === "function" ? currentPlanInfo() : null;
        const mine = customDaysRaw();
        const onCustom = info && info.goal === "custom";
        const pos = onCustom ? (info.weekDone ? mine.length : info.di) : mine.length;
        const fits = mine.length + k <= 7;
        const range = (a) => (k > 1 ? `Days ${a + 1}–${a + k}` : `Day ${a + 1}`);
        const options = [];
        if (onCustom && fits) options.push(["insert", `Make it my ${range(pos)}`, pos < mine.length ? `You're on Day ${pos + 1}, so this is your next workout. Your Day ${pos + 1}${mine.length - pos > 1 ? " and the days after it" : ""} move${mine.length - pos > 1 ? "" : "s"} down one${k > 1 ? ` by ${k}` : ""}.` : "It goes right after the days you've done."]);
        if (onCustom && fits && pos !== mine.length) options.push(["end", `Add it after my last day (${range(mine.length)})`, ""]);
        if (!onCustom && mine.length && fits) options.push(["end", `Add it to Your plan as ${range(mine.length)}`, ""]);
        options.push(["replace", onCustom || mine.length ? `Replace my plan with ${k > 1 ? "these days" : "it"}` : "Start it as my plan", info && !onCustom ? `You're on ${info.name}. It stays saved: switch back on Plans any time.` : ""]);
        inner.innerHTML = `
            <p class="finish-kicker">${shared.from ? `${escapeHtml(shared.from)} sent you a workout` : "A workout for you"}</p>
            <h2 id="share-get-title">${escapeHtml(k > 1 ? `${k}-day plan` : shared.days[0].title)}</h2>
            ${shared.days.map((d, i) => `${k > 1 ? `<h3 class="share-day">Day ${i + 1}: ${escapeHtml(d.title)}</h3>` : ""}${listHtml(d)}`).join("")}
            <p class="finish-tip">Weights aren't shared. You'll get your own, from your logs or your starting point.</p>
            ${inSafari ? `<div class="share-app">
                <p><strong>Use the Ground Up app on your Home Screen?</strong> iPhone opens links in Safari, not in Home Screen apps, so bring it over in 3 taps:</p>
                <ol class="share-steps"><li>Tap <strong>Copy for the app</strong></li><li>Open Ground Up from your Home Screen</li><li>Go to <strong>Plans</strong> and tap <strong>Paste workout</strong></li></ol>
                <button type="button" class="btn btn-primary" data-share-copy>Copy for the app</button>
                <p class="share-status" role="status"></p>
                <p class="share-note">Not using the app? Add it here in Safari instead:</p></div>` : ""}
            <div class="share-options">${options.map(([v, label, note], i) => `<button type="button" class="btn${i === 0 && !inSafari ? " btn-primary" : ""}" data-share-add="${v}">${escapeHtml(label)}</button>${note ? `<p class="share-note">${escapeHtml(note)}</p>` : ""}`).join("")}
                <button type="button" class="btn" data-share-close>Not now</button></div>
`;
        inner.querySelectorAll("[data-share-add]").forEach((b) => b.addEventListener("click", () => {
            const how = b.dataset.shareAdd;
            const n = addSharedDays(shared.days, how === "insert" ? pos : mine.length, how === "replace");
            store.set("gu-share-added", { text: `${shared.from ? `${shared.from}'s ` : ""}${k > 1 ? `${k}-day plan` : shared.days[0].title} is in Your plan.`.slice(0, 160) });
            shut(dlg);
            location.assign(`programs.html?today=1&added=${Date.now()}#program-custom-${n}`);
        }));
        const copy = inner.querySelector("[data-share-copy]");
        if (copy) copy.addEventListener("click", () => {
            const url = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}programs.html${SHARE_HASH}${code}`;
            const st = inner.querySelector(".share-app .share-status");
            const done = () => { copy.textContent = "Copied \u2713"; if (st) st.textContent = "Now open Ground Up from your Home Screen."; };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done).catch(() => { if (st) st.innerHTML = `Copy this link: <input class="share-url" readonly value="${escapeHtml(url)}" aria-label="Share link">`; });
        });
        show(dlg);
    }
    // Pasted workouts become your active workout right away: they go in as the day you're on in
    // Your plan (on Day 3? it's your Day 3 and the rest move down one), and Plans opens on it.
    function activateShared(code) {
        const shared = shareClean(shareDecode(code));
        if (!shared) return false;
        const mine = customDaysRaw();
        const k = shared.days.length;
        // The first day of Your plan you haven't finished this week
        const week = Math.max(1, weekOf(programStart("custom")));
        const done = new Set(store.get(`gu-progress-custom-${mine.length}-w${week}`, []) || []);
        let pos = mine.findIndex((d, di) => !d.items.every((_, xi) => done.has(`${di}-${xi}`)));
        if (pos < 0) pos = mine.length;
        const replace = mine.length + k > 7;
        const n = addSharedDays(shared.days, replace ? 0 : pos, replace);
        const title = k > 1 ? `${k}-day plan` : shared.days[0].title;
        store.set("gu-share-added", { text: `${shared.from ? `${shared.from}'s ` : ""}${title} is ${k > 1 ? "in Your plan" : `your workout now (Day ${(replace ? 0 : pos) + 1})`}.`.slice(0, 160) });
        location.assign(`programs.html?today=1&added=${Date.now()}#program-custom-${n}`);
        return true;
    }
    // One tap: read the copied link (the phone asks to allow the paste); if that's not possible, use the box
    function pasteFromClipboard(status) {
        const say = (t) => { if (status) status.textContent = t; };
        if (!(navigator.clipboard && navigator.clipboard.readText)) { say("Paste the link in the box below."); return; }
        navigator.clipboard.readText().then((t) => {
            const m = String(t || "").match(/#share=([A-Za-z0-9_-]+)/);
            if (!m) { say("No workout link copied yet. Copy the link your friend sent, then tap Paste workout again (or paste it in the box)."); return; }
            if (!activateShared(m[1])) say("That link didn't work. It may have been cut off. Ask your friend to send it again.");
        }).catch(() => say("Paste the link in the box below."));
    }
    // A shared link opens the workout (and the code is taken out of the address bar)
    addRoute(/^#share=([A-Za-z0-9_-]{8,8000})$/, (m) => {
        setTimeout(() => openReceive(m[1]), 0);
        try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* ignore */ }
        return { target: document.getElementById("main") };
    });
    // Plans page: Workouts from friends. Copy the link a friend sent, tap Paste workout, and it's your workout.
    const cta = document.getElementById("build-cta");
    if (cta && !document.querySelector(".share-inbox")) cta.insertAdjacentHTML("afterend", `
        <section class="share-inbox" aria-labelledby="share-inbox-title">
            <h3 id="share-inbox-title">Workouts from friends</h3>
            <p>Copy the link a friend sent you, then tap <strong>Paste workout</strong>. It becomes your workout for today, as the day you're on.</p>
            <button type="button" class="btn btn-primary btn-compact" data-share-paste>Paste workout</button>
            <details class="share-inbox-more"><summary>Or paste it here</summary>
                <div class="field"><label for="share-inbox-input">Workout link</label>
                <input id="share-inbox-input" type="url" inputmode="url" autocomplete="off" placeholder="https://.../programs.html#share=..."></div>
                <button type="button" class="btn btn-compact" data-share-paste-go>Make it my workout</button></details>
            <p class="share-status" role="status"></p>
        </section>`);
    const added = store.get("gu-share-added");
    if (added && typeof added.text === "string") {
        store.remove("gu-share-added");
        setTimeout(() => showToast("Workout added", added.text), 400);
    }
}

function setupPlanBar() {
    if (["programs", "me"].includes(document.body.dataset.page) || !document.getElementById("site-footer") && !document.querySelector(".site-footer")) return;
    if (planPaused()) return;
    const info = currentPlanInfo();
    if (!info) return;
    const custom = info.goal === "custom";
    const doneCount = info.items.filter((x) => x.done).length;
    const open = store.get("gu-planbar-open") === true;
    document.body.insertAdjacentHTML("beforeend", `
<section class="planbar${open ? " is-open" : ""}" id="planbar" aria-label="Your plan">
    <div class="planbar-head">
        <button type="button" class="planbar-toggle" aria-expanded="${open}" aria-controls="planbar-list">
            <span class="planbar-kicker">${info.finishedToday && !info.weekDone ? "Done today \u2713 · Next time" : `<span class="live-dot" aria-hidden="true"></span>Your plan${custom ? "" : ` · Week ${info.week}`}`}</span>
            <strong>${info.weekDone ? "Week done. Nice work" : `${escapeHtml(custom ? info.title : `Day ${info.di + 1}: ${info.title}`)}`}</strong>
            <span class="planbar-sub">${escapeHtml(info.name)} · ${doneCount} of ${info.items.length} done</span>
        </button>
        <a class="btn btn-primary btn-compact planbar-go" href="${info.href}">${doneCount ? "Continue" : "Start"}</a>
    </div>
    <div class="planbar-body" id="planbar-list"${open ? "" : " hidden"}>
        <ol class="planbar-list">${info.items.map((x) => `<li class="${x.done ? "is-done" : ""}">${equipIcon(x.name)}<span><strong>${escapeHtml(x.name)}</strong> <small>${escapeHtml(x.d)}${x.done ? " · done" : ""}</small></span><button type="button" class="chip" data-howto="${escapeHtml(x.name)}">How to</button></li>`).join("")}</ol>
        <div class="planbar-actions">
            <a class="btn btn-compact" href="${info.href}">Open full plan</a>
            ${custom ? `<button type="button" class="btn btn-compact" data-edit-custom>Edit this workout</button>` : ""}
            <button type="button" class="text-button planbar-cancel" data-cancel-workout>Cancel workout</button>
        </div>
    </div>
</section>`);
    document.body.classList.add("has-planbar");
    const bar = document.getElementById("planbar");
    const toggle = bar.querySelector(".planbar-toggle"), body = bar.querySelector(".planbar-body");
    toggle.addEventListener("click", () => {
        const now = body.hidden;
        body.hidden = !now;
        bar.classList.toggle("is-open", now);
        toggle.setAttribute("aria-expanded", String(now));
        store.set("gu-planbar-open", now);
        document.body.classList.toggle("planbar-open", now);
    });
    document.body.classList.toggle("planbar-open", open);
    bar.addEventListener("click", (e) => { if (e.target.closest("[data-edit-custom]")) editCustomWorkout(info.di); });
}
document.addEventListener("click", (e) => { if (e.target.closest("[data-cancel-workout]")) cancelWorkout(); });

/* ---------- Which heads and parts each exercise works ----------
   Every exercise in the library maps to the Muscle map's heads (upper/middle/lower chest,
   front/side/rear delt, the 3 triceps heads, ...). "main" is what it works most; "also" helps.
   The Muscle map's own lists count as main too. Used by the builder's muscle check. */
// [pattern, main heads, also works] — first match wins, so specific moves come before general ones
const HEAD_RULES = [
    [/stretch|mobility/i, [], []],
    [/seated calf/i, ["soleus"], ["calf-inner", "calf-outer"]],
    [/calf/i, ["calf-inner", "calf-outer"], ["soleus"]],
    [/glute kickback|cable kickback|abduct|side-lying|clamshell|lateral band|monster walk/i, ["glute-med", "glute-max"], []],
    [/adduct|copenhagen/i, ["adductors"], []],
    [/rear delt|reverse fly|reverse pec|face pull/i, ["delt-rear"], ["rhomboids", "traps-middle"]],
    [/hammer curl|reverse curl/i, ["brachialis"], ["biceps-long", "forearm-extensors"]],
    [/incline (dumbbell )?curl|drag curl/i, ["biceps-long"], ["biceps-short"]],
    [/preacher|concentration|spider/i, ["biceps-short"], ["biceps-long", "brachialis"]],
    [/wrist curl|grip trainer|hand grip/i, ["forearm-flexors"], []],
    [/(hamstring|leg) curl|nordic/i, ["hams-outer", "hams-inner"], ["calf-inner"]],
    [/curl/i, ["biceps-long", "biceps-short"], ["brachialis"]],
    [/overhead (triceps|tricep)|skull|french press|lying triceps/i, ["triceps-long"], ["triceps-medial"]],
    [/pushdown|kickback|triceps extension|tricep/i, ["triceps-lateral", "triceps-medial"], ["triceps-long"]],
    [/close-grip (bench|press)|diamond/i, ["triceps-lateral", "triceps-medial"], ["chest-middle"]],
    [/dip/i, ["chest-lower", "triceps-lateral"], ["triceps-medial", "delt-front"]],
    [/pike push-up|overhead press|shoulder press|military|arnold|push press/i, ["delt-front"], ["delt-side", "triceps-medial", "traps-upper"]],
    [/lateral raise|lean-away/i, ["delt-side"], ["traps-upper"]],
    [/front raise/i, ["delt-front"], ["chest-upper"]],
    [/upright row/i, ["delt-side", "traps-upper"], ["biceps-long"]],
    [/shrug/i, ["traps-upper"], ["forearm-flexors"]],
    [/incline|low-to-high/i, ["chest-upper"], ["delt-front", "triceps-lateral"]],
    [/decline|high-to-low/i, ["chest-lower"], ["triceps-lateral"]],
    [/pec deck|fly|crossover/i, ["chest-middle"], ["chest-upper", "chest-lower"]],
    [/bench press|chest press|push-up|floor press/i, ["chest-middle"], ["delt-front", "triceps-lateral", "chest-upper"]],
    [/pullover/i, ["lats"], ["chest-lower", "triceps-long"]],
    [/pulldown|pull-up|chin-up/i, ["lats"], ["biceps-long", "biceps-short", "rhomboids", "traps-lower"]],
    [/high row/i, ["lats", "traps-lower"], ["rhomboids", "delt-rear"]],
    [/row/i, ["rhomboids", "traps-middle", "lats"], ["delt-rear", "biceps-long", "biceps-short"]],
    [/back extension|reverse hyper|superman|good morning/i, ["erectors"], ["glute-max", "hams-inner"]],
    [/romanian|stiff|single-leg deadlift|pull-through/i, ["hams-outer", "hams-inner", "glute-max"], ["erectors", "adductors"]],
    [/suitcase deadlift/i, ["glute-max", "quad-middle"], ["obliques", "erectors", "forearm-flexors"]],
    [/deadlift/i, ["glute-max", "hams-inner", "erectors"], ["quad-middle", "traps-upper", "forearm-flexors", "lats"]],
    [/hip thrust|bridge/i, ["glute-max"], ["hams-outer", "hams-inner"]],
    [/leg extension/i, ["quad-middle", "quad-outer", "quad-inner"], []],
    [/lunge|split squat|step-up|bulgarian/i, ["quad-middle", "glute-max"], ["quad-inner", "glute-med", "adductors", "hams-inner"]],
    [/front squat|hack squat|pendulum|v-squat|sissy/i, ["quad-outer", "quad-middle", "quad-inner"], ["glute-max", "adductors"]],
    [/squat|leg press|wall sit|sled/i, ["quad-outer", "quad-middle", "quad-inner", "glute-max"], ["adductors", "hams-inner", "erectors"]],
    [/suitcase carry/i, ["obliques", "forearm-flexors"], ["abs-upper", "traps-upper"]],
    [/farmer|carry/i, ["forearm-flexors", "traps-upper"], ["obliques", "abs-upper"]],
    [/side plank|pallof|woodchop|wood chop|russian|oblique/i, ["obliques"], ["abs-upper", "abs-lower"]],
    [/leg raise|knee raise|reverse crunch|dead bug|flutter|hollow|mountain/i, ["abs-lower"], ["abs-upper", "obliques"]],
    [/plank|bird dog/i, ["abs-upper", "abs-lower"], ["obliques", "erectors"]],
    [/crunch|sit-up|rollout|ab wheel/i, ["abs-upper"], ["abs-lower"]]
];
// The one muscle an exercise is mostly for (its first main head's muscle)
function primaryGroup(name) {
    const h = exerciseHeads(name).main.find((id) => typeof mmPart === "function" && mmPart(id));
    return h ? mmPart(h).g.id : null;
}
function exerciseHeads(name) {
    if (typeof EXERCISES !== "object" || !EXERCISES[name] || isCardio(name)) return { main: [], also: [] };
    const rule = HEAD_RULES.find(([re]) => re.test(name));
    const main = new Set(rule ? rule[1] : []), also = new Set(rule ? rule[2] : []);
    if (typeof MUSCLE_MAP !== "undefined") MUSCLE_MAP.forEach((g) => g.parts.forEach((pt) => { if (pt.ex.includes(name)) main.add(pt.id); }));
    main.forEach((h) => also.delete(h));
    return { main: [...main], also: [...also] };
}

/* =========================================================
   FEATURE: Build your own workout (Plans page)
   Pick any exercises from the library; each gets sets, reps, and rest
   (changeable) and a weight to use: from your logged sets if you have
   them (and it goes up when you hit your reps), or from your level and
   bodyweight the first time. Saved as "My workout" (gu-custom), with a
   draft kept as gu-builder while you work.
   ========================================================= */
const BUILDER_KEY = "gu-builder";
const BUILDER_REPS = ["3–5", "4–6", "5", "6–8", "8–10", "8–12", "10–12", "10–15", "12–15", "15–20"];
const BUILDER_HOLDS = ["20–30 s", "30–45 s", "45–60 s"];
const BUILDER_TIMES = ["10 min", "15 min", "20 min", "30 min", "45 min"];
const BUILDER_STEPS = ["30 steps", "40 steps", "60 steps"];
const BUILDER_RESTS = ["30 s", "45 s", "60 s", "90 s", "2 min", "3 min"];
function builderKind(name) {
    if (isCardio(name)) return "time";
    const def = coachDose(name, COACH_COMPOUND.test(name), getLevel())[0];
    if (/steps/.test(def)) return "steps";
    if (/\bs$|\bs per side$/.test(def)) return "hold";
    return "reps";
}
/* What the session is for, and how much work each muscle needs in one workout.
   Evidence: muscle growth levels off around 6 to 11 hard sets per muscle in one session
   (Remmert, Zourdos et al. 2025 meta-regression), strength gains level off after a few
   heavy sets of a lift, and general fitness needs about 1 exercise per major muscle
   (ACSM 2009 position stand). So: a few exercises per muscle, fewer when you train many. */
const BUILD_GOALS = {
    muscle: { label: "Build muscle", for: "building muscle", dose: "muscle", per: [4, 3], total: 10, sets: 12, why: "3 or 4 exercises per muscle (about 9 to 12 hard sets) in one workout; past that, extra work mostly adds fatigue" },
    strength: { label: "Get stronger", for: "getting stronger", dose: "strength", per: [3, 2], total: 8, sets: 10, why: "heavy sets of 3 to 6 reps with long rests on a main lift, plus 1 or 2 helpers per muscle" },
    fit: { label: "Lose fat / get fit", for: "fat loss and fitness", dose: null, per: [3, 2], total: 10, sets: 10, why: "2 or 3 exercises per muscle, so you can train every muscle without spending all day" },
    endurance: { label: "Endurance (high reps)", for: "endurance", dose: "endurance", per: [3, 2], total: 10, sets: 10, why: "2 or 3 exercises per muscle with light weights and short rests" }
};
const BUILD_LARGE = ["chest", "back", "quads", "hamstrings", "glutes"];
const BUILD_MUSCLE_NAME = { chest: "Chest", back: "Back", shoulders: "Shoulders", biceps: "Biceps", triceps: "Triceps", quads: "Quads", hamstrings: "Hamstrings", glutes: "Glutes", calves: "Calves", core: "Core", cardio: "Cardio" };
// The main muscle an exercise trains, from its guide ("Lats, upper back, biceps" -> back)
function builderMuscle(name) {
    const m = String((EXERCISES[name] || {}).m || "").toLowerCase().split(",")[0].trim();
    if (/heart/.test(m)) return "cardio";
    if (/chest/.test(m)) return "chest";
    if (/lat|back|trap|rhomboid/.test(m)) return "back";
    if (/shoulder|delt|rotator/.test(m)) return "shoulders";
    if (/biceps|forearm|grip/.test(m)) return "biceps";
    if (/triceps/.test(m)) return "triceps";
    if (/quad|adductor|inner thigh|legs/.test(m)) return "quads";
    if (/hamstring/.test(m)) return "hamstrings";
    if (/glute|hip/.test(m)) return "glutes";
    if (/calf|calves/.test(m)) return "calves";
    return "core";
}
// How many exercises fit for one muscle, given the goal and how many muscles are in the workout
function builderLimit(goalKey, muscle, musclesTrained) {
    const g = BUILD_GOALS[goalKey] || BUILD_GOALS.muscle;
    if (muscle === "cardio") return 2;
    let max = BUILD_LARGE.includes(muscle) ? g.per[0] : g.per[1];
    // A full-body day (5 or more muscles) gets one fewer per muscle so it stays doable, but never fewer than 2
    if (musclesTrained >= 5) max -= 1;
    return Math.max(2, max);
}
// One exercise as the builder keeps it: { n, sets, amount, rest }
function builderDefault(name, goalKey = "muscle") {
    const [d, rest] = coachDose(name, COACH_COMPOUND.test(name), getLevel(), (BUILD_GOALS[goalKey] || {}).dose || null);
    const kind = builderKind(name);
    if (kind === "time") return { n: name, sets: 1, amount: "15 min", rest: "" };
    const m = d.match(/^(\d+) × (.+?)( per side)?$/);
    const amount = m ? m[2] : "8–12";
    return { n: name, sets: m ? Number(m[1]) : 3, amount: kind === "hold" ? (BUILDER_HOLDS.includes(amount) ? amount : "30–45 s") : kind === "steps" ? (BUILDER_STEPS.includes(amount) ? amount : "40 steps") : (BUILDER_REPS.includes(amount) ? amount : "8–12"), rest: BUILDER_RESTS.includes(rest) ? rest : "60 s" };
}
function builderDose(x) {
    const kind = builderKind(x.n);
    if (kind === "time") return x.amount;
    const perSide = /per side/.test(coachDose(x.n, COACH_COMPOUND.test(x.n), getLevel())[0]);
    return `${x.sets} × ${x.amount}${perSide ? " per side" : ""}`;
}
// Only real exercises and allowed values get back in from storage
function builderClean(raw) {
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.items)) return null;
    const items = raw.items.filter((x) => x && EXERCISES[x.n]).slice(0, 12).map((x) => {
        const base = builderDefault(x.n, BUILD_GOALS[raw.goal] ? raw.goal : "muscle"), kind = builderKind(x.n);
        const list = kind === "time" ? BUILDER_TIMES : kind === "hold" ? BUILDER_HOLDS : kind === "steps" ? BUILDER_STEPS : BUILDER_REPS;
        return { n: x.n, sets: Number(x.sets) >= 1 && Number(x.sets) <= 6 ? Number(x.sets) : base.sets, amount: list.includes(x.amount) ? x.amount : base.amount, rest: BUILDER_RESTS.includes(x.rest) ? x.rest : base.rest };
    });
    const editDay = Number.isInteger(raw.editDay) && raw.editDay >= 0 && raw.editDay < 7 ? raw.editDay : 0;
    return { title: String(raw.title || "").replace(/[<>]/g, "").slice(0, 40), goal: BUILD_GOALS[raw.goal] ? raw.goal : "muscle", editing: raw.editing === true, editDay, addDay: raw.addDay === true && raw.editing !== true, newPlan: raw.newPlan === true && raw.editing !== true, items };
}
// The weight to use, in plain words
function builderWeight(x) {
    const unit = getProfile().unit;
    const d = builderDose(x);
    const kind = builderKind(x.n);
    const name = x.n;
    if (kind === "time") return "Go at a pace where you can talk in short sentences.";
    if (/^Assisted/.test(name)) return `Pick the assistance that lets you do ${x.amount.split("–").pop()} clean reps. Use less assistance as you get stronger.`;
    if (equipOf(name) === "body" && !START_EXTRA[name] && !START_MAX[name]) return kind === "hold" ? "Your bodyweight. Hold good form the whole time." : "Your bodyweight. When every set feels easy, try the harder version in the how-to.";
    if (kind === "steps") {
        const sw = startWeight(name, 10, unit);
        return sw ? `Carry about ${trimNum(sw.w)} ${unit} in each hand.` : "Pick heavy dumbbells you can hold for the whole walk with good posture.";
    }
    const t = nextTarget(name, d, unit);
    if (t && !t.first) return t.text;
    const high = parseDose(d).high || 10;
    const sw = startWeight(name, high, unit);
    if (sw) return `Start with ${sw.bar ? "just the empty bar" : `about ${trimNum(sw.w)} ${unit}${sw.each ? " in each hand" : ""}`}. Log your sets and it goes up when you hit ${high} reps on every set.`;
    if (!Number(getProfile().bodyweight)) return "NEED_BODYWEIGHT";
    return `Pick a weight you could do for about 2 more reps than ${high}. Log it and you'll get a target next time.`;
}

function setupBuilder() {
    const spot = document.querySelector("[data-builder]");
    if (!spot || typeof EXERCISES !== "object") return;
    const names = Object.keys(EXERCISES).sort((a, b) => a.localeCompare(b));
    const groupLabel = { "": "All", chest: "Chest", back: "Back", shoulders: "Shoulders", arms: "Arms", legs: "Legs", core: "Core", cardio: "Cardio" };
    const profGoal = { fatloss: "fit", strength: "strength", muscle: "muscle", health: "fit" }[getProfile().goal];
    let draft = builderClean(store.get(BUILDER_KEY)) || { title: "", goal: profGoal || (getProfile().trainFor === "endurance" ? "endurance" : "muscle"), items: [] };
    // Already have your own plan? What you build next becomes its next day (Day 2, Day 3...) unless you choose a new plan
    if (!draft.editing && !draft.addDay && !draft.newPlan && customDaysRaw().length && customDaysRaw().length < 7 && (store.get("gu-last-plan") || {}).goal === "custom") draft.addDay = true;
    spot.innerHTML = `
        <div class="builder">
            <div class="builder-intro">
                <div>
                    <p class="kicker">Your way</p>
                    <h2 id="builder-title">${draft.editing ? `Edit your workout${customDaysRaw().length > 1 ? ` (Day ${draft.editDay + 1})` : ""}` : draft.addDay ? `Build Day ${customDaysRaw().length + 1}` : "Build your own workout"}</h2>
                    <p class="section-lede">Pick the exercises you want to hit today. Each one gets sets, reps, and rest you can change, plus the weight to use. Log your sets and the weights go up as you get stronger.</p>
                </div>
                <button type="button" class="btn btn-primary builder-open" aria-expanded="false" aria-controls="builder-body">${draft.items.length ? "Edit my workout" : "Start building"}</button>
            </div>
            <div class="builder-body" id="builder-body" hidden>
                <div class="builder-level" data-level-bar data-label="Your level: sets your reps and weights"></div>
                <div class="builder-goal">
                    <fieldset class="segmented builder-goals">
                        <legend>What's this workout for?</legend>
                        ${Object.entries(BUILD_GOALS).map(([k, g]) => `<label><input type="radio" name="builder-goal" value="${k}"${k === (draft.goal || "muscle") ? " checked" : ""}><span>${g.label}</span></label>`).join("")}
                    </fieldset>
                    <p class="builder-goal-why"></p>
                </div>
                <div class="builder-pick">
                    <h3>1. Pick exercises</h3>
                    <div class="field">
                        <label for="builder-search">Search</label>
                        <input id="builder-search" type="search" placeholder="Try press, row, or curl" autocomplete="off">
                    </div>
                    <fieldset class="segmented compact builder-muscles">
                        <legend>Muscle</legend>
                        ${Object.entries(groupLabel).map(([v, l]) => `<label><input type="radio" name="builder-muscle" value="${v}"${v === "" ? " checked" : ""}><span>${l}</span></label>`).join("")}
                    </fieldset>
                    <div class="field builder-kit">
                        <label for="builder-kit">Equipment</label>
                        <select id="builder-kit"><option value="">Any</option><option value="body">None (bodyweight)</option><option value="db">Dumbbells</option><option value="barbell">Barbell</option><option value="machine">Machine</option><option value="cable">Cable</option></select>
                    </div>
                    <p class="builder-count" role="status"></p>
                    <ul class="builder-results"></ul>
                </div>
                <div class="builder-plan">
                    <h3>2. Your workout <span class="builder-n"></span></h3>
                    <div class="builder-quick" hidden>
                        <button type="button" class="btn btn-compact builder-clear-all">Clear all and start blank</button>
                        <button type="button" class="btn btn-compact builder-to-pick">+ Add exercises</button>
                    </div>
                    <div class="field">
                        <label for="builder-name">Name it <span class="field-hint">(optional)</span></label>
                        <input id="builder-name" type="text" maxlength="40" placeholder="e.g. Chest and back day">
                    </div>
                    <ul class="builder-tally" aria-label="Exercises per muscle"></ul>
                    <p class="builder-empty">Nothing here yet. Tap <strong>Add</strong> next to an exercise.</p>
                    <ol class="builder-list"></ol>
                    <details class="builder-cover" hidden${levelAtLeast("Intermediate") ? " open" : ""}>
                        <summary id="bc-title">Muscle check <span class="bc-peek"></span></summary>
                        <div class="bc-bodies" aria-hidden="true"></div>
                        <p class="bc-key" aria-hidden="true"><span class="bc-k bc-k1"></span>Worked <span class="bc-k bc-k2"></span>Worked twice or more</p>
                        <ul class="bc-sum"></ul>
                        ${levelAtLeast("Intermediate") ? `<details class="bc-more"><summary>See every head and part</summary><ul class="bc-list"></ul></details>` : `<ul class="bc-list" hidden></ul>`}
                        <div class="bc-warn" role="status"></div>
                    </details>
                    <p class="builder-note" hidden></p>
                    <div class="builder-actions">
                        <button type="button" class="btn btn-primary builder-save">${draft.editing ? "Save changes" : draft.addDay ? `Save Day ${customDaysRaw().length + 1}` : "Save and start"}</button>
                        ${draft.addDay ? `<button type="button" class="text-button builder-replace">Start a new plan instead</button>` : ""}
                        <button type="button" class="text-button builder-clear">Clear</button>
                    </div>
                    <p class="log-status builder-status" role="status"></p>
                    <details class="builder-science">
                        <summary>Why these limits?</summary>
                        <p>Research on training volume shows muscle growth levels off at roughly 6 to 11 hard sets for one muscle in a single workout, and strength gains level off after a few heavy sets of a lift. Past that, extra exercises mostly add fatigue and soreness, not results. Spreading work across the week (training a muscle 2 times a week) beats piling it into one day.</p>
                        <p><strong>Sets and reps by goal.</strong> Strength: 1 to 6 reps for 2 to 6 sets with 2 to 5 minutes of rest. Muscle: 6 to 12 reps for 3 to 6 sets with 1 to 2 minutes. Endurance: 12 or more reps for 2 to 3 sets with short rests. New lifters start lighter and a little higher. <strong>When the weight goes up:</strong> once you hit the top of your rep range on every set, the next target adds about 2.5% (upper body) or 5% (legs); beat it by 2 or more reps and it adds a bit more, within the 2 to 10% the research suggests.</p>
                        <p>Sources: Remmert, Zourdos et al., 2025 meta-regression on sets per session (SportRxiv preprint); American College of Sports Medicine, <em>Progression Models in Resistance Training for Healthy Adults</em>, 2009; National Strength and Conditioning Association, <em>Essentials of Strength Training and Conditioning</em> (training-goal guidelines).</p>
                    </details>
                </div>
            </div>
        </div>`;
    const $ = (sel) => spot.querySelector(sel);
    const body = $("#builder-body"), openBtn = $(".builder-open"), results = $(".builder-results"), list = $(".builder-list");
    mountLevelBar($(".builder-level"));
    const search = $("#builder-search"), kitSel = $("#builder-kit"), nameIn = $("#builder-name"), status = $(".builder-status");
    nameIn.value = draft.title;
    const save = () => store.set(BUILDER_KEY, draft);
    function open(scroll) {
        body.hidden = false;
        openBtn.setAttribute("aria-expanded", "true");
        openBtn.hidden = true;
        renderGoal(); renderResults(); renderList();
        if (scroll) spot.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    openBtn.addEventListener("click", () => { open(false); search.focus(); });

    const goal = () => BUILD_GOALS[draft.goal] ? draft.goal : "muscle";
    // Per-muscle counts for the current workout
    function tally(items = draft.items) {
        const by = {};
        items.forEach((x) => { const m = builderMuscle(x.n); (by[m] = by[m] || { n: 0, sets: 0 }); by[m].n += 1; by[m].sets += builderKind(x.n) === "time" ? 0 : x.sets; });
        const trained = Object.keys(by).filter((m) => m !== "cardio" && m !== "core").length;
        Object.keys(by).forEach((m) => { by[m].max = builderLimit(goal(), m, trained); });
        return { by, trained };
    }
    function renderGoal() {
        const g = BUILD_GOALS[goal()];
        $(".builder-goal-why").textContent = `For ${g.for}: ${g.why}. Up to ${g.total} exercises in all.`;
    }
    function renderResults() {
        const q = search.value.trim().toLowerCase();
        const muscle = (spot.querySelector('input[name="builder-muscle"]:checked') || {}).value || "";
        const kit = kitSel.value;
        const shown = names.filter((n) => (!muscle || libraryGroup(n) === muscle) && (!kit || equipOf(n) === kit)
            && (!q || `${n} ${EXERCISES[n].m} ${EXERCISES[n].eq} ${EXERCISES[n].aka || ""}`.toLowerCase().includes(q)) && !/stretch|mobility/i.test(n))
            .sort((a, b) => searchRank(a, q) - searchRank(b, q));
        $(".builder-count").textContent = `${shown.length} exercise${shown.length === 1 ? "" : "s"}`;
        const picked = new Set(draft.items.map((x) => x.n));
        const { by, trained } = tally();
        const full = (n) => {
            const m = builderMuscle(n);
            const now = by[m] ? by[m].n : 0;
            const t = trained + (now || m === "cardio" || m === "core" ? 0 : 1);
            return now >= builderLimit(goal(), m, t);
        };
        results.innerHTML = shown.map((n) => {
            const over = !picked.has(n) && full(n);
            return `
            <li class="${over ? "is-full" : ""}">${equipIcon(n)}<span class="br-name"><strong>${escapeHtml(n)}</strong><small>${over ? `Enough ${escapeHtml(BUILD_MUSCLE_NAME[builderMuscle(n)].toLowerCase())} for today` : escapeHtml(EXERCISES[n].m)}</small></span>
                <button type="button" class="btn btn-small${over ? " is-anyway" : ""}" data-add="${escapeHtml(n)}"${picked.has(n) || draft.items.length >= 12 ? " disabled" : ""}>${picked.has(n) ? "Added" : over ? "Add anyway" : "Add"}<span class="visually-hidden"> ${escapeHtml(n)}</span></button></li>`;
        }).join("");
    }
    const opts = (list, val) => list.map((v) => `<option${v === val ? " selected" : ""}>${v}</option>`).join("");
    // What this workout hits: a body map plus each muscle's heads, with a heads-up when one head is worked twice
    let artLoading = false;
    function renderCoverage() {
        const box = $(".builder-cover");
        const items = draft.items.filter((x) => EXERCISES[x.n] && !isCardio(x.n));
        box.hidden = !items.length;
        if (!items.length) return;
        const mainCount = {}, byHead = {}, alsoSet = new Set();
        items.forEach((x) => {
            const h = exerciseHeads(x.n);
            h.main.forEach((id) => { if (!mmPart(id)) return; mainCount[id] = (mainCount[id] || 0) + 1; (byHead[id] = byHead[id] || []).push(x.n); });
            h.also.forEach((id) => alsoSet.add(id));
        });
        const bodies = $(".bc-bodies");
        if (typeof MUSCLE_ART === "undefined") {
            // The body drawing only loads when you build (it isn't needed anywhere else on this page)
            if (!artLoading) {
                artLoading = true;
                const ref = document.querySelector('script[src*="script.js"]');
                const v = ref && ref.getAttribute("src").includes("?") ? ref.getAttribute("src").slice(ref.getAttribute("src").indexOf("?")) : "";
                const sc = document.createElement("script");
                sc.src = `muscle-art.js${v}`;
                sc.onload = () => renderCoverage();
                document.head.appendChild(sc);
            }
            bodies.innerHTML = "";
        } else {
            const sex = getProfile().sex === "female" ? "female" : "male";
            bodies.innerHTML = ["front", "back"].map((v) => `<div class="bc-body"><span>${v === "front" ? "Front" : "Back"}</span>${muscleMapSvg(sex, v)}</div>`).join("");
            bodies.querySelectorAll("path[data-parts]").forEach((pth) => {
                const ids = pth.getAttribute("data-parts").split(" ");
                const n = Math.max(0, ...ids.map((i) => mainCount[i] || 0));
                if (n >= 2) pth.classList.add("hit-2"); else if (n === 1) pth.classList.add("hit-1");
            });
            // "Worked twice" is orange with dark stripes, so more work looks like more (not like a shadow)
            bodies.querySelectorAll("svg").forEach((svg, k) => {
                const defs = svg.querySelector("defs");
                if (defs) defs.insertAdjacentHTML("beforeend", `<pattern id="bc-hatch-${k}" patternUnits="userSpaceOnUse" width="22" height="22" patternTransform="rotate(45)"><rect width="22" height="22" fill="#ff5a1f"/><rect width="9" height="22" fill="#7a1e00"/></pattern>`);
                svg.querySelectorAll("path.hit-2").forEach((pth) => pth.setAttribute("style", `fill:url(#bc-hatch-${k})`));
            });
            bodies.querySelectorAll(".mm-muscle").forEach((g) => { g.removeAttribute("tabindex"); g.removeAttribute("role"); });
        }
        // Each muscle you're working, with all of its heads or parts
        const groups = MUSCLE_MAP.filter((g) => g.parts.some((pt) => mainCount[pt.id]));
        // Short version: one line per muscle, only the heads you're working
        $(".bc-sum").innerHTML = groups.map((g) => {
            const hit = g.parts.filter((pt) => mainCount[pt.id]);
            const words = !levelAtLeast("Intermediate") ? (hit.some((pt) => mainCount[pt.id] >= 2) ? `<b class="bc-x2">worked twice</b>` : "") : g.parts.length > 1 ? hit.map((pt) => `${pt.name.replace(new RegExp(`\\s*${g.name}$`, "i"), "").toLowerCase()}${mainCount[pt.id] >= 2 ? ` <b class="bc-x2">×${mainCount[pt.id]}</b>` : ""}`).join(", ") : (mainCount[hit[0].id] >= 2 ? `<b class="bc-x2">×${mainCount[hit[0].id]}</b>` : "");
            return `<li class="${hit.some((pt) => mainCount[pt.id] >= 2) ? "is-2" : ""}"><strong>${escapeHtml(g.name)}</strong>${words ? `<span>${words}</span>` : ""}</li>`;
        }).join("");
        $(".bc-list").innerHTML = groups.map((g) => `<li><strong>${escapeHtml(g.name)}</strong><span class="bc-heads">${g.parts.map((pt) => {
            const n = mainCount[pt.id] || 0;
            const cls = n >= 2 ? "is-2" : n ? "is-1" : "";
            return `<span class="bc-head ${cls}">${escapeHtml(pt.name)}${n ? ` <b>×${n}</b>` : alsoSet.has(pt.id) ? " <i>a little</i>" : " <i>not worked</i>"}</span>`;
        }).join("")}</span></li>`).join("");
        // Heads-ups: the same head twice, and the same muscles as the day before
        const warns = [];
        // One heads-up per pair of exercises that are really doing the same job (both mainly for that muscle, same heads)
        const seen = new Map();
        Object.entries(mainCount).filter(([, n]) => n >= 2).forEach(([id]) => {
            const g = mmPart(id).g;
            const names = byHead[id].filter((n) => primaryGroup(n) === g.id);
            if (names.length < 2 || g.parts.length < 2) return;
            const key = `${g.id}|${names.join("|")}`;
            if (!seen.has(key)) seen.set(key, { g, ids: [], names });
            seen.get(key).ids.push(id);
        });
        const beginner = !levelAtLeast("Intermediate");
        const offered = new Set();
        seen.forEach(({ g, ids, names }) => {
            const last = names[names.length - 1];
            const open = g.parts.filter((pt) => !mainCount[pt.id]);
            const pool = open.flatMap((pt) => pt.ex.filter((n) => EXERCISES[n] && !draft.items.some((x) => x.n === n) && !offered.has(n) && primaryGroup(n) === g.id).map((n) => ({ n, pt })));
            const pick = pool.find((c) => equipOf(c.n) === equipOf(last)) || pool[0];
            if (!pick) return;
            offered.add(pick.n);
            const what = beginner ? `${names.join(" and ")} are almost the same move for your ${g.name.toLowerCase()}.` : `${names.join(" and ")} both work your ${g.name.toLowerCase()} (${ids.map((id) => mmPart(id).p.name.toLowerCase()).join(" and ")}).`;
            warns.push(`<li>${escapeHtml(what)} That's fine, or swap ${escapeHtml(last)} for <button type="button" class="text-button" data-swap-in="${escapeHtml(last)}|${escapeHtml(pick.n)}">${escapeHtml(pick.n)}</button>${beginner ? "" : ` to work the ${escapeHtml(pick.pt.name.toLowerCase())}`}.</li>`);
        });
        const days = customDaysRaw();
        const prevIdx = draft.editing ? draft.editDay - 1 : draft.addDay ? days.length - 1 : -1;
        if (prevIdx >= 0 && days[prevIdx]) {
            const prim = (list) => new Set(list.map((n) => (EXERCISES[n] ? primaryGroup(n) : null)).filter(Boolean));
            const prevG = prim(days[prevIdx].items.map((it) => it && it.n));
            const nowG = prim(items.map((x) => x.n));
            const both = [...nowG].filter((gid) => prevG.has(gid));
            if (both.length && both.length * 2 >= nowG.size) warns.push(`<li>Day ${prevIdx + 1} (${escapeHtml(days[prevIdx].title || "")}) is mostly the same muscles (${escapeHtml(both.map((gid) => mmGroup(gid).name.toLowerCase()).join(", "))}). Leave a rest day between them, or pick different muscles for this day.</li>`);
        }
        $(".bc-peek").textContent = `${groups.map((g) => g.name.toLowerCase()).join(", ")}${warns.length ? ` · ${warns.length} to look at` : ""}`;
        $(".bc-warn").innerHTML = warns.length ? `<p class="bc-warn-title">Worth a look</p><ul>${warns.join("")}</ul>` : `<p>Nicely balanced. No two exercises are doing the same job.</p>`;
    }
    spot.addEventListener("click", (e) => {
        const b = e.target.closest("[data-swap-in]");
        if (!b) return;
        const [from, to] = b.dataset.swapIn.split("|");
        const i = draft.items.findIndex((x) => x.n === from);
        if (i < 0 || !EXERCISES[to]) return;
        draft.items[i] = builderDefault(to, goal());
        save(); renderList(); renderResults();
        status.textContent = `Swapped ${from} for ${to}.`;
    });
    function renderList() {
        $(".builder-n").textContent = draft.items.length ? `(${draft.items.length})` : "";
        const { by } = tally();
        const g = BUILD_GOALS[goal()];
        $(".builder-tally").innerHTML = Object.entries(by).filter(([m]) => m !== "cardio").map(([m, t]) => {
            const over = t.n > t.max || t.sets > g.sets;
            return `<li class="${over ? "is-over" : t.n === t.max ? "is-full" : ""}"><strong>${BUILD_MUSCLE_NAME[m]}</strong> ${t.n} of ${t.max} exercise${t.max === 1 ? "" : "s"} · ${t.sets} sets${over ? ` <span class="tally-warn">(${t.n > t.max ? "too many exercises" : "too many sets"})</span>` : ""}</li>`;
        }).join("") + (draft.items.length > g.total ? `<li class="is-over"><strong>Total</strong> ${draft.items.length} exercises <span class="tally-warn">(${g.total} is plenty for ${g.for})</span></li>` : "");
        $(".builder-empty").hidden = draft.items.length > 0;
        $(".builder-quick").hidden = draft.items.length === 0;
        renderCoverage();
        $(".builder-save").disabled = !draft.items.length;
        let needBody = false;
        list.innerHTML = draft.items.map((x, i) => {
            const kind = builderKind(x.n);
            let w = builderWeight(x);
            if (w === "NEED_BODYWEIGHT") { needBody = true; w = "Add your bodyweight (below) to get a weight for this."; }
            const amountList = kind === "time" ? BUILDER_TIMES : kind === "hold" ? BUILDER_HOLDS : kind === "steps" ? BUILDER_STEPS : BUILDER_REPS;
            const label = kind === "time" ? "Time" : kind === "hold" ? "Hold" : kind === "steps" ? "Walk" : "Reps";
            return `
            <li class="builder-item" data-i="${i}">
                <div class="bi-head">${equipIcon(x.n)}<strong>${escapeHtml(x.n)}</strong>
                    <button type="button" class="chip" data-howto="${escapeHtml(x.n)}">How to</button></div>
                <div class="bi-controls">
                    ${kind === "time" ? "" : `<label>Sets <select data-f="sets">${opts(["1", "2", "3", "4", "5", "6"], String(x.sets))}</select></label>`}
                    <label>${label} <select data-f="amount">${opts(amountList, x.amount)}</select></label>
                    ${kind === "time" ? "" : `<label>Rest <select data-f="rest">${opts(BUILDER_RESTS, x.rest)}</select></label>`}
                </div>
                <p class="bi-weight"><span class="bi-weight-label">Weight</span> ${escapeHtml(w)}</p>
                ${(() => { const m = builderMuscle(x.n), t = by[m]; if (!t || m === "cardio") return ""; const rank = draft.items.slice(0, i + 1).filter((y) => builderMuscle(y.n) === m).length; return rank > t.max ? `<p class="bi-warn" role="note"><strong>Heads up:</strong> that's ${t.n} ${BUILD_MUSCLE_NAME[m].toLowerCase()} exercises. For ${g.for}, ${t.max} ${t.max === 1 ? "is" : "are"} enough in one workout; ${g.why.split(";")[1] ? g.why.split(";")[1].trim() : "more mostly adds fatigue"}. Keep it if you like, or swap it for another muscle.</p>` : ""; })()}
                <div class="bi-move">
                    <button type="button" class="chip" data-move="-1"${i === 0 ? " disabled" : ""} aria-label="Move ${escapeHtml(x.n)} up">&uarr;</button>
                    <button type="button" class="chip" data-move="1"${i === draft.items.length - 1 ? " disabled" : ""} aria-label="Move ${escapeHtml(x.n)} down">&darr;</button>
                    <button type="button" class="chip" data-remove aria-label="Remove ${escapeHtml(x.n)}">Remove</button>
                </div>
            </li>`;
        }).join("");
        const note = $(".builder-note");
        note.hidden = !needBody;
        note.innerHTML = needBody ? `To get a starting weight for every exercise, add your level and bodyweight in <a href="index.html#setup">Your starting point</a>. It takes 10 seconds.` : "";
    }
    spot.querySelector(".builder-goals").addEventListener("change", (e) => {
        if (e.target.name !== "builder-goal" || !BUILD_GOALS[e.target.value]) return;
        draft.goal = e.target.value;
        // New goal, new sets and reps for everything already picked (you can still change them)
        draft.items = draft.items.map((x) => builderDefault(x.n, draft.goal));
        save(); renderGoal(); renderList(); renderResults();
        status.textContent = `Set for ${BUILD_GOALS[draft.goal].for}: sets, reps, and weights updated.`;
    });
    search.addEventListener("input", renderResults);
    kitSel.addEventListener("change", renderResults);
    spot.querySelector(".builder-muscles").addEventListener("change", renderResults);
    results.addEventListener("click", (e) => {
        const b = e.target.closest("[data-add]");
        if (!b || !EXERCISES[b.dataset.add] || draft.items.length >= 12) return;
        const wasAnyway = b.classList.contains("is-anyway");
        draft.items.push(builderDefault(b.dataset.add, goal()));
        save(); renderList(); renderResults();
        const mName = BUILD_MUSCLE_NAME[builderMuscle(b.dataset.add)].toLowerCase();
        status.textContent = wasAnyway ? `Added ${b.dataset.add}, but that's more ${mName} than you need today. See the note on it in your workout.` : `Added ${b.dataset.add}.`;
        const again = results.querySelector(`[data-add="${CSS.escape(b.dataset.add)}"]`);
        if (again) again.focus();
    });
    list.addEventListener("change", (e) => {
        const li = e.target.closest(".builder-item");
        if (!li || !e.target.dataset.f) return;
        const x = draft.items[Number(li.dataset.i)];
        x[e.target.dataset.f] = e.target.dataset.f === "sets" ? Number(e.target.value) : e.target.value;
        draft = builderClean(draft);
        save();
        const f = e.target.dataset.f, i = li.dataset.i;
        renderList();
        const back = list.querySelector(`[data-i="${i}"] [data-f="${f}"]`);
        if (back) back.focus();
    });
    list.addEventListener("click", (e) => {
        const li = e.target.closest(".builder-item");
        if (!li) return;
        const i = Number(li.dataset.i);
        if (e.target.closest("[data-remove]")) {
            const gone = draft.items.splice(i, 1)[0];
            save(); renderList(); renderResults();
            status.textContent = `Removed ${gone.n}.`;
            (list.querySelector(`[data-i="${Math.min(i, draft.items.length - 1)}"] [data-remove]`) || search).focus();
        }
        const mv = e.target.closest("[data-move]");
        if (mv && !mv.disabled) {
            const j = i + Number(mv.dataset.move);
            [draft.items[i], draft.items[j]] = [draft.items[j], draft.items[i]];
            save(); renderList();
            const back = list.querySelector(`[data-i="${j}"] [data-move="${mv.dataset.move}"]`) || list.querySelector(`[data-i="${j}"] [data-remove]`);
            if (back) back.focus();
        }
    });
    nameIn.addEventListener("input", () => { draft.title = nameIn.value.replace(/[<>]/g, "").slice(0, 40); save(); });
    const replaceBtn = $(".builder-replace");
    if (replaceBtn) replaceBtn.addEventListener("click", () => {
        draft.addDay = false; draft.newPlan = true; save();
        $(".builder-save").textContent = "Save and start";
        $("#builder-title").textContent = "Build your own workout";
        replaceBtn.remove();
        status.textContent = "Saving will start a new plan with just this workout.";
    });
    // Clear every exercise (a suggestion or an old list) and start picking your own right away.
    // Keeps what you're making (Day 2, or the day you're editing); Undo puts them back.
    let cleared = null;
    function clearAll(fromTop) {
        if (!draft.items.length) return;
        cleared = { items: draft.items.slice(), title: draft.title };
        draft.items = []; draft.title = ""; nameIn.value = "";
        save(); renderList(); renderResults();
        status.innerHTML = `Cleared ${cleared.items.length} exercise${cleared.items.length === 1 ? "" : "s"}. Pick your own below. <button type="button" class="text-button builder-undo">Undo</button>`;
        if (fromTop) {
            const pick = spot.querySelector(".builder-pick") || search;
            pick.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
            search.focus({ preventScroll: true });
        }
    }
    $(".builder-clear").addEventListener("click", () => clearAll(false));
    $(".builder-clear-all").addEventListener("click", () => clearAll(true));
    $(".builder-to-pick").addEventListener("click", () => {
        (spot.querySelector(".builder-pick") || search).scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
        search.focus({ preventScroll: true });
    });
    status.addEventListener("click", (e) => {
        if (!e.target.closest(".builder-undo") || !cleared) return;
        draft.items = cleared.items; draft.title = cleared.title; nameIn.value = cleared.title;
        cleared = null; save(); renderList(); renderResults();
        status.textContent = "They're back.";
    });
    $(".builder-save").addEventListener("click", () => {
        if (!draft.items.length) return;
        // No name? Name it after its main muscles ("Shoulders & Biceps")
        const counts = {};
        draft.items.forEach((x) => { const m = builderMuscle(x.n); if (m !== "cardio") counts[m] = (counts[m] || 0) + 1; });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([m]) => BUILD_MUSCLE_NAME[m]);
        const UPPER = ["chest", "back", "shoulders", "biceps", "triceps"], LOWER = ["quads", "hamstrings", "glutes", "calves"];
        const ups = Object.keys(counts).filter((m) => UPPER.includes(m)).length, lows = Object.keys(counts).filter((m) => LOWER.includes(m)).length;
        const autoTitle = ups >= 2 && lows >= 2 ? "Full body" : ups >= 3 && !lows ? "Upper body" : lows >= 3 && !ups ? "Lower body" : top.length > 1 ? `${top.slice(0, -1).join(", ")} & ${top[top.length - 1]}` : top[0] || "Workout";
        const title = draft.title.trim() || autoTitle;
        const newDay = { title, items: draft.items.map((x) => ({ n: x.n, d: builderDose(x), rest: builderKind(x.n) === "time" ? "" : x.rest })) };
        let days = customDaysRaw();
        const oldN = days.length;
        const week = Math.max(1, weekOf(programStart("custom")));
        const oldKey = `gu-progress-custom-${oldN}-w${week}`;
        let done = store.get(oldKey, []) || [];
        if (draft.editing && days[draft.editDay]) {
            // Editing a day you're doing: keep the exercises you already checked off this week
            const d = draft.editDay;
            const doneNames = new Set(done.filter((k) => String(k).startsWith(`${d}-`)).map((k) => { const it = days[d].items[Number(String(k).split("-")[1])]; return it && it.n; }).filter(Boolean));
            done = done.filter((k) => !String(k).startsWith(`${d}-`)).concat(newDay.items.map((x, i) => (doneNames.has(x.n) ? `${d}-${i}` : null)).filter(Boolean));
            days[d] = newDay;
            clearCustomSwaps(d);
        } else if (draft.addDay && oldN > 0 && oldN < 7) {
            days.push(newDay);
        } else {
            days = [newDay];
            done = [];
            clearCustomSwaps();
        }
        store.remove(oldKey);
        store.set(`gu-progress-custom-${days.length}-w${week}`, done);
        draft.editing = false; draft.addDay = false; draft.newPlan = false; draft.items = []; draft.title = "";
        save();
        saveCustomDays(days);
        store.set("gu-last-plan", { goal: "custom", days: days.length });
        status.textContent = "Saved. Opening your workout…";
        setTimeout(() => location.assign(`programs.html?w=${Date.now()}#program-custom-${days.length}`), 250);
    });
    window.addEventListener("logchange", () => { if (!body.hidden) renderList(); });
    window.addEventListener("levelchange", () => { if (!body.hidden) renderList(); });
    // Editing a workout you already have: open on its exercises, not the search list
    addRoute(/^#build$/, () => { open(false); return { target: (draft.editing || draft.addDay) && draft.items.length ? spot.querySelector(".builder-plan") || spot : spot }; });
}

/* =========================================================
   FEATURE: Build vs Plans (programs.html)
   The Build tab (programs.html#build) shows only Build your own workout.
   The Plans tab shows the plans, opening on your active plan, with a
   small link to the builder. Saving a workout takes you to Plans, where
   it's "Your plan".
   ========================================================= */
function setupPlansView() {
    const build = document.getElementById("build");
    const plans = document.getElementById("programs");
    if (!build || !plans || document.body.dataset.page !== "programs") return;
    if (!document.getElementById("build-cta")) {
        plans.querySelector(".container").insertAdjacentHTML("afterbegin", `<p class="build-cta" id="build-cta"><a class="btn btn-compact" href="programs.html#build">+ Build your own workout</a></p>`);
    }
    const set = () => {
        const building = location.hash === "#build";
        document.body.classList.toggle("view-build", building);
        document.body.classList.toggle("view-plans", !building);
    };
    window.addEventListener("hashchange", set);
    window.addEventListener("routechange", set);
    window.addEventListener("popstate", set);
    set();
}

/* =========================================================
   FEATURE: Your starting point (home page and My progress)
   Pick a level, add bodyweight (and sex, optional), and every plan and the
   Fitness Coach suggest starting weights that fit. Saved on this device only,
   in the same profile the Plans page uses.
   ========================================================= */
const SETUP_LIFTS = ["Bench press", "Back squat", "Deadlift", "Overhead press"];
function setupStartingPoint() {
    const spots = [...document.querySelectorAll("[data-setup]")];
    if (!spots.length) return;
    spots.forEach((spot, n) => {
        spot.innerHTML = `
            <div class="setup-card">
                <div class="setup-intro">
                    <p class="kicker">Your starting point</p>
                    <h2 id="setup-title-${n}">Get weights that fit you</h2>
                    <p class="section-lede">Add your bodyweight. Every plan and the Fitness Coach will suggest a starting weight for each lift, and push you up as you log your sets.</p>
                </div>
                <form class="setup-form" novalidate aria-labelledby="setup-title-${n}">
                    <p class="setup-level-info"></p>
                    <div class="field">
                        <label for="setup-name-${n}">Your first name <span class="field-hint">(optional, makes My progress yours)</span></label>
                        <input id="setup-name-${n}" name="pname" type="text" maxlength="30" autocomplete="given-name" placeholder="e.g. Chris">
                    </div>
                    <div class="field-row">
                        <div class="field">
                            <label for="setup-bw-${n}">Bodyweight</label>
                            <input id="setup-bw-${n}" name="bodyweight" type="number" inputmode="decimal" min="50" max="700" placeholder="180">
                        </div>
                        <div class="field">
                            <label for="setup-unit-${n}">Units</label>
                            <select id="setup-unit-${n}" name="unit"><option value="lb">Pounds (lb)</option><option value="kg">Kilograms (kg)</option></select>
                        </div>
                        <div class="field">
                            <label for="setup-sex-${n}">Sex <span class="field-hint">(optional)</span></label>
                            <select id="setup-sex-${n}" name="sex"><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option></select>
                        </div>
                    </div>
                    <details class="setup-more"${spot.hasAttribute("data-setup-open") ? " open" : ""}>
                        <summary>Tailor it to you <span>goal, time, the weights you already lift, moves to skip</span></summary>
                        <div class="setup-more-body">
                            <fieldset class="segmented compact setup-choice">
                                <legend>Main goal</legend>
                                ${[["", "Not sure"], ["muscle", "Build muscle"], ["strength", "Get stronger"], ["fatloss", "Lose fat"], ["health", "Stay healthy"]].map(([v, t]) => `<label><input type="radio" name="goal" value="${v}"><span>${t}</span></label>`).join("")}
                            </fieldset>
                            <fieldset class="segmented compact setup-choice">
                                <legend>Where you train</legend>
                                ${[["gym", "A gym"], ["homedb", "Home, dumbbells"], ["home", "Home, nothing"]].map(([v, t]) => `<label><input type="radio" name="place" value="${v}"><span>${t}</span></label>`).join("")}
                            </fieldset>
                            <div class="field-row">
                                <div class="field">
                                    <label for="setup-days-${n}">Days a week</label>
                                    <select id="setup-days-${n}" name="days"><option value="">Not sure</option>${[2, 3, 4, 5, 6].map((d) => `<option value="${d}">${d} days</option>`).join("")}</select>
                                </div>
                                <div class="field">
                                    <label for="setup-min-${n}">Time per workout</label>
                                    <select id="setup-min-${n}" name="minutes"><option value="">Not sure</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">1 hour</option><option value="90">60–90 min</option></select>
                                </div>
                            </div>
                            <fieldset class="setup-body">
                                <legend>Your body <span class="field-hint">(optional: for exact calories and protein, and age-aware starting weights)</span></legend>
                                <div class="field-row">
                                    <div class="field">
                                        <label for="setup-age-${n}">Age</label>
                                        <input id="setup-age-${n}" name="years" type="number" inputmode="numeric" min="18" max="100" step="1" placeholder="30">
                                    </div>
                                    <div class="field setup-h-imp">
                                        <label for="setup-hft-${n}">Height</label>
                                        <div class="pair">
                                            <input id="setup-hft-${n}" name="hft" type="number" inputmode="numeric" min="4" max="7" placeholder="5" aria-label="Height, feet"><span>ft</span>
                                            <input name="hin" type="number" inputmode="numeric" min="0" max="11" placeholder="10" aria-label="Height, inches"><span>in</span>
                                        </div>
                                    </div>
                                    <div class="field setup-h-met" hidden>
                                        <label for="setup-hcm-${n}">Height (cm)</label>
                                        <input id="setup-hcm-${n}" name="hcm" type="number" inputmode="numeric" min="120" max="230" placeholder="178">
                                    </div>
                                    <div class="field">
                                        <label for="setup-bf-${n}">Body fat % <span class="field-hint">(if you know it)</span></label>
                                        <input id="setup-bf-${n}" name="bodyfat" type="number" inputmode="decimal" min="3" max="60" step="0.5" placeholder="—">
                                    </div>
                                </div>
                                <div class="field">
                                    <label for="setup-act-${n}">How active are you outside the gym?</label>
                                    <select id="setup-act-${n}" name="activity"><option value="">Not sure</option><option value="1.2">Mostly sitting (desk job)</option><option value="1.375">On my feet some of the day</option><option value="1.55">On my feet most of the day</option><option value="1.725">Physical job (lifting, carrying)</option></select>
                                </div>
                                <p class="setup-energy" aria-live="polite"></p>
                            </fieldset>
                            <fieldset class="setup-lifts">
                                <legend>Weights you already lift <span class="field-hint">(optional: a recent set you did with good form)</span></legend>
                                ${SETUP_LIFTS.map((name, k) => `<div class="setup-lift">
                                    <span class="setup-lift-name" id="setup-lift-${n}-${k}">${escapeHtml(name)}</span>
                                    <label><span class="visually-hidden">${escapeHtml(name)} weight</span><input type="number" inputmode="decimal" min="0" max="1500" step="any" name="lift-w-${k}" placeholder="${getProfile().unit}" aria-describedby="setup-lift-${n}-${k}"></label>
                                    <span aria-hidden="true">×</span>
                                    <label><span class="visually-hidden">${escapeHtml(name)} reps</span><input type="number" inputmode="numeric" min="1" max="20" step="1" name="lift-r-${k}" placeholder="reps" aria-describedby="setup-lift-${n}-${k}"></label>
                                </div>`).join("")}
                            </fieldset>
                            <fieldset class="setup-avoid">
                                <legend>Moves to skip <span class="field-hint">(plans swap them for something similar)</span></legend>
                                ${Object.entries(AVOID_MOVES).map(([k, [label]]) => `<label class="check"><input type="checkbox" name="avoid" value="${k}"><span>${escapeHtml(label)}</span></label>`).join("")}
                                <p class="fine-print">Pain or an injury? Check with a doctor or physical therapist before training around it.</p>
                            </fieldset>
                        </div>
                    </details>
                    <div class="setup-tailored" aria-live="polite"></div>
                    <div class="setup-preview" aria-live="polite"></div>
                    <p class="fine-print">Saved only on this device. These are starting points: your logged sets take over from the first workout.</p>
                </form>
            </div>`;
        const form = spot.querySelector("form");
        form.addEventListener("change", (e) => {
            // Switching lb/kg converts the numbers already typed (195 lb becomes 88.5 kg, not 195 kg)
            if (e.target.name === "unit") {
                const from = getProfile().unit, to = e.target.value;
                if (from !== to && ["lb", "kg"].includes(to)) {
                    const conv = (el) => { const v = Number(el.value); if (v > 0) el.value = trimNum(Math.round(toUnit(v, from, to) * 2) / 2); };
                    conv(form.elements.bodyweight);
                    SETUP_LIFTS.forEach((_, k) => conv(form.elements[`lift-w-${k}`]));
                    // Height moves between ft/in and cm
                    const el = form.elements;
                    if (to === "kg" && el.hft.value !== "") el.hcm.value = String(Math.round(((Number(el.hft.value) || 0) * 12 + (Number(el.hin.value) || 0)) * 2.54));
                    if (to === "lb" && el.hcm.value !== "") { const tin = Math.round(Number(el.hcm.value) / 2.54); el.hft.value = String(Math.floor(tin / 12)); el.hin.value = String(tin % 12); }
                }
            }
            save();
        });
        form.addEventListener("input", (e) => { if (["bodyweight", "pname", "years", "hft", "hin", "hcm", "bodyfat"].includes(e.target.name) || /^lift-/.test(e.target.name)) save(); });
        form.addEventListener("submit", (e) => e.preventDefault());
        // Your first bodyweight also starts your weigh-in log (My progress and the weight tracker use it)
        form.elements.bodyweight.addEventListener("change", () => {
            const bw = Number(form.elements.bodyweight.value);
            const log = store.get("gu-weights", []) || [];
            if (bw >= 50 && bw <= 700 && Array.isArray(log) && !log.length) store.set("gu-weights", [{ date: isoDate(new Date()), w: bw, unit: ["lb", "kg"].includes(form.elements.unit.value) ? form.elements.unit.value : "lb" }]);
        });
        function save() {
            const raw = store.get(PROFILE_KEY, {}) || {};
            const bw = Number(form.elements.bodyweight.value);
            raw.bodyweight = bw >= 50 && bw <= 700 ? String(bw) : "";
            raw.unit = ["lb", "kg"].includes(form.elements.unit.value) ? form.elements.unit.value : "lb";
            raw.sex = ["", "female", "male"].includes(form.elements.sex.value) ? form.elements.sex.value : "";
            const nm = form.elements.pname.value.trim();
            raw.name = /^[\p{L}' .-]{1,30}$/u.test(nm) ? nm : "";
            // Tailoring answers (checked again in getProfile)
            const radio = (nameAttr) => (form.querySelector(`input[name="${nameAttr}"]:checked`) || {}).value || "";
            raw.goal = radio("goal");
            raw.place = radio("place");
            raw.days = form.elements.days.value;
            raw.minutes = form.elements.minutes.value;
            const yrs = Number(form.elements.years.value);
            raw.years = Number.isInteger(yrs) && yrs >= 18 && yrs <= 100 ? String(yrs) : "";
            raw.age = raw.years ? ageBracket(yrs) : "";
            const hcm = raw.unit === "kg" ? Number(form.elements.hcm.value)
                : form.elements.hft.value !== "" ? ((Number(form.elements.hft.value) || 0) * 12 + (Number(form.elements.hin.value) || 0)) * 2.54 : 0;
            raw.heightCm = hcm >= 120 && hcm <= 230 ? String(Math.round(hcm)) : "";
            const bfv = Number(form.elements.bodyfat.value);
            raw.bodyfat = form.elements.bodyfat.value !== "" && bfv >= 3 && bfv <= 60 ? String(bfv) : "";
            raw.activity = ["1.2", "1.375", "1.55", "1.725"].includes(form.elements.activity.value) ? form.elements.activity.value : "";
            raw.avoid = [...form.querySelectorAll('input[name="avoid"]:checked')].map((c) => c.value).filter((k) => AVOID_MOVES[k]);
            store.set(PROFILE_KEY, raw);
            // Weights you already lift become your estimated maxes (the Fitness Coach uses the same list)
            const maxes = store.get(MAXES_KEY, {}) || {};
            SETUP_LIFTS.forEach((lift, k) => {
                const w = Number(form.elements[`lift-w-${k}`].value), r = Number(form.elements[`lift-r-${k}`].value);
                if (w > 0 && w <= (raw.unit === "kg" ? 700 : 1500) && Number.isInteger(r) && r >= 1 && r <= 20) maxes[lift] = { m: Math.round(e1rm(w, r) * 10) / 10, u: raw.unit, w, r };
                else if (!form.elements[`lift-w-${k}`].value) delete maxes[lift];
            });
            store.set(MAXES_KEY, maxes);
            window.dispatchEvent(new CustomEvent("profilechange"));
            render(false);
        }
    });
    const LIFTS = [["Bench press", "Bench press"], ["Back squat", "Squat"], ["Deadlift", "Deadlift"], ["Overhead press", "Overhead press"]];
    const HOME_LIFTS = [["Goblet squat", "Goblet squat"], ["Dumbbell floor press", "Floor press"], ["Bent-over dumbbell row", "Dumbbell row"], ["Dumbbell Romanian deadlift", "Romanian deadlift"]];
    // What your answers change, in plain words
    function tailoredText(p) {
        const bits = [];
        const rec = recommendPlan(p);
        if (p.goal === "strength") bits.push("Main lifts: heavier, with fewer reps and an extra set.");
        if (p.goal === "fatloss") bits.push("Extra exercises: a few more reps with short rests.");
        if (p.minutes === "30") bits.push("30-minute workouts: 1 fewer set on extras, and anything past 4 exercises is marked optional.");
        else if (p.minutes === "45") bits.push("Anything past 5 exercises is marked optional.");
        else if (p.minutes === "90") bits.push("Main lifts: 1 more set.");
        if (p.age === "50-59" || p.age === "60+") bits.push("Starting weights a little lighter, and a reminder to warm up.");
        if (p.avoid.length) bits.push(`Skipped and swapped: ${p.avoid.map((k) => AVOID_MOVES[k][0].toLowerCase()).join(", ")}.`);
        const told = SETUP_LIFTS.filter((l) => coachMaxes()[l]);
        if (told.length) bits.push(`Weights for ${told.map((l) => l.toLowerCase()).join(", ")} (and the moves like them) come from the numbers you entered.`);
        return { rec, bits };
    }
    function render(fill = true) {
        const p = getProfile(), lvl = getLevel();
        spots.forEach((spot) => {
            const form = spot.querySelector("form");
            if (fill) {
                form.querySelectorAll('input[name="goal"]').forEach((r) => { r.checked = r.value === p.goal; });
                form.querySelectorAll('input[name="place"]').forEach((r) => { r.checked = r.value === p.place; });
                form.elements.days.value = p.days;
                form.elements.minutes.value = p.minutes;
                const keep = (el, v) => { if (document.activeElement !== el) el.value = v; };
                keep(form.elements.years, p.years);
                keep(form.elements.bodyfat, p.bodyfat);
                form.elements.activity.value = p.activity;
                const hc = Number(p.heightCm);
                keep(form.elements.hcm, hc ? String(hc) : "");
                if (hc) { const tin = Math.round(hc / 2.54); keep(form.elements.hft, String(Math.floor(tin / 12))); keep(form.elements.hin, String(tin % 12)); }
                else { keep(form.elements.hft, ""); keep(form.elements.hin, ""); }
                form.querySelectorAll('input[name="avoid"]').forEach((c) => { c.checked = p.avoid.includes(c.value); });
                const maxes = coachMaxes();
                SETUP_LIFTS.forEach((lift, k) => {
                    const m = maxes[lift];
                    if (document.activeElement !== form.elements[`lift-w-${k}`] && document.activeElement !== form.elements[`lift-r-${k}`]) {
                        form.elements[`lift-w-${k}`].value = m && m.w ? trimNum(m.w) : "";
                        form.elements[`lift-r-${k}`].value = m && m.w ? m.r : "";
                    }
                });
                if (document.activeElement !== form.elements.bodyweight) form.elements.bodyweight.value = p.bodyweight;
                if (document.activeElement !== form.elements.pname) form.elements.pname.value = p.name;
                form.elements.unit.value = p.unit;
                form.elements.sex.value = p.sex;
            }
            spot.querySelector(".setup-h-imp").hidden = p.unit === "kg";
            spot.querySelector(".setup-h-met").hidden = p.unit !== "kg";
            const en = energyEstimate(p);
            spot.querySelector(".setup-energy").innerHTML = en
                ? `About <strong>${fmt(Math.round(en.maintenance / 10) * 10)} calories a day</strong> keeps your weight steady${en.activityGiven ? "" : " (add how active you are for a closer number)"}, and <strong>${fmt(en.proteinLow)}–${fmt(en.proteinHigh)} g of protein</strong> a day supports your training. <a href="tools.html#tool-calories">Set a goal in the calorie tool</a>.`
                : "Add your age, height, sex, and bodyweight (or your body fat %) for your daily calories and protein.";
            spot.querySelector(".setup-level-info").innerHTML = `Your level: <strong>${escapeHtml(lvl)}</strong>. Change it on <a href="programs.html#all-plans">any plan</a> or when you build your own workout.`;
            const link = document.querySelector(".hero-setup-link");
            if (link) link.textContent = Number(p.bodyweight) ? "See your starting weights" : "Add your bodyweight for starting weights";
            const t = tailoredText(p), recP = PROGRAMS[t.rec];
            const lifted = liftedLevel(p);
            const liftNote = lifted > levelRank(lvl) ? `<p class="setup-lift-level">Your lifts look like <strong>${LEVELS[lifted]}</strong>, but your level is set to ${escapeHtml(lvl)}. <button type="button" class="btn btn-compact" data-lift-level="${LEVELS[lifted]}">Set my level to ${LEVELS[lifted]}</button></p>` : "";
            spot.querySelector(".setup-tailored").innerHTML = liftNote + ((p.goal || p.place || p.minutes || p.age || p.avoid.length || p.days) && recP ? `
                <div class="setup-rec"><p class="setup-preview-title">Best fit for you: <strong>${escapeHtml(recP.name)}</strong></p>
                ${t.bits.length ? `<ul class="setup-rec-list">${t.bits.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
                <a class="btn btn-compact" href="programs.html#program-${t.rec}${p.days && recP.plans[p.days] ? `-${p.days}` : ""}">See ${escapeHtml(recP.name)}</a></div>` : "");
            const preview = spot.querySelector(".setup-preview");
            if (!Number(p.bodyweight) && !SETUP_LIFTS.some((l) => coachMaxes()[l])) {
                preview.innerHTML = `<p>Add your bodyweight to see your starting weights.</p>`;
                return;
            }
            const home = ["home", "homedb"].includes(p.place);
            const liftList = (home ? HOME_LIFTS : LIFTS).filter(([name]) => !avoidedBy(name, p.avoid));
            const rows = liftList.map(([name, label]) => {
                const sw = startWeight(name, 8, p.unit);
                return sw ? `<li><span>${escapeHtml(label)}</span><strong>${sw.bar ? `Empty bar (${p.unit === "kg" ? "20 kg" : "45 lb"})` : `${trimNum(sw.w)} ${p.unit}${sw.each ? " each" : ""}`}</strong></li>` : "";
            }).join("");
            preview.innerHTML = `<p class="setup-preview-title">Your starting weights at <strong>${escapeHtml(lvl)}</strong> <span>(sets of 8)</span></p>
                <ul class="setup-weights">${rows}</ul>
                <a class="btn btn-primary btn-compact" href="programs.html">See them in your plan</a>`;
        });
    }
    window.addEventListener("levelchange", () => render(true));
    document.addEventListener("click", (e) => { const b = e.target.closest("[data-lift-level]"); if (b && LEVELS.includes(b.dataset.liftLevel)) setLevel(b.dataset.liftLevel); });
    render(true);
}

// Level pickers live where they change your sets, reps, and weights: the ready-made plans and Build your own workout
let levelBarCount = 0;
function mountLevelBar(bar) {
    const n = levelBarCount++;
    {
        const compact = bar.hasAttribute("data-compact");
        bar.innerHTML = `
            <fieldset class="segmented level-bar${compact ? " is-compact" : ""}">
                <legend>${escapeHtml(bar.dataset.label || (compact ? "Detail level" : "Your level"))}</legend>
                ${LEVELS.map((l) => `<label><input type="radio" name="level-${n}" value="${l}"><span>${l}</span></label>`).join("")}
            </fieldset>
            ${compact ? "" : `<p class="level-info" aria-live="polite"></p>`}`;
        bar.addEventListener("change", (e) => { if (e.target.name === `level-${n}`) setLevel(e.target.value); });
        bar.querySelectorAll(".level-bar input").forEach((r) => { r.checked = r.value === getLevel(); });
        const info = bar.querySelector(".level-info");
        if (info) info.textContent = LEVEL_INFO[getLevel()];
    }
}
function setupLevelBar() {
    const bars = [...document.querySelectorAll("[data-level-bar]")];
    bars.forEach(mountLevelBar);
    const sync = () => {
        const l = getLevel();
        document.querySelectorAll(".level-bar input").forEach((r) => { r.checked = r.value === l; });
        document.querySelectorAll(".level-info").forEach((p) => { p.textContent = LEVEL_INFO[l]; });
    };
    window.addEventListener("levelchange", sync);
    sync();
}

/* =========================================================
   FEATURE: Muscle map (Exercises page)
   An anatomy figure (male or female, from muscle-art.js) you can spin
   with a mouse, a finger, or the buttons. Every muscle is broken into
   its heads and parts (upper/middle/lower chest, front/side/rear delt,
   outer/middle/inner quad...). Point at or tap a part to light it up
   and see the best exercises for it. MM_PIECES decides which part each
   shape in the drawing belongs to.
   ========================================================= */
const P = (id, name, aka, where, ex) => ({ id, name, aka, where, ex });
const MUSCLE_MAP = [
    { id: "chest", name: "Chest", group: "chest",
      does: "Your pecs push your arms forward and together: push-ups, presses, pushing a door. The fibers fan out, so different angles hit different parts.",
      tip: "Lower the weight slowly and keep your shoulder blades pinned back on the bench.",
      parts: [
        P("chest-upper", "Upper chest", "clavicular head", "Just under your collarbones. Worked most when you press or fly upward.", ["Incline dumbbell press", "Incline machine press", "Low-to-high cable fly"]),
        P("chest-middle", "Middle chest", "sternal head", "The biggest part, across the middle. Flat pressing and flys hit it hardest.", ["Bench press", "Dumbbell bench press", "Machine chest press", "Pec deck"]),
        P("chest-lower", "Lower chest", "costal fibers", "The bottom edge. Pushing down and forward works it: dips and high-to-low flys.", ["Assisted dip", "Cable fly", "Push-up"])
      ] },
    { id: "shoulders", name: "Shoulders", group: "shoulders",
      does: "Your delts have three heads that move your arms forward, out to the side, and back. Training all three gives round, healthy shoulders.",
      tip: "Most people overtrain the front and undertrain the side and rear. Pressing already hits the front a lot.",
      parts: [
        P("delt-front", "Front delt", "anterior head", "Raises your arms in front of you and presses overhead.", ["Overhead press", "Seated dumbbell shoulder press", "Machine shoulder press"]),
        P("delt-side", "Side delt", "lateral head", "Lifts your arms out to the sides. It's what makes shoulders look wider.", ["Lateral raise", "Cable lateral raise", "Machine lateral raise"]),
        P("delt-rear", "Rear delt", "posterior head", "Pulls your arms back. Key for posture and shoulder health.", ["Face pull", "Rear delt fly", "Reverse pec deck"])
      ] },
    { id: "traps", name: "Traps", group: "back",
      does: "A kite-shaped muscle from your neck to the middle of your back. Each part moves your shoulder blades a different way.",
      tip: "Heavy carries and deadlifts work the upper traps hard, so most people don't need extra shrugs.",
      parts: [
        P("traps-upper", "Upper traps", "upper fibers", "Between your neck and shoulders. Shrugs your shoulders up and holds heavy things.", ["Farmer carry", "Deadlift", "Suitcase carry"]),
        P("traps-middle", "Middle traps", "middle fibers", "Across your upper back. Squeezes your shoulder blades together.", ["Face pull", "Seated cable row", "Chest-supported row"]),
        P("traps-lower", "Lower traps", "lower fibers", "Down toward the middle of your back. Pulls your shoulder blades down; important for overhead work.", ["Face pull", "Chest-supported row", "Pull-up"])
      ] },
    { id: "upper-back", name: "Upper back", group: "back",
      does: "Your rhomboids squeeze your shoulder blades together. They give your back thickness and help you stand tall.",
      tip: "Finish every row by pulling your shoulder blades together for a second.",
      parts: [P("rhomboids", "Rhomboids", "rhomboid major and minor", "Between your shoulder blades, under the traps.", ["Seated cable row", "Chest-supported row", "Barbell row", "Machine row"])] },
    { id: "lats", name: "Lats", group: "back",
      does: "The biggest muscles of your back. They pull your arms down and back: pull-ups, climbing, starting a lawnmower. They create the V-shape.",
      tip: "Think about pulling your elbows down to your back pockets, not yanking with your hands.",
      parts: [P("lats", "Lats", "latissimus dorsi", "From under your armpits down to your lower back.", ["Lat pulldown", "Pull-up", "Assisted pull-up", "Single-arm dumbbell row"])] },
    { id: "lower-back", name: "Lower back", group: "back",
      does: "Two columns of muscle along your spine that hold it steady when you bend, lift, and carry.",
      tip: "Train them by holding a flat back under load, not by rounding and arching.",
      parts: [P("erectors", "Spinal erectors", "erector spinae", "Either side of your spine, strongest in the lower back.", ["Back extension", "Romanian deadlift", "Bird dog", "Deadlift"])] },
    { id: "biceps", name: "Biceps", group: "arms",
      does: "Two heads that bend your elbow and turn your palm up, with the brachialis working underneath.",
      tip: "Keep your elbows still at your sides. If your body swings, the weight is too heavy.",
      parts: [
        P("biceps-long", "Outer biceps", "long head", "The outer half; makes the biceps peak. Stretched when your arms are behind you.", ["Incline dumbbell curl", "Dumbbell curl", "Barbell curl"]),
        P("biceps-short", "Inner biceps", "short head", "The inner half; adds thickness. Worked most with arms in front of you.", ["Preacher curl", "Cable curl", "EZ-bar curl"]),
        P("brachialis", "Brachialis", "under the biceps", "Sits under the biceps on the outside of the arm. Pushes the biceps up and out.", ["Hammer curl", "Cable curl"])
      ] },
    { id: "triceps", name: "Triceps", group: "arms",
      does: "Three heads that straighten your elbow. They're about two-thirds of your upper arm, and they help every press.",
      tip: "Overhead extensions stretch the long head, the biggest of the three. Include one each week.",
      parts: [
        P("triceps-long", "Long head", "inner back of the arm", "The biggest head, running up into the shoulder. Hit hardest with your arms overhead.", ["Overhead triceps extension", "Skull crusher"]),
        P("triceps-lateral", "Lateral head", "outer horseshoe", "The outer side; makes the horseshoe shape. Pushdowns hit it well.", ["Triceps pushdown", "Rope pushdown", "Assisted dip"]),
        P("triceps-medial", "Medial head", "lower, near the elbow", "Lower down, near the elbow. Works in every triceps exercise.", ["Triceps pushdown", "Assisted dip", "Skull crusher"])
      ] },
    { id: "forearms", name: "Forearms", group: "arms",
      does: "Grip and turn your wrist. Strong forearms mean you can hold on to heavier weights.",
      tip: "Carrying heavy things builds grip fast. Skip lifting straps for your first few months.",
      parts: [
        P("forearm-flexors", "Inner forearm", "wrist flexors", "The palm side. Closes your grip.", ["Farmer carry", "Dumbbell curl"]),
        P("forearm-extensors", "Outer forearm", "wrist extensors", "The back-of-the-hand side. Hammer and reverse grips work it.", ["Hammer curl", "Suitcase carry"])
      ] },
    { id: "abs", name: "Abs", group: "core",
      does: "Brace your trunk and curl your ribs toward your hips. They protect your back when you lift.",
      tip: "Training makes your abs stronger. Seeing them depends on body fat, which comes down to food.",
      parts: [
        P("abs-upper", "Upper abs", "upper rectus abdominis", "Curling your ribs down: crunches.", ["Cable crunch", "Dead bug", "Ab wheel rollout"]),
        P("abs-lower", "Lower abs", "lower rectus abdominis", "Curling your hips up: leg and knee raises.", ["Hanging knee raise", "Reverse crunch", "Lying leg raise"])
      ] },
    { id: "obliques", name: "Obliques", group: "core",
      does: "Twist and bend your trunk sideways, and stop it from twisting when you carry or press with one arm.",
      tip: "Carrying a weight in one hand works them without any crunches.",
      parts: [P("obliques", "Obliques", "internal and external obliques", "The sides of your waist.", ["Side plank", "Pallof press", "Suitcase carry"])] },
    { id: "glutes", name: "Glutes", group: "legs",
      does: "The biggest muscles in your body. They drive your hips forward and keep your knees and hips lined up.",
      tip: "Squeeze for a second at the top of hip thrusts and bridges. Feel them working, not your lower back.",
      parts: [
        P("glute-max", "Glute max", "gluteus maximus", "The main, rounded part. Standing up, climbing, sprinting, lifting.", ["Hip thrust", "Romanian deadlift", "Bulgarian split squat", "Glute bridge"]),
        P("glute-med", "Outer glute", "gluteus medius", "The upper, outer hip. Moves your leg out and keeps knees from caving in.", ["Hip abduction machine", "Single-leg glute bridge", "Step-up"])
      ] },
    { id: "quads", name: "Quads", group: "legs",
      does: "Four heads on the front of your thigh that straighten your knee: squats, stairs, standing up. The fourth (vastus intermedius) sits underneath the other three.",
      tip: "Let your knees travel forward over your toes. That's safe, and it's how the quads get worked.",
      parts: [
        P("quad-outer", "Outer quad", "vastus lateralis", "The big outer sweep of the thigh.", ["Leg press", "Hack squat", "Back squat"]),
        P("quad-middle", "Middle quad", "rectus femoris", "Down the middle; it also crosses the hip, so leg extensions hit it well.", ["Leg extension", "Walking lunge", "Goblet squat"]),
        P("quad-inner", "Inner quad", "vastus medialis (teardrop)", "The teardrop above your inner knee. Deep knee bends and the last part of a leg extension.", ["Bulgarian split squat", "Leg extension", "Goblet squat"])
      ] },
    { id: "adductors", name: "Inner thighs", group: "legs",
      does: "Pull your legs together and help you get out of the bottom of a squat.",
      tip: "Deep squats with your feet a little wider work your inner thighs well.",
      parts: [P("adductors", "Inner thighs", "adductors", "The inside of your thigh.", ["Hip adduction machine", "Goblet squat", "Bulgarian split squat"])] },
    { id: "hamstrings", name: "Hamstrings", group: "legs",
      does: "Muscles on the back of your thigh that bend your knee and help your glutes drive your hips forward. Strong hamstrings protect your knees.",
      tip: "On Romanian deadlifts, push your hips back until you feel a stretch, then stand up.",
      parts: [
        P("hams-outer", "Outer hamstring", "biceps femoris", "The outside of the back of your thigh.", ["Lying hamstring curl", "Romanian deadlift"]),
        P("hams-inner", "Inner hamstrings", "semitendinosus and semimembranosus", "The inside of the back of your thigh.", ["Seated hamstring curl", "Stability ball leg curl", "Romanian deadlift"])
      ] },
    { id: "calves", name: "Calves", group: "legs",
      does: "Push you up onto your toes for every step, jump, and stair.",
      tip: "Pause for a second at the bottom of every rep. Bouncing lets your tendons do the work.",
      parts: [
        P("calf-inner", "Inner calf", "gastrocnemius, inner head", "The bigger, lower-hanging inner bulge.", ["Standing calf raise", "Single-leg calf raise"]),
        P("calf-outer", "Outer calf", "gastrocnemius, outer head", "The outer bulge.", ["Standing calf raise", "Leg press calf raise"]),
        P("soleus", "Soleus", "under the calf", "A flat muscle underneath. Bent-knee raises work it most.", ["Seated calf raise"])
      ] }
];

const MM_GROUP_LABEL = { chest: "Chest", shoulders: "Shoulders", back: "Back", arms: "Arms", core: "Core", legs: "Legs" };
const mmPart = (id) => { for (const g of MUSCLE_MAP) { const p = g.parts.find((x) => x.id === id); if (p) return { g, p }; } return null; };
const mmGroup = (id) => MUSCLE_MAP.find((g) => g.id === id) || (mmPart(id) || {}).g || null;

/* Which part each shape in the drawing belongs to. Each muscle in
   muscle-art.js is drawn as one or more shapes per side; these rules sort
   them into heads by where they sit (higher/lower, nearer/farther from the
   middle of the body). The chest and biceps are single shapes, so they're
   cut into bands. */
function mmShapes(d) {
    return d.split(/(?=M)/).map((sd) => {
        const n = (sd.match(/-?\d+(\.\d+)?/g) || []).map(Number);
        const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1);
        const cx = xs.reduce((a, b) => a + b, 0) / (xs.length || 1), cy = ys.reduce((a, b) => a + b, 0) / (ys.length || 1);
        return { d: sd, cx, cy, dx: Math.abs(cx - 512), x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    });
}
function mmPieces(key, view, d) {
    const subs = mmShapes(d);
    const out = [];
    const put = (sub, parts, clip) => out.push({ d: sub.d, parts, clip: clip || null });
    const byDx = subs.slice().sort((a, b) => b.dx - a.dx);   // farthest from the middle first
    const byY = subs.slice().sort((a, b) => a.cy - b.cy);    // highest first
    const simple = { SHOULDER_FRONT: "delt-front", SHOULDER_SIDE: "delt-side", SHOULDER_REAR: "delt-rear", RHOMBOID: "rhomboids", LATISSIMUS: "lats",
        LOWER_BACK: "erectors", OBLIQUE: "obliques", ADDUCTOR: "adductors", ABDUCTOR: "glute-med", QUADS: "quad-inner" };
    if (simple[key]) { subs.forEach((s) => put(s, [simple[key]])); return out; }
    switch (key) {
    case "CHEST": // three bands: upper, middle, lower
        subs.forEach((s) => {
            const h = s.y1 - s.y0, b1 = s.y0 + h * 0.36, b2 = s.y0 + h * 0.7;
            put(s, ["chest-upper"], [s.x0 - 5, s.y0 - 5, s.x1 - s.x0 + 10, b1 - s.y0 + 5]);
            put(s, ["chest-middle"], [s.x0 - 5, b1, s.x1 - s.x0 + 10, b2 - b1]);
            put(s, ["chest-lower"], [s.x0 - 5, b2, s.x1 - s.x0 + 10, s.y1 - b2 + 5]);
        });
        break;
    case "BICEPS": // outer half is the long head (with the brachialis beside it), inner half the short head
        subs.forEach((s) => {
            const mid = (s.x0 + s.x1) / 2, left = s.cx < 512;
            const outerRect = left ? [s.x0 - 5, s.y0 - 5, mid - s.x0 + 5, s.y1 - s.y0 + 10] : [mid, s.y0 - 5, s.x1 - mid + 5, s.y1 - s.y0 + 10];
            const innerRect = left ? [mid, s.y0 - 5, s.x1 - mid + 5, s.y1 - s.y0 + 10] : [s.x0 - 5, s.y0 - 5, mid - s.x0 + 5, s.y1 - s.y0 + 10];
            put(s, ["biceps-long", "brachialis"], outerRect);
            put(s, ["biceps-short"], innerRect);
        });
        break;
    case "TRAPEZIUS":
        if (view === "front") { subs.forEach((s) => put(s, ["traps-upper"])); break; }
        if (byY.length === 1) { put(byY[0], ["traps-upper", "traps-middle", "traps-lower"]); break; }
        put(byY[0], ["traps-upper"]);
        if (byY.length === 2) put(byY[1], ["traps-middle", "traps-lower"]);
        else byY.slice(1).forEach((s, i, arr) => put(s, [i === arr.length - 1 ? "traps-lower" : "traps-middle"]));
        break;
    case "TRICEPS":
        if (view === "front") { subs.forEach((s) => put(s, ["triceps-long"])); break; }
        if (byDx.length === 1) { put(byDx[0], ["triceps-long", "triceps-lateral", "triceps-medial"]); break; }
        byDx.forEach((s, i, arr) => put(s, i === 0 ? ["triceps-lateral"] : i === arr.length - 1 ? (arr.length === 2 ? ["triceps-long", "triceps-medial"] : ["triceps-long"]) : ["triceps-medial"]));
        break;
    case "FOREARM":
        byDx.forEach((s, i, arr) => {
            if (view === "front") put(s, [i === 0 ? "forearm-extensors" : "forearm-flexors"]);
            else put(s, [i === arr.length - 1 ? "forearm-flexors" : "forearm-extensors"]);
        });
        break;
    case "CORE":
        byY.forEach((s, i, arr) => put(s, [i < Math.ceil(arr.length / 2) ? "abs-upper" : "abs-lower"]));
        break;
    case "GLUTEUS":
        if (byY.length === 1) put(byY[0], ["glute-max"]);
        else byY.forEach((s, i) => put(s, [i === 0 ? "glute-med" : "glute-max"]));
        break;
    case "QUADRICEPS": {
        const outer = byDx[0], rest = subs.filter((s) => s !== outer).sort((a, b) => a.cy - b.cy);
        put(outer, ["quad-outer"]);
        rest.forEach((s, i) => put(s, [i === 0 ? "quad-middle" : "quad-inner"]));
        break;
    }
    case "HAMSTRINGS":
        byDx.forEach((s, i) => put(s, [i === 0 ? "hams-outer" : "hams-inner"]));
        break;
    case "CALVES": {
        if (view === "back") {
            const sole = byY[byY.length - 1];
            put(sole, ["soleus"]);
            const rest = byDx.filter((s) => s !== sole);
            rest.forEach((s, i, arr) => put(s, arr.length === 1 ? ["calf-inner", "calf-outer"] : [i === 0 ? "calf-outer" : "calf-inner"]));
        } else {
            const inner = byDx[byDx.length - 1];
            const rest = byDx.filter((s) => s !== inner);
            const sole = rest.slice().sort((a, b) => b.cy - a.cy)[0];
            put(inner, ["calf-inner"]);
            rest.forEach((s) => put(s, [s === sole ? "soleus" : "calf-outer"]));
        }
        break;
    }
    default:
        break;
    }
    return out;
}
const MM_PIECES = {};
function mmViewPieces(sex, view) {
    const k = `${sex}-${view}`;
    if (!MM_PIECES[k]) MM_PIECES[k] = MUSCLE_ART[sex][view].muscles.flatMap(([key, d]) => mmPieces(key, view, d));
    return MM_PIECES[k];
}
// Which views (front/back) show a part
function muscleViews(partId, sex) {
    return ["front", "back"].filter((v) => mmViewPieces(sex || "male", v).some((pc) => pc.parts.includes(partId)));
}

function muscleMapSvg(sex, view) {
    const a = MUSCLE_ART[sex][view];
    const pieces = mmViewPieces(sex, view);
    const defs = [];
    const order = MUSCLE_MAP.flatMap((g) => g.parts.map((p) => p.id));
    const groups = order.map((partId) => {
        const mine = pieces.filter((pc) => pc.parts[0] === partId);
        if (!mine.length) return "";
        const paths = mine.map((pc) => {
            let clip = "";
            if (pc.clip) {
                const id = `mm-c-${sex}-${view}-${defs.length}`;
                defs.push(`<clipPath id="${id}"><rect x="${pc.clip[0].toFixed(1)}" y="${pc.clip[1].toFixed(1)}" width="${pc.clip[2].toFixed(1)}" height="${pc.clip[3].toFixed(1)}"/></clipPath>`);
                clip = ` clip-path="url(#${id})"`;
            }
            return `<path d="${pc.d}" data-parts="${pc.parts.join(" ")}"${clip}/>`;
        }).join("");
        const name = mmPart(partId).p.name;
        return `<g class="mm-muscle" data-m="${partId}" tabindex="-1" role="button" aria-label="${escapeHtml(name)}"><title>${escapeHtml(name)}</title>${paths}</g>`;
    }).join("");
    return `<svg class="mm-svg" viewBox="150 30 724 1480" xmlns="http://www.w3.org/2000/svg" focusable="false"><defs>${defs.join("")}</defs>
        <g class="mm-body">${a.outline.map((d) => `<path d="${d}"/>`).join("")}</g>${groups}</svg>`;
}

function setupMuscleMap() {
    const root = document.getElementById("muscle-map");
    if (!root || typeof MUSCLE_ART !== "object") return;
    const stage = root.querySelector(".mm-stage");
    const panel = document.getElementById("mm-panel");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panelIntro = panel.innerHTML;
    let sex = store.get("gu-mm-body") || (getProfile().sex === "female" ? "female" : "male");
    if (!["male", "female"].includes(sex)) sex = "male";
    let angle = 0, anim = null, drag = null, suppressClick = false;
    let sel = { group: null, part: null }, hover = null, partsOpen = false;
    const norm = (x) => ((x % 360) + 540) % 360 - 180;
    const facing = () => (Math.abs(norm(angle)) <= 90 ? "front" : "back");
    window.addEventListener("levelchange", () => show());
    document.addEventListener("click", (e) => { const b = e.target.closest("[data-set-level]"); if (b && root.contains(b)) setLevel(b.dataset.setLevel); });
    panel.addEventListener("toggle", (e) => { if (e.target.classList && e.target.classList.contains("mm-parts-wrap")) partsOpen = e.target.open; }, true);

    // Two faces on a card that turns in 3D: front at 0 degrees, back at 180
    function build() {
        stage.innerHTML = `<div class="mm-turntable">
            <div class="mm-face" data-face="front">${muscleMapSvg(sex, "front")}</div>
            <div class="mm-face mm-face-back" data-face="back">${muscleMapSvg(sex, "back")}</div>
        </div><div class="mm-floor" aria-hidden="true"></div>`;
        root.querySelectorAll("[data-mm-sex]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mmSex === sex)));
        draw();
    }

    function draw() {
        const turn = stage.querySelector(".mm-turntable");
        // 3D only while turning; at rest it's a plain flat drawing (avoids 3D rendering glitches on some phones)
        const resting = Math.abs(norm(angle)) % 180 < 0.01 && !(drag && drag.moved);
        turn.classList.toggle("is-rest", resting);
        turn.style.transform = resting ? "" : `rotateY(${angle.toFixed(1)}deg)`;
        const face = facing();
        stage.querySelectorAll(".mm-face").forEach((f) => {
            const on = f.dataset.face === face;
            f.classList.toggle("is-active", on);
            f.setAttribute("aria-hidden", on ? "false" : "true");
            f.querySelectorAll(".mm-muscle").forEach((g) => g.setAttribute("tabindex", on ? "0" : "-1"));
        });
        // The picked muscle's parts in light red; the picked or pointed-at part in strong red
        const g = sel.group ? mmGroup(sel.group) : null;
        const groupParts = g ? g.parts.map((p) => p.id) : [];
        const strong = [sel.part, hover].filter(Boolean);
        stage.querySelectorAll("path[data-parts]").forEach((pth) => {
            const parts = pth.dataset.parts.split(" ");
            const on = parts.some((p) => strong.includes(p));
            pth.classList.toggle("is-on", on);
            pth.classList.toggle("is-group", !on && parts.some((p) => groupParts.includes(p)));
        });
        root.querySelectorAll("[data-mm-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mmView === face)));
        stage.dataset.angle = String(Math.round(norm(angle)));
        root.querySelector(".mm-view-label").textContent = face === "front" ? "Front view" : "Back view";
        const floor = stage.querySelector(".mm-floor");
        floor.style.transform = `translateX(-50%) scaleX(${(0.55 + 0.45 * Math.abs(Math.cos((angle * Math.PI) / 180))).toFixed(3)})`;
    }

    function turnTo(target) {
        if (anim) cancelAnimationFrame(anim);
        const from = angle, diff = norm(target - from) || (target !== from ? 180 : 0);
        if (reduce || Math.abs(diff) < 1) { angle = from + diff; draw(); return; }
        const t0 = performance.now(), dur = 520;
        const step = (now) => {
            const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
            angle = t < 1 ? from + diff * e : from + diff; draw();
            anim = t < 1 ? requestAnimationFrame(step) : null;
        };
        anim = requestAnimationFrame(step);
    }

    // Turn to the side of the body that shows a part
    function facePart(partId) {
        const views = muscleViews(partId, sex);
        if (views.length && !views.includes(facing())) turnTo(views[0] === "back" ? 180 : 0);
    }

    // Panel: the muscle, each of its heads or parts, and the best exercises for each
    function show() {
        const g = sel.group ? mmGroup(sel.group) : null;
        root.querySelectorAll("[data-mm-pick]").forEach((b) => b.setAttribute("aria-pressed", String(Boolean(g) && b.dataset.mmPick === g.id)));
        draw();
        if (!g) { panel.innerHTML = panelIntro; return; }
        const exList = (ex) => `<ul class="mm-ex">${ex.map((n) => `<li><button type="button" class="chip" data-howto="${escapeHtml(n)}">${escapeHtml(n)}</button><button type="button" class="chip mm-add" data-add-ex="${escapeHtml(n)}" aria-label="Add ${escapeHtml(n)} to my workout">+</button></li>`).join("")}</ul>`;
        const single = g.parts.length === 1;
        const picked = sel.part ? g.parts.find((p) => p.id === sel.part) : null;
        // the top pick for each part, so one list covers the whole muscle
        const best = [...new Set(g.parts.flatMap((p) => p.ex.slice(0, single ? 4 : 2)))].slice(0, 5);
        const partWord = /delt|triceps|biceps|quad/.test(g.parts[0].id) ? "heads" : "parts";
        // Beginner: just the muscle and its best exercises. Intermediate: each part. Advanced and up: anatomy names too
        const lvl = levelRank(getLevel());
        const aka = (p) => (lvl >= 2 ? ` <small>${escapeHtml(p.aka)}</small>` : "");
        panel.innerHTML = `
            <p class="mm-eyebrow">${MM_GROUP_LABEL[g.group]}</p>
            <h3 class="mm-title"><span class="mm-dot" aria-hidden="true"></span>${escapeHtml(picked && !single ? picked.name : g.name)}</h3>
            ${picked && !single ? `<p class="mm-aka">${lvl >= 2 ? `${escapeHtml(picked.aka)} &middot; ` : ""}part of the ${escapeHtml(g.name.toLowerCase())}</p>` : ""}
            <p>${escapeHtml(g.does)}</p>
            <h4>Best exercises</h4>
            <p class="mm-add-hint">Tap <strong>+</strong> to add one to your workout.</p>${exList(picked && !single ? picked.ex : best)}
            ${single ? (lvl >= 2 ? `<p class="mm-aka">${escapeHtml(g.parts[0].aka)}: ${escapeHtml(g.parts[0].where)}</p>` : "") : `
            <details class="mm-parts-wrap"${picked || partsOpen || lvl >= 2 ? " open" : ""}>
            <summary>See each part (${g.parts.length} ${partWord})</summary>
            <ol class="mm-parts">${g.parts.map((p) => `
                <li class="mm-part${sel.part === p.id ? " is-on" : ""}" data-part="${p.id}">
                    <button type="button" class="mm-part-name" data-mm-part="${p.id}" aria-pressed="${sel.part === p.id}"><span class="mm-part-mark" aria-hidden="true"></span>${escapeHtml(p.name)}${aka(p)}</button>
                    <p>${escapeHtml(p.where)}</p>
                    <p class="mm-best">Best for it:</p>${exList(p.ex)}
                </li>`).join("")}</ol></details>`}
            <h4>Beginner tip</h4>
            <p>${escapeHtml(g.tip)}</p>
            <a class="text-link" href="#${g.group}">All ${MM_GROUP_LABEL[g.group].toLowerCase()} exercises</a>`;
    }
    function pick(partId) {
        const hit = mmPart(partId);
        if (!hit) return;
        sel = { group: hit.g.id, part: partId };
        show();
    }

    // Pointer: hover previews (mouse), click or tap picks, drag turns
    const partAt = (target) => { const g = target && target.closest ? target.closest(".mm-muscle") : null; return g ? g.dataset.m : null; };
    stage.addEventListener("pointerover", (e) => {
        if (e.pointerType !== "mouse" || (drag && drag.moved)) return;
        const id = partAt(e.target);
        if (id !== hover) { hover = id; draw(); }
    });
    stage.addEventListener("pointerleave", () => { if (hover) { hover = null; draw(); } });
    stage.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        drag = { x: e.clientX, start: angle, moved: false, id: e.pointerId };
        if (anim) cancelAnimationFrame(anim);
    });
    stage.addEventListener("pointermove", (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) > 6) {
            drag.moved = true;
            hover = null;
            stage.classList.add("is-dragging");
            try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
        if (drag.moved) { angle = drag.start + dx * 0.7; draw(); }
    });
    const endDrag = (e) => {
        if (!drag) return;
        const moved = drag.moved;
        if (!moved && e.type === "pointerup") { const id = partAt(e.target); if (id) pick(id); }
        drag = null;
        stage.classList.remove("is-dragging");
        if (moved) { suppressClick = true; turnTo(Math.round(angle / 180) * 180); draw(); }
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("click", (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; } }, true);

    // Keyboard: tab through the muscles, Enter picks, arrow keys turn
    stage.addEventListener("focusin", (e) => { const id = partAt(e.target); if (id) pick(id); });
    stage.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); turnTo(Math.round(angle / 180) * 180 + 180); return; }
        const id = partAt(e.target);
        if (id && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(id); panel.focus(); }
    });

    // Pointing at a part in the panel lights it on the body
    panel.addEventListener("pointerover", (e) => {
        const li = e.target.closest("[data-part]");
        const id = li ? li.dataset.part : null;
        if (id !== hover) { hover = id; draw(); }
    });
    panel.addEventListener("pointerleave", () => { if (hover) { hover = null; draw(); } });

    // Buttons: views, turning, body type, the muscle list, and parts in the panel
    root.addEventListener("click", (e) => {
        const v = e.target.closest("[data-mm-view]");
        if (v) turnTo(v.dataset.mmView === "back" ? 180 : 0);
        const t = e.target.closest("[data-mm-turn]");
        if (t) turnTo(Math.round(angle / 180) * 180 + Number(t.dataset.mmTurn) * 180);
        const s = e.target.closest("[data-mm-sex]");
        if (s && s.dataset.mmSex !== sex) { sex = s.dataset.mmSex; store.set("gu-mm-body", sex); build(); }
        const p = e.target.closest("[data-mm-pick]");
        if (p) {
            const g = mmGroup(p.dataset.mmPick);
            if (g) {
                // turn to the side that shows the most of this muscle's parts
                const count = (v) => g.parts.filter((x) => muscleViews(x.id, sex).includes(v)).length;
                const best = count("back") > count("front") ? "back" : "front";
                if (best !== facing()) turnTo(best === "back" ? 180 : 0);
                sel = { group: g.id, part: null };
                show();
            }
        }
        const pp = e.target.closest("[data-mm-part]");
        if (pp) { facePart(pp.dataset.mmPart); pick(pp.dataset.mmPart); }
    });
    root.querySelector(".mm-picks").innerHTML = Object.keys(MM_GROUP_LABEL).map((grp) => `
        <li><span class="mm-pick-group">${MM_GROUP_LABEL[grp]}</span>${MUSCLE_MAP.filter((m) => m.group === grp)
            .map((m) => `<button type="button" class="chip" data-mm-pick="${m.id}" aria-pressed="false">${escapeHtml(m.name)}</button>`).join("")}</li>`).join("");
    build();
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
   Shared chart: solid line for what happened, dashed for the projection
   ========================================================= */
function drawTrendChart(svg, points, projection, { unit = "", W = 720, H = 300, label = (v) => fmt(v) } = {}) {
    const pad = { l: 56, r: 20, t: 20, b: 36 };
    const all = [...points, ...projection];
    const t0 = all[0].date.getTime(), t1 = all[all.length - 1].date.getTime();
    const vals = all.map((p) => p.value);
    const lo = Math.min(...vals) * 0.92, hi = Math.max(...vals) * 1.06 + 0.01;
    const x = (d) => pad.l + ((d.getTime() - t0) / Math.max(1, t1 - t0)) * (W - pad.l - pad.r);
    const y = (v) => pad.t + (1 - (v - lo) / Math.max(0.01, hi - lo)) * (H - pad.t - pad.b);
    const line = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
    let out = "";
    for (let i = 0; i <= 4; i++) {
        const v = lo + ((hi - lo) * i) / 4;
        out += `<line class="chart-grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/><text class="chart-label" x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${label(v)}</text>`;
    }
    const last = points[points.length - 1];
    out += `<text class="chart-label" x="${pad.l}" y="${H - 10}">${shortDate(points[0].date)}</text>`;
    if (projection.length) {
        out += `<text class="chart-label" x="${W - pad.r}" y="${H - 10}" text-anchor="end">${shortDate(projection[projection.length - 1].date)}</text>`;
        out += `<path class="chart-proj" d="${line([last, ...projection])}"/>`;
    }
    out += `<path class="chart-line" d="${line(points)}"/>`;
    out += points.map((p) => `<circle class="chart-dot" cx="${x(p.date)}" cy="${y(p.value)}" r="4.5"><title>${shortDate(p.date)}: ${label(p.value)} ${unit}</title></circle>`).join("");
    svg.innerHTML = out;
}

// About how many reps someone could do at weight w, given an estimated max (Epley, turned around)
const repsAt = (max, w) => (w > 0 ? Math.max(1, Math.floor(30 * (max / w - 1) + 1e-9)) : 0);

/* =========================================================
   FEATURE: My progress tabs (me.html)
   Sections marked data-me-tab="overview|lifts|cardio|you" become
   four short tabs instead of one long page. The first section of each
   tab names it (data-me-label). Links like me.html#cardio or
   #reset-progress open the right tab. Without JavaScript, everything shows.
   ========================================================= */
const ME_TABS = ["overview", "active", "lifts", "log", "cardio", "you"];
function setupMeTabs() {
    const sections = [...document.querySelectorAll("[data-me-tab]")];
    if (!sections.length) return;
    const tabs = ME_TABS.filter((t) => sections.some((x) => x.dataset.meTab === t));
    const label = (t) => (sections.find((x) => x.dataset.meTab === t && x.dataset.meLabel) || {}).dataset?.meLabel || t;
    sections.forEach((x, i) => { if (!x.id) x.id = `me-panel-${i}`; x.setAttribute("role", "tabpanel"); x.setAttribute("aria-labelledby", `me-tab-${x.dataset.meTab}`); });
    sections[0].insertAdjacentHTML("beforebegin", `
<nav class="me-tabs-wrap" aria-label="Your progress">
    <div class="me-tabs container wide" role="tablist">${tabs.map((t) => `<button type="button" role="tab" class="me-tab" id="me-tab-${t}" data-me-go="${t}" aria-controls="${sections.filter((x) => x.dataset.meTab === t).map((x) => x.id).join(" ")}">${escapeHtml(label(t))}</button>`).join("")}</div>
</nav>`);
    const bar = document.querySelector(".me-tabs-wrap");
    const buttons = [...bar.querySelectorAll(".me-tab")];
    let current = null;
    function select(t, { focus = false, scroll = false } = {}) {
        if (!tabs.includes(t)) t = tabs[0];
        current = t;
        sections.forEach((x) => { x.hidden = x.dataset.meTab !== t; });
        buttons.forEach((b) => { const on = b.dataset.meGo === t; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
        try { sessionStorage.setItem("gu-me-tab", t); } catch (e) { /* ignore */ }
        if (scroll && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start" });
        window.dispatchEvent(new CustomEvent("metab", { detail: t }));
    }
    bar.addEventListener("click", (e) => { const b = e.target.closest("[data-me-go]"); if (b) select(b.dataset.meGo, { scroll: true }); });
    bar.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(current);
        const next = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : e.key === "Home" ? tabs[0] : e.key === "End" ? tabs[tabs.length - 1] : null;
        if (next) { e.preventDefault(); select(next, { focus: true }); }
    });
    // Links into a tab (me.html#cardio, #reset-progress): open that tab first
    const tabOf = (el) => { const sec = el && el.closest("[data-me-tab]"); return sec ? sec.dataset.meTab : null; };
    addRoute(/^#([A-Za-z][\w-]*)$/, (m) => {
        if (tabs.includes(m[1])) { select(m[1]); return { target: bar }; }
        const el = document.getElementById(m[1]);
        const t = tabOf(el);
        if (!t) return null;
        select(t);
        return { target: el };
    });
    // Open on: the tab a link points to, else the one you were on this visit, else Overview
    const hash = location.hash.slice(1);
    let start = null;
    try { start = tabs.includes(hash) ? hash : tabOf(hash && document.getElementById(hash)); } catch (e) { start = null; }
    if (!start) { try { start = sessionStorage.getItem("gu-me-tab"); } catch (e) { start = null; } }
    select(tabs.includes(start) ? start : "overview");
    // "Add one" style links to other tabs on this page
    document.addEventListener("click", (e) => {
        const a = e.target.closest("[data-me-open]");
        if (a) { e.preventDefault(); select(a.dataset.meOpen, { scroll: true }); }
    });
}

/* =========================================================
   FEATURE: Active workout (the Active tab on My progress)
   Just the workout you're doing now: today's day of your active plan,
   what's done, and the sets you've logged today. Continue or cancel.
   ========================================================= */
function setupActiveWorkout() {
    const box = document.getElementById("active-workout");
    if (!box) return;
    function render() {
        const info = currentPlanInfo();
        const unit = getProfile().unit;
        const today = isoDate(new Date());
        if (!info) {
            box.innerHTML = `<p class="kicker">Active workout</p><h2>No active workout</h2>
                <p class="section-lede">Start a ready-made plan or build your own, and the workout you're on shows up here.</p>
                <p class="dash-actions"><a class="btn btn-primary btn-compact" href="programs.html">Pick a plan</a> <a class="btn btn-compact" href="programs.html#build">Build your own</a></p>`;
            return;
        }
        const paused = planPaused();
        const doneN = info.items.filter((x) => x.done).length;
        const rows = info.items.map((x) => {
            const entry = (logFor(x.name) || []).find((e) => e.date === today);
            const sets = entry ? entry.sets.map((st) => (st.w ? `${trimNum(roundWeight(toUnit(st.w, entry.unit, unit), unit))} × ${st.r}` : `${st.r} reps`)) : [];
            return `<li class="aw-item${x.done ? " is-done" : ""}">
                <span class="aw-check" aria-hidden="true">${x.done ? "&#10003;" : ""}</span>
                <span class="aw-main"><strong>${typeof equipIcon === "function" ? equipIcon(x.name) : ""}${escapeHtml(x.name)}</strong>
                    <small>${escapeHtml(x.d)}${x.done ? " · done" : ""}</small>
                    ${sets.length ? `<span class="aw-sets">${sets.map((t, i) => `<span>Set ${i + 1}: ${escapeHtml(t)}</span>`).join("")}</span>` : ""}</span>
            </li>`;
        }).join("");
        box.innerHTML = `
            <p class="kicker">${paused ? "Paused" : info.weekDone ? "Week done" : "Active workout"}</p>
            <h2>${escapeHtml(info.weekDone ? "All done this week" : info.goal === "custom" ? `Day ${info.di + 1}: ${info.title}` : `Day ${info.di + 1}: ${info.title}`)}</h2>
            <p class="section-lede">${escapeHtml(info.name)}${info.goal === "custom" ? "" : ` · Week ${info.week}`} · ${doneN} of ${info.items.length} done</p>
            <div class="aw-bar" aria-hidden="true"><div style="width:${info.items.length ? Math.round((doneN / info.items.length) * 100) : 0}%"></div></div>
            ${info.weekDone ? `<p class="section-lede">Nice work. Up next on the Overview tab has a workout ready for your next training day.</p>` : `<ul class="aw-list">${rows}</ul>`}
            <p class="dash-actions">
                ${info.weekDone ? `<button type="button" class="btn btn-primary btn-compact" data-me-open="overview">See what's next</button>` : `<a class="btn btn-primary btn-compact" href="${info.href}">${paused || doneN ? "Continue workout" : "Start workout"}</a>`}
                ${!paused && !info.weekDone ? `<button type="button" class="btn btn-compact" data-cancel-workout>Cancel workout</button>` : ""}
            </p>`;
    }
    window.addEventListener("logchange", render);
    window.addEventListener("planpause", render);
    window.addEventListener("metab", (e) => { if (e.detail === "active") render(); });
    render();
}

/* =========================================================
   FEATURE: Workout log (the Log tab on My progress)
   Every logged set, newest first, grouped by day. Filter to one
   exercise, remove a mistaken entry (with Undo). Reads gu-log only.
   ========================================================= */
function setupLogHistory() {
    const daysEl = document.getElementById("log-days");
    if (!daysEl) return;
    const filter = document.getElementById("log-filter");
    const totals = document.getElementById("log-totals");
    const more = document.getElementById("log-more");
    const status = document.getElementById("log-history-status");
    const PAGE = 8; // weeks at a time
    let shown = PAGE, undo = null;
    // Which weeks and days you opened stay open when the list redraws (null = not touched yet)
    let opened = null;
    const isOpen = (key, fallback) => (opened ? opened.has(key) : fallback);

    // One row per exercise per day: { date, name, unit, sets }
    function rows() {
        const log = getLog();
        return Object.entries(log).flatMap(([name, list]) => (Array.isArray(list) ? list : [])
            .filter((e) => e && typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && Array.isArray(e.sets))
            .map((e) => ({ name, date: e.date, unit: e.unit === "kg" ? "kg" : "lb", sets: e.sets.filter((st) => st && Number.isFinite(Number(st.r))) })))
            .filter((r) => r.sets.length)
            // Only workouts you finished (tapped Finish workout): sets from that day that belong to the finished workout
            .filter((r) => submitted(r));
    }
    function submitted(r) {
        const ss = (store.get("gu-sessions", []) || []).filter((x) => x && x.date === r.date);
        return ss.some((x) => !Array.isArray(x.names) || x.names.includes(r.name));
    }
    function setText(st, from, to) {
        const w = Number(st.w) || 0, r = Number(st.r) || 0;
        return w ? `${trimNum(roundWeight(toUnit(w, from, to), to))} ${to} × ${r}` : `${r} reps`;
    }
    function render() {
        const unit = getProfile().unit;
        const all = rows();
        // The exercise list: every name you've logged, A to Z
        const names = [...new Set(all.map((r) => r.name))].sort((a, b) => a.localeCompare(b));
        const keep = filter.value;
        filter.innerHTML = `<option value="">All exercises (${names.length})</option>` + names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
        filter.value = names.includes(keep) ? keep : "";
        const pick = filter.value;
        const list = all.filter((r) => !pick || r.name === pick);
        const reps = list.reduce((t, r) => t + r.sets.reduce((u, st) => u + (Number(st.r) || 0), 0), 0);
        const setCount = list.reduce((t, r) => t + r.sets.length, 0);
        const dayCount = new Set(list.map((r) => r.date)).size;
        const heaviest = list.flatMap((r) => r.sets.map((st) => ({ w: toUnit(Number(st.w) || 0, r.unit, unit), r: Number(st.r) || 0 }))).sort((a, b) => b.w - a.w || b.r - a.r)[0];
        totals.innerHTML = list.length ? `
            <li><strong>${fmt(reps)}</strong> reps</li>
            <li><strong>${fmt(setCount)}</strong> sets</li>
            <li><strong>${fmt(dayCount)}</strong> day${dayCount === 1 ? "" : "s"}</li>
            ${pick && heaviest && heaviest.w ? `<li><strong>${trimNum(roundWeight(heaviest.w, unit))}</strong> ${unit} heaviest set (× ${heaviest.r})</li>` : ""}` : "";
        const pending = Object.values(getLog()).reduce((t, list) => t + (Array.isArray(list) ? list.length : 0), 0) - all.length;
        if (!undo && pending > 0) status.textContent = `${pending} exercise${pending === 1 ? "" : "s"} logged in a workout you haven't finished yet. Tap Finish workout on Plans to add ${pending === 1 ? "it" : "them"} here.`;
        if (!all.length) {
            daysEl.innerHTML = `<p class="me-unlock">Nothing here yet. Finish a workout (log your sets, then tap <strong>Finish workout</strong>) and it shows up here.</p>`;
            more.hidden = true;
            return;
        }
        // Group by week (Monday to Sunday), then by day, newest first
        const byDay = new Map();
        list.slice().sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name)).forEach((r) => {
            if (!byDay.has(r.date)) byDay.set(r.date, []);
            byDay.get(r.date).push(r);
        });
        const byWeek = new Map();
        [...byDay.entries()].forEach(([date, items]) => {
            const wk = isoDate(mondayOf(parseIso(date)));
            if (!byWeek.has(wk)) byWeek.set(wk, []);
            byWeek.get(wk).push([date, items]);
        });
        const weeks = [...byWeek.entries()];
        const count = (items) => ({ sets: items.reduce((t, r) => t + r.sets.length, 0), reps: items.reduce((t, r) => t + r.sets.reduce((u, st) => u + (Number(st.r) || 0), 0), 0) });
        const plural = (n, w) => `${fmt(n)} ${w}${n === 1 ? "" : "s"}`;
        const thisWeek = isoDate(mondayOf(new Date()));
        const fmtDay = (d, opts) => d.toLocaleDateString("en-US", { ...opts, year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
        daysEl.innerHTML = weeks.slice(0, shown).map(([wk, dayList], wi) => {
            const start = parseIso(wk), end = addDays(start, 6);
            const all = dayList.flatMap(([, items]) => items);
            const c = count(all);
            const label = wk === thisWeek ? "This week" : wk === isoDate(addDays(mondayOf(new Date()), -7)) ? "Last week" : `Week of ${fmtDay(start, { month: "short", day: "numeric" })}`;
            return `<details class="log-week" data-key="w${wk}"${isOpen(`w${wk}`, wi === 0) ? " open" : ""}>
                <summary>
                    <span class="log-week-title">${escapeHtml(label)}<small>${escapeHtml(fmtDay(start, { month: "short", day: "numeric" }))} – ${escapeHtml(fmtDay(end, { month: "short", day: "numeric" }))}</small></span>
                    <span class="log-week-stats">${plural(dayList.length, "day")} · ${plural(c.sets, "set")} · ${plural(c.reps, "rep")}</span>
                </summary>
                ${dayList.map(([date, items], di) => {
                    const d = parseIso(date), dc = count(items);
                    return `<details class="log-day" data-key="d${date}"${isOpen(`d${date}`, wi === 0 && di === 0) ? " open" : ""}>
                        <summary><span>${escapeHtml(fmtDay(d, { weekday: "short", month: "short", day: "numeric" }))}</span>
                            <small>${plural(items.length, "exercise")} · ${plural(dc.sets, "set")} · ${plural(dc.reps, "rep")}</small></summary>
                        <ul class="log-day-list">${items.map((r) => `
                            <li>
                                <div class="log-day-top">
                                    <button type="button" class="log-day-name" data-log-only="${escapeHtml(r.name)}" aria-label="Show only ${escapeHtml(r.name)}">${typeof equipIcon === "function" ? equipIcon(r.name) : ""}${escapeHtml(r.name)}</button>
                                    <button type="button" class="text-button log-day-remove" data-log-remove="${escapeHtml(r.name)}|${date}" aria-label="Remove ${escapeHtml(r.name)} on ${escapeHtml(shortDate(d))}">Remove</button>
                                </div>
                                <ol class="log-sets">${r.sets.map((st, i) => `<li><span class="log-set-n">Set ${i + 1}</span>${escapeHtml(setText(st, r.unit, unit))}</li>`).join("")}</ol>
                            </li>`).join("")}</ul>
                    </details>`;
                }).join("")}
            </details>`;
        }).join("");
        more.textContent = "Show older weeks";
        more.hidden = weeks.length <= shown;
    }
    // Remember what was opened or closed
    daysEl.addEventListener("toggle", (e) => {
        const el = e.target;
        if (!el.matches || !el.matches("details[data-key]")) return;
        if (!opened) opened = new Set([...daysEl.querySelectorAll("details[data-key][open]")].map((x) => x.dataset.key));
        if (el.open) opened.add(el.dataset.key); else opened.delete(el.dataset.key);
    }, true);

    filter.addEventListener("change", () => { shown = PAGE; opened = null; render(); });
    more.addEventListener("click", () => { shown += PAGE; render(); });
    daysEl.addEventListener("click", (e) => {
        const only = e.target.closest("[data-log-only]");
        if (only) {
            filter.value = only.dataset.logOnly;
            shown = PAGE;
            opened = null;
            render();
            filter.focus();
            return;
        }
        const rm = e.target.closest("[data-log-remove]");
        if (!rm) return;
        const cut = rm.dataset.logRemove.lastIndexOf("|");
        const name = rm.dataset.logRemove.slice(0, cut), date = rm.dataset.logRemove.slice(cut + 1);
        const log = getLog();
        const list = Array.isArray(log[name]) ? log[name] : [];
        const i = list.findIndex((en) => en && en.date === date);
        if (i < 0) return;
        undo = { name, entry: list[i] };
        list.splice(i, 1);
        if (list.length) log[name] = list; else delete log[name];
        store.set(LOG_KEY, log);
        status.innerHTML = `Removed ${escapeHtml(name)} on ${escapeHtml(shortDate(parseIso(date)))}. <button type="button" class="text-button" id="log-undo">Undo</button>`;
        window.dispatchEvent(new CustomEvent("logchange", { detail: { name, removed: true } }));
        const u = document.getElementById("log-undo");
        if (u) u.focus();
    });
    status.addEventListener("click", (e) => {
        if (!e.target.closest("#log-undo") || !undo) return;
        const log = getLog();
        log[undo.name] = (Array.isArray(log[undo.name]) ? log[undo.name] : []).concat(undo.entry);
        store.set(LOG_KEY, log);
        status.textContent = `${undo.name} is back.`;
        window.dispatchEvent(new CustomEvent("logchange", { detail: { name: undo.name } }));
        undo = null;
    });
    window.addEventListener("logchange", render);
    window.addEventListener("profilechange", render);
    render();
}

/* =========================================================
   FEATURE: My progress page
   Pulls together everything logged on this device (or in the
   account, once signed in): lifts, cardio, and bodyweight.
   ========================================================= */
function setupDashboard() {
    const $ = (id) => document.getElementById(id);
    const stats = $("me-stats");
    if (!stats) return;
    const radios = [...document.querySelectorAll('input[name="trainfor"]')];
    let selected = null;

    const ADVICE = {
        strength: "Strength: most of your main-lift sets in the 3 to 8 rep range with 2 to 3 minutes of rest. Your projections show your estimated one-rep max.",
        endurance: "Endurance: sets of 12 to 20 reps with shorter rests (30 to 60 seconds), plus at least 150 minutes of cardio a week. Your projections show how many reps you could do at your working weight.",
        both: "Both: keep lifting in the plan's rep ranges and add regular cardio. You'll see your estimated max and your reps at your working weight."
    };

    function saveTrainFor(v) {
        const p = store.get(PROFILE_KEY, {}) || {};
        p.trainFor = v;
        store.set(PROFILE_KEY, p);
    }
    radios.forEach((r) => r.addEventListener("change", () => { saveTrainFor(r.value); renderAll(); }));

    function weekBounds(date = new Date()) { const s0 = mondayOf(date); return [s0, addDays(s0, 7)]; }

    function renderStats(profile) {
        const [ws, we] = weekBounds();
        const inWeek = (iso) => { const d = parseIso(iso); return d >= ws && d < we; };
        // Finished workouts only, the same count as the dashboard, milestones, and the Log tab
        const days = new Set([...activeDates()].filter(inWeek));
        const sets = finishedSetCount(finishedLog(), inWeek);
        const minutes = cardioMinutesInWeek();
        const weights = (store.get("gu-weights", []) || []).filter((w) => parseIso(w.date) >= addDays(new Date(), -7));
        const bw = weights.length ? weights.reduce((sum, w) => sum + toUnit(w.w, w.unit, profile.unit), 0) / weights.length : null;
        // Streaks, records, and milestones show up after a few workouts, so day one stays simple
        const hooked = activeDates().size >= 3;
        stats.innerHTML = `
            <div><span>Workout days</span><strong>${days.size}</strong></div>
            <div><span>Sets logged</span><strong>${sets}</strong></div>
            <div><span>Cardio minutes</span><strong>${minutes}<small> / 150</small></strong>
                <div class="mini-bar" aria-hidden="true"><div style="width:${Math.min(100, (minutes / 150) * 100)}%"></div></div></div>
            <div><span>Bodyweight (7-day avg)</span><strong>${bw ? `${trimNum(Math.round(bw * 10) / 10)}<small> ${profile.unit}</small>` : `<a href="tools.html#tool-weight">Add one</a>`}</strong></div>
            ${hooked ? `<div><span>Streak</span><strong>${weekStreak()}<small> week${weekStreak() === 1 ? "" : "s"}</small></strong></div>
            <div><span>Personal records</span><strong>${getPRs().length}</strong></div>` : ""}`;
        const ms = document.getElementById("milestones");
        const msHead = document.getElementById("milestones-head");
        if (msHead) msHead.hidden = !hooked;
        if (ms && !hooked) {
            ms.innerHTML = `<p class="me-unlock">Log ${3 - activeDates().size === 1 ? "1 more workout" : `${3 - activeDates().size} workouts`} to start tracking streaks, personal records, and milestones.</p>`;
        } else if (ms) {
            const list = milestones();
            const earned = list.filter((m) => m.done).length;
            ms.innerHTML = `<p class="milestone-count">${earned} of ${list.length} earned</p>
                <ul class="milestone-grid">${list.map((m) => `
                    <li class="${m.done ? "is-done" : ""}"><span class="milestone-mark" aria-hidden="true">${m.done ? "&#10003;" : ""}</span>
                        <strong>${escapeHtml(m.name)}</strong><small>${m.done ? "Earned" : escapeHtml(m.detail)}</small></li>`).join("")}</ul>`;
        }
        const recent = document.getElementById("recent-prs");
        if (recent) {
            const prs = getPRs().slice(-5).reverse();
            recent.innerHTML = prs.length ? `<h3 class="me-h3">Latest personal records</h3><ul class="weight-list">${prs.map((r) => `
                <li><span>${shortDate(parseIso(r.date))}</span><strong>${escapeHtml(r.name)}: ${r.kind === "max" ? `est. max ${fmt(r.value)}` : r.kind === "reps" ? `${r.value} reps at ${trimNum(r.weight)}` : r.kind === "minutes" ? `${r.value} min` : "fastest pace"}</strong><span></span></li>`).join("")}</ul>` : "";
        }
    }

    function liftSummary(name, profile) {
        const entries = finishedLog()[name] || [];
        const proj = projectLift(name, profile.unit, profile.experience, 8, entries);
        const last = entries[entries.length - 1];
        const lastSets = last.sets.map((s) => ({ w: roundWeight(toUnit(s.w, last.unit, profile.unit), profile.unit), r: s.r }));
        const top = Math.max(...lastSets.map((s) => s.w));
        const nowMax = proj.points[proj.points.length - 1].value;
        const laterMax = proj.projection[proj.projection.length - 1].value;
        return { entries, proj, last, lastSets, top, nowMax, laterMax, nowReps: repsAt(nowMax, top), laterReps: repsAt(laterMax, top) };
    }

    function renderLifts(profile, mode) {
        const tbody = document.querySelector("#lift-table tbody");
        // Finished workouts only, like the Log tab
        const log = finishedLog();
        const names = Object.keys(log)
            .sort((a, b) => log[b][log[b].length - 1].date.localeCompare(log[a][log[a].length - 1].date));
        $("th-now").textContent = mode === "endurance" ? "Reps now" : "Now";
        $("th-next").textContent = mode === "endurance" ? "Reps in 8 weeks" : "In 8 weeks";
        if (!names.length) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Nothing here yet. Open your <a href="programs.html">plan</a>, tap <strong>Log sets</strong> on any exercise, then <strong>Finish workout</strong>.${Object.keys(getLog()).length ? " You have sets in a workout you haven't finished yet." : ""}</td></tr>`;
            $("lift-chart").innerHTML = "";
            $("lift-chart-title").textContent = "Your chart appears after you log a lift";
            $("lift-chart-note").textContent = "";
            return;
        }
        const u = profile.unit;
        tbody.innerHTML = names.map((n) => {
            const x = liftSummary(n, profile);
            const lastText = x.lastSets.map((s) => (s.w ? `${trimNum(s.w)}×${s.r}` : `${s.r}`)).join(", ");
            const strength = [`${liftNum(x.nowMax, u)} ${u} max`, `${liftNum(x.laterMax, u)} ${u} max`];
            const endurance = x.top ? [`${x.nowReps} reps @ ${trimNum(x.top)}`, `${x.laterReps} reps @ ${trimNum(x.top)}`] : ["Bodyweight", "Bodyweight"];
            let cells = mode === "strength" ? strength : mode === "endurance" ? endurance
                : [`${strength[0]}<small>${endurance[0]}</small>`, `${strength[1]}<small>${endurance[1]}</small>`];
            // Bodyweight moves: no max to estimate, so show reps
            if (!x.top || !Number.isFinite(x.nowMax)) cells = [`${Math.max(...x.lastSets.map((st) => st.r))} reps<small>best set last time</small>`, `More reps<small>then the harder version</small>`];
            return `<tr${n === selected ? ' class="is-selected"' : ""}>
                <th scope="row">${escapeHtml(n)}</th>
                <td data-label="Last time">${shortDate(parseIso(x.last.date))}<small>${escapeHtml(lastText)}</small></td>
                <td data-label="${mode === "endurance" ? "Reps now" : "Now"}">${cells[0]}</td>
                <td class="is-next" data-label="In 8 weeks">${cells[1]}</td>
                <td class="lift-chart-cell"><button type="button" class="chip" data-chart="${escapeHtml(n)}" aria-label="Show the ${escapeHtml(n)} chart">Chart</button></td>
            </tr>`;
        }).join("");
        // Default chart: the lift with the most sessions (the clearest trend)
        const most = names.slice().sort((a, b) => log[b].length - log[a].length)[0];
        drawLift(selected && names.includes(selected) ? selected : most, profile, mode);
    }

    function drawLift(name, profile, mode) {
        selected = name;
        document.querySelectorAll("#lift-table tbody tr").forEach((tr) => tr.classList.toggle("is-selected", tr.querySelector("th").textContent === name));
        const x = liftSummary(name, profile);
        const svg = $("lift-chart");
        const u = profile.unit;
        if (!x.top || !Number.isFinite(x.nowMax)) {
            const pts = x.entries.map((en) => ({ date: parseIso(en.date), value: Math.max(...en.sets.map((st) => st.r)) }));
            $("lift-chart-title").textContent = `${name}: best set (reps)`;
            drawTrendChart(svg, pts, [], { unit: "reps", label: (v) => String(Math.round(v)) });
            $("lift-chart-note").textContent = `Your best set each session. Bodyweight moves get harder by adding reps, then moving to the harder version in the how-to.`;
            return;
        }
        if (mode === "endurance" && x.top) {
            const pts = x.proj.points.map((p) => ({ date: p.date, value: repsAt(p.value, x.top) }));
            const prj = x.proj.projection.map((p) => ({ date: p.date, value: repsAt(p.value, x.top) }));
            $("lift-chart-title").textContent = `${name}: reps you could do at ${trimNum(x.top)} ${u}`;
            drawTrendChart(svg, pts, prj, { unit: "reps", label: (v) => String(Math.round(v)) });
            $("lift-chart-note").textContent = `About ${x.nowReps} reps at ${trimNum(x.top)} ${u} now, and about ${x.laterReps} by ${shortDate(prj[prj.length - 1].date)} on your current trend. For endurance, sets of 12 to 20 with short rests build this fastest.`;
        } else {
            $("lift-chart-title").textContent = `${name}: estimated one-rep max (${u})`;
            drawTrendChart(svg, x.proj.points, x.proj.projection, { unit: u });
            $("lift-chart-note").textContent = `Estimated max about ${fmt(x.nowMax)} ${u} now; about ${fmt(x.laterMax)} ${u} by ${shortDate(x.proj.projection[x.proj.projection.length - 1].date)} at roughly ${(x.proj.rate * 100).toFixed(1)}% a week, based on ${x.entries.length} session${x.entries.length === 1 ? "" : "s"}. A projection, not a promise: progress slows as you get stronger.${store.get(PROFILE_KEY) && store.get(PROFILE_KEY).experience ? "" : " Tip: set your experience under Make it yours on the Programs page for a more accurate estimate."}`;
        }
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-chart]");
        if (!btn) return;
        drawLift(btn.dataset.chart, getProfile(), currentMode());
        // On phones the chart sits above the list: bring it into view
        const panel = $("lift-chart-panel");
        if (panel && panel.getBoundingClientRect().top < 0) { panel.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" }); panel.focus({ preventScroll: true }); }
    });

    function renderCardio(profile) {
        const svg = $("cardio-chart");
        const W = 520, H = 240, pad = { l: 40, r: 10, t: 14, b: 30 };
        const weeks = [];
        for (let i = 7; i >= 0; i--) {
            const d = addDays(mondayOf(new Date()), -7 * i);
            weeks.push({ start: d, minutes: cardioMinutesInWeek(d) });
        }
        // Projection: recent trend, but never more than about 10% more per week
        const recent = weeks.slice(-4).map((w) => w.minutes);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const slope = recent.length > 1 ? (recent[recent.length - 1] - recent[0]) / (recent.length - 1) : 0;
        const ahead = [];
        let m = weeks[weeks.length - 1].minutes || avg;
        for (let i = 1; i <= 4; i++) {
            m = Math.max(0, Math.min(m * 1.1 + 5, m + Math.max(slope, 0)));
            ahead.push({ start: addDays(mondayOf(new Date()), 7 * i), minutes: Math.round(m), projected: true });
        }
        const bars = [...weeks, ...ahead];
        const hi = Math.max(180, ...bars.map((b) => b.minutes)) * 1.1;
        const bw = (W - pad.l - pad.r) / bars.length;
        const y = (v) => pad.t + (1 - v / hi) * (H - pad.t - pad.b);
        let g = `<line class="chart-goal" x1="${pad.l}" x2="${W - pad.r}" y1="${y(150)}" y2="${y(150)}"/><text class="chart-label" x="${W - pad.r}" y="${y(150) - 5}" text-anchor="end">150 min goal</text>`;
        g += `<text class="chart-label" x="${pad.l - 6}" y="${y(0) + 4}" text-anchor="end">0</text>`;
        bars.forEach((b, i) => {
            const x0 = pad.l + i * bw + 4;
            g += `<rect class="${b.projected ? "bar-proj" : "bar-done"}" x="${x0}" y="${y(b.minutes)}" width="${bw - 8}" height="${Math.max(0, y(0) - y(b.minutes))}"><title>Week of ${shortDate(b.start)}: ${b.minutes} min${b.projected ? " (projected)" : ""}</title></rect>`;
            if (i % 2 === 0) g += `<text class="chart-label" x="${x0 + (bw - 8) / 2}" y="${H - 10}" text-anchor="middle">${shortDate(b.start)}</text>`;
        });
        svg.innerHTML = g;
        const now = weeks[weeks.length - 1].minutes;
        const reach = ahead.find((a) => a.minutes >= 150);
        $("cardio-note").textContent = now >= 150
            ? `${now} minutes this week. You're at or above the recommended 150. Nice.`
            : getCardio().length
                ? `${now} minutes so far this week.${reach ? ` Building gradually, you could reach 150 a week by the week of ${shortDate(reach.start)}.` : " Add a little each week (about 10%) to build up safely."} Dashed bars are a projection.`
                : "No cardio logged yet. Use the form to add a walk, ride, or run.";

        // Recent sessions
        const list = $("cardio-list");
        const du = distUnit(profile.unit);
        list.innerHTML = getCardio().slice(-5).reverse().map((c) => `
            <li><span>${shortDate(parseIso(c.date))}</span><strong>${escapeHtml(c.activity)}: ${c.minutes} min${c.distance ? `, ${trimNum(Math.round(toDist(c.distance, c.dunit, du) * 100) / 100)} ${du}` : ""}</strong>
                <button type="button" class="text-button" data-remove-cardio="${c.date}|${escapeHtml(c.activity)}|${c.minutes}">Remove</button></li>`).join("");

        // Pace trend for activities with distance
        const byAct = {};
        getCardio().filter((c) => c.distance > 0).forEach((c) => { (byAct[c.activity] = byAct[c.activity] || []).push(c); });
        const rows = Object.entries(byAct).filter(([, l]) => l.length >= 2).map(([act, l]) => {
            const pace = (c) => c.minutes / toDist(c.distance, c.dunit, du);
            const first = l[0], last = l[l.length - 1];
            const rate = WEEKLY_GAIN[profile.experience] * 0.7;
            const later = pace(last) * Math.pow(1 - rate, 8);
            const mmss = (v) => `${Math.floor(v)}:${String(Math.round((v % 1) * 60)).padStart(2, "0")}`;
            return `<tr><th scope="row">${escapeHtml(act)}</th><td>${mmss(pace(first))} /${du}</td><td>${mmss(pace(last))} /${du}</td><td class="is-next">${mmss(later)} /${du}</td></tr>`;
        });
        $("pace-panel").innerHTML = rows.length ? `
            <h3 class="me-h3">Pace</h3>
            <div class="table-scroll"><table class="lift-table"><thead><tr><th scope="col">Activity</th><th scope="col">First</th><th scope="col">Latest</th><th scope="col">In 8 weeks</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>
            <p class="result-note">Pace is minutes per ${du === "mi" ? "mile" : "kilometer"} (lower is faster). The 8-week number assumes steady training and is only an estimate.</p>` : "";
    }

    const currentMode = () => (radios.find((r) => r.checked) || {}).value || "both";

    // Quick cardio form
    const qc = $("quick-cardio");
    // Walking first (the most common), and the last activity you logged picked for you
    const acts = Object.keys(EXERCISES).filter(isCardio).sort((a, b) => (b === "Brisk walk") - (a === "Brisk walk"));
    $("qc-activity").innerHTML = acts.map((n) => `<option>${escapeHtml(n)}</option>`).join("") + "<option>Other cardio</option>";
    const lastAct = (getCardio().slice(-1)[0] || {}).activity;
    if (lastAct && [...$("qc-activity").options].some((o) => o.value === lastAct)) $("qc-activity").value = lastAct;
    qc.elements.date.value = isoDate(new Date());
    qc.elements.date.max = isoDate(new Date());
    qc.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = qc.elements;
        const minutes = Number(f.minutes.value);
        const status = qc.querySelector(".log-status");
        if (!minutes) { status.textContent = "Add how many minutes you did."; f.minutes.focus(); return; }
        status.textContent = "";
        saveCardio({ date: f.date.value || isoDate(new Date()), activity: f.activity.value, minutes, distance: Number(f.distance.value) || 0, dunit: distUnit(getProfile().unit), effort: Number(f.effort.value) });
        f.minutes.value = ""; f.distance.value = "";
    });
    $("cardio-list").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-remove-cardio]");
        if (!btn) return;
        const [date, activity, minutes] = btn.dataset.removeCardio.split("|");
        const all = store.get(CARDIO_KEY, []) || [];
        const i = all.findIndex((c) => c.date === date && c.activity === activity && String(c.minutes) === minutes);
        if (i >= 0) { all.splice(i, 1); store.set(CARDIO_KEY, all); renderAll(); }
    });

    $("export-all").addEventListener("click", () => {
        const rows = [["Type", "Date", "Name", "Set", "Weight", "Unit", "Reps", "Minutes", "Distance", "Effort"]];
        Object.entries(getLog()).forEach(([name, entries]) => entries.forEach((e) => e.sets.forEach((st, i) => rows.push(["lift", e.date, name, i + 1, st.w, e.unit, st.r, "", "", ""]))));
        getCardio().forEach((c) => rows.push(["cardio", c.date, c.activity, "", "", c.dunit, "", c.minutes, c.distance || "", c.effort || ""]));
        (store.get("gu-weights", []) || []).forEach((w) => rows.push(["bodyweight", w.date, "Bodyweight", "", w.w, w.unit, "", "", "", ""]));
        const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = `ground-up-everything-${isoDate(new Date())}.csv`;
        document.body.appendChild(a); a.click(); a.remove();
    });
    $("delete-all").addEventListener("click", () => {
        if (!window.confirm("Delete all your logged lifts, cardio, bodyweight, and settings on this device? This can't be undone. (Tip: download everything first.)")) return;
        try { Object.keys(localStorage).filter((k) => k.startsWith("gu-")).forEach((k) => localStorage.removeItem(k)); } catch (err) { /* ignore */ }
        window.dispatchEvent(new CustomEvent("logchange", { detail: { cleared: true } }));
    });

    function renderAll() {
        const profile = getProfile();
        if (!radios.some((r) => r.checked && r.value === profile.trainFor)) {
            const r = radios.find((x) => x.value === profile.trainFor);
            if (r) r.checked = true;
        }
        const mode = currentMode();
        $("train-for-advice").textContent = ADVICE[mode];
        document.querySelectorAll(".dist-unit").forEach((el) => { el.textContent = distUnit(profile.unit); });
        renderStats(profile);
        renderLifts(profile, mode);
        renderCardio(profile);
    }
    window.addEventListener("logchange", renderAll);
    renderAll();
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
        ${document.body.dataset.page === "programs" ? '<div class="howto-level" data-level-bar data-compact></div>' : ""}
        <div class="howto-body" id="howto-body"></div>
        <div class="howto-add"><button type="button" class="btn btn-primary" id="howto-add" data-add-ex="">+ Add to my workout</button></div>
    </div>
</dialog>`);
    const dialog = document.getElementById("howto");
    if (typeof dialog.showModal !== "function") return;
    let opener = null, current = null;
    window.addEventListener("levelchange", () => { if (dialog.open && current) open(current); });

    // Extra coaching for Advanced and Expert, worked out from the kind of exercise
    const COMPOUND = /press|squat|deadlift|row|pull-up|pulldown|lunge|thrust|dip|step-up|split squat|push-up|leg press|chin|carry/i;
    function deeper(name, x) {
        const cardio = isCardio(name);
        const timed = /plank|carry|bird dog|dead bug|wall sit|hold/i.test(name) && !cardio;
        const compound = !cardio && COMPOUND.test(name);
        const cues = cardio
            ? ["Most sessions should feel easy enough to talk in full sentences; save hard efforts for 1 or 2 interval days a week.", "Build time first, then speed: add about 10% a week at most."]
            : timed
                ? ["Brace like you're about to be poked in the stomach, and keep breathing in short breaths.", "Quality over time: stop the hold when your position starts to slip."]
                : ["Lower for about 2 to 3 seconds, pause for a moment, then lift with control.", "Breathe in and brace before the hard part; breathe out as you finish it.", compound ? "On heavy sets, stop with 1 to 3 good reps left in the tank." : "On isolation moves you can train closer to failure, 0 to 2 reps left."];
        const program = cardio
            ? ["<strong>Easy days:</strong> 30 to 60 minutes at a conversational pace (roughly 60 to 70% of max heart rate).", "<strong>Hard days:</strong> intervals like 6 to 10 × 30 to 60 seconds hard, with equal or longer easy recovery.", "<strong>Weekly:</strong> mostly easy, about 1 in 5 sessions hard. Health guidelines suggest at least 150 minutes of moderate cardio a week."]
            : timed
                ? ["<strong>Sets:</strong> 2 to 4 holds of 20 to 60 seconds, or 6 to 10 slow reps per side.", "<strong>Progress by:</strong> adding time, then a harder version, rather than load.", "<strong>Rest:</strong> 30 to 60 seconds."]
                : [`<strong>Strength:</strong> ${compound ? "3 to 6 reps, 3 to 5 sets, 2 to 4 minutes rest" : "not the best tool for max strength; use it for muscle"}.`,
                   `<strong>Muscle:</strong> ${compound ? "6 to 12" : "8 to 15"} reps, 2 to 4 hard sets, ${compound ? "2 to 3 minutes" : "60 to 90 seconds"} rest. Aim for 10 to 20 hard sets a week per muscle.`,
                   "<strong>Endurance:</strong> 15 or more reps with lighter weight and short rest (under 90 seconds).",
                   "<strong>Progress by:</strong> double progression. Reach the top of the rep range on every set, then add the smallest weight jump.",
                   `<strong>Advanced techniques:</strong> ${compound ? "pause reps (2 seconds at the hardest point) and slow 4-second lowering. Use them for a few weeks at a time, not all year." : "rest-pause (rest 15 seconds, then squeeze out a few more reps) and slow 4-second lowering on the last set."}`];
        const adv = `<h3>Form cues</h3><ul class="howto-cues">${cues.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`;
        const exp = `<h3>Programming notes</h3><ul class="howto-program">${program.map((c) => `<li>${c}</li>`).join("")}</ul>`;
        return { adv, exp };
    }

    function open(name) {
        const x = EXERCISES[name];
        if (!x) return;
        current = name;
        const lvl = levelRank(getLevel());
        const demo = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " proper form")}`;
        const fam = (familyFor(name) || []).filter((n) => n !== name);
        document.getElementById("howto-title").textContent = name;
        document.getElementById("howto-add").dataset.addEx = name;
        document.getElementById("howto-muscles").textContent = x.m;
        document.getElementById("howto-eq").textContent = x.eq;
        document.getElementById("howto-body").innerHTML = `
            <a class="btn btn-primary howto-demo" href="${demo}" target="_blank" rel="noopener noreferrer">Watch a demo on YouTube <span aria-hidden="true">&nearr;</span><span class="visually-hidden">(opens in a new tab)</span></a>
            <h3>Setup</h3>
            <p>${escapeHtml(x.setup)}</p>
            <h3>The movement</h3>
            <ol class="howto-steps">${x.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
            <div class="howto-tip"><strong>The one thing to remember:</strong> ${escapeHtml(x.tip)}</div>
            ${lvl >= 1 ? `<h3>Avoid these</h3>
            <ul class="howto-mistakes">${x.mistakes.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : ""}
            ${x.easier || (x.harder && lvl >= 1) ? `<dl class="howto-levels">
                ${x.easier ? `<div><dt>Too hard?</dt><dd>${escapeHtml(x.easier)}</dd></div>` : ""}
                ${x.harder && lvl >= 1 ? `<div><dt>Too easy?</dt><dd>${escapeHtml(x.harder)}</dd></div>` : ""}
            </dl>` : ""}
            ${lvl >= 2 ? deeper(name, x).adv : ""}
            ${lvl >= 2 && fam.length ? `<h3>Works the same muscles</h3><p class="howto-alts">${fam.map((n) => `<button type="button" class="chip" data-howto="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join(" ")}</p>` : ""}
            ${lvl >= 3 ? deeper(name, x).exp : ""}
            ${lvl < 3 && document.body.dataset.page === "programs" ? `<p class="howto-more">Want more detail? Switch the detail level above to ${LEVELS[lvl + 1]}.</p>` : ""}
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
            if (PROGRAMS[goal()]) navigate(`programs.html?today=1#program-${goal()}-${days}`);
        });
        renderDays();
    }

    // The cover's "Ask the Fitness Coach" box hands the question to the coach
    const ask = document.getElementById("hero-ask");
    if (ask) ask.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("hero-ask-input");
        const text = input.value.trim();
        if (!text) { input.focus(); return; }
        input.value = "";
        window.dispatchEvent(new CustomEvent("coach-ask", { detail: { text } }));
    });

    if (ask && "IntersectionObserver" in window) {
        new IntersectionObserver((entries) => entries.forEach((en) => document.body.classList.toggle("hero-ask-visible", en.isIntersecting)), { threshold: 0.2 }).observe(ask);
    }

    // Returning visitors get a shortcut back to their plan
    const last = store.get("gu-last-plan");
    const actions = document.querySelector(".hero-actions");
    if (last && PROGRAMS[last.goal] && actions) {
        const week = Math.max(1, weekOf(programStart(last.goal)));
        actions.insertAdjacentHTML("afterbegin",
            `<a class="btn btn-light" href="programs.html?today=1#program-${last.goal}-${last.days}">Continue: ${escapeHtml(PROGRAMS[last.goal].name)}, week ${week}</a>`);
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
    // Fill in what "Make it yours" already knows
    const known = store.get(PROFILE_KEY, {}) || {};
    if (known.sex) {
        const r = els.calForm.querySelector(`input[name="sex"][value="${known.sex}"]`);
        if (r) r.checked = true;
    }
    // Everything Your starting point knows: age, height, weight, body fat, everyday activity
    {
        const pr = getProfile(), cf = els.calForm.elements;
        if (pr.years) cf.age.value = pr.years;
        if (pr.bodyfat) cf.bodyfat.value = pr.bodyfat;
        if (pr.activity) cf.activity.value = pr.activity;
        if (pr.heightCm) {
            const hc = Number(pr.heightCm), tin = Math.round(hc / 2.54);
            cf.cm.value = String(hc); cf.ft.value = String(Math.floor(tin / 12)); cf.in.value = String(tin % 12);
        }
        if (Number(pr.bodyweight)) {
            const toolUnit = store.get("gu-unit") === "kg" ? "kg" : "lb";
            cf.weight.value = trimNum(Math.round(toUnit(Number(pr.bodyweight), pr.unit, toolUnit) * 10) / 10);
        }
    }
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
        const bfv = f.bodyfat && f.bodyfat.value !== "" ? Number(f.bodyfat.value) : NaN;
        // Same math as Your starting point (Katch-McArdle when body fat is known, otherwise Mifflin-St Jeor)
        const en = energyEstimate(getProfile(), { unit: "kg", weight: kg, cm: Math.round(cm), age, sex, bodyfat: bfv >= 3 && bfv <= 60 ? bfv : 0, activity: f.activity.value });
        if (!en) { els.calOut.innerHTML = `<p class="result-empty">Fill in your age, height, and weight to see your estimate.</p>`; return; }
        const bmr = en.bmr;
        const maintenance = en.maintenance;
        // Remember these for next time and for Your starting point (only on this device)
        const raw = store.get(PROFILE_KEY, {}) || {};
        Object.assign(raw, { years: Number.isInteger(age) ? String(age) : raw.years, heightCm: String(Math.round(cm)), activity: f.activity.value,
            bodyfat: bfv >= 3 && bfv <= 60 ? String(bfv) : "" });
        if (Number.isInteger(age)) raw.age = ageBracket(age);
        store.set(PROFILE_KEY, raw);
        const delta = Number(f.goal.value);
        const floor = sex === "male" ? 1500 : 1200;
        let target = maintenance + delta;
        const floored = target < floor;
        if (floored) target = floor;

        const proteinLow = en.proteinLow;
        const proteinHigh = en.proteinHigh;
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
            <p class="result-note">${en.method === "katch" ? "Worked out from your lean mass (your body fat %), which is the more precise formula when you know it." : "Worked out from your weight, height, age, and sex (Mifflin-St Jeor). Add your body fat % if you know it for a closer number."} Resting burn: about ${fmt(Math.round(bmr / 10) * 10)} calories.</p>
            <p class="result-note">This is a starting estimate. Follow it for 2 to 3 weeks, watch your average weight, and adjust by about 100 to 200 calories if it isn't moving the way you want. For a personal eating plan, or if you have a health condition, talk to a registered dietitian or your doctor.</p>`;
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
            showStatus("Messages aren't switched on yet, so this didn't send. Your draft is saved on this device.", true);
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
    // Until the owner connects the form, say so up front instead of failing on Send
    if (!CONTACT_CONFIG.web3formsKey && !CONTACT_CONFIG.fallbackEmail) {
        form.insertAdjacentHTML("beforebegin", `<p class="form-notice" role="note"><strong>Heads up:</strong> the contact form is still being set up, so messages can't be sent yet. In the meantime, the <a href="basics.html">Gym basics</a> and <a href="start.html#first-day">first-day guide</a> answer the most common questions.</p>`);
        sendBtn.disabled = true;
        sendLabel.textContent = "Coming soon";
    }

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

/* =========================================================
   FEATURE: Accounts (Firebase). Optional: does nothing until
   FIREBASE_CONFIG near the top of this file is filled in.
   Signed in, every "gu-" setting and log on this device is saved to
   users/{uid} in Firestore, and merged when you sign in on a new
   device. Firestore rules (set in the Firebase console) must only let
   a signed-in user read and write their own document:
     match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
   ========================================================= */
const FIREBASE_SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

/* =========================================================
   FEATURE: Clear my progress (My progress page)
   Pick what to clear (lifts, cardio, bodyweight, plan progress, Coach,
   settings), confirm, and it's removed from this device. An Undo button
   stays until the page is closed, in case it was a mistake.
   ========================================================= */
const RESET_GROUPS = [
    { id: "lifts", label: "Lifting log, finished workouts, and personal records", keys: ["gu-log", "gu-prs", "gu-sessions", "gu-log-draft"], on: true,
        count: () => { const days = new Set(Object.values(getLog()).flatMap((e) => (Array.isArray(e) ? e.map((x) => x && x.date) : []))); const n = days.size; return n ? `${n} ${n === 1 ? "day" : "days"} of lifting logged` : ""; } },
    { id: "cardio", label: "Cardio log", keys: ["gu-cardio"], on: true,
        count: () => { const n = getCardio().length; return n ? `${n} ${n === 1 ? "entry" : "entries"}` : ""; } },
    { id: "weight", label: "Bodyweight entries", keys: ["gu-weights"], on: true,
        count: () => { const n = (store.get("gu-weights", []) || []).length; return n ? `${n} ${n === 1 ? "entry" : "entries"}` : ""; } },
    { id: "plans", label: "Plan progress", hint: "checked-off workouts, swaps, your start week, and My workout", keys: ["gu-last-plan", "gu-custom"], prefixes: ["gu-progress-", "gu-swaps-", "gu-start-", "gu-checklist-"], on: true },
    { id: "coach", label: "Fitness Coach chat and the lift numbers you told it", keys: ["gu-coach-history", "gu-coach-state", "gu-coach-maxes", "gu-coach-open"], on: false },
    { id: "settings", label: "Settings", hint: "your level, profile, units, and light or dark mode", rest: true, on: false }
];
function resetKeys(group) {
    let all = [];
    try { all = Object.keys(localStorage).filter((k) => k.startsWith("gu-") || k === "theme"); } catch (e) { return []; }
    const owned = (g, k) => (g.keys || []).includes(k) || (g.prefixes || []).some((p) => k.startsWith(p));
    if (group.rest) return all.filter((k) => !RESET_GROUPS.some((g) => !g.rest && owned(g, k)));
    return all.filter((k) => owned(group, k));
}

function setupResetProgress() {
    const form = document.getElementById("reset-progress");
    if (!form) return;
    const list = document.getElementById("reset-list"), confirmBox = document.getElementById("reset-confirm");
    const confirmText = document.getElementById("reset-confirm-text"), status = document.getElementById("reset-status");
    const go = document.getElementById("reset-go");
    let undo = null;

    function render() {
        // Keep what the person ticked; anything that was empty before gets its default
        const was = new Map([...list.querySelectorAll("input")].map((i) => [i.value, i.disabled ? null : i.checked]));
        list.innerHTML = RESET_GROUPS.map((g) => {
            const keys = resetKeys(g);
            const empty = !keys.length;
            const detail = empty ? "nothing saved" : (g.count && g.count()) || g.hint || "";
            const on = !empty && (was.get(g.id) == null ? g.on : was.get(g.id));
            return `<label class="reset-item${empty ? " is-empty" : ""}"><input type="checkbox" name="reset" value="${g.id}"${on ? " checked" : ""}${empty ? " disabled" : ""}>
                <span><strong>${escapeHtml(g.label)}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}</span></label>`;
        }).join("");
        go.disabled = !RESET_GROUPS.some((g) => resetKeys(g).length);
    }
    const chosen = () => RESET_GROUPS.filter((g) => list.querySelector(`input[value="${g.id}"]:checked`));
    const names = (picks) => { const n = picks.map((g) => g.label.toLowerCase()); return n.length > 1 ? `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}` : n[0]; };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const picks = chosen();
        if (!picks.length) { status.textContent = "Tick at least one thing to clear."; return; }
        status.textContent = "";
        confirmText.innerHTML = `<strong>Clear ${escapeHtml(names(picks))}?</strong> This removes it from this device.${document.querySelector(".account-box [data-signed-in], #acct-delete") ? " It will also be removed from your account." : ""}`;
        confirmBox.hidden = false;
        go.hidden = true;
        confirmText.focus();
    });
    document.getElementById("reset-no").addEventListener("click", () => { confirmBox.hidden = true; go.hidden = false; go.focus(); });
    document.getElementById("reset-yes").addEventListener("click", () => {
        const picks = chosen();
        const snapshot = {};
        picks.forEach((g) => resetKeys(g).forEach((k) => { try { snapshot[k] = localStorage.getItem(k); } catch (e) { /* ignore */ } }));
        Object.keys(snapshot).forEach((k) => store.remove(k));
        // The open chat on this page starts fresh too
        const coachClear = document.getElementById("coach-clear");
        if (picks.some((g) => g.id === "coach") && coachClear) coachClear.click();
        undo = snapshot;
        confirmBox.hidden = true;
        go.hidden = false;
        render();
        window.dispatchEvent(new CustomEvent("logchange", { detail: { cleared: true } }));
        status.innerHTML = `Cleared ${escapeHtml(names(picks))}. <button type="button" class="text-button" id="reset-undo">Undo</button>`;
        document.getElementById("reset-undo").focus();
    });
    status.addEventListener("click", (e) => {
        if (!e.target.closest("#reset-undo") || !undo) return;
        Object.entries(undo).forEach(([k, v]) => { try { if (v !== null) localStorage.setItem(k, v); } catch (err) { /* ignore */ } });
        undo = null;
        render();
        window.dispatchEvent(new CustomEvent("logchange", { detail: { restored: true } }));
        status.textContent = "Everything is back the way it was.";
    });
    window.addEventListener("logchange", (e) => { if (!(e.detail && (e.detail.cleared || e.detail.restored))) render(); });
    render();
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src; s.onload = resolve; s.onerror = () => reject(new Error(`Couldn't load ${src}`));
        document.head.appendChild(s);
    });
}

// Everything this site saves on the device
function localData() {
    const data = {};
    try { Object.keys(localStorage).filter((k) => k.startsWith("gu-")).forEach((k) => { data[k] = localStorage.getItem(k); }); } catch (e) { /* storage blocked */ }
    return data;
}

// Combine this device's data with the account's, without losing either side's logs
function mergeData(local, remote) {
    const out = { ...remote, ...local };
    const parse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
    const unionArr = (a, b) => { const seen = new Set(); return [...(b || []), ...(a || [])].filter((x) => { const k = JSON.stringify(x); if (seen.has(k)) return false; seen.add(k); return true; }); };
    Object.keys(remote).forEach((k) => {
        if (!(k in local)) return;
        const a = parse(local[k]), b = parse(remote[k]);
        if (k === LOG_KEY && a && b && typeof a === "object") {
            const merged = { ...b };
            Object.entries(a).forEach(([name, list]) => { merged[name] = unionArr(list, b[name]).sort((x, y) => x.date.localeCompare(y.date)); });
            out[k] = JSON.stringify(merged);
        } else if (Array.isArray(a) && Array.isArray(b)) {
            out[k] = JSON.stringify(unionArr(a, b));
        }
    });
    return out;
}

function setupAccount() {
    const card = document.getElementById("account-card");
    const configured = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId;
    if (!configured) {
        if (card) card.innerHTML = `
            <div class="account-box">
                <h2 class="me-h2">Account</h2>
                <p>Everything you log is saved on this device only, so nothing is sent anywhere. Accounts that sync between your phone and computer are coming soon. Until then, use <strong>Download everything</strong> just below to keep a backup.</p>
            </div>`;
        return;
    }

    let db = null, auth = null, user = null, pushTimer = null;
    const render = (state, msg = "") => {
        if (!card) return;
        if (state === "in") {
            card.innerHTML = `
                <div class="account-box">
                    <h2 class="me-h2">Your account</h2>
                    <p>Signed in as <strong>${escapeHtml(user.email || user.displayName || "you")}</strong>. Your logs and settings are saved to your account and sync to any device you sign in on.</p>
                    <div class="account-actions">
                        <button class="btn btn-ghost btn-compact" type="button" id="acct-out">Sign out</button>
                        <button class="text-button" type="button" id="acct-delete">Delete my account and its data</button>
                    </div>
                    <p class="log-status" role="status">${escapeHtml(msg)}</p>
                </div>`;
            card.querySelector("#acct-out").addEventListener("click", () => auth.signOut());
            card.querySelector("#acct-delete").addEventListener("click", deleteAccount);
        } else {
            card.innerHTML = `
                <div class="account-box">
                    <h2 class="me-h2">Save your progress to an account</h2>
                    <p>Sign in to keep your logs safe and see them on your phone and computer. Without an account, everything stays on this device.</p>
                    <div class="account-actions">
                        <button class="btn btn-primary btn-compact" type="button" id="acct-google">Continue with Google</button>
                    </div>
                    <form class="account-form" id="acct-form" novalidate>
                        <div class="field"><label for="acct-email">Email</label><input id="acct-email" type="email" autocomplete="email" required></div>
                        <div class="field"><label for="acct-pass">Password <span class="field-hint">(6+ characters)</span></label><input id="acct-pass" type="password" autocomplete="current-password" minlength="6" required></div>
                        <div class="account-actions">
                            <button class="btn btn-ghost btn-compact" type="submit">Sign in</button>
                            <button class="text-button" type="button" id="acct-create">Create an account</button>
                        </div>
                    </form>
                    <p class="log-status" role="status">${escapeHtml(msg)}</p>
                    <p class="fine-print">We only store your email and what you log here. Delete it all any time.</p>
                </div>`;
            const status = card.querySelector(".log-status");
            const fail = (e) => { status.textContent = friendlyAuthError(e); };
            card.querySelector("#acct-google").addEventListener("click", () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(fail));
            const form = card.querySelector("#acct-form");
            const creds = () => [form.querySelector("#acct-email").value.trim(), form.querySelector("#acct-pass").value];
            form.addEventListener("submit", (e) => { e.preventDefault(); auth.signInWithEmailAndPassword(...creds()).catch(fail); });
            card.querySelector("#acct-create").addEventListener("click", () => auth.createUserWithEmailAndPassword(...creds()).catch(fail));
        }
    };

    function friendlyAuthError(e) {
        const code = (e && e.code) || "";
        if (/wrong-password|invalid-credential|user-not-found/.test(code)) return "That email and password don't match. Try again, or create an account.";
        if (/email-already-in-use/.test(code)) return "There's already an account with that email. Sign in instead.";
        if (/weak-password/.test(code)) return "Use a password with at least 6 characters.";
        if (/invalid-email/.test(code)) return "That doesn't look like an email address.";
        if (/popup-closed/.test(code)) return "";
        return "Something went wrong signing in. Check your connection and try again.";
    }

    const docRef = () => db.collection("users").doc(user.uid);
    function pushSoon() {
        if (!user) return;
        clearTimeout(pushTimer);
        pushTimer = setTimeout(() => docRef().set({ data: localData(), updated: Date.now() }).catch(() => {}), 1500);
    }

    async function pullAndMerge() {
        const snap = await docRef().get();
        const remote = (snap.exists && snap.data().data) || {};
        const merged = mergeData(localData(), remote);
        try { Object.entries(merged).forEach(([k, v]) => localStorage.setItem(k, v)); } catch (e) { /* ignore */ }
        await docRef().set({ data: merged, updated: Date.now() });
        window.dispatchEvent(new CustomEvent("logchange", { detail: { synced: true } }));
    }

    async function deleteAccount() {
        if (!window.confirm("Delete your account and everything saved to it? Your data on this device stays until you delete it below. This can't be undone.")) return;
        try {
            await docRef().delete();
            await user.delete();
        } catch (e) {
            const status = card && card.querySelector(".log-status");
            if (status) status.textContent = /requires-recent-login/.test(e.code || "")
                ? "For your security, sign out, sign back in, and try again."
                : "Couldn't delete the account. Check your connection and try again.";
        }
    }

    // Every save on this site also goes to the account (when signed in)
    const baseSet = store.set.bind(store), baseRemove = store.remove.bind(store);
    store.set = (k, v) => { baseSet(k, v); if (String(k).startsWith("gu-")) pushSoon(); };
    store.remove = (k) => { baseRemove(k); if (String(k).startsWith("gu-")) pushSoon(); };
    window.addEventListener("logchange", (e) => { if (!(e.detail && e.detail.synced)) pushSoon(); });

    if (card) card.innerHTML = `<div class="account-box"><p>Loading your account&hellip;</p></div>`;
    Promise.all(["firebase-app-compat.js"].map((f) => loadScript(FIREBASE_SDK + f)))
        .then(() => Promise.all(["firebase-auth-compat.js", "firebase-firestore-compat.js"].map((f) => loadScript(FIREBASE_SDK + f))))
        .then(() => {
            firebase.initializeApp(FIREBASE_CONFIG);
            auth = firebase.auth();
            db = firebase.firestore();
            auth.onAuthStateChanged((u) => {
                user = u;
                if (!u) { render("out"); return; }
                render("in", "Syncing…");
                pullAndMerge().then(() => render("in", "Synced.")).catch(() => render("in", "Couldn't sync right now. Your data is still saved on this device."));
            });
        })
        .catch(() => { if (card) card.innerHTML = `<div class="account-box"><p>Accounts couldn't load right now. Everything you log is still saved on this device.</p></div>`; });
}
