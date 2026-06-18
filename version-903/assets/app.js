(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setupMobileNav() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHeroCarousel() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length === 0) {
      return;
    }

    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === current) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    showSlide(0);
    start();
  }

  function setupCardFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-card-filter]"));
    panels.forEach(function (panel) {
      var scope = panel.closest("[data-filter-scope]") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var queryInput = panel.querySelector("[data-filter-query]");
      var yearInput = panel.querySelector("[data-filter-year]");
      var regionInput = panel.querySelector("[data-filter-region]");
      var typeInput = panel.querySelector("[data-filter-type]");
      var countNode = panel.querySelector("[data-filter-count]");

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function apply() {
        var query = normalize(queryInput && queryInput.value);
        var year = normalize(yearInput && yearInput.value);
        var region = normalize(regionInput && regionInput.value);
        var type = normalize(typeInput && typeInput.value);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.genre,
            card.dataset.region,
            card.dataset.year,
            card.dataset.type,
            card.dataset.tags
          ].join(" "));

          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (year && normalize(card.dataset.year).indexOf(year) === -1) {
            matched = false;
          }
          if (region && normalize(card.dataset.region).indexOf(region) === -1) {
            matched = false;
          }
          if (type && normalize(card.dataset.type).indexOf(type) === -1) {
            matched = false;
          }

          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (countNode) {
          countNode.textContent = visible;
        }
      }

      [queryInput, yearInput, regionInput, typeInput].forEach(function (input) {
        if (input) {
          input.addEventListener("input", apply);
        }
      });

      apply();
    });
  }

  function movieCardHtml(movie) {
    return [
      '<a class="movie-card movie-card--search" href="./' + escapeHtml(movie.file) + '">',
      '  <span class="movie-card__poster">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-gradient"></span>',
      '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '    <span class="poster-hover-text">' + escapeHtml(movie.oneLine) + '</span>',
      '  </span>',
      '  <span class="movie-card__body">',
      '    <strong class="movie-card__title">' + escapeHtml(movie.title) + '</strong>',
      '    <span class="movie-card__meta">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '    </span>',
      '    <span class="genre-pill">' + escapeHtml(movie.genre) + '</span>',
      '    <p class="movie-card__excerpt">' + escapeHtml(movie.oneLine) + '</p>',
      '  </span>',
      '</a>'
    ].join("
");
  }

  function setupSearchPage() {
    var root = document.querySelector("[data-search-page]");
    if (!root || !window.SEARCH_MOVIES) {
      return;
    }

    var form = root.querySelector("[data-search-form]");
    var queryInput = root.querySelector("[data-search-query]");
    var yearSelect = root.querySelector("[data-search-year]");
    var regionSelect = root.querySelector("[data-search-region]");
    var typeSelect = root.querySelector("[data-search-type]");
    var results = root.querySelector("[data-search-results]");
    var count = root.querySelector("[data-search-count]");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function render() {
      var query = normalize(queryInput && queryInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var region = normalize(regionSelect && regionSelect.value);
      var type = normalize(typeSelect && typeSelect.value);

      var matched = window.SEARCH_MOVIES.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.genre,
          movie.region,
          movie.year,
          movie.type,
          movie.tags,
          movie.oneLine
        ].join(" "));

        if (query && text.indexOf(query) === -1) {
          return false;
        }
        if (year && normalize(movie.year) !== year) {
          return false;
        }
        if (region && normalize(movie.region) !== region) {
          return false;
        }
        if (type && normalize(movie.type) !== type) {
          return false;
        }
        return true;
      });

      var limited = matched.slice(0, 120);
      results.innerHTML = limited.map(movieCardHtml).join("
");
      count.textContent = "找到 " + matched.length + " 条结果" + (matched.length > limited.length ? "，当前显示前 " + limited.length + " 条" : "");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      render();
    });

    [queryInput, yearSelect, regionSelect, typeSelect].forEach(function (input) {
      if (input) {
        input.addEventListener("input", render);
        input.addEventListener("change", render);
      }
    });

    render();
  }

  window.initializeMoviePlayer = function (source, playerId) {
    function attach() {
      var root = document.getElementById(playerId);
      if (!root) {
        return;
      }

      var video = root.querySelector("video");
      var trigger = root.querySelector(".player-cover");
      var hls = null;
      var prepared = false;

      if (!video || !trigger) {
        return;
      }

      function prepare() {
        if (prepared) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }

        prepared = true;
      }

      function play() {
        prepare();
        root.classList.add("is-playing");
        video.setAttribute("controls", "controls");
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            root.classList.remove("is-playing");
          });
        }
      }

      trigger.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!prepared) {
          play();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", attach);
    } else {
      attach();
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    setupHeroCarousel();
    setupCardFilters();
    setupSearchPage();
  });
})();
