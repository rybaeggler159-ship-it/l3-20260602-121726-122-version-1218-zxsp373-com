
(function () {
  window.initPlayer = function (source) {
    const video = document.querySelector('.video-player');
    const mask = document.querySelector('.player-mask');

    if (!video || !mask || !source) {
      return;
    }

    let ready = false;
    let hls = null;

    function attachSource() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function start() {
      attachSource();
      mask.classList.add('is-hidden');
      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    mask.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!ready) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();
