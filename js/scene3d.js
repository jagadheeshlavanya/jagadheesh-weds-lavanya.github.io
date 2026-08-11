/* ==========================================================
   3D OPENING SCENE — interlocking gold wedding rings,
   glowing hearts, and a gold particle field.
   Three.js optional: if it fails to load, the loader still
   works and simply shows the styled invitation card.
========================================================== */

(function () {
    const canvas = document.getElementById("scene3d");
    if (!canvas || typeof THREE === "undefined") return;

    const prefersReduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.matchMedia("(max-width:768px)").matches;

    let renderer, scene, camera, rings = [], hearts = [], particles;
    let raf = null, running = true;
    const clock = new THREE.Clock();

    /* ---------- Heart shape geometry ---------- */
    function heartGeometry(scale) {
        const s = new THREE.Shape();
        const x = 0, y = 0;
        s.moveTo(x, y + 0.5 * scale);
        s.bezierCurveTo(x, y + 0.8 * scale, x - 0.6 * scale, y + 1.1 * scale, x - 0.6 * scale, y + 0.5 * scale);
        s.bezierCurveTo(x - 0.6 * scale, y + 0.1 * scale, x, y - 0.2 * scale, x, y - 0.5 * scale);
        s.bezierCurveTo(x, y - 0.2 * scale, x + 0.6 * scale, y + 0.1 * scale, x + 0.6 * scale, y + 0.5 * scale);
        s.bezierCurveTo(x + 0.6 * scale, y + 1.1 * scale, x, y + 0.8 * scale, x, y + 0.5 * scale);
        const geo = new THREE.ExtrudeGeometry(s, {
            depth: 0.28 * scale, bevelEnabled: true,
            bevelThickness: 0.06 * scale, bevelSize: 0.06 * scale, bevelSegments: 3, steps: 1
        });
        geo.center();
        return geo;
    }

    function init() {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        resize();

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 9);

        /* Lighting — warm gold key + soft rose fill */
        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const key = new THREE.DirectionalLight(0xffe6a8, 1.4);
        key.position.set(4, 6, 6);
        scene.add(key);
        const fill = new THREE.PointLight(0xff9fb0, 1.1, 40);
        fill.position.set(-6, -2, 4);
        scene.add(fill);
        const rim = new THREE.PointLight(0xffd76a, 1.6, 40);
        rim.position.set(0, 2, -6);
        scene.add(rim);

        /* Gold ring material */
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xd9ad4e, metalness: 1.0, roughness: 0.25,
            emissive: 0x5a3d0a, emissiveIntensity: 0.4
        });

        /* Two interlocking rings (torus) */
        const ringGeo = new THREE.TorusGeometry(1.35, 0.16, 24, 120);
        const r1 = new THREE.Mesh(ringGeo, goldMat);
        const r2 = new THREE.Mesh(ringGeo, goldMat.clone());
        r1.position.x = -0.75; r1.rotation.y = 0.5;
        r2.position.x = 0.75; r2.rotation.y = -0.5; r2.rotation.x = Math.PI / 2.6;
        rings = [r1, r2];
        scene.add(r1, r2);

        /* Two glowing hearts nestled with the rings */
        const heartMat = new THREE.MeshStandardMaterial({
            color: 0xff6f85, metalness: 0.2, roughness: 0.35,
            emissive: 0xff2d55, emissiveIntensity: 0.55
        });
        const h1 = new THREE.Mesh(heartGeometry(0.9), heartMat);
        const h2 = new THREE.Mesh(heartGeometry(0.7), heartMat.clone());
        h1.position.set(-0.75, 0, 0.4);
        h2.position.set(0.75, 0.1, 0.4);
        hearts = [h1, h2];
        scene.add(h1, h2);

        /* Gold particle field */
        const count = isMobile ? 380 : 700;
        const pGeo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 6 + Math.random() * 8;
            const th = Math.random() * Math.PI * 2;
            const ph = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
            pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
            pos[i * 3 + 2] = r * Math.cos(ph);
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0xffd98a, size: isMobile ? 0.06 : 0.05,
            transparent: true, opacity: 0.85, depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        window.addEventListener("resize", resize);

        if (prefersReduced) {
            renderer.render(scene, camera); // single static frame
        } else {
            animate();
        }
    }

    function resize() {
        const w = canvas.clientWidth || canvas.parentElement.clientWidth;
        const h = canvas.clientHeight || canvas.parentElement.clientHeight;
        renderer.setSize(w, h, false);
        if (camera) { camera.aspect = w / h; camera.updateProjectionMatrix(); }
    }

    let lastFrame = 0;
    function animate(now) {
        if (!running) return;
        raf = requestAnimationFrame(animate);

        // In background (post-open) mode on mobile, cap to ~30fps to save battery.
        if (background && isMobile) {
            if (now - lastFrame < 33) return;
            lastFrame = now || 0;
        }

        const t = clock.getElapsedTime();

        rings[0].rotation.y += 0.006;
        rings[0].rotation.z = Math.sin(t * 0.6) * 0.15;
        rings[1].rotation.x += 0.008;
        rings[1].rotation.y -= 0.004;

        // hearts gently drift toward each other and pulse
        const beat = 1 + Math.sin(t * 2.2) * 0.06;
        hearts.forEach((h, i) => {
            h.rotation.y = t * 0.4 * (i ? -1 : 1);
            h.scale.setScalar(beat * (i ? 0.9 : 1));
            h.position.y = Math.sin(t * 1.3 + i) * 0.12;
        });

        particles.rotation.y += 0.0009;
        particles.rotation.x = Math.sin(t * 0.15) * 0.1;

        // subtle whole-scene sway
        scene.rotation.y = Math.sin(t * 0.25) * 0.12;

        renderer.render(scene, camera);
    }

    /* Public hook: called when the invitation opens. We DON'T stop the
       loop — the rings should keep spinning the whole time the guest is
       on the page. We just relax the frame rate a touch on mobile to save
       battery, since the canvas is now a dimmed background watermark. */
    let background = false;
    window.__scene3dToBackground = function () {
        background = true;
    };

    /* Optional hard stop (unused by default, kept for completeness) */
    window.__stopScene3D = function () {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        if (renderer) renderer.dispose();
    };

    // Pause when tab hidden to save battery
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) { running = false; if (raf) cancelAnimationFrame(raf); }
        else if (!prefersReduced && renderer) { running = true; animate(); }
    });

    try { init(); }
    catch (e) { console.warn("3D scene disabled:", e); }
})();
