(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            document.body.classList.toggle('nav-open');
        });
    }

    selectAll('[data-hero]').forEach(function (hero) {
        var slides = selectAll('.hero-slide', hero);
        var dots = selectAll('.hero-dot', hero);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-pressed', i === index ? 'true' : 'false');
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    selectAll('[data-filter-panel]').forEach(function (panel) {
        var scopeSelector = panel.getAttribute('data-scope') || '#movieGrid';
        var grid = document.querySelector(scopeSelector);
        if (!grid) {
            return;
        }
        var cards = selectAll('[data-card]', grid);
        var input = panel.querySelector('[data-search-input]');
        var selects = selectAll('[data-filter-key]', panel);
        var empty = document.querySelector(panel.getAttribute('data-empty') || '');
        function valueOf(card, key) {
            return (card.getAttribute('data-' + key) || '').toLowerCase();
        }
        function apply() {
            var q = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = [
                    valueOf(card, 'title'),
                    valueOf(card, 'region'),
                    valueOf(card, 'type'),
                    valueOf(card, 'year'),
                    valueOf(card, 'genre'),
                    valueOf(card, 'tags')
                ].join(' ');
                var ok = !q || haystack.indexOf(q) !== -1;
                selects.forEach(function (select) {
                    var key = select.getAttribute('data-filter-key');
                    var val = select.value.trim().toLowerCase();
                    if (val && valueOf(card, key).indexOf(val) === -1) {
                        ok = false;
                    }
                });
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }
        if (input) {
            input.addEventListener('input', apply);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', apply);
        });
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }
        apply();
    });
})();

function initMoviePlayer(streamUrl) {
    var box = document.querySelector('.player-box');
    var video = document.querySelector('.movie-video');
    var play = document.querySelector('.player-play');
    if (!box || !video || !play || !streamUrl) {
        return;
    }
    var prepared = false;
    var hlsPlayer = null;
    function prepare() {
        if (prepared) {
            return;
        }
        prepared = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsPlayer = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hlsPlayer.loadSource(streamUrl);
            hlsPlayer.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }
    function start(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        prepare();
        box.classList.add('is-playing');
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {});
        }
    }
    play.addEventListener('click', start);
    box.addEventListener('click', function (event) {
        if (!box.classList.contains('is-playing') || event.target === box) {
            start(event);
        }
    });
    video.addEventListener('play', function () {
        box.classList.add('is-playing');
    });
    window.addEventListener('pagehide', function () {
        if (hlsPlayer && typeof hlsPlayer.destroy === 'function') {
            hlsPlayer.destroy();
        }
    });
}
