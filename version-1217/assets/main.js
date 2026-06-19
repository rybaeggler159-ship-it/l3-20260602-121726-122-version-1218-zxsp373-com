const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
let currentSlide = 0;
let slideTimer = null;

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlide);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentSlide);
  });
}

function startCarousel() {
  if (slides.length <= 1) {
    return;
  }

  slideTimer = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5200);
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (slideTimer) {
      window.clearInterval(slideTimer);
    }

    showSlide(index);
    startCarousel();
  });
});

startCarousel();

const searchInput = document.querySelector('[data-search-input]');
const emptyResult = document.querySelector('[data-empty-result]');
const cards = Array.from(document.querySelectorAll('.movie-card'));

if (searchInput && cards.length) {
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = [
        card.dataset.title || '',
        card.dataset.tags || '',
        card.dataset.year || '',
        card.dataset.category || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      const matched = !keyword || text.includes(keyword);

      card.hidden = !matched;

      if (matched) {
        visibleCount += 1;
      }
    });

    if (emptyResult) {
      emptyResult.hidden = visibleCount !== 0;
    }
  });
}
