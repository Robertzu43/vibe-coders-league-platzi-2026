import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set('.section-title, .dock-item, .timeline-item, .sponsor-card, .ticket-card, .venue-card', {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    });
    gsap.set('.venue-hero', { clipPath: 'inset(0 0% 0 0)' });
    const venueEl = document.querySelector('.venue-hero');
    if (venueEl) venueEl.classList.add('revealed');
    return;
  }

  // 1. Hero pin + zoom
  gsap.to('.hero-content', {
    scale: 1.15,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=50%',
      scrub: 1,
      pin: true,
    },
  });

  // 2. Navbar background: toggle .scrolled class when scrolling past the hero
  const nav = document.querySelector('nav');
  if (nav) {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom top',
      onLeave: () => nav.classList.add('scrolled'),
      onEnterBack: () => nav.classList.remove('scrolled'),
    });
  }

  // 3. Section title reveals (.section-title elements start at opacity:0, translateY(60px))
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.to(title as Element, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: title as Element,
        start: 'top 80%',
      },
    });
  });

  // 4. Dock items stagger (start at opacity:0, translateY(30px))
  const speakersDock = document.querySelector('.speakers-dock');
  if (speakersDock) {
    gsap.to('.dock-item', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.speakers-dock',
        start: 'top 75%',
      },
    });
  }

  // 5. Agenda timeline items — each starts at opacity:0 with translateX offset
  //    .timeline-item--right starts at translateX(40px), --left at translateX(-40px)
  gsap.utils.toArray('.timeline-item').forEach((item) => {
    const el = item as HTMLElement;
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    });
  });

  // 6. Location cinematic reveal — clip-path wipe + parallax
  const venueHero = document.querySelector('.venue-hero');
  if (venueHero) {
    gsap.to('.venue-hero', {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '#ubicacion',
        start: 'top 70%',
      },
      onComplete: () => {
        venueHero.classList.add('revealed');
      },
    });

    ScrollTrigger.matchMedia({
      '(min-width: 768px)': function () {
        gsap.to('.venue-image', {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: '#ubicacion',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      },
      '(max-width: 767px)': function () {
        gsap.to('.venue-image', {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: '#ubicacion',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      },
    });
  }

  // 6b. Venue cards stagger
  const venueCards = document.querySelectorAll('.venue-card');
  if (venueCards.length) {
    gsap.to('.venue-card', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.venue-cards',
        start: 'top 80%',
      },
    });
  }

  // 7. Sponsor cards stagger by tier
  ['platinum', 'gold', 'silver'].forEach((tier) => {
    const tierSection = document.querySelector(`.tier-${tier}`);
    if (tierSection) {
      gsap.to(`.tier-${tier} .sponsor-card`, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: `.tier-${tier}`,
          start: 'top 80%',
        },
      });
    }
  });

  // 8. Ticket cards stagger (start at opacity:0, scale(0.9))
  const ticketsGrid = document.querySelector('.tickets-grid');
  if (ticketsGrid) {
    gsap.to('.ticket-card', {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.tickets-grid',
        start: 'top 75%',
      },
    });
  }
}

document.addEventListener('DOMContentLoaded', initAnimations);
