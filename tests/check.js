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

const SITE = "file://" + path.resolve(__dirname, "..", "index.html");
const SHOTS = path.join(__dirname, "screenshots");
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); console.log((ok ? "  ok   " : "  FAIL ") + msg); };

(async () => {
    fs.mkdirSync(SHOTS, { recursive: true });
    const browser = await chromium.launch({ executablePath: findChromium(), args: ["--headless=new"] });

    for (const [name, viewport] of [["desktop", { width: 1280, height: 900 }], ["phone", { width: 390, height: 844 }]]) {
        console.log(`\n${name} (${viewport.width}px)`);
        const page = await browser.newPage({ viewport });
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => {
            // Offline font loads are fine; real script errors are not
            if (m.type() === "error" && !/Failed to load resource|fonts\.g/.test(m.text())) errors.push(m.text());
        });

        await page.goto(SITE, { waitUntil: "load" });
        await page.waitForTimeout(400);

        check(errors.length === 0, `no script errors ${errors.length ? JSON.stringify(errors) : ""}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        check(overflow <= 0, `no sideways scrolling (overflow ${overflow}px)`);

        // Every menu and footer link points at something real or a known route
        const badLinks = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
            .map((a) => a.getAttribute("href"))
            .filter((h) => h !== "#" && !document.getElementById(h.slice(1)) && !/^#(program|contact)-/.test(h)));
        check(badLinks.length === 0, `all in-page links have a target ${badLinks.length ? JSON.stringify(badLinks) : ""}`);

        // Program builder
        check(await page.locator(".day-card").count() >= 3, "program builder shows day cards");
        await page.locator("#day-grid input[type=checkbox]").first().check({ force: true });
        check(/^1 of/.test(await page.locator("#progress-label").textContent()), "checking an exercise updates progress");
        await page.locator("#reset-week").click();

        // Tools
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

        // Dark mode
        await page.locator(".theme-toggle").click();
        check(await page.evaluate(() => document.documentElement.dataset.theme === "dark"), "dark mode toggles");

        await page.screenshot({ path: path.join(SHOTS, `${name}-full-dark.png`), fullPage: true });
        await page.locator(".theme-toggle").click();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(SHOTS, `${name}-full-light.png`), fullPage: true });

        check(errors.length === 0, `still no script errors after using the page ${errors.length ? JSON.stringify(errors) : ""}`);
        await page.close();
    }

    await browser.close();
    console.log(failures.length ? `\n${failures.length} check(s) failed.` : "\nAll checks passed.");
    process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
