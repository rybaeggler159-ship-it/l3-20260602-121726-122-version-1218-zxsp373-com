(function () {
  const video = document.getElementById("movie-player");
  const cover = document.querySelector(".play-cover");

  if (!video) {
    return;
  }

  const source = video.getAttribute("data-src");
  let hasStarted = false;

  function attachSource() {
    if (!source || hasStarted) {
      return;
    }

    hasStarted = true;

    if (cover) {
      cover.classList.add("is-hidden");
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = source;
    video.play().catch(function () {});
  }

  if (cover) {
    cover.addEventListener("click", attachSource);
  }

  video.addEventListener("click", function () {
    if (!hasStarted) {
      attachSource();
    }
  });
})();
