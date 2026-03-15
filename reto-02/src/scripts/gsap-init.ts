import { gsap } from 'gsap';

function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything immediately without animation
    gsap.set('.stat-card, .artist-circle, .track-row, .cta-banner', {
      opacity: 1, y: 0, x: 0, scale: 1,
    });
    // Genre fills: set to their target widths immediately
    document.querySelectorAll<HTMLElement>('.genre-fill').forEach(el => {
      const target = el.style.getPropertyValue('--target-width') || el.style.width;
      if (target) el.style.width = target;
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 1. Sidebar stat cards stagger in
  tl.from('.stat-card', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.1,
  });

  // 2. Top artist circles scale up
  tl.from('.artist-circle', {
    scale: 0, opacity: 0, duration: 0.5, stagger: 0.08,
  }, '-=0.2');

  // 3. Genre bars: capture current (target) widths, reset to 0, animate back
  const genreFills = document.querySelectorAll<HTMLElement>('.genre-fill');
  const savedWidths: string[] = [];
  genreFills.forEach(el => {
    // The inline style width set by time-range.ts is the target
    savedWidths.push(el.style.width || el.style.getPropertyValue('--target-width') || '0%');
    el.style.width = '0px';
  });
  tl.to('.genre-fill', {
    width: (_i: number, el: HTMLElement) => savedWidths[Array.from(genreFills).indexOf(el)] || '0%',
    duration: 0.8,
    stagger: 0.08,
    ease: 'power2.out',
  }, '-=0.3');

  // 4. Radar polygon morph from center point
  const radarPoly = document.getElementById('radar-polygon');
  if (radarPoly) {
    const finalPoints = radarPoly.getAttribute('points') || '';
    const cx = 90, cy = 80;
    const centerPoint = Array(6).fill(`${cx},${cy}`).join(' ');
    radarPoly.setAttribute('points', centerPoint);
    tl.to(radarPoly, {
      attr: { points: finalPoints },
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');
  }

  // 5. Track rows slide in from right
  tl.from('.track-row', {
    x: 30, opacity: 0, duration: 0.4, stagger: 0.04,
  }, '-=0.4');

  // 6. CTA banner fades up
  tl.from('.cta-banner', {
    y: 20, opacity: 0, duration: 0.4,
  }, '-=0.2');
}

// Use requestAnimationFrame after DOMContentLoaded so time-range.ts has
// already populated the DOM and set genre bar widths before we capture them.
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(initAnimations);
});
