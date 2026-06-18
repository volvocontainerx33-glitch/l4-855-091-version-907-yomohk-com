(function() {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function() {
            mobileMenu.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let current = 0;
        let timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 5000);
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    const panels = Array.from(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function(panel) {
        const targetId = panel.getAttribute("data-filter-panel");
        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }
        const input = panel.querySelector("[data-filter-input]");
        const selects = Array.from(panel.querySelectorAll("[data-filter-field]"));
        const cards = Array.from(target.querySelectorAll(".movie-card"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilter() {
            const query = normalize(input ? input.value : "");
            const filters = selects.map(function(select) {
                return {
                    field: select.getAttribute("data-filter-field"),
                    value: normalize(select.value)
                };
            });

            cards.forEach(function(card) {
                const haystack = normalize(card.getAttribute("data-search"));
                const matchesQuery = !query || haystack.indexOf(query) !== -1;
                const matchesSelects = filters.every(function(filter) {
                    if (!filter.value) {
                        return true;
                    }
                    return normalize(card.getAttribute("data-" + filter.field)).indexOf(filter.value) !== -1;
                });
                card.classList.toggle("is-filter-hidden", !(matchesQuery && matchesSelects));
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }
        selects.forEach(function(select) {
            select.addEventListener("change", applyFilter);
        });
    });
})();
