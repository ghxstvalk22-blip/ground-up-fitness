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
    setupTheme,
    setupMenu,
    setupDropdowns,
    setupActiveNav,
    setupPrograms,
    setupTools,
    setupContactForm,
    setupLinks,      // keep after features that add routes
    setupJump
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

document.addEventListener("DOMContentLoaded", () => {
    FEATURES.forEach((feature) => {
        try { feature(); } catch (err) { console.error(`${feature.name} failed:`, err); }
    });
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});

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
        button.textContent = isDark() ? "Light mode" : "Dark mode";
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
    if (!("IntersectionObserver" in window)) return;
    const links = [...document.querySelectorAll("#site-nav .nav-link")];
    const sections = links
        .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
        .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => {
                const on = a.getAttribute("href") === "#" + entry.target.id;
                a.classList.toggle("active", on);
                if (on) a.setAttribute("aria-current", "true");
                else a.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach((s) => observer.observe(s));
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
        const a = e.target.closest('a[href^="#"]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (goTo(a.getAttribute("href"))) e.preventDefault();
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
        goTo(d.href);
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
    }
};

/* =========================================================
   FEATURE: Program builder
   ========================================================= */
function setupPrograms() {
    const els = {
        head: document.getElementById("program-head"),
        grid: document.getElementById("day-grid"),
        label: document.getElementById("progress-label"),
        fill: document.getElementById("progress-fill"),
        reset: document.getElementById("reset-week"),
        copyBtn: document.getElementById("copy-plan"),
        copyStatus: document.getElementById("copy-status"),
        goalInputs: [...document.querySelectorAll('input[name="goal"]')],
        dayInputs: [...document.querySelectorAll('input[name="days"]')]
    };

    const state = { goal: "beginner", days: 3 };
    const progressKey = () => `gu-progress-${state.goal}-${state.days}`;
    const viewHash = () => `#program-${state.goal}-${state.days}`;

    function render({ syncUrl = false } = {}) {
        const p = PROGRAMS[state.goal];
        const plan = p.plans[state.days];
        const done = new Set(store.get(progressKey(), []));

        els.goalInputs.forEach((r) => { r.checked = r.value === state.goal; });
        els.dayInputs.forEach((r) => { r.checked = Number(r.value) === state.days; });

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

        els.grid.innerHTML = plan.days.map((day, di) => `
            <article class="day-card" data-day="${di}">
                <header>
                    <span class="day-num">Day ${di + 1}</span>
                    <h4>${escapeHtml(day.title)}</h4>
                </header>
                <ul class="ex-list">
                    ${day.items.map((x, xi) => {
                        const key = `${di}-${xi}`;
                        const id = `ex-${key}`;
                        return `
                        <li>
                            <input type="checkbox" id="${id}" data-key="${key}" ${done.has(key) ? "checked" : ""}>
                            <label for="${id}">
                                <span class="ex-name">${escapeHtml(x.n)}</span>
                                <span class="ex-dose">${escapeHtml(x.d)}</span>
                                ${x.rest ? `<span class="ex-rest">Rest ${escapeHtml(x.rest)}</span>` : ""}
                                ${x.swap ? `<span class="ex-swap">Easier swap: ${escapeHtml(x.swap)}</span>` : ""}
                            </label>
                        </li>`;
                    }).join("")}
                </ul>
            </article>`).join("");

        updateProgress();
        if (syncUrl) history.replaceState(null, "", viewHash());
    }

    function updateProgress() {
        const boxes = [...els.grid.querySelectorAll('input[type="checkbox"]')];
        const checked = boxes.filter((b) => b.checked).length;
        const total = boxes.length;

        els.label.textContent = checked === total && total > 0
            ? "Week complete. Add weight where the plan says to, then start a new week."
            : `${checked} of ${total} exercises done this week`;
        els.fill.style.width = total ? (checked / total) * 100 + "%" : "0";

        els.grid.querySelectorAll(".day-card").forEach((card) => {
            const dayBoxes = [...card.querySelectorAll('input[type="checkbox"]')];
            card.classList.toggle("complete", dayBoxes.length > 0 && dayBoxes.every((b) => b.checked));
        });
    }

    els.grid.addEventListener("change", (e) => {
        if (!e.target.matches('input[type="checkbox"]')) return;
        const keys = [...els.grid.querySelectorAll('input[type="checkbox"]:checked')].map((b) => b.dataset.key);
        store.set(progressKey(), keys);
        updateProgress();
    });

    els.reset.addEventListener("click", () => {
        store.remove(progressKey());
        render();
    });

    els.goalInputs.forEach((r) => r.addEventListener("change", () => {
        state.goal = r.value;
        render({ syncUrl: true });
    }));
    els.dayInputs.forEach((r) => r.addEventListener("change", () => {
        state.days = Number(r.value);
        render({ syncUrl: true });
    }));

    let copyTimer;
    els.copyBtn.addEventListener("click", async () => {
        const url = location.href.split("#")[0] + viewHash();
        let copied = false;
        try { await navigator.clipboard.writeText(url); copied = true; } catch (e) { /* clipboard blocked */ }
        els.copyStatus.textContent = copied
            ? `Link copied. It opens ${PROGRAMS[state.goal].name}, ${state.days} days a week.`
            : "Copy this link: " + url;
        clearTimeout(copyTimer);
        if (copied) copyTimer = setTimeout(() => { els.copyStatus.textContent = ""; }, 4000);
    });

    // Links like #program-fatloss or #program-strength-4
    addRoute(/^#program-([a-z]+)(?:-(\d))?$/, (m) => {
        if (!PROGRAMS[m[1]]) return null;
        state.goal = m[1];
        if (m[2] && PROGRAMS[m[1]].plans[m[2]]) state.days = Number(m[2]);
        render();
        return { target: document.getElementById("programs") };
    });

    render();
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
