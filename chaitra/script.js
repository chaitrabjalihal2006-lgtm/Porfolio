/**
 * PIXEL ART RETRO PORTFOLIO - SCRIPT
 * Software Engineer: Chaitra B. Jalihal
 * 
 * Features:
 * - Theme Detection via CSS Media Queries (prefers-color-scheme)
 * - Interactive Night Mode Toggle with LocalStorage persistence
 * - Synthesized 8-Bit Retro Audio Effects (Web Audio API)
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. THEME DETECTION & TOGGLE SYSTEM
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * Determine current active theme (checks manual attribute first, then media query)
   */
  function getCurrentTheme() {
    const manualTheme = document.documentElement.getAttribute('data-theme');
    if (manualTheme === 'dark' || manualTheme === 'light') {
      return manualTheme;
    }
    return mediaQuery.matches ? 'dark' : 'light';
  }

  /**
   * Updates the button UI to reflect current theme
   */
  function updateToggleUI(theme) {
    if (!themeIcon || !themeText) return;

    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'NIGHT RETRO';
    } else {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'DAY RETRO';
    }
  }

  /**
   * Set theme explicitly ('light' | 'dark' | null for auto)
   */
  function setTheme(newTheme) {
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
      updateToggleUI('dark');
    } else if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
      updateToggleUI('light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('portfolio-theme');
      updateToggleUI(mediaQuery.matches ? 'dark' : 'light');
    }
  }

  // Check saved preference on load
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
  } else {
    // Default to system browser media query
    updateToggleUI(mediaQuery.matches ? 'dark' : 'light');
  }

  // Listen for system browser theme changes (e.g., OS switches to dark mode)
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-update if the user hasn't set an explicit manual override
    if (!localStorage.getItem('portfolio-theme')) {
      updateToggleUI(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button click handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      play8BitBeep(520, 0.08); // retro click blip
      const current = getCurrentTheme();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. SYNTHESIZED 8-BIT SOUND EFFECTS (WEB AUDIO API)
  // Subtle retro square-wave audio feedback for authentic arcade vibe
  // -------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function play8BitBeep(freq = 440, duration = 0.08) {
    try {
      initAudio();
      if (!audioCtx || audioCtx.state === 'suspended') {
        audioCtx?.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square'; // Classic 8-bit sound wave
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context restricted or not supported; gracefully ignore
    }
  }

  // Attach sound to interactive buttons and links
  document.querySelectorAll('.pixel-btn, .nav-link, .header-social-link, .clickable-account-pill, .footer-link-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      play8BitBeep(330, 0.04); // subtle hover pip
    });
    btn.addEventListener('click', () => {
      play8BitBeep(660, 0.08); // energetic action pip
    });
  });

})();
