# Reto 01 — Polish Improvements Design Spec

## Resumen

4 mejoras visuales e interactivas para la landing page de Vibecode Summit Colombia. Cada cambio reemplaza una implementación existente sin agregar nuevas secciones.

**Stack:** Astro 5, GSAP 3 + ScrollTrigger, CSS vanilla, TypeScript

---

## 1. Typewriter más lento

**Archivo:** `src/scripts/typewriter.ts`

Cambiar velocidades para un efecto más dramático y deliberado:

| Parámetro | Antes | Después |
|-----------|-------|---------|
| `speed` (ms por carácter) | 60 | 110 |
| `pauseAfterVibecode` (ms) | 400 | 800 |

Sin cambios estructurales. Solo ajuste de constantes.

---

## 2. Speakers: iOS Dock + Card Glassmorphism

**Archivos a modificar:**
- `src/components/Speakers.astro` — rewrite completo del markup y estilos
- `src/scripts/dock.ts` — nuevo script para la lógica del dock
- `src/scripts/gsap-init.ts` — actualizar animación de speakers (ya no es grid stagger)

### Comportamiento

**Desktop (mouse):**
- Fila horizontal de avatares circulares centrada en la sección
- Al mover el mouse sobre la fila, el avatar más cercano al cursor se magnifica (scale ~1.6) y los vecinos escalan proporcionalmente (1er vecino ~1.3, 2do vecino ~1.1), igual que el dock de macOS
- La magnificación sigue el mouse con interpolación suave (no snapping discreto)
- Debajo del avatar activo (el más cercano al cursor) aparece una card glassmorphism con:
  - `background: rgba(255,255,255,0.08)`
  - `backdrop-filter: blur(20px)`
  - `border: 1px solid rgba(255,255,255,0.1)`
  - `border-radius: 16px`
  - Nombre (font-weight 700, color white)
  - Rol (color `--color-accent`, font-weight 600)
  - Empresa (color `--color-text-secondary`)
  - Tags de especialidad (pills con borde sutil, font-size small)
- La card aparece con transición: opacity 0→1 + translateY(8px→0), duration 0.2s
- Al sacar el mouse de la fila, todos los avatares vuelven a su tamaño base y la card desaparece

**Mobile (< 768px):**
- Carousel horizontal swipeable con scroll snap (`scroll-snap-type: x mandatory`)
- Cada item ocupa ~80% del ancho del viewport, centrado (`scroll-snap-align: center`)
- Avatar grande + card glassmorphism siempre visible debajo (no necesita hover)
- Indicadores de scroll (dots) o flechas laterales opcionales

**Datos adicionales en speakers.json:**
- Agregar campo `tags` a cada speaker (array de strings): ej. `["DeFi", "Web3"]`, `["Vibe Coding", "Tools"]`

### Diseño del avatar

- Tamaño base: 72px (desktop), 100px (mobile)
- Forma: círculo (`border-radius: 50%`)
- Contenido: iniciales del speaker sobre gradiente (ya existe)
- Estado activo: `filter: grayscale(0%)`, `box-shadow: 0 0 30px rgba(124,58,237,0.5)`
- Estado inactivo: `filter: grayscale(100%)`, sin sombra

### Algoritmo de magnificación (dock)

Basado en distancia del cursor al centro de cada avatar:

```
scale = baseScale + magnification * Math.max(0, 1 - distance / range)
```

Donde:
- `baseScale = 1`
- `magnification = 0.6` (el avatar más cercano llega a 1.6)
- `range = 180px` (radio de influencia del efecto)
- `distance` = distancia horizontal del cursor al centro del avatar

Aplicar con `transform: scale(factor)` y `transform-origin: bottom center` para que crezcan hacia arriba.

### GSAP entry animation

- En scroll reveal, los avatares entran en stagger desde abajo: `translateY(30px)→0, opacity 0→1, stagger: 0.08`
- La card no aparece hasta que el usuario interactúa

---

## 3. Ubicación: Split Imagen + Panel Info

**Archivos a modificar:**
- `src/components/Ubicacion.astro` — rewrite del markup y estilos

### Layout

**Desktop (768px+):**
- `display: flex` horizontal, height `80vh`
- **Izquierda (60%):** Imagen del venue
  - Imagen real de Unsplash de un centro de convenciones o cityscape de Bogotá
  - `<picture>` con WebP + JPG fallback
  - `object-fit: cover`, `loading="lazy"`
  - Overlay oscuro sutil `rgba(0,0,0,0.3)` sobre la imagen
  - Texto "Centro de Convenciones Ágora" centrado sobre la imagen (font-size `--text-section-title`, blanco, text-shadow)
  - Texto "Bogotá, Colombia" debajo (font-size `--text-h3`, `--color-text-secondary`)
  - GSAP parallax en la imagen: `y: "15%"` → `"-15%"`, scrub true
- **Derecha (40%):** Panel de info
  - `background: var(--color-bg-dark)`
  - Padding generoso
  - Contenido organizado verticalmente con separadores sutiles (`border-top: 1px solid var(--color-border)`)
  - Cada bloque de info:
    - Label: uppercase, `letter-spacing: 0.12em`, color `--color-accent` (#7c3aed), font-weight semibold, font-size `--text-small`
    - Content: color white, font-size `--text-body`, line-height 1.6
  - Bloques: Dirección, Cómo Llegar, Fecha
  - GSAP reveal: cada bloque entra en stagger `translateY(20px)→0, opacity 0→1, stagger: 0.15`

**Mobile (< 768px):**
- Se apila: imagen arriba (height 50vh), panel info abajo
- Imagen mantiene overlay y texto centrado
- Panel info en columna con padding

### Imagen del venue

Descargar una imagen apropiada de Unsplash (centro de convenciones o vista de Bogotá). Guardar en:
- `src/assets/images/venue.webp`
- `src/assets/images/venue.jpg` (fallback)

Si no es posible descargar, generar un placeholder con CSS que sea más elaborado que el gradiente actual: usar múltiples capas de gradiente con formas geométricas sutiles que sugieran arquitectura.

---

## 4. Sponsors: Grid Jerárquico con Colores por Tier

**Archivos a modificar:**
- `src/components/Sponsors.astro` — rewrite completo del markup y estilos

### Layout

Grid responsivo donde cada tier tiene su propia identidad visual:

**Platinum (2 sponsors):**
- Cards grandes: `min-height: 120px`, padding generoso
- `background: rgba(124,58,237,0.08)`
- `border: 1px solid rgba(124,58,237,0.25)`
- `border-radius: 16px`
- Glow sutil: `box-shadow: 0 0 40px rgba(124,58,237,0.1)`
- Radial gradient decorativo en esquina superior derecha
- Label "PLATINUM" encima del nombre, color `--color-accent`, font-size 10px, uppercase, letter-spacing 0.15em
- Nombre del sponsor: font-size 18px, font-weight 700, color white
- Layout: 2 columnas en desktop, 1 en mobile

**Gold (4 sponsors):**
- Cards medianas: padding moderado
- `background: rgba(245,158,11,0.06)`
- `border: 1px solid rgba(245,158,11,0.15)`
- `border-radius: 12px`
- Nombre: font-size 14px, font-weight 600, color `#ccc`
- Layout: 4 columnas desktop, 2 tablet, 1 mobile

**Silver (6 sponsors):**
- Cards pequeñas: padding compacto
- `background: rgba(255,255,255,0.03)`
- `border: 1px solid rgba(255,255,255,0.06)`
- `border-radius: 8px`
- Nombre: font-size 12px, color `#666`
- Layout: 6 columnas desktop (o 3x2), 3 tablet, 2 mobile

### Hover effect (todas las cards)

- `transform: translateY(-4px)`
- `box-shadow` aumenta
- Borde animado: gradient rotation usando `@property` para animar el ángulo de un `conic-gradient` en el borde. Efecto de luz que gira alrededor de la card.
  - Si `@property` no tiene soporte suficiente, fallback a un borde estático más brillante del color del tier

### GSAP animations

- Título reveal: mismo patrón que otras secciones
- Cards entran en stagger por tier: Platinum primero, luego Gold, luego Silver
- `opacity 0→1, translateY(20px)→0, stagger: 0.1`

### CTA "Sé sponsor"

- Mantener al final de la sección
- Estilizar como pill button sutil: `background: rgba(255,255,255,0.05)`, `border: 1px solid var(--color-border)`, `border-radius: 100px`, `padding: 10px 24px`
- Hover: `background: rgba(255,255,255,0.1)`, `border-color: var(--color-accent)`

---

## Criterios de éxito

1. El typewriter se siente deliberado, no apresurado
2. La sección de speakers es interactiva y tiene profundidad visual — el dock effect es fluido y la card glass aparece/desaparece suavemente
3. La ubicación muestra una imagen real del venue conectada visualmente con la info práctica
4. Los sponsors tienen jerarquía visual clara, color, y el hover con borde animado da dinamismo
5. Todo sigue siendo responsive (mobile, tablet, desktop)
6. `prefers-reduced-motion` sigue respetado — dock funciona sin animación (click en vez de hover), parallax desactivado, sponsors sin borde animado
7. Performance: sin degradación, GSAP animations optimizadas
