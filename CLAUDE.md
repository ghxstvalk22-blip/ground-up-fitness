# Ground Up Fitness: instructions for Claude

This repo is a static fitness website (plain HTML, CSS, and JavaScript, no build step)
for people losing weight, lifting, or starting at the gym. It is hosted on GitHub Pages
from the `main` branch, so **anything pushed to `main` goes live**.

The owner wants the site to grow on its own through a daily scheduled run. Each run
ships **one** focused improvement.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Home page: photo hero, "Nervous about starting?", quick-start plan picker, program tiles, how it works, pro band, tools teaser. |
| `start.html`, `programs.html`, `exercises.html`, `pros.html`, `tools.html`, `basics.html`, `contact.html` | One page per menu tab. Each has a photo banner and its own `<body data-page="...">`. |
| `exercises.js` | `EXERCISES` (a how-to guide for every exercise) and `EXERCISE_FAMILIES` (exercises that can swap for each other, used by the weekly rotation and Swap). Loaded before `script.js`. Every exercise used in a plan must have an entry; the test checks this. |
| `muscle-art.js` | Body outlines and muscle shapes for the Muscle map (front/back, male/female), from the MIT-licensed `@musclemap/assets`; keep its license header. Loaded only on `exercises.html`. |
| `manifest.webmanifest`, `sw.js`, `icons/` | The phone app: installing to the home screen, the app icon, and offline support. A new page must be added to `CORE` in `sw.js` (the test checks). Phones also get a bottom tab bar (built in `setupLayout`). |
| Fitness Coach (`setupCoach` in `script.js`) | The chat helper on every page (barbell button). Its conversation is saved as `gu-coach-history` (last 40 messages), its last workout as `gu-coach-state`, lift numbers people tell it as `gu-coach-maxes` (estimated maxes, checked by `coachMaxes`), and whether it's open as `gu-coach-open`, so it stays open with its history from page to page; saved messages always go back through `cleanHtml` before they're shown. With `COACH_AI_URL` empty (the default) it runs on the device with no AI service. When the owner sets `COACH_AI_URL` to their Cloudflare Worker (`coach-ai/worker.js`, setup in `coach-ai/README.md`; the Worker's host must also be added to `connect-src` on every page), chat text (only what's typed, never logs or settings) goes to Claude through the Worker, which holds the API key and the coach's safety rules (`SYSTEM`); pain and under-18 messages still get the built-in replies, the answer is escaped by `coachMarkdown`, its workout block is checked by `coachAiWorkout`, and the built-in rules answer if the AI can't be reached. Built-in mode: it reads muscle words, equipment, and time from what people type, builds a workout from `MUSCLE_MAP` and `EXERCISES`, and saves it as `gu-custom`, which the Plans page shows as "My workout". New muscles or exercises are picked up automatically. Keep its safety replies (pain or injury: see a doctor or physical therapist; under 18: adults only; food: see a registered dietitian). |
| Starting weights and equipment | `setupStartingPoint` (`[data-setup]` on the home page and My progress) saves level, bodyweight, and sex to the profile; `startWeight`/`startMax` turn them into first-time weights (`START_MAX`, `START_WOMEN`, `START_EXTRA`) used by plan targets and the Fitness Coach; logged sets always win. `equipOf`/`equipIcon` give every exercise an equipment icon (drawn in CSS as `.equip-*`). Home plans show a Nothing/Dumbbells switch (`#home-kit`). |
| Tailor it to you | The `details.setup-more` part of Your starting point saves `goal`, `place`, `days`, `minutes`, `age`, and `avoid` to the profile (checked in `getProfile`) and the weights people already lift to `gu-coach-maxes`. `startMax` uses those numbers first (and eases starting weights from age 50); `personalDose` applies goal/time/age; `dayLineup` swaps `AVOID_MOVES` for a family member or `AVOID_SUBS`; `recommendPlan` picks the best-fit plan. |
| Build your own workout | `setupBuilder` (`[data-builder]` at the top of `programs.html`, route `#build`) lets people pick exercises and set sets/reps/rest; `builderWeight` shows the weight (logged target first, else `startWeight`). Saves to `gu-custom` (My workout); the draft is `gu-builder` (checked by `builderClean`). |
| Your plan bar | `setupPlanBar` shows the current plan (`currentPlanInfo`: `gu-last-plan`, this week's check-offs, `dayLineup`) at the bottom of every page but Plans. Cancel workout (`cancelWorkout`, any `[data-cancel-workout]`) sets `gu-plan-paused`, which hides the bar until Continue (`resumePlan`, or opening Plans with `?today=1`). `editCustomWorkout()` loads My workout into the builder (`editing: true`); saving maps check-offs by exercise name. Exercises can have `aka` (other names) that search and the Coach use. |
| Multi-day My workout and dashboard | `gu-custom` holds `{ days: [{ title, items }] }` (up to 7; day 1 is also mirrored at the top level); use `customDaysRaw`/`saveCustomDays`. `addCustomDay()` and `editCustomWorkout(day)` open the builder. Finish workout (`finishWorkout` in `setupPrograms`) saves `gu-sessions` and offers What's next. `setupMyDashboard` (`#me-dash` on `me.html`) uses the optional `profile.name` (checked in `getProfile`). |
| Smart next workout | `recentlyTrained()` (sessions and logs from today and yesterday, grouped by `REGION_OF` into push/pull/legs) and `suggestNextWorkout()` (picks a `NEXT_TEMPLATES` entry that avoids those regions, built with `coachMake`) drive the Up next card on `me.html` (`startSuggested`/`customizeSuggested`) and prefill `addCustomDay()`. `gu-last-plan` changes only through `adopt()` in `setupPrograms` (start/log/tick/finish/Switch), not by viewing a plan; `#adopt-note` shows when viewing another plan. |
| Add to my workout | `setupAddToWorkout`: any `[data-add-ex="Name"]` button (library cards, Muscle map `+`, How-to) asks which day of My workout to add it to; `addExerciseToCustom(name, dayIndex or "new")` saves it. After finishing a day, the day card offers `data-continue` (`continueFrom` in `setupPrograms`). The Exercise library page has no level picker. |
| Loading screen and Progress tabs | `splash.js` (a tiny script in every page's `<head>`, before `styles.css`) adds `html.app-splash` (a black cover) once per launch of the installed app, then plays the `.intro` animation (photo, bars, name, line, tagline; tap skips; `?intro=1` previews it); the cover also fades on its own. On `me.html`, sections marked `data-me-tab` (overview, lifts, log, cardio, you) become tabs; the Log tab (`setupLogHistory`) lists every logged set from `gu-log` with filter and remove/undo (`setupMeTabs`); links to an ID inside a tab open that tab. |
| Logging and at-home plans | Log forms show target reps as hints; each set's ✓ (`data-set-done`) fills them and starts rest; only filled sets save. Half-typed sets are kept in `gu-log-draft` (today only). `homedb` (Home with dumbbells) is a Beginner sub-plan: its goal radio has `data-sub` so it stays out of the picker and is reached through the `#home-kit` switch on No gym and Lose fat. |
| `styles.css` | All styles. Colors are tokens on `:root`, with dark mode overrides. |
| `script.js` | All behavior, organized as independent feature blocks. |
| `ROADMAP.md` | The idea backlog. The owner adds ideas here. |
| `CHANGELOG.md` | One entry per run, newest first. |
| `tests/check.js` | Browser test that must pass before every push. |

## How script.js is organized (keep it this way)

- Each feature is one `function setupSomething() { ... }`.
- New features get **added to the `FEATURES` array** near the top. Never reorganize the file.
- Features that need special links register them with `addRoute(pattern, handler)`
  (see `setupPrograms` and `setupContactForm`).
- Use the shared helpers: `store` (safe localStorage), `escapeHtml`, `fmt`, `goTo`.
- Program options: `source: [label, url]` shows a "Based on" credit (verify the URL first);
  `weeks: [...]` inside a plan gives week-by-week days (see Couch to 5K); `rotation: "none"`
  stops exercise rotation; `waves: false` turns off the 4-week Build/Push/Heavy/Recover cycle.
- The header, menus, footer, and search dialog are built by `setupLayout()` from `SITE_NAV`.
  Edit menus there, not in the HTML files. New menu links show up in search automatically.
- Each feature must check for its own elements and return quietly on pages without them.
- The "training engine" helpers (rotation, weeks, log, targets, projections) are plain functions
  above `setupPrograms`. Reuse them instead of writing new versions.
- Saved data lives in the visitor's browser only (`store`). Keys start with `gu-`. Never send it anywhere.
- Links between pages use the page name: `tools.html#tool-1rm`, `programs.html#program-classic-5`.
  A new page needs: the same `<head>`, `<div id="site-header">`, a banner, `<main id="main">`,
  `<div id="site-footer">`, an entry in `SITE_NAV`, and a line in `PAGES` in `tests/check.js`.

## Rules for every change

1. **Add, don't rewrite.** Make targeted edits. Never regenerate a whole file. Never
   remove an existing feature unless `ROADMAP.md` explicitly asks for it.
2. **Match the existing look** (a streetwear/gym-brand style the owner asked for, in the spirit of
   YoungLA, DFYNE, Gold's Gym): the Archivo font (condensed for big headlines, expanded for
   small labels), black/white/bone colors with the one orange accent (`--volt`), sharp corners,
   uppercase letter-spaced labels and buttons, black-and-white photos, plain human wording
   (no buzzwords), and working dark mode and phone layouts (no sideways scrolling at 390px wide).
   Most visitors are on phones: anything you tap must be at least 44px tall there, form fields use
   16px text (so iPhones don't zoom), and nothing fixed to the bottom may hide behind the tab bar
   (use `var(--tabbar-h)`). The test checks button sizes at 390px.
3. **Accessible:** real labels on inputs, keyboard support, visible focus, and nothing
   that relies on color alone.
4. **No new external dependencies.** Fonts come from Google Fonts. Photos come from Unsplash
   (free license only, never Unsplash+), loaded from images.unsplash.com, and every photographer
   is added to `PHOTO_CREDITS`. The one exception is accounts: `setupAccount` loads the Firebase
   SDK from gstatic.com, and only when the owner has filled in `FIREBASE_CONFIG`. No frameworks,
   no trackers, no analytics, no ads.
5. **Health content must be safe and mainstream:** evidence-based, beginner-friendly, and
   for healthy adults. No crash diets, no calorie targets below the existing floors
   (1,500 for men and 1,200 for women), no supplements or drugs (except the owner-requested, evidence-based `supplements.html` guide:
   keep it to well-researched basics, third-party testing, see-a-doctor notes, and no affiliate links), no medical claims, and no
   content aimed at minors. Anything about nutrition or injury points people to a doctor
   or registered dietitian when appropriate.
6. **Never** put passwords, API keys, or personal information in the repo. The contact
   form key stays an empty string unless the owner fills it in. `FIREBASE_CONFIG` stays empty
   unless the owner fills it in (those values are public by design; Firestore rules protect the data). While it's empty, the Contact
   page shows a "still being set up" note and the Send button is disabled; that's expected.
7. **Hero counts update themselves** from `PROGRAMS`. A program can set `kit: "none"` (home,
   bodyweight) or `kit: "db"` (dumbbells); the rotation and Swap then only use exercises whose
   `kit` in `exercises.js` fits. `rotation: "block"` makes a plan change every 4 weeks instead of weekly. When you add a
   program, also add its radio button in the program builder, a tile in the quick-start
   card if it's a main goal, and a link in the Programs menu.
8. **Real people:** never write quotes, tips, testimonials, or endorsements attributed to
   real athletes or coaches, and never use their photos or logos. Linking to their own
   official channels with a factual one-line description is fine, but verify the URL and
   facts first, and keep the "not affiliated" note.
9. **Security:** every page carries the same `Content-Security-Policy` meta tag. Never add inline
   `<script>` blocks or `onclick=`-style attributes. A new outside host (images, scripts, APIs) must
   be added to the policy on every page, and only if it's truly needed. Put saved or typed values
   into the page only through `escapeHtml` (or `textContent`), and check saved settings against a
   list of allowed values the way `getProfile` does. The test enforces most of this.

10. **Don't overwhelm beginners: everything follows "Your level".** One site-wide setting
   (`getLevel()`, saved as `gu-level`): Beginner, Intermediate, Advanced, Expert. Beginner is the
   default and must stay simple. Every plan has a `level` and only shows at that level or higher
   (Beginner plans also get `main: true`, which puts them in the menu). Detail grows with the level:
   use `levelAtLeast("Intermediate")` and friends to gate extra content. Today: Intermediate adds
   common mistakes, harder versions, "How this plan works", and "Make it yours"; Advanced adds form
   cues, swaps, the 4-week training waves, variety, and the muscle map's anatomy names; Expert adds
   programming notes and research notes. New in-depth content goes at the level it suits, never at
   Beginner by default. The level picker appears only on the Plans page (`#all-plans`) and inside Build your own workout (`mountLevelBar`), never on the home page, at the owner's request. Pros and Gym basics are off the menus at the owner's request (`menu: false` in `SITE_NAV`; their pages stay up and searchable), so don't add them back. Menus have 6 links or fewer (extras go in `more` in `SITE_NAV`, which search
   still finds). The test enforces the plan counts per level and the menu limit.

## The daily run, step by step

1. Read `ROADMAP.md`. Take the first unchecked item under **Up next**. If that list is
   empty, pick the most useful item from **Ideas**, or invent a small, clearly useful
   improvement that fits the rules above.
2. Build it with targeted edits.
3. Run the test: `npm install --no-audit --no-fund && node tests/check.js`. It checks desktop
   (1280px), laptop (1100px), and phone (390px) using the real Archivo font.
   If it fails, fix the problem and run it again. If you can't make it pass,
   **do not push**. Instead, add a note under **Blocked** in `ROADMAP.md`, commit only
   that note, and stop.
4. Check the item off in `ROADMAP.md` (move it to **Done** with today's date), and add 1 or 2
   new ideas to **Ideas** if any came up.
5. If you changed `styles.css` or any `.js` file, bump the `?v=` number on their `<link>`/`<script>`
   tags in **every** HTML page (same value everywhere, e.g. `?v=20261013-1`), so visitors' browsers
   load the new files instead of old cached ones. The test checks all pages match.
6. Add an entry at the top of `CHANGELOG.md`: the date, what changed, and why, in plain
   language for a non-programmer.
7. Commit with a clear message and push to `main`.
