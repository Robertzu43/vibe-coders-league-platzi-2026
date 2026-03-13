function initTypewriter() {
  const titleEl = document.getElementById('hero-title');
  const cursorEl = document.getElementById('hero-cursor');
  const subtitleEl = document.getElementById('hero-subtitle');
  const infoEl = document.getElementById('hero-info');
  const ctaEl = document.getElementById('hero-cta');

  if (!titleEl) return;

  const text = 'VIBECODE SUMMIT COLOMBIA';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    titleEl.textContent = text;
    subtitleEl?.classList.add('visible');
    infoEl?.classList.add('visible');
    ctaEl?.classList.add('visible');
    if (cursorEl) cursorEl.style.display = 'none';
    return;
  }

  let i = 0;
  const speed = 60; // ms per character
  const pauseAfterVibecode = 400; // ms pause after "VIBECODE"

  function type() {
    if (i < text.length) {
      titleEl!.textContent += text.charAt(i);
      i++;

      // Pause after "VIBECODE" (8 chars + space = index 8)
      if (i === 8) {
        setTimeout(type, pauseAfterVibecode);
      } else {
        setTimeout(type, speed);
      }
    } else {
      // Typing complete — reveal subtitle, info, CTA sequentially
      setTimeout(() => {
        subtitleEl?.classList.add('visible');
        setTimeout(() => {
          infoEl?.classList.add('visible');
          setTimeout(() => {
            ctaEl?.classList.add('visible');
          }, 200);
        }, 200);
      }, 500);
    }
  }

  type();
}

document.addEventListener('DOMContentLoaded', initTypewriter);
