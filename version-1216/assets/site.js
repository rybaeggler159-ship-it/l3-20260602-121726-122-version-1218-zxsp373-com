(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  if (slides.length > 1) {
    var current = 0;
    var activate = function (index) {
      slides[current].classList.remove('active');
      if (dots[current]) {
        dots[current].classList.remove('active');
      }
      current = index;
      slides[current].classList.add('active');
      if (dots[current]) {
        dots[current].classList.add('active');
      }
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
      });
    });
    setInterval(function () {
      activate((current + 1) % slides.length);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var typeSelect = document.querySelector('[data-type-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var filterCards = function () {
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    cards.forEach(function (card) {
      var haystack = [card.getAttribute('data-title'), card.getAttribute('data-tags'), card.getAttribute('data-year')].join(' ').toLowerCase();
      var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var okYear = !year || card.getAttribute('data-year') === year;
      var okType = !type || haystack.indexOf(type.toLowerCase()) !== -1;
      card.classList.toggle('hidden-card', !(okKeyword && okYear && okType));
    });
  };
  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', filterCards);
  }
  if (typeSelect) {
    typeSelect.addEventListener('change', filterCards);
  }

  var player = document.querySelector('[data-player-video]');
  var cover = document.querySelector('[data-play-cover]');
  var startPlayer = function () {
    if (!player) {
      return;
    }
    var source = player.getAttribute('data-video');
    if (!source) {
      return;
    }
    if (!player.getAttribute('src')) {
      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(player);
      } else {
        player.src = source;
      }
    }
    if (cover) {
      cover.classList.add('hidden');
    }
    var playPromise = player.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  };
  if (cover) {
    cover.addEventListener('click', startPlayer);
  }
  if (player) {
    player.addEventListener('click', function () {
      if (player.paused) {
        startPlayer();
      }
    });
  }
})();
