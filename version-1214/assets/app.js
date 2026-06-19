(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('[data-empty-message]');
    var tabs = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
    var activeFilter = 'all';

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-filter') || '').toLowerCase();
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesFilter = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
        var showCard = matchesQuery && matchesFilter;
        card.hidden = !showCard;
        if (showCard) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activeFilter = tab.getAttribute('data-filter-value') || 'all';
        tabs.forEach(function (item) {
          item.classList.toggle('is-active', item === tab);
        });
        applyFilter();
      });
    });

    applyFilter();
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('[data-player-video]');
    var cover = player.querySelector('[data-player-cover]');
    var playUrl = player.getAttribute('data-video-url');
    var ready = false;

    function attach() {
      if (!video || !playUrl || ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
        player._hls = hls;
      } else {
        video.src = playUrl;
      }
      ready = true;
    }

    function play() {
      attach();
      player.classList.add('is-started');
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (cover && video) {
      cover.addEventListener('click', play);
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-started');
      });
    }
  });
})();
