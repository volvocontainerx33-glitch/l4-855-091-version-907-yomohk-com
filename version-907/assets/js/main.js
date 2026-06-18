(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var button = qs('[data-menu-button]');
    var nav = qs('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
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
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function textOf(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initFilters() {
    var form = qs('[data-filter-form]');
    var list = qs('[data-filter-list]');
    if (!form || !list) {
      return;
    }

    var keywordInput = qs('[data-filter-keyword]', form);
    var yearSelect = qs('[data-filter-year]', form);
    var regionSelect = qs('[data-filter-region]', form);
    var typeSelect = qs('[data-filter-type]', form);
    var resetButton = qs('[data-filter-reset]', form);
    var count = qs('[data-result-count]');
    var cards = qsa('.movie-card, .rank-item', list);

    function applyQueryFromUrl() {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && keywordInput) {
        keywordInput.value = q;
      }
    }

    function update() {
      var keyword = textOf(keywordInput && keywordInput.value);
      var year = textOf(yearSelect && yearSelect.value);
      var region = textOf(regionSelect && regionSelect.value);
      var type = textOf(typeSelect && typeSelect.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = textOf(card.getAttribute('data-search'));
        var cardYear = textOf(card.getAttribute('data-year'));
        var cardRegion = textOf(card.getAttribute('data-region'));
        var cardType = textOf(card.getAttribute('data-type'));
        var ok = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          ok = false;
        }
        if (year && cardYear !== year) {
          ok = false;
        }
        if (region && cardRegion !== region) {
          ok = false;
        }
        if (type && cardType !== type) {
          ok = false;
        }

        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '共 ' + visible + ' 部影片';
      }
    }

    [keywordInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', update);
        control.addEventListener('change', update);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (keywordInput) keywordInput.value = '';
        if (yearSelect) yearSelect.value = '';
        if (regionSelect) regionSelect.value = '';
        if (typeSelect) typeSelect.value = '';
        update();
      });
    }

    applyQueryFromUrl();
    update();
  }

  function initPlayers() {
    qsa('.video-player').forEach(function (video) {
      var src = video.getAttribute('data-src') || (video.querySelector('source') && video.querySelector('source').src);
      if (!src) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }

      var playerCard = video.closest('.player-card');
      var playButton = playerCard ? qs('[data-play-button]', playerCard) : null;
      if (playButton) {
        playButton.addEventListener('click', function () {
          video.play().catch(function () {
            video.controls = true;
          });
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initFilters();
    initPlayers();
  });
}());
