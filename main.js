/* ==========================================================
   MAIN JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       AOS INITIALIZATION
    ========================================== */

    if (typeof AOS !== "undefined") {

        document.body.classList.remove("no-aos");

        AOS.init({

            duration: 1000,

            once: true,

            easing: "ease-out-cubic",

            offset: 80

        });

    }

    /* ==========================================
       SMOOTH SCROLL FOR NAVIGATION
    ========================================== */

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if (!target) return;

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

    /* ==========================================
       ACTIVE NAVIGATION
    ========================================== */

    const sections = document.querySelectorAll("section");

    const navLinks = document.querySelectorAll("nav a");

    function updateActiveLink() {

        let current = "";

        sections.forEach(section => {

            const top = window.scrollY;

            const offset = section.offsetTop - 150;

            const height = section.offsetHeight;

            if (top >= offset && top < offset + height) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    }

    updateActiveLink();

    /* ==========================================
       STICKY NAVIGATION
    ========================================== */

    const nav = document.querySelector("nav");

    function updateNavbar() {

        if (window.scrollY > 40) {

            nav.classList.add("scrolled");

        } else {

            nav.classList.remove("scrolled");

        }

    }

    updateNavbar();

    /* ==========================================
       SCROLL TO TOP BUTTON
    ========================================== */

    const scrollTopButton =
        document.getElementById("scrollTop");

    function updateScrollButton() {

        if (window.scrollY > 500) {

            scrollTopButton.classList.add("show");

        } else {

            scrollTopButton.classList.remove("show");

        }

    }

    scrollTopButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    /* ==========================================
       PARALLAX HERO
    ========================================== */

    const heroImage =
        document.querySelector(".hero-image");

    function parallaxHero() {

        if (!heroImage) return;

        const offset = window.scrollY * 0.25;

        heroImage.style.transform =
            `translateY(${offset}px) scale(1.08)`;

    }

    /* ==========================================
       EVENT LISTENERS
    ========================================== */

    window.addEventListener("scroll", () => {

        updateNavbar();

        updateScrollButton();

        updateActiveLink();

        parallaxHero();

    });

    /* ==========================================
       GSAP ENTRANCE ANIMATION
    ========================================== */

    if (typeof gsap !== "undefined") {

        try {

            gsap.from(".section-title", {

                opacity: 0,

                y: 40,

                stagger: 0.15,

                duration: 1,

                ease: "power3.out"

            });

        } catch (e) { /* no-op */ }

    }

});

/* ==========================================================
   IMAGE LAZY ANIMATION
========================================================== */

const images = document.querySelectorAll("img");

const imageObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

                imageObserver.unobserve(entry.target);

            }

        });

    },

    {

        threshold: 0.15

    }

);

images.forEach(image => {

    image.style.opacity = "0";

    image.style.transform = "translateY(30px)";

    image.style.transition =
        "all .8s ease";

    imageObserver.observe(image);

});

/* ==========================================================
   CONSOLE MESSAGE
========================================================== */

console.log("%c💍 Welcome to Jagadheesh ❤️ Lavanya's Wedding Website",
    "font-size:16px;color:#C69C8A;font-weight:bold;");

console.log("%cMade with ❤️ for a beautiful journey together.",
    "font-size:13px;color:#888;");