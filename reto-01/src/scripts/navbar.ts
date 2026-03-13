export function initNavbar() {
  const hamburger = document.querySelector<HTMLButtonElement>('.hamburger');
  const nav = document.querySelector<HTMLElement>('nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    if (nav.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  const navLinks = nav.querySelectorAll<HTMLAnchorElement>('.nav-links a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

initNavbar();
