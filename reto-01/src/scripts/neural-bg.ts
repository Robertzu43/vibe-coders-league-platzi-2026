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

  const NODE_COUNT = 40;
  const CONNECTION_DISTANCE = 160;
  const ACCENT = { r: 124, g: 58, b: 237 }; // #7c3aed
  const BLUE = { r: 59, g: 130, b: 246 }; // #3b82f6

  let nodes: Node[] = [];
  let animId: number;
  let width = 0;
  let height = 0;

  function resize() {
    const section = canvas!.parentElement;
    if (!section) return;
    width = section.offsetWidth;
    height = section.offsetHeight;
    canvas!.width = width * window.devicePixelRatio;
    canvas!.height = height * window.devicePixelRatio;
    canvas!.style.width = `${width}px`;
    canvas!.style.height = `${height}px`;
    ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }
  }

  function draw() {
    ctx!.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          const t = (i + j) % 2 === 0 ? 0 : 1;
          const r = ACCENT.r + (BLUE.r - ACCENT.r) * t;
          const g = ACCENT.g + (BLUE.g - ACCENT.g) * t;
          const b = ACCENT.b + (BLUE.b - ACCENT.b) * t;

          ctx!.beginPath();
          ctx!.moveTo(nodes[i].x, nodes[i].y);
          ctx!.lineTo(nodes[j].x, nodes[j].y);
          ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const t = (node.x / width + node.y / height) / 2;
      const r = ACCENT.r + (BLUE.r - ACCENT.r) * t;
      const g = ACCENT.g + (BLUE.g - ACCENT.g) * t;
      const b = ACCENT.b + (BLUE.b - ACCENT.b) * t;

      ctx!.beginPath();
      ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.4)`;
      ctx!.fill();
    }
  }

  function update() {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));
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
    // Draw a single static frame
    draw();
    return;
  }

  animate();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    createNodes();
    animate();
  });
}
