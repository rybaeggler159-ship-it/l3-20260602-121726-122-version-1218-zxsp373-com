(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var menu = document.querySelector('[data-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-dot]'));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = Number(dot.getAttribute('data-slide-dot') || '0');
        showSlide(target);
        restart();
      });
    });

    start();
  }

  var homeSearch = document.querySelector('[data-home-search]');

  if (homeSearch) {
    homeSearch.addEventListener('submit', function (event) {
      var input = homeSearch.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        window.location.href = homeSearch.getAttribute('action') || './search.html';
      }
    });
  }

  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));

  filters.forEach(function (filter) {
    var input = filter.querySelector('[data-filter-input]');
    var region = filter.querySelector('[data-filter-region]');
    var type = filter.querySelector('[data-filter-type]');
    var year = filter.querySelector('[data-filter-year]');
    var scope = filter.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    var apply = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      var regionValue = region ? region.value : '';
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var regionMatch = !regionValue || card.getAttribute('data-region') === regionValue;
        var typeMatch = !typeValue || card.getAttribute('data-type') === typeValue;
        var yearMatch = !yearValue || card.getAttribute('data-year') === yearValue;
        var queryMatch = !query || text.indexOf(query) !== -1;
        var shouldShow = regionMatch && typeMatch && yearMatch && queryMatch;
        card.hidden = !shouldShow;
        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    [input, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  });
})();
