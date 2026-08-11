/* ==========================================================
   MOBILE NAVIGATION TOGGLE
========================================================== */
(function () {
    const nav = document.querySelector("nav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", () => {
        nav.classList.toggle("open");
        const open = nav.classList.contains("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
    });

    // Close menu when a link is tapped
    nav.querySelectorAll("ul a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        });
    });
})();

/* Reveal-on-scroll fallback for any .reveal elements */
(function () {
    const els = document.querySelectorAll(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
        els.forEach(el => el.classList.add("in-view"));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
})();
