(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initMenu() {
    var button = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (!button || !nav) return;
    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    if (!slides.length) return;
    var index = 0;
    var timer = null;

    function setSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        setSlide(index + 1);
      }, 5200);
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      play();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    setSlide(0);
    play();
  }

  function getQueryValue(name) {
    var params = new URLSearchParams(window.location.search);
    return (params.get(name) || '').trim();
  }

  function initFilters() {
    var filter = document.querySelector('[data-filter]');
    var list = document.querySelector('[data-card-list]');
    if (!filter || !list) return;
    var input = filter.querySelector('.filter-input');
    var select = filter.querySelector('.filter-select');
    var reset = filter.querySelector('.filter-reset');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var category = select ? select.value.trim() : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okCategory = !category || cardCategory === category;
        card.classList.toggle('is-hidden', !(okKeyword && okCategory));
      });
    }

    if (input) {
      var q = getQueryValue('q');
      if (q) input.value = q;
      input.addEventListener('input', apply);
    }

    if (select) select.addEventListener('change', apply);
    if (reset) {
      reset.addEventListener('click', function () {
        if (input) input.value = '';
        if (select) select.value = '';
        apply();
      });
    }

    apply();
  }

  function initPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var trigger = shell.querySelector('.play-trigger');
      var hlsInstance = null;
      var started = false;
      if (!video || !trigger) return;

      function start() {
        var stream = video.getAttribute('data-stream');
        if (!stream) return;
        shell.classList.add('is-playing');
        video.controls = true;

        if (!started) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
          } else {
            video.src = stream;
          }
          started = true;
        }

        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      }

      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        start();
      });

      video.addEventListener('click', function () {
        if (!started) start();
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) hlsInstance.destroy();
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
