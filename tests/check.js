/* Browser test for Ground Up Fitness.
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
            check(page.url().endsWith("programs.html#program-build-3"), "quick start opens the Programs page");
            check(/Build muscle · 3 days/.test(await page.locator("#program-head h3").textContent()), "and shows Build muscle, 3 days");
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
            await page.locator("[data-howto]").first().click();
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
            await page.locator(".ex-row").nth(1).locator("[data-swap]").click();
            const after = await page.locator(".ex-row").nth(1).locator(".ex-name").textContent();
            check(before !== after, `Swap changes the exercise (${before} -> ${after})`);

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
            check(/Last time: 100×12/.test(target) && /Go up to/.test(target), `logging the top of the range suggests more weight next time`);
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

            await page.locator(".theme-toggle").click();
            check(await page.evaluate(() => document.documentElement.dataset.theme === "dark"), "dark mode toggles");
            await page.screenshot({ path: path.join(SHOTS, `${name}-programs-dark.png`), fullPage: true });

            // Coming back: the Programs page reopens the last plan, and home offers to continue it
            await page.goto(url("programs.html"));
            await page.waitForTimeout(200);
            check(/Short on time/.test(await page.locator("#program-head h3").textContent()), "Programs reopens the plan you used last");
            await page.goto(url("index.html"));
            await page.waitForTimeout(200);
            check(/Continue: Short on time/.test(await page.locator(".hero-actions").textContent()), "home page offers to continue your plan");
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
            await page.locator('input[name="muscle"][value=""]').check({ force: true });
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
            check(await page.locator(".hero-level .level-bar input").count() === 4 && await page.locator("#setup .setup-form").count() === 1, "the cover has a level picker and the home page has Your starting point");
            await page.fill("#setup-bw-0", "180");
            await page.selectOption("#setup-sex-0", "male");
            await page.locator('#setup input[value="Intermediate"]').check({ force: true });
            await page.waitForTimeout(100);
            const benchMid = Number((await page.locator(".setup-weights li").first().textContent()).replace(/\D+/g, ""));
            check(benchMid >= 120 && benchMid <= 160 && await page.locator('.hero-level input[value="Intermediate"]').isChecked(), `starting weights show for your level, and the cover picker follows (bench ${benchMid} lb)`);
            await page.locator('.hero-level input[value="Expert"]').check({ force: true });
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
            await page.locator('#home-kit input[value="dumbbell"]').check({ force: true });
            await page.waitForTimeout(300);
            check(/Dumbbells only/.test(await page.locator("#program-head").textContent()) && await page.locator(".ex-name .equip-db").count() >= 1, "picking Dumbbells switches to the dumbbell plan");
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
            await page.locator('input[name="equip"][value="db"]').check({ force: true });
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
            for (const ex of ["Incline dumbbell press", "Cable fly"]) { await page.fill("#builder-search", ex); await page.locator(`[data-add="${ex}"]`).click(); }
            await page.fill("#builder-search", "Pec deck");
            const anyway = (await page.locator('[data-add="Pec deck"]').textContent()).trim();
            await page.locator('[data-add="Pec deck"]').click();
            check(/Add anyway/i.test(anyway) && await page.locator(".bi-warn").count() >= 1 && /too many/.test(await page.locator(".builder-tally").textContent()), `a 4th chest exercise is allowed but flagged (${anyway})`);
            for (const ex of ["Pec deck", "Cable fly", "Incline dumbbell press"]) await page.locator(".builder-item", { hasText: ex }).locator("[data-remove]").click();
            await page.locator('input[name="builder-goal"][value="strength"]').check({ force: true });
            check(/4–6|5/.test(await page.locator(".builder-item").first().locator('[data-f="amount"]').inputValue()), "switching the goal to Get stronger changes the reps");
            await page.locator(".builder-save").click();
            await page.waitForURL(/program-custom/);
            await page.waitForTimeout(400);
            const saved = await page.evaluate(() => store.get("gu-custom"));
            check(saved && saved.items.length === 3 && /^\d × (4–6|5)$/.test(saved.items[0].d), `Save and start saves it as My workout (${saved && saved.items[0].d})`);
            check(/My workout/i.test(await page.locator("#program-head").textContent()) && /Start with about/.test(await page.locator(".ex-target").first().textContent()), "the saved workout opens with a starting weight on each lift");
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
            check(/Finished/i.test(await page.locator(".day-card[data-day='0'] .day-finish").textContent()) && await page.locator("[data-continue='0']").count() === 1, "a finished day says so and offers Continue");
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
            check(/My workout/.test(await page.locator(".program-head h3").textContent()) && /Chest & Triceps/.test(await page.locator(".day-card h4").first().textContent()), "Start this workout opens it as My workout on the Plans page");
            check(await page.locator(".day-card [data-log]").count() >= 3, "My workout can be logged like any plan");
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
            await ctx.close();
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
            });
            await page.reload();
            await page.waitForTimeout(300);
            check(/max/.test(await page.locator("#lift-table tbody").textContent()), "progress page lists logged lifts with projections");
            check(await page.locator("#lift-chart .chart-proj").count() === 1, "lift chart shows a projection");
            await page.locator('input[name="trainfor"][value="endurance"]').check({ force: true });
            check(/reps @ 140/.test(await page.locator("#lift-table tbody").textContent()), "endurance view shows reps at your working weight");
            check(/25/.test(await page.locator("#me-stats").textContent()), "this week's cardio minutes are counted");
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
            await page.evaluate(() => { store.set("gu-level", "Advanced"); window.dispatchEvent(new CustomEvent("logchange")); });
            check(await page.locator('#reset-list input[value="lifts"]').isChecked() && !(await page.locator('#reset-list input[value="settings"]').isChecked()), "Clear my progress picks logs by default, not settings");
            await page.click("#reset-go");
            check(await page.locator("#reset-confirm").isVisible() && await page.evaluate(() => Object.keys(getLog()).length > 0), "clearing asks to confirm first and nothing is deleted yet");
            await page.click("#reset-yes");
            check(await page.evaluate(() => Object.keys(getLog()).length === 0 && getPRs().length === 0 && store.get("gu-level") === "Advanced"), "confirming clears the log and records but keeps settings");
            check(/Bench press/.test(await page.locator("#recent-prs").textContent()) === false, "the page updates right away after clearing");
            await page.click("#reset-undo");
            check(await page.evaluate(() => Object.keys(getLog()).length > 0 && getPRs().length > 0), "Undo brings the cleared progress back");
            await page.evaluate(() => store.remove("gu-level"));
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
