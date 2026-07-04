/* ==========================================================
   WEDDING COUNTDOWN
========================================================== */

// Wedding Date
// 23 August 2026, 03:49 AM

const weddingDate = new Date("2026-08-23T03:49:00").getTime();

// Countdown Elements

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {

    const now = new Date().getTime();

    const difference = weddingDate - now;

    // Wedding completed

    if (difference <= 0) {

        clearInterval(countdownInterval);

        daysElement.innerHTML = "00";
        hoursElement.innerHTML = "00";
        minutesElement.innerHTML = "00";
        secondsElement.innerHTML = "00";

        const title = document.querySelector("#countdown .section-title h2");

        if (title) {
            title.innerHTML = "We're Married! ❤️";
        }

        const subtitle = document.querySelector("#countdown .section-title p");

        if (subtitle) {
            subtitle.innerHTML =
                "Thank you for being part of our beautiful journey.";
        }

        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60)) /
        1000
    );

    daysElement.textContent = String(days).padStart(3, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

}

// Initial Load

updateCountdown();

// Update Every Second

const countdownInterval = setInterval(updateCountdown, 1000);