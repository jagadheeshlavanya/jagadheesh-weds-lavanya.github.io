/* ==========================================================
   IN-PAGE 3D ACCENTS  (Three.js, performance-friendly)
   - #countdown : floating 3D hearts
   - #story     : slow rotating gold rings watermark
   - #thankyou  : gentle drifting 3D petals
   Each canvas only animates while its section is on screen.
   All optional: if Three.js is missing, nothing breaks.
========================================================== */

(function () {
    if (typeof THREE === "undefined") return;
    const prefersReduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width:768px)").matches;

    /* Utility: build a canvas layer inside a section */
    function mountCanvas(section) {
        const c = document.createElement("canvas");
        c.className = "section-3d";
        section.insertBefore(c, section.firstChild);
        return c;
    }

    function heartGeo(scale) {
        const s = new THREE.Shape();
        s.moveTo(0, 0.5 * scale);
        s.bezierCurveTo(0, 0.8 * scale, -0.6 * scale, 1.1 * scale, -0.6 * scale, 0.5 * scale);
        s.bezierCurveTo(-0.6 * scale, 0.1 * scale, 0, -0.2 * scale, 0, -0.5 * scale);
        s.bezierCurveTo(0, -0.2 * scale, 0.6 * scale, 0.1 * scale, 0.6 * scale, 0.5 * scale);
        s.bezierCurveTo(0.6 * scale, 1.1 * scale, 0, 0.8 * scale, 0, 0.5 * scale);
        const g = new THREE.ExtrudeGeometry(s, {
            depth: 0.25 * scale, bevelEnabled: true, bevelThickness: 0.05 * scale,
            bevelSize: 0.05 * scale, bevelSegments: 2, steps: 1
        });
        g.center();
        return g;
    }

    /* Generic mini-scene manager */
    function makeScene(section, build) {
        const canvas = mountCanvas(section);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 10;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const key = new THREE.DirectionalLight(0xffe6a8, 1.2);
        key.position.set(3, 5, 6); scene.add(key);
        const fill = new THREE.PointLight(0xff9fb0, 0.9, 40);
        fill.position.set(-5, -2, 4); scene.add(fill);

        function resize() {
            const w = section.clientWidth, h = section.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h; camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener("resize", resize);

        const api = build(scene, THREE);
        let visible = false, raf = null;
        const clock = new THREE.Clock();

        function loop() {
            if (!visible) return;
            raf = requestAnimationFrame(loop);
            api.update(clock.getElapsedTime());
            renderer.render(scene, camera);
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                visible = e.isIntersecting;
                if (visible && !prefersReduced) { clock.getDelta(); loop(); }
                else if (raf) cancelAnimationFrame(raf);
            });
        }, { threshold: 0.05 });
        io.observe(section);

        if (prefersReduced) renderer.render(scene, camera);
    }

    /* ---------- #countdown : floating hearts ---------- */
    const countdown = document.getElementById("countdown");
    if (countdown) {
        makeScene(countdown, (scene) => {
            const mat = new THREE.MeshStandardMaterial({
                color: 0xff7d92, metalness: 0.2, roughness: 0.35,
                emissive: 0xff2d55, emissiveIntensity: 0.4, transparent: true, opacity: 0.9
            });
            const hearts = [];
            const n = isMobile ? 7 : 12;
            for (let i = 0; i < n; i++) {
                const m = new THREE.Mesh(heartGeo(0.5 + Math.random() * 0.5), mat.clone());
                m.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
                m.userData = { sp: 0.3 + Math.random() * 0.6, ph: Math.random() * 6.28, rot: (Math.random() - 0.5) * 0.02 };
                hearts.push(m); scene.add(m);
            }
            return {
                update(t) {
                    hearts.forEach(h => {
                        h.position.y += 0.01 * h.userData.sp;
                        if (h.position.y > 5) h.position.y = -5;
                        h.rotation.y += h.userData.rot;
                        h.position.x += Math.sin(t + h.userData.ph) * 0.003;
                    });
                }
            };
        });
    }

    /* ---------- #story : slow rotating gold rings watermark ---------- */
    const story = document.getElementById("story");
    if (story) {
        makeScene(story, (scene) => {
            const gold = new THREE.MeshStandardMaterial({
                color: 0xd9ad4e, metalness: 1.0, roughness: 0.3,
                emissive: 0x5a3d0a, emissiveIntensity: 0.3, transparent: true, opacity: 0.5
            });
            const geo = new THREE.TorusGeometry(2.2, 0.22, 20, 90);
            const r1 = new THREE.Mesh(geo, gold);
            const r2 = new THREE.Mesh(geo, gold.clone());
            r1.position.x = -1.1; r2.position.x = 1.1; r2.rotation.x = Math.PI / 2.4;
            scene.add(r1, r2);
            return {
                update() {
                    r1.rotation.y += 0.004; r1.rotation.z += 0.001;
                    r2.rotation.x += 0.004; r2.rotation.y -= 0.003;
                }
            };
        });
    }

    /* ---------- #thankyou : gentle drifting petals ---------- */
    const thankyou = document.getElementById("thankyou");
    if (thankyou) {
        makeScene(thankyou, (scene) => {
            const petals = [];
            const petalGeo = new THREE.CircleGeometry(0.35, 8);
            const n = isMobile ? 10 : 18;
            const colors = [0xff9fb0, 0xe6c979, 0xc69c8a];
            for (let i = 0; i < n; i++) {
                const mat = new THREE.MeshStandardMaterial({
                    color: colors[i % colors.length], side: THREE.DoubleSide,
                    transparent: true, opacity: 0.75, roughness: 0.6
                });
                const p = new THREE.Mesh(petalGeo, mat);
                p.position.set((Math.random() - 0.5) * 16, Math.random() * 10, (Math.random() - 0.5) * 5);
                p.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
                p.userData = { sp: 0.4 + Math.random() * 0.7, sway: Math.random() * 6.28, rx: (Math.random() - 0.5) * 0.03, ry: (Math.random() - 0.5) * 0.03 };
                petals.push(p); scene.add(p);
            }
            return {
                update(t) {
                    petals.forEach(p => {
                        p.position.y -= 0.012 * p.userData.sp;
                        if (p.position.y < -5) { p.position.y = 6; p.position.x = (Math.random() - 0.5) * 16; }
                        p.position.x += Math.sin(t + p.userData.sway) * 0.004;
                        p.rotation.x += p.userData.rx; p.rotation.y += p.userData.ry;
                    });
                }
            };
        });
    }
})();
