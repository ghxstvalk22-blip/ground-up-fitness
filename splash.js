/* Ground Up Fitness: loading screen for the installed phone app.
   Runs before the page draws, so the screen shows right away. It only
   shows when the app is opened from the home screen, once per launch
   (not on every page). The look and the fade-out are in styles.css
   (html.app-splash), so it always goes away on its own. */
(function () {
    try {
        var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
        if (!standalone || sessionStorage.getItem("gu-splash")) return;
        sessionStorage.setItem("gu-splash", "1");
        document.documentElement.classList.add("app-splash");
    } catch (e) { /* storage blocked: skip the loading screen */ }
})();
