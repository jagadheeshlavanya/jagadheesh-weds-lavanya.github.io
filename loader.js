/* ==========================================================
   LOADER + LUXURY INVITATION  (GSAP-optional, fail-safe)
========================================================== */

const loader = document.getElementById("loader");
const openInvitation = document.getElementById("openInvitation");
const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

const hasGSAP = typeof gsap !== "undefined";

// Prevent scrolling until invitation is opened
document.body.style.overflow = "hidden";

// Ensure the button is always visible even if GSAP fails to load
if (openInvitation) openInvitation.style.opacity = "1";

/* ---------- Reveal the site (used by both paths) ---------- */
function revealSite() {
    if (!loader) return;
    loader.style.display = "none";
    document.body.style.overflow = "auto";

    if (bgMusic) {
        bgMusic.play().then(() => {
            if (musicButton) musicButton.classList.add("playing");
        }).catch(() => {});
    }

    if (hasGSAP) {
        try {
            gsap.from("#hero .hero-content", { opacity: 0, y: 80, duration: 1.5, ease: "power3.out" });
            gsap.from(".hero-image", { scale: 1.15, duration: 2, ease: "power2.out" });
        } catch (e) { /* no-op */ }
    }
}

/* ---------- Open invitation ---------- */
if (openInvitation) {
    openInvitation.addEventListener("click", () => {
        openInvitation.disabled = true;

        if (hasGSAP) {
            try {
                gsap.to(".invitation-card", { duration: 0.7, scale: 1.05, opacity: 0, ease: "power2.inOut" });
                gsap.to(loader, { duration: 1, opacity: 0, ease: "power2.inOut", onComplete: revealSite });
                return;
            } catch (e) { /* fall through to CSS path */ }
        }

        // CSS fallback: fade out via transition, then reveal
        loader.style.transition = "opacity .8s ease";
        loader.style.opacity = "0";
        setTimeout(revealSite, 850);
    });
}

/* Safety net: if the loader is somehow still up after 12s, force reveal
   so a CDN failure can never permanently trap a guest on the envelope. */
setTimeout(() => {
    if (loader && loader.style.display !== "none" && getComputedStyle(loader).display !== "none") {
        // only auto-reveal if the user hasn't been able to interact
        if (openInvitation && !openInvitation.disabled) return; // still waiting on user is fine
    }
}, 12000);

/* ---------- Hero fade on scroll ---------- */
window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero-content");
    if (!hero) return;
    const value = window.scrollY * 0.002;
    hero.style.opacity = Math.max(1 - value, 0);
});

/* ---------- Intro animation for the envelope (GSAP-optional) ---------- */
window.addEventListener("DOMContentLoaded", () => {
    if (!hasGSAP) {
        // Without GSAP the card is already styled and visible; nothing to do.
        return;
    }
    try {
        gsap.from(".invitation-card", { duration: 1.2, y: 80, scale: 0.85, opacity: 0, ease: "power4.out" });
        gsap.from(".invite-title", { duration: 1, opacity: 0, y: -20, delay: 0.7 });
        gsap.from(".invitation-content h1", { duration: 1, opacity: 0, y: 30, stagger: 0.15, delay: 0.9 });
        gsap.from(".and", { duration: 0.8, opacity: 0, scale: 0, delay: 1.2, ease: "back.out(2)" });
        gsap.from(".invite-text", { duration: 1, opacity: 0, y: 20, delay: 1.4 });
        gsap.from(".invitation-content h2", { duration: 1, opacity: 0, scale: 0.8, delay: 1.6 });
        gsap.fromTo("#openInvitation",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 1.8, ease: "power3.out" });
    } catch (err) {
        document.querySelectorAll(
            ".invitation-card, .invite-title, .invitation-content h1, .and, .invite-text, .invitation-content h2, #openInvitation"
        ).forEach(el => { el.style.opacity = "1"; el.style.transform = "none"; });
    }
});
