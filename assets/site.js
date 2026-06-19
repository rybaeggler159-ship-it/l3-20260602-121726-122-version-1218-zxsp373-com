
(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  showSlide(0);

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5600);
  }

  const searchInput = document.querySelector('.site-search');
  const yearFilter = document.querySelector('.year-filter');
  const cards = Array.from(document.querySelectorAll('.movie-card'));

  function applyFilter() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      const text = (card.getAttribute('data-title') || '').toLowerCase();
      const cardYear = card.getAttribute('data-year') || '';
      const matchText = !query || text.indexOf(query) !== -1;
      const matchYear = !year || cardYear === year;
      card.classList.toggle('is-filter-hidden', !(matchText && matchYear));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }
})();
