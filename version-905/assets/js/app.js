(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  });

  document.querySelectorAll('[data-filter-block]').forEach(function (block) {
    var input = block.querySelector('[data-filter-text]');
    var year = block.querySelector('[data-filter-year]');
    var region = block.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(block.querySelectorAll('[data-filter-list] .movie-card'));
    var empty = block.querySelector('[data-empty]');

    function value(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function textOf(card, name) {
      return (card.getAttribute(name) || '').toLowerCase();
    }

    function apply() {
      var q = value(input);
      var y = value(year);
      var r = value(region);
      var visible = 0;

      cards.forEach(function (card) {
        var searchText = [
          textOf(card, 'data-title'),
          textOf(card, 'data-year'),
          textOf(card, 'data-region'),
          textOf(card, 'data-tags')
        ].join(' ');
        var matched = true;

        if (q && searchText.indexOf(q) === -1) {
          matched = false;
        }

        if (y && textOf(card, 'data-year') !== y) {
          matched = false;
        }

        if (r && textOf(card, 'data-region') !== r) {
          matched = false;
        }

        card.classList.toggle('hidden', !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [input, year, region].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });
  });

  document.querySelectorAll('[data-player]').forEach(function (panel) {
    var video = panel.querySelector('video');
    var button = panel.querySelector('.player-start');

    if (!video || !button) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    var attached = false;

    function attach() {
      if (attached || !stream) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function start() {
      attach();
      video.controls = true;
      panel.classList.add('is-playing');
      var playTask = video.play();

      if (playTask && playTask.catch) {
        playTask.catch(function () {
          panel.classList.remove('is-playing');
        });
      }
    }

    button.addEventListener('click', start);

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      panel.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        panel.classList.remove('is-playing');
      }
    });
  });
})();
