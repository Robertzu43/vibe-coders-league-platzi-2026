import { gsap } from 'gsap';

function initViewSwitch() {
  const navLinks = document.querySelectorAll<HTMLButtonElement>('.nav-link');
  const viewContents = document.querySelectorAll<HTMLElement>('.view-content');
  let isAnimating = false;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetView = link.dataset.view;
      if (!targetView || isAnimating) return;

      const currentView = document.querySelector<HTMLElement>('.view-content:not([style*="display: none"])');
      const nextView = document.querySelector<HTMLElement>(`.view-content[data-view="${targetView}"]`);
      if (!currentView || !nextView || currentView === nextView) return;

      isAnimating = true;

      // Update active nav link
      navLinks.forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
      });
      link.classList.add('active');
      link.setAttribute('aria-selected', 'true');

      // GSAP crossfade transition
      gsap.to(currentView, {
        opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          currentView.style.display = 'none';
          currentView.style.opacity = '1';
          nextView.style.display = '';
          nextView.style.opacity = '0';
          gsap.to(nextView, {
            opacity: 1, duration: 0.3, ease: 'power2.out',
            onComplete: () => { isAnimating = false; }
          });
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initViewSwitch);
