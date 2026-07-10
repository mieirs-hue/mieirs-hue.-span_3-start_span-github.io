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

    let audioInitialized = false;

    const setAudioState = (label, status) => {
      audioToggle.textContent = label;
      audioStatus.textContent = status;
    };

    const initializeAudio = async () => {
      if (audioInitialized) {
        return;
      }

      audioInitialized = true;

      try {
        await systemAudio.play();
        setAudioState('AUDIO: PAUSE', 'Cyberpunk stream active');
      } catch {
        setAudioState('AUDIO: PLAY', 'Waiting for interaction...');
      }
    };

    setAudioState('AUDIO: PLAY', 'Drop gadget-theme.mp3 into assets/audio');

    ['click', 'pointerdown', 'keydown', 'touchstart'].forEach((eventName) => {
      document.addEventListener(eventName, initializeAudio, { once: true });
    });

    audioToggle.addEventListener('click', async () => {
      try {
        if (systemAudio.paused) {
          audioInitialized = true;
          await systemAudio.play();
          setAudioState('AUDIO: PAUSE', 'Cyberpunk stream active');
        } else {
          systemAudio.pause();
          setAudioState('AUDIO: PLAY', 'Paused');
        }
      } catch {
        setAudioState('AUDIO: PLAY', 'No audio file detected. Add assets/audio/gadget-theme.mp3');
      }
    });
  };

  const initEscalators = () => {
    if (escalatorBottomButton) {
      const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      };

      escalatorBottomButton.addEventListener('mouseenter', scrollToBottom);
      escalatorBottomButton.addEventListener('focus', scrollToBottom);
      escalatorBottomButton.addEventListener('click', scrollToBottom);
    }

    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  animateCounters();
  initAudioControls();
  initEscalators();
})();
