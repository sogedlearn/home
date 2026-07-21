/**
 * About page — institutional alliance cards & detail modals.
 */
(function () {
    var ALLIANCES = {
        congreso: {
            id: 'congreso',
            name: 'Guna General Congress',
            shortDesc: 'Governance, cultural authority, and community-led language preservation across Guna Yala.',
            fullDesc:
                'SOGED collaborates with the Guna General Congress to ensure every lesson, story, and learning resource respects traditional governance and community consent. Together we bridge ancestral knowledge with digital education for new generations.',
            logo: '../Multimedia/Images/partner/congresogeneral.png',
            accent: 'bg-guna-earth',
            website: 'https://gunayala.org.pa/',
            photos: [
                { src: '../Multimedia/Images/about/soged4/congreso-guna.jpg', alt: 'SOGED team at Guna cultural map exhibit' },
                { src: '../Multimedia/Images/about/soged4/group-collaboration.jpg', alt: 'Students collaborating on the SOGED platform' },
                { src: '../Multimedia/Images/partner/congresojuvenil.jpg', alt: 'Youth congress collaboration event' },
                { src: '../Multimedia/Images/Molas - Guna/Comarca-Guna-Yala.jpg', alt: 'Guna Yala comarca landscape' },
            ],
        },
        udelas: {
            id: 'udelas',
            name: 'UDELAS — CIEPI',
            shortDesc: 'Academic research, teacher training, and institutional support for indigenous education.',
            fullDesc:
                'Through our partnership with UDELAS and the CIEPI research center, SOGED connects field linguistics, curriculum design, and certified teacher development. This alliance strengthens evidence-based language teaching across Panama.',
            logo: '../Multimedia/Images/partner/CIEPI.png',
            accent: 'bg-guna-jungle',
            website: 'https://www.udelas.ac.pa/servicio/ciepi/',
            photos: [
                { src: '../Multimedia/Images/about/soged4/udelas.jpg', alt: 'Library research session at UDELAS CIEPI' },
                { src: '../Multimedia/Images/about/soged4/udelas-group.jpg', alt: 'UDELAS group with cultural map display' },
                { src: '../Multimedia/Images/about/soged4/udelas-book.jpg', alt: 'Studying indigenous culture materials' },
                { src: '../Multimedia/Images/about/soged4/udelas-gallery.jpg', alt: 'UDELAS gallery visit with SOGED team' },
                { src: '../Multimedia/Images/about/soged4/udelas-materials.jpg', alt: 'Educational materials at UDELAS' },
            ],
        },
        museo: {
            id: 'museo',
            name: 'Museo de la Mola',
            shortDesc: 'Safeguarding Guna textile heritage and visual identity woven into our learning experience.',
            fullDesc:
                'The Museo de la Mola partners with SOGED to honor mola artistry—the geometric soul of Guna visual culture. Their guidance ensures our platform celebrates authentic patterns, stories, and the women who carry this tradition forward.',
            logo: '../Multimedia/Images/partner/Museo de la Mola.png',
            accent: 'bg-guna-sun',
            website: 'https://museodelamola.org/',
            photos: [
                { src: '../Multimedia/Images/about/soged4/mumo.jpg', alt: 'Students viewing mola garment display' },
                { src: '../Multimedia/Images/about/soged4/mumo-mola.jpg', alt: 'Traditional mola panels hanging exhibition' },
                { src: '../Multimedia/Images/about/soged4/mumo-mola-2.jpg', alt: 'Mola brands and emblems collection' },
                { src: '../Multimedia/Images/about/soged4/mumo-group.jpg', alt: 'Students at Museo de la Mola' },
                { src: '../Multimedia/Images/about/soged4/mumo-collage.jpg', alt: 'Museum visit photo collage' },
                { src: '../Multimedia/Images/about/soged4/mumo-photo.jpg', alt: 'Mola textile close-up at the museum' },
            ],
        },
    };

    function initAllianceModal() {
        var backdrop = document.getElementById('alliance-modal');
        if (!backdrop) return;

        var panel = backdrop.querySelector('[data-alliance-panel]');
        var titleEl = backdrop.querySelector('[data-alliance-title]');
        var descEl = backdrop.querySelector('[data-alliance-desc]');
        var logoEl = backdrop.querySelector('[data-alliance-logo]');
        var linkEl = backdrop.querySelector('[data-alliance-link]');
        var track = backdrop.querySelector('[data-alliance-carousel-track]');
        var dotsWrap = backdrop.querySelector('[data-alliance-dots]');
        var prevBtn = backdrop.querySelector('[data-alliance-prev]');
        var nextBtn = backdrop.querySelector('[data-alliance-next]');
        var closeBtns = backdrop.querySelectorAll('[data-alliance-close]');

        var slides = [];
        var current = 0;
        var timer = null;
        var lastFocus = null;

        function renderCarousel(photos) {
            if (!track) return;
            track.innerHTML =
                '<div class="relative w-full h-full">' +
                photos.map(function (photo, index) {
                    return (
                        '<figure class="alliance-modal-carousel-slide absolute inset-0' +
                        (index === 0 ? ' is-active' : '') +
                        '">' +
                        '<img src="' + photo.src + '" alt="' + photo.alt + '" class="w-full h-full object-cover" loading="lazy">' +
                        '</figure>'
                    );
                }).join('') +
                '</div>';
            slides = Array.prototype.slice.call(track.querySelectorAll('.alliance-modal-carousel-slide'));
            current = 0;
            renderDots();
        }

        function renderDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = slides.map(function (_, index) {
                return (
                    '<button type="button" class="w-2 h-2 rounded-full transition-all ' +
                    (index === current ? 'bg-guna-sun scale-125' : 'bg-black/30') +
                    '" data-index="' + index + '" aria-label="Photo ' + (index + 1) + '"></button>'
                );
            }).join('');
        }

        function setSlide(index) {
            if (!slides.length) return;
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            renderDots();
        }

        function next() { setSlide(current + 1); }
        function prev() { setSlide(current - 1); }

        function restartTimer() {
            if (timer) window.clearInterval(timer);
            if (slides.length > 1) {
                timer = window.setInterval(next, 5000);
            }
        }

        function openAlliance(id) {
            var data = ALLIANCES[id];
            if (!data) return;

            lastFocus = document.activeElement;

            if (titleEl) titleEl.textContent = data.name;
            if (descEl) descEl.textContent = data.fullDesc;
            if (logoEl) {
                logoEl.src = data.logo;
                logoEl.alt = data.name + ' logo';
            }
            if (linkEl) linkEl.href = data.website;

            renderCarousel(data.photos);
            backdrop.classList.add('is-open');
            backdrop.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            restartTimer();

            var closeBtn = backdrop.querySelector('[data-alliance-close-main]');
            if (closeBtn) closeBtn.focus();
        }

        function closeAlliance() {
            backdrop.classList.remove('is-open');
            backdrop.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (timer) window.clearInterval(timer);
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        }

        document.querySelectorAll('[data-alliance-open]').forEach(function (card) {
            card.addEventListener('click', function () {
                openAlliance(card.getAttribute('data-alliance-open'));
            });
            card.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openAlliance(card.getAttribute('data-alliance-open'));
                }
            });
        });

        closeBtns.forEach(function (btn) {
            btn.addEventListener('click', closeAlliance);
        });

        backdrop.addEventListener('click', function (event) {
            if (event.target === backdrop) closeAlliance();
        });

        document.addEventListener('keydown', function (event) {
            if (!backdrop.classList.contains('is-open')) return;
            if (event.key === 'Escape') closeAlliance();
            if (event.key === 'ArrowRight') { next(); restartTimer(); }
            if (event.key === 'ArrowLeft') { prev(); restartTimer(); }
        });

        if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartTimer(); });

        if (dotsWrap) {
            dotsWrap.addEventListener('click', function (event) {
                var dot = event.target.closest('button[data-index]');
                if (!dot) return;
                setSlide(parseInt(dot.getAttribute('data-index'), 10));
                restartTimer();
            });
        }
    }

    document.addEventListener('DOMContentLoaded', initAllianceModal);
})();
