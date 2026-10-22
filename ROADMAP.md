# Roadmap

Add an idea anywhere under **Up next** and the daily update will build it, top item first.
Write it in plain words, like `- [ ] Add a page about stretching before workouts`.

## Up next

Owner priorities (2026-10-12): more workout plans, more ways to move around the site, a site people
actually use (personal, beginner-friendly, not "AI-looking"), in a YoungLA / DFYNE / Gold's Gym style.

From the 2026-10-13 phone walkthroughs (four testers playing real gym-goers), still to do, most important first:

- [ ] Beginner Progress shows "heaviest set" instead of estimated one-rep maxes; estimated max only for the big lifts.
- [ ] Next target uses the number of sets you actually did, not the plan's set count.
- [ ] Lifts tab: "Now" should use the best recent session, not just the last one (a light week drops it), and "What are you training for?" should start on your goal.
- [ ] Log tab: list a day's exercises in the order they were done, not A to Z.
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
- [ ] When you leave a workout with logged sets but no Finish, offer "Finish it now" on My progress so those sets count.
- [ ] Up next card on the home page: a small "Last time" line (date and best set from your last session of that day).
- [ ] Up next card: when the week is done, show which day starts next week and when.

- [ ] Your best lifts: tap a lift to see its heaviest set from each session as a small list or chart.
- [ ] Swap list: a small "Show more" to reveal other equipment for the same muscle (handy when a machine is taken).
- [ ] Swap: let people pick "swap for every week" as well as "this week only".
- [ ] Swap list: when picking a new exercise, show the suggested first weight (from the one it replaces) next to "New to you".
- [ ] Undo for more actions: clearing this week's checkmarks and turning a light week off could use the same "Undo" message instead of a confirm box.
- [ ] Fitness Coach: when it adds a workout to Your plan, offer "Replace today's day instead" in its reply for people who wanted a swap, not an extra day.
- [ ] Editing a day: a short "Suggested for this day" list (3 or 4 exercises for muscles the day misses) above the full exercise list.

## Blocked

(Nothing yet.)

## Done

- [x] 2026-10-22: Fitness Coach "Start this workout" lands on the day's exercises: the workout is saved in the best order, goes in as today's day of a multi-day Your plan (other days and checkmarks kept) instead of replacing it, and never opens with old checkmarks.
- [x] 2026-10-21: Your plan: Remove day happens right away (no confirm box) and shows a "Day removed" message with Undo, which puts the day, its checkmarks, and swaps back. This week's checkmarks now move with their days when one is removed.
- [x] 2026-10-20: When the plan changes an exercise (the 4-week beginner change, the weekly rotation, or Swap), the new one shows "Replaces Leg press (last 95×10)" and its first weight is worked out from what you last lifted on the old one (a little lighter while you learn it).
- [x] 2026-10-19: Swap shows a short list to pick from (same family first, then the same main muscle and equipment), each with your last weight or "New to you", plus "Put back" for the original. Every exercise with a fitting alternative gets Swap, not just ones in a rotation family.
- [x] 2026-10-18: Beginner "Your best lifts" on My progress shows the heaviest set actually lifted ("145 lb × 6") and how much heavier than the first; estimated max from Intermediate up.
- [x] 2026-10-17: Editing a day opens on Your workout and its muscle check; the full exercise list stays folded behind "+ Add exercises" (tap again to hide it).
- [x] 2026-10-16: Home page for returning users opens with "Welcome back" and an Up next card: today's day of your plan, its first exercises, and Start / Continue (also for your own plan, and when it's paused or the week is done). Your starting point stays folded once filled in.
- [x] 2026-10-14: My progress counts the same way everywhere: Overview, milestones, streaks, and Lifts count finished workouts (and logged cardio) like the Log tab; best-lift numbers use one rounding on Overview and Lifts, and gains show the unit ("+20 lb").
- [x] 2026-10-14: Heavy and light versions of the same lift keep their own targets (by rep range); starting weights a bit lighter for more sets; kg barbell and machine weights in 2.5 kg steps; strong entered lifts count toward the best-fit plan with a one-tap "Set my level"; home trainers see dumbbell starting weights.

- [x] 2026-10-14: Fixes from the second round of phone walkthroughs (beginner, intermediate split, home trainer at 58, advanced strength): progression judged by the plan each session was logged under (heavy and recover weeks no longer stall it), smaller capped weight jumps, next-dumbbell steps, lb/kg switch converts numbers, food questions go to the dietitian answer, home Coach workouts and the no-bench plan skip bench moves and your skip list, ready-made plans say "rest day" instead of swapping in another workout, the Active tab shows this week's real sets, the finish summary uses the plan card's words, checked-off cardio counts, and safer Cancel/Finish.

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
