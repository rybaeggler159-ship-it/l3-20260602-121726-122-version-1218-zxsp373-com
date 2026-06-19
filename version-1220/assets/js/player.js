(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (container) {
    var video = container.querySelector('video');
    var button = container.querySelector('[data-play]');
    var stream = container.getAttribute('data-stream');
    var hlsInstance = null;

    if (!video || !stream) {
      return;
    }

    var prepare = function () {
      if (video.getAttribute('data-ready') === 'true') {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }

      video.setAttribute('data-ready', 'true');
      video.controls = true;
    };

    var play = function () {
      prepare();
      container.classList.add('is-playing');
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
})();
