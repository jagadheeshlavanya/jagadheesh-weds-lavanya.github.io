/* ==========================================================
   LOADER + LUXURY INVITATION
========================================================== */

const loader = document.getElementById("loader");
const openInvitation = document.getElementById("openInvitation");
const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

// Prevent scrolling until invitation is opened
document.body.style.overflow = "hidden";

// Safety net: ensure the button is visible even if GSAP fails to load
// or errors out before it can reveal it via animation.
if (openInvitation) {
    openInvitation.style.opacity = "1";
}

/* ==========================================================
   OPEN INVITATION
========================================================== */

openInvitation.addEventListener("click", () => {

    // Disable button to prevent multiple clicks
    openInvitation.disabled = true;

    // Animate invitation card before hiding
    gsap.to(".invitation-card", {
        duration: 0.7,
        scale: 1.05,
        opacity: 0,
        ease: "power2.inOut"
    });

    // Fade loader
    gsap.to(loader, {
        duration: 1,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => {

            loader.style.display = "none";

            document.body.style.overflow = "auto";

            bgMusic.play().catch(() => {});

            musicButton.classList.add("playing");

            // Hero entrance animation
            gsap.from("#hero .hero-content", {
                opacity: 0,
                y: 80,
                duration: 1.5,
                ease: "power3.out"
            });

            gsap.from(".hero-image", {
                scale: 1.15,
                duration: 2,
                ease: "power2.out"
            });

        }
    });

});

/* ==========================================================
   HERO FADE ON SCROLL
========================================================== */

window.addEventListener("scroll", () => {

    const hero = document.querySelector(".hero-content");

    if (!hero) return;

    const value = window.scrollY * 0.002;

    hero.style.opacity = Math.max(1 - value, 0);

});

/* ==========================================================
   INTRO ANIMATIONS
========================================================== */

window.addEventListener("DOMContentLoaded", () => {

    // Wrapped in try/catch so a single failure (e.g. GSAP not loaded,
    // a selector mismatch) can't leave elements permanently hidden.
    try {

        gsap.from(".invitation-card", {
            duration: 1.2,
            y: 80,
            scale: 0.85,
            opacity: 0,
            ease: "power4.out"
        });

        gsap.from(".invite-title", {
            duration: 1,
            opacity: 0,
            y: -20,
            delay: 0.7
        });

        gsap.from(".invitation-content h1", {
            duration: 1,
            opacity: 0,
            y: 30,
            stagger: 0.15,
            delay: 0.9
        });

        gsap.from(".and", {
            duration: 0.8,
            opacity: 0,
            scale: 0,
            delay: 1.2,
            ease: "back.out(2)"
        });

        gsap.from(".invite-text", {
            duration: 1,
            opacity: 0,
            y: 20,
            delay: 1.4
        });

        gsap.from(".invitation-content h2", {
            duration: 1,
            opacity: 0,
            scale: 0.8,
            delay: 1.6
        });

        // Changed from gsap.from() to gsap.fromTo() so the "from" state
        // (opacity:0) and the "to" state (opacity:1) are both explicit.
        // This guarantees the button ends fully visible once the tween
        // completes, rather than relying on default/implicit end values.
        gsap.fromTo("#openInvitation",
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 1.8,
                ease: "power3.out"
            }
        );

    } catch (err) {

        console.error("GSAP intro animation failed:", err);

        // Fallback: if GSAP errored out partway through, force every
        // intro element back to fully visible so nothing stays stuck
        // at opacity:0 forever.
        document.querySelectorAll(
            ".invitation-card, .invite-title, .invitation-content h1, .and, .invite-text, .invitation-content h2, #openInvitation"
        ).forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });

    }

});