interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function initNeuralNetwork() {
  const canvas = document.getElementById('neural-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const CONNECTION_DISTANCE = 150;
  const ACCENT = { r: 124, g: 58, b: 237 };
  const BLUE = { r: 59, g: 130, b: 246 };

  let nodes: Node[] = [];
  let animId: number;
  let width = 0;
  let pageHeight = 0;

  function resize() {
    width = window.innerWidth;
    pageHeight = document.documentElement.scrollHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas!.width = width * dpr;
    canvas!.height = window.innerHeight * dpr;
    canvas!.style.width = `${width}px`;
    canvas!.style.height = `${window.innerHeight}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createNodes() {
    // Distribute nodes across the full page height
    const count = Math.min(120, Math.max(50, Math.floor((width * pageHeight) / 25000)));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * pageHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    const vh = window.innerHeight;
    ctx!.clearRect(0, 0, width, vh);

    const scrollY = window.scrollY;
    const viewTop = scrollY - 200;
    const viewBottom = scrollY + vh + 200;

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      const ni = nodes[i];
      if (ni.y < viewTop || ni.y > viewBottom) continue;

      // Translate to viewport coordinates
      const niScreenY = ni.y - scrollY;

      for (let j = i + 1; j < nodes.length; j++) {
        const nj = nodes[j];
        if (nj.y < viewTop || nj.y > viewBottom) continue;

        const njScreenY = nj.y - scrollY;

        const dx = ni.x - nj.x;
        const dy = niScreenY - njScreenY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.12;
          const t = (i + j) % 2 === 0 ? 0 : 1;
          const r = ACCENT.r + (BLUE.r - ACCENT.r) * t;
          const g = ACCENT.g + (BLUE.g - ACCENT.g) * t;
          const b = ACCENT.b + (BLUE.b - ACCENT.b) * t;

          ctx!.beginPath();
          ctx!.moveTo(ni.x, niScreenY);
          ctx!.lineTo(nj.x, njScreenY);
          ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      if (node.y < viewTop || node.y > viewBottom) continue;

      const screenY = node.y - scrollY;
      const t = (node.x / width + node.y / pageHeight) / 2;
      const r = ACCENT.r + (BLUE.r - ACCENT.r) * t;
      const g = ACCENT.g + (BLUE.g - ACCENT.g) * t;
      const b = ACCENT.b + (BLUE.b - ACCENT.b) * t;

      ctx!.beginPath();
      ctx!.arc(node.x, screenY, node.radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.35)`;
      ctx!.fill();
    }
  }

  function update() {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > pageHeight) node.vy *= -1;

      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(pageHeight, node.y));
    }
  }

  function animate() {
    update();
    draw();
    animId = requestAnimationFrame(animate);
  }

  resize();
  createNodes();

  if (prefersReducedMotion) {
    draw();
    return;
  }

  animate();

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      createNodes();
      animate();
    }, 200);
  });
}
