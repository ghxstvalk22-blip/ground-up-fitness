# Changelog

Newest changes first. Each daily update adds an entry here.

## 2026-10-12 (owner requests)

- **Calmer page changes:** links fade between pages with a thin loading bar, and every inner page shows a "Home / Page" trail so nobody gets lost. The moving exercise bar on the home page was replaced with a calm, readable strip.
- **Cardio:** a new Cardio plan, more cardio exercises, and a cardio log (minutes, distance, pace) that counts toward the 150 minutes a week health guidelines recommend.
- **My progress page:** pick "strength" or "endurance" and it projects where each lift should go next, with charts for lifts, cardio, and bodyweight.
- **Plans change every month too:** training runs in 4-week waves (Build, Push, Heavy, Recover) based on research showing planned variation beats doing the same thing every week.
- **For men and women:** two new plans anyone can use, **Glutes & legs focus** and **Upper body focus** (3 or 4 days), plus two new glute exercises. "Make it yours" has an optional sex setting that fills in the calorie estimator. Lighter upper-body lifts now go up in smaller steps (2.5 lb instead of 5), which matters most for newer lifters. A new Gym basics answer explains, with a research link, why men and women can follow the same plans.
- **New plans from trusted sources:** **Couch to 5K** (the NHS's 9-week walk-to-run plan; the page shows the right runs for your week), **Tiered strength** (based on the popular free GZCLP program by coach Cody LeFever), and a **Muscular endurance circuit** (lighter weights and higher reps, following the American College of Sports Medicine guidelines). Each one says what it's based on, with a link. The Programs menu now shows all 14 plans in two columns.
- **Supplements guide (new page, under Gym basics):** starts with "you don't need any," then covers the few with good research (protein powder, creatine, caffeine with care), what to skip (fat burners, test boosters, BCAAs, SARMs), how to buy safely (NSF Certified for Sport, Informed Sport, and the military's Operation Supplement Safety list), and plain links to Vitamin Shoppe and GNC. No affiliate links; every claim links to its source, with a see-your-doctor note.
- **Accounts, ready to switch on:** the code for free sign-in (Google or email) is in place. Once the owner adds the Firebase settings, everything you log syncs to your account and merges when you sign in on a new device, without overwriting anything. Until then, nothing changes: data stays on your device, and the My progress page says so.
- **Rewards:** beating your best lift or cardio session pops up a "New personal record" message, your weekly streak (2+ active days a week) is counted, and 12 milestones can be earned on My progress.

## 2026-10-12 (overnight, continued)

Going through the site as different visitors and fixing what each one would want:

- **A nervous first-timer:** the Start page now walks through your whole first gym visit (with a gym-bag checklist), a 5-minute warm-up, and a plain-English list of gym words.
- **Someone mid-workout:** tap any rest time to start a countdown that buzzes and beeps when rest is over. A "Today's workout" button jumps straight to the day that's up next, and plan details fold away on phones so the workout is closer.
- **Someone stuck on a movement:** a new Exercise library page lets you search all 103 exercises or filter by muscle, each with its how-to.
- **Someone coming back:** the Programs page remembers your plan, marks the day that's up next, and the home page offers "Continue: your plan".
- **Someone losing weight:** a weight trend tool shows your 7-day average and weekly change, with a gentle note if you're losing faster than recommended.
- **More plans:** Build muscle (3-day full body), No gym needed (home, no equipment), Short on time (2 days), and Dumbbells only (3 or 4 days). Home and dumbbell plans only rotate into exercises you can do with that equipment.
- **Getting around:** every page ends with "Where to next?", and the Gym basics answers link to the right plan or tool.
- **Sharing the link:** links now show a title, description, and photo when you text them, and the site has its own icon.
- **At the gym on paper:** "Print this week" makes a clean two-column sheet with blanks to write in your sets.
- **Fixes:** the menu ran off the screen on some laptops once the real font loaded (fixed, and the tests now check with the real font); the contact form now says it's still being set up instead of failing when you press Send; corners and arrows are consistent everywhere. An accessibility check (axe) found no problems on any page in light or dark mode.

## 2026-10-12 (overnight rebuild)

- **Every menu tab is now its own page.** Clicking Programs, Pros, Tools, and so on opens that page instead of scrolling down the home page.
- **New look and front page.** Black, white, and bone with one orange accent, big condensed headlines, and black-and-white gym photos (free Unsplash photos, credited in the footer). The home page now speaks directly to people who are nervous about starting.
- **"How to" for every exercise.** Tap How to on any exercise for setup, step-by-step form, the one cue that matters, common mistakes, easier and harder versions, and a button that opens YouTube demos. 97 exercises were covered at first (103 now).
- **Workouts change every week.** Accessory exercises rotate weekly between moves that train the same muscles, and main lifts change every 4 weeks (beginner plans change every 4 weeks). Each plan can be put together thousands to billions of ways. A Swap button changes any exercise on the spot, which helps when a machine is taken. This follows the research: planned variety keeps training fresh, but changing the main lifts too often slows strength gains.
- **Three new plans:** No gym needed (3 days at home, no equipment), Short on time (2 gym days under 45 minutes), and Dumbbells only (3 or 4 days). Home and dumbbell plans only rotate into exercises you can actually do with that equipment. The quick start on the home page has two new choices: "Not ready for a gym" and "Short on time."
- **Personal targets and projections.** Log your sets on any exercise, including past workouts, and the plan tells you what to lift next time. A new "Where you're headed" chart projects your progress over the next 8 weeks. "Make it yours" tailors Classic Physique to your experience and the muscle you want to bring up. Everything stays on your device, and you can download your log.

## 2026-10-12

- **New front page.** A bolder design with a "Get your plan" quick-start card: pick a goal and how many days you can train, and it takes you straight to that plan. A moving band of exercise names runs along the bottom, and the numbers (programs, plans, tools) now count themselves, so they're always right.
- **New "Train like a pro" section** (and a **Pros** menu). Six habits that Olympia champions and record-holding lifters share, each linked to the part of the site that helps you start. It includes an honest reality check about comparing yourself to pros.
- **"Learn from the pros" links** to the official channels of Chris Bumstead, Ronnie Coleman, Jeff Nippard, Renaissance Periodization, and Stefi Cohen. These are links only. No quotes are put in their mouths, and the site isn't affiliated with them.
- **New Classic Physique program**, a bodybuilding split in 4-day and 5-day versions. The days picker now has a 5-day option and greys out day counts a program doesn't offer.
- The menu stays on one line on mid-size screens like small laptops and tablets.

## 2026-10-11

- Launched Ground Up Fitness: three starting paths (lose weight, get stronger, brand new), a program builder with six plans and a weekly checklist, a calorie estimator, a one-rep max calculator, a plate loader, a Gym basics FAQ, and a contact form.
- Set up the daily automatic update, the idea list (`ROADMAP.md`), and a browser test that has to pass before any change goes live.
