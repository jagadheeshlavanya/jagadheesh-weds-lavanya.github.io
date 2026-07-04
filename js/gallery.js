/* ==========================================================
   PREMIUM GALLERY (Swiper)
========================================================== */

const gallerySwiper = new Swiper(".gallerySwiper", {

    loop: true,

    speed: 1000,

    spaceBetween: 30,

    centeredSlides: true,

    grabCursor: true,

    autoplay: {

        delay: 3000,

        disableOnInteraction: false,

        pauseOnMouseEnter: true

    },

    effect: "coverflow",

    coverflowEffect: {

        rotate: 10,

        stretch: 0,

        depth: 180,

        modifier: 1.2,

        slideShadows: false,

        scale: 0.92

    },

    pagination: {

        el: ".swiper-pagination",

        clickable: true

    },

    keyboard: {

        enabled: true

    },

    mousewheel: {

        forceToAxis: true

    },

    breakpoints: {

        320: {

            slidesPerView: 1.1,

            spaceBetween: 15

        },

        576: {

            slidesPerView: 1.3,

            spaceBetween: 20

        },

        768: {

            slidesPerView: 2,

            spaceBetween: 25

        },

        1024: {

            slidesPerView: 3,

            spaceBetween: 30

        }

    }

});

/* ==========================================================
   IMAGE HOVER EFFECT
========================================================== */

document.querySelectorAll(".gallerySwiper img").forEach((image) => {

    image.addEventListener("mouseenter", () => {

        image.style.transform = "scale(1.08)";

    });

    image.addEventListener("mouseleave", () => {

        image.style.transform = "scale(1)";

    });

});

/* ==========================================================
   PAUSE AUTOPLAY WHEN TAB IS HIDDEN
========================================================== */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        gallerySwiper.autoplay.stop();

    } else {

        gallerySwiper.autoplay.start();

    }

});