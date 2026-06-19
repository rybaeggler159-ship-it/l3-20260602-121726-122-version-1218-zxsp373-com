function setupHeroSlider() {
  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  if (!slides.length) {
    return;
  }
  var current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }
  dots.forEach(function(dot, dotIndex) {
    dot.addEventListener("click", function() {
      show(dotIndex);
    });
  });
  setInterval(function() {
    show(current + 1);
  }, 5200);
}

function setupCardFilter() {
  var input = document.querySelector("[data-search-input]");
  var typeSelect = document.querySelector("[data-type-filter]");
  var yearSelect = document.querySelector("[data-year-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  if (!cards.length) {
    return;
  }
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }
  function apply() {
    var keyword = normalize(input && input.value);
    var typeValue = normalize(typeSelect && typeSelect.value);
    var yearValue = normalize(yearSelect && yearSelect.value);
    cards.forEach(function(card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" "));
      var cardType = normalize(card.getAttribute("data-type"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchType = !typeValue || cardType === typeValue;
      var matchYear = !yearValue || cardYear === yearValue;
      card.classList.toggle("hide-card", !(matchKeyword && matchType && matchYear));
    });
  }
  [input, typeSelect, yearSelect].forEach(function(element) {
    if (element) {
      element.addEventListener("input", apply);
      element.addEventListener("change", apply);
    }
  });
}

function setupMoviePlayer(video, overlay, source) {
  if (!video || !source) {
    return;
  }
  var ready = false;
  function attach() {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }
  function start() {
    attach();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function() {});
    }
  }
  if (overlay) {
    overlay.addEventListener("click", start);
  }
  video.addEventListener("click", function() {
    if (video.paused) {
      start();
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  setupHeroSlider();
  setupCardFilter();
});
