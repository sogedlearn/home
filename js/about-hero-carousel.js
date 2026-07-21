/**
 * About page — hero group photo carousel.
 */
(function () {
    var INTERVAL_MS = 4500;

    function initGroupCarousel(root) {
        var slides = Array.prototype.slice.call(root.querySelectorAll('.about-group-carousel-slide'));
        var prevBtn = root.querySelector('[data-group-prev]');
        var nextBtn = root.querySelector('[data-group-next]');
        var dotsWrap = root.querySelector('[data-group-dots]');

        if (!slides.length) return;

        var current = 0;
        var timer = null;

        function renderDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = slides.map(function (_, index) {
                return (
                    '<button type="button" class="w-2.5 h-2.5 rounded-full transition-all duration-200 ' +
                    (index === current ? 'bg-guna-sun scale-125' : 'bg-white/50 hover:bg-white/80') +
                    '" data-index="' + index + '" aria-label="Go to photo ' + (index + 1) + '"></button>'
                );
            }).join('');
        }

        function setActive(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            if (dotsWrap) {
                dotsWrap.querySelectorAll('button').forEach(function (dot, i) {
                    dot.classList.toggle('bg-guna-sun', i === current);
                    dot.classList.toggle('scale-125', i === current);
                    dot.classList.toggle('bg-white/50', i !== current);
                });
            }
        }

        function next() { setActive(current + 1); }
        function prev() { setActive(current - 1); }

        function restartTimer() {
            if (timer) window.clearInterval(timer);
            timer = window.setInterval(next, INTERVAL_MS);
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartTimer(); });

        if (dotsWrap) {
            dotsWrap.addEventListener('click', function (event) {
                var dot = event.target.closest('button[data-index]');
                if (!dot) return;
                setActive(parseInt(dot.getAttribute('data-index'), 10));
                restartTimer();
            });
        }

        root.addEventListener('mouseenter', function () {
            if (timer) window.clearInterval(timer);
        });
        root.addEventListener('mouseleave', restartTimer);

        renderDots();
        setActive(0);
        restartTimer();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var carousel = document.querySelector('[data-about-group-carousel]');
        if (carousel) initGroupCarousel(carousel);
    });
})();
