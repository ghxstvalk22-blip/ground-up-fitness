# Changelog

Newest changes first. Each daily update adds an entry here.

## 2026-10-12 (Build your own workout)

- New **Build your own workout** on the Plans page (and linked from the front cover): search or filter the exercise library by muscle and equipment, tap **Add**, and set the sets, reps, and rest for each exercise. Reorder or remove anything, give it a name, then **Save and start**.
- **Every exercise gets a real weight to use.** The first time, it comes from your level and bodyweight ("Start with about 150 lb"), and it changes with the reps you pick (fewer reps, heavier weight). Once you log your sets, it's based on what you actually lifted and goes up when you hit your reps on every set. Bodyweight moves and holds say so, and cardio gets a pace to aim for.
- Starting weights now cover machines, cables, and smaller moves too (leg press, lat pulldown, curls, raises and more), marked "about" since machines differ. Dumbbell weights round to sizes gyms actually have.
- **Pick what it's for:** Build muscle, Get stronger, Lose fat / get fit, or Endurance. Sets, reps, rest, and weights follow the goal.
- **Smart limits per muscle.** Research shows muscle growth levels off around 6 to 11 hard sets for one muscle in a workout, and strength gains after a few heavy sets, so the builder suggests 2 to 3 exercises for big muscles and 1 to 2 for small ones (fewer when you train several muscles in one session, and 6 to 8 exercises in all). A running count shows "Chest 2 of 3 exercises · 6 sets". You can still add more ("Add anyway"), and it explains why it's more than you need.
- It saves as **My workout**, the same place Fitness Coach workouts go, with a weight target on each lift. Your unfinished workout is kept while you build it.

## 2026-10-12 (Full check-up fixes)

- A full check-up of the site: every page on computer and phone, in light and dark mode, for accessibility problems, script errors, and sideways scrolling (all clear); every link and jump link (all work); offline use in the phone app (works); and real visitor journeys with odd inputs.
- Fixed: the workout log no longer saves typos like a negative weight or 999 reps. It tells you which set to check instead. Cardio minutes over 600 or a negative distance are caught too.
- Fixed: Fitness Coach (built-in answers) now understands everyday exercise names, so "how do I do a squat?" or "pushups" gets the how-to instead of "I didn't quite get that". A how-to question about an exercise it doesn't know now points to the exercise library.
- Fixed: "legs at home with dumbbells" now builds a dumbbell workout instead of bodyweight only.

## 2026-10-12 (Exercise library pictures)

- Every card in the exercise library now has a picture: the body zoomed in on the muscles that exercise works, with the main muscles in orange and the helpers in a lighter orange (front or back view, whichever shows them best). The muscle group sits on the picture, and the equipment icon and name sit right under it.
- The pictures are drawn from the same anatomy art as the muscle map, so they load fast, look the same in light and dark mode, work offline in the phone app, and new exercises get one automatically. On phones they're a little shorter so you can scroll faster.

## 2026-10-12 (Simpler menus)

- Took **Pros** and **Gym basics** off the top menu and the footer, and removed the "Train like a pro" band from the home page, so the menu only shows what people use most: Start here, Programs, Exercises, Tools, Contact, and My progress.
- The pages themselves are still there, so links from other pages and old bookmarks keep working, and the site search still finds them and every question on them.

## 2026-10-12 (Pick your level, get your starting weights, and see what each exercise needs)

- **Pick your level on the front cover.** Beginner, Intermediate, Advanced, or Expert, right under the headline. The whole site follows it.
- **Your starting point** (home page and My progress): pick your level and add your bodyweight (and sex, if you like). You'll see your starting weights for bench, squat, deadlift, and overhead press, and every plan now suggests a starting weight for each lift the first time ("Start with about 140 lb, from your level and bodyweight"). A higher level gives heavier weights, so it pushes you. Once you log a set, your real numbers take over. The Fitness Coach uses them too.
- **An equipment icon next to every exercise**: bodyweight, dumbbells, barbell, machine, cable, or cardio, in plans, the exercise library, and Fitness Coach workouts.
- **Exercise library:** a new Equipment filter. Pick "Dumbbells" to see everything you can do with dumbbells (plus bodyweight moves).
- **Training at home:** home plans now ask "What do you have?" Nothing, or Dumbbells. One tap switches between the No gym needed and Dumbbells only plans. The cover's "Train at home" says "With or without dumbbells".
- Everything here also shows in the phone app on its next open. Starting weights are estimates from common strength standards, set on the light side; nothing leaves your device.

## 2026-10-12 (A clearer front cover)

- The front cover keeps its photo and big headline, but now gets people going in one tap. **What do you want to do?** offers six choices (Brand new, Lose fat, Build muscle, Get stronger, Train at home, Not sure?) that open the right plan or guide.
- **Or just ask the Fitness Coach:** a box right on the cover. Type something like "legs, 30 minutes" and the coach opens with the answer.
- On computers the headline sits on the left and the choices on the right, so everything fits on the first screen. On phones they stack, with big tap targets.
- Returning visitors still get their **Continue** button at the top. The plan and how-to counts moved to the strip under the cover.
- Works the same in the phone app added to the home screen; it picks up the change on the next open.

## 2026-10-12 (Fitness Coach AI costs less)

- Fitness Coach now uses Claude Haiku, Anthropic's low-cost model: about a twentieth of a cent per answer instead of about a cent. Its instructions now tell it to answer exactly what was asked first, stick to well-established advice, say so when something depends on the person, and keep answers focused. It also sends less of the past conversation with each question, which saves more.

## 2026-10-12 (Fitness Coach AI switched on)

- Fitness Coach is now connected to Claude through the site's own Cloudflare server, so it can answer complex questions and build detailed plans. The API key stays on that server, never in the website. If the AI can't be reached, the built-in coach still answers.

## 2026-10-12 (Fitness Coach can use real AI)

- Fitness Coach can now be switched to **Claude**, an AI made by Anthropic, so it can read any question, think it through, and answer like a real coach: full weekly plans, complex questions ("45 minutes, 3 days a week, lose fat and keep my strength"), and follow-ups that remember the conversation. While it works, it shows what it's doing ("Reading your question…", "Thinking it through…").
- Workouts in its answers still get the **Start this workout** button, and only real exercises from the site's guides are kept.
- It stays safe: pain and under-18 questions still get the built-in safety answers, the AI follows the site's health rules, and its answers can only link to this site's own pages.
- It's off until the owner sets it up (steps in `coach-ai/README.md`). The API key lives on a small Cloudflare server, never in the website. When it's on, the coach says so, and only what you type in the chat is sent; your logs stay on your phone. If the AI can't be reached, the built-in coach answers instead.

## 2026-10-12 (Clear my progress)

- New **Clear my progress** box at the bottom of the My progress page. Tick what you want to clear: your lifting log and personal records, cardio, bodyweight entries, plan progress, the Fitness Coach chat and lift numbers, or your settings. Each one shows how much is saved, so you know what you're deleting.
- Logs are ticked by default and settings aren't, so starting over doesn't reset your level or units unless you choose to.
- Nothing is deleted until you confirm, and an **Undo** button brings everything back as long as you're still on the page. Only this device is changed.
- The Plans page links to it ("Clear other progress"), and searching "clear" finds it.

## 2026-10-12 (Fitness Coach gives sets, reps and weights)

- Fitness Coach now works out what you're asking before it answers, and shows it at the top of each reply under **What I heard** (for example: Bench press · Get stronger · Beginner · bench max about 275 lb), so you can see it understood you.
- It reads your goal. "Get stronger" gives heavy, low-rep sets (like 4 × 4–6 with 3 minutes rest), "build muscle" gives moderate sets (8–12 reps), and "tone" or "endurance" gives lighter, higher-rep sets.
- Ask about one lift ("I want to get stronger at bench", "how much should I squat?") and you get that lift first with exact sets and reps, the exercises that help it most, how often to train it, and when to add weight.
- Tell it your numbers ("I bench 275", "I can squat 315 for 3", "3x5 at 100kg on deadlift") and it works out your max and gives a weight for each set, for example **3 × 5 at 230 lb**. Helper lifts get a starting guess (like "about 60 lb each hand") that you can adjust after the first set. Your numbers are saved only on your device and are used in every workout after that, along with lifts you've logged.
- When you tap Start, the weights carry over to My workout on the Plans page.

## 2026-10-12 (Fitness Coach understands how hard you want it)

- Fitness Coach now understands how hard you want to train. "Super challenging", "put me to the test", "brutal" or "beast mode" builds a real Expert session: barbell lifts and pull-ups instead of machines, heavier sets with longer rests, more exercises, and a finisher (pause reps and a drop set). "Easy", "gentle" or "I'm tired" builds a lighter one.
- You can name a level ("set it for expert", "make it intermediate") or say "harder" or "easier", including after a workout is built. This only changes that one workout; your level for the rest of the site stays the same.
- You can change a workout after it's built: "add abs" adds muscles, "without legs" takes them out.
- Small typos ("excerise", "sholders") are understood, and "30 minutes" on its own builds a full-body workout.
- Harder workouts include a short safety note: warm up, use a spotter or safety pins, and stop a set when your form slips.

## 2026-10-12 (Fitness Coach takes a moment)

- Fitness Coach now shows a typing indicator and takes about 1 to 2 seconds to "read" your message before answering (longer messages take a little longer), so it feels like a conversation instead of an instant wall of text.
- New Gym basics answer: **Who can see my workouts and logs?** Only you: everything is saved on your own device and never sent anywhere.

## 2026-10-12 (Fitness Coach keeps your chat)

- Coach is now called **Fitness Coach**, with a barbell icon.
- **Your chat is saved** on your device and comes back on every page, including the last workout it built, so "make it shorter" or "Start this workout" still work after you move around the site. A **Clear chat** button starts over.
- **It stays open as you move around:** if the chat is open and you tap a link or a tab, it's still open on the next page. On phones, where the chat fills the screen, following a link from inside the chat (like a plan or Start this workout) closes it so you can see the page, and your conversation is kept.
- Saved chats are checked when they're loaded back, so tampered data can't run code.

## 2026-10-12 (Coach)

- **New: Coach**, a chat helper on every page (the robot button, bottom right). Tell it what you want to train in your own words, like "shoulders, back and abs", "30 min legs, no equipment", or "upper chest and side delts with dumbbells", and it builds a workout from the site's exercise guides, set for your level.
- Tap **Start this workout** and it opens as **My workout** on the Plans page, where you can log sets and use the rest timer like any plan.
- Follow-ups work too: "make it shorter", "harder", "no equipment", "different exercises". It also answers "how do I do a deadlift?", "what do glutes do?", and "what plan should I do to lose weight?"
- **Safe by design:** if you mention pain or an injury, Coach tells you to see a doctor or physical therapist and won't train that area. Food questions go to the calorie tool and a registered dietitian. It's a built-in helper, not a person or an AI service, and nothing you type leaves your phone.

## 2026-10-12 (works like a phone app)

- **Add it to your home screen:** Ground Up can now be installed like an app, free, from Safari (Share, then Add to Home Screen) or Chrome. It gets its own icon, opens full screen without the browser bars, and stays clear of the notch.
- **Works offline:** after your first visit, pages, plans, and how-tos open even with no signal in the gym.
- **Built for thumbs:** on phones there's a tab bar along the bottom (Home, Plans, Exercises, Progress). Every button is now big enough to tap easily, and form fields no longer make iPhones zoom in.
- From the second visit, phones get a one-time tip on how to add it to the home screen ("Not now" hides it for a month). Gym basics has the steps too.

## 2026-10-12 (fresh files after updates)

- Visitors' browsers now always load the newest version of the site's code after an update, instead of sometimes showing an old saved copy (or mixing old and new). Each update bumps a version number on the shared files.

## 2026-10-12 (your level)

- **One setting now shapes the whole site: Your level** (Beginner, Intermediate, Advanced, Expert). It's at the top of the Programs and Exercises pages and inside every how-to, and it's saved on your device. Everyone starts at Beginner.
- **More plans as you go up:** Beginner shows 5 simple plans (New to lifting, Lose fat, No gym, Short on time, Couch to 5K). Intermediate adds 4, Advanced adds 4, and Expert adds Classic Physique and a new **Push / pull / legs** 6-day split, 15 in all.
- **More detail as you go up:**
  - How-tos: Beginner gets the setup, steps, one key tip, and an easier version. Intermediate adds common mistakes and a harder version. Advanced adds form cues and swaps. Expert adds programming notes (reps and rest for strength, muscle, or endurance, how to progress, and advanced techniques).
  - Plans: Beginner sees when to train and how hard to push. Intermediate adds "How this plan works" and "Make it yours". Advanced turns on the 4-week training waves (Build, Push, Heavy, Recover).
  - Muscle map: Beginner sees each muscle's best exercises. Intermediate adds each head and part. Advanced adds the anatomy names.

## 2026-10-12 (simpler for beginners)

The site had grown a lot in one day, so this pass makes it calmer for someone brand new, without removing anything:

- **Programs:** starts with just 4 goals (New to lifting, Lose fat, Build muscle, Get stronger). The other 10 plans are behind "More plans", each tagged Beginner, Intermediate, or Advanced. Two plans got plainer names: "Next-level strength" (based on GZCLP) and "Light weights, high reps".
- **Less on screen at first:** "How this plan works" is folded, and the training waves, weekly challenge, and variety count appear once you're past week 1 or have logged a workout.
- **Menus:** every dropdown has 5 links or fewer. The Programs menu shows the 4 main plans plus "All 14 plans". Anything taken out of a menu is still in search (press /).
- **Exercises:** the exercise library comes first; the muscle map sits below it ("Find exercises by muscle"). Picking a muscle shows its best exercises first, with the head-by-head breakdown one tap away.
- **My progress:** streaks, personal records, and milestones appear after 3 logged workouts.

## 2026-10-12 (muscle map: every head)

- **Every muscle now shows its heads and parts**, on the same body drawing. Pick a muscle and the panel lists each part with what it does and the best exercises for it; tap a part (on the body or in the list) and it lights up red while the rest of that muscle turns pink:
  - Chest: upper, middle, lower. Shoulders: front, side, rear delt. Traps: upper, middle, lower.
  - Biceps: outer (long) head, inner (short) head, brachialis. Triceps: long, lateral, medial heads. Forearms: inner and outer.
  - Abs: upper and lower. Glutes: glute max and outer glute (medius). Quads: outer, middle, inner (teardrop). Hamstrings: outer and inner. Calves: inner head, outer head, soleus.
- Picking a muscle turns the body to the side that shows the most of it.

## 2026-10-12 (pro habits: how to start)

- **Each of the six "Train like a pro" habits now has a "How to start" guide.** Tap it on the Pros page and it opens into 3 or 4 plain, practical steps for a beginner, plus the most common mistake to avoid (for example, how to add weight without wrecking your form, or how to keep training when a week gets busy).
- **Why:** the habits explained *what* champions do, but not what a beginner should actually do this week. Now each one does.
- The food guide reminds people to check with a doctor or registered dietitian before changing how they eat if they have a health condition. Links straight to a guide (like `pros.html#guide-food`) open it automatically.

## 2026-10-12 (muscle map, new artwork)

- **The muscle map has a real anatomy figure now**, replacing the simple mannequin. Muscles have their true shapes, and the multi-part muscles show their separate heads: the three heads of the shoulder (front, side, and rear are each their own pick), the triceps' heads, the quads, the hamstrings, and the two-headed calves. The chest splits into upper and lower.
- **Male and female bodies:** a toggle under the buttons switches between them (it starts on Female if you picked that in "Make it yours").
- **Spinning:** drag it with a mouse or finger and it turns in 3D, then settles on the front or back. The buttons still work too.
- The artwork comes from MuscleMap, a free (MIT-licensed) set of body drawings, credited under the figure.

## 2026-10-12 (security)

- **Locked down the site.** Every page now tells browsers to only run code from this site (a "Content Security Policy"), blocks old-style plugins, and doesn't leak page addresses to other sites.
- **Fixed a weak spot:** tampered saved settings on someone's own device could have put unwanted code on the Programs and My progress pages. Settings are now checked against a list of allowed values.
- **The automatic test now attacks the site before every update:** it tries to inject code through saved data and links, checks every page's security policy, makes sure new-tab links are safe, and scans for leaked passwords or keys. If any of that fails, nothing goes live.
- Added `firestore.rules` (account data rules, ready for when accounts are switched on) and `SECURITY.md`.

## 2026-10-12 (muscle map)

- **New: Muscle map** at the top of the Exercises page (also in the Exercises menu). Drag the body with your mouse or finger to spin it all the way around, or tap Front, Side, or Back. Point at or tap a muscle and it lights up red. Next to the body you'll see what that muscle does, the best exercises for it (tap one for the how-to), and a beginner tip. It covers 21 muscle groups: upper chest, chest, front/side/rear shoulders, traps, upper back, lats, lower back, biceps, triceps, forearms, abs, obliques, glutes, outer hips, quads, inner thighs, hamstrings, and calves. There's also a list of every muscle for people who prefer not to drag, and it works with a keyboard.
- Added a how-to guide for the hip adduction (inner thigh) machine.

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
