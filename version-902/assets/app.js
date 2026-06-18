(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-site-search]'));

    searchInputs.forEach(function (input) {
        var scopeSelector = input.getAttribute('data-scope');
        var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
        var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('[data-card]')) : [];
        var empty = scope ? scope.querySelector('[data-empty-result]') : null;

        input.addEventListener('input', function () {
            var value = input.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var matched = !value || text.indexOf(value) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        });
    });
})();
