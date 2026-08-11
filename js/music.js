/* ==========================================================
   BACKGROUND MUSIC TOGGLE
========================================================== */
(function () {
    const musicButton = document.getElementById("musicButton");
    const bgMusic = document.getElementById("bgMusic");
    if (!musicButton || !bgMusic) return;

    bgMusic.volume = 0.6;

    musicButton.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicButton.classList.add("playing");
            }).catch(() => {});
        } else {
            bgMusic.pause();
            musicButton.classList.remove("playing");
        }
    });

    // Keep the icon state in sync if playback changes elsewhere
    bgMusic.addEventListener("play", () => musicButton.classList.add("playing"));
    bgMusic.addEventListener("pause", () => musicButton.classList.remove("playing"));
})();
