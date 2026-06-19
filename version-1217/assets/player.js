import { H as Hls } from './hls-dru42stk.js';

const video = document.querySelector('.movie-player');
const playLayer = document.querySelector('[data-play-layer]');
const playerState = document.querySelector('[data-player-state]');
let loaded = false;
let hls = null;

function setState(text) {
  if (playerState) {
    playerState.textContent = text;
  }
}

function loadVideo() {
  if (!video || loaded) {
    return;
  }

  const stream = video.getAttribute('data-stream');
  loaded = true;

  if (!stream) {
    setState('视频暂时无法播放');
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = stream;
    return;
  }

  if (Hls && Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(stream);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data && data.fatal) {
        setState('视频加载失败，请稍后重试');
      }
    });
    return;
  }

  setState('视频暂时无法播放');
}

function startPlay() {
  if (!video) {
    return;
  }

  loadVideo();

  const playPromise = video.play();

  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      if (playLayer) {
        playLayer.classList.remove('is-hidden');
      }
    });
  }
}

if (video) {
  video.addEventListener('play', () => {
    if (playLayer) {
      playLayer.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', () => {
    if (playLayer && video.currentTime === 0) {
      playLayer.classList.remove('is-hidden');
    }
  });

  video.addEventListener('loadedmetadata', () => {
    setState('');
  });
}

if (playLayer) {
  playLayer.addEventListener('click', startPlay);
}

window.addEventListener('beforeunload', () => {
  if (hls) {
    hls.destroy();
  }
});
