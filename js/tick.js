/* ==========================================================
   CLOCK TICK SOUND
   Plays the supplied clock-tick sound once for every
   countdown second.
========================================================== */

(function () {
    let enabled = false;
    let armed = false;

    const btn = document.getElementById("tickToggle");

    /*
     * Use the supplied clock ticking sound.
     *
     * IMPORTANT:
     * Change this path if your MP3 is stored somewhere else.
     */
    const tickAudio = new Audio("assets/tick/clock-tick.mp3");

    tickAudio.preload = "auto";

    /*
     * Keep the volume gentle.
     * Adjust between 0.0 and 1.0 if needed.
     */
    tickAudio.volume = 0.55;


    /* ======================================================
       PLAY ONE CLOCK TICK
    ====================================================== */

    function playDrop() {
        if (!enabled || !armed) return;

        /*
         * Restart the audio from the beginning.
         *
         * This means every countdown second gets the exact
         * same clock tick.
         */
        try {
            tickAudio.pause();
            tickAudio.currentTime = 0;

            const playPromise = tickAudio.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        } catch (e) {
            /* Ignore playback errors */
        }
    }


    /* ======================================================
       PUBLIC HOOK
       Your existing countdown can continue calling:

           window.__tick();

    ====================================================== */

    window.__tick = function () {
        playDrop();
    };


    /* ======================================================
       UNLOCK AUDIO AFTER REAL USER INTERACTION
       Required by iOS/Safari/mobile browsers.
    ====================================================== */

    function arm() {
        if (armed) return;

        armed = true;

        /*
         * Load the audio during the user's gesture.
         */
        try {
            tickAudio.load();

            /*
             * Start and immediately pause it.
             * This unlocks the audio element on browsers that
             * require a user gesture.
             */
            tickAudio.currentTime = 0;

            const p = tickAudio.play();

            if (p !== undefined) {
                p.then(() => {
                    tickAudio.pause();
                    tickAudio.currentTime = 0;
                }).catch(() => {});
            }
        } catch (e) {
            /* Ignore unlock errors */
        }

        window.removeEventListener("touchend", arm);
        window.removeEventListener("pointerdown", arm);
        window.removeEventListener("mousedown", arm);
        window.removeEventListener("keydown", arm);
    }


    window.addEventListener("touchend", arm, { passive: true });
    window.addEventListener("pointerdown", arm, { passive: true });
    window.addEventListener("mousedown", arm, { passive: true });
    window.addEventListener("keydown", arm);


    /* ======================================================
       MUTE / UNMUTE BUTTON
    ====================================================== */

    function render() {
        if (!btn) return;

        btn.classList.toggle("muted", !enabled);

        btn.setAttribute(
            "aria-pressed",
            enabled ? "true" : "false"
        );

        btn.title = enabled
            ? "Mute tick sound"
            : "Unmute tick sound";

        btn.innerHTML = enabled
            ? '<i class="fa-solid fa-clock"></i>'
            : '<i class="fa-solid fa-volume-xmark"></i>';
    }


    if (btn) {
        render();

        btn.addEventListener("click", () => {
            enabled = !enabled;

            /*
             * The button itself is a real user gesture,
             * so it can also unlock audio.
             */
            armed = true;

            if (enabled) {
                try {
                    tickAudio.load();
                } catch (e) {}
            }

            render();
        });
    }

})();