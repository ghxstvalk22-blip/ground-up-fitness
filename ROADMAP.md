# Roadmap

Add an idea anywhere under **Up next** and the daily update will build it, top item first.
Write it in plain words, like `- [ ] Add a page about stretching before workouts`.

## Up next

Owner priorities (2026-10-12): more workout plans, more ways to move around the site, a site people
actually use (personal, beginner-friendly, not "AI-looking"), in a YoungLA / DFYNE / Gold's Gym style.

From the 2026-10-13 phone walkthroughs (four testers playing real gym-goers), still to do, most important first:

(Nothing queued. The daily run picks from Ideas.)

## Ideas

- [ ] Import a downloaded workout log (CSV) so people can move to a new phone. Export already exists.
- [ ] More exercise variety: add guides for more machine and cable variations so the weekly rotation has even more options.
- [ ] Muscle map: link each muscle to a ready-made plan that focuses on it, and let people pick muscles to build a custom workout.
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
- [ ] Lifts tab: for smaller lifts (curls, raises), show the heaviest set instead of an estimated max, like "Your best lifts" now does.
- [ ] Log form: a small "Warm-up" tick on a set, so warm-ups are marked for sure instead of guessed from the weight.
- [ ] Editing a day: a short "Suggested for this day" list (3 or 4 exercises for muscles the day misses) above the full exercise list.

- [ ] Lifts chart: mark the session "Now" comes from (a ring on its dot) when it isn't the latest one.
- [ ] Home page bodyweight line: when someone has been at their goal weight for a few weeks, a small "Set a new goal?" link to the Bodyweight card.
- [ ] Bodyweight card: a short "Your pace" note when the weekly change has been faster than a safe pace for two weeks in a row, pointing to a doctor or registered dietitian.
- [ ] Log tab: a small "Morning / Afternoon / Evening" summary of when you usually train, once there are a few weeks of timed workouts.
- [ ] Couch to 5K: on My progress, a small "Weeks repeated: 1" note so people see repeating is normal and still counts.
- [ ] Couch to 5K "You did it" card: a "Keep running" button that sets up 3 easy 30-minute runs a week as Your plan.
- [ ] Home page Up next card: a small "You finished Couch to 5K" line once the plan is done, linking to the next-steps card.
- [ ] Goal weight: when the goal is reached, offer a one-tap "Hold steady" that switches the safe-pace note to keeping weight within a small range.
- [ ] Protein foods list: a "kg / lb" note or metric-first servings for people who set kg in Your starting point.
- [ ] Fitness Coach: when someone asks for a high-protein snack or breakfast, offer two or three quick ideas from the protein foods list.
- [ ] Protein foods list: a "Back to top" link after the last group, so phone users can get back to the Jump to row.

## Blocked

(Nothing yet.)

## Done

- [x] 2026-11-09: Protein foods list: a "Jump to" row (Meat and fish, Eggs and dairy, Plant foods, Carbs) at the top of the list on Gym basics, so phone users can skip straight to the group they want. Links to a part inside a closed answer now open that answer too.
- [x] 2026-11-08: Fitness Coach: asking which foods have protein ("what foods are high in protein?", "how do I get more protein?") gets a short answer with everyday protein foods and a link straight to the protein foods list on Gym basics, plus the calorie tool and a doctor-or-dietitian note. Other protein questions link the list too, and when the AI coach answers a protein foods question, a link to the list is always added at the end.
- [x] 2026-11-07: Protein in common foods: a new "Which foods have the most protein?" answer on Gym basics lists about 20 everyday foods (meat and fish, eggs and dairy, plant foods, everyday carbs) with a typical serving and its grams of protein, an easy sample day, and a see-a-doctor-or-dietitian note. The protein answer links to it, and the calorie tool now shows protein per meal (split over 4 meals) with a link to the list.
- [x] 2026-11-06: Couch to 5K: once all of week 9's runs are checked off (or the calendar has moved past week 9), the week bar on the Plans page shows a "You did it" card with next steps (keep 3 runs a week, add a few minutes at a time, or try the Cardio plan, with a button to it). The "Repeat a week" button steps aside once the plan is done.
- [x] 2026-11-05: Couch to 5K: when a week is being repeated, the home page's Up next card, the Your plan bar, and the Active tab on My progress say "Week 3 again" (the plan's own week), matching the Plans page, instead of the calendar week number.
- [x] 2026-11-04: Couch to 5K: a "Repeat week 3 instead" button in the week bar (from week 2 on) gives you the week before's runs again; the week shows as "Week 3 again", the plan steps up a week later, and checkmarks start fresh. Tap again (Undo) to put the plan back on schedule. The Your plan bar shows the right week too.
- [x] 2026-11-03: Log tab on My progress shows the time of day each workout was done next to its date ("Tue, Nov 3 · 6:40 pm"), from when its first exercise was saved; older logs without a saved time show just the date.
- [x] 2026-11-02: Home page Up next card: the bodyweight line also shows this week's change with an arrow and words ("▼ Down 1.5 lb a week", or "Steady this week"), the same number as the Bodyweight card, while your last weigh-in is under a week old.
- [x] 2026-11-01: My progress "This week" bodyweight tile shows the weekly change under the 7-day average with a down/up arrow and words ("▼ 1.1 lb a week", or "Steady this week"), matching the Bodyweight card's Weekly change.
- [x] 2026-10-31: My progress "This week" bodyweight tile says when you last weighed in ("Weighed in today", "yesterday", "5 days ago") with a Weigh in link after 4 or more days; if your last weigh-in is over a week old it shows how long ago instead of "Add one". Its links now go to the Bodyweight card on the same page.
- [x] 2026-10-30: Home page Up next card: once your 7-day average is within 1 lb (0.5 kg) of your goal weight, the bodyweight line says "You're at your goal weight" (holding steady is a win too) instead of showing how much is left; its link opens your weight on My progress.
- [x] 2026-10-29: Bodyweight line on the home page's Up next card, for people who already weigh in: "Weigh in today?" when it's been 4 or more days since the last weigh-in, and how much is left to lose or gain to a goal weight (from the 7-day average). A "Weigh in" link goes straight to the Bodyweight card on My progress.
- [x] 2026-10-28: Goal weight on the Bodyweight card (My progress): set an optional goal and see how much is left to lose or gain (from your 7-day average), a progress bar from your first weigh-in, and how long a safe pace takes (0.5 to 1% a week to lose, 0.25 to 0.5% to gain), plus your current pace when you're heading the right way. A goal below a healthy weight for your height (BMI under 18.5) isn't saved and points to a doctor or registered dietitian.
- [x] 2026-10-27: Bodyweight card on My progress (Overview): type today's weight and save; it shows your last weigh-in, 7-day average, weekly change, a small 30-day chart, and the same gentle caution as the Weight trend tool if you're losing fast. Saving a weigh-in (here or in the Weight trend tool) updates your bodyweight in Your starting point, so starting weights and the calorie tool (which already fills in weight and sex) use your latest weight. The "This week" bodyweight number now matches.
- [x] 2026-10-26: Log tab lists a day's exercises in the order you did them (each logged exercise now records when it was first saved; older logs follow the finished workout's order), instead of A to Z.
- [x] 2026-10-25: Lifts tab: "Now" (and the 8-week number) uses your best session of the last 3 weeks, so a light week or a tired day doesn't drop it; endurance reps use that session's working weight. "What are you training for?" starts on your goal from Your starting point (Strength for strength, Endurance for losing fat, otherwise Both) until you pick one.
- [x] 2026-10-24: Next target counts the sets you actually did: lighter warm-up sets don't count as sets done, an extra set past the plan is a bonus and no longer holds the weight back, and sets done lighter than your top weight ask you to do them all at that weight before it goes up.
- [x] 2026-10-23: "Your best lifts" on My progress: from Intermediate up, the estimated one-rep max shows only for big lifts (squat, bench, deadlift, presses, rows and similar); smaller lifts like curls and raises show the heaviest set lifted ("25 lb × 10"). Beginners already saw the heaviest set (2026-10-18).
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
