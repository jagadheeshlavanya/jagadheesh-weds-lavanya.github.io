/* ==========================================================
   FLOATING HEARTS & LOVE SYMBOLS
========================================================== */

const container = document.getElementById("petals-container");

/* const symbols = [
    "❤",
    "♥",
    "💕",
    "💖",
    "💗",
    "💘",
    "💞",
    "🤍"
]; */

const symbols = [
    "💞", "💖"
];

function createHeart() {

    const heart = document.createElement("span");

    heart.className = "floating-heart";

    heart.innerHTML =
        symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize = (18 + Math.random() * 22) + "px";

    heart.style.animationDuration =
        (8 + Math.random() * 6) + "s";

    heart.style.animationDelay =
        Math.random() * 2 + "s";

    heart.style.opacity =
        0.5 + Math.random() * 0.5;

    heart.style.transform =
        `rotate(${Math.random() * 360}deg)`;

    container.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 15000);

}

setInterval(createHeart, 350);