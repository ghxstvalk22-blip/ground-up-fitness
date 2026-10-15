/* =========================================================
   BASELINE FITNESS — exercise library

   EXERCISES: one entry per exercise, used by the "How to" guide.
     m        muscles worked
     eq       equipment
     aka      other names people search for (optional)
     setup    how to get in position
     steps    the movement, in order
     tip      the one cue that matters most
     mistakes common errors to avoid
     easier / harder   progressions (optional)
   The demo button searches YouTube for "<name> proper form", so it
   never points at a video that has been taken down.

   kit: what you need. "none" = bodyweight at home, "db" = dumbbells and a
   bench, missing = a regular gym. Home and dumbbell plans only rotate
   into exercises their kit allows.

   EXERCISE_FAMILIES: exercises that train the same thing and can be
   swapped for each other. The weekly rotation and the Swap button pick
   from these. The first name in each family is the "default".
   Big barbell lifts (back squat, bench press, deadlift, overhead press,
   barbell row) are deliberately NOT in a family, so they never rotate:
   strength in those lifts is a skill, and research shows changing them
   often slows progress.

   To add an exercise: add an entry below and, if it can stand in for
   others, add its name to the right family.
   ========================================================= */

const EXERCISES = {
    /* ---------- Squat and quads ---------- */
    "Back squat": {
        m: "Quads, glutes, adductors, lower back", eq: "Barbell and rack",
        setup: "Set the bar at mid-chest height. Step under it so it rests on your upper back, not your neck. Grip just outside your shoulders, stand up to unrack, and take two steps back. Feet about shoulder-width, toes turned out slightly.",
        steps: ["Brace your stomach like you're about to be poked, and take a breath.", "Sit down and back at the same time, pushing your knees out in line with your toes.", "Go as low as you can while keeping your back flat (thighs at least parallel to the floor if you can).", "Drive up through your whole foot, keeping your chest up, and breathe out at the top."],
        tip: "Knees follow your toes, and your weight stays over the middle of your foot.",
        mistakes: ["Knees caving inward on the way up.", "Heels lifting, or weight shifting onto your toes.", "Rounding your lower back at the bottom."],
        easier: "Goblet squat or box squat to a bench", harder: "Pause squat (2-second hold at the bottom)"
    },
    "Front squat": {
        m: "Quads, glutes, upper back", eq: "Barbell and rack",
        setup: "Rest the bar on the front of your shoulders, close to your throat. Use a clean grip with fingertips under the bar, or cross your arms over it. Elbows point forward and high.",
        steps: ["Brace and keep your elbows up.", "Squat straight down between your heels, staying tall.", "Go as deep as you can with an upright chest.", "Stand up, leading with your elbows."],
        tip: "If your elbows drop, the bar rolls forward. Keep them pointing at the wall in front of you.",
        mistakes: ["Elbows dropping.", "Leaning forward and turning it into a good morning.", "Going heavier than your wrists or upper back can hold."],
        easier: "Goblet squat", harder: "Pause front squat"
    },
    "Goblet squat": {
        kit: "db", m: "Quads, glutes, core", eq: "One dumbbell or kettlebell",
        setup: "Hold one end of a dumbbell against your chest with both hands, elbows tucked. Feet a little wider than shoulder-width, toes slightly out.",
        steps: ["Take a breath and brace.", "Sit down between your heels, keeping the weight close to your chest.", "Let your elbows slide inside your knees at the bottom.", "Push the floor away to stand back up."],
        tip: "The weight in front helps you stay upright. Let it pull you into a deep, tall squat.",
        mistakes: ["Letting the dumbbell drift away from your chest.", "Heels lifting off the floor.", "Rushing down instead of controlling it."],
        easier: "Squat down to a bench and stand back up", harder: "Pause at the bottom for 2 seconds, or use a heavier weight"
    },
    "Leg press": {
        m: "Quads, glutes", eq: "Leg press machine", aka: "seated leg press, linear leg press, 45 degree leg press, sled",
        setup: "Sit with your back and hips flat against the pad. Feet shoulder-width on the middle of the platform. Release the safety handles.",
        steps: ["Lower the platform by bending your knees toward your chest.", "Stop before your lower back starts to lift off the pad.", "Press through your whole foot until your legs are almost straight.", "Don't lock your knees hard at the top."],
        tip: "Your lower back stays glued to the seat. That decides how deep you go.",
        mistakes: ["Hips rolling up off the pad at the bottom.", "Snapping your knees straight at the top.", "Bouncing out of the bottom."],
        easier: "Use a shorter range and lighter weight", harder: "Single-leg leg press, or a 3-second lowering"
    },
    "Hack squat": {
        m: "Quads, glutes", eq: "Hack squat machine", aka: "plate loaded hack squat, hack squat machine",
        setup: "Back flat against the pad, shoulders under the pads. Feet shoulder-width, in the middle of the platform. Release the safeties.",
        steps: ["Bend your knees and sit down into the machine.", "Go as deep as you can keep your hips on the pad.", "Drive through your whole foot to stand up.", "Stop just short of locking out."],
        tip: "Feet lower on the platform hit your quads more; higher hits glutes more.",
        mistakes: ["Heels lifting.", "Knees caving in.", "Cutting the depth short to lift more weight."],
        easier: "Leg press", harder: "Pause at the bottom"
    },
    "Smith machine squat": {
        m: "Quads, glutes", eq: "Smith machine", aka: "smith squat",
        setup: "Set the bar on your upper back and step your feet slightly in front of the bar, shoulder-width apart. Unhook the bar by rotating it.",
        steps: ["Brace and sit down, keeping your back against the line of the bar.", "Lower until your thighs are about parallel.", "Push up through your whole foot.", "Re-hook the bar by rotating it when you finish."],
        tip: "Because the bar's path is fixed, put your feet where your knees and hips feel comfortable, usually a little forward.",
        mistakes: ["Feet directly under the bar, which overloads the knees.", "Forgetting where the safety catches are."],
        easier: "Leg press", harder: "Pause at the bottom"
    },
    "Leg extension": {
        m: "Quads", eq: "Leg extension machine", aka: "iso-lateral leg extension, quad extension",
        setup: "Adjust the seat so your knees line up with the machine's pivot point. The pad sits on your lower shins, just above your feet. Hold the handles.",
        steps: ["Straighten your legs to lift the pad.", "Squeeze your quads hard at the top for a second.", "Lower slowly, taking about 2 to 3 seconds.", "Stop just before the weight stack touches down."],
        tip: "Slow on the way down. This one is about the squeeze, not the weight.",
        mistakes: ["Swinging the weight up with momentum.", "Hips lifting off the seat.", "Letting the stack crash down between reps."],
        easier: "Lighter weight, shorter range", harder: "Pause 2 seconds at the top of every rep"
    },

    /* ---------- Single leg ---------- */
    "Walking lunge": {
        kit: "none", m: "Quads, glutes, balance", eq: "Bodyweight or dumbbells",
        setup: "Stand tall with dumbbells at your sides, or no weight to start.",
        steps: ["Take a long step forward.", "Lower your back knee toward the floor, front shin roughly vertical.", "Push through your front foot and bring your back leg forward into the next step.", "Keep walking, alternating legs."],
        tip: "Step long enough that your front knee doesn't shoot way past your toes.",
        mistakes: ["Short, choppy steps.", "Front knee caving inward.", "Slamming the back knee into the floor."],
        easier: "Split squat holding a rail", harder: "Hold heavier dumbbells, or a pause at the bottom"
    },
    "Reverse lunge": {
        kit: "none", m: "Quads, glutes", eq: "Bodyweight or dumbbells",
        setup: "Stand tall, feet hip-width, holding dumbbells at your sides if you're using them.",
        steps: ["Step one foot back about two feet.", "Lower your back knee toward the floor.", "Push through your front heel to return to standing.", "Finish all reps on one side, or alternate."],
        tip: "Stepping back is easier on the knees than stepping forward. Most of your weight stays on the front foot.",
        mistakes: ["Leaning way forward.", "Pushing off the back foot instead of the front one."],
        easier: "Hold a rail or bench for balance", harder: "Deficit reverse lunge (front foot on a small plate)"
    },
    "Bulgarian split squat": {
        kit: "db", m: "Quads, glutes", eq: "Bench, optional dumbbells",
        setup: "Stand about two feet in front of a bench, facing away. Rest the top of your back foot on the bench.",
        steps: ["Lower straight down by bending your front knee.", "Go until your back knee is a few inches off the floor.", "Drive up through your front foot.", "Do all reps on one leg, then switch."],
        tip: "A slight forward lean works your glutes more; staying upright works your quads more.",
        mistakes: ["Front foot too close to the bench.", "Pushing off the back foot.", "Wobbling from going too heavy too soon."],
        easier: "Split squat with both feet on the floor, holding a rail", harder: "Hold dumbbells, or slow 3-second lowering"
    },
    "Step-up": {
        kit: "none", m: "Quads, glutes, balance", eq: "Box or bench, optional dumbbells",
        setup: "Stand facing a sturdy box or bench, about knee height or lower.",
        steps: ["Put your whole foot on the box.", "Push through that foot to stand up on top. Don't push off the floor leg.", "Step down slowly with the other leg.", "Do all reps on one leg, then switch."],
        tip: "Let the top leg do all the work. Your back foot just comes along for the ride.",
        mistakes: ["Bouncing off the bottom foot.", "A box so high your hips shift sideways."],
        easier: "Use a lower step", harder: "Hold dumbbells or use a higher box"
    },
    "Split squat": {
        kit: "none", m: "Quads, glutes", eq: "Bodyweight, optional dumbbells",
        setup: "Take a long stance, one foot forward and one back, like the bottom of a lunge. Hold a rail if you need balance.",
        steps: ["Lower straight down by bending both knees.", "Back knee goes toward the floor.", "Push up through the front foot.", "Finish one side, then switch."],
        tip: "Your feet don't move. It's a lunge without the step, which makes it great for learning.",
        mistakes: ["Stance too short, which loads the knee.", "Leaning forward over the front leg."],
        easier: "Hold a rail and use a shorter range", harder: "Bulgarian split squat"
    },

    /* ---------- Hinge, glutes, hamstrings ---------- */
    "Deadlift": {
        m: "Glutes, hamstrings, back, grip", eq: "Barbell",
        setup: "Stand with the bar over the middle of your feet, feet hip-width. Bend down and grip the bar just outside your legs. Shins touch the bar, hips higher than knees, back flat.",
        steps: ["Pull the slack out of the bar and brace hard.", "Push the floor away with your legs, keeping the bar against your legs.", "Once the bar passes your knees, drive your hips forward to stand tall.", "Lower by pushing your hips back, then bending your knees once the bar passes them."],
        tip: "The bar should drag up your shins and thighs. If it drifts forward, your back takes the strain.",
        mistakes: ["Rounding your lower back.", "Jerking the bar off the floor.", "Leaning back at the top."],
        easier: "Trap bar deadlift or Romanian deadlift", harder: "Pause just off the floor"
    },
    "Dumbbell or trap bar deadlift": {
        kit: "db", m: "Glutes, hamstrings, quads, back", eq: "Dumbbells or a trap (hex) bar",
        setup: "Stand inside a trap bar, or with a dumbbell at each side. Feet hip-width.",
        steps: ["Push your hips back and bend your knees to grip the handles, back flat.", "Brace your stomach.", "Stand up by pushing through the floor.", "Lower under control the same way."],
        tip: "The weight sits at your sides instead of in front of you, which makes it friendlier on the lower back than a barbell deadlift.",
        mistakes: ["Rounding your back to reach the handles.", "Squatting too low, or keeping your legs too straight."],
        easier: "Use lighter dumbbells", harder: "Barbell deadlift"
    },
    "Trap bar deadlift": {
        m: "Glutes, hamstrings, quads, back", eq: "Trap (hex) bar",
        setup: "Stand in the middle of the trap bar, feet hip-width. Grip the handles in the middle.",
        steps: ["Hips back, knees bent, back flat, chest up.", "Brace.", "Stand up by driving through the floor.", "Lower under control."],
        tip: "Think 'push the floor away' rather than 'pull the bar up'.",
        mistakes: ["Rounding your back.", "Hips shooting up before the bar moves."],
        easier: "Use the high handles", harder: "Barbell deadlift"
    },
    "Romanian deadlift": {
        m: "Hamstrings, glutes, lower back", eq: "Barbell",
        setup: "Stand holding the bar at your hips with an overhand grip, feet hip-width, knees slightly bent.",
        steps: ["Push your hips straight back, sliding the bar down your thighs.", "Keep your back flat and your knees soft but fixed.", "Stop when you feel a strong stretch in your hamstrings, usually around mid-shin.", "Drive your hips forward to stand back up."],
        tip: "It's a hip movement, not a back movement. Imagine closing a car door behind you with your butt.",
        mistakes: ["Rounding your back to reach lower.", "Bending your knees more and turning it into a squat.", "Letting the bar drift away from your legs."],
        easier: "Dumbbell Romanian deadlift", harder: "Pause at the bottom"
    },
    "Dumbbell Romanian deadlift": {
        kit: "db", m: "Hamstrings, glutes", eq: "Two dumbbells",
        setup: "Stand holding a dumbbell in each hand in front of your thighs, knees soft.",
        steps: ["Push your hips back, sliding the dumbbells down the front of your legs.", "Keep your back flat and chest proud.", "Stop at the stretch, around your knees or mid-shin.", "Squeeze your glutes to stand up."],
        tip: "Keep the dumbbells close to your legs the whole way.",
        mistakes: ["Reaching for the floor with a rounded back.", "Squatting the weight instead of hinging."],
        easier: "Lighter dumbbells, shorter range", harder: "Single-leg dumbbell Romanian deadlift"
    },
    "Back extension": {
        m: "Lower back, glutes, hamstrings", eq: "45-degree back extension bench", aka: "hyperextension, roman chair",
        setup: "Set the pad just below your hip bones so you can bend at the hips. Hook your feet under the ankle pads. Cross your arms on your chest.",
        steps: ["Lower your upper body by bending at the hips, back flat.", "Go down until you feel a stretch in your hamstrings.", "Squeeze your glutes to lift back up until your body is in a straight line.", "Don't arch past straight."],
        tip: "Squeeze your glutes at the top instead of leaning back.",
        mistakes: ["Hyperextending your lower back at the top.", "Pad set too high, which blocks the hinge."],
        easier: "Smaller range of motion", harder: "Hold a plate against your chest"
    },
    "Cable pull-through": {
        m: "Glutes, hamstrings", eq: "Cable machine with a rope",
        setup: "Set a rope on the lowest pulley. Face away from the machine, holding the rope between your legs, and walk out a couple of steps.",
        steps: ["Push your hips back, letting the rope pull your hands back between your legs.", "Keep your back flat and knees soft.", "Drive your hips forward to stand tall.", "Squeeze your glutes at the top."],
        tip: "Your arms are just hooks. All the movement comes from your hips.",
        mistakes: ["Pulling with your arms.", "Squatting down instead of hinging back."],
        easier: "Lighter weight", harder: "Pause at the top for 2 seconds"
    },
    "Glute bridge": {
        kit: "none", m: "Glutes, hamstrings", eq: "Floor, optional weight",
        setup: "Lie on your back, knees bent, feet flat and hip-width, heels about a hand's length from your butt.",
        steps: ["Push through your heels and lift your hips.", "Squeeze your glutes hard at the top. Your body forms a straight line from knees to shoulders.", "Hold for a second.", "Lower slowly."],
        tip: "Tuck your ribs down so your glutes do the work, not your lower back.",
        mistakes: ["Arching your lower back at the top.", "Pushing through your toes."],
        easier: "Smaller range of motion", harder: "Single-leg glute bridge or hip thrust"
    },
    "Hip thrust": {
        kit: "db", m: "Glutes, hamstrings", eq: "Bench and barbell or dumbbell",
        setup: "Sit on the floor with your upper back against a bench. Roll a padded bar over your hips (or hold a dumbbell there). Feet flat, hip-width.",
        steps: ["Drive through your heels to lift your hips until your thighs are level with the floor.", "Keep your chin tucked and ribs down.", "Squeeze your glutes for a second at the top.", "Lower under control."],
        tip: "At the top, your shins should be vertical. Move your feet until they are.",
        mistakes: ["Arching your back to get higher.", "Feet too far away, which shifts work to your hamstrings."],
        easier: "Glute bridge", harder: "Single-leg hip thrust or a heavier load"
    },
    "Single-leg glute bridge": {
        kit: "none", m: "Glutes, hamstrings", eq: "Floor",
        setup: "Lie on your back with one knee bent and that foot flat. Lift the other leg straight, or hug that knee to your chest.",
        steps: ["Push through the planted heel to lift your hips.", "Keep your hips level, not tilting to one side.", "Squeeze at the top.", "Lower slowly. Finish one side, then switch."],
        tip: "Hugging your other knee in keeps your lower back from arching.",
        mistakes: ["Hips twisting.", "Pushing through your toes."],
        easier: "Two-leg glute bridge", harder: "Single-leg hip thrust off a bench"
    },
    "Hip abduction machine": {
        m: "Glutes (side), hips", eq: "Hip abduction machine", aka: "outer thigh machine, abductor machine",
        setup: "Sit with your back against the pad and the outside of your knees against the leg pads. Pick a weight you can move smoothly.",
        steps: ["Push your knees out as far as is comfortable.", "Pause for a second at the widest point.", "Bring your legs back in slowly, without letting the weights touch.", "Leaning forward a little shifts more of the work to your glutes."],
        tip: "Slow and controlled beats heavy here. Feel the side of your hips doing the work.",
        mistakes: ["Letting the weight slam back together.", "Using momentum to bounce your knees out."],
        easier: "Lighter weight or a smaller range", harder: "Pause for 3 seconds at the widest point"
    },
    "Hip adduction machine": {
        m: "Inner thighs (adductors)", eq: "Hip adduction machine", aka: "inner thigh machine, adductor machine",
        setup: "Sit with your back against the pad and the inside of your knees against the leg pads. Start with your legs only as wide as is comfortable.",
        steps: ["Squeeze your knees together in a smooth arc.", "Pause for a second when the pads meet.", "Let your legs open slowly to the start.", "Keep your back against the pad the whole time."],
        tip: "Control the way out. That stretched part is where a lot of the work happens.",
        mistakes: ["Starting with your legs stretched wider than is comfortable.", "Letting the weights slam."],
        easier: "Lighter weight or a smaller range", harder: "Pause for 3 seconds with the pads together"
    },
    "Cable glute kickback": {
        m: "Glutes", eq: "Cable machine with an ankle strap",
        setup: "Put the ankle strap on one leg and face the cable machine. Hold the frame, hinge forward slightly, and keep a soft bend in your standing knee.",
        steps: ["Push the strapped leg back and slightly up, leading with your heel.", "Squeeze your glute at the end without arching your lower back.", "Bring the leg forward slowly.", "Finish all reps on one side, then switch."],
        tip: "Think \"push the floor away behind you,\" not \"swing the leg up.\"",
        mistakes: ["Arching your lower back to get the leg higher.", "Swinging the weight with momentum."],
        easier: "Donkey kicks on your hands and knees with no weight", harder: "Pause for 2 seconds at the top"
    },
    "Hamstring curl machine": {
        m: "Hamstrings", eq: "Seated or lying leg curl machine", aka: "leg curl, hamstring curl",
        setup: "Adjust the machine so your knees line up with its pivot and the pad sits just above your heels.",
        steps: ["Curl your heels toward your butt.", "Squeeze at the end of the movement.", "Return slowly, taking 2 to 3 seconds.", "Keep your hips still."],
        tip: "Point your toes up toward your shins for a stronger squeeze.",
        mistakes: ["Swinging the weight.", "Hips lifting off the seat or pad."],
        easier: "Lighter weight", harder: "Single-leg curls"
    },
    "Seated hamstring curl": {
        m: "Hamstrings", eq: "Seated leg curl machine", aka: "seated leg curl",
        setup: "Sit with your back against the pad. Knees line up with the pivot, the lower pad behind your ankles, and the thigh pad snug on top of your legs.",
        steps: ["Curl your heels down and back under the seat.", "Squeeze for a second.", "Let the pad rise slowly.", "Stop just before the stack touches."],
        tip: "Leaning your chest slightly forward gives your hamstrings a bigger stretch.",
        mistakes: ["Thigh pad too loose, so your hips lift.", "Rushing the way up."],
        easier: "Lighter weight", harder: "3-second lowering on every rep"
    },
    "Lying hamstring curl": {
        m: "Hamstrings", eq: "Lying leg curl machine", aka: "lying leg curl, prone leg curl",
        setup: "Lie face down with your knees just off the end of the bench and the pad just above your heels. Hold the handles.",
        steps: ["Curl your heels toward your butt.", "Keep your hips pressed into the pad.", "Squeeze at the top.", "Lower slowly."],
        tip: "If your hips pop up, the weight is too heavy.",
        mistakes: ["Hips rising off the bench.", "Dropping the weight on the way down."],
        easier: "Lighter weight", harder: "Pause at the top"
    },
    "Stability ball leg curl": {
        m: "Hamstrings, glutes", eq: "Stability ball",
        setup: "Lie on your back with your heels on top of a stability ball and your arms flat at your sides.",
        steps: ["Lift your hips so your body forms a straight line.", "Keeping your hips up, curl the ball toward you with your heels.", "Roll it back out slowly.", "Keep your hips high the whole set."],
        tip: "Hips stay up the entire time. That's where the challenge is.",
        mistakes: ["Hips sagging as you curl.", "Going too fast and losing the ball."],
        easier: "Keep your hips down and just curl", harder: "Single-leg version"
    },

    /* ---------- Calves ---------- */
    "Standing calf raise": {
        kit: "db", m: "Calves", eq: "Calf raise machine, step, or Smith machine", aka: "standing calf machine",
        setup: "Stand with the balls of your feet on the edge of a step or platform, heels hanging off.",
        steps: ["Lower your heels as far as you can for a full stretch.", "Pause for a second at the bottom.", "Rise up as high as you can onto your toes.", "Squeeze for a second at the top."],
        tip: "The pause at the bottom matters. Bouncing lets your tendons do the work instead of your calves.",
        mistakes: ["Bouncing quickly through half reps.", "Bending your knees to help."],
        easier: "Bodyweight on a step", harder: "Single-leg calf raise holding a dumbbell"
    },
    "Seated calf raise": {
        m: "Calves (especially the lower part)", eq: "Seated calf raise machine", aka: "seated calf machine",
        setup: "Sit with the pad snug on top of your thighs, just above your knees, balls of your feet on the platform.",
        steps: ["Release the safety.", "Lower your heels for a deep stretch, and pause.", "Push up as high as you can.", "Squeeze at the top."],
        tip: "Slow and full range beats heavy and bouncy.",
        mistakes: ["Tiny bouncing reps.", "Forgetting the safety lever when you finish."],
        easier: "Lighter weight", harder: "3-second lowering"
    },
    "Leg press calf raise": {
        m: "Calves", eq: "Leg press machine", aka: "horizontal calf, calf press",
        setup: "Sit in the leg press with legs straight (knees soft, not locked) and just the balls of your feet on the bottom edge of the platform. Keep the safeties on.",
        steps: ["Let the platform push your toes back toward you for a stretch.", "Press the platform away with your toes.", "Squeeze at the end.", "Return slowly."],
        tip: "Keep the safety handles engaged so the sled can't come down if your foot slips.",
        mistakes: ["Bending your knees.", "Feet too high on the platform."],
        easier: "Lighter weight", harder: "Pause at both ends"
    },
    "Single-leg calf raise": {
        kit: "none", m: "Calves, balance", eq: "Step, optional dumbbell",
        setup: "Stand on one foot on the edge of a step, holding a rail or wall for balance.",
        steps: ["Lower your heel for a full stretch.", "Rise up as high as you can.", "Pause at the top.", "Finish one side, then switch."],
        tip: "Use the rail for balance only, not to pull yourself up.",
        mistakes: ["Rushing the reps.", "Pulling on the rail."],
        easier: "Two-leg calf raise", harder: "Hold a dumbbell"
    },

    /* ---------- Chest ---------- */
    "Bench press": {
        m: "Chest, front shoulders, triceps", eq: "Barbell, bench, and rack (use safeties or a spotter)",
        setup: "Lie with your eyes under the bar, feet flat. Squeeze your shoulder blades together and down. Grip the bar a little wider than your shoulders.",
        steps: ["Unrack the bar and hold it over your shoulders with straight arms.", "Lower it to your mid-chest, elbows tucked at about 45 degrees.", "Touch your chest lightly, without bouncing.", "Press back up and slightly back toward your face."],
        tip: "Keep your shoulder blades pinched the whole set. It protects your shoulders and gives you a stable base.",
        mistakes: ["Flaring your elbows straight out to the sides.", "Bouncing the bar off your chest.", "Butt lifting off the bench."],
        easier: "Dumbbell bench press", harder: "Pause bench press (1 second on the chest)"
    },
    "Dumbbell bench press": {
        kit: "db", m: "Chest, front shoulders, triceps", eq: "Two dumbbells and a flat bench",
        setup: "Sit on the bench with the dumbbells on your thighs. Lie back and use your knees to help bring them up over your chest. Shoulder blades pinched.",
        steps: ["Start with the dumbbells over your chest, palms facing your feet.", "Lower them to the sides of your chest, elbows at about 45 degrees.", "Feel a stretch in your chest at the bottom.", "Press up until your arms are straight."],
        tip: "Bring the dumbbells down to your chest level, not your neck.",
        mistakes: ["Elbows flared straight out.", "Clanking the dumbbells together at the top.", "Dropping them to the floor carelessly at the end."],
        easier: "Push-ups with hands on a bench", harder: "Pause 1 second at the bottom"
    },
    "Dumbbell floor press": {
        kit: "db", m: "Chest, triceps, front shoulders", eq: "Two dumbbells and the floor", aka: "floor press",
        setup: "Lie on your back on the floor, knees bent, feet flat. Hold the dumbbells over your chest with straight arms, palms facing your feet.",
        steps: ["Lower the dumbbells until your upper arms touch the floor, elbows at about 45 degrees.", "Pause for a moment with your arms resting on the floor.", "Press back up until your arms are straight.", "Keep your shoulder blades pulled together the whole time."],
        tip: "Let your elbows touch the floor softly, then press. The floor keeps your shoulders safe.",
        mistakes: ["Bouncing your elbows off the floor.", "Flaring your elbows straight out to the sides.", "Lifting your hips off the floor."],
        easier: "Push-ups with hands on a counter, or lighter dumbbells", harder: "Pause 2 seconds with your elbows on the floor"
    },
    "Machine chest press": {
        m: "Chest, front shoulders, triceps", eq: "Chest press machine", aka: "seated chest press, chest press machine, selectorized chest press",
        setup: "Adjust the seat so the handles line up with your mid-chest. Sit tall with your back against the pad.",
        steps: ["Grip the handles and push them forward until your arms are straight.", "Don't lock your elbows hard.", "Return slowly until you feel a stretch in your chest.", "Keep your shoulder blades back against the pad."],
        tip: "A machine is a great way to train hard safely, with no spotter needed.",
        mistakes: ["Seat too high or low.", "Shoulders rolling forward at the end of the press."],
        easier: "Lighter weight", harder: "3-second lowering"
    },
    "Push-up": {
        kit: "none", m: "Chest, shoulders, triceps, core", eq: "Bodyweight",
        setup: "Hands slightly wider than your shoulders, arms straight, body in a straight line from head to heels.",
        steps: ["Brace your stomach and squeeze your glutes.", "Lower your chest toward the floor, elbows at about 45 degrees.", "Go until your chest is a fist's height from the floor.", "Push back up as one solid piece."],
        tip: "If your hips sag, make it easier rather than doing sloppy reps.",
        mistakes: ["Hips sagging or piking up.", "Elbows flared straight out.", "Half reps."],
        easier: "Hands on a bench or wall", harder: "Feet elevated, or a slow 3-second lowering"
    },
    "Incline dumbbell press": {
        kit: "db", m: "Upper chest, front shoulders, triceps", eq: "Two dumbbells, incline bench",
        setup: "Set the bench to a low incline, about 30 degrees. Sit back with the dumbbells and kick them up to your shoulders.",
        steps: ["Press the dumbbells up over your upper chest.", "Lower them to the top of your chest, elbows at about 45 degrees.", "Feel the stretch.", "Press back up."],
        tip: "A lower incline (around 30 degrees) hits the upper chest without turning it into a shoulder press.",
        mistakes: ["Bench set too steep.", "Arching off the bench."],
        easier: "Incline machine press", harder: "Pause at the bottom"
    },
    "Incline machine press": {
        m: "Upper chest, front shoulders, triceps", eq: "Incline press machine", aka: "incline chest press machine",
        setup: "Adjust the seat so the handles start around your upper chest. Back flat against the pad.",
        steps: ["Press the handles up and away until your arms are straight.", "Return slowly to a good stretch.", "Keep your shoulder blades back.", "Repeat."],
        tip: "Controlled lowering builds more muscle than heaving heavy weight.",
        mistakes: ["Seat set so the handles start at your neck.", "Shrugging your shoulders up."],
        easier: "Lighter weight", harder: "3-second lowering"
    },
    "Incline barbell press": {
        m: "Upper chest, front shoulders, triceps", eq: "Barbell and incline bench (use safeties or a spotter)",
        setup: "Lie on an incline bench (about 30 degrees) with your eyes under the bar. Shoulder blades pinched, grip slightly wider than shoulders.",
        steps: ["Unrack and hold the bar over your upper chest.", "Lower it to just below your collarbones.", "Touch lightly.", "Press back up."],
        tip: "Always use the safety arms or a spotter on heavy pressing sets.",
        mistakes: ["Bouncing off your chest.", "Lowering to your neck."],
        easier: "Incline dumbbell press", harder: "Pause on the chest"
    },
    "Cable fly": {
        m: "Chest", eq: "Cable machine with two handles", aka: "cable crossover, crossover",
        setup: "Set both pulleys at about shoulder height. Grab a handle in each hand and take a step forward, one foot in front of the other.",
        steps: ["Start with your arms out wide, elbows slightly bent.", "Bring your hands together in a hugging motion in front of your chest.", "Squeeze your chest for a second.", "Open your arms slowly back to a stretch."],
        tip: "Keep the same small bend in your elbows the whole time. It's a hug, not a press.",
        mistakes: ["Turning it into a press by bending your elbows more.", "Going so wide your shoulders hurt."],
        easier: "Lighter weight", harder: "Pause at the squeeze"
    },
    "Pec deck": {
        m: "Chest", eq: "Pec deck (chest fly) machine", aka: "chest fly machine, pec fly, butterfly machine, super fly",
        setup: "Adjust the seat so the handles are at chest height. Sit with your back flat against the pad.",
        steps: ["Grip the handles with a slight bend in your elbows.", "Bring them together in front of your chest.", "Squeeze for a second.", "Let them open slowly to a comfortable stretch."],
        tip: "Stop the stretch where your shoulders still feel good.",
        mistakes: ["Seat too low or high.", "Letting the weight yank your arms back."],
        easier: "Lighter weight", harder: "Pause at the squeeze"
    },
    "Dumbbell fly": {
        kit: "db", m: "Chest", eq: "Two dumbbells, flat bench",
        setup: "Lie on a flat bench holding dumbbells over your chest, palms facing each other, elbows slightly bent.",
        steps: ["Lower the dumbbells out to your sides in a wide arc.", "Stop when you feel a good stretch, with elbows around chest level.", "Bring them back up the same arc.", "Squeeze at the top."],
        tip: "Use lighter weights than you'd press. The stretch is the point.",
        mistakes: ["Going too heavy and bending your elbows into a press.", "Lowering too deep."],
        easier: "Pec deck", harder: "Slow 3-second lowering"
    },
    "Low-to-high cable fly": {
        m: "Upper chest", eq: "Cable machine with two handles",
        setup: "Set both pulleys at the bottom. Grab a handle in each hand and stand in the middle with a staggered stance.",
        steps: ["Start with your hands low and out to the sides.", "Sweep them up and together to about chin height.", "Squeeze your upper chest.", "Lower slowly."],
        tip: "Think 'scoop up and in'.",
        mistakes: ["Shrugging your shoulders.", "Using your lower back to swing the weight."],
        easier: "Lighter weight", harder: "Pause at the top"
    },

    /* ---------- Back ---------- */
    "Barbell row": {
        m: "Upper back, lats, rear shoulders, biceps", eq: "Barbell",
        setup: "Hold the bar with an overhand grip, slightly wider than shoulders. Hinge at the hips until your torso is about 45 degrees, back flat, knees soft.",
        steps: ["Let the bar hang at arm's length.", "Pull it to your lower ribs, driving your elbows back.", "Squeeze your shoulder blades together.", "Lower under control."],
        tip: "Your torso stays still. If you're standing up to move the bar, it's too heavy.",
        mistakes: ["Jerking the weight with your lower back.", "Rounding your back."],
        easier: "Chest-supported dumbbell row", harder: "Pause the bar at your ribs"
    },
    "Lat pulldown": {
        m: "Lats, upper back, biceps", eq: "Lat pulldown machine", aka: "pulldown machine, fixed pulldown, cable pulldown",
        setup: "Adjust the knee pad so your legs are locked in. Grip the bar a little wider than your shoulders, palms facing away.",
        steps: ["Lean back slightly and pull your shoulder blades down.", "Pull the bar to your upper chest, driving your elbows down toward your back pockets.", "Squeeze for a second.", "Let the bar rise slowly until your arms are straight."],
        tip: "Think about pulling with your elbows, not your hands.",
        mistakes: ["Leaning way back and turning it into a row.", "Pulling the bar behind your neck.", "Letting the weight yank your arms up."],
        easier: "Lighter weight", harder: "Pull-up"
    },
    "Close-grip lat pulldown": {
        m: "Lats, upper back, biceps", eq: "Lat pulldown machine with a close-grip (V) handle",
        setup: "Attach a V-handle. Sit with your knees under the pad, holding the handle with palms facing each other.",
        steps: ["Start with your arms straight overhead.", "Pull the handle to your upper chest, elbows close to your body.", "Squeeze your lats.", "Return slowly to a full stretch."],
        tip: "Let your arms go fully straight at the top for a big lat stretch.",
        mistakes: ["Rocking your torso back and forth.", "Cutting the stretch short."],
        easier: "Lighter weight", harder: "Pause at the bottom"
    },
    "Pull-up": {
        m: "Lats, upper back, biceps, core", eq: "Pull-up bar",
        setup: "Hang from the bar with an overhand grip, hands slightly wider than shoulders, arms straight.",
        steps: ["Pull your shoulder blades down first.", "Pull yourself up until your chin clears the bar.", "Keep your body still, no swinging.", "Lower all the way down with control."],
        tip: "Can't do one yet? Use the assisted machine or a band. That's normal and it works.",
        mistakes: ["Kicking or swinging.", "Half reps that never straighten your arms."],
        easier: "Assisted pull-up or lat pulldown", harder: "Add weight with a belt, or a slow 3-second lowering"
    },
    "Assisted pull-up": {
        m: "Lats, upper back, biceps", eq: "Assisted pull-up machine or resistance band", aka: "assisted chin-up, assist dip chin, gravitron",
        setup: "Kneel or stand on the platform (or loop a band under your knee). More weight on the machine means more help.",
        steps: ["Grip the handles slightly wider than your shoulders.", "Pull your chin up over the handles.", "Lower slowly until your arms are straight.", "Use a little less help each week."],
        tip: "Progress here means using less assistance over time.",
        mistakes: ["Using so much help it's too easy.", "Bouncing at the bottom."],
        easier: "Lat pulldown", harder: "Pull-up"
    },
    "Seated cable row": {
        m: "Upper back, lats, biceps", eq: "Cable row station", aka: "low cable row, cable row",
        setup: "Sit with your feet on the platform and knees slightly bent. Grab the handle and sit tall with your arms straight.",
        steps: ["Pull the handle to your stomach, driving your elbows back.", "Squeeze your shoulder blades together.", "Hold for a second.", "Let your arms extend slowly, feeling your back stretch."],
        tip: "Chest stays up and your torso barely moves.",
        mistakes: ["Rocking back and forth to move the weight.", "Shrugging your shoulders toward your ears."],
        easier: "Lighter weight", harder: "Pause for 2 seconds at your stomach"
    },
    "Chest-supported row": {
        m: "Upper back, lats, rear shoulders", eq: "Chest-supported row machine (T-bar or plate-loaded)", aka: "chest supported t-bar row, seal row machine",
        setup: "Lie or lean with your chest against the pad. Grab the handles with arms straight.",
        steps: ["Pull the handles back, driving your elbows past your body.", "Squeeze your shoulder blades.", "Hold for a second.", "Lower slowly."],
        tip: "The chest pad takes your lower back out of it, so you can focus on your upper back.",
        mistakes: ["Lifting your chest off the pad.", "Short, jerky reps."],
        easier: "Lighter weight", harder: "Pause at the top"
    },
    "Chest-supported dumbbell row": {
        kit: "db", m: "Upper back, lats, rear shoulders", eq: "Two dumbbells and an incline bench",
        setup: "Set a bench to a low incline. Lie face down on it holding a dumbbell in each hand, arms hanging straight down.",
        steps: ["Row the dumbbells up toward your hips.", "Squeeze your shoulder blades together.", "Pause at the top.", "Lower slowly."],
        tip: "Keep your chest on the bench and your neck relaxed.",
        mistakes: ["Lifting your chest off the bench.", "Shrugging instead of rowing."],
        easier: "Lighter dumbbells", harder: "Pause 2 seconds at the top"
    },
    "Single-arm dumbbell row": {
        kit: "db", m: "Lats, upper back, biceps", eq: "Dumbbell and bench",
        setup: "Put one knee and the same-side hand on a bench, back flat. Hold a dumbbell in the other hand, arm hanging straight.",
        steps: ["Row the dumbbell up toward your hip.", "Keep your elbow close to your body.", "Squeeze at the top.", "Lower until your arm is straight. Finish one side, then switch."],
        tip: "Pull toward your hip, not your armpit, to hit your lats.",
        mistakes: ["Twisting your torso to heave the weight up.", "Rounding your back."],
        easier: "Lighter dumbbell", harder: "Pause at the top"
    },
    "Bent-over dumbbell row": {
        kit: "db", m: "Upper back, lats, biceps", eq: "Two dumbbells", aka: "dumbbell row, two-arm dumbbell row",
        setup: "Stand with feet hip-width apart, a dumbbell in each hand. Push your hips back and lean forward until your chest is about 45 degrees to the floor, back flat, knees soft.",
        steps: ["Let the dumbbells hang straight down, palms facing each other.", "Row them up toward your hips, elbows close to your sides.", "Squeeze your shoulder blades together at the top.", "Lower slowly until your arms are straight."],
        tip: "Keep your back flat and still: only your arms and shoulder blades move.",
        mistakes: ["Standing up taller with every rep.", "Rounding your lower back.", "Shrugging the weight up toward your ears."],
        easier: "Lighter dumbbells, or one arm at a time with your other hand on a couch", harder: "Pause 1 second at the top"
    },
    "Single-arm cable row": {
        m: "Lats, upper back", eq: "Cable machine with a single handle",
        setup: "Set the pulley at about chest height. Hold the handle in one hand and step back until your arm is straight.",
        steps: ["Row the handle toward your side, elbow close to your body.", "Squeeze your back.", "Let your arm reach forward for a stretch.", "Finish one side, then switch."],
        tip: "Let your shoulder reach forward a little at the start for a full stretch.",
        mistakes: ["Twisting your whole body.", "Shrugging."],
        easier: "Lighter weight", harder: "Pause at the end of the row"
    },
    "Machine row": {
        m: "Upper back, lats", eq: "Seated row machine", aka: "seated row machine, row machine",
        setup: "Adjust the seat so the handles line up with your mid-chest and your chest rests on the pad.",
        steps: ["Grab the handles with straight arms.", "Pull back, squeezing your shoulder blades.", "Pause.", "Return slowly."],
        tip: "Try both the wide and the close handles. Each one hits your back a little differently.",
        mistakes: ["Leaning back off the pad.", "Rushing the reps."],
        easier: "Lighter weight", harder: "3-second lowering"
    },

    /* ---------- Gym machines (plate-loaded and selectorized) ---------- */
    "Iso-lateral row": {
        m: "Upper back, lats, rear shoulders, biceps", eq: "Iso-lateral (plate-loaded) row machine", aka: "hammer strength row, plate loaded row, iso row",
        setup: "Set the seat so the handles are level with your lower chest, and rest your chest on the pad. Load the same plates on both sides.",
        steps: ["Grab the handles with straight arms.", "Pull your elbows back past your sides, squeezing your shoulder blades.", "Pause for a moment.", "Let the arms go forward slowly until your shoulder blades stretch apart."],
        tip: "Each arm moves on its own, so you can do one side at a time to fix an imbalance.",
        mistakes: ["Lifting your chest off the pad to yank the weight.", "Shrugging your shoulders up to your ears."],
        easier: "Machine row", harder: "One arm at a time with a 2-second squeeze"
    },
    "Iso-lateral high row": {
        m: "Lats, upper back, biceps", eq: "Iso-lateral (plate-loaded) high row machine", aka: "high row, plate loaded high row",
        setup: "Sit with your thighs under the pad and your chest against the support. Reach up and forward to the handles.",
        steps: ["Pull the handles down and back toward your upper chest.", "Drive your elbows down to your sides.", "Pause.", "Let your arms rise back up slowly."],
        tip: "Think about pulling with your elbows, not your hands.",
        mistakes: ["Leaning way back to use your bodyweight.", "Cutting the stretch short at the top."],
        easier: "Lat pulldown", harder: "One arm at a time"
    },
    "Iso-lateral lat pulldown": {
        m: "Lats, upper back, biceps", eq: "Plate-loaded pulldown machine", aka: "wide pulldown, front lat pulldown, plate loaded pulldown",
        setup: "Lock your thighs under the pad. Grab both handles with your arms straight overhead.",
        steps: ["Pull the handles down beside your chest.", "Squeeze your lats at the bottom.", "Pause.", "Let the handles rise slowly until your arms are straight."],
        tip: "Keep your chest up and lead with your elbows.",
        mistakes: ["Swinging your body to start each rep.", "Stopping short of a full stretch."],
        easier: "Lat pulldown", harder: "3-second lowering"
    },
    "T-bar row": {
        m: "Upper back, lats, rear shoulders, biceps", eq: "T-bar row machine or landmine with a handle",
        setup: "Stand on the platform (or straddle the bar), hinge at the hips with a flat back, and grab the handles with straight arms.",
        steps: ["Brace your stomach and keep your back flat.", "Row the handles to your stomach.", "Squeeze your shoulder blades.", "Lower slowly to a full stretch."],
        tip: "Your torso angle stays the same the whole set. If you stand up to move it, it's too heavy.",
        mistakes: ["Rounding your lower back.", "Jerking the weight up with your hips."],
        easier: "Chest-supported row", harder: "Pause at the top for 2 seconds"
    },
    "Iso-lateral chest press": {
        m: "Chest, front shoulders, triceps", eq: "Iso-lateral (plate-loaded) chest press machine", aka: "hammer strength chest press, iso-lateral bench press, horizontal bench press, wide chest press, plate loaded chest press",
        setup: "Set the seat so the handles line up with the middle of your chest. Pin your shoulder blades back against the pad.",
        steps: ["Press the handles forward until your arms are straight.", "Don't lock out hard.", "Lower slowly until you feel a stretch across your chest.", "Press again."],
        tip: "The arms move separately, so press both evenly; your weaker side can't hide.",
        mistakes: ["Letting your shoulders roll forward off the pad.", "Bouncing out of the bottom."],
        easier: "Machine chest press", harder: "One arm at a time"
    },
    "Iso-lateral incline press": {
        m: "Upper chest, front shoulders, triceps", eq: "Iso-lateral (plate-loaded) incline press machine", aka: "plate loaded incline press, super incline press",
        setup: "Set the seat so the handles start near your upper chest. Feet flat, shoulder blades back.",
        steps: ["Press up and forward until your arms are straight.", "Lower slowly to the stretch.", "Pause briefly.", "Press again."],
        tip: "Keep your chest tall so your upper chest does the work, not just your shoulders.",
        mistakes: ["Arching your back off the pad.", "Half reps."],
        easier: "Incline machine press", harder: "3-second lowering"
    },
    "Smith machine bench press": {
        m: "Chest, front shoulders, triceps", eq: "Smith machine and a flat bench", aka: "smith bench",
        setup: "Line the bench up so the bar comes down to your mid-chest. Set the safety stops just above your chest.",
        steps: ["Unhook the bar by turning your wrists.", "Lower it to your mid-chest with elbows at about 45 degrees.", "Press it back up.", "Re-hook at the top."],
        tip: "Set the safeties every time; it lets you push hard without a spotter.",
        mistakes: ["Bench in the wrong spot so the bar lands on your neck or stomach.", "Flaring elbows straight out."],
        easier: "Machine chest press", harder: "Pause on the chest for 1 second"
    },
    "Iso-lateral shoulder press": {
        m: "Shoulders, triceps", eq: "Iso-lateral (plate-loaded) shoulder press machine", aka: "plate loaded shoulder press, hammer strength shoulder press",
        setup: "Set the seat so the handles start at about shoulder height. Back flat on the pad.",
        steps: ["Press the handles overhead until your arms are straight.", "Lower slowly to shoulder height.", "Pause.", "Press again."],
        tip: "Keep your ribs down; don't arch your back to finish the rep.",
        mistakes: ["Arching hard off the pad.", "Lowering only halfway."],
        easier: "Machine shoulder press", harder: "One arm at a time"
    },
    "Pendulum squat": {
        m: "Quads, glutes", eq: "Pendulum squat machine", aka: "pendulum squat machine",
        setup: "Step in with your back on the pad and shoulders under the pads. Feet about hip-width in the middle of the platform.",
        steps: ["Release the safety handles.", "Squat down as deep as you comfortably can, knees traveling forward.", "Drive up through your whole foot.", "Stop just short of locking out."],
        tip: "It's built for deep knee bends; go slow at the bottom and own the stretch.",
        mistakes: ["Heels lifting.", "Bouncing out of the bottom."],
        easier: "Leg press", harder: "Pause at the bottom for 2 seconds"
    },
    "Belt squat": {
        m: "Quads, glutes, adductors", eq: "Belt squat machine", aka: "belt squat machine",
        setup: "Clip the belt around your hips and stand on the platform with feet a little wider than shoulder-width.",
        steps: ["Release the lever so the weight hangs from your hips.", "Squat down with your chest up.", "Go as deep as feels good.", "Stand back up."],
        tip: "Great for training legs hard without loading your back.",
        mistakes: ["Knees caving in.", "Rushing the bottom."],
        easier: "Goblet squat", harder: "Slow 3-second lowering"
    },
    "Hip thrust machine": {
        m: "Glutes, hamstrings", eq: "Hip thrust (glute drive) machine", aka: "glute drive",
        setup: "Sit with your upper back on the pad and the belt or pad across your hips. Feet flat, about hip-width.",
        steps: ["Tuck your chin and drive through your heels.", "Lift your hips until your body is flat from knees to shoulders.", "Squeeze your glutes for a second at the top.", "Lower slowly."],
        tip: "Your shins should be vertical at the top. Move your feet until they are.",
        mistakes: ["Arching your lower back at the top instead of squeezing your glutes.", "Pushing through your toes."],
        easier: "Glute bridge", harder: "Pause 3 seconds at the top"
    },
    "Seated dip machine": {
        m: "Triceps, chest, front shoulders", eq: "Seated dip machine", aka: "triceps dip machine, plate loaded seated dip",
        setup: "Sit tall with the handles at your sides, elbows bent.",
        steps: ["Press the handles down until your arms are straight.", "Squeeze your triceps.", "Let the handles rise slowly.", "Stop when your elbows reach about 90 degrees."],
        tip: "Keep your elbows tucked in by your sides to hit the triceps.",
        mistakes: ["Shrugging your shoulders up.", "Letting the weight slam back up."],
        easier: "Triceps pushdown", harder: "3-second lowering"
    },
    "Machine preacher curl": {
        m: "Biceps", eq: "Preacher curl machine", aka: "biceps curl machine, seated biceps, preacher machine",
        setup: "Set the seat so your armpits are snug on top of the pad and your upper arms lie flat on it.",
        steps: ["Curl the handles up.", "Squeeze your biceps at the top.", "Lower slowly until your arms are almost straight.", "Curl again."],
        tip: "The bottom is where it works hardest; don't skip it.",
        mistakes: ["Lifting your elbows off the pad.", "Dropping the weight on the way down."],
        easier: "Cable curl", harder: "Pause halfway down"
    },
    "Ab crunch machine": {
        m: "Abs", eq: "Ab crunch machine", aka: "abdominal crunch, crunch machine",
        setup: "Set the seat so the handles or pads sit at your upper chest. Hook your feet if there are rollers.",
        steps: ["Breathe out and curl your ribs toward your hips.", "Squeeze your abs at the bottom.", "Return slowly.", "Keep tension the whole set."],
        tip: "Move your spine, not just your arms. Think 'roll down', not 'pull down'.",
        mistakes: ["Pulling with your arms.", "Using momentum."],
        easier: "Reverse crunch", harder: "2-second squeeze at the bottom"
    },

    "Iso-lateral low row": {
        m: "Lats, upper back, biceps", eq: "Iso-lateral (plate-loaded) low row machine", aka: "low row, hammer strength low row",
        setup: "Sit with your chest on the pad and feet braced. Reach forward and slightly down to the handles.",
        steps: ["Row the handles toward your hips.", "Keep your elbows close to your sides.", "Squeeze your lats at the end.", "Return slowly to a full stretch."],
        tip: "Pulling toward your hips works the lats; pulling toward your chest works the upper back more.",
        mistakes: ["Leaning back to cheat the weight.", "Short reps without the stretch."],
        easier: "Seated cable row", harder: "One arm at a time"
    },
    "Iso-lateral decline press": {
        m: "Chest, triceps, front shoulders", eq: "Iso-lateral (plate-loaded) decline chest press machine", aka: "decline chest press, decline press machine",
        setup: "Set the seat so the handles line up with your lower chest. Shoulder blades back on the pad.",
        steps: ["Press forward and slightly down until your arms are straight.", "Lower slowly to a stretch.", "Pause briefly.", "Press again."],
        tip: "Great for the lower chest, and easy on the shoulders.",
        mistakes: ["Shoulders rolling forward.", "Bouncing at the bottom."],
        easier: "Machine chest press", harder: "3-second lowering"
    },
    "Pullover machine": {
        m: "Lats, chest", eq: "Pullover machine", aka: "plate loaded pullover, nautilus pullover",
        setup: "Set the seat so your shoulders line up with the machine's pivot. Rest your arms on the pads overhead.",
        steps: ["Drive your elbows down and around toward your hips.", "Squeeze your lats at the bottom.", "Let your arms rise slowly back overhead.", "Feel the stretch at the top."],
        tip: "It trains the lats without your biceps getting tired first.",
        mistakes: ["Arching your back to move the weight.", "Cutting the stretch short."],
        easier: "Lat pulldown", harder: "Pause in the stretch for 2 seconds"
    },
    "Shrug machine": {
        m: "Traps", eq: "Seated or standing shrug machine", aka: "machine shrug, seated shrug, standing shrug",
        setup: "Stand or sit tall with the handles at your sides and arms straight.",
        steps: ["Lift your shoulders straight up toward your ears.", "Squeeze for a second.", "Lower all the way down.", "Repeat."],
        tip: "Straight up and down. Rolling your shoulders adds nothing.",
        mistakes: ["Bending your elbows.", "Bouncing the weight."],
        easier: "Lighter weight", harder: "2-second squeeze at the top"
    },
    "Kneeling leg curl": {
        m: "Hamstrings", eq: "Kneeling (iso-lateral) leg curl machine", aka: "iso-lateral leg curl, single leg curl machine",
        setup: "Kneel on the pad with one ankle under the roller and your hips square.",
        steps: ["Curl your heel toward your glutes.", "Squeeze at the top.", "Lower slowly.", "Finish all reps, then switch legs."],
        tip: "One leg at a time lets your weaker side catch up.",
        mistakes: ["Twisting your hips to help.", "Dropping the weight on the way down."],
        easier: "Lying hamstring curl", harder: "3-second lowering"
    },
    "Reverse hyper": {
        m: "Glutes, hamstrings, lower back", eq: "Reverse hyper or glute-ham machine", aka: "reverse hyperextension, glute ham machine",
        setup: "Lie face down on the pad with your hips at the edge and hold the handles.",
        steps: ["Squeeze your glutes and lift your legs up behind you.", "Stop when your body is in a straight line.", "Lower with control.", "Don't swing."],
        tip: "Lift with your glutes; don't crank your lower back into an arch.",
        mistakes: ["Swinging the legs with momentum.", "Over-arching at the top."],
        easier: "Glute bridge", harder: "Pause at the top"
    },
    "V-squat machine": {
        m: "Quads, glutes", eq: "V-squat or reverse V-squat machine", aka: "reverse v squat, super squat",
        setup: "Step onto the platform with your shoulders under the pads and feet about hip-width.",
        steps: ["Release the safeties.", "Squat down as deep as you comfortably can.", "Drive up through your whole foot.", "Stop just short of locking out."],
        tip: "Feet lower on the platform hit the quads more; higher hits the glutes more.",
        mistakes: ["Heels lifting.", "Knees caving in."],
        easier: "Leg press", harder: "Pause at the bottom"
    },
    "Glute kickback machine": {
        m: "Glutes", eq: "Glute kickback (hip and glute) machine", aka: "hip and glute machine, glute machine",
        setup: "Set your chest or forearms on the pad and place one foot on the platform or behind the roller.",
        steps: ["Push your leg back and up by squeezing your glute.", "Pause at the top.", "Return slowly.", "Finish all reps, then switch legs."],
        tip: "Keep your lower back still; the glute does all the moving.",
        mistakes: ["Arching your back to get the leg higher.", "Swinging."],
        easier: "Cable glute kickback", harder: "2-second squeeze at the top"
    },
    "Triceps extension machine": {
        m: "Triceps", eq: "Triceps extension machine", aka: "seated triceps extension, tricep machine",
        setup: "Sit with your upper arms resting on the pad and the handles in front of you.",
        steps: ["Straighten your arms fully.", "Squeeze your triceps.", "Bend back slowly to a stretch.", "Repeat."],
        tip: "Keep your elbows planted on the pad the whole time.",
        mistakes: ["Lifting your elbows off the pad.", "Half reps."],
        easier: "Triceps pushdown", harder: "3-second lowering"
    },

    /* ---------- Shoulders ---------- */
    "Overhead press": {
        m: "Shoulders, triceps, upper chest, core", eq: "Barbell and rack",
        setup: "Unrack the bar at your collarbones, hands just outside shoulder-width. Feet hip-width, glutes squeezed, stomach braced.",
        steps: ["Move your head back slightly and press the bar straight up.", "Once it passes your forehead, push your head through so the bar ends over your mid-foot.", "Lock out with your arms by your ears.", "Lower back to your collarbones."],
        tip: "Squeeze your glutes the whole time. It stops you from leaning back.",
        mistakes: ["Leaning way back and turning it into an incline press.", "Pressing the bar out in front instead of straight up."],
        easier: "Seated dumbbell shoulder press", harder: "Pause at the bottom of each rep"
    },
    "Seated dumbbell shoulder press": {
        kit: "db", m: "Shoulders, triceps", eq: "Two dumbbells, bench with back support",
        setup: "Set the bench upright or one notch back. Sit with dumbbells at shoulder height, palms forward.",
        steps: ["Press the dumbbells up until your arms are straight.", "Don't clank them together at the top.", "Lower them back to about ear height.", "Keep your back against the pad."],
        tip: "Elbows slightly in front of your body, not straight out to the sides, is easier on the shoulders.",
        mistakes: ["Arching your lower back off the pad.", "Lowering only halfway."],
        easier: "Machine shoulder press", harder: "Standing dumbbell shoulder press"
    },
    "Dumbbell shoulder press": {
        kit: "db", m: "Shoulders, triceps, core", eq: "Two dumbbells",
        setup: "Stand (or sit) with dumbbells at shoulder height, palms forward, stomach braced.",
        steps: ["Press the dumbbells up overhead.", "Finish with your arms straight, near your ears.", "Lower under control to shoulder height.", "Keep your ribs down."],
        tip: "If you're leaning back to finish reps, go lighter.",
        mistakes: ["Leaning back.", "Partial reps."],
        easier: "Seated with back support", harder: "Single-arm press (works your core too)"
    },
    "Machine shoulder press": {
        m: "Shoulders, triceps", eq: "Shoulder press machine", aka: "seated shoulder press machine, shoulder press machine",
        setup: "Adjust the seat so the handles start at about shoulder height. Sit tall, back against the pad.",
        steps: ["Press the handles up until your arms are straight.", "Lower slowly back to shoulder height.", "Keep your back against the pad.", "Repeat."],
        tip: "The machine handles balance, so you can focus on pushing hard.",
        mistakes: ["Seat so low the start is uncomfortable for your shoulders.", "Arching your back."],
        easier: "Lighter weight", harder: "3-second lowering"
    },
    "Arnold press": {
        kit: "db", m: "Shoulders, triceps", eq: "Two dumbbells",
        setup: "Sit with the dumbbells in front of your shoulders, palms facing you, like the top of a curl.",
        steps: ["As you press up, rotate your palms to face forward.", "Finish with your arms straight overhead.", "Reverse the rotation on the way down.", "End with your palms facing you again."],
        tip: "Move smoothly. The rotation should happen during the press, not before it.",
        mistakes: ["Going too heavy for the rotation.", "Arching your back."],
        easier: "Seated dumbbell shoulder press", harder: "Slow 3-second lowering"
    },
    "Lateral raise": {
        kit: "db", m: "Side shoulders", eq: "Two light dumbbells",
        setup: "Stand holding light dumbbells at your sides, slight bend in your elbows, leaning a little forward.",
        steps: ["Raise your arms out to your sides.", "Lead with your elbows, and stop at shoulder height.", "Pause for a second.", "Lower slowly."],
        tip: "Go lighter than you think. Swinging heavy dumbbells shifts the work to your traps.",
        mistakes: ["Swinging your body to lift the weight.", "Shrugging your shoulders up.", "Lifting far above shoulder height."],
        easier: "Lighter dumbbells or one arm at a time", harder: "Cable lateral raise, or a 1-second pause at the top"
    },
    "Cable lateral raise": {
        m: "Side shoulders", eq: "Cable machine with a single handle",
        setup: "Set the pulley at the bottom. Stand side-on to the machine and grab the handle with your far hand, so the cable crosses in front of your body.",
        steps: ["Raise your arm out to the side until it's level with your shoulder.", "Lead with your elbow.", "Pause.", "Lower slowly. Finish one side, then switch."],
        tip: "The cable keeps tension on your shoulder even at the bottom, which dumbbells can't do.",
        mistakes: ["Leaning away to cheat the weight up.", "Shrugging."],
        easier: "Lighter weight", harder: "Pause at the top"
    },
    "Machine lateral raise": {
        m: "Side shoulders", eq: "Lateral raise machine", aka: "side lateral machine, lateral raise machine",
        setup: "Adjust the seat so your shoulders line up with the machine's pivot points. Pads rest on the outside of your arms.",
        steps: ["Raise your arms out to the sides until level with your shoulders.", "Pause.", "Lower slowly.", "Keep your shoulders down, away from your ears."],
        tip: "Push with your elbows against the pads, not your hands.",
        mistakes: ["Shrugging.", "Seat height wrong for your shoulders."],
        easier: "Lighter weight", harder: "Pause at the top"
    },
    "Lean-away lateral raise": {
        m: "Side shoulders", eq: "One dumbbell and something sturdy to hold",
        setup: "Hold a sturdy post with one hand and lean away from it, holding a dumbbell in your free hand.",
        steps: ["Raise the dumbbell out to the side.", "Stop when your arm is about level with the floor.", "Lower slowly.", "Finish one side, then switch."],
        tip: "Leaning away makes the bottom of the movement harder, where regular raises are easy.",
        mistakes: ["Swinging.", "Leaning so far you lose balance."],
        easier: "Regular lateral raise", harder: "Pause at the top"
    },
    "Rear delt fly": {
        kit: "db", m: "Rear shoulders, upper back", eq: "Two light dumbbells",
        setup: "Hinge forward at the hips with your back flat, or lie face down on an incline bench. Let light dumbbells hang below your chest.",
        steps: ["Raise your arms out to the sides, elbows slightly bent.", "Squeeze between your shoulder blades.", "Pause.", "Lower slowly."],
        tip: "Think 'arms out wide', not 'squeeze shoulder blades hard'. That keeps it on the rear shoulders.",
        mistakes: ["Going heavy and swinging.", "Standing up as you lift."],
        easier: "Lighter dumbbells, chest on an incline bench", harder: "Pause 2 seconds at the top"
    },
    "Face pull": {
        m: "Rear shoulders, upper back, rotator cuff", eq: "Cable machine with a rope", aka: "rope face pull",
        setup: "Set a rope at about face height. Grab it with your thumbs pointing back toward you and step back until your arms are straight.",
        steps: ["Pull the rope toward your face, splitting the ends apart.", "Finish with your hands beside your ears and elbows high.", "Pause.", "Return slowly."],
        tip: "End in a 'double biceps' position, hands back by your ears.",
        mistakes: ["Pulling to your chest like a row.", "Leaning back."],
        easier: "Lighter weight", harder: "Pause 2 seconds at the end"
    },
    "Reverse pec deck": {
        m: "Rear shoulders, upper back", eq: "Pec deck machine (rear delt setting)", aka: "rear delt machine, rear delt fly machine",
        setup: "Sit facing the pad, chest against it. Set the handles so your arms start straight out in front of you.",
        steps: ["Sweep your arms out and back.", "Stop when they're in line with your body.", "Pause.", "Return slowly."],
        tip: "Keep your arms nearly straight and pull out wide.",
        mistakes: ["Bending your elbows into a row.", "Leaning back off the pad."],
        easier: "Lighter weight", harder: "Pause at the back"
    },
    "Cable rear delt fly": {
        m: "Rear shoulders", eq: "Cable machine",
        setup: "Set both pulleys at shoulder height. Grab the opposite cables (left hand takes the right cable) with your arms crossed in front of you.",
        steps: ["Pull your arms out and back in a wide arc.", "Stop when they're in line with your body.", "Pause.", "Return slowly to crossed arms."],
        tip: "Keep your chest up and your shoulders down.",
        mistakes: ["Shrugging.", "Turning it into a row."],
        easier: "Lighter weight", harder: "Pause at the end"
    },

    /* ---------- Arms ---------- */
    "Dumbbell curl": {
        kit: "db", m: "Biceps", eq: "Two dumbbells",
        setup: "Stand holding dumbbells at your sides, palms facing forward.",
        steps: ["Curl the dumbbells up, keeping your elbows by your sides.", "Squeeze your biceps at the top.", "Lower slowly until your arms are straight.", "Don't swing."],
        tip: "Elbows stay pinned to your sides the whole time.",
        mistakes: ["Swinging your body.", "Elbows drifting forward.", "Not straightening your arms at the bottom."],
        easier: "Lighter weight, or one arm at a time", harder: "Slow 3-second lowering"
    },
    "EZ-bar curl": {
        m: "Biceps", eq: "EZ curl bar",
        setup: "Stand holding the EZ bar on the angled grips, shoulder-width, arms straight.",
        steps: ["Curl the bar up, elbows by your sides.", "Squeeze at the top.", "Lower slowly.", "Stand tall the whole set."],
        tip: "The angled bar is easier on your wrists than a straight bar.",
        mistakes: ["Leaning back to lift it.", "Half reps."],
        easier: "Dumbbell curl", harder: "Pause halfway up"
    },
    "Barbell curl": {
        m: "Biceps, forearms", eq: "Straight barbell",
        setup: "Stand holding the bar with an underhand grip, shoulder-width.",
        steps: ["Curl the bar toward your shoulders, elbows by your sides.", "Squeeze.", "Lower slowly to straight arms.", "Keep your back still."],
        tip: "If your wrists complain, switch to the EZ bar.",
        mistakes: ["Swinging with your hips.", "Elbows moving forward."],
        easier: "EZ-bar curl", harder: "Slow 3-second lowering"
    },
    "Incline dumbbell curl": {
        kit: "db", m: "Biceps (long head)", eq: "Two dumbbells, incline bench",
        setup: "Set a bench to about 45 to 60 degrees. Sit back with the dumbbells hanging straight down behind your body.",
        steps: ["Curl the dumbbells up without moving your upper arms.", "Squeeze at the top.", "Lower all the way down for a full stretch.", "Keep your back on the bench."],
        tip: "The stretch at the bottom is what makes this one work. Use lighter weight than a regular curl.",
        mistakes: ["Swinging your arms forward.", "Going too heavy."],
        easier: "Dumbbell curl", harder: "Slow 3-second lowering"
    },
    "Hammer curl": {
        kit: "db", m: "Biceps, forearms (brachialis)", eq: "Two dumbbells",
        setup: "Stand holding dumbbells at your sides with your palms facing each other.",
        steps: ["Curl the dumbbells up, keeping your palms facing in.", "Elbows stay at your sides.", "Squeeze at the top.", "Lower slowly."],
        tip: "Great for thicker-looking arms and a stronger grip.",
        mistakes: ["Swinging.", "Rushing the way down."],
        easier: "Lighter weight", harder: "Cross-body hammer curl"
    },
    "Cable curl": {
        m: "Biceps", eq: "Cable machine with a straight bar or rope",
        setup: "Set the pulley at the bottom with a bar attached. Stand close holding it with an underhand grip.",
        steps: ["Curl the bar up, elbows by your sides.", "Squeeze at the top.", "Lower slowly.", "Keep tension the whole set."],
        tip: "The cable keeps your biceps working even at the bottom.",
        mistakes: ["Leaning back.", "Elbows moving forward."],
        easier: "Lighter weight", harder: "Pause at the top"
    },
    "Preacher curl": {
        m: "Biceps", eq: "Preacher bench with an EZ bar, dumbbell, or machine",
        setup: "Sit with the backs of your upper arms flat on the pad, holding the weight with your arms nearly straight.",
        steps: ["Curl the weight up.", "Squeeze at the top.", "Lower slowly.", "Stop just short of locking out."],
        tip: "The pad stops you from cheating. Go lighter and control the bottom.",
        mistakes: ["Dropping fast into a hard lockout.", "Lifting your elbows off the pad."],
        easier: "Machine preacher curl", harder: "Slow 3-second lowering"
    },
    "Triceps pushdown": {
        m: "Triceps", eq: "Cable machine with a bar or rope", aka: "cable pushdown, tricep pushdown",
        setup: "Set the pulley high. Grab the bar, tuck your elbows at your sides, and lean forward slightly.",
        steps: ["Push the bar down until your arms are straight.", "Squeeze your triceps.", "Let the bar rise slowly until your forearms are about parallel to the floor.", "Elbows stay pinned."],
        tip: "Only your forearms move. Your upper arms stay still at your sides.",
        mistakes: ["Elbows flaring out or drifting forward.", "Leaning over the bar and using bodyweight."],
        easier: "Lighter weight", harder: "Pause at the bottom"
    },
    "Rope pushdown": {
        m: "Triceps", eq: "Cable machine with a rope",
        setup: "Set the pulley high with a rope. Hold the ends, elbows tucked at your sides.",
        steps: ["Push the rope down.", "Spread the ends apart at the bottom.", "Squeeze your triceps.", "Return slowly."],
        tip: "Spreading the rope at the bottom gives an extra squeeze.",
        mistakes: ["Elbows moving.", "Rushing."],
        easier: "Lighter weight", harder: "Pause at the bottom"
    },
    "Overhead triceps extension": {
        kit: "db", m: "Triceps (long head)", eq: "Dumbbell or cable with a rope",
        setup: "Hold one dumbbell overhead with both hands (or face away from a cable with a rope). Elbows point forward.",
        steps: ["Lower the weight behind your head by bending your elbows.", "Feel a stretch in the back of your arms.", "Extend your arms back overhead.", "Keep your elbows close together."],
        tip: "Training triceps with your arms overhead hits the biggest part of the muscle.",
        mistakes: ["Elbows flaring out wide.", "Arching your lower back."],
        easier: "Lighter weight, seated with back support", harder: "Slow 3-second lowering"
    },
    "Skull crusher": {
        m: "Triceps", eq: "EZ bar or dumbbells, flat bench",
        setup: "Lie on a bench holding an EZ bar over your chest, arms straight.",
        steps: ["Bend your elbows to lower the bar toward your forehead or just behind your head.", "Keep your upper arms still.", "Extend back up.", "Squeeze."],
        tip: "Lowering behind your head instead of to your forehead is kinder to the elbows.",
        mistakes: ["Elbows flaring out.", "Going too heavy."],
        easier: "Triceps pushdown", harder: "Slow 3-second lowering"
    },
    "Assisted dip": {
        m: "Triceps, chest, front shoulders", eq: "Assisted dip machine or dip bars", aka: "assisted dip machine, gravitron dip",
        setup: "Kneel or stand on the assist platform and grip the bars, arms straight.",
        steps: ["Lower yourself by bending your elbows until your upper arms are about parallel to the floor.", "Keep your shoulders down, away from your ears.", "Press back up.", "Use less help over time."],
        tip: "Only go as deep as your shoulders feel good.",
        mistakes: ["Dropping too deep too fast.", "Shoulders shrugging up."],
        easier: "More assistance, or bench dips", harder: "Bodyweight dips"
    },

    /* ---------- Core ---------- */
    "Plank": {
        kit: "none", m: "Core", eq: "Floor",
        setup: "Forearms on the floor, elbows under your shoulders, legs straight behind you.",
        steps: ["Lift your hips so your body is a straight line from head to heels.", "Squeeze your glutes and brace your stomach.", "Breathe normally.", "Hold for the time listed."],
        tip: "Squeeze your glutes. It instantly makes the plank harder and protects your lower back.",
        mistakes: ["Hips sagging.", "Butt sticking up high.", "Holding your breath."],
        easier: "Plank on your knees", harder: "Lift one foot off the floor"
    },
    "Dead bug": {
        kit: "none", m: "Core", eq: "Floor",
        setup: "Lie on your back with your arms pointing straight up and your knees bent at 90 degrees over your hips.",
        steps: ["Press your lower back into the floor.", "Slowly lower your opposite arm and leg toward the floor.", "Stop before your back starts to arch.", "Return, and switch sides."],
        tip: "Your lower back stays glued to the floor. Go only as far as you can keep it there.",
        mistakes: ["Lower back arching off the floor.", "Rushing."],
        easier: "Move only your legs", harder: "Hold a light weight in your hands"
    },
    "Ab wheel rollout": {
        m: "Core, lats", eq: "Ab wheel",
        setup: "Kneel on a mat holding the ab wheel under your shoulders.",
        steps: ["Brace and tuck your pelvis slightly.", "Roll forward slowly, keeping your back flat.", "Go only as far as you can without your hips sagging.", "Pull back to the start using your stomach."],
        tip: "Short and solid beats long and saggy. Increase the distance over weeks.",
        mistakes: ["Lower back sagging.", "Leading with your hips on the way back."],
        easier: "Plank, or roll toward a wall to limit the distance", harder: "Roll out farther"
    },
    "Bird dog": {
        kit: "none", m: "Core, lower back, glutes", eq: "Floor",
        setup: "Get on your hands and knees, hands under shoulders, knees under hips, back flat.",
        steps: ["Reach one arm forward and the opposite leg back at the same time.", "Hold for 2 seconds without your hips tipping.", "Return.", "Switch sides."],
        tip: "Pretend there's a glass of water on your lower back. Don't spill it.",
        mistakes: ["Arching your back.", "Rushing."],
        easier: "Move only an arm or only a leg", harder: "Hold 5 seconds per rep"
    },
    "Side plank": {
        kit: "none", m: "Obliques, core, hips", eq: "Floor",
        setup: "Lie on your side with your elbow under your shoulder and your legs stacked.",
        steps: ["Lift your hips so your body forms a straight line.", "Don't let your hips sag.", "Hold for the time listed.", "Switch sides."],
        tip: "Push your top hip toward the ceiling.",
        mistakes: ["Hips sagging.", "Rolling forward or back."],
        easier: "Side plank on your knees", harder: "Lift your top leg"
    },
    "Pallof press": {
        m: "Core (anti-rotation)", eq: "Cable machine or resistance band",
        setup: "Set a cable at chest height. Stand side-on to the machine holding the handle at your chest with both hands, and step away until there's tension.",
        steps: ["Press the handle straight out in front of you.", "Don't let the cable twist you toward the machine.", "Hold for 2 seconds.", "Bring it back. Finish one side, then switch."],
        tip: "The work is in resisting the twist.",
        mistakes: ["Rotating toward the machine.", "Leaning away."],
        easier: "Lighter weight", harder: "Hold the press out for 5 seconds"
    },
    "Suitcase carry": {
        kit: "db", m: "Obliques, core, grip", eq: "One dumbbell or kettlebell",
        setup: "Stand holding a heavy dumbbell in one hand at your side.",
        steps: ["Walk tall without leaning toward the weight.", "Keep your shoulders level.", "Walk the distance listed.", "Switch hands and walk back."],
        tip: "Stay perfectly upright. The weight is trying to tip you over, and your core says no.",
        mistakes: ["Leaning to one side.", "Rushing with sloppy steps."],
        easier: "Lighter weight", harder: "Heavier weight or a longer walk"
    },
    "Farmer carry": {
        kit: "db", m: "Grip, traps, core", eq: "Two heavy dumbbells or kettlebells",
        setup: "Stand between two heavy dumbbells, deadlift them up, and stand tall.",
        steps: ["Walk with short, quick steps.", "Keep your shoulders back and down.", "Brace your stomach.", "Set the weights down safely at the end."],
        tip: "Pick weights heavy enough that your grip is the challenge by the end.",
        mistakes: ["Shrugging your shoulders.", "Leaning forward."],
        easier: "Lighter weights, shorter walk", harder: "Heavier weights"
    },
    "Cable crunch": {
        m: "Abs", eq: "Cable machine with a rope",
        setup: "Set a rope on the high pulley. Kneel facing the machine, holding the rope beside your head.",
        steps: ["Crunch down, bringing your elbows toward your knees.", "Round your spine. Don't just bend at the hips.", "Squeeze your abs.", "Return slowly."],
        tip: "Your hips stay still. All the movement comes from curling your spine.",
        mistakes: ["Sitting back on your heels to move the weight.", "Pulling with your arms."],
        easier: "Lighter weight", harder: "Pause at the bottom"
    },
    "Hanging knee raise": {
        m: "Abs, hip flexors, grip", eq: "Pull-up bar or captain's chair",
        setup: "Hang from a bar (or support yourself on a captain's chair).",
        steps: ["Raise your knees toward your chest.", "Curl your hips up at the top.", "Lower slowly without swinging.", "Repeat."],
        tip: "Curling your hips up at the end is what works your abs.",
        mistakes: ["Swinging for momentum.", "Dropping your legs quickly."],
        easier: "Lying leg raise", harder: "Straight-leg raise"
    },
    "Lying leg raise": {
        kit: "none", m: "Abs, hip flexors", eq: "Floor",
        setup: "Lie on your back, hands under your hips or at your sides, legs straight.",
        steps: ["Press your lower back into the floor.", "Raise your legs until they point up.", "Lower slowly, stopping before your back arches.", "Repeat."],
        tip: "Bend your knees if your lower back lifts off the floor.",
        mistakes: ["Lower back arching.", "Dropping your legs quickly."],
        easier: "Bent-knee leg raise", harder: "Hanging knee raise"
    },
    "Reverse crunch": {
        kit: "none", m: "Abs (lower)", eq: "Floor or bench",
        setup: "Lie on your back with your knees bent and feet off the floor, hands at your sides.",
        steps: ["Curl your hips up off the floor, bringing your knees toward your chest.", "Squeeze your abs.", "Lower slowly.", "Repeat."],
        tip: "A small hip curl done right beats a big swing.",
        mistakes: ["Using momentum.", "Pushing your hands into the floor to help."],
        easier: "Smaller range", harder: "Do it on a decline bench"
    },

    /* ---------- Conditioning ---------- */
    "Bike intervals": {
        m: "Heart and lungs, legs", eq: "Stationary bike",
        setup: "Adjust the seat so your knee is slightly bent at the bottom of the pedal stroke. Warm up 3 to 5 minutes.",
        steps: ["Pedal hard for the work time listed, enough that talking is tough.", "Pedal easy for the rest time.", "Repeat for the number of rounds.", "Cool down for a few minutes."],
        tip: "'Hard' means about an 8 out of 10, not an all-out sprint, for most people.",
        mistakes: ["Skipping the warm-up.", "Going all-out on round one and dying by round three."],
        easier: "Brisk incline walk for 15 minutes", harder: "Add a round or more resistance"
    },
    "Rower intervals": {
        m: "Heart and lungs, legs, back", eq: "Rowing machine",
        setup: "Strap your feet in. Sit tall holding the handle. Warm up 3 to 5 minutes.",
        steps: ["Push with your legs first, then lean back slightly, then pull the handle to your lower ribs.", "Reverse: arms, then body, then legs.", "Row hard for the work time, easy for the rest.", "Repeat for the rounds listed."],
        tip: "It's about 60% legs. Push the floor away before you pull.",
        mistakes: ["Pulling with your arms first.", "Hunching your back."],
        easier: "Shorter work periods", harder: "More rounds"
    },
    "Sled push": {
        m: "Legs, heart and lungs", eq: "Weight sled and turf lane",
        setup: "Load a light to moderate sled. Grip the high or low handles with arms extended.",
        steps: ["Lean in at about 45 degrees.", "Drive with short, powerful steps.", "Push the distance listed.", "Rest, then repeat."],
        tip: "Low impact on the joints, which makes it great for conditioning.",
        mistakes: ["Loading it so heavy you crawl.", "Standing too upright."],
        easier: "Lighter sled", harder: "Heavier sled or more rounds"
    },
    "Incline walk intervals": {
        m: "Heart and lungs, legs", eq: "Treadmill",
        setup: "Start walking at an easy pace on a slight incline for 3 minutes.",
        steps: ["Raise the incline (about 8 to 12%) and walk briskly for the work time.", "Lower to an easy incline for the rest time.", "Repeat.", "Cool down."],
        tip: "Don't hold the rails. Let your legs do the work.",
        mistakes: ["Hanging onto the handrails.", "Too steep to keep good posture."],
        easier: "Lower incline", harder: "Higher incline or longer work periods"
    },
    "Incline treadmill walk": {
        m: "Heart and lungs, legs", eq: "Treadmill",
        setup: "Set an incline of about 5 to 10% and a pace where you can still talk in full sentences.",
        steps: ["Walk steadily for the time listed.", "Stand tall and swing your arms.", "Keep the pace even.", "Cool down for a couple of minutes."],
        tip: "This should feel 'comfortably hard', a 5 or 6 out of 10.",
        mistakes: ["Holding the handrails.", "Leaning way forward."],
        easier: "Lower incline", harder: "Higher incline"
    },
    "Incline walk or easy bike": {
        m: "Heart and lungs", eq: "Treadmill or stationary bike",
        setup: "Choose whichever you enjoy. Start easy for a few minutes.",
        steps: ["Settle into a pace where you can talk but not sing.", "Keep it steady for the time listed.", "Listen to a podcast or music.", "Ease off for the last few minutes."],
        tip: "This is easy cardio that helps recovery. It shouldn't wipe you out.",
        mistakes: ["Turning it into a hard workout."],
        easier: "Shorter time", harder: "Longer time"
    },
    "Stair climber": {
        m: "Heart and lungs, glutes, legs", eq: "Stair climber machine",
        setup: "Start at a slow, steady step rate.",
        steps: ["Climb with your whole foot on each step.", "Stand tall.", "Keep a pace you can hold for the time listed.", "Slow down for the last couple of minutes."],
        tip: "Light touch on the rails, or none at all.",
        mistakes: ["Leaning on the rails with your full weight.", "Going too fast and getting sloppy."],
        easier: "Slower pace", harder: "Faster pace"
    },
    "Stretching or mobility": {
        kit: "none", m: "Hips, shoulders, back", eq: "Floor or mat",
        setup: "Find some open floor. Go easy. Stretching should never hurt.",
        steps: ["Hip flexor stretch: 30 seconds per side.", "Hamstring stretch: 30 seconds per side.", "Chest stretch in a doorway: 30 seconds.", "Cat-cow on hands and knees: 10 slow reps."],
        tip: "Breathe slowly and relax into each stretch.",
        mistakes: ["Bouncing.", "Forcing a stretch until it hurts."],
        easier: "Shorter holds", harder: "Add a few minutes"
    },

    /* ---------- More cardio ---------- */
    "Easy jog": {
        kit: "none", m: "Heart and lungs, legs", eq: "Running shoes",
        setup: "Start with 3 to 5 minutes of brisk walking to warm up.",
        steps: ["Jog at a pace where you could still talk in short sentences.", "Land softly with your feet under you, not way out in front.", "Walk for a minute whenever you need to; that's normal.", "Walk for the last few minutes to cool down."],
        tip: "New to running? Alternate 1 minute jogging with 2 minutes walking, and shift the balance over the weeks.",
        mistakes: ["Starting too fast.", "Adding distance too quickly. Increase by about 10% a week at most."],
        easier: "Walk-jog intervals", harder: "Longer jog, or add a few faster minutes"
    },
    "Run/walk intervals": {
        kit: "none", m: "Heart and lungs, legs", eq: "Running shoes; a phone timer helps",
        setup: "Walk briskly for 5 minutes first. Set a timer, or use the free NHS Couch to 5K app, which tells you when to switch.",
        steps: ["Run at a gentle pace you could still talk at.", "When the timer says walk, walk briskly; don't stop completely.", "Repeat the pattern for today's run.", "Walk for 5 minutes at the end to cool down."],
        tip: "Slower than you think. If you can't say a short sentence while running, ease off.",
        mistakes: ["Starting too fast and having nothing left for the later runs.", "Skipping rest days. Run every other day."],
        easier: "Repeat last week's runs; that's part of the plan", harder: "Move on to next week's runs"
    },
    "Continuous run": {
        kit: "none", m: "Heart and lungs, legs", eq: "Running shoes",
        setup: "Walk briskly for 5 minutes first.",
        steps: ["Start slower than feels necessary.", "Keep a steady, conversational pace for the whole time.", "If you need to, slow to a shuffle rather than stopping.", "Walk for 5 minutes at the end."],
        tip: "Time on your feet is the goal, not speed. Speed comes later.",
        mistakes: ["Running every run as fast as you can.", "Adding time too quickly once you can run 30 minutes."],
        easier: "Go back a week, or add a 1-minute walk in the middle", harder: "Keep the same time and add one run a week"
    },
    "Elliptical": {
        m: "Heart and lungs, legs", eq: "Elliptical machine",
        setup: "Step on, hold the handles, and start at a low resistance.",
        steps: ["Push and pull the handles while you stride.", "Keep your whole foot on the pedals.", "Stand tall rather than leaning on the handles.", "Hold a steady pace for the time listed."],
        tip: "Very easy on the joints, which makes it a great choice on sore days or with achy knees.",
        mistakes: ["Leaning your weight onto the console.", "Resistance so low you're just coasting."],
        easier: "Lower resistance", harder: "Higher resistance or incline"
    },
    "Steady row": {
        m: "Heart and lungs, legs, back", eq: "Rowing machine",
        setup: "Strap your feet in, set the damper around 3 to 5, and sit tall.",
        steps: ["Push with your legs, then lean back slightly, then pull the handle to your lower ribs.", "Reverse it: arms, body, then legs.", "Keep a steady, comfortable stroke rate (about 20 to 24 strokes a minute).", "Row for the time listed."],
        tip: "Legs first, every stroke. It's mostly a leg exercise.",
        mistakes: ["Pulling with your arms first.", "Damper set too high, which feels like rowing through mud."],
        easier: "Shorter session", harder: "Longer session or a slightly higher stroke rate"
    },
    "Outdoor bike ride": {
        m: "Heart and lungs, legs", eq: "Bike and helmet",
        setup: "Check your tires and brakes and wear a helmet. Pick a route you know.",
        steps: ["Ride at a pace where you can talk.", "Use easy gears on hills.", "Ride for the time listed.", "Spin easy for the last few minutes."],
        tip: "Easy rides count. Not every session has to be hard.",
        mistakes: ["Riding in gears so hard your knees ache.", "Skipping the helmet."],
        easier: "Flat route", harder: "Add some hills"
    },

    /* ---------- At home, no equipment ---------- */
    "Bodyweight squat": {
        kit: "none", m: "Quads, glutes", eq: "Bodyweight",
        setup: "Stand with your feet a little wider than your shoulders, toes turned out slightly. Arms out in front for balance.",
        steps: ["Sit down and back like there's a chair behind you.", "Keep your chest up and your heels on the floor.", "Go as low as is comfortable, ideally thighs parallel to the floor.", "Stand back up by pushing the floor away."],
        tip: "Too easy? Slow down: 3 seconds down, 1 second pause, then stand.",
        mistakes: ["Heels lifting.", "Knees caving in.", "Rushing through tiny half reps."],
        easier: "Squat down to a chair and stand back up", harder: "Pause squat, or hold a heavy backpack"
    },
    "Incline push-up": {
        kit: "none", m: "Chest, shoulders, triceps, core", eq: "A sturdy table, counter, or bench",
        setup: "Put your hands on the edge of a sturdy counter or bench, slightly wider than your shoulders. Walk your feet back until your body is a straight line.",
        steps: ["Brace your stomach and squeeze your glutes.", "Lower your chest to the edge.", "Push back up as one solid piece.", "Keep your elbows at about 45 degrees."],
        tip: "The higher your hands, the easier it is. Go lower over the weeks until you can do regular push-ups.",
        mistakes: ["Hips sagging.", "Using something that can slide or tip."],
        easier: "Hands on a wall", harder: "Push-up on the floor"
    },
    "Pike push-up": {
        kit: "none", m: "Shoulders, triceps", eq: "Bodyweight",
        setup: "Start in a push-up position, then walk your feet in and lift your hips high so your body makes an upside-down V.",
        steps: ["Bend your elbows and lower the top of your head toward the floor between your hands.", "Keep your hips high.", "Push back up.", "Move slowly."],
        tip: "This is the home version of a shoulder press. The more upright your body, the harder it gets.",
        mistakes: ["Dropping your hips into a regular push-up.", "Flaring your elbows straight out."],
        easier: "Smaller range, or hands on a low step", harder: "Feet up on a chair"
    },
    "Backpack row": {
        kit: "none", m: "Upper back, lats, biceps", eq: "A backpack loaded with books or water bottles",
        setup: "Hold a loaded backpack by the top handle or both straps. Hinge forward at your hips with a flat back and soft knees, arms hanging down.",
        steps: ["Pull the backpack up to your stomach, driving your elbows back.", "Squeeze your shoulder blades together.", "Lower it slowly.", "Keep your back flat the whole set."],
        tip: "Load the bag so the last few reps are hard. Books and water bottles both work.",
        mistakes: ["Rounding your back.", "Jerking the bag up with your hips."],
        easier: "Lighter bag, or support one hand on a table and row one side at a time", harder: "Heavier bag, or pause at the top"
    },
    "Wall sit": {
        kit: "none", m: "Quads", eq: "A wall",
        setup: "Lean your back against a wall and walk your feet out about two feet.",
        steps: ["Slide down until your knees are bent to about 90 degrees.", "Keep your back flat against the wall.", "Hold for the time listed.", "Breathe normally."],
        tip: "Not as low as 90 degrees yet? Hold higher. It still works.",
        mistakes: ["Knees drifting in front of your toes.", "Holding your breath."],
        easier: "Hold higher on the wall", harder: "Hold longer, or hold a backpack on your lap"
    },
    "Brisk walk": {
        kit: "none", m: "Heart and lungs, legs", eq: "Shoes",
        setup: "Head outside or onto a treadmill. Start easy for a couple of minutes.",
        steps: ["Walk fast enough that you could talk, but not sing.", "Swing your arms.", "Keep the pace for the time listed.", "Slow down for the last couple of minutes."],
        tip: "A daily walk is one of the best habits for fat loss and general health. Make it a routine.",
        mistakes: ["Strolling too slowly to raise your heart rate."],
        easier: "Shorter walk", harder: "Find some hills"
    }
};

// Exercises that can stand in for each other. The first one is the default.
const EXERCISE_FAMILIES = [
    // Squats and legs
    ["Goblet squat", "Leg press", "Hack squat", "Smith machine squat"],
    ["Leg press", "Hack squat", "Smith machine squat", "Goblet squat"],
    ["Front squat", "Hack squat", "Smith machine squat"],
    ["Walking lunge", "Reverse lunge", "Bulgarian split squat", "Step-up", "Split squat"],
    ["Romanian deadlift", "Dumbbell Romanian deadlift", "Back extension", "Cable pull-through"],
    ["Glute bridge", "Hip thrust", "Single-leg glute bridge", "Cable pull-through"],
    ["Hip abduction machine", "Cable glute kickback", "Single-leg glute bridge"],
    ["Hamstring curl machine", "Seated hamstring curl", "Lying hamstring curl", "Stability ball leg curl"],
    ["Standing calf raise", "Seated calf raise", "Leg press calf raise", "Single-leg calf raise"],
    // Chest
    ["Dumbbell bench press", "Machine chest press", "Push-up"],
    ["Incline dumbbell press", "Incline machine press", "Incline barbell press"],
    ["Cable fly", "Pec deck", "Dumbbell fly", "Low-to-high cable fly"],
    // Back
    ["Lat pulldown", "Close-grip lat pulldown", "Pull-up", "Assisted pull-up"],
    ["Seated cable row", "Chest-supported row", "Chest-supported dumbbell row", "Single-arm dumbbell row", "Single-arm cable row", "Machine row"],
    // Shoulders
    ["Seated dumbbell shoulder press", "Dumbbell shoulder press", "Machine shoulder press", "Arnold press"],
    ["Lateral raise", "Cable lateral raise", "Machine lateral raise", "Lean-away lateral raise"],
    ["Rear delt fly", "Face pull", "Reverse pec deck", "Cable rear delt fly"],
    // Arms
    ["Dumbbell curl", "EZ-bar curl", "Barbell curl", "Incline dumbbell curl", "Hammer curl", "Cable curl", "Preacher curl"],
    ["Triceps pushdown", "Rope pushdown", "Overhead triceps extension", "Skull crusher", "Assisted dip"],
    // Core
    ["Plank", "Dead bug", "Ab wheel rollout", "Bird dog"],
    ["Side plank", "Pallof press", "Suitcase carry"],
    ["Cable crunch", "Hanging knee raise", "Lying leg raise", "Reverse crunch"],
    ["Farmer carry", "Suitcase carry"],
    // At home
    ["Bodyweight squat", "Split squat", "Reverse lunge", "Step-up"],
    ["Push-up", "Incline push-up"],
    // Conditioning
    ["Bike intervals", "Rower intervals", "Sled push", "Incline walk intervals"],
    ["Incline treadmill walk", "Stair climber", "Incline walk or easy bike", "Elliptical", "Steady row", "Easy jog", "Brisk walk", "Outdoor bike ride"]
];
