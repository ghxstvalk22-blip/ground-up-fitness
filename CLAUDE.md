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
| `start.html`, `programs.html`, `pros.html`, `tools.html`, `basics.html`, `contact.html` | One page per menu tab. Each has a photo banner and its own `<body data-page="...">`. |
| `exercises.js` | The exercise library: how-to guides for every exercise (loaded before `script.js`). |
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
- The header, menus, footer, and search dialog are built by `setupLayout()` from `SITE_NAV`.
  Edit menus there, not in the HTML files. New menu links show up in search automatically.
- Each feature must check for its own elements and return quietly on pages without them.
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
3. **Accessible:** real labels on inputs, keyboard support, visible focus, and nothing
   that relies on color alone.
4. **No new external dependencies.** Fonts come from Google Fonts. Photos come from Unsplash
   (free license only, never Unsplash+), loaded from images.unsplash.com, and every photographer
   is added to `PHOTO_CREDITS`. No frameworks, no trackers, no analytics, no ads.
5. **Health content must be safe and mainstream:** evidence-based, beginner-friendly, and
   for healthy adults. No crash diets, no calorie targets below the existing floors
   (1,500 for men and 1,200 for women), no supplements or drugs, no medical claims, and no
   content aimed at minors. Anything about nutrition or injury points people to a doctor
   or registered dietitian when appropriate.
6. **Never** put passwords, API keys, or personal information in the repo. The contact
   form key stays an empty string unless the owner fills it in.
7. **Hero counts update themselves** from `PROGRAMS` and `.tool` panels. When you add a
   program, also add its radio button in the program builder, a tile in the quick-start
   card if it's a main goal, and a link in the Programs menu.
8. **Real people:** never write quotes, tips, testimonials, or endorsements attributed to
   real athletes or coaches, and never use their photos or logos. Linking to their own
   official channels with a factual one-line description is fine, but verify the URL and
   facts first, and keep the "not affiliated" note.

## The daily run, step by step

1. Read `ROADMAP.md`. Take the first unchecked item under **Up next**. If that list is
   empty, pick the most useful item from **Ideas**, or invent a small, clearly useful
   improvement that fits the rules above.
2. Build it with targeted edits.
3. Run the test: `npm install --no-audit --no-fund && node tests/check.js`.
   If it fails, fix the problem and run it again. If you can't make it pass,
   **do not push**. Instead, add a note under **Blocked** in `ROADMAP.md`, commit only
   that note, and stop.
4. Check the item off in `ROADMAP.md` (move it to **Done** with today's date), and add 1 or 2
   new ideas to **Ideas** if any came up.
5. Add an entry at the top of `CHANGELOG.md`: the date, what changed, and why, in plain
   language for a non-programmer.
6. Commit with a clear message and push to `main`.
