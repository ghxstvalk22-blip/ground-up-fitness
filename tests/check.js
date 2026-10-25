/* Browser test for Baseline Fitness.
   Run: npm install && node tests/check.js
   Exits with code 1 if anything is broken. Screenshots go to tests/screenshots/
   so you can look at the result. Add a check here whenever you add a feature. */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

function findChromium() {
    if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
    const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers"].filter(Boolean);
    for (const root of roots) {
        if (!fs.existsSync(root)) continue;
        const dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
        for (const d of dirs) {
            const bin = path.join(root, d, "chrome-linux", "chrome");
            if (fs.existsSync(bin)) return bin;
        }
    }
    for (const bin of ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]) {
        if (fs.existsSync(bin)) return bin;
    }
    throw new Error("No Chromium found. Set CHROMIUM_PATH to a Chrome or Chromium binary.");
}

const ROOT = path.resolve(__dirname, "..");
const PAGES = ["index.html", "start.html", "programs.html", "me.html", "exercises.html", "pros.html", "tools.html", "basics.html", "supplements.html", "contact.html"];
const url = (file, hash = "") => "file://" + path.join(ROOT, file) + hash;
const SHOTS = path.join(__dirname, "screenshots");
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); console.log((ok ? "  ok   " : "  FAIL ") + msg); };

// Every id on every page, so links like "tools.html#tool-1rm" can be checked
const idsByPage = {};
for (const f of PAGES) {
    idsByPage[f] = new Set([...fs.readFileSync(path.join(ROOT, f), "utf8").matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
}
// Addresses handled by the router instead of a plain id
const ROUTES = { "programs.html": /^program-[a-z0-9]+(-\d)?$/, "contact.html": /^contact-[a-z]+$/, "exercises.html": /^(legs|chest|back|shoulders|arms|core|cardio|muscle-map)$/ };

function linkProblem(href, fromPage) {
    if (/^(https?:|mailto:)/.test(href)) return null;
    const [file, hash] = href.split("#");
    const target = file === "" ? fromPage : file;
    if (!PAGES.includes(target)) return `${href} (no such page)`;
    if (!hash) return null;
    if (idsByPage[target].has(hash) || (ROUTES[target] && ROUTES[target].test(hash))) return null;
    if (["main", "top"].includes(hash)) return null;
    return `${href} (no #${hash} on ${target})`;
}

// The test machine can't reach Google Fonts, so serve the same Archivo font from npm.
// That way the layout is checked with the real font widths, not a fallback.
const FONT_FILE = path.join(ROOT, "node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2");
const FONT_CSS = `@font-face{font-family:"Archivo";src:url("https://fonts.gstatic.com/test/archivo.woff2") format("woff2");font-weight:100 900;font-stretch:62% 125%;font-display:block;}`;

// Pick a plan on the Programs page, switching to Expert first if the plan is above the current level
async function pickGoal(page, value) {
    if (!(await page.locator(`label:has(input[name="goal"][value="${value}"])`).isVisible())) await page.locator('.level-wrap input[value="Expert"]').check({ force: true });
    await page.locator(`input[name="goal"][value="${value}"]`).check({ force: true });
}

async function openPage(browser, file, viewport, hash = "") {
    const page = await browser.newPage({ viewport });
    page.on("dialog", (d) => d.accept().catch(() => {})); // confirm() pop-ups say yes
    if (fs.existsSync(FONT_FILE)) {
        await page.route(/fonts\.googleapis\.com/, (r) => r.fulfill({ contentType: "text/css", body: FONT_CSS }));
        await page.route(/fonts\.gstatic\.com\/test/, (r) => r.fulfill({ contentType: "font/woff2", body: fs.readFileSync(FONT_FILE) }));
    }
    await page.route(/images\.unsplash\.com/, (r) => r.abort());
    // Most checks test the built-in coach, so the AI is switched off here (the AI check fakes it)
    await page.route(/script\.js/, (r) => r.fulfill({ contentType: "application/javascript", body: fs.readFileSync(path.join(ROOT, "script.js"), "utf8").replace(/const COACH_AI_URL = "[^"]*";/, 'const COACH_AI_URL = "";') }));
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
        // Offline fonts and photos are fine in this test; real script errors are not
        if (m.type() === "error" && !/Failed to load resource|ERR_|fonts\.g|unsplash/.test(m.text())) errors.push(m.text());
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(url(file, hash), { waitUntil: "load" });
    await page.waitForTimeout(250);
    return { page, errors };
}

// Every exercise in every plan needs a how-to guide in exercises.js
{
    const src = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
    const lib = fs.readFileSync(path.join(ROOT, "exercises.js"), "utf8");
    const names = [...new Set([...src.matchAll(/ex\("([^"]+)"/g)].map((m) => m[1]))];
    const missing = names.filter((n) => !lib.includes(`"${n}": {`));
    check(missing.length === 0, `every plan exercise has a how-to guide ${missing.length ? JSON.stringify(missing) : ""}`);
}

// Security: a strict policy on every page, no inline scripts, and no secrets in the repo
{
    for (const file of PAGES) {
        const html = fs.readFileSync(path.join(ROOT, file), "utf8");
        const csp = (html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || "";
        const scriptSrc = (csp.match(/script-src([^;]*)/) || [])[1] || "";
        check(csp && /object-src 'none'/.test(csp) && /base-uri 'self'/.test(csp) && !/unsafe-eval/.test(csp) && scriptSrc && !/unsafe-inline/.test(scriptSrc),
            `${file} has a strict security policy`);
        check(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html) && !/\son[a-z]+\s*=\s*["']/i.test(html), `${file} has no inline scripts or event handlers`);
    }
    // Installable app: manifest, icons, offline helper, and the tags on every page
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.webmanifest"), "utf8"));
    check(manifest.display === "standalone" && manifest.icons.every((i) => fs.existsSync(path.join(ROOT, i.src))) && manifest.icons.some((i) => i.sizes === "512x512"), "the app manifest is valid and its icons exist");
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const missingCore = PAGES.filter((f) => !sw.includes(`"${f}"`));
    check(missingCore.length === 0, `the offline helper saves every page ${missingCore.join(", ")}`);
    const noAppTags = PAGES.filter((f) => { const h = fs.readFileSync(path.join(ROOT, f), "utf8"); return !/rel="manifest"/.test(h) || !/apple-touch-icon/.test(h) || !/viewport-fit=cover/.test(h); });
    check(noAppTags.length === 0, `every page can be installed as an app ${noAppTags.join(", ")}`);
    // Every page asks for the same version of the shared files, so browsers never mix old and new
    const versions = new Set(PAGES.flatMap((f) => [...fs.readFileSync(path.join(ROOT, f), "utf8").matchAll(/(?:styles\.css|script\.js|exercises\.js|muscle-art\.js)\?v=([\w-]+)"/g)].map((m) => m[1])));
    const unversioned = PAGES.filter((f) => /(?:href="styles\.css"|src="script\.js")/.test(fs.readFileSync(path.join(ROOT, f), "utf8")));
    check(versions.size === 1 && unversioned.length === 0, `every page loads the same version of the shared files (${[...versions].join(", ")}) ${unversioned.join(", ")}`);
    const SECRET = /(-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{32,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|"?password"?\s*[:=]\s*"[^"]{4,}")/;
    const files = fs.readdirSync(ROOT).filter((f) => /\.(html|js|css|md|json)$/.test(f) && f !== "package-lock.json")
        .concat(fs.readdirSync(path.join(ROOT, "tests")).filter((f) => f.endsWith(".js")).map((f) => `tests/${f}`));
    const leaks = files.filter((f) => SECRET.test(fs.readFileSync(path.join(ROOT, f), "utf8").replace(/const SECRET = .*\n/, "")));
    check(leaks.length === 0, `no passwords or secret keys in the repo ${leaks.join(", ")}`);
}

(async () => {
    fs.mkdirSync(SHOTS, { recursive: true });
    const browser = await chromium.launch({ executablePath: findChromium(), args: ["--headless=new"] });

    for (const [name, viewport] of [["desktop", { width: 1280, height: 900 }], ["laptop", { width: 1100, height: 800 }], ["phone", { width: 390, height: 844 }]]) {
        console.log(`\n=== ${name} (${viewport.width}px) ===`);

        // Checks every page gets
        for (const file of PAGES) {
            console.log(`\n${file}`);
            const { page, errors } = await openPage(browser, file, viewport);
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            check(await page.locator(".site-header #site-nav").count() === 1, "shared header is built");
            check(await page.locator(".site-footer").count() === 1, "shared footer is built");
            const headerFits = await page.evaluate(() => {
                const inner = document.querySelector(".header-inner");
                return [...inner.children].every((el) => el.offsetParent === null || el.getBoundingClientRect().right <= window.innerWidth + 1);
            });
            check(headerFits, "header fits on screen");
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
            check(overflow <= 0, `no sideways scrolling (overflow ${overflow}px)`);
            const hrefs = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
            const bad = [...new Set(hrefs.map((h) => linkProblem(h, file)).filter(Boolean))];
            check(bad.length === 0, `every link has a real target ${bad.length ? JSON.stringify(bad) : ""}`);
            const tabbar = await page.locator(".tabbar").isVisible();
            check(viewport.width <= 760 ? tabbar : !tabbar, viewport.width <= 760 ? "phones get the bottom tab bar" : "the tab bar is only for phones");
            if (viewport.width <= 760) {
                const tiny = await page.evaluate(() => [...document.querySelectorAll("main button, main select, main .segmented label, .tabbar a, .site-header button")]
                    .filter((el) => el.offsetParent && !el.closest("dialog:not([open])") && !el.classList.contains("inline-howto"))
                    .filter((el) => el.getBoundingClientRect().height < 40).map((el) => (el.textContent || el.className).trim().slice(0, 20)));
                check(tiny.length === 0, `buttons are big enough to tap ${JSON.stringify(tiny.slice(0, 5))}`);
            }
            const unsafeBlank = await page.evaluate(() => [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).map((a) => a.href));
            check(unsafeBlank.length === 0, `links that open a new tab can't control this page ${unsafeBlank.slice(0, 2).join(", ")}`);
            const key = file === "index.html" ? null : file.replace(".html", "");
            const tab = key === "supplements" ? "basics.html" : file;
            if (file === "index.html") check(await page.locator('#site-nav .nav-link[href="pros.html"], #site-nav .nav-link[href="basics.html"], .footer-nav a[href="pros.html"], .footer-nav a[href="basics.html"]').count() === 0, "Pros and Gym basics are off the menus");
            // Pros, Gym basics (and Supplements, which sits under it) are off the menus
            if (key && !["me", "pros", "basics", "supplements"].includes(key)) check(await page.locator(`#site-nav .nav-link.active[href="${tab}"]`).count() === 1, "this page's tab is marked as current");
            await page.screenshot({ path: path.join(SHOTS, `${name}-${file.replace(".html", "")}.png`), fullPage: true });
            await page.close();
        }

        // Home: quick start sends you to the right plan on the Programs page
        console.log("\nhome features");
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            check(Number(await page.locator('[data-stat="plans"]').textContent()) >= 8, "hero stats count the plans");
            check(await page.locator(".ticker").count() === 0 && await page.locator(".promise-strip li").count() === 4, "no moving ticker; calm promise strip instead");
            // The cover: one-tap goals and a box that asks the Fitness Coach
            const goalLinks = await page.locator(".hero-goals li a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
            check(goalLinks.length === 6 && goalLinks.includes("programs.html#program-fatloss") && await page.locator(".hero-goals a").first().isVisible(), "the cover offers one-tap goals");
            const coverFits = await page.evaluate(() => { const r = document.querySelector(".hero-ask").getBoundingClientRect(); return r.bottom <= document.querySelector(".hero").getBoundingClientRect().bottom + 1; });
            check(coverFits, "the ask box sits inside the cover");
            await page.fill("#hero-ask-input", "chest and triceps, 30 minutes");
            await page.press("#hero-ask-input", "Enter");
            await page.locator(".coach-typing").waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
            await page.waitForTimeout(300);
            check(await page.locator("#coach").isVisible() && /Chest & Triceps/.test(await page.locator(".coach-msg.is-coach").last().textContent()), "asking from the cover opens the Fitness Coach with an answer");
            await page.click("#coach-clear");
            await page.click("#coach-close");
            await page.evaluate(() => ["gu-coach-history", "gu-coach-state", "gu-coach-open"].forEach((k) => localStorage.removeItem(k)));
            await page.locator('#quickstart input[value="build"]').check({ force: true });
            check(await page.locator('#qs-days input').count() === 1, "quick start only offers the days a plan has");
            await Promise.all([page.waitForNavigation(), page.locator(".qs-go").click()]);
            await page.waitForTimeout(250);
            check(page.url().endsWith("programs.html?today=1#program-build-3") && await page.locator(".day-card").first().isVisible(), "quick start opens the Programs page on Day 1");
            check(/Build muscle · 3 days/.test(await page.locator("#program-head h3").textContent()), "and shows Build muscle, 3 days");
            // Back on the home page with a plan and a starting point: a short page
            await page.evaluate(() => localStorage.setItem("gu-profile", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("gu-profile") || "{}"), { bodyweight: 180 }))));
            await page.goto(page.url().replace(/programs\.html.*$/, "index.html"), { waitUntil: "load" });
            await page.waitForTimeout(250);
            const ret = await page.evaluate(() => ({ cls: document.body.classList.contains("returning"), fears: getComputedStyle(document.querySelector(".fears")).display, plan: getComputedStyle(document.querySelector(".get-plan")).display, fold: !!document.querySelector("#setup .setup-fold:not([open]) .setup-form") }));
            check(ret.cls && ret.fears === "none" && ret.plan === "none" && ret.fold && /Start Day 1/.test(await page.locator(".home-next").textContent()), "returning visitors get a short home page: Up next, and Your starting point folded");
            const nx = await page.evaluate(() => {
                const card = document.querySelector(".home-next"), r = card && card.getBoundingClientRect();
                return { title: card ? card.querySelector(".home-next-title").textContent : "", rows: document.querySelectorAll(".home-next-list li").length,
                    top: r ? r.top + scrollY : 9999, lede: getComputedStyle(document.querySelector(".hero-lede")).display,
                    h1: document.querySelector(".hero h1").textContent, bar: !!document.getElementById("planbar"),
                    href: card ? card.querySelector(".btn-primary").getAttribute("href") : "" };
            });
            check(/^Day 1: /.test(nx.title) && nx.rows >= 2 && nx.lede === "none" && /Welcome back/.test(nx.h1) && !nx.bar && nx.href === "programs.html?today=1#program-build-3" && nx.top < page.viewportSize().height,
                `home opens with an Up next card for today's day (above the fold, no duplicate plan bar) ${JSON.stringify(nx)}`);
            await page.screenshot({ path: path.join(SHOTS, `${name}-home-returning.png`) });
            await page.locator("#setup .setup-fold > summary").click();
            check(await page.locator("#setup .setup-form").isVisible(), "tapping Your starting point opens it");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Menu: clicking a tab opens that page
        {
            const { page } = await openPage(browser, "index.html", viewport);
            if (await page.locator(".menu-toggle").isVisible()) await page.locator(".menu-toggle").click();
            await Promise.all([page.waitForNavigation(), page.locator('#site-nav .nav-link[href="tools.html"]').click()]);
            check(page.url().endsWith("tools.html"), "clicking the Tools tab opens tools.html");
            check(await page.locator(".breadcrumbs [aria-current]").textContent() === "Tools", "inner pages show a 'you are here' trail");
            await page.close();
        }

        // Programs page
        console.log("\nprograms features");
        {
            const { page, errors } = await openPage(browser, "programs.html", viewport);
            check(await page.locator(".day-card").count() >= 3, "program builder shows day cards");
            await page.locator("#day-grid input[type=checkbox]").first().check({ force: true });
            check(/^1 of/.test(await page.locator("#progress-label").textContent()), "checking an exercise updates progress");
            await page.locator("#reset-week").click();
            await pickGoal(page, "classic");
            await page.locator('input[name="days"][value="5"]').check({ force: true });
            check(await page.locator(".day-card").count() === 5, "5-day plan shows 5 day cards");
            await pickGoal(page, "beginner");
            check(await page.locator('input[name="days"][value="5"]').isDisabled(), "unavailable day options are disabled");
            check(/New to lifting · 4 days/.test(await page.locator("#program-head h3").textContent()), "switching to a plan without 5 days picks the nearest");
            // How-to guide opens with steps and a demo link
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); document.querySelectorAll(".day-menu").forEach((d) => { d.open = true; }); }); await page.locator("[data-howto]").first().click();
            check(await page.locator("#howto[open] .howto-steps li").count() >= 3, "How to opens a step-by-step guide");
            check((await page.locator(".howto-demo").getAttribute("href")).startsWith("https://www.youtube.com/results?search_query="), "guide has a YouTube demo search");
            await page.locator("#howto-close").click();

            // Rest timer starts from the rest time on an exercise
            await page.locator("[data-rest]").first().click();
            check(await page.locator("#rest-timer").isVisible(), "tapping a rest time starts the rest timer");
            check(/^\d:\d\d$/.test(await page.locator("#rest-timer-time").textContent()), "rest timer counts down in m:ss");
            check(/Next set at/.test(await page.locator("#rest-timer-at").textContent()), "the rest timer shows when the next set starts");
            // Change pages mid-rest: the timer keeps going
            await page.goto(url("exercises.html"), { waitUntil: "load" });
            await page.waitForTimeout(400);
            check(await page.locator("#rest-timer").isVisible() && /^\d:\d\d$/.test(await page.locator("#rest-timer-time").textContent()), "the rest timer keeps running on another page");
            await page.click("#rest-stop");
            await page.goto(url("programs.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.locator("[data-rest]").first().click();
            await page.locator("#rest-stop").click();
            check(!(await page.locator("#rest-timer").isVisible()), "Done resting closes the timer");

            // Weekly rotation: the classic plan changes some accessories from week to week
            await pickGoal(page, "classic");
            await page.locator('input[name="days"][value="4"]').check({ force: true });
            const namesNow = await page.locator(".ex-name").allTextContents();
            await page.locator("#week-next").click();
            const namesNext = await page.locator(".ex-name").allTextContents();
            check(namesNow.length === namesNext.length && namesNow.some((n, i) => n !== namesNext[i]), "next week rotates some exercises");
            check(namesNow[0] === namesNext[0], "the main lift stays the same week to week");
            check(/over/.test(await page.locator("#week-variety").textContent()), "shows how many combinations the plan has");
            // Waves: week 3 is Heavy (main lift fewer reps), week 4 is Recover (half the sets)
            const doseWeek = async () => page.locator(".ex-row").first().locator(".ex-dose").textContent();
            const accessoryDose = async () => page.locator(".ex-row").nth(1).locator(".ex-dose").textContent();
            const w1Main = await (async () => { await page.locator("#week-today").click(); return doseWeek(); })();
            const w1Acc = await accessoryDose();
            await page.locator("#week-next").click(); await page.locator("#week-next").click();
            check(/Heavy week/.test(await page.locator("#week-phase").textContent()) && (await doseWeek()) !== w1Main, `week 3 is a Heavy week with a heavier main-lift dose (${w1Main} -> ${await doseWeek()})`);
            await page.locator("#week-next").click();
            const setCount = (t) => Number(t.split("×")[0]);
            check(/Recover week/.test(await page.locator("#week-phase").textContent()) && setCount(await accessoryDose()) < setCount(w1Acc), "week 4 is a Recover week with fewer sets");
            await page.locator("#week-today").click();
            // Light week (deload): one tap halves the sets for this week only, and tapping again undoes it
            check(await page.locator("#week-light-btn").isVisible() && await page.locator("#week-light-btn").getAttribute("aria-pressed") === "false", "the week bar offers a light week");
            await page.locator("#week-light-btn").click();
            check(await page.locator("#week-light-btn").getAttribute("aria-pressed") === "true" && setCount(await accessoryDose()) < setCount(w1Acc) && await page.locator(".badge-you", { hasText: "Light week" }).count() >= 1, "a light week halves the sets and says so");
            await page.locator("#week-next").click();
            check(await page.locator("#week-light-btn").getAttribute("aria-pressed") === "false", "the light week only applies to the week you chose");
            await page.locator("#week-today").click();
            await page.locator("#week-light-btn").click();
            check(setCount(await accessoryDose()) === setCount(w1Acc) && !(await page.evaluate(() => localStorage.getItem("gu-light-weeks") || "")).includes("classic"), "turning the light week off puts the sets back");
            await pickGoal(page, "c25k");
            check(await page.locator("#week-light").isHidden(), "Couch to 5K has no light-week button (you repeat a week instead)");
            await pickGoal(page, "classic");
            await page.locator('input[name="days"][value="4"]').check({ force: true });

            // Swap changes just that exercise
            const before = await page.locator(".ex-row").nth(1).locator(".ex-name").textContent();
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); document.querySelectorAll(".day-menu").forEach((d) => { d.open = true; }); }); await page.locator(".ex-row").nth(1).locator("[data-swap]").click();
            const swapPanel = page.locator(".ex-row").nth(1).locator(".swap-pick");
            check(await swapPanel.isVisible() && await page.locator(".ex-row").nth(1).locator("[data-swap]").getAttribute("aria-expanded") === "true", "Swap opens a short list to pick from");
            const optCount = await swapPanel.locator(".swap-opt").count();
            check(optCount >= 2 && optCount <= 5, `the swap list has a few choices (${optCount})`);
            check(/^(Last |New to you)/.test((await swapPanel.locator(".swap-opt-last").first().textContent()).trim()), "each swap choice shows your last weight or that it's new to you");
            const picked = (await swapPanel.locator(".swap-opt-name").nth(1).textContent()).trim();
            check(await page.evaluate(([a, b]) => builderMuscle(a) === builderMuscle(b), [before.trim(), picked]), `swap choices work the same main muscle (${before} -> ${picked})`);
            await swapPanel.locator(".swap-opt").nth(1).click();
            const after = await page.locator(".ex-row").nth(1).locator(".ex-name").textContent();
            check(before !== after && after.trim() === picked, `Swap changes the exercise to the one you picked (${before} -> ${after})`);
            check(await page.evaluate(() => { const keep = localStorage.getItem("gu-log"); const s = "Barbell back squat" in EXERCISES ? "Barbell back squat" : Object.keys(EXERCISES)[0]; localStorage.setItem("gu-log", JSON.stringify({ [s]: [{ date: "2026-10-01", unit: "lb", sets: [{ w: 95, r: 10 }, { w: 100, r: 8 }] }] })); const t = swapLastText(s, "lb"); if (keep === null) localStorage.removeItem("gu-log"); else localStorage.setItem("gu-log", keep); return t === "Last 100 lb \u00d7 8"; }), "swap choices show the heaviest set from last time");
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); });
            await page.locator(".ex-row").nth(1).locator("[data-swap]").click();
            const putBack = page.locator(".ex-row").nth(1).locator('.swap-pick [data-swap-to][data-name=""]');
            check(await putBack.isVisible() && (await putBack.textContent()).includes(before.trim()), "a swapped exercise offers to put the original back");
            await putBack.click();
            check((await page.locator(".ex-row").nth(1).locator(".ex-name").textContent()).trim() === before.trim(), "Put back restores the original exercise");
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); });
            await page.locator(".ex-row").nth(1).locator("[data-swap]").click();
            await page.locator(".ex-row").nth(1).locator(".swap-opt").first().click();
            check(before !== await page.locator(".ex-row").nth(1).locator(".ex-name").textContent(), "picking from the list swaps again");

            // A new exercise in a slot (rotation or Swap) gets its first weight from the one it replaced
            const repl = await page.evaluate(() => {
                const keep = localStorage.getItem("gu-log");
                localStorage.setItem("gu-log", JSON.stringify({ "Leg press": [{ date: "2026-10-01", unit: "lb", sets: [{ w: 95, r: 10 }, { w: 95, r: 10 }] }] }));
                const t = nextTarget("Hack squat", "3 × 10–12", "lb", "Leg press");
                const text = replacesText("Leg press", "lb");
                const plain = nextTarget("Hack squat", "3 × 10–12", "lb");
                // The beginner plan changes exercises every 4 weeks: find a slot that changed and check it names the old one
                const plan = PROGRAMS.beginner.plans[Object.keys(PROGRAMS.beginner.plans)[0]];
                const days = Object.keys(PROGRAMS.beginner.plans)[0];
                let rot = null;
                plan.days.forEach((day, di) => { const a = dayLineup("beginner", days, di, day.items, 4, {}), b = dayLineup("beginner", days, di, day.items, 5, {}), c = dayLineup("beginner", days, di, day.items, 7, {});
                    b.forEach((x, xi) => { if (!rot && x.name !== a[xi].name) rot = { was: a[xi].name, now: x.name, replaced: x.replaced, later: c[xi].replaced, wk4: a[xi].replaced }; }); });
                if (keep === null) localStorage.removeItem("gu-log"); else localStorage.setItem("gu-log", keep);
                return { w: t && t.weight, start: t && t.start, replaces: t && t.replaces, text, plainW: plain && plain.weight, rot };
            });
            check(repl.text === "Replaces Leg press (last 95×10)", `the plan names the exercise it replaced (${repl.text})`);
            check(repl.replaces === "Leg press" && repl.start && repl.w > 0 && repl.w < 95, `the first weight comes from the replaced exercise, a bit lighter (${repl.w} lb)`);
            check(repl.rot && repl.rot.replaced === repl.rot.was && repl.rot.later === repl.rot.was, `a rotated slot knows what it replaced for its whole 4-week block (${repl.rot && `${repl.rot.was} -> ${repl.rot.now}`})`);
            const swappedFrom = await page.evaluate(() => { const row = document.querySelectorAll(".ex-row")[1]; return row ? row.querySelector(".ex-name").textContent.trim() : ""; });
            await page.evaluate(([orig]) => { window.__keepLog = localStorage.getItem("gu-log"); const log = JSON.parse(window.__keepLog || "{}"); log[orig] = [{ date: "2026-10-01", unit: "lb", sets: [{ w: 50, r: 10 }] }]; localStorage.setItem("gu-log", JSON.stringify(log)); window.dispatchEvent(new CustomEvent("logchange", { detail: { fromPanel: true } })); }, [before.trim()]);
            const replLine = page.locator(".ex-row").nth(1).locator(".ex-replaces");
            check(swappedFrom !== before.trim() && await replLine.count() === 1 && (await replLine.textContent()).includes(`Replaces ${before.trim()} (last 50×10)`), "a swapped exercise shows what it replaces and your last weight on it");
            await page.evaluate(() => { if (window.__keepLog === null) localStorage.removeItem("gu-log"); else localStorage.setItem("gu-log", window.__keepLog); window.dispatchEvent(new CustomEvent("logchange", { detail: { fromPanel: true } })); });

            // Logging sets gives a target next time, and the progress chart draws
            const row = page.locator(".ex-row").nth(2);
            const exName = await row.locator(".ex-name").textContent();
            await row.locator("[data-log]").click();
            const form = row.locator(".log-form");
            const sets = await form.locator('input[name="r"]').count();
            // Typos are caught before they're saved
            await form.locator('input[name="w"]').nth(0).fill("-20");
            await form.locator('input[name="r"]').nth(0).fill("999");
            await form.locator('button[type="submit"]').click();
            check(/Check set 1/.test(await form.locator(".log-status").textContent()) && await page.evaluate((n) => !getLog()[n], exName), "a negative weight or 999 reps isn't saved");
            for (let i = 0; i < sets; i++) {
                await form.locator('input[name="w"]').nth(i).fill("100");
                await form.locator('input[name="r"]').nth(i).fill("12");
            }
            await form.locator('button[type="submit"]').click();
            const target = await page.locator(".ex-row").nth(2).locator(".ex-target").textContent();
            check(/(Last time|Today so far): 100×12/.test(target) && /Go up to/.test(target), `logging the top of the range suggests more weight next time`);
            check(await page.locator(".ex-row").nth(2).locator('input[type="checkbox"]').isChecked(), "logging today's sets checks the exercise off");
            check(await page.locator("#progress-exercise").inputValue() === exName, "progress panel picks up the logged exercise");
            check(await page.locator("#progress-chart .chart-proj").count() === 1, "progress chart draws a projection");

            // Personal settings: a focus muscle adds a set on Classic Physique
            await page.locator("#profile-panel summary").click();
            await page.selectOption("#pf-focus", "shoulders");
            check(await page.locator(".badge-you", { hasText: "focus" }).count() > 0, "focus muscle adds an extra set");
            await page.selectOption("#pf-experience", "new");
            check(await page.locator(".badge-you", { hasText: "fewer" }).count() > 0, "newer lifters get fewer accessory sets");
            await page.selectOption("#pf-sex", "female");
            check(/men and women/.test(await page.locator("#profile-note").textContent()), "choosing a sex explains the plans work for everyone");
            check(await page.evaluate(() => (getProfile().sex === "female")), "sex is saved in the profile");
            const steps = await page.evaluate(() => [weightStep("Lateral raise", "lb", 15), weightStep("Lateral raise", "lb", 60), weightStep("Leg press", "lb", 200)]);
            check(steps.join() === "2.5,5,10", `light upper-body lifts move up in smaller steps (${steps.join()})`);
            // Couch to 5K changes every week; sourced plans credit their source
            await pickGoal(page, "c25k");
            check(/Based on/.test(await page.locator(".plan-source").textContent()), "sourced plans show where they come from");
            const c25kW1 = await page.locator(".day-card").first().textContent();
            await page.locator("#week-next").click();
            const c25kW2 = await page.locator(".day-card").first().textContent();
            check(/1 min/.test(c25kW1) && /1½ min, walk 2 min/.test(c25kW2), "Couch to 5K steps up week by week");
            await page.locator("#week-today").click();
            check(await page.evaluate(() => PROGRAMS.c25k.plans[3].weeks.length === 9 && PROGRAMS.gzclp.plans[4].days.length === 4), "Couch to 5K has 9 weeks and GZCLP 4 workouts");
            for (const goal of ["glutes", "upper", "gzclp", "endurance"]) {
                await pickGoal(page, goal);
                check(await page.locator(".day-card").count() >= 3, `${goal} plan shows its days`);
            }

            check(await page.locator(".day-card.is-next").count() === 1, "the next unfinished day is marked Up next");
            check(/today's workout/i.test(await page.locator("#jump-today").textContent()) && await page.locator("#jump-today").isVisible(), "a button jumps to today's workout");

            // Home and dumbbell plans never rotate into equipment they don't have, over 30 weeks
            const kitProblems = await page.evaluate(() => {
                const bad = [];
                for (const [program, allowed] of [["home", ["none"]], ["dumbbell", ["none", "db"]]]) {
                    for (const [days, plan] of Object.entries(PROGRAMS[program].plans)) {
                        for (let week = 1; week <= 30; week++) {
                            plan.days.forEach((day, di) => dayLineup(program, Number(days), di, day.items, week, {}).forEach((x) => {
                                if (!allowed.includes((EXERCISES[x.name] || {}).kit)) bad.push(`${program} w${week}: ${x.name}`);
                            }));
                        }
                    }
                }
                return bad;
            });
            check(kitProblems.length === 0, `home and dumbbell plans only use their equipment ${kitProblems.slice(0, 3).join("; ")}`);
            // Cardio plan: log a cardio session and get a next-time suggestion
            await pickGoal(page, "cardio");
            const cardioRow = page.locator(".ex-row").first();
            await cardioRow.locator("[data-log]").click();
            await cardioRow.locator('input[name="minutes"]').fill("30");
            await cardioRow.locator('input[name="distance"]').fill("1.8");
            await cardioRow.locator(".cardio-form button[type=submit]").click();
            const cardioTarget = await page.locator(".ex-row").first().locator(".ex-target").textContent();
            check(/30 min/.test(cardioTarget) && /try about 35 minutes/.test(cardioTarget), `logging cardio suggests a little more next time`);
            check(await page.locator(".ex-row").first().locator("[data-swap]").count() === 1, "cardio activities can be swapped");

            await pickGoal(page, "busy");
            check(await page.locator(".day-card").count() === 2 && await page.locator('input[name="days"][value="2"]').isChecked(), "Short on time shows 2 days");
            // Ticking an exercise makes it your plan; just looking at another plan doesn't switch it
            await page.locator(".day-card .ex-row input[type=checkbox]").first().check({ force: true });
            await pickGoal(page, "home");
            check(await page.locator("#adopt-note").isVisible() && /Your plan is still/.test(await page.locator("#adopt-note").textContent()), "looking at another plan says your plan hasn't changed, with a Switch button");
            await pickGoal(page, "busy");

            await page.locator(".theme-toggle").click();
            check(await page.evaluate(() => document.documentElement.dataset.theme === "dark"), "dark mode toggles");
            await page.screenshot({ path: path.join(SHOTS, `${name}-programs-dark.png`), fullPage: true });

            // Coming back: the Programs page reopens the last plan, and home offers to continue it
            await page.goto(url("programs.html"));
            await page.waitForTimeout(200);
            check(/Short on time/.test(await page.locator("#program-head h3").textContent()), "Programs reopens the plan you used last");
            await page.goto(url("index.html"));
            await page.waitForTimeout(200);
            check(/Short on time/.test(await page.locator(".home-next").textContent()) && /program-busy-/.test(await page.locator(".home-next .btn-primary").getAttribute("href")), "home page offers to continue your plan");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Pros page
        {
            const { page } = await openPage(browser, "pros.html", viewport);
            check(await page.locator(".principles > li").count() === 6, "six pro principles");
            const safe = await page.locator(".pro-link").evaluateAll((as) => as.every((a) => a.target === "_blank" && /noopener/.test(a.rel) && a.href.startsWith("https://")));
            check(safe, "pro links open safely in a new tab");
            check(await page.locator(".principles > li > details.principle-guide").count() === 6, "each pro habit has a How to start guide");
            check(await page.locator(".principle-guide[open]").count() === 0, "guides start folded");
            await page.locator("#guide-overload summary").focus();
            await page.keyboard.press("Enter");
            check(await page.locator("#guide-overload").evaluate((d) => d.open) && await page.locator("#guide-overload ol li").count() >= 3, "a guide opens from the keyboard with practical steps");
            const pOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
            check(pOverflow <= 0, `an open guide doesn't cause sideways scrolling (${pOverflow}px)`);
            await page.locator(".principle-guide summary").evaluateAll((s) => s.forEach((x) => { if (!x.parentElement.open) x.click(); }));
            await page.screenshot({ path: path.join(SHOTS, `${name}-pros-guides.png`), fullPage: true });
            await page.locator(".theme-toggle").click();
            await page.screenshot({ path: path.join(SHOTS, `${name}-pros-guides-dark.png`), fullPage: true });
            await page.goto(url("pros.html", "#guide-food"));
            await page.waitForTimeout(250);
            check(await page.locator("#guide-food").evaluate((d) => d.open), "a link to a guide opens it");
            check(/dietitian/.test(await page.locator("#guide-food").textContent()), "the food guide points to a doctor or dietitian");
            await page.close();
        }

        // Tools page
        console.log("\ntools features");
        // PR warm-up: sets climb from the empty bar to just under the attempt, all loadable
        {
            const { page, errors } = await openPage(browser, "tools.html", viewport);
            await page.evaluate(() => { localStorage.setItem("gu-unit", "lb"); localStorage.removeItem("gu-log"); localStorage.removeItem("gu-coach-maxes"); });
            await page.reload({ waitUntil: "load" });
            await page.locator('#pr-form input[value="Back squat"]').check({ force: true });
            await page.fill("#pr-target", "315");
            await page.waitForTimeout(150);
            const pr = await page.evaluate(() => {
                const sets = prWarmup("Back squat", 315, "lb", 45), dl = prWarmup("Deadlift", 405, "lb", 45), kg = prWarmup("Bench press", 100, "kg", 20);
                const ok = (list, target, bar, unit) => list.every((s, i) => s.w < target && (i === 0 || s.w > list[i - 1].w) && platesPerSide(s.w, bar, unit)) && list[list.length - 1].w >= target * 0.88;
                return { first: sets[0].w, n: sets.length, ok: ok(sets, 315, 45, "lb") && ok(dl, 405, 45, "lb") && ok(kg, 100, 20, "kg"), dlFirst: dl[0].w, rows: document.querySelectorAll("#pr-results .pr-set").length, rest: document.querySelectorAll("#pr-results [data-rest]").length };
            });
            check(pr.first === 45 && pr.dlFirst === 135 && pr.ok && pr.n >= 5 && pr.rows === pr.n + 1 && pr.rest === pr.n, `PR warm-up builds loadable sets up to the attempt (squat ${pr.n} sets from the empty bar, deadlift from 135)`);
            await page.locator("[data-pr-save]").click();
            const saved = await page.evaluate(() => { const l = logFor("Back squat"); return l.length && l[l.length - 1].sets[0].w; });
            check(saved === 315, "saving a PR puts it in the log");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }
        {
            const { page, errors } = await openPage(browser, "tools.html", viewport);
            await page.fill("#cal-age", "30");
            await page.fill("#cal-ft", "5");
            await page.fill("#cal-in", "10");
            await page.fill("#cal-weight", "185");
            check(/\d/.test(await page.locator("#cal-results .result.big .result-value").textContent().catch(() => "")), "calorie estimator gives a number");
            await page.fill("#rm-weight", "185");
            await page.fill("#rm-reps", "5");
            check((await page.locator("#rm-results .result-value").textContent().catch(() => "")).startsWith("215"), "one-rep max math is right (185 x 5 = 215)");
            await page.fill("#plate-target", "225");
            check((await page.locator(".plate-list").textContent().catch(() => "")).includes("45 + 45"), "plate loader math is right (225 = 45 + 45 per side)");
            // Weight trend: two weeks of weigh-ins show a weekly change, and fast loss gets a caution
            await page.evaluate(() => {
                const days = []; const today = new Date();
                for (let i = 14; i >= 0; i--) {
                    const d = new Date(today); d.setDate(d.getDate() - i);
                    days.push({ date: d.toISOString().slice(0, 10), w: 200 - (14 - i) * 0.6, unit: "lb" });
                }
                localStorage.setItem("gu-weights", JSON.stringify(days));
            });
            await page.reload();
            await page.waitForTimeout(250);
            check(/Weekly change/.test(await page.locator("#weight-results").textContent()), "weight trend shows the weekly change");
            check(await page.locator("#weight-results .warn").count() === 1, "fast weight loss gets a gentle caution");
            await page.fill("#wt-value", "190");
            await page.locator("#weight-form button[type=submit]").click();
            check(await page.locator("#weight-list li").count() >= 1, "adding a weigh-in shows it in the list");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Exercise library: search, filter, and how-to
        {
            const { page, errors } = await openPage(browser, "exercises.html", viewport, "#back");
            const backCount = await page.locator(".library-card").count();
            check(backCount >= 8 && await page.locator('input[name="muscle"][value="back"]').isChecked(), `exercises.html#back opens with Back picked (${backCount} exercises)`);
            await page.locator('input[name="muscle"][value=""]').evaluate((el) => el.click());
            check(await page.locator(".library-card").count() >= 90, "the library lists every exercise");
            await page.fill("#library-search", "split squat");
            check(await page.locator(".library-card").count() >= 2, "searching finds exercises");
            await page.locator(".library-card [data-howto]").first().click();
            check(await page.locator("#howto[open]").count() === 1, "How to works from the library");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Not too much at once: a first-time visitor sees a simple version of each page
        {
            const { page, errors } = await openPage(browser, "programs.html", viewport);
            await page.evaluate(() => localStorage.clear());
            await page.reload({ waitUntil: "load" });
            const visibleGoals = await page.locator('#goal-picker label:visible').count();
            check(visibleGoals === 5, `Beginners see 5 plans (${visibleGoals} shown)`);
            check(await page.locator("#week-phase").isHidden() && await page.locator("#week-variety").isHidden() && await page.locator("#why-rotate").isHidden() && await page.locator("#profile-panel").isHidden(), "beginners don't see training waves, variety details, or extra settings");
            check(/Beginner/.test(await page.locator(".level-tag").textContent()), "each plan shows its level");
            const counts = [];
            for (const lvl of ["Intermediate", "Advanced", "Expert"]) {
                await page.locator(`.level-wrap input[value="${lvl}"]`).check({ force: true });
                counts.push(await page.locator('#goal-picker label:visible').count());
            }
            check(counts.join() === "9,13,15", `each level up shows more plans (${counts.join()})`);
            check(await page.locator("#week-variety").isVisible() && await page.locator("#profile-panel").isVisible(), "higher levels show the in-depth plan details");
            await page.locator('.level-wrap input[value="Beginner"]').check({ force: true });
            check(/4 more plans at Intermediate/.test(await page.locator("#level-unlock").textContent()), "beginners are told what the next level adds");
            const menuCounts = await page.evaluate(() => [...document.querySelectorAll("#site-nav .submenu")].map((m) => m.querySelectorAll("a").length));
            check(Math.max(...menuCounts) <= 6, `every menu has 6 links or fewer (${menuCounts.join(",")})`);
            await page.evaluate(() => document.activeElement && document.activeElement.blur());
            await page.keyboard.press("/");
            await page.fill("#jump-input", "push pull");
            check(/Push \/ pull \/ legs/.test(await page.locator("#jump-list").textContent()), "search still finds plans that aren't in the menu");
            await page.keyboard.press("Escape");
            await page.goto(url("me.html"), { waitUntil: "load" });
            check(/to start tracking streaks/.test(await page.locator("#milestones").textContent()) && await page.locator("#milestones-head").isHidden(), "milestones wait until a few workouts are logged");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Your starting point: level + bodyweight give starting weights everywhere
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            check(await page.locator("[data-level-bar], .level-bar").count() === 0 && await page.locator("#setup .setup-form").count() === 1 && /Your level: Beginner/.test(await page.locator("#setup").textContent()), "the home page has no level picker (it's on the plans), and has Your starting point");
            await page.fill("#setup-bw-0", "180");
            await page.selectOption("#setup-sex-0", "male");
            await page.evaluate(() => setLevel("Intermediate"));
            await page.waitForTimeout(100);
            const benchMid = Number((await page.locator(".setup-weights li").first().textContent()).replace(/\D+/g, ""));
            check(benchMid >= 120 && benchMid <= 160 , `starting weights show for your level (bench ${benchMid} lb)`);
            await page.evaluate(() => setLevel("Expert"));
            await page.waitForTimeout(100);
            const benchTop = Number((await page.locator(".setup-weights li").first().textContent()).replace(/\D+/g, ""));
            check(benchTop > benchMid, `a higher level gives heavier starting weights (${benchMid} -> ${benchTop} lb)`);
            await page.evaluate(() => { localStorage.removeItem("gu-log"); setLevel("Intermediate"); });
            await page.goto(url("programs.html", "#program-strength-3"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            const targets = await page.locator(".ex-target").allTextContents();
            check(targets.some((t) => /from your level and bodyweight/.test(t)), `plans suggest a starting weight for each lift (${(targets.find((t) => /level and bodyweight/.test(t)) || "").slice(0, 70)})`);
            check(await page.locator(".ex-name .equip").count() >= 3 && await page.locator(".ex-name .equip-barbell").count() >= 1, "each exercise in a plan shows an equipment icon");
            // At home: switch between nothing and dumbbells
            await page.goto(url("programs.html", "#program-home"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#home-kit").isVisible(), "home plans ask what equipment you have");
            await page.locator('#home-kit input[value="homedb"]').check({ force: true });
            await page.waitForTimeout(300);
            const homeDb = await page.locator(".day-card").allTextContents();
            check(/Home with dumbbells/.test(await page.locator("#program-head").textContent()) && await page.locator(".ex-name .equip-db").count() >= 1 && !homeDb.some((t) => /Dumbbell bench press|Incline dumbbell|Seated dumbbell|Hip thrust/.test(t)), "picking Dumbbells switches to a beginner dumbbell plan that needs no bench");
            await page.goto(url("programs.html", "#program-fatloss"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator('#home-kit input[value="homedb"]').count() === 1, "Lose fat offers the at-home versions");
            await page.goto(url("programs.html", "#build"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator(".builder-level .level-bar input").count() === 4 && await page.locator(".level-wrap .level-bar input").count() === 4, "the level picker is on the ready-made plans and in Build your own workout");
            await page.evaluate(() => { ["gu-profile", "gu-level", "gu-last-plan"].forEach((k) => localStorage.removeItem(k)); });
            // My progress is personal: your name and your next workout
            await page.evaluate(() => { const p = JSON.parse(localStorage.getItem("gu-profile") || "{}"); p.name = "Chris"; localStorage.setItem("gu-profile", JSON.stringify(p)); });
            await page.goto(url("me.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(/Chris's progress/i.test(await page.locator(".page-banner h1").textContent()) && /Up next/i.test(await page.locator("#me-dash").textContent()), "My progress shows your name and your next workout");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Exercise library: filter by equipment, with icons
        {
            const { page, errors } = await openPage(browser, "exercises.html", viewport);
            await page.fill("#library-search", "seated chest press");
            check(await page.locator('.library-card h3', { hasText: "Machine chest press" }).count() === 1, "searching an everyday machine name (seated chest press) finds it");
            await page.fill("#library-search", "iso-lateral row");
            check(await page.locator('.library-card h3', { hasText: /^Iso-lateral row$/ }).count() === 1, "plate-loaded machines like the Iso-lateral row are in the library");
            await page.fill("#library-search", "");
            const all = await page.locator(".library-card").count();
            const noPic = await page.evaluate(() => [...document.querySelectorAll(".library-card")].filter((c) => !c.querySelector(".library-pic .lib-main")).map((c) => c.querySelector("h3").textContent));
            check(noPic.length <= 2, `every exercise card shows the muscles it works ${JSON.stringify(noPic)}`);
            await page.locator('input[name="equip"][value="db"]').evaluate((el) => el.click());
            const dbCards = await page.locator(".library-card").count();
            const kinds = await page.locator(".library-card .equip").evaluateAll((els) => [...new Set(els.map((e) => e.className.match(/equip-(\w+)/)[1]))]);
            check(dbCards > 10 && dbCards < all && kinds.every((k) => k === "db" || k === "body"), `the Dumbbells filter shows dumbbell and bodyweight moves (${dbCards} of ${all})`);
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Build your own workout: pick exercises, get a weight for each, save as My workout
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            check(await page.locator('.hero-build-link[href="programs.html#build"]').isVisible() && await page.locator('.tabbar a[href="programs.html#build"], .build-link').count() >= 1, "Build your own workout is easy to find (cover button, header button, phone tab)");
            check(!/no sign-up|no paywall/i.test(await page.locator("body").textContent()), "no \"free / no sign-up\" wording");
            await page.evaluate(() => { localStorage.clear(); localStorage.setItem("gu-profile", JSON.stringify({ bodyweight: "180", unit: "lb", sex: "male" })); localStorage.setItem("gu-level", JSON.stringify("Intermediate")); });
            await page.goto(url("programs.html", "#build"), { waitUntil: "load" });
            await page.waitForTimeout(400);
            check(await page.locator("#builder-body").isVisible(), "programs.html#build opens the workout builder");
            for (const ex of ["Bench press", "Lat pulldown", "Plank"]) {
                await page.fill("#builder-search", ex);
                await page.locator(`[data-add="${ex}"]`).click();
            }
            check(await page.locator(".builder-item").count() === 3, "exercises can be added");
            const w8 = await page.locator(".builder-item").first().locator(".bi-weight").textContent();
            await page.locator(".builder-item").first().locator('[data-f="amount"]').selectOption("5");
            const w5 = await page.locator(".builder-item").first().locator(".bi-weight").textContent();
            const lbs = (t) => Number((t.match(/about (\d+)/) || [])[1]);
            check(lbs(w8) > 0 && lbs(w5) > lbs(w8), `each exercise gets a weight, heavier for fewer reps (${lbs(w8)} -> ${lbs(w5)} lb)`);
            await page.locator(".builder-item").nth(2).locator("[data-move='-1']").click();
            check(/Plank/.test(await page.locator(".builder-item").nth(1).textContent()), "exercises can be reordered");
            // Too many for one muscle: allowed, but with a warning
            for (const ex of ["Incline dumbbell press", "Cable fly", "Machine chest press"]) { await page.fill("#builder-search", ex); await page.locator(`[data-add="${ex}"]`).click(); }
            await page.fill("#builder-search", "Pec deck");
            const anyway = (await page.locator('[data-add="Pec deck"]').textContent()).trim();
            await page.locator('[data-add="Pec deck"]').click();
            check(/Add anyway/i.test(anyway) && await page.locator(".bi-warn").count() >= 1 && /too many/.test(await page.locator(".builder-tally").textContent()), `3 or 4 exercises per muscle are fine; a 5th chest exercise is allowed but flagged (${anyway})`);
            for (const ex of ["Pec deck", "Machine chest press", "Cable fly", "Incline dumbbell press"]) await page.locator(".builder-item", { hasText: ex }).locator("[data-remove]").click();
            await page.locator('input[name="builder-goal"][value="strength"]').check({ force: true });
            check(/4–6|5/.test(await page.locator(".builder-item").first().locator('[data-f="amount"]').inputValue()), "switching the goal to Get stronger changes the reps");
            await page.locator(".builder-save").click();
            await page.waitForURL(/program-custom/);
            await page.waitForTimeout(400);
            const saved = await page.evaluate(() => store.get("gu-custom"));
            check(saved && saved.items.length === 3 && /^\d × (3–5|4–6|5)$/.test(saved.items[0].d), `Save and start saves it as My workout (${saved && saved.items[0].d})`);
            check(/Your plan/i.test(await page.locator("#program-head").textContent()) && /Start with about/.test(await page.locator(".ex-target").first().textContent()), "the saved workout opens with a starting weight on each lift");
            // Your plan bar: on other pages, shows today's exercises; the active custom workout can be edited
            await page.locator(".ex-row").nth(1).locator('input[type="checkbox"]').check({ force: true });
            await page.goto(url("tools.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#planbar").isVisible() && /1 of 3 done/.test(await page.locator("#planbar").textContent()), "the Your plan bar shows the current workout on other pages");
            await page.click(".planbar-toggle");
            check(await page.locator(".planbar-list li").count() === 3, "tapping the bar lists today's exercises");
            await page.click("#planbar [data-edit-custom]");
            await page.waitForURL(/#build/);
            await page.waitForTimeout(400);
            check(/Edit your workout/i.test(await page.locator("#builder-title").textContent()) && await page.locator(".builder-item").count() === 3, "Edit this workout opens the builder with the current exercises");
            {
                const planTop = await page.locator(".builder-plan").evaluate((el) => el.getBoundingClientRect().top);
                const coverVis = await page.locator(".builder-cover").isVisible();
                check(await page.locator("#builder-pick").isHidden() && coverVis && await page.locator(".builder-to-pick").getAttribute("aria-expanded") === "false" && planTop >= 0, "editing a day shows your workout and its muscle check first, with the exercise list folded away");
                await page.click(".builder-to-pick");
                const pickTop = await page.locator("#builder-pick").evaluate((el) => el.getBoundingClientRect().top);
                const planTop2 = await page.locator(".builder-plan").evaluate((el) => el.getBoundingClientRect().top);
                check(await page.locator("#builder-search").isVisible() && pickTop > planTop2 && await page.locator(".builder-to-pick").getAttribute("aria-expanded") === "true" && await page.evaluate(() => document.activeElement && document.activeElement.id === "builder-search"), "+ Add exercises opens the exercise list below your workout and jumps to the search");
            }
            await page.fill("#builder-search", "Iso-lateral row");
            await page.locator('[data-add="Iso-lateral row"]').click();
            await page.locator(".builder-save").click();
            await page.waitForURL(/program-custom/);
            await page.waitForTimeout(400);
            check(await page.evaluate(() => store.get("gu-custom").items.some((x) => x.n === "Iso-lateral row")) && await page.locator(".ex-row input[type=checkbox]:checked").count() === 1, "saving edits updates the workout and keeps what you already checked off");
            // Finish workout: saves the session, celebrates, and shows next time's targets
            await page.locator("[data-finish='0']").click();
            await page.waitForTimeout(300);
            const fin = await page.locator("#finish-dialog").textContent();
            check(/Good job/i.test(fin) && /Next time/i.test(fin) && /Start with about \d+ lb/.test(fin), "Finish workout shows a good-job screen with next time's weights");
            check(await page.evaluate(() => (store.get("gu-sessions") || []).length === 1) && await page.locator(".ex-row input[type=checkbox]:not(:checked)").count() === 0, "finishing saves the workout and checks the day off");
            await page.click("[data-finish-close]");
            check(/Saved to Progress/i.test(await page.locator(".day-card[data-day='0']").textContent()) && await page.locator(".day-card[data-day='0'] .ex-list").evaluate((l) => l.hidden) && await page.locator("[data-continue='0']").count() === 1, "a finished day folds away once it's saved to Progress and offers Continue");
            check(await page.evaluate(() => !document.getElementById("day-grid").classList.contains("sort-done")), "with every day done, nothing moves");
            // Phones without built-in pop-up support still see the summary
            await page.evaluate(() => { HTMLDialogElement.prototype.showModal = undefined; });
            await page.locator("[data-finish='0']").click();
            await page.waitForTimeout(300);
            check(await page.locator("#finish-dialog").isVisible(), "the summary still shows on browsers without pop-up support");
            await page.click("[data-finish-close]");
            check(/Continue to Day 2/.test(await page.locator("#finish-dialog [data-finish-continue]").textContent()) && await page.locator("#finish-dialog [data-finish-plans]").count() === 1, "after finishing, you can continue to Day 2 or pick a plan");
            // Continue builds Day 2 when there isn't one yet
            await page.locator("[data-continue='0']").click();
            await page.waitForTimeout(300);
            check(/Day 2/.test(await page.locator("[data-builder]").textContent()), "Continue opens the builder for Day 2");
            await page.evaluate(() => { localStorage.clear(); });
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Coach: ask for muscles, get a workout, start it on the Plans page
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            await page.evaluate(() => { localStorage.removeItem("gu-custom"); localStorage.removeItem("gu-level"); });
            // On phones the coach button steps aside while the cover's ask box is showing; it's back once you scroll
            await page.locator("#hero-ask").scrollIntoViewIfNeeded();
            await page.waitForTimeout(200);
            check(viewport.width > 760 || !(await page.locator("#coach-fab").isVisible()), "on phones the coach button hides behind the cover's own ask box");
            await page.evaluate(() => window.scrollTo(0, document.querySelector("#get-plan").offsetTop));
            await page.waitForTimeout(200);
            await page.click("#coach-fab");
            check(await page.locator("#coach").isVisible() && /Fitness Coach/.test(await page.locator("#coach-title").textContent()), "the Fitness Coach button opens the chat");
            await page.fill("#coach-input", "legs");
            await page.press("#coach-input", "Enter");
            const typingShown = await page.locator(".coach-typing").isVisible();
            const t0 = Date.now();
            await page.locator(".coach-typing").waitFor({ state: "detached", timeout: 4000 });
            const waited = Date.now() - t0;
            check(typingShown && waited > 700 && waited < 2600, `Fitness Coach takes a moment to read before answering (${waited} ms)`);
            const ask = async (text) => {
                await page.fill("#coach-input", text);
                await page.press("#coach-input", "Enter");
                await page.locator(".coach-typing").waitFor({ state: "attached", timeout: 500 }).catch(() => {});
                await page.locator(".coach-typing").waitFor({ state: "detached", timeout: 4000 });
                return page.locator(".coach-msg.is-coach").last().textContent();
            };
            const w = await ask("hey I wanna do shoulders back and abs");
            check(/Shoulders, Back & Abs/.test(w) && await page.locator(".coach-msg.is-coach").last().locator(".coach-ex").count() >= 4, "Coach builds a workout for the muscles you name");
            const names = await page.locator(".coach-msg.is-coach").last().locator(".coach-ex").allTextContents();
            const groups = await page.evaluate((names) => names.map((n) => EXERCISES[n].m.toLowerCase()), names);
            check(groups.some((m) => /shoulder/.test(m)) && groups.some((m) => /lats|upper back/.test(m)) && groups.some((m) => /abs|core/.test(m)), `the workout covers each muscle asked for (${names.join(", ")})`);
            await ask("no equipment");
            const homeNames = await page.locator(".coach-msg.is-coach").last().locator(".coach-ex").allTextContents();
            check(homeNames.length >= 3 && await page.evaluate((n) => n.every((x) => EXERCISES[x].kit === "none"), homeNames), `"no equipment" only uses bodyweight moves (${homeNames.join(", ")})`);
            check(/Deadlift/.test(await ask("how do I do a deadlift?")) && await page.locator('.coach-msg.is-coach').last().locator('[data-howto="Deadlift"]').count() === 1, "Coach answers how-to questions with a link to the full guide");
            check(/doctor|physical therapist/.test(await ask("my knee hurts, can I do legs?")), "Coach sends pain and injury questions to a professional");
            check(/Back squat/.test(await ask("how do I do a squat?")) && /Push-up/.test(await ask("how do I do pushups")), "Coach understands everyday exercise names (squat, pushups)");
            const homeDb = await ask("legs at home with dumbbells");
            check(/dumbbells only/.test(homeDb), "\"at home with dumbbells\" uses dumbbells, not bodyweight only");
            const homeDbNames = await page.locator(".coach-msg.is-coach").last().locator(".coach-ex").allTextContents();
            check(await page.evaluate((n) => n.every((x) => !NEEDS_BENCH.test(x)), homeDbNames), `a home workout doesn't need a bench (${homeDbNames.join(", ")})`);
            check(/dietitian/.test(await ask("How much should I eat to lose weight?")), "a food question (even with the word weight) gets the food answer, not lifting advice");
            await ask(`<img src=x onerror="window.__pwned=1">`);
            check(await page.evaluate(() => !window.__pwned && document.querySelectorAll(".coach-log img").length === 0), "typing code into Coach can't run it");
            // How hard: "super challenging" builds a real Expert session without changing the site level
            const hard = await ask("give me a super challenging excerise that will put me to the test for my chest and back");
            const hardNames = await page.locator(".coach-msg.is-coach").last().locator(".coach-ex").allTextContents();
            check(/Set for Expert/.test(hard) && /Finisher/.test(hard) && hardNames.some((n) => /^(Bench press|Incline barbell press|Barbell row|Pull-up)$/.test(n)) && !hardNames.some((n) => /Assisted|machine/i.test(n)),
                `"super challenging" gets an Expert workout with free-weight lifts (${hardNames.join(", ")})`);
            check(await page.evaluate(() => getLevel()) === "Beginner", "a hard workout doesn't change the site level");
            check(/Set for Intermediate/.test(await ask("make it intermediate")) && /Set for Expert/.test(await ask("I want it set for expert")), "Coach changes the level when you name one");
            check(/Set for Advanced/.test(await ask("a bit easier")), `"easier" steps the workout down one level`);
            check(/Abs/.test(await ask("add abs")) && await page.evaluate(() => [...document.querySelectorAll(".coach-msg.is-coach:last-child .coach-ex")].some((b) => /abs|core/i.test(EXERCISES[b.textContent].m))), `"add abs" adds to the current workout`);
            const noBack = await ask("without back");
            check(/Chest & Abs/.test(noBack), `"without back" takes muscles out (${noBack.slice(0, 60)})`);
            check(/Set for Beginner/.test(await ask("easy legs workout")), `"easy" builds a Beginner workout`);
            // One lift and real weights: "get stronger at bench", then "I bench 275"
            const focus = await ask("I want to get stronger in bench");
            check(/What I heard/i.test(focus) && /Bench press focus/.test(focus) && /Get stronger/.test(focus) && /3 × 5/.test(focus) && /I bench 185 for 5/.test(focus), "Coach answers a one-lift strength question with sets, reps and how to progress");
            const weighed = await ask("I bench 275");
            check(/3 × 5 at 230 lb/.test(weighed) && /about \d+ lb each hand/.test(weighed) && /max about 275 lb/.test(weighed), `telling Coach your bench puts real weights on the workout (${(weighed.match(/Bench press[^·]*/) || [""])[0]})`);
            check(/max about 345 lb/.test(await ask("how much should I squat? I can do 315 for 3")) && /Back squat focus/.test(await page.locator(".coach-msg.is-coach").last().textContent()), "Coach works out a max from weight and reps");
            check(/1 or 2 good reps left/.test(await ask("how much weight should I use")), "Coach explains how to pick a weight");
            check(/Build muscle/.test(await ask("build muscle chest and back")) && /What I heard/i.test(await page.locator(".coach-msg.is-coach").last().textContent()), "Coach reads the goal from the request");
            await ask("chest and triceps, 30 minutes");
            // The chat stays open, with its history, when you move to another page
            const before = await page.locator(".coach-msg").count();
            await page.evaluate(() => { location.href = "tools.html"; });
            await page.waitForURL(/tools\.html/);
            await page.waitForTimeout(300);
            check(await page.locator("#coach").isVisible() && await page.locator(".coach-msg").count() === Math.min(before, 40), `the chat and its history follow you to other pages (${before} messages)`);
            check(/Chest & Triceps/.test(await page.locator(".coach-msg.is-coach").last().textContent()), "the last workout is still there after changing pages");
            await page.locator(".coach-msg.is-coach").last().locator("[data-coach-start]").click();
            await page.waitForURL(/programs\.html/);
            await page.waitForTimeout(300);
            check(/Your plan/.test(await page.locator(".program-head h3").textContent()) && /Chest & Triceps/.test(await page.locator(".day-card h4").first().textContent()), "Start this workout opens it as My workout on the Plans page");
            check(await page.locator(".day-card [data-log]").count() >= 3, "My workout can be logged like any plan");
            check(await page.locator(".day-card [data-fix-order]").count() === 0, "a Coach workout is saved in the best order (no \"better order\" box first)");
            // On a multi-day Your plan, Start this workout goes in as today's day and Plans lands on it
            await page.evaluate(() => {
                const week = Math.max(1, weekOf(programStart("custom")));
                Object.keys(localStorage).filter((k) => k.startsWith("gu-progress-custom-")).forEach((k) => localStorage.removeItem(k));
                localStorage.setItem("gu-custom", JSON.stringify({ days: [{ title: "Legs", items: [{ n: "Back squat", d: "3 × 8", rest: "2 min" }] }, { title: "Pull", items: [{ n: "Lat pulldown", d: "3 × 10", rest: "90 s" }] }] }));
                localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "custom", days: 2 }));
                localStorage.setItem(`gu-progress-custom-2-w${week}`, JSON.stringify(["0-0"]));
                localStorage.setItem("gu-coach-open", "true");
            });
            await page.goto(url("tools.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.locator(".coach-msg.is-coach [data-coach-start]").last().click();
            await page.waitForURL(/programs\.html.*#program-custom-3/);
            await page.waitForTimeout(400);
            const landed = await page.evaluate(() => {
                const card = document.querySelector(".day-card.is-next");
                const r = card ? card.getBoundingClientRect() : null;
                return { titles: [...document.querySelectorAll(".day-card h4")].map((h) => h.textContent), next: card ? card.querySelector("h4").textContent : "", onScreen: !!r && r.top >= -5 && r.top < innerHeight / 2 };
            });
            check(landed.titles.length === 3 && /Legs/.test(landed.titles[0]) && /Chest & Triceps/.test(landed.titles[1]) && /Pull/.test(landed.titles[2]) && /Chest & Triceps/.test(landed.next) && landed.onScreen,
                `Coach's Start this workout keeps Your plan, goes in as today's day, and lands on it (${JSON.stringify(landed)})`);
            // A tampered saved chat can't run code when it's loaded back
            await page.evaluate(() => {
                localStorage.setItem("gu-coach-history", JSON.stringify([{ who: "coach", html: `<img src=x onerror="window.__pwned=1"><p onclick="window.__pwned=1">hi</p><a href="javascript:window.__pwned=1">x</a><button data-howto="<script>">y</button>` }]));
                localStorage.setItem("gu-coach-open", "true");
            });
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.locator(".coach-log a").first().click({ force: true }).catch(() => {});
            await page.locator(".coach-log p").first().click({ force: true }).catch(() => {});
            check(await page.evaluate(() => !window.__pwned && !document.querySelector(".coach-log img, .coach-log [onclick], .coach-log a[href^='javascript']")), "a tampered saved chat can't run code");
            await page.click("#coach-clear");
            check(await page.locator(".coach-msg").count() === 1, "Clear chat starts a fresh conversation");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.evaluate(() => { ["gu-custom", "gu-last-plan", "gu-coach-history", "gu-coach-state", "gu-coach-open", "gu-coach-maxes"].forEach((k) => localStorage.removeItem(k)); });
            await page.close();
        }

        // Fitness Coach with its AI switched on (the AI service is faked here)
        {
            const ctx = await browser.newContext({ viewport, bypassCSP: true });
            const page = await ctx.newPage();
            page.on("dialog", (d) => d.accept().catch(() => {})); // confirm() pop-ups say yes
            const errors = [];
            page.on("pageerror", (e) => errors.push(e.message));
            await page.route(/fonts\.|unsplash/, (r) => r.abort());
            await page.route(/script\.js/, async (r) => {
                const body = fs.readFileSync(path.join(ROOT, "script.js"), "utf8").replace(/const COACH_AI_URL = "[^"]*";/, 'const COACH_AI_URL = "https://coach.test/api";');
                await r.fulfill({ contentType: "application/javascript", body });
            });
            const sent = [];
            let mode = "ok";
            await page.route("https://coach.test/api", async (r) => {
                if (r.request().method() === "OPTIONS") return r.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" } });
                sent.push(r.request().postData());
                if (mode === "down") return r.fulfill({ status: 502, headers: { "Access-Control-Allow-Origin": "*" }, contentType: "application/json", body: JSON.stringify({ error: "The AI service had a problem." }) });
                const text = `## Your week\nI assumed you train at a gym.\n- **Monday:** upper body\n- Tuesday: rest\n\nSee [the strength plan](programs.html#program-strength) and [this](https://evil.example/x).\n<img src=x onerror="window.__pwned=1"> <script>window.__pwned=1</script>\n<workout>{"title":"Upper A","items":[{"n":"bench press","d":"4 x 4-6","rest":"3 min","w":"225 lb"},{"n":"Made-up move","d":"3 × 10"},{"n":"Lat pulldown","d":"3 × 8–12","rest":"90 s","w":"<b>1</b>"}]}</workout>`;
                await new Promise((res) => setTimeout(res, 300));
                return r.fulfill({ headers: { "Access-Control-Allow-Origin": "*" }, contentType: "application/json", body: JSON.stringify({ text }) });
            });
            await page.goto(url("tools.html"), { waitUntil: "load" });
            await page.evaluate(() => { saveSession("Squat secret", "2026-10-01", "lb", [{ w: 999, r: 1 }]); });
            await page.click("#coach-fab");
            check(/Ask anything/.test(await page.locator(".coach-head p").textContent()) && /Claude, an AI made by Anthropic/.test(await page.locator(".coach-log").textContent()), "with AI on, Coach says answers come from Claude and what is sent");
            await page.fill("#coach-input", "I have 45 minutes 3 days a week, want to lose fat and keep strength");
            await page.press("#coach-input", "Enter");
            await page.waitForTimeout(200);
            check(/Reading your question/.test(await page.locator(".coach-typing").textContent()), "Coach shows what it's doing while the AI thinks");
            await page.locator(".coach-typing").waitFor({ state: "detached", timeout: 8000 });
            const msg = page.locator(".coach-msg.is-coach").last();
            const msgText = await msg.textContent();
            check(/Your week/.test(msgText) && await msg.locator("ul li strong").count() === 1, "the AI answer is shown with headings, lists and bold");
            check(await msg.locator('a[href="programs.html#program-strength"]').count() === 1 && await msg.locator('a[href*="evil"]').count() === 0, "AI answers can only link to this site's pages");
            check(await page.evaluate(() => !window.__pwned && !document.querySelector(".coach-log img, .coach-log script")), "code in an AI answer can't run");
            const exNames = await msg.locator(".coach-ex").allTextContents();
            check(exNames.join("|") === "Bench press|Lat pulldown" && /4 × 4–6 at 225 lb/.test(msgText) && !/<b>/.test(msgText), `the AI's workout only keeps real exercises and clean values (${exNames.join(", ")})`);
            const body = JSON.parse(sent[0]);
            check(body.messages[body.messages.length - 1].role === "user" && /45 minutes/.test(body.messages[body.messages.length - 1].content) && !/Squat secret|999/.test(sent[0]) && /Bench press/.test(body.context), "only the chat (not your logs) is sent, with the site's exercise list");
            await msg.locator("[data-coach-start]").click();
            await page.waitForURL(/programs\.html/);
            check(await page.evaluate(() => (store.get("gu-custom") || { items: [] }).items.some((x) => /225 lb/.test(x.d))), "Start saves the AI's workout as My workout");
            await page.click("#coach-fab").catch(() => {});
            if (!(await page.locator("#coach").isVisible())) await page.click("#coach-fab");
            mode = "down";
            await page.fill("#coach-input", "chest and back");
            await page.press("#coach-input", "Enter");
            await page.locator(".coach-typing").waitFor({ state: "detached", timeout: 8000 });
            check(/couldn't reach the AI coach/.test(await page.locator(".coach-log").textContent()) && /Chest & Back/.test(await page.locator(".coach-msg.is-coach").last().textContent()), "if the AI can't be reached, the built-in coach answers");
            const before = sent.length;
            await page.fill("#coach-input", "my shoulder hurts when I bench");
            await page.press("#coach-input", "Enter");
            await page.locator(".coach-typing").waitFor({ state: "detached", timeout: 8000 });
            check(sent.length === before && /doctor|physical therapist/.test(await page.locator(".coach-msg.is-coach").last().textContent()), "pain questions still get the built-in safety answer");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            // Rest alarms: once the Worker says it supports them, the timer offers "Buzz me when rest is over"
            // (the Worker is faked in the page; nothing leaves the test)
            await page.evaluate(() => { localStorage.setItem("gu-ios-timer-auto", "true"); localStorage.removeItem("gu-coach-open"); });
            await page.goto(url("programs.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.evaluate(() => {
                const real = window.fetch;
                window.fetch = (u, o) => (String(u).endsWith("/push-key") ? Promise.resolve(new Response(JSON.stringify({ key: "B".repeat(87) }), { status: 200 })) : real(u, o));
            });
            await page.evaluate(() => document.querySelector("[data-rest]").click());
            await page.waitForTimeout(500);
            await page.evaluate(() => document.getElementById("rest-size").click()); // the options live under More
            check(await page.locator("#rest-push").isVisible() && await page.evaluate(() => localStorage.getItem("gu-ios-timer-auto") === null), "rest alarms are offered once the Worker supports them, and nothing jumps to Shortcuts on its own");
            await page.evaluate(() => window.dispatchEvent(new CustomEvent("reststop")));
            await ctx.close();
        }
        // Remove day: no confirm box; the day goes, check-offs move with their days, and Undo puts it all back
        {
            const c = await browser.newContext({ viewport: { width: 390, height: 844 } });
            const p = await c.newPage();
            const errs = [];
            let asked = false;
            p.on("pageerror", (e) => errs.push(e.message));
            p.on("dialog", (d) => { asked = true; d.accept().catch(() => {}); });
            await p.route(/fonts\.|unsplash/, (r) => r.abort());
            await p.goto(url("programs.html"), { waitUntil: "load" });
            const wk = await p.evaluate(() => {
                const d = (t, n) => ({ title: t, items: [{ n, d: "3 × 8–12", rest: "90 s" }] });
                saveCustomDays([d("Legs", "Leg press"), d("Back", "Lat pulldown"), d("Arms", "Dumbbell curl")]);
                localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "custom", days: 3 }));
                const w = Math.max(1, weekOf(programStart("custom")));
                localStorage.setItem(`gu-progress-custom-3-w${w}`, JSON.stringify(["0-0", "2-0"]));
                return w;
            });
            await p.reload({ waitUntil: "load" });
            await p.waitForTimeout(300);
            await Promise.all([p.waitForNavigation(), p.evaluate(() => document.querySelector('[data-remove-day="1"]').click())]);
            await p.waitForTimeout(400);
            const gone = await p.evaluate((w) => ({ titles: customDaysRaw().map((d) => d.title).join(","), done: localStorage.getItem(`gu-progress-custom-2-w${w}`) }), wk);
            check(!asked && gone.titles === "Legs,Arms" && gone.done === '["0-0","1-0"]', `Remove day takes the day out without a confirm box and check-offs stay with their days (${gone.titles} ${gone.done})`);
            check(await p.locator("#toast:not([hidden]) [data-undo-day]").isVisible() && /Day 2 \(Back\)/.test(await p.locator("#toast").textContent()), "a Day removed message offers Undo");
            const h = await p.locator("[data-undo-day]").evaluate((b) => b.getBoundingClientRect().height);
            check(h >= 44, `the Undo button is big enough to tap (${h}px)`);
            await p.screenshot({ path: path.join(SHOTS, "undo-remove-day-phone.png") });
            await Promise.all([p.waitForNavigation(), p.locator("[data-undo-day]").click()]);
            await p.waitForTimeout(400);
            const back = await p.evaluate((w) => ({ titles: customDaysRaw().map((d) => d.title).join(","), done: localStorage.getItem(`gu-progress-custom-3-w${w}`), last: JSON.parse(localStorage.getItem("gu-last-plan")).days }), wk);
            check(back.titles === "Legs,Back,Arms" && back.done === '["0-0","2-0"]' && back.last === 3 && await p.locator("#program-custom-3, .day-card").count() > 0, `Undo puts the day and its check-offs back (${back.titles} ${back.done})`);
            await p.reload({ waitUntil: "load" });
            await p.waitForTimeout(300);
            check(await p.locator("#toast:not([hidden]) [data-undo-day]").count() === 0, "the Undo message shows only once");
            check(errs.length === 0, `no script errors while removing a day ${errs.join(" ")}`);
            await c.close();
        }
        // Share a workout: friend 1's day slots in as the day friend 2 is on (Day 3 here), weights not shared
        {
            const c1 = await browser.newContext({ viewport: { width: 390, height: 844 } });
            const p1 = await c1.newPage();
            await p1.route(/fonts\.|unsplash/, (r) => r.abort());
            await p1.goto(url("programs.html"), { waitUntil: "load" });
            const link = await p1.evaluate(() => {
                localStorage.setItem("gu-profile", JSON.stringify({ name: "Sam" }));
                saveCustomDays([{ title: "Push day", items: [{ n: "Bench press", d: "4 × 6–8 at 185 lb", rest: "2 min" }, { n: "Lateral raise", d: "3 × 12–15", rest: "60 s" }] }]);
                return shareLink([0]);
            });
            await c1.close();
            const c2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
            const p2 = await c2.newPage();
            const errs = [];
            p2.on("pageerror", (e) => errs.push(e.message));
            await p2.route(/fonts\.|unsplash/, (r) => r.abort());
            await p2.goto(url("programs.html"), { waitUntil: "load" });
            await p2.evaluate(() => {
                const d = (t, n) => ({ title: t, items: [{ n, d: "3 × 8–12", rest: "90 s" }] });
                saveCustomDays([d("Legs", "Leg press"), d("Back", "Lat pulldown"), d("Arms", "Dumbbell curl"), d("Core", "Plank")]);
                localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "custom", days: 4 }));
                localStorage.setItem(`gu-progress-custom-4-w${Math.max(1, weekOf(programStart("custom")))}`, JSON.stringify(["0-0", "1-0"]));
            });
            await p2.goto(url("programs.html") + link.slice(link.indexOf("#share=")), { waitUntil: "load" });
            await p2.waitForTimeout(500);
            check(/Sam sent you a workout/.test(await p2.locator("#share-get").textContent()) && /Make it my Day 3/.test(await p2.locator('#share-get [data-share-add="insert"]').textContent()), "a shared workout opens with who sent it and offers to be the day you're on");
            check(!/#share=/.test(await p2.evaluate(() => location.href)), "the shared code is taken out of the address bar");
            await Promise.all([p2.waitForNavigation(), p2.locator('#share-get [data-share-add="insert"]').click()]);
            await p2.waitForTimeout(400);
            const after = await p2.evaluate(() => ({ titles: customDaysRaw().map((d) => d.title), next: currentPlanInfo().title, dose: customDaysRaw()[2].items[0].d }));
            check(after.titles.join(",") === "Legs,Back,Push day,Arms,Core" && after.next === "Push day", `it becomes your Day 3 and the rest move down (${after.titles.join(", ")})`);
            check(after.dose === "4 × 6–8", `the sender's weights aren't shared (${after.dose})`);
            await p2.locator(".day-card.is-next [data-hits]").click();
            await p2.waitForTimeout(800);
            check(await p2.locator("#hits-dialog[open]").isVisible() && /Chest/.test(await p2.locator("#hits-dialog .hits-list").textContent()) && await p2.locator("#hits-dialog path.hit-1, #hits-dialog path.hit-2").count() > 0, "What this workout hits shows the body map and each muscle for today's day");
            await p2.locator("#hits-dialog [data-hits-close]").click();
            check(await p2.evaluate(() => { const g = document.getElementById("day-grid"); const next = g.querySelector(".day-card.is-next"); const done = [...g.querySelectorAll(".day-card.complete")]; return g.classList.contains("sort-done") && done.length === 2 && next && done.every((d) => d.getBoundingClientRect().top > next.getBoundingClientRect().top) && /Done this week \(2\)/.test(g.textContent); }), "finished days move below the day you're on, under Done this week");
            await p2.goto(url("programs.html") + "#share=notarealcode1234", { waitUntil: "load" });
            await p2.waitForTimeout(400);
            check(/didn't work/.test(await p2.locator("#share-get").textContent()), "a broken share link says so instead of adding anything");
            check(errs.length === 0, `no script errors while sharing ${errs.join(" ")}`);
            await c2.close();
            // In the app: paste the link under Workouts from friends and it becomes the active workout
            const c3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
            const p3 = await c3.newPage();
            p3.on("pageerror", (e) => errs.push(e.message));
            await p3.route(/fonts\.|unsplash/, (r) => r.abort());
            await p3.goto(url("programs.html"), { waitUntil: "load" });
            await p3.evaluate(() => localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "beginner", days: 3 })));
            await p3.reload({ waitUntil: "load" });
            check(await p3.locator(".share-inbox:not([open])").count() === 1, "Workouts from friends starts closed, as one line");
            await p3.locator(".share-inbox > summary").click();
            check(await p3.locator(".share-inbox [data-share-paste]").isVisible(), "tapping it shows Paste workout");
            await p3.evaluate(() => { document.querySelector(".share-inbox-more").open = true; });
            await p3.fill("#share-inbox-input", link);
            await Promise.all([p3.waitForNavigation(), p3.click("[data-share-paste-go]")]);
            await p3.waitForTimeout(600);
            const act = await p3.evaluate(() => ({ plan: JSON.parse(localStorage.getItem("gu-last-plan")).goal, next: currentPlanInfo().title, toast: (document.getElementById("toast") || {}).textContent || "" }));
            check(act.plan === "custom" && act.next === "Push day" && /Sam's Push day/.test(act.toast), `a pasted workout becomes your active workout (${act.plan}, ${act.next})`);
            check(errs.length === 0, `no script errors after pasting ${errs.join(" ")}`);
            await c3.close();

        }

        // How-tos and the muscle map get more in-depth as the level goes up
        {
            const { page, errors } = await openPage(browser, "exercises.html", viewport);
            await page.evaluate(() => localStorage.setItem("gu-level", JSON.stringify("Beginner")));
            await page.reload({ waitUntil: "load" });
            await page.locator(".library-card [data-howto]").first().click();
            const body = () => page.locator("#howto-body").textContent();
            const beginner = await body();
            check(!/Avoid these/.test(beginner) && !/Programming notes/.test(beginner), "a beginner how-to keeps to the basics");
            check(await page.locator("[data-level-bar]").count() === 0, "the exercise library has no level pickers");
            const at = async (lvl) => { await page.keyboard.press("Escape"); await page.evaluate((l) => localStorage.setItem("gu-level", JSON.stringify(l)), lvl); await page.reload({ waitUntil: "load" }); await page.locator(".library-card [data-howto]").first().click(); return body(); };
            let b = await at("Intermediate");
            check(/Avoid these/.test(b) && !/Form cues/.test(b), "Intermediate adds common mistakes");
            b = await at("Advanced");
            check(/Form cues/.test(b) && !/Programming notes/.test(b), "Advanced adds form cues");
            b = await at("Expert");
            check(/Programming notes/.test(b) && /Strength|Easy days|Sets:/.test(b), "Expert adds programming notes");
            await page.keyboard.press("Escape");
            await page.evaluate(() => localStorage.setItem("gu-level", JSON.stringify("Beginner")));
            await page.reload({ waitUntil: "load" });
            await page.click('[data-mm-pick="quads"]');
            check(await page.locator("#mm-panel .mm-part").count() === 3 && !/Switch to Intermediate/.test(await page.locator("#mm-panel").textContent()), "everyone can see each part of a muscle, with no level switch");
            // Add to my workout from the muscle map and the library
            await page.evaluate(() => ["gu-custom", "gu-last-plan"].forEach((k) => localStorage.removeItem(k)));
            await page.locator("#mm-panel [data-add-ex]").first().click();
            check(await page.locator("#add-dialog").isVisible() && /start your own workout/i.test(await page.locator("#add-dialog").textContent()), "with no workout yet, + offers to start one");
            await page.click("#add-dialog [data-add-confirm]");
            const mine = await page.evaluate(() => store.get("gu-custom"));
            check(mine && mine.days.length === 1 && mine.days[0].items.length === 1 && /×/.test(mine.days[0].items[0].d) && (await page.evaluate(() => store.get("gu-last-plan").goal)) === "custom", "adding from the muscle map starts My workout with sets and reps");
            check(/Added to Day 1/.test(await page.locator("#toast").textContent()) && await page.locator("#toast .toast-link").count() === 1, "a note confirms it and links to the workout");
            await page.fill("#library-search", "lateral raise");
            await page.locator('.library-card [data-add-ex="Lateral raise"]').click();
            check(/workout for this week/.test(await page.locator("#add-dialog").textContent()) && await page.locator('#add-dialog input[name="add-day"]').count() === 2, "next time it asks which day, or a new day");
            await page.locator('#add-dialog input[name="add-day"][value="new"]').check();
            await page.click("#add-dialog [data-add-confirm]");
            check(await page.evaluate(() => store.get("gu-custom").days.length === 2 && store.get("gu-last-plan").days === 2), "a new day can be started from the library");
            await page.locator('.library-card [data-howto="Lateral raise"]').click();
            await page.click("#howto-add");
            check(!(await page.locator("#howto").isVisible()) && await page.locator("#add-dialog").isVisible(), "how-tos have an Add to my workout button");
            await page.locator('#add-dialog input[name="add-day"][value="1"]').check();
            check(/already on this day/.test(await page.locator("#add-dialog .add-note").textContent()), "it says when the day already has that exercise");
            await page.click("#add-dialog [data-add-cancel]");
            await page.evaluate(() => ["gu-custom", "gu-last-plan"].forEach((k) => localStorage.removeItem(k)));
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.evaluate(() => localStorage.removeItem("gu-level"));
            await page.close();
        }

        // Muscle map: every head of every muscle is on the body, lights up, and has real exercises
        {
            const { page, errors } = await openPage(browser, "exercises.html", viewport, "#muscle-map");
            await page.evaluate(() => localStorage.setItem("gu-level", JSON.stringify("Advanced")));
            await page.reload({ waitUntil: "load" });
            const stage = page.locator(".mm-stage");
            const data = await page.evaluate(() => MUSCLE_MAP.flatMap((g) => g.parts.map((p) => ({ id: p.id, missing: p.ex.filter((n) => !EXERCISES[n]),
                male: muscleViews(p.id, "male").length, female: muscleViews(p.id, "female").length }))));
            const bad = data.filter((p) => p.missing.length || !p.male || !p.female);
            check(data.length >= 30 && bad.length === 0, `all ${data.length} heads and parts are on both bodies with real exercises ${JSON.stringify(bad)}`);
            // Each multi-head muscle shows its heads separately
            const heads = await page.evaluate(() => ["chest-upper", "chest-middle", "chest-lower", "delt-front", "delt-side", "quad-outer", "quad-middle", "quad-inner", "biceps-long", "biceps-short"]
                .map((id) => [id, document.querySelectorAll(`.mm-face[data-face="front"] path[data-parts~="${id}"]`).length]));
            check(heads.every(([, n]) => n >= 2), `front view has separate shapes for each head ${JSON.stringify(heads.filter(([, n]) => n < 2))}`);
            await page.locator('.mm-face.is-active [data-m="quad-outer"] path').first().hover();
            check(await page.locator('.mm-face.is-active path.is-on[data-parts~="quad-outer"]').count() >= 2 && await page.locator('.mm-face.is-active path.is-on[data-parts~="quad-middle"]').count() === 0, "pointing at one head lights only that head");
            await page.locator('.mm-face.is-active [data-m="quad-outer"] path').first().click();
            check(/Outer quad/.test(await page.locator(".mm-title").textContent()) && await page.locator("#mm-panel .mm-part").count() === 3, "tapping a head names it and lists all three quad heads");
            await page.click('#mm-panel [data-mm-part="quad-inner"]');
            check(await page.locator('#mm-panel .mm-part.is-on[data-part="quad-inner"]').count() === 1 && await page.locator('.mm-face.is-active path.is-on[data-parts~="quad-inner"]').count() >= 2, "picking a head in the panel lights it on the body");
            await stage.scrollIntoViewIfNeeded();
            const box = await stage.boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + 30);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2 + 150, box.y + 30, { steps: 10 });
            const mid = Number(await stage.getAttribute("data-angle"));
            await page.mouse.up();
            await page.waitForTimeout(100);
            check(mid > 60 && Math.abs(Number(await stage.getAttribute("data-angle"))) === 180, `dragging spins the body around to the back (${mid})`);
            await page.click('[data-mm-pick="triceps"]');
            check(await page.locator('.mm-face.is-active').getAttribute("data-face") === "back" && await page.locator("#mm-panel .mm-part").count() === 3, "triceps shows the back and its three heads");
            for (const id of ["triceps-long", "triceps-lateral", "triceps-medial"]) {
                await page.click(`#mm-panel [data-mm-part="${id}"]`);
                check(await page.locator(`.mm-face.is-active path.is-on[data-parts~="${id}"]`).count() >= 2, `${id} lights up on the back view`);
            }
            await page.click('[data-mm-sex="female"]');
            check(await page.locator('[data-mm-sex="female"][aria-pressed="true"]').count() === 1 && await page.locator('.mm-face.is-active path[data-parts~="hams-outer"]').count() >= 2, "the female body has the heads too");
            await page.click('[data-mm-sex="male"]');
            await page.click('[data-mm-view="front"]');
            await page.locator('.mm-face.is-active [data-m="abs-upper"]').focus();
            check(/Upper abs/.test(await page.locator(".mm-title").textContent()), "muscles work with the keyboard");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // The menu's "Paste a friend's workout" opens Workouts from friends
        {
            const { page, errors } = await openPage(browser, "programs.html", viewport, "#friends");
            await page.waitForTimeout(500);
            const fr = await page.evaluate(() => { const s = document.querySelector(".share-inbox"); const r = s.getBoundingClientRect(); return s.open && r.top >= 0 && r.top < innerHeight; });
            check(fr && await page.locator(".share-inbox [data-share-paste]").isVisible(), "programs.html#friends jumps to Workouts from friends, open, with Paste workout");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Your plan: remove an exercise from a day; the map shows what the day still hits, with Undo
        {
            const { page, errors } = await openPage(browser, "programs.html", viewport);
            await page.evaluate(() => { saveCustomDays([{ title: "Push", items: [{ n: "Bench press", d: "3 × 5", rest: "2 min" }, { n: "Overhead press", d: "3 × 8", rest: "2 min" }, { n: "Rope pushdown", d: "2 × 10", rest: "90 s" }, { n: "Skull crusher", d: "2 × 10", rest: "90 s" }] }]); localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "custom", days: 1 })); });
            await page.goto(page.url().replace(/programs\.html.*$/, "programs.html?today=1#program-custom-1"), { waitUntil: "load" });
            await page.waitForTimeout(400);
            // A day out of order offers the fix; once fixed (or already sorted) it says so
            await page.evaluate(() => { saveCustomDays([{ title: "Mixed", items: [{ n: "Triceps pushdown", d: "2 × 10", rest: "90 s" }, { n: "Lateral raise", d: "2 × 12", rest: "60 s" }, { n: "Bench press", d: "3 × 5", rest: "2 min" }] }]); });
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(300);
            const fixShown = await page.locator('.day-card[data-day="0"] [data-fix-order]').count() === 1 && await page.locator('.day-card[data-day="0"] .day-order-ok').count() === 0;
            await page.evaluate(() => document.querySelector('.day-card[data-day="0"] [data-fix-order]').click());
            await page.waitForTimeout(300);
            const fixed = await page.evaluate(() => customDaysRaw()[0].items[0].n === "Bench press" && !!document.querySelector('.day-card[data-day="0"] .day-order-ok'));
            check(fixShown && fixed, "an out-of-order day offers the best order, and then says it's in the best order");
            await page.evaluate(() => { saveCustomDays([{ title: "Push", items: [{ n: "Bench press", d: "3 × 5", rest: "2 min" }, { n: "Overhead press", d: "3 × 8", rest: "2 min" }, { n: "Rope pushdown", d: "2 × 10", rest: "90 s" }, { n: "Skull crusher", d: "2 × 10", rest: "90 s" }] }]); });
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.evaluate(() => document.querySelector('[data-remove-ex="0-3"]').click());
            await page.waitForTimeout(300);
            const r1 = await page.evaluate(() => ({ items: customDaysRaw()[0].items.map((i) => i.n).join(","), note: document.querySelector(".hits-removed").textContent, open: document.getElementById("hits-dialog").open, rows: document.querySelectorAll(".day-card .ex-row").length }));
            check(r1.items === "Bench press,Overhead press,Rope pushdown" && r1.open && /long head/.test(r1.note) && r1.rows === 3, "removing an exercise from your plan updates the day and shows what it still hits");
            await page.evaluate(() => document.querySelector("[data-hits-undo]").click());
            await page.waitForTimeout(200);
            check((await page.evaluate(() => customDaysRaw()[0].items.map((i) => i.n).join(","))) === "Bench press,Overhead press,Rope pushdown,Skull crusher", "Undo puts it back in the same spot");
            await page.evaluate(() => document.querySelector('[data-remove-ex="0-3"]').click());
            await page.evaluate(() => document.querySelector("[data-hits-close]").click());
            await page.evaluate(() => document.querySelector('[data-remove-ex="0-2"]').click());
            await page.waitForTimeout(200);
            check(/Triceps doesn't get direct work/.test(await page.locator(".hits-removed").textContent()), "and it says when a muscle loses its last direct exercise");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Installed app: pull down at the top to refresh (a short pull does nothing)
        {
            const { page, errors } = await openPage(browser, "me.html", viewport);
            const pull = (to) => page.evaluate((to) => {
                document.documentElement.classList.add("is-app");
                window.scrollTo(0, 0);
                const el = document.querySelector("main"), at = (y) => [new Touch({ identifier: 1, target: el, clientX: 150, clientY: y })];
                el.dispatchEvent(new TouchEvent("touchstart", { touches: at(150), bubbles: true }));
                for (let y = 150; y <= to; y += 15) el.dispatchEvent(new TouchEvent("touchmove", { touches: at(y), bubbles: true }));
                const shown = document.querySelector(".ptr-text").textContent;
                window.__stay = 1;
                el.dispatchEvent(new TouchEvent("touchend", { touches: [], bubbles: true }));
                return shown;
            }, to);
            const short = await pull(200);
            await page.waitForTimeout(400);
            check(short === "Pull to refresh" && await page.evaluate(() => window.__stay === 1), "a short pull in the app doesn't refresh");
            const [ , long] = await Promise.all([page.waitForNavigation({ timeout: 5000 }).catch(() => null), pull(400)]);
            check(long === "Let go to refresh" && await page.evaluate(() => window.__stay === undefined), "pulling down at the top of the app refreshes the page");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Security: booby-trapped saved data (or a synced account) can't run code on any page
        {
            const BAD = `<img src=x onerror="window.__pwned=1">`;
            const { page } = await openPage(browser, "me.html", viewport);
            await page.evaluate((bad) => {
                const today = new Date().toISOString().slice(0, 10);
                localStorage.setItem("gu-log", JSON.stringify({ [bad]: [{ date: today, unit: "lb", sets: [{ w: 100, r: 5 }] }] }));
                localStorage.setItem("gu-cardio", JSON.stringify([{ date: today, activity: bad, minutes: 30, effort: bad }]));
                localStorage.setItem("gu-prs", JSON.stringify([{ date: today, name: bad, kind: "max", value: 120 }]));
                localStorage.setItem("gu-profile", JSON.stringify({ experience: bad, unit: bad, focus: bad, bodyweight: bad }));
                localStorage.setItem("gu-weights", JSON.stringify([{ date: today, w: bad, unit: bad }]));
            }, BAD);
            const pwned = [];
            for (const file of ["me.html", "programs.html", "tools.html", "index.html"]) {
                await page.goto(url(file), { waitUntil: "load" });
                await page.waitForTimeout(300);
                if (await page.evaluate(() => window.__pwned === 1 || document.querySelectorAll("img[src='x']").length > 0)) pwned.push(file);
            }
            await page.goto(url("index.html") + "#<img src=x onerror=window.__pwned=1>", { waitUntil: "load" });
            await page.waitForTimeout(200);
            if (await page.evaluate(() => window.__pwned === 1)) pwned.push("index.html#hash");
            check(pwned.length === 0, `saved data and links can't inject code ${pwned.join(", ")}`);
            await page.evaluate(() => localStorage.clear());
            await page.close();
        }

        // My progress: pulls in logged lifts and cardio, and switches between strength and endurance
        {
            const { page, errors } = await openPage(browser, "me.html", viewport);
            // Accounts stay off (and load nothing from Google) until the owner adds a Firebase config
            check(/saved on this device only/.test(await page.locator("#account-card").textContent()), "without a Firebase config, the account card explains data stays on this device");
            check(await page.evaluate(() => typeof firebase === "undefined" && ![...document.scripts].some((s) => /gstatic/.test(s.src))), "Firebase isn't loaded until it's configured");
            const merged = await page.evaluate(() => JSON.parse(mergeData(
                { "gu-log": JSON.stringify({ Squat: [{ date: "2026-10-02", unit: "lb", sets: [] }] }) },
                { "gu-log": JSON.stringify({ Squat: [{ date: "2026-10-01", unit: "lb", sets: [] }], Bench: [] }), "gu-unit": "\"kg\"" })["gu-log"]));
            check(merged.Squat.length === 2 && "Bench" in merged, "signing in on a new device merges logs instead of overwriting them");
            await page.evaluate(() => {
                const d = (k) => { const x = new Date(); x.setDate(x.getDate() - k); return x.toISOString().slice(0, 10); };
                localStorage.setItem("gu-log", JSON.stringify({ "Bench press": [
                    { date: d(21), unit: "lb", sets: [{ w: 135, r: 6 }, { w: 135, r: 6 }, { w: 135, r: 5 }] },
                    { date: d(14), unit: "lb", sets: [{ w: 135, r: 7 }, { w: 135, r: 6 }, { w: 135, r: 6 }] },
                    { date: d(0), unit: "lb", sets: [{ w: 140, r: 6 }, { w: 140, r: 6 }, { w: 140, r: 5 }] }] }));
                localStorage.setItem("gu-cardio", JSON.stringify([{ date: d(0), activity: "Easy jog", minutes: 25, distance: 2.5, dunit: "mi", effort: 5 }, { date: d(7), activity: "Easy jog", minutes: 25, distance: 2.4, dunit: "mi", effort: 5 }]));
                // Finished workouts on those days (the Log tab shows finished workouts only)
                localStorage.setItem("gu-sessions", JSON.stringify([21, 14, 0].map((k) => ({ date: d(k), plan: "beginner", days: 3, day: 0, title: "Full body A", names: ["Bench press"], exercises: 1, sets: 3, reps: 18, volume: 0, unit: "lb" }))));
            });
            await page.reload();
            await page.waitForTimeout(300);
            // Four short tabs instead of one long page
            check(await page.locator(".me-tab").count() === 6 && await page.locator("#me-dash").isVisible() && await page.locator("#lifts").isHidden() && await page.locator("#reset-progress").isHidden(), "My progress opens on Overview, with Active, Lifts, Log, Cardio, and You as tabs");
            await page.click('[data-me-go="active"]');
            check(await page.locator("#active").isVisible() && /No active workout|Day 1/.test(await page.locator("#active-workout").textContent()), "the Active tab shows only the workout you're on");
            // Log tab: every set, newest first, filter by exercise, remove with undo
            await page.click('[data-me-go="log"]');
            check(await page.locator("#log").isVisible() && await page.locator("#log-days .log-day").count() === 3 && /140 lb × 6/.test(await page.locator("#log-days .log-day").first().textContent()), "the Log tab lists every logged set by day, newest first");
            check(await page.locator("#log-days .log-week").count() === 3 && await page.locator("#log-days .log-week").first().evaluate((d) => d.open) && /This week/.test(await page.locator("#log-days .log-week summary").first().textContent()) && /1 day · 3 sets · 17 reps/.test(await page.locator("#log-days .log-week summary").first().textContent()), "the log is grouped by week, with days, sets and reps for each");
            const olderWeek = page.locator("#log-days .log-week").nth(1);
            check(!(await olderWeek.evaluate((d) => d.open)), "older weeks start closed");
            await olderWeek.locator("summary").first().click();
            await olderWeek.locator(".log-day > summary").first().click();
            check(await olderWeek.locator(".log-sets").first().isVisible(), "tapping a week, then a day, shows its sets");
            check(/53/.test(await page.locator("#log-totals").textContent()) && /reps/.test(await page.locator("#log-totals").textContent()), "the Log tab totals your reps");
            await page.locator('#log-days [data-log-remove]').first().click();
            check(await page.locator("#log-days .log-day").count() === 2 && await page.evaluate(() => logFor("Bench press").length === 2), "a mistaken entry can be removed from the log");
            await page.click("#log-undo");
            check(await page.locator("#log-days .log-day").count() === 3 && await page.evaluate(() => logFor("Bench press").length === 3), "Undo puts it back");
            await page.click('[data-me-go="lifts"]');
            check(!(await page.evaluate(() => document.documentElement.classList.contains("app-splash"))), "the loading screen only shows in the installed app, not the website");
            await page.click('[data-me-go="lifts"]');
            check(await page.locator("#lifts").isVisible() && await page.locator("#me-dash").isHidden() && (await page.locator('.me-tab[aria-selected="true"]').textContent()) === "Lifts", "tapping a tab shows just that part");
            check(/max/.test(await page.locator("#lift-table tbody").textContent()), "progress page lists logged lifts with projections");
            check(await page.locator("#lift-chart .chart-proj").count() === 1, "lift chart shows a projection");
            await page.locator('input[name="trainfor"][value="endurance"]').check({ force: true });
            check(/reps @ 140/.test(await page.locator("#lift-table tbody").textContent()), "endurance view shows reps at your working weight");
            check(/25/.test(await page.locator("#me-stats").textContent()), "this week's cardio minutes are counted");
            await page.click('[data-me-go="cardio"]');
            check(await page.locator("#cardio-chart rect").count() >= 8, "cardio chart shows weekly bars and projection");
            check(/Pace/.test(await page.locator("#pace-panel").textContent()), "pace trend appears for runs with distance");
            await page.fill('#quick-cardio input[name="minutes"]', "20");
            await page.locator("#quick-cardio button[type=submit]").click();
            check(/45/.test(await page.locator("#me-stats").textContent()), "logging cardio here updates the week");
            check(await page.locator(".milestone-grid li.is-done").count() >= 1, "milestones show what's been earned");
            // A personal record pops a celebration
            await page.evaluate(() => saveSession("Bench press", new Date().toISOString().slice(0, 10), "lb", [{ w: 160, r: 6 }]));
            check(/personal record/i.test(await page.locator("#toast").textContent()) && await page.locator("#toast").isVisible(), "beating a best shows a personal-record celebration");
            check(/Bench press/.test(await page.locator("#recent-prs").textContent()), "personal records are listed");
            // Clear my progress: pick, confirm, cleared, and Undo brings it back
            await page.click('[data-me-go="you"]');
            await page.evaluate(() => { store.set("gu-level", "Advanced"); window.dispatchEvent(new CustomEvent("logchange")); });
            check(await page.locator('#reset-list input[value="lifts"]').isChecked() && !(await page.locator('#reset-list input[value="settings"]').isChecked()), "Clear my progress picks logs by default, not settings");
            await page.click("#reset-go");
            check(await page.locator("#reset-confirm").isVisible() && await page.evaluate(() => Object.keys(getLog()).length > 0), "clearing asks to confirm first and nothing is deleted yet");
            await page.click("#reset-yes");
            check(await page.evaluate(() => Object.keys(getLog()).length === 0 && getPRs().length === 0 && store.get("gu-level") === "Advanced"), "confirming clears the log and records but keeps settings");
            check(/Bench press/.test(await page.locator("#recent-prs").textContent()) === false, "the page updates right away after clearing");
            await page.click("#reset-undo");
            check(await page.evaluate(() => Object.keys(getLog()).length > 0 && getPRs().length > 0), "Undo brings the cleared progress back");
            await page.goto(url("programs.html"), { waitUntil: "load" });
            await page.goto(url("me.html", "#cardio"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#cardio").isVisible() && (await page.locator('.me-tab[aria-selected="true"]').textContent()) === "Cardio", "a link to me.html#cardio opens the Cardio tab");
            await page.evaluate(() => store.remove("gu-level"));
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // My progress counts the same way everywhere: finished workouts only, and matching best-lift numbers
        {
            const { page, errors } = await openPage(browser, "me.html", viewport);
            await page.evaluate(() => {
                localStorage.clear();
                const d = (k) => { const x = new Date(); x.setDate(x.getDate() - k); return x.toISOString().slice(0, 10); };
                localStorage.setItem("gu-log", JSON.stringify({
                    "Bench press": [{ date: d(7), unit: "lb", sets: [{ w: 135, r: 6 }, { w: 135, r: 6 }] }, { date: d(0), unit: "lb", sets: [{ w: 145, r: 6 }, { w: 145, r: 6 }, { w: 145, r: 5 }] }],
                    // Logged today but never finished: it shouldn't count anywhere yet
                    Squat: [{ date: d(0), unit: "lb", sets: [{ w: 200, r: 5 }, { w: 200, r: 5 }] }]
                }));
                localStorage.setItem("gu-sessions", JSON.stringify([7, 0].map((k) => ({ date: d(k), plan: "beginner", days: 3, day: 0, title: "Full body A", names: ["Bench press"], exercises: 1, sets: 3, reps: 17, volume: 0, unit: "lb" }))));
            });
            await page.reload();
            await page.waitForTimeout(300);
            const stats = await page.locator("#me-stats").textContent();
            const hello = await page.locator("#me-dash .dash-hello h2").textContent();
            check(/Workout days\s*1/.test(stats) && /Sets logged\s*3/.test(stats) && /^1 workout day this week/.test(hello), `the dashboard and this week's stats count the same finished workouts (${hello.trim().slice(0, 30)} | ${stats.replace(/\s+/g, " ").slice(0, 40)})`);
            check(await page.evaluate(() => milestones().find((m) => m.name === "100 sets").detail === "5 of 100 sets"), "milestones count sets from finished workouts only");
            const best = await page.locator("#me-dash .dash-best li").first().textContent();
            check(/Bench press/.test(best) && /145 lb × 6/.test(best) && /\+10 lb/.test(best) && await page.locator("#me-dash .dash-best li").count() === 1, `Beginner best lifts show the heaviest set lifted, skip unfinished workouts, and show the gain with its unit (${best.trim()})`);
            check(/heaviest set/.test(await page.locator("#me-dash .dash-fine").textContent()), "Beginner best lifts explain they're the heaviest set logged");
            await page.evaluate(() => setLevel("Intermediate"));
            await page.waitForTimeout(150);
            const bestInt = await page.locator("#me-dash .dash-best li").first().textContent();
            check(/175 lb/.test(bestInt) && !/×/.test(bestInt) && /\+12\.5 lb/.test(bestInt), `Intermediate best lifts show the estimated max (${bestInt.trim()})`);
            // Estimated max only for the big lifts: a curl keeps its heaviest set at Intermediate
            await page.evaluate(() => {
                const log = JSON.parse(localStorage.getItem("gu-log"));
                const d = (k) => { const x = new Date(); x.setDate(x.getDate() - k); return x.toISOString().slice(0, 10); };
                log["Dumbbell curl"] = [{ date: d(7), unit: "lb", sets: [{ w: 20, r: 12 }] }, { date: d(0), unit: "lb", sets: [{ w: 25, r: 10 }, { w: 25, r: 8 }] }];
                localStorage.setItem("gu-log", JSON.stringify(log));
                const ses = JSON.parse(localStorage.getItem("gu-sessions"));
                ses.forEach((x) => x.names.push("Dumbbell curl"));
                localStorage.setItem("gu-sessions", JSON.stringify(ses));
                window.dispatchEvent(new Event("logchange"));
            });
            await page.waitForTimeout(150);
            const bestRows = await page.locator("#me-dash .dash-best li").allTextContents();
            const curlRow = bestRows.find((t) => /Dumbbell curl/.test(t)) || "";
            const benchRow = bestRows.find((t) => /Bench press/.test(t)) || "";
            check(/25 lb × 10/.test(curlRow) && /\+5 lb/.test(curlRow) && /175 lb/.test(benchRow) && !/×/.test(benchRow), `Intermediate best lifts: estimated max for big lifts, heaviest set for small ones (${bestRows.map((t) => t.trim()).join(" | ")})`);
            check(/Big lifts show an estimated one-rep max/.test(await page.locator("#me-dash .dash-fine").textContent()), "the best lifts note explains the mix of maxes and heaviest sets");
            await page.evaluate(() => {
                const log = JSON.parse(localStorage.getItem("gu-log"));
                delete log["Dumbbell curl"];
                localStorage.setItem("gu-log", JSON.stringify(log));
                window.dispatchEvent(new Event("logchange"));
            });
            await page.click('[data-me-go="lifts"]');
            const lifts = await page.locator("#lift-table tbody").textContent();
            check(/Bench press/.test(lifts) && !/Squat/.test(lifts) && /175 lb max/.test(lifts), `the Lifts tab lists finished workouts and its number matches the dashboard (${lifts.replace(/\s+/g, " ").slice(0, 80)})`);
            // "Now" is the best recent session: a light week doesn't drop it or the projection
            const lightWeek = await page.evaluate(() => {
                const d = (k) => { const x = new Date(); x.setDate(x.getDate() - k); return x.toISOString().slice(0, 10); };
                const heavy = [{ date: d(14), unit: "lb", sets: [{ w: 150, r: 5 }] }, { date: d(7), unit: "lb", sets: [{ w: 160, r: 5 }] }];
                const p1 = projectLift("x", "lb", "new", 8, heavy);
                const p2 = projectLift("x", "lb", "new", 8, heavy.concat({ date: d(0), unit: "lb", sets: [{ w: 135, r: 5 }] }));
                const old = projectLift("x", "lb", "new", 8, [{ date: d(40), unit: "lb", sets: [{ w: 200, r: 5 }] }, { date: d(0), unit: "lb", sets: [{ w: 135, r: 5 }] }]);
                return { same: Math.abs(p1.now - p2.now) < 0.01 && p2.bestIndex === 1, later: p2.projection[7].value >= p1.now - 0.01, old: old.bestIndex === 1 };
            });
            check(lightWeek.same && lightWeek.later && lightWeek.old, `Lifts "Now" uses the best session of the last 3 weeks, not a lighter last one (${JSON.stringify(lightWeek)})`);
            await page.evaluate(() => {
                const pr = JSON.parse(localStorage.getItem("gu-profile") || "{}");
                delete pr.trainFor; pr.goal = "strength";
                localStorage.setItem("gu-profile", JSON.stringify(pr));
                window.dispatchEvent(new Event("profilechange"));
            });
            await page.waitForTimeout(100);
            const startOn = await page.evaluate(() => [trainForStart(undefined, "fatloss"), trainForStart(undefined, ""), trainForStart("both", "strength")].join());
            check(await page.locator('input[name="trainfor"][value="strength"]').isChecked() && startOn === "endurance,both,both", `"What are you training for?" starts on your goal until you pick one (${startOn})`);
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.evaluate(() => localStorage.clear());
            await page.close();
        }

        // Things testers hit mid-workout (phone walkthroughs): landing spot, logging, timer, finish, numbers
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            await page.evaluate(() => { localStorage.clear(); localStorage.setItem("gu-profile", JSON.stringify({ bodyweight: 150, sex: "female", unit: "lb" })); });
            await page.goto(url("programs.html", "?today=1#program-beginner-3"), { waitUntil: "load" });
            await page.waitForTimeout(500);
            const dayBox = await page.locator(".day-card").first().boundingBox();
            check(dayBox && dayBox.y > -60 && dayBox.y < viewport.height * 0.5, `Start lands on today's workout, not the plan settings (${dayBox && Math.round(dayBox.y)})`);
            const row = page.locator(".day-card[data-day='0'] .ex-row", { hasText: "in each hand" }).first();
            check(await row.count() === 1, "the beginner plan suggests a per-hand dumbbell weight");
            if (await row.count()) {
                await row.locator("[data-log]").click();
                const form = row.locator(".log-form");
                const w0 = form.locator('input[name="w"]').first();
                check(Number(await w0.inputValue()) > 0 && /each/.test(await form.locator(".log-unit").first().textContent()) && (await form.locator('input[name="r"]').first().inputValue()) === "" && Number(await form.locator('input[name="r"]').first().getAttribute("placeholder")) > 0, "dumbbell log forms start with the per-hand weight, and today's reps as a hint (not filled in)");
                await w0.click();
                await w0.fill("");
                await w0.type("20");
                check((await form.locator('input[name="w"]').nth(1).inputValue()) === "20", "changing set 1's weight fills the other sets");
                // Close the keypad first (while typing on a phone, the timer steps aside)
                await page.evaluate(() => document.activeElement && document.activeElement.blur());
                await page.waitForTimeout(250);
                await form.locator("[data-set-done]").first().click();
                await page.waitForTimeout(200);
                check(Number(await form.locator('input[name="r"]').first().inputValue()) > 0 && (await form.locator('input[name="r"]').nth(1).inputValue()) === "" && await page.locator("#rest-timer").isVisible(), "ticking a set fills its reps, leaves the others empty, and starts the rest timer");
                // Ticking another set while resting keeps the same rest going; the timer is small with a More button
                const endBefore = await page.evaluate(() => (store.get("gu-rest") || {}).endAt);
                await page.waitForTimeout(1100);
                await form.locator("[data-set-done]").nth(1).click();
                await page.waitForTimeout(200);
                const endAfter = await page.evaluate(() => (store.get("gu-rest") || {}).endAt);
                check(endBefore && endBefore === endAfter, "ticking another set while resting doesn't restart the timer");
                const mini = await page.evaluate(() => { const b = document.getElementById("rest-timer"); const small = b.classList.contains("is-mini") && b.getBoundingClientRect().height; document.getElementById("rest-size").click(); const big = b.getBoundingClientRect().height; document.getElementById("rest-size").click(); return { small, big }; });
                if (viewport.width <= 760) {
                    await form.locator('input[name="w"]').nth(2).focus();
                    await page.waitForTimeout(100);
                    const hid = await page.evaluate(() => getComputedStyle(document.getElementById("rest-timer")).display === "none" && getComputedStyle(document.querySelector(".tabbar")).display === "none");
                    await page.evaluate(() => document.activeElement.blur());
                    await page.waitForTimeout(300);
                    const back = await page.locator("#rest-timer").isVisible();
                    check(hid && back, "while typing a set on a phone, the timer and tab bar get out of the way, and come back after");
                }
                check(mini.small > 0 && mini.small < mini.big && mini.small <= 90, `the rest timer is small, with More to see everything (${Math.round(mini.small)}px vs ${Math.round(mini.big)}px)`);
                await page.click("#rest-stop");
                const formId = await form.getAttribute("id");
                await page.reload({ waitUntil: "load" });
                await page.waitForTimeout(400);
                check(await page.locator(`#${formId}`).isVisible() && (await page.locator(`#${formId} input[name="w"]`).first().inputValue()) === "20", "half-typed sets come back after a reload");
                // Rest timer leaves room for the set boxes
                await page.locator(".day-card[data-day='0'] .rest-btn").first().click();
                await page.waitForTimeout(200);
                const pad = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector("main")).paddingBottom));
                const timerH = await page.evaluate(() => document.getElementById("rest-timer").getBoundingClientRect().height);
                check(await page.evaluate(() => document.body.classList.contains("rest-on")) && pad >= 40 && pad >= timerH - 1, `the rest timer makes room so it doesn't cover the set boxes (${pad}px)`);
                await page.click("#rest-stop");
                // A weighted lift saved with no weight asks first
                const f2 = page.locator(`#${formId}`);
                for (const inp of await f2.locator('input[name="w"]').all()) await inp.fill("0");
                await f2.locator('input[name="r"]').first().fill("10");
                await f2.locator("button[type=submit]").click();
                check(/No weight entered/.test(await f2.locator(".log-status").textContent()) && await page.evaluate(() => Object.keys(getLog()).length === 0), "saving a dumbbell lift with no weight asks first");
                await f2.locator('input[name="w"]').first().fill("20");
                await f2.locator("button[type=submit]").click();
                await page.waitForTimeout(200);
                check(await page.evaluate(() => Object.values(getLog()).some((en) => en[0].sets[0].w === 20)), "the per-hand weight is saved");
                await page.click("[data-finish='0']");
                await page.waitForTimeout(300);
                check(/^1 exercise$/.test((await page.locator("#finish-dialog .finish-stats li").first().textContent()).trim()), "Finish counts only the exercises you did");
                check(await page.locator("#finish-dialog [data-finish-close].btn-primary").count() === 1 && /rest day/.test(await page.locator("#finish-dialog").textContent()), "on a ready-made plan, Done for today is the main button and it suggests a rest day");
                await page.click("[data-finish-close]");
            }
            // The at-home switch doesn't make the page scroll sideways
            await page.goto(url("programs.html", "#program-home"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "home plans don't scroll sideways");
            // A stand-in exercise gets its own sets and reps; swaps can't undo an edit to My workout
            check(await page.evaluate(() => /s$/.test(dayLineup("beginner", 3, 0, [{ n: "Dead bug", d: "3 × 8 per side", rest: "45 s" }], 1, { "w1:0-0": "Plank" })[0].d)), "a plank swapped in for a dead bug is timed, not 8 per side");
            check(await page.evaluate(() => { store.set("gu-swaps-custom-2", { "w1:0-1": "Push-up", "w1:1-0": "Pull-up" }); clearCustomSwaps(0); const sw = store.get("gu-swaps-custom-2"); return !sw["w1:0-1"] && sw["w1:1-0"] === "Pull-up"; }), "editing a day clears its swaps (and only its swaps)");
            // Bodyweight moves don't show NaN on My progress
            await page.evaluate(() => { const d = new Date().toISOString().slice(0, 10); localStorage.setItem("gu-log", JSON.stringify({ "Glute bridge": [{ date: d, unit: "lb", sets: [{ w: 0, r: 15 }] }] })); localStorage.setItem("gu-sessions", JSON.stringify([{ date: d, plan: "home", days: 3, day: 0, title: "Day 1", names: ["Glute bridge"], exercises: 1, sets: 1, reps: 15, volume: 0, unit: "lb" }])); });
            await page.goto(url("me.html", "#lifts"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(!/NaN/.test(await page.locator("#lifts").textContent()) && /15 reps/.test(await page.locator("#lift-table").textContent()), "bodyweight moves show reps, not NaN, on My progress");
            // Search puts names that start with your word first
            await page.goto(url("exercises.html"), { waitUntil: "load" });
            await page.fill("#library-search", "bench");
            check(/^Bench/.test(await page.locator(".library-card h3").first().textContent()), "searching bench lists bench exercises first");
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Tailor it to you: goal, time, known lifts, and moves to skip change the plans
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            await page.evaluate(() => { localStorage.clear(); setLevel("Intermediate"); });
            await page.reload({ waitUntil: "load" });
            const form = page.locator("#setup .setup-form");
            await form.locator(".setup-more > summary").click();
            await form.locator('input[name="bodyweight"]').fill("180");
            await form.locator('select[name="sex"]').selectOption("male");
            await form.locator('input[name="goal"][value="strength"]').check({ force: true });
            await form.locator('input[name="place"][value="gym"]').check({ force: true });
            await form.locator('select[name="minutes"]').selectOption("30");
            await form.locator('input[name="avoid"][value="squat"]').check({ force: true });
            await form.locator('input[name="lift-w-0"]').fill("185");
            await form.locator('input[name="lift-r-0"]').fill("8");
            await page.waitForTimeout(200);
            const prof = await page.evaluate(() => getProfile());
            check(prof.goal === "strength" && prof.minutes === "30" && prof.avoid.includes("squat") && await page.evaluate(() => Math.round(coachMaxes()["Bench press"].m) === 234), "Tailor it to you saves your goal, time, moves to skip, and the weights you lift");
            check(/Best fit for you/.test(await page.locator("#setup .setup-tailored").textContent()), "your answers suggest the plan that fits best");
            await page.goto(url("programs.html", "#program-strength-3"), { waitUntil: "load" });
            await page.waitForTimeout(400);
            const cards = (await page.locator(".day-card").allTextContents()).join(" ");
            check(!/Back squat/.test(cards.replace(/Instead of barbell squats/g, "")) && /Instead of barbell squats/.test(cards), "a move you skip is swapped for a stand-in");
            check(/from the numbers you entered/.test(cards), "weights come from the numbers you entered");
            await page.goto(url("programs.html", "#program-build-3"), { waitUntil: "load" });
            await page.waitForTimeout(400);
            check(/Your goal: strength/.test(await page.locator(".day-card[data-day='0'] .ex-row").first().textContent()), "the main lift follows your goal");
            await page.goto(url("programs.html", "#program-strength-3"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator(".badge", { hasText: "Optional if you're short on time" }).count() >= 1 || !(await page.locator(".day-card[data-day='0'] .ex-row").count() > 4), "with 30 minutes, extra exercises are marked optional");
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Smart next workout: no same muscles two days in a row, and a ready-made Day 2
        {
            const { page, errors } = await openPage(browser, "me.html", viewport);
            const seed = () => page.evaluate(() => {
                localStorage.clear();
                const y = new Date(); y.setDate(y.getDate() - 1);
                const yd = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
                saveCustomDays([{ title: "Back & Chest", items: [{ n: "Bench press", d: "3 × 8–10", rest: "2 min" }, { n: "Lat pulldown", d: "3 × 10–12", rest: "90 s" }, { n: "Iso-lateral row", d: "3 × 10–12", rest: "90 s" }] }]);
                localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "custom", days: 1 }));
                localStorage.setItem("gu-sessions", JSON.stringify([{ date: yd, plan: "custom", planName: "My workout", days: 1, day: 0, title: "Back & Chest", exercises: 3, sets: 0, reps: 0, volume: 0, unit: "lb" }]));
            });
            await seed();
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(300);
            const dash = await page.locator("#me-dash .dash-next").textContent();
            check(/Legs/.test(dash) && /skips what you trained yesterday/.test(dash) && !/Bench press/.test(dash), `after back and chest yesterday, Up next suggests legs (${dash.replace(/\s+/g, " ").slice(0, 80)})`);
            check(await page.locator("#me-dash [data-sug-start]").count() === 1 && await page.locator("#me-dash [data-sug-edit]").count() === 1, "the suggestion can be started or customized");
            await Promise.all([page.waitForURL(/#build/), page.click("#me-dash [data-sug-edit]")]);
            await page.waitForTimeout(400);
            check(/Build Day 2/.test(await page.locator("#builder-title").textContent()) && await page.locator(".builder-list li").count() >= 3, "Customize it opens the builder as Day 2 with the exercises filled in");
            await page.click(".builder-clear-all");
            check(await page.locator(".builder-list li").count() === 0 && /Build Day 2/.test(await page.locator("#builder-title").textContent()) && await page.evaluate(() => document.activeElement && document.activeElement.id === "builder-search"), "Clear all empties the prefilled list, keeps it as Day 2, and jumps to the search");
            await page.click(".builder-undo");
            check(await page.locator(".builder-list li").count() >= 3, "Undo brings the cleared exercises back");
            await page.goto(url("me.html"), { waitUntil: "load" });
            await seed();
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(300);
            await Promise.all([page.waitForURL(/program-custom-2/), page.click("#me-dash [data-sug-start]")]);
            await page.waitForTimeout(400);
            check(await page.evaluate(() => customDaysRaw().length === 2 && /Legs/.test(customDaysRaw()[1].title)), "Start it adds it to your split as Day 2");
            // A ready-made plan keeps its own order (it has rest days built in): a rest-day note, not a different workout
            await page.evaluate(() => {
                const y = new Date(); y.setDate(y.getDate() - 1);
                const yd = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
                localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "beginner", days: 3 }));
                localStorage.setItem("gu-log", JSON.stringify({ "Dumbbell bench press": [{ date: yd, unit: "lb", sets: [{ w: 30, r: 10 }] }], "Goblet squat": [{ date: yd, unit: "lb", sets: [{ w: 30, r: 10 }] }] }));
            });
            await page.goto(url("me.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(/rest day in between/.test(await page.locator("#me-dash .dash-next").textContent()) && await page.locator("#me-dash [data-sug-start]").count() === 0, "a ready-made plan the day after training says to rest a day instead of swapping in another workout");
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // App intro: plays when the app opens (previewed here with ?intro=1), a tap skips it
        {
            const { page, errors } = await openPage(browser, "index.html", viewport, "?intro=1");
            await page.waitForTimeout(400);
            check(await page.locator(".intro").count() === 1 && /BASELINE/.test((await page.locator(".intro-word").textContent()).replace(/\s/g, "")), "the app intro plays with the logo and name");
            await page.locator(".intro").click();
            await page.waitForTimeout(700);
            check(await page.locator(".intro").count() === 0 && !(await page.evaluate(() => document.documentElement.classList.contains("app-splash"))), "a tap skips the intro and shows the app");
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Build tab shows only the builder; Plans opens on your active plan, called "Your plan" when it's yours
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            await page.evaluate(() => localStorage.clear());
            await page.goto(url("programs.html", "#build"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#build").isVisible() && await page.locator("#programs").isHidden(), "the Build tab shows only Build your own workout");
            await page.fill("#builder-search", "Bench press");
            await page.locator('[data-add="Bench press"]').click();
            await Promise.all([page.waitForURL(/program-custom/), page.locator(".builder-save").click()]);
            await page.waitForTimeout(400);
            check(await page.locator("#programs").isVisible() && await page.locator("#build").isHidden(), "saving takes you to Plans");
            check(/Your active plan/.test(await page.locator("#program-head").textContent()) && /Your plan/.test(await page.locator("#program-head h3").textContent()) && await page.locator('#goal-picker label.is-active-plan input[value="custom"]').count() === 1, "your workout shows on Plans as Your plan, marked as your active plan");
            await page.goto(url("index.html"), { waitUntil: "load" });
            await page.goto(url("programs.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator('input[name="goal"][value="custom"]').isChecked() && await page.locator("#build-cta").isVisible(), "the Plans tab opens on your active plan, with a link to build another");
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Building after Day 1 makes Day 2 (never wipes your plan), and an arm day after back & chest isn't flagged
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            await page.evaluate(() => {
                localStorage.clear();
                saveCustomDays([{ title: "Back & Chest", items: [{ n: "Bench press", d: "3 × 8–10", rest: "2 min" }, { n: "Lat pulldown", d: "3 × 10–12", rest: "90 s" }] }]);
                localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "custom", days: 1 }));
                localStorage.setItem("gu-level", JSON.stringify("Intermediate"));
                const t = new Date(), td = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
                localStorage.setItem("gu-sessions", JSON.stringify([{ date: td, plan: "custom", days: 1, day: 0, title: "Back & Chest", names: ["Bench press", "Lat pulldown"], exercises: 2, sets: 6, reps: 60, volume: 0, unit: "lb" }]));
            });
            await page.goto(url("programs.html", "#build"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(/Build Day 2/.test(await page.locator("#builder-title").textContent()) && await page.locator(".builder-list li").count() === 0, "with a plan of your own, the builder starts empty as Day 2");
            for (const ex of ["Triceps pushdown", "Rope pushdown"]) { await page.fill("#builder-search", ex); await page.locator(`[data-add="${ex}"]`).click(); }
            await page.waitForTimeout(500);
            check(await page.locator(".builder-cover").isVisible() && /lateral head ×2/i.test(await page.locator(".bc-sum").textContent()) && /Long head/.test(await page.locator(".bc-list").textContent()) && !(await page.locator(".bc-list").isVisible()), "the builder sums up the heads you're working, with every head one tap away");
            check(await page.locator(".bc-bodies path.hit-2").count() > 0, "the body map lights up the muscles the workout hits");
            await page.locator(".bc-warn [data-swap-in]").first().click();
            const swappedIn = await page.evaluate(() => JSON.parse(localStorage.getItem("gu-builder")).items.map((x) => x.n));
            check(swappedIn.includes("Triceps pushdown") && !swappedIn.includes("Rope pushdown") && await page.evaluate((list) => list.some((n) => exerciseHeads(n).main.includes("triceps-long")), swappedIn), `two moves doing the same job get a one-tap swap for one that works a different head (${swappedIn.join(", ")})`);
            check(await page.evaluate(() => Object.keys(EXERCISES).filter((n) => !isCardio(n) && !/stretch|mobility/i.test(n) && !exerciseHeads(n).main.length).length === 0), "every exercise in the library maps to the muscle heads it works");
            for (const ex of swappedIn) await page.locator(".builder-item", { hasText: ex }).first().locator("[data-remove]").click();
            for (const ex of ["Overhead press", "Dumbbell curl", "Hammer curl"]) { await page.fill("#builder-search", ex); await page.locator(`[data-add="${ex}"]`).click(); }
            await Promise.all([page.waitForURL(/program-custom-2/), page.locator(".builder-save").click()]);
            await page.waitForTimeout(400);
            const days = await page.evaluate(() => customDaysRaw().map((d) => d.title));
            check(days.length === 2 && days[0] === "Back & Chest" && /Biceps/.test(days[1]), `saving adds it as Day 2 and names it after its muscles (${days.join(" / ")})`);
            // Day 1 was finished today (ticked off), so Day 2 is up next
            await page.evaluate(() => { const wk = Math.max(1, weekOf(programStart("custom"))); store.set(`gu-progress-custom-2-w${wk}`, ["0-0", "0-1"]); });
            await page.goto(url("me.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            const next = await page.locator("#me-dash .dash-next").textContent();
            check(!/again, and you trained/.test(next) && /Biceps/.test(next), "an arm day after back and chest isn't flagged as the same muscles");
            await page.goto(url("programs.html", "#program-custom-2"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); document.querySelectorAll(".day-menu").forEach((d) => { d.open = true; }); }); await page.locator('[data-move-day="1"][data-dir="-1"]').click();
            check(await page.evaluate(() => /Biceps/.test(customDaysRaw()[0].title) && customDaysRaw()[1].title === "Back & Chest"), "days can be moved up and down");
            const before = await page.evaluate(() => customDaysRaw()[0].items[0].d);
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); document.querySelectorAll(".day-menu").forEach((d) => { d.open = true; }); }); await page.locator('.day-card[data-day="0"] [data-sets-adjust="0-0"][data-dir="1"]').click();
            const after = await page.evaluate(() => customDaysRaw()[0].items[0].d);
            check(Number(after[0]) === Number(before[0]) + 1 && new RegExp(after).test(await page.locator('.day-card[data-day="0"] .ex-dose').first().textContent()), `+ set adds a set right on your plan (${before} -> ${after})`);
            await page.evaluate(() => { document.querySelectorAll(".ex-more").forEach((d) => { d.hidden = false; }); document.querySelectorAll(".day-menu").forEach((d) => { d.open = true; }); }); await page.locator('.day-card[data-day="0"] [data-sets-adjust="0-0"][data-dir="-1"]').click();
            check(await page.evaluate((b) => customDaysRaw()[0].items[0].d === b, before), "− set takes it away again");
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Progression: knows last time's sets and reps, goes up the right amount, and sets/reps follow the goal
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            const res = await page.evaluate(() => {
                localStorage.clear();
                const d = (k) => { const x = new Date(); x.setDate(x.getDate() - k); return x.toISOString().slice(0, 10); };
                localStorage.setItem("gu-log", JSON.stringify({
                    "Bench press": [{ date: d(3), unit: "lb", sets: [{ w: 225, r: 10 }, { w: 225, r: 10 }, { w: 225, r: 10 }] }],
                    "Back squat": [{ date: d(3), unit: "lb", sets: [{ w: 300, r: 12 }, { w: 300, r: 12 }, { w: 300, r: 12 }] }],
                    "Barbell row": [{ date: d(3), unit: "lb", sets: [{ w: 135, r: 10 }] }],
                    "Lateral raise": [{ date: d(3), unit: "lb", sets: [{ w: 15, r: 15 }, { w: 15, r: 15 }] }]
                }));
                return {
                    bench: nextTarget("Bench press", "3 × 8–10", "lb"),
                    squat: nextTarget("Back squat", "3 × 8–10", "lb"),
                    row: nextTarget("Barbell row", "3 × 8–10", "lb"),
                    raise: nextTarget("Lateral raise", "2 × 12–15", "lb"),
                    strength: coachDose("Back squat", true, "Intermediate", "strength")[0],
                    strengthNew: coachDose("Back squat", true, "Beginner", "strength")[0]
                };
            });
            check(res.bench.up && res.bench.weight === 230, `hitting the top of the range on every set adds about 2.5% on upper body (225 -> ${res.bench.weight})`);
            check(res.squat.up && res.squat.weight === 320 && /bigger jump/.test(res.squat.text), `beating the top by 2+ reps on every set gives a bigger jump on legs, capped at two steps (300 -> ${res.squat.weight})`);
            // Tester fixes: judge sessions by the plan they were logged under, skip lighter weeks, next dumbbell up
            const res2 = await page.evaluate(() => {
                const d = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
                localStorage.setItem("gu-log", JSON.stringify({
                    "Back squat": [{ date: d(9), unit: "lb", sets: [{ w: 265, r: 3 }, { w: 265, r: 3 }, { w: 265, r: 3 }, { w: 265, r: 3 }, { w: 265, r: 3 }], plan: { sets: 5, low: 3, high: 3 } }],
                    "Bench press": [{ date: d(9), unit: "lb", sets: [{ w: 205, r: 5 }, { w: 205, r: 5 }, { w: 205, r: 5 }, { w: 205, r: 5 }], plan: { sets: 4, low: 5, high: 5 } },
                        { date: d(2), unit: "lb", sets: [{ w: 185, r: 5 }, { w: 185, r: 5 }], plan: { sets: 2, low: 5, high: 5, easy: true } }],
                    "Goblet squat": [{ date: d(2), unit: "lb", sets: [{ w: 20, r: 10 }, { w: 20, r: 10 }, { w: 20, r: 10 }] }]
                }));
                return { heavy: nextTarget("Back squat", "4 × 5", "lb"), afterDeload: nextTarget("Bench press", "4 × 5", "lb"), goblet: nextTarget("Goblet squat", "3 × 8–10", "lb") };
            });
            check(res2.heavy.up && res2.heavy.weight > 265, `a finished Heavy week (5 × 3) counts as done, not as missed sets (265 -> ${res2.heavy.weight})`);
            check(res2.afterDeload.weight >= 205, `after a recover week the target comes from the last normal week, not the lighter one (${res2.afterDeload.weight})`);
            check(res2.goblet.weight === 25, `dumbbell lifts go up to the next dumbbell (20 -> ${res2.goblet.weight})`);
            const res3 = await page.evaluate(() => {
                const d = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
                localStorage.setItem("gu-log", JSON.stringify({ "Back squat": [
                    { date: d(7), unit: "lb", sets: [{ w: 265, r: 3 }, { w: 265, r: 3 }, { w: 265, r: 3 }, { w: 265, r: 3 }, { w: 265, r: 5 }], plan: { sets: 5, low: 3, high: 3 } },
                    { date: d(4), unit: "lb", sets: [{ w: 185, r: 10 }, { w: 185, r: 10 }, { w: 185, r: 10 }], plan: { sets: 3, low: 10, high: 10 } }] }));
                return { heavy: nextTarget("Back squat", "5 × 3+", "lb").weight, light: nextTarget("Back squat", "3 × 10", "lb").weight, kg: roundWeight(91.3, "kg", "Back squat") };
            });
            check(res3.heavy === 275 && res3.light === 195, `heavy and light days of the same lift keep their own targets (heavy ${res3.heavy}, light ${res3.light})`);
            check(res3.kg === 92.5, `kg barbell weights round to 2.5 kg (${res3.kg})`);
            const wu = await page.evaluate(() => {
                const a = warmupFor(["Bench press", "Incline dumbbell press", "Triceps pushdown", "Overhead triceps extension"]);
                const b = warmupFor(["Back squat", "Romanian deadlift", "Leg press", "Leg extension"]);
                const areas = (list) => new Set(list.flatMap((w) => w.areas));
                return { chest: [...areas(a.moves)], chestStretch: [...areas(a.stretches)], legs: [...areas(b.moves)], legStretch: [...areas(b.stretches)],
                    demo: [...a.moves, ...a.stretches].every((w) => warmupDemo(w).startsWith("https://www.youtube.com/results?search_query=")),
                    upperInLegs: b.moves.some((w) => w.areas.every((x) => ["chest", "triceps", "biceps"].includes(x))), ramp: a.ramp && a.ramp.sets.every(([w]) => w >= 45 && w < a.ramp.w), count: WARMUPS.length, kinds: new Set(WARMUPS.map((w) => w.kind)).size };
            });
            check(wu.chest.includes("chest") && wu.chestStretch.includes("triceps") && wu.chestStretch.includes("chest"), `a chest & triceps day warms up and stretches chest and triceps (${wu.chest.join(", ")} / ${wu.chestStretch.join(", ")})`);
            check(wu.legs.some((x) => ["quads", "hamstrings", "glutes"].includes(x)) && !wu.upperInLegs && wu.legStretch.includes("quads") && wu.legStretch.includes("hamstrings"), `a leg day gets leg warm-ups and leg stretches (${wu.legs.join(", ")} / ${wu.legStretch.join(", ")})`);
            check(wu.demo, "every warm-up and stretch has a video demo link");
            const demos = await page.evaluate(() => {
                const names = new Set([...Object.keys(EXERCISES), ...WARMUPS.map((w) => w.n)]);
                return { stray: Object.keys(DEMO_QUERY).filter((k) => !names.has(k)), all: Object.keys(EXERCISES).every((n) => demoUrl(n).startsWith("https://www.youtube.com/results?search_query=") && demoQuery(n).length > 3), checked: Object.keys(DEMO_QUERY).length };
            });
            check(demos.all && demos.stray.length === 0 && demos.checked >= 30, `every exercise has a demo search, and every checked search matches a real exercise or stretch (${demos.checked} checked)${demos.stray.length ? ": " + demos.stray.join(", ") : ""}`);
            const wuAll = await page.evaluate(() => {
                const out = [];
                ["gym", "home"].forEach((place) => {
                    const prof = JSON.parse(localStorage.getItem("gu-profile") || "{}");
                    localStorage.setItem("gu-profile", JSON.stringify(Object.assign({}, prof, { place })));
                    Object.keys(EXERCISES).filter((n) => !isCardio(n) && n !== "Stretching or mobility").forEach((n) => {
                        const w = warmupFor([n]), ms = musclesOf(n);
                        const gaps = [!w.moves.some((v) => warmupFits(v, n)) && "no matching warm-up", !w.stretches.some((v) => warmupFits(v, n)) && "no matching stretch",
                            ms.some((m) => !w.moves.some((v) => v.areas.includes(m))) && "a muscle with no warm-up", ms.some((m) => !w.stretches.some((v) => v.areas.includes(m))) && "a muscle with no stretch",
                            place === "home" && w.moves.some((v) => v.needs === "bar") && "a pull-up bar at home"].filter(Boolean);
                        if (gaps.length) out.push(`${place} ${n}: ${gaps.join(", ")}`);
                    });
                    localStorage.setItem("gu-profile", JSON.stringify(prof));
                });
                return out;
            });
            check(wuAll.length === 0, `every exercise gets its own warm-up and stretches, at the gym and at home${wuAll.length ? ": " + wuAll.slice(0, 5).join("; ") : ""}`);
            check(wu.ramp !== false && wu.count >= 50 && wu.kinds === 2, `warm-up sets start at the empty bar and stay under your first set; ${wu.count} warm-ups and stretches`);
            const ord = await page.evaluate(() => {
                const names = ["Leg extension", "Seated hamstring curl", "Leg press", "Back squat", "Hack squat", "Goblet squat", "Romanian deadlift", "Plank"];
                const o = smartOrder(names).map((k) => names[k]);
                const m = o.map((n) => builderMuscle(n));
                return { o, run: longestRun(m), first: o[0], last: o[o.length - 1], tiers: o.map((n) => exerciseTier(n)) };
            });
            check(ord.first === "Back squat" && ord.last === "Plank" && ord.run <= 2 && ord.tiers.slice(0, 2).every((t) => t === 0), `a day is put in order: big lifts first, core last, never 3 for one muscle in a row (${ord.o.join(" > ")})`);
            const res4 = await page.evaluate(() => {
                const d = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
                const sets = (w, r, n) => Array.from({ length: n }, () => ({ w, r }));
                localStorage.setItem("gu-log", JSON.stringify({
                    "Dumbbell bench press": [{ date: d(3), unit: "lb", sets: sets(100, 15, 4), plan: { sets: 4, low: 8, high: 10 } }],
                    "Lateral raise": [{ date: d(6), unit: "lb", sets: sets(10, 5, 3), plan: { sets: 3, low: 12, high: 15 } }, { date: d(3), unit: "lb", sets: sets(10, 6, 3), plan: { sets: 3, low: 12, high: 15 } }],
                    Deadlift: [{ date: d(6), unit: "lb", sets: sets(325, 4, 3), plan: { sets: 3, low: 5, high: 5 } }, { date: d(3), unit: "lb", sets: sets(325, 4, 3), plan: { sets: 3, low: 5, high: 5 } }]
                }));
                return { db: nextTarget("Dumbbell bench press", "4 × 8–10", "lb").weight, raise: nextTarget("Lateral raise", "3 × 12–15", "lb").weight, dl: nextTarget("Deadlift", "3 × 5", "lb").weight };
            });
            check(res4.db > 100 && res4.db <= 110, `even far past the top of the range, 100 lb dumbbells go up at most two sizes (-> ${res4.db})`);
            check(res4.raise === 7.5, `stuck on a light dumbbell after two tough sessions drops one size, not back to the same weight (10 -> ${res4.raise})`);
            check(res4.dl === 290, `a reset lands on a weight you can load (325 -> ${res4.dl})`);
            const en = await page.evaluate(() => {
                const p = { ...getProfile(), unit: "lb", bodyweight: "195", sex: "male", years: "30", heightCm: "178", activity: "1.375", bodyfat: "" };
                return { m: energyEstimate(p), k: energyEstimate({ ...p, bodyfat: "15" }), kid: energyEstimate({ ...p, years: "16" }) };
            });
            check(en.m && Math.abs(en.m.maintenance - 2546) < 5 && en.m.method === "mifflin", `daily calories use weight, height, age, and sex (${en.m && Math.round(en.m.maintenance)})`);
            check(en.k && en.k.method === "katch" && Math.abs(en.k.bmr - 1994) < 3, `with body fat %, resting burn comes from lean mass (${en.k && Math.round(en.k.bmr)})`);
            check(en.kid === null, "no calorie estimate for anyone under 18");
            check(await page.evaluate(() => !familyFor("Reverse lunge", "homedb") || familyFor("Reverse lunge", "homedb").every((n) => !NEEDS_BENCH.test(n))), "the no-bench home plan never swaps in a bench move");
            check(!res.row.up && /1 of 3 sets/.test(res.row.text), "doing fewer sets than planned keeps the weight and asks for all the sets first");
            // Next target counts the sets you actually did: warm-ups don't count, extra sets are a bonus, lighter sets aren't "done at this weight"
            const res5 = await page.evaluate(() => {
                const d = (n) => { const x = new Date(); x.setDate(x.getDate() - n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
                const plan = { sets: 3, low: 6, high: 8 };
                localStorage.setItem("gu-log", JSON.stringify({
                    "Bench press": [{ date: d(3), unit: "lb", sets: [{ w: 45, r: 10 }, { w: 135, r: 5 }, { w: 185, r: 8 }], plan }],
                    "Back squat": [{ date: d(3), unit: "lb", sets: [{ w: 225, r: 8 }, { w: 225, r: 8 }, { w: 225, r: 8 }, { w: 225, r: 5 }], plan }],
                    "Barbell row": [{ date: d(3), unit: "lb", sets: [{ w: 135, r: 8 }, { w: 125, r: 8 }, { w: 125, r: 8 }], plan }]
                }));
                return { warm: nextTarget("Bench press", "3 × 6–8", "lb"), extra: nextTarget("Back squat", "3 × 6–8", "lb"), lighter: nextTarget("Barbell row", "3 × 6–8", "lb") };
            });
            check(!res5.warm.up && res5.warm.weight === 185 && res5.warm.setsDone === 1 && /1 of 3 sets/.test(res5.warm.text) && /warm-up/.test(res5.warm.text), `lighter warm-up sets don't count as sets done (${res5.warm.text})`);
            check(res5.extra.up && res5.extra.weight > 225 && /bonus/.test(res5.extra.text), `an extra set past the plan doesn't hold the weight back (225 -> ${res5.extra.weight})`);
            check(!res5.lighter.up && res5.lighter.weight === 135 && /1 of 3 sets were at 135/.test(res5.lighter.text), `sets done lighter than your top weight: stay and do them all at it (${res5.lighter.text})`);
            check(res.raise.up && res.raise.weight === 17.5, `light lifts go up in the smallest step (15 -> ${res.raise.weight})`);
            check(/^4 × 3–5/.test(res.strength) && /^3 × 5/.test(res.strengthNew), `strength sets and reps follow the research ranges (${res.strength}, beginner ${res.strengthNew})`);
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // iPhone: the rest timer can start the iPhone's own Clock timer (Lock Screen countdown) through a Shortcut
        {
            const ctx = await browser.newContext({ viewport, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
            const page = await ctx.newPage();
            page.on("dialog", (d) => d.accept().catch(() => {})); // confirm() pop-ups say yes
            const errors = [];
            page.on("pageerror", (e) => errors.push(e.message));
            await page.route(/script\.js/, (r) => r.fulfill({ contentType: "application/javascript", body: fs.readFileSync(path.join(ROOT, "script.js"), "utf8").replace(/const COACH_AI_URL = "[^"]*";/, 'const COACH_AI_URL = "";') }));
            await page.goto(url("programs.html", "#program-beginner-3"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.locator(".rest-btn").first().click();
            await page.evaluate(() => document.getElementById("rest-size").click()); // the options live under More
            check(await page.locator("#rest-ios").isVisible(), "on iPhone the rest timer offers a Lock Screen timer");
            await page.click("#rest-ios");
            check(await page.locator("#ios-timer-setup").isVisible() && /Ground Up Rest/.test(await page.locator("#ios-timer-setup").textContent()), "the first time, it shows the one-time Shortcut setup");
            check(await page.evaluate(() => restShortcutUrl(90)) === "shortcuts://run-shortcut?name=Ground%20Up%20Rest&input=text&text=90", "the Lock Screen timer opens the Shortcut with the seconds left");
            await page.click("[data-ios-close]").catch(() => {});
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await ctx.close();
        }

        // Cancel workout hides the plan until you tap Continue
        {
            const { page, errors } = await openPage(browser, "tools.html", viewport);
            await page.evaluate(() => { localStorage.clear(); localStorage.setItem("gu-last-plan", JSON.stringify({ goal: "beginner", days: 3 })); });
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#planbar").count() === 1, "the Your plan bar shows while you're on a plan");
            await page.evaluate(() => { localStorage.setItem("gu-rest", JSON.stringify({ endAt: Date.now() + 60000, total: 60, name: "Squat" })); localStorage.setItem("gu-log-draft", JSON.stringify({ x: { date: "2026-01-01" } })); });
            await page.locator("#planbar .planbar-toggle").click();
            await page.locator("#planbar [data-cancel-workout]").click();
            check(await page.locator("#planbar").count() === 0 && await page.evaluate(() => store.get("gu-plan-paused") === true && !localStorage.getItem("gu-log-draft")), "Cancel workout hides the plan bar and drops half-typed sets");
            await page.goto(url("tools.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#planbar").count() === 0, "the plan stays hidden on other pages");
            await page.goto(url("index.html"), { waitUntil: "load" });
            const cont = page.locator('.home-next a[href*="?today=1"]').first();
            check(await cont.count() === 1 && /Paused/.test(await page.locator(".home-next").textContent()) && /Continue workout/.test(await cont.textContent()), "the home page still offers Continue (the Up next card says it's paused)");
            await page.goto(url("programs.html", "?today=1#program-beginner-3"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.evaluate(() => !store.get("gu-plan-paused")), "Continue brings the plan back");
            await page.goto(url("tools.html"), { waitUntil: "load" });
            await page.waitForTimeout(300);
            check(await page.locator("#planbar").count() === 1, "after Continue, the plan bar is back");
            await page.evaluate(() => localStorage.clear());
            check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
            await page.close();
        }

        // Basics page: linking to a question opens its answer
        {
            const { page } = await openPage(browser, "basics.html", viewport, "#faq-protein");
            check(await page.locator("#faq-protein").evaluate((d) => d.open), "linking to a question opens its answer");
            check(await page.locator("#faq-women a[href='programs.html#program-glutes']").count() === 1, "men and women answer links to the focus plans");
            await page.close();
        }
    }

    await browser.close();
    console.log(failures.length ? `\n${failures.length} check(s) failed.` : "\nAll checks passed.");
    process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
