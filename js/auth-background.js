/**
 * Auth background carousel — React-equivalent: useState + useEffect + setInterval
 * Used on login.html and register.html
 */
(function () {
    const MOLA_IMAGES = [
        '../Multimedia/Images/Molas Guna/Mola 1.jpg',
        '../Multimedia/Images/Molas Guna/Mola 2.jpg',
        '../Multimedia/Images/Molas Guna/Mola 3.jpg',
        '../Multimedia/Images/Molas Guna/Mola 4.jpg',
        '../Multimedia/Images/Molas Guna/Mola 5.jpg',
    ];

    const INTERVAL_MS = 4500;

    function mountAuthBackground() {
        if (document.querySelector('.auth-bg-carousel')) return;

        const carousel = document.createElement('div');
        carousel.className = 'auth-bg-carousel';
        carousel.innerHTML =
            '<img class="auth-bg-slide auth-bg-slide--active" alt="" aria-hidden="true">' +
            '<img class="auth-bg-slide" alt="" aria-hidden="true">' +
            '<div class="auth-bg-overlay" aria-hidden="true"></div>';

        document.body.insertBefore(carousel, document.body.firstChild);

        const slides = carousel.querySelectorAll('.auth-bg-slide');
        let currentIndex = 0;
        let activeLayer = 0;

        slides[0].src = MOLA_IMAGES[0];

        setInterval(function () {
            currentIndex = (currentIndex + 1) % MOLA_IMAGES.length;
            const nextLayer = 1 - activeLayer;
            slides[nextLayer].src = MOLA_IMAGES[currentIndex];
            slides[nextLayer].classList.add('auth-bg-slide--active');
            slides[activeLayer].classList.remove('auth-bg-slide--active');
            activeLayer = nextLayer;
        }, INTERVAL_MS);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountAuthBackground);
    } else {
        mountAuthBackground();
    }
})();
