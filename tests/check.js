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
            if (key && key !== "me") check(await page.locator(`#site-nav .nav-link.active[href="${tab}"]`).count() === 1, "this page's tab is marked as current");
            await page.screenshot({ path: path.join(SHOTS, `${name}-${file.replace(".html", "")}.png`), fullPage: true });
            await page.close();
        }

        // Home: quick start sends you to the right plan on the Programs page
        console.log("\nhome features");
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            check(Number(await page.locator('[data-stat="plans"]').textContent()) >= 8, "hero stats count the plans");
            check(await page.locator(".ticker").count() === 0 && await page.locator(".promise-strip li").count() === 4, "no moving ticker; calm promise strip instead");
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

        // Coach: ask for muscles, get a workout, start it on the Plans page
        {
            const { page, errors } = await openPage(browser, "index.html", viewport);
            await page.evaluate(() => { localStorage.removeItem("gu-custom"); localStorage.removeItem("gu-level"); });
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
            await ask(`<img src=x onerror="window.__pwned=1">`);
            check(await page.evaluate(() => !window.__pwned && document.querySelectorAll(".coach-log img").length === 0), "typing code into Coach can't run it");
            await ask("chest and triceps, 30 minutes");
            // The chat stays open, with its history, when you move to another page
            const before = await page.locator(".coach-msg").count();
            await page.evaluate(() => { location.href = "tools.html"; });
            await page.waitForURL(/tools\.html/);
            await page.waitForTimeout(300);
            check(await page.locator("#coach").isVisible() && await page.locator(".coach-msg").count() === before, `the chat and its history follow you to other pages (${before} messages)`);
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
            await page.evaluate(() => { ["gu-custom", "gu-last-plan", "gu-coach-history", "gu-coach-state", "gu-coach-open"].forEach((k) => localStorage.removeItem(k)); });
            await page.close();
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
            await page.locator('.howto-level input[value="Intermediate"]').check({ force: true });
            check(/Avoid these/.test(await body()) && !/Form cues/.test(await body()), "Intermediate adds common mistakes");
            await page.locator('.howto-level input[value="Advanced"]').check({ force: true });
            check(/Form cues/.test(await body()) && !/Programming notes/.test(await body()), "Advanced adds form cues");
            await page.locator('.howto-level input[value="Expert"]').check({ force: true });
            check(/Programming notes/.test(await body()) && /Strength|Easy days|Sets:/.test(await body()), "Expert adds programming notes");
            await page.keyboard.press("Escape");
            check(await page.evaluate(() => JSON.parse(localStorage.getItem("gu-level"))) === "Expert" && await page.locator('.level-wrap input[value="Expert"]').isChecked(), "the level is one setting for the whole site");
            await page.evaluate(() => localStorage.setItem("gu-level", JSON.stringify("Beginner")));
            await page.reload({ waitUntil: "load" });
            await page.click('[data-mm-pick="quads"]');
            check(await page.locator("#mm-panel .mm-part").count() === 0 && /Switch to Intermediate/.test(await page.locator("#mm-panel").textContent()), "beginners see a muscle's best exercises without the head-by-head detail");
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
