(() => {
  const counterElements = document.querySelectorAll('.live-counter');
  const audioToggle = document.getElementById('audio-toggle');
  const audioStatus = document.getElementById('audioStatus');
  const systemAudio = document.getElementById('systemAudio');
  const escalatorBottomButton = document.querySelector('[data-scroll-bottom]');
  const backToTopButton = document.getElementById('backToTop');

  const animateCounters = () => {
    counterElements.forEach((element) => {
      const targetValue = Number.parseFloat(element.dataset.counterTarget || '0');
      const suffix = element.dataset.counterSuffix || '';
      const decimalPlaces = Number.isInteger(targetValue) ? 0 : 1;
      const duration = 1800;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = targetValue * progress;
        element.textContent = `${value.toFixed(decimalPlaces)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = `${targetValue.toFixed(decimalPlaces)}${suffix}`;
        }
      };

      requestAnimationFrame(update);
    });
  };

  const initAudioControls = () => {
    if (!audioToggle || !audioStatus || !systemAudio) {
      return;
    }

    const setAudioState = (label, status) => {
      audioToggle.textContent = label;
      audioStatus.textContent = status;
    };

    const hasPlayableSource =
      systemAudio.querySelectorAll('source').length > 0 || Boolean(systemAudio.getAttribute('src'));

    setAudioState('AUDIO: PLAY', hasPlayableSource ? 'Audio board ready (click to start)' : 'No audio source configured');

    const primeAudio = async () => {
      try {
        const playAttempt = systemAudio.play();
        if (playAttempt && typeof playAttempt.then === 'function') {
          await playAttempt;
        }
      } catch {
        // Autoplay is blocked in many browsers by policy; this should never block page scripts.
        setAudioState('AUDIO: PLAY', 'Autoplay blocked by browser. Press play.');
      }
    };

    if (hasPlayableSource) {
      primeAudio();
    }

    systemAudio.addEventListener('play', () => {
      setAudioState('AUDIO: PAUSE', 'Cyberpunk stream active');
    });

    systemAudio.addEventListener('pause', () => {
      setAudioState('AUDIO: PLAY', 'Paused');
    });

    systemAudio.addEventListener('ended', () => {
      setAudioState('AUDIO: PLAY', 'Playback ended');
    });

    systemAudio.addEventListener('error', () => {
      setAudioState('AUDIO: PLAY', 'Audio load issue. Use Download Audio link.');
    });

    audioToggle.addEventListener('click', async () => {
      try {
        if (systemAudio.paused) {
          await systemAudio.play();
        } else {
          systemAudio.pause();
        }
      } catch {
        setAudioState('AUDIO: PLAY', 'Browser blocked autoplay. Press play in controls below.');
      }
    });
  };

  const initEscalators = () => {
    const slowScrollDuration = 12000;

    const smoothScrollTo = (targetY, duration = slowScrollDuration) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        window.scrollTo({ top: startY + distance * eased, behavior: 'auto' });

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    if (escalatorBottomButton) {
      const scrollToBottom = () => {
        smoothScrollTo(document.body.scrollHeight, slowScrollDuration);
      };

      escalatorBottomButton.addEventListener('mouseenter', scrollToBottom);
      escalatorBottomButton.addEventListener('focus', scrollToBottom);
      escalatorBottomButton.addEventListener('click', scrollToBottom);
    }

    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        smoothScrollTo(0, slowScrollDuration);
      });
    }
  };

  const startDeckEffects = () => {
    animateCounters();
    initAudioControls();
    initEscalators();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDeckEffects, { once: true });
  } else {
    startDeckEffects();
  }
})();
