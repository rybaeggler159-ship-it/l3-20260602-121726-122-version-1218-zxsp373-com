(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("img[data-fallback]").forEach(function (image) {
    image.addEventListener("error", function () {
      const frame = image.closest(".poster-frame");
      if (frame) {
        frame.classList.add("image-fallback");
      }
      image.style.display = "none";
    }, { once: true });
  });

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const thumbs = Array.from(document.querySelectorAll(".hero-thumb"));
  let activeIndex = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    thumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle("is-active", thumbIndex === activeIndex);
    });
  }

  function startSlider() {
    if (timer) {
      window.clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener("click", function () {
      showSlide(index);
      startSlider();
    });
  });

  showSlide(0);
  startSlider();

  const searchInput = document.querySelector("[data-site-search]");
  if (searchInput) {
    const cards = Array.from(document.querySelectorAll("[data-search]"));
    searchInput.addEventListener("input", function () {
      const keyword = searchInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = card.getAttribute("data-search").toLowerCase();
        card.classList.toggle("hidden-by-search", keyword && !text.includes(keyword));
      });
    });
  }
})();
