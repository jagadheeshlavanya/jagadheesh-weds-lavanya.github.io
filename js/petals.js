/* ==========================================================
   FLOATING HEARTS & LOVE SYMBOLS
   (mobile-aware: fewer hearts, slower spawn, capped total,
   pauses when tab is hidden — protects battery/perf on phones)
========================================================== */

const container = document.getElementById("petals-container");

const symbols = [
    "💞", "💖"
];

const isMobile = window.matchMedia && window.matchMedia("(max-width:768px)").matches;
const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SPAWN_INTERVAL = isMobile ? 550 : 350;   // ms between hearts
const MAX_HEARTS = isMobile ? 10 : 22;         // cap concurrent hearts on screen
let activeHearts = 0;

function createHeart() {

    if (prefersReduced) return;
    if (activeHearts >= MAX_HEARTS) return;
    if (!container) return;

    const heart = document.createElement("span");

    heart.className = "floating-heart";

    heart.innerHTML =
        symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize = (isMobile ? 16 + Math.random() * 16 : 18 + Math.random() * 22) + "px";

    heart.style.animationDuration =
        (8 + Math.random() * 6) + "s";

    heart.style.animationDelay =
        Math.random() * 2 + "s";

    heart.style.opacity =
        0.5 + Math.random() * 0.5;

    heart.style.transform =
        `rotate(${Math.random() * 360}deg)`;

    container.appendChild(heart);
    activeHearts++;

    setTimeout(() => {

        heart.remove();
        activeHearts--;

    }, 15000);

}

let petalTimer = setInterval(createHeart, SPAWN_INTERVAL);

// Pause spawning when the tab is hidden — saves battery on phones
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        clearInterval(petalTimer);
    } else if (!prefersReduced) {
        petalTimer = setInterval(createHeart, SPAWN_INTERVAL);
    }
});
