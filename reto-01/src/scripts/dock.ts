const RANGE = 180;
const MAX_EXTRA_SCALE = 0.6;

export function initDock() {
  const dock = document.querySelector<HTMLElement>('.speakers-dock');
  if (!dock) return;

  const items = dock.querySelectorAll<HTMLElement>('.dock-item');
  const infoCard = document.querySelector<HTMLElement>('.dock-info-card');
  if (!infoCard || items.length === 0) return;

  const cardName = infoCard.querySelector<HTMLElement>('.dock-card-name');
  const cardRole = infoCard.querySelector<HTMLElement>('.dock-card-role');
  const cardCompany = infoCard.querySelector<HTMLElement>('.dock-card-company');
  const cardTags = infoCard.querySelector<HTMLElement>('.dock-card-tags');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resetDock() {
    items.forEach((item) => {
      item.style.transform = 'scale(1)';
      item.style.transformOrigin = 'bottom center';
      item.style.filter = 'grayscale(100%)';
      item.style.boxShadow = 'none';
    });
    if (infoCard) {
      infoCard.style.opacity = '0';
      infoCard.style.transform = 'translateY(10px)';
      infoCard.style.pointerEvents = 'none';
    }
  }

  function updateDock(cursorX: number) {
    const dockRect = dock!.getBoundingClientRect();
    let closestItem: HTMLElement | null = null;
    let closestDistance = Infinity;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(cursorX - centerX);
      const scale = 1 + MAX_EXTRA_SCALE * Math.max(0, 1 - distance / RANGE);

      item.style.transform = `scale(${scale})`;
      item.style.transformOrigin = 'bottom center';

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    // Apply active/inactive styles
    items.forEach((item) => {
      if (item === closestItem && closestDistance < RANGE * 0.3) {
        item.style.filter = 'grayscale(0%)';
        item.style.boxShadow = '0 0 30px rgba(124,58,237,0.5)';
      } else {
        item.style.filter = 'grayscale(100%)';
        item.style.boxShadow = 'none';
      }
    });

    // Update info card
    if (closestItem && closestDistance < RANGE * 0.3) {
      const activeItem = closestItem as HTMLElement;
      const name = activeItem.dataset.name || '';
      const role = activeItem.dataset.role || '';
      const company = activeItem.dataset.company || '';
      const tags = activeItem.dataset.tags || '';

      if (cardName) cardName.textContent = name;
      if (cardRole) cardRole.textContent = role;
      if (cardCompany) cardCompany.textContent = company;
      if (cardTags) {
        cardTags.innerHTML = tags
          .split(',')
          .filter(Boolean)
          .map((tag) => `<span class="dock-tag">${tag.trim()}</span>`)
          .join('');
      }

      // Position card centered under active item, clamped to dock bounds
      const activeRect = activeItem.getBoundingClientRect();
      const activeCenterX = activeRect.left + activeRect.width / 2;
      const cardWidth = infoCard!.offsetWidth;
      const dockLeft = dockRect.left;
      const dockRight = dockRect.right;

      let cardLeft = activeCenterX - cardWidth / 2 - dockLeft;
      // Clamp to dock bounds
      cardLeft = Math.max(0, Math.min(cardLeft, dockRect.width - cardWidth));

      infoCard!.style.left = `${cardLeft}px`;
      infoCard!.style.opacity = '1';
      infoCard!.style.transform = 'translateY(0)';
      infoCard!.style.pointerEvents = 'auto';
    } else {
      infoCard!.style.opacity = '0';
      infoCard!.style.transform = 'translateY(10px)';
      infoCard!.style.pointerEvents = 'none';
    }
  }

  // Initialize
  resetDock();

  if (prefersReducedMotion) {
    // Use click instead of mousemove
    let activeItem: HTMLElement | null = null;

    items.forEach((item) => {
      item.addEventListener('click', () => {
        if (activeItem === item) {
          activeItem = null;
          resetDock();
          return;
        }
        activeItem = item;
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        updateDock(centerX);
      });
    });
  } else {
    dock.addEventListener('mousemove', (e: MouseEvent) => {
      updateDock(e.clientX);
    });

    dock.addEventListener('mouseleave', () => {
      resetDock();
    });
  }
}
