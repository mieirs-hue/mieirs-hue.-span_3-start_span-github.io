(() => {
  const counterElements = document.querySelectorAll('.live-counter');
  const logTrack = document.getElementById('systemLogTrack');
  const audioToggle = document.getElementById('audioToggle');
  const audioStatus = document.getElementById('audioStatus');
  const systemAudio = document.getElementById('systemAudio');
  const escalatorTargetButton = document.querySelector('[data-scroll-target]');
  const escalatorBottomButton = document.querySelector('[data-scroll-bottom]');

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

  const buildSystemLog = () => {
    if (!logTrack) {
      return;
    }

    const diagnostics = [
      '[ACTIVE] LIDAR alignment sweep running | zone A-3',
      '[ACTIVE] ORB keypoint density check | threshold 950',
      '[ACTIVE] Drive lane confidence | 99.2 percent stable',
      '[ACTIVE] Wheel odometry sync | delta 0.02',
      '[ACTIVE] Camera offset correction | plus 1.7 deg',
      '[ACTIVE] Tape signature validation | pass',
      '[ACTIVE] Route planner dry-run | no collisions detected',
      '[ACTIVE] Calibration persistence write | complete',
      '[ACTIVE] Emergency fallback map | standby ready',
      '[ACTIVE] Uplink telemetry stream | nominal'
    ];

    const repeatedLogs = diagnostics.concat(diagnostics);
    logTrack.innerHTML = '';
    repeatedLogs.forEach((entry) => {
      const line = document.createElement('p');
      line.className = 'log-line';
      line.textContent = entry;
      logTrack.appendChild(line);
    });
  };

  const triggerFlyingBanner = () => {
    const banner = document.createElement('div');
    banner.className = 'flying-banner';
    banner.textContent = 'FIELD UNIT ONLINE | CALIBRATION SWEEP ACTIVE';

    const topPositions = ['16%', '24%', '32%', '40%'];
    banner.style.top = topPositions[Math.floor(Math.random() * topPositions.length)];

    document.body.appendChild(banner);

    requestAnimationFrame(() => {
      banner.classList.add('is-active');
    });

    setTimeout(() => {
      banner.remove();
    }, 9300);
  };

  const initAudioControls = () => {
    if (!audioToggle || !audioStatus || !systemAudio) {
      return;
    }

    const setAudioState = (label, status) => {
      audioToggle.textContent = label;
      audioStatus.textContent = status;
    };

    setAudioState('System Audio: Initialize', 'Idle');

    audioToggle.addEventListener('click', async () => {
      try {
        if (systemAudio.paused) {
          await systemAudio.play();
          setAudioState('System Audio: Pause', 'Active');
        } else {
          systemAudio.pause();
          setAudioState('System Audio: Resume', 'Standby');
        }
      } catch {
        setAudioState('System Audio: Retry', 'No audio file detected. Add system-audio.mp3');
      }
    });
  };

  const initEscalators = () => {
    if (escalatorTargetButton) {
      escalatorTargetButton.addEventListener('click', () => {
        const targetId = escalatorTargetButton.getAttribute('data-scroll-target');
        const target = targetId ? document.getElementById(targetId) : null;

        if (!target) {
          return;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('escalator-target-pulse');
        setTimeout(() => target.classList.remove('escalator-target-pulse'), 1200);
      });
    }

    if (escalatorBottomButton) {
      const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      };

      escalatorBottomButton.addEventListener('mouseenter', scrollToBottom);
      escalatorBottomButton.addEventListener('focus', scrollToBottom);
      escalatorBottomButton.addEventListener('click', scrollToBottom);
    }
  };

  animateCounters();
  buildSystemLog();
  initAudioControls();
  initEscalators();
  triggerFlyingBanner();
  setInterval(triggerFlyingBanner, 10000);
})();
