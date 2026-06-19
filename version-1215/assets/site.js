(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyGridTools(scope) {
    var grid = scope.querySelector('[data-card-grid]');
    var input = scope.querySelector('[data-filter-input]');
    var select = scope.querySelector('[data-sort-select]');

    if (!grid) {
      return;
    }

    function cards() {
      return Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      cards().forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.hot,
          card.dataset.region,
          card.dataset.type,
          card.textContent
        ].join(' '));
        card.classList.toggle('is-hidden', query && haystack.indexOf(query) === -1);
      });
    }

    function applySort() {
      if (!select) {
        return;
      }
      var mode = select.value;
      var sorted = cards().sort(function (a, b) {
        var yearA = Number(a.dataset.year || 0);
        var yearB = Number(b.dataset.year || 0);
        var hotA = Number(a.dataset.hot || 0);
        var hotB = Number(b.dataset.hot || 0);
        var titleA = normalize(a.dataset.title);
        var titleB = normalize(b.dataset.title);

        if (mode === 'year-asc') {
          return yearA - yearB || titleA.localeCompare(titleB, 'zh-Hans-CN');
        }
        if (mode === 'hot-desc') {
          return hotB - hotA || yearB - yearA;
        }
        if (mode === 'title-asc') {
          return titleA.localeCompare(titleB, 'zh-Hans-CN');
        }
        return yearB - yearA || hotB - hotA;
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (select) {
      select.addEventListener('change', function () {
        applySort();
        applyFilter();
      });
      applySort();
    }
  }

  applyGridTools(document);

  document.querySelectorAll('[data-player]').forEach(function (wrap) {
    var video = wrap.querySelector('video');
    var button = wrap.querySelector('.player-start');
    var streamUrl = wrap.dataset.stream;
    var hlsInstance = null;

    function attachStream() {
      if (!video || !streamUrl || video.dataset.ready === '1') {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          backBufferLength: 30
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      video.dataset.ready = '1';
    }

    function start() {
      attachStream();
      wrap.classList.add('is-started');
      if (video) {
        video.play().catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('play', function () {
        wrap.classList.add('is-started');
      });
      video.addEventListener('emptied', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    }
  });
})();
