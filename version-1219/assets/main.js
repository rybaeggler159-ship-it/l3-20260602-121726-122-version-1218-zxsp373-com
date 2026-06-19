(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var next = hero.querySelector('[data-hero-next]');
    var prev = hero.querySelector('[data-hero-prev]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function run() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        run();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        run();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        run();
      });
    }

    show(0);
    run();
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

  inputs.forEach(function (input) {
    var root = input.closest('section') || document;
    var yearSelect = root.querySelector('[data-filter-year]');
    var reset = root.querySelector('[data-filter-reset]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));

    function apply() {
      var keyword = input.value.trim().toLowerCase();
      var year = yearSelect ? yearSelect.value : '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var hitKeyword = !keyword || text.indexOf(keyword) !== -1;
        var hitYear = !year || card.getAttribute('data-year') === year;
        card.classList.toggle('hidden-card', !(hitKeyword && hitYear));
      });
    }

    input.addEventListener('input', apply);

    if (yearSelect) {
      yearSelect.addEventListener('change', apply);
    }

    if (reset) {
      reset.addEventListener('click', function () {
        input.value = '';
        if (yearSelect) {
          yearSelect.value = '';
        }
        apply();
      });
    }
  });
})();
