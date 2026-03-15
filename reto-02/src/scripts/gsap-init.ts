import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getScroller(): string | undefined {
  return window.innerWidth > 767 ? '.dashboard-main' : undefined;
}

function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scroller = getScroller();

  if (prefersReducedMotion) {
    gsap.set('.stat-card, .artist-circle, .cta-banner', {
      opacity: 1, y: 0, x: 0, scale: 1,
    });
    document.querySelectorAll<HTMLElement>('.genre-fill').forEach(el => {
      el.style.width = el.dataset.targetWidth || '0%';
    });
    document.querySelectorAll<HTMLElement>('.genre-number').forEach(el => {
      el.textContent = el.dataset.targetValue || '0';
    });
    document.querySelectorAll<HTMLElement>('.hour-bar').forEach(el => {
      el.style.height = el.style.getPropertyValue('--bar-height') || '0%';
    });
    return;
  }

  // 1. Sidebar stat cards stagger in
  gsap.from('.stat-card', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.1,
    ease: 'power2.out',
  });

  // 2. Top artist circles: slide in from alternating sides, flip to show minutes, flip back
  const circles = document.querySelectorAll<HTMLElement>('.artist-circle');
  const flipInners = document.querySelectorAll<HTMLElement>('.artist-circle .artist-flip-inner');

  circles.forEach((circle, i) => {
    const fromLeft = i % 2 === 0;
    const tl = gsap.timeline({ delay: 0.1 + i * 0.12 });

    // Slide in from side
    tl.from(circle, {
      x: fromLeft ? -80 : 80,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Flip to show minutes
    const inner = flipInners[i];
    if (inner) {
      tl.to(inner, {
        rotateY: 180,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '+=0.2');

      // Hold, then flip back to photo
      tl.to(inner, {
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '+=0.8');
    }
  });

  // 3. Genre breakdown: animate bars + count up numbers on scroll
  ScrollTrigger.create({
    trigger: '.genre-breakdown',
    scroller,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const fills = document.querySelectorAll<HTMLElement>('.genre-fill');
      fills.forEach((el, i) => {
        const target = el.dataset.targetWidth || '0%';
        gsap.to(el, {
          width: target,
          duration: 1.5,
          delay: i * 0.15,
          ease: 'power2.out',
        });
      });
      document.querySelectorAll<HTMLElement>('.genre-number').forEach((el, i) => {
        const target = parseInt(el.dataset.targetValue || '0', 10);
        gsap.fromTo(el, { textContent: '0' }, {
          textContent: target,
          duration: 2.5,
          delay: i * 0.15,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate() {
            el.textContent = Math.round(parseFloat(el.textContent || '0')).toString();
          },
        });
      });
      gsap.from('.genre-tile', {
        y: 20, opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.08,
        ease: 'power2.out',
      });
    },
  });

  // 4. Radar polygon morph from center point on scroll
  const radarPoly = document.getElementById('radar-polygon');
  if (radarPoly) {
    const finalPoints = radarPoly.getAttribute('points') || '';
    const cx = 90, cy = 80;
    const centerPoint = Array(6).fill(`${cx},${cy}`).join(' ');
    radarPoly.setAttribute('points', centerPoint);

    const radarSvg = document.getElementById('radar-svg');
    const dots = radarSvg?.querySelectorAll('circle[fill="#1DB954"]');
    dots?.forEach(dot => gsap.set(dot, { opacity: 0 }));

    ScrollTrigger.create({
      trigger: '.sound-dna',
      scroller,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(radarPoly, {
          attr: { points: finalPoints },
          duration: 1.8,
          ease: 'power3.out',
        });
        dots?.forEach((dot, i) => {
          gsap.to(dot, {
            opacity: 1,
            duration: 0.3,
            delay: 0.5 + i * 0.08,
          });
        });
      },
    });
  }

  // 5. Listening hours bars grow from 0 on scroll
  ScrollTrigger.create({
    trigger: '.listening-hours',
    scroller,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const bars = document.querySelectorAll<HTMLElement>('.hour-bar');
      bars.forEach((bar, i) => {
        const targetH = bar.style.getPropertyValue('--bar-height');
        gsap.to(bar, {
          height: targetH,
          duration: 1.4,
          delay: i * 0.06,
          ease: 'power3.out',
        });
      });
    },
  });

  // 6. Monthly trend line draws in on scroll
  ScrollTrigger.create({
    trigger: '.monthly-trend',
    scroller,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const polyline = document.querySelector('.trend-svg polyline') as SVGPolylineElement;
      const polygon = document.querySelector('.trend-svg polygon') as SVGPolygonElement;
      const dots = document.querySelectorAll('.trend-svg circle');

      if (polyline) {
        const length = polyline.getTotalLength();
        gsap.set(polyline, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(polyline, { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' });
      }

      if (polygon) {
        gsap.from(polygon, { opacity: 0, duration: 1.2, delay: 0.8 });
      }

      dots.forEach((dot, i) => {
        gsap.from(dot, {
          scale: 0, opacity: 0, duration: 0.4,
          delay: 0.6 + i * 0.12,
          transformOrigin: 'center',
          ease: 'back.out(2)',
        });
      });

      document.querySelectorAll('.trend-stat-value').forEach(el => {
        gsap.from(el, { opacity: 0, y: 10, duration: 0.5, delay: 1.2 });
      });
    },
  });

  // 7. Track list rows stagger in on scroll
  ScrollTrigger.create({
    trigger: '.track-list',
    scroller,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.from('.track-row', {
        x: -20, opacity: 0, duration: 0.4, stagger: 0.04,
        ease: 'power2.out',
      });
    },
  });

  // 8. CTA banner fades up on scroll
  gsap.from('.cta-banner', {
    y: 20, opacity: 0, duration: 0.4,
    scrollTrigger: {
      trigger: '.cta-banner',
      scroller,
      start: 'top 90%',
      once: true,
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(initAnimations);
});
