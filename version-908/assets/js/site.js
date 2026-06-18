(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          show(index + 1);
        }, 5600);
      }
    });

    document.querySelectorAll("[data-search-list]").forEach(function (input) {
      var list = document.querySelector(input.getAttribute("data-search-list"));
      if (!list) {
        return;
      }
      var empty = list.parentElement.querySelector("[data-empty-state]");
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card, .rank-row"));

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-type")
          ].join(" ").toLowerCase();
          var match = !query || text.indexOf(query) !== -1;
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      });
    });

    document.querySelectorAll("[data-quick-filters]").forEach(function (wrap) {
      var list = document.querySelector(wrap.getAttribute("data-quick-filters"));
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      var buttons = Array.prototype.slice.call(wrap.querySelectorAll("button"));
      var empty = list.parentElement.querySelector("[data-empty-state]");

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var filter = button.getAttribute("data-filter") || "all";
          var visible = 0;
          buttons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          cards.forEach(function (card) {
            var haystack = [
              card.getAttribute("data-title"),
              card.getAttribute("data-year"),
              card.getAttribute("data-region"),
              card.getAttribute("data-tags"),
              card.getAttribute("data-type")
            ].join(" ");
            var match = filter === "all" || haystack.indexOf(filter) !== -1;
            card.style.display = match ? "" : "none";
            if (match) {
              visible += 1;
            }
          });
          if (empty) {
            empty.classList.toggle("show", visible === 0);
          }
        });
      });
    });
  });
})();
