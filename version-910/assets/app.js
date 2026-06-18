(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initSiteSearch() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-site-search]"), function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";
        if (!value) {
          return;
        }
        event.preventDefault();
        window.location.href = "./search.html?q=" + encodeURIComponent(value);
      });
    });
  }

  function initFilters() {
    var list = document.querySelector("[data-filter-list]");
    var input = document.querySelector("[data-filter-input]");
    var year = document.querySelector("[data-filter-year]");
    var region = document.querySelector("[data-filter-region]");
    if (!list || !input) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q) {
      input.value = q;
    }

    function match(card) {
      var text = [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags"),
        card.textContent
      ].join(" ").toLowerCase();
      var keyword = input.value.trim().toLowerCase();
      var y = year ? year.value : "";
      var r = region ? region.value : "";
      var yearOk = !y || card.getAttribute("data-year") === y;
      var regionOk = !r || card.getAttribute("data-region") === r;
      var keywordOk = !keyword || text.indexOf(keyword) !== -1;
      return yearOk && regionOk && keywordOk;
    }

    function apply() {
      cards.forEach(function (card) {
        card.classList.toggle("is-hidden", !match(card));
      });
    }

    input.addEventListener("input", apply);
    if (year) {
      year.addEventListener("change", apply);
    }
    if (region) {
      region.addEventListener("change", apply);
    }
    apply();
  }

  function initRail() {
    var rail = document.querySelector("[data-movie-rail]");
    var prev = document.querySelector("[data-rail-prev]");
    var next = document.querySelector("[data-rail-next]");
    if (!rail || !prev || !next) {
      return;
    }
    function move(direction) {
      rail.scrollBy({ left: direction * Math.max(260, rail.clientWidth * 0.75), behavior: "smooth" });
    }
    prev.addEventListener("click", function () {
      move(-1);
    });
    next.addEventListener("click", function () {
      move(1);
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSiteSearch();
    initFilters();
    initRail();
  });
})();
