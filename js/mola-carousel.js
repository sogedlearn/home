/**
 * Mola gallery — Learn page (languages.html)
 * Museum attribution, clickable images, per-piece info panels.
 */
(function () {
    var MUSEUM_URL = 'https://museodelamola.org/';
    var ATTRIBUTION = 'Image provided by Museo de la Mola';
    var INTERVAL_MS = 5500;

    var MOLA_PIECES = [
        {
            src: 'Multimedia/Images/Molas - Guna/Mola 1.jpg',
            title: 'Hummingbird Mola',
            meaning: 'The hummingbird represents agility and the connection between the earthly and spiritual worlds in Guna tradition. Its swift movement symbolizes vitality and the ability to cross boundaries between realms.',
            history: 'This design reflects centuries of observation of island wildlife. Guna women incorporate birds from daily life into molas as symbols of freedom and spiritual messengers.'
        },
        {
            src: 'Multimedia/Images/Molas - Guna/Mola 2.jpg',
            title: 'Coconut Mola',
            meaning: 'The coconut embodies sustenance, prosperity, and the sacred relationship between the Guna people and their island environment. It represents nourishment for body and community.',
            history: 'Coconut palms sustain island life — food, crafts, and trade. Molas featuring coconuts honor the tree that has supported Guna families across generations on the archipelago.'
        },
        {
            src: 'Multimedia/Images/Molas - Guna/Mola 3.jpg',
            title: 'Turtle Mola',
            meaning: 'The turtle symbolizes longevity, wisdom, and the ancestral knowledge carried through the sea. In Guna cosmology, marine animals connect communities to Muu — the living ocean.',
            history: 'Turtles appear frequently in Guna legends and mola art. Artisans pass down turtle motifs as reminders of patience, endurance, and respect for marine life.'
        },
        {
            src: 'Multimedia/Images/Molas - Guna/Mola 4.jpg',
            title: 'Sun Mola',
            meaning: 'The sun guides fishermen, marks seasonal cycles, and represents clarity and life force. Solar motifs in molas express gratitude for light and the rhythm of island days.',
            history: 'Before modern navigation, the sun oriented travel between islands. Sun patterns in molas document this deep relationship between celestial cycles and daily Guna life.'
        },
        {
            src: 'Multimedia/Images/Molas - Guna/Mola 5.jpg',
            title: 'Sea Mola',
            meaning: 'The sea is the spiritual home of the Guna people — source of food, identity, and ceremony. Marine patterns celebrate the archipelago as an extension of Muu\'s sacred body.',
            history: 'Island communities have lived in harmony with the Caribbean for centuries. Sea-themed molas are among the most treasured, worn as daily expressions of cultural pride.'
        }
    ];

    function buildGallery(container) {
        container.innerHTML = '';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Guna mola gallery');

        var stage = document.createElement('div');
        stage.className = 'mola-gallery-stage';

        var link = document.createElement('a');
        link.className = 'mola-gallery-link';
        link.href = MUSEUM_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Visit Museo de la Mola website');

        MOLA_PIECES.forEach(function (_, i) {
            var img = document.createElement('img');
            img.className = 'mola-slide' + (i === 0 ? ' mola-slide--active' : '');
            img.src = MOLA_PIECES[i].src;
            img.alt = MOLA_PIECES[i].title;
            img.loading = i === 0 ? 'eager' : 'lazy';
            link.appendChild(img);
        });

        var badge = document.createElement('span');
        badge.className = 'mola-museum-badge';
        badge.textContent = ATTRIBUTION;
        link.appendChild(badge);

        stage.appendChild(link);

        var toolbar = document.createElement('div');
        toolbar.className = 'mola-gallery-toolbar';

        var infoBtn = document.createElement('button');
        infoBtn.type = 'button';
        infoBtn.className = 'mola-info-btn';
        infoBtn.setAttribute('aria-expanded', 'false');
        infoBtn.setAttribute('aria-controls', 'mola-info-panel');
        infoBtn.innerHTML = '<i class="fas fa-circle-info" aria-hidden="true"></i> <span>About this mola</span>';

        var dots = document.createElement('div');
        dots.className = 'mola-gallery-dots';
        dots.setAttribute('role', 'tablist');
        dots.setAttribute('aria-label', 'Select mola');

        MOLA_PIECES.forEach(function (piece, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'mola-gallery-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.setAttribute('aria-label', piece.title);
            dot.dataset.index = String(i);
            dots.appendChild(dot);
        });

        toolbar.appendChild(dots);
        toolbar.appendChild(infoBtn);

        var panel = document.createElement('div');
        panel.id = 'mola-info-panel';
        panel.className = 'mola-info-panel';
        panel.hidden = true;

        container.appendChild(stage);
        container.appendChild(toolbar);
        container.appendChild(panel);

        return { stage: stage, link: link, infoBtn: infoBtn, panel: panel, dots: dots };
    }

    function renderPanel(panel, index) {
        var piece = MOLA_PIECES[index];
        panel.innerHTML =
            '<div class="mola-info-panel-inner">' +
                '<h4>' + piece.title + '</h4>' +
                '<p class="mola-info-label"><strong>Meaning</strong></p>' +
                '<p>' + piece.meaning + '</p>' +
                '<p class="mola-info-label"><strong>History</strong></p>' +
                '<p>' + piece.history + '</p>' +
                '<a href="' + MUSEUM_URL + '" target="_blank" rel="noopener noreferrer" class="mola-info-museum-link">' +
                    '<i class="fas fa-external-link-alt" aria-hidden="true"></i> Learn more at Museo de la Mola' +
                '</a>' +
            '</div>';
    }

    function setSlide(els, index) {
        var slides = els.link.querySelectorAll('.mola-slide');
        slides.forEach(function (img, i) {
            img.classList.toggle('mola-slide--active', i === index);
        });
        els.dots.querySelectorAll('.mola-gallery-dot').forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        renderPanel(els.panel, index);
        if (!els.panel.hidden) {
            els.infoBtn.setAttribute('aria-expanded', 'true');
        }
    }

    function initMolaCarousel() {
        var container = document.getElementById('mola-carousel');
        if (!container) return;

        var els = buildGallery(container);
        var currentIndex = 0;
        var timer = null;

        renderPanel(els.panel, 0);

        function goTo(index) {
            currentIndex = (index + MOLA_PIECES.length) % MOLA_PIECES.length;
            setSlide(els, currentIndex);
        }

        function startAuto() {
            stopAuto();
            timer = setInterval(function () {
                goTo(currentIndex + 1);
            }, INTERVAL_MS);
        }

        function stopAuto() {
            if (timer) clearInterval(timer);
            timer = null;
        }

        els.dots.addEventListener('click', function (e) {
            var dot = e.target.closest('.mola-gallery-dot');
            if (!dot) return;
            goTo(parseInt(dot.dataset.index, 10));
            startAuto();
        });

        els.infoBtn.addEventListener('click', function () {
            var open = els.panel.hidden;
            els.panel.hidden = !open;
            els.infoBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            els.infoBtn.querySelector('span').textContent = open ? 'Hide details' : 'About this mola';
            if (open) els.panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);

        startAuto();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMolaCarousel);
    } else {
        initMolaCarousel();
    }
})();
