/* Ground Up Fitness: the intro when the installed phone app opens.
   Runs before the page draws: a black cover shows right away (CSS: html.app-splash), then a short
   animated intro plays on top: a slow-zooming black-and-white gym photo, the logo bars rising,
   the name sliding in, the orange line, and the tagline. About 2.5 seconds, once per launch,
   and a tap skips it. With reduced motion it's a quick fade. Add ?intro=1 to any page to preview it. */
(function () {
    try {
        var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
        var preview = /[?&]intro=1\b/.test(location.search);
        if (!preview && (!standalone || sessionStorage.getItem("gu-splash"))) return;
        sessionStorage.setItem("gu-splash", "1");
        var root = document.documentElement;
        root.classList.add("app-splash");
        var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var build = function () {
            var d = document.createElement("div");
            d.className = "intro";
            d.setAttribute("aria-hidden", "true");
            d.innerHTML = '<div class="intro-photo"></div><div class="intro-shade"></div>' +
                '<div class="intro-center"><div class="intro-mark"><span></span><span></span><span></span></div>' +
                '<div class="intro-word">' + "GROUND UP".split("").map(function (c, i) { return '<span style="--i:' + i + '">' + (c === " " ? "&nbsp;" : c) + "</span>"; }).join("") + "</div>" +
                '<div class="intro-line"></div><p class="intro-tag">Nobody walks in <b>ready.</b></p></div>' +
                '<p class="intro-skip">Tap to skip</p>';
            document.body.appendChild(d);
            var finished = false;
            var done = function () {
                if (finished) return;
                finished = true;
                d.classList.add("is-out");
                root.classList.remove("app-splash");
                setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 500);
            };
            var timer = setTimeout(done, calm ? 900 : 2700);
            d.addEventListener("click", function (e) { e.preventDefault(); clearTimeout(timer); done(); });
            document.addEventListener("keydown", function () { clearTimeout(timer); done(); }, { once: true });
        };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
        else build();
    } catch (e) { /* storage blocked: skip the intro */ }
})();
