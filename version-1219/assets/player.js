(function () {
  function bindPlayer(box) {
    var video = box.querySelector('video');
    var overlay = box.querySelector('.player-overlay');
    var error = box.querySelector('.player-error');
    var source = box.getAttribute('data-video');
    var loaded = false;
    var hls = null;

    function fail(message) {
      if (error) {
        error.textContent = message;
        error.classList.add('show');
      }
    }

    function load() {
      if (loaded || !video || !source) {
        return;
      }
      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            fail('视频加载失败，请稍后再试');
          }
        });
      } else {
        fail('视频暂时无法播放');
      }
    }

    function start() {
      load();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.setAttribute('controls', 'controls');
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(bindPlayer);
})();
