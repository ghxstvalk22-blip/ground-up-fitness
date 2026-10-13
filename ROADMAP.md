# Roadmap

Add an idea anywhere under **Up next** and the daily update will build it, top item first.
Write it in plain words, like `- [ ] Add a page about stretching before workouts`.

## Up next

Owner priorities (2026-10-12): more workout plans, more ways to move around the site, a site people
actually use (personal, beginner-friendly, not "AI-looking"), in a YoungLA / DFYNE / Gold's Gym style.

From the 2026-10-13 phone walkthroughs (four testers playing real gym-goers), still to do, most important first:

- [ ] My progress counts the same way everywhere: Overview, milestones, and Lifts should count finished workouts like the Log tab does (testers saw "1 workout this week" next to "2 workout days, 20 sets"), and best-lift numbers should match between Overview and Lifts (1 lb rounding differences; show "+20 lb" with the unit).
- [ ] Home page for returning users: open with Up next / Continue and fold Your starting point once it's filled in.
- [ ] Editing a day: show Your workout and the muscle check first and fold the 136-exercise list behind "+ Add exercises".
- [ ] Beginner "Your best lifts": show the heaviest set actually lifted ("25 lb × 15"), with estimated max from Intermediate up.
- [ ] Swap shows a short list to pick from (same muscles and equipment, with your last weight for each), and every exercise gets Swap. Today it replaces blindly in one tap.
- [ ] After the plan changes exercises (every 4 weeks for beginners), base the first weight on the exercise it replaced, and show "Replaces Leg press (last 95×10)".
- [ ] Your plan: an Undo message after removing a day (today it's a confirm box). (Moving days up/down is done.)
- [ ] Fitness Coach: when someone says "dumbbells" or "at home", build without bench moves, and Start this workout should land on the day's exercises.
- [ ] Beginner Progress shows "heaviest set" instead of estimated one-rep maxes; estimated max only for the big lifts.
- [ ] Next target uses the number of sets you actually did, not the plan's set count.
- [ ] Calorie tool fills in weight and sex from Your starting point; a small weigh-in box and trend on My progress.

## Ideas

- [ ] Protein food guide: common foods and roughly how much protein a typical serving has.
- [ ] Import a downloaded workout log (CSV) so people can move to a new phone. Export already exists.
- [ ] More exercise variety: add guides for more machine and cable variations so the weekly rotation has even more options.
- [ ] Muscle map: link each muscle to a ready-made plan that focuses on it, and let people pick muscles to build a custom workout.
- [ ] Couch to 5K: a "Repeat this week" button, since repeating a week is a normal part of the plan.
- [ ] Tiered strength (GZCLP): a 3-day option that rotates through the 4 workouts, like the original.
- [ ] Accounts: once Firebase is set up, show a small "Signed in" marker in the header on every page.
- [ ] Habit check-in: a small weekly checklist on My progress for the six pro habits (logged sets, trained on planned days, slept 7+ hours most nights) to show which habit to work on next.
- [ ] Link the "Train like a pro" box on the home page to a random habit's "How to start" guide, so returning visitors see a new tip.
- [ ] Light week reminder: after about 6 to 8 straight weeks of logged training, gently suggest a light week in the week bar.
- [ ] Show "Light week" on the Your plan bar and the My progress dashboard when the current week is a light week.

## Blocked

(Nothing yet.)

## Done

- [x] 2026-10-13: Light week (deload): a "Make this a light week" button in the Programs week bar halves the sets and suggests about 10% lighter weights for that week only; tap again to undo. Not shown on Couch to 5K, where repeating a week does the same job.
- [x] 2026-10-12: Pro principles deep dives: each of the six "Train like a pro" habits on the Pros page has a "How to start" guide that opens into practical beginner steps and a common mistake to avoid.
- [x] 2026-10-12: Muscle map on the Exercises page: spin the body by dragging (mouse or finger) or with Front / Side / Back buttons; point at or tap any of 21 muscles to highlight it in red and see what it does, the best exercises (with how-tos), and a beginner tip.

- [x] 2026-10-12 (owner requests): accounts code (Firebase; switches on when the owner adds the config), supplements guide, Couch to 5K / Tiered strength (GZCLP) / Muscular endurance circuit plans with source credits, Glutes & legs and Upper body focus plans, sex setting and smaller jumps on light lifts, rewards (PRs, streaks, milestones), 4-week training waves, My progress page, cardio logging, calmer page transitions, and a calmer home page.

- [x] 2026-10-12 (overnight): Build muscle plan (3-day full body); the quick start's "Build muscle" now opens it instead of the advanced Classic Physique split.
- [x] 2026-10-12 (overnight): link previews and a site icon for sharing; Gym basics answers link to the right plan, tool, or guide; "Print this week" gives a two-column gym sheet with blanks to write in sets.
- [x] 2026-10-12 (overnight): "Where to next?" row at the bottom of every page (set in `NEXT_STEPS` in script.js).
- [x] 2026-10-12 (overnight): three new plans: No gym needed (home, bodyweight, 3 days), Short on time (2 days), and Dumbbells only (3 or 4 days). Home and dumbbell plans only rotate into exercises their equipment allows. 6 new exercise guides (103 total).
- [x] 2026-10-12 (overnight): weight trend tracker on the Tools page (7-day average, weekly change, gentle caution on fast loss).
- [x] 2026-10-12 (overnight): Programs page remembers your plan, marks the day that's up next, and the home page offers "Continue".
- [x] 2026-10-12 (overnight): exercise library page with search and muscle filters; Exercises menu.
- [x] 2026-10-12 (overnight): rest timer on every exercise.
- [x] 2026-10-12 (overnight): Start page first-day guide with a gym-bag checklist, 5-minute warm-up, and gym glossary.
- [x] 2026-10-12 (overnight): workout log with next-session targets, progress chart with 8-week projection, CSV export, and "Make it yours" settings that tailor Classic Physique.
- [x] 2026-10-12 (overnight): weekly exercise rotation (accessories weekly, main lifts every 4 weeks), week navigation, and Swap.
- [x] 2026-10-12 (overnight): "How to" guide for all 97 exercises with a YouTube demo search.
- [x] 2026-10-12 (overnight): one page per menu tab, shared header and footer, new brand-style look and home page; Programs and Gym basics dropdowns list every plan and question.
- [x] 2026-10-12: New front page with a quick-start plan picker, a "Train like a pro" section with links to pro athletes' official channels, and the Classic Physique program (4 and 5 days).
- [x] 2026-10-11: Launched the site with Start here paths, the program builder, three tools, Gym basics, and the contact form.
