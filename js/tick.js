/* ==========================================================
   SOOTHING WATER-DROP TICK  — plays once per second with the
   countdown. On by default; a small button mutes/unmutes.

   Sound design: a layered droplet — a warm sine "body" that
   glides gently downward, a soft high "shimmer" overtone for
   sparkle, and a faint short echo for a touch of natural
   ambience. Everything is synthesized with the Web Audio API,
   so there's no audio file to host or download.

   Mobile note: iOS/Safari and most mobile browsers only allow
   audio after a real user gesture (tap), and the AudioContext
   must be created/resumed *inside* that gesture's event
   handler — not later via a promise or timeout. This file
   listens for the first tap/click/key anywhere on the page
   (touchend, pointerdown, mousedown, keydown) and immediately
   creates + unlocks the context then, so ticking begins as
   soon as the guest interacts (e.g. taps "Open Invitation").
========================================================== */

(function () {
    let ctx = null;
    let enabled = true;          // on by default
    let armed = false;           // becomes true after a user gesture
    let unlocked = false;        // iOS silent-buffer unlock done

    const btn = document.getElementById("tickToggle");

    function ensureCtx() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            try { ctx = new AC(); } catch (e) { return null; }
        }
        if (ctx.state === "suspended") {
            ctx.resume().catch(() => {});
        }
        return ctx;
    }

    /* iOS/Safari sometimes needs a silent buffer played once,
       synchronously inside the gesture, to fully unlock audio. */
    function unlockIOS(c) {
        if (unlocked || !c) return;
        try {
            const buffer = c.createBuffer(1, 1, 22050);
            const src = c.createBufferSource();
            src.buffer = buffer;
            src.connect(c.destination);
            if (src.start) src.start(0);
            else if (src.noteOn) src.noteOn(0);
            unlocked = true;
        } catch (e) { /* no-op */ }
    }

    /* ---------- The soothing droplet sound ---------- */
    function playDrop() {
        const c = ensureCtx();
        if (!c) return;
        const t = c.currentTime;

        // Tiny per-tick pitch variation so it feels natural, not mechanical
        const jitter = (Math.random() * 30) - 15;
        const baseFreq = 900 + jitter;

        // Master gain — keeps the whole tick gentle and unobtrusive
        const master = c.createGain();
        master.gain.value = 0.85;
        master.connect(c.destination);

        let pannerNode = master;
        if (c.createStereoPanner) {
            const panner = c.createStereoPanner();
            panner.pan.value = (Math.random() * 0.5) - 0.25;
            panner.connect(c.destination);
            master.disconnect();
            master.connect(panner);
            pannerNode = panner;
        }

        /* --- Body tone: warm downward glide, like a drop hitting water --- */
        const body = c.createOscillator();
        body.type = "sine";
        body.frequency.setValueAtTime(baseFreq, t);
        body.frequency.exponentialRampToValueAtTime(baseFreq * 0.34, t + 0.32);

        const bodyFilter = c.createBiquadFilter();
        bodyFilter.type = "lowpass";
        bodyFilter.frequency.setValueAtTime(2400, t);
        bodyFilter.frequency.exponentialRampToValueAtTime(650, t + 0.38);
        bodyFilter.Q.value = 0.6;

        const bodyGain = c.createGain();
        bodyGain.gain.setValueAtTime(0.0001, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.13, t + 0.018);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

        body.connect(bodyFilter);
        bodyFilter.connect(bodyGain);
        bodyGain.connect(master);

        /* --- Shimmer overtone: a soft high sparkle, fades fast --- */
        const shimmer = c.createOscillator();
        shimmer.type = "sine";
        shimmer.frequency.setValueAtTime(baseFreq * 2.15, t);
        shimmer.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, t + 0.13);

        const shimmerFilter = c.createBiquadFilter();
        shimmerFilter.type = "lowpass";
        shimmerFilter.frequency.value = 3600;

        const shimmerGain = c.createGain();
        shimmerGain.gain.setValueAtTime(0.0001, t);
        shimmerGain.gain.exponentialRampToValueAtTime(0.045, t + 0.008);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

        shimmer.connect(shimmerFilter);
        shimmerFilter.connect(shimmerGain);
        shimmerGain.connect(master);

        /* --- Faint echo: a touch of ambience so it doesn't feel dry --- */
        const delay = c.createDelay();
        delay.delayTime.value = 0.055 + Math.random() * 0.02;

        const echoFilter = c.createBiquadFilter();
        echoFilter.type = "lowpass";
        echoFilter.frequency.value = 850;

        const echoGain = c.createGain();
        echoGain.gain.setValueAtTime(0.0001, t);
        echoGain.gain.exponentialRampToValueAtTime(0.045, t + 0.06);
        echoGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

        bodyGain.connect(delay);
        delay.connect(echoFilter);
        echoFilter.connect(echoGain);
        echoGain.connect(master);

        body.start(t);
        body.stop(t + 0.42);
        shimmer.start(t);
        shimmer.stop(t + 0.18);
    }

    /* Public hook called by the countdown each second. */
    window.__tick = function () {
        if (enabled && armed) playDrop();
    };

    /* Arm + unlock audio on the very first user interaction, using
       every gesture type mobile browsers recognize. Runs once. */
    function arm() {
        if (armed) return;
        armed = true;
        const c = ensureCtx();
        unlockIOS(c);
        window.removeEventListener("touchend", arm);
        window.removeEventListener("pointerdown", arm);
        window.removeEventListener("mousedown", arm);
        window.removeEventListener("keydown", arm);
    }
    window.addEventListener("touchend", arm, { passive: true });
    window.addEventListener("pointerdown", arm, { passive: true });
    window.addEventListener("mousedown", arm, { passive: true });
    window.addEventListener("keydown", arm);

    /* Some mobile browsers suspend the context when the tab/app is
       backgrounded; resume it when the guest comes back. */
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && ctx && ctx.state === "suspended") {
            ctx.resume().catch(() => {});
        }
    });

    /* ---------- Mute / unmute button ---------- */
    function render() {
        if (!btn) return;
        btn.classList.toggle("muted", !enabled);
        btn.setAttribute("aria-pressed", enabled ? "true" : "false");
        btn.title = enabled ? "Mute tick sound" : "Unmute tick sound";
        btn.innerHTML = enabled
            ? '<i class="fa-solid fa-droplet"></i>'
            : '<i class="fa-solid fa-droplet-slash"></i>';
    }
    if (btn) {
        render();
        btn.addEventListener("click", () => {
            enabled = !enabled;
            armed = true;
            const c = ensureCtx();
            unlockIOS(c);
            render();
        });
    }
})();
