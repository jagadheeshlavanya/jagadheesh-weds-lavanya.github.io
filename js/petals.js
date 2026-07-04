/* ==========================================================
   PREMIUM FLOATING ROSE PETALS
========================================================== */

const petalsContainer = document.getElementById("petals-container");

if (petalsContainer) {

    const petals = [
        "🌸",
        "🌺",
        "🌹",
        "💮"
    ];

    function createPetal() {

        const petal = document.createElement("span");

        petal.className = "rose-petal";

        petal.innerHTML =
            petals[Math.floor(Math.random() * petals.length)];

        const size = Math.random() * 18 + 18;

        petal.style.fontSize = `${size}px`;

        petal.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 8 + 10;

        petal.style.animationDuration = `${duration}s`;

        const delay = Math.random() * 2;

        petal.style.animationDelay = `${delay}s`;

        petal.style.opacity =
            (Math.random() * 0.5 + 0.4).toFixed(2);

        petal.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        petalsContainer.appendChild(petal);

        setTimeout(() => {

            petal.remove();

        }, (duration + delay) * 1000);

    }

    // Initial petals

    for (let i = 0; i < 20; i++) {

        setTimeout(createPetal, i * 300);

    }

    // Keep generating petals

    setInterval(createPetal, 700);

}