# Mobile Fixes & Dashboard Enhancements Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all mobile responsive issues and add flip-card artist interaction, ScrollTrigger animations, dynamic bar growth, and contextual info toggles to the Music DNA dashboard.

**Architecture:** CSS-first responsive fixes with mobile breakpoint at 767px. GSAP ScrollTrigger for scroll-based entrance animations. CSS 3D transforms for artist flip cards. A reusable `SectionInfo` component for contextual descriptions that update when time range changes.

**Tech Stack:** Astro 6, GSAP 3 + ScrollTrigger plugin, CSS vanilla, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `public/artists/` | Create dir + 8 images | Real artist photos |
| `src/data/top-artists-short.json` | Modify | Update image paths for top 8 |
| `src/data/top-artists-medium.json` | Modify | Update image paths for top 8 |
| `src/data/top-artists-long.json` | Modify | Update image paths for top 8 |
| `src/styles/global.css` | Modify | Fix mobile grid layout & sidebar |
| `src/components/Sidebar.astro` | Modify | Show stats as horizontal strip on mobile |
| `src/components/TopBar.astro` | Modify | Fix tab sizing on mobile |
| `src/components/TopArtists.astro` | Modify | Flip card + mobile circle scaling |
| `src/components/GenreBreakdown.astro` | Modify | Mobile label widths + dynamic bar animation |
| `src/components/SoundDNA.astro` | Modify | Mobile label widths + ScrollTrigger |
| `src/components/ListeningHours.astro` | Modify | Remove min-width, responsive chart + ScrollTrigger |
| `src/components/MonthlyTrend.astro` | Modify | Fix stats overflow + ScrollTrigger |
| `src/components/CtaBanner.astro` | Modify | Larger tap targets on mobile |
| `src/components/SectionInfo.astro` | Create | Reusable info toggle component |
| `src/scripts/gsap-init.ts` | Modify | Register ScrollTrigger, scroll-based animations |
| `src/scripts/time-range.ts` | Modify | Update info toggles, fix genre/artist updates for new HTML structure |

---

## Chunk 1: Artist Images & Mobile Layout Foundation

### Task 1: Add Real Artist Images

The user provided 8 real artist images (pasted in chat). These must be saved to the project and referenced in all 3 JSON data files.

**Files:**
- Create: `reto-02/public/artists/` directory
- Create: 8 image files in `reto-02/public/artists/`
- Modify: `reto-02/src/data/top-artists-short.json`
- Modify: `reto-02/src/data/top-artists-medium.json`
- Modify: `reto-02/src/data/top-artists-long.json`

**Image mapping (user provided in order 1-8):**
1. Bad Bunny → `bad-bunny.webp`
2. The Weeknd → `the-weeknd.webp`
3. Ed Sheeran → `ed-sheeran.webp`
4. Taylor Swift → `taylor-swift.webp`
5. Post Malone → `post-malone.webp`
6. Eminem → `eminem.webp`
7. Coldplay → `coldplay.webp`
8. Kendrick Lamar → `kendrick-lamar.webp`

- [ ] **Step 1: Create the artists directory**

```bash
mkdir -p reto-02/public/artists
```

- [ ] **Step 2: Save artist images**

The user pasted 8 images inline in the conversation. Since these can't be saved directly from chat, ask the user to save them to `reto-02/public/artists/` with the filenames listed above. Alternatively, if the images are accessible as temporary files, copy them.

If the user cannot provide files, download suitable square-cropped placeholder images from `ui-avatars.com` as a fallback — but real images are strongly preferred.

- [ ] **Step 3: Update `top-artists-short.json` image paths**

For each of the 8 artists that match by name, change `"image"` from the `ui-avatars.com` URL to the local path. The remaining 12 artists keep their `ui-avatars.com` URLs.

```json
"image": "/artists/bad-bunny.webp"
```

Mapping by artist name → filename:
- `"Bad Bunny"` → `"/artists/bad-bunny.webp"`
- `"The Weeknd"` → `"/artists/the-weeknd.webp"`
- `"Ed Sheeran"` → `"/artists/ed-sheeran.webp"`
- `"Taylor Swift"` → `"/artists/taylor-swift.webp"`
- `"Post Malone"` → `"/artists/post-malone.webp"`
- `"Eminem"` → `"/artists/eminem.webp"`
- `"Coldplay"` → `"/artists/coldplay.webp"`
- `"Kendrick Lamar"` → `"/artists/kendrick-lamar.webp"`

- [ ] **Step 4: Update `top-artists-medium.json` with same image paths**

Same 8 name→path replacements as Step 3.

- [ ] **Step 5: Update `top-artists-long.json` with same image paths**

Same 8 name→path replacements as Step 3.

- [ ] **Step 6: Verify build**

```bash
cd reto-02 && npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add public/artists/ src/data/top-artists-*.json
git commit -m "feat(reto-02): add real artist images for top 8 artists"
```

---

### Task 2: Fix Mobile Layout — Global CSS & Sidebar

The mobile sidebar is completely empty (profile + stats both `display: none`). The body overflow and main padding need fixing. The sidebar should show stat cards in a compact horizontal strip on mobile instead of being hidden.

**Files:**
- Modify: `reto-02/src/styles/global.css:167-193`
- Modify: `reto-02/src/components/Sidebar.astro:108-137`

- [ ] **Step 1: Fix `global.css` mobile breakpoint**

Replace the mobile media query (lines 167-193) with:

```css
/* ─── Responsive: Mobile ─────────────────────────────────────────────────── */
@media (max-width: 767px) {
  body {
    overflow: auto;
    height: auto;
  }

  .dashboard {
    grid-template-areas:
      "topbar"
      "main"
      "sidebar";
    grid-template-columns: 1fr;
    grid-template-rows: var(--topbar-height) 1fr auto;
    height: auto;
    min-height: 100vh;
  }

  .dashboard-main {
    overflow-y: visible;
    padding: 12px;
  }

  .dashboard-sidebar {
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
}
```

Key changes: `body { height: auto }` to allow scrolling, padding 12px for more breathing room.

- [ ] **Step 2: Fix `Sidebar.astro` mobile — show stats as horizontal strip**

Replace the two media queries in Sidebar.astro (lines 108-137) with:

```css
@media (max-width: 1023px) {
  .profile-name,
  .profile-subtitle {
    display: none;
  }

  .profile-avatar-ring {
    width: 56px;
    height: 56px;
  }

  .sidebar-stats {
    flex-direction: row;
    gap: 4px;
  }

  .stat-card {
    padding: 8px;
  }

  .stat-value {
    font-size: var(--text-base);
  }

  .stat-label {
    font-size: 8px;
  }
}

@media (max-width: 767px) {
  .dashboard-sidebar {
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    gap: 8px;
    border-right: none;
    border-top: 1px solid var(--color-border);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .sidebar-profile {
    display: none;
  }

  .sidebar-stats {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 0;
    width: 100%;
    justify-content: center;
  }

  .stat-card {
    padding: 8px 12px;
    flex: 1;
    max-width: 100px;
  }

  .stat-value {
    font-size: var(--text-base);
  }

  .stat-label {
    font-size: 8px;
  }
}
```

Key changes: stats are visible on mobile as a horizontal row of 3 compact cards. Profile hidden. Background is frosted glass.

- [ ] **Step 3: Verify build**

```bash
cd reto-02 && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/components/Sidebar.astro
git commit -m "fix(reto-02): mobile layout - fix sidebar stats and body overflow"
```

---

### Task 3: Fix Mobile TopBar

Tab buttons get cramped on mobile. Needs padding/font adjustments.

**Files:**
- Modify: `reto-02/src/components/TopBar.astro:93-101`

- [ ] **Step 1: Update TopBar mobile media query**

Replace the mobile media query (lines 93-101) with:

```css
@media (max-width: 767px) {
  .dashboard-topbar {
    padding: 0 12px;
  }

  .topbar-brand {
    display: none;
  }

  .topbar-tabs {
    margin-left: 4px;
    flex: 1;
    justify-content: center;
  }

  .tab {
    padding: 5px 10px;
    font-size: 10px;
  }

  .topbar-avatar img {
    width: 28px;
    height: 28px;
  }
}
```

Key changes: tabs get smaller padding, flex fills available space, avatar shrinks.

- [ ] **Step 2: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/TopBar.astro
git commit -m "fix(reto-02): mobile topbar - fix tab cramping and spacing"
```

---

> **Dependency note:** Tasks 4, 5, and 11 all modify `src/scripts/time-range.ts`. They touch different functions so they don't conflict, but they must be applied sequentially. Task 4 modifies `updateArtistsCompact` and `updateArtistsExpanded`. Task 5 modifies `updateGenres`. Task 11 adds `updateInfoToggles` and modifies `switchTimeRange`.

## Chunk 2: Artist Flip Cards & Component Mobile Fixes

### Task 4: TopArtists Flip Card + Mobile Responsive

Replace the hover overlay with a CSS 3D flip card. Front = artist photo, Back = minutes listened with gradient background. On mobile: scale down circle sizes and improve horizontal scroll.

**Files:**
- Modify: `reto-02/src/components/TopArtists.astro`

- [ ] **Step 1: Update the compact variant HTML structure for flip card**

Replace the compact variant section (lines 13-31) with:

```astro
{variant === 'compact' && (
  <section class="top-artists" data-section="artists">
    <h2 class="section-heading">Top Artists</h2>
    <div class="artists-row" id="artists-compact">
      {artists.slice(0, 5).map((artist, i) => (
        <div class="artist-circle" data-rank={i + 1} style={`--glow-color: ${glowColors[i]}`}>
          <div class="artist-flip-card">
            <div class="artist-flip-inner">
              <div class="artist-flip-front">
                <img src={artist.image} alt={artist.name} loading={i < 3 ? 'eager' : 'lazy'} />
              </div>
              <div class="artist-flip-back">
                <span class="minutes-value">{minutesData[i].toLocaleString()}</span>
                <span class="minutes-label">min</span>
              </div>
            </div>
          </div>
          <span class="artist-name">{artist.name}</span>
          <span class="artist-genre">{artist.genres[0]}</span>
        </div>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 2: Update the expanded variant HTML for flip card**

Replace the expanded variant section (lines 34-54) with:

```astro
{variant === 'expanded' && (
  <section class="top-artists-expanded" data-section="artists-expanded">
    <h2 class="section-heading">Top Artists</h2>
    <div class="artists-grid" id="artists-expanded">
      {artists.map((artist, i) => (
        <div class="artist-card glass-card">
          <span class="artist-rank">#{i + 1}</span>
          <div class="artist-flip-card artist-flip-card--small">
            <div class="artist-flip-inner">
              <div class="artist-flip-front">
                <img src={artist.image} alt={artist.name} class="artist-card-img" loading="lazy" />
              </div>
              <div class="artist-flip-back">
                <span class="minutes-value">{allMinutesData[i]?.toLocaleString() ?? '--'}</span>
                <span class="minutes-label">min</span>
              </div>
            </div>
          </div>
          <span class="artist-name">{artist.name}</span>
          <span class="artist-genre">{artist.genres[0]}</span>
        </div>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 3: Replace all CSS styles**

Remove all existing styles and replace with:

```css
<style>
  .section-heading {
    color: white;
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: 16px;
  }

  .artists-row {
    display: flex;
    gap: 16px;
    align-items: flex-end;
  }

  .artist-circle {
    text-align: center;
    flex-shrink: 0;
  }

  /* ─── Flip Card ──────────────────────────────────── */
  .artist-flip-card {
    perspective: 600px;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 30px var(--glow-color, rgba(255, 255, 255, 0.1));
  }

  .artist-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }

  .artist-flip-card:hover .artist-flip-inner {
    transform: rotateY(180deg);
  }

  .artist-flip-front,
  .artist-flip-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 50%;
    overflow: hidden;
  }

  .artist-flip-front img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .artist-flip-back {
    background: linear-gradient(135deg, rgba(29, 185, 84, 0.9), rgba(124, 58, 237, 0.9));
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Rank-based sizing */
  .artist-circle[data-rank="1"] .artist-flip-card,
  .artist-circle[data-rank="1"] .artist-flip-inner {
    width: 100px;
    height: 100px;
  }

  .artist-circle[data-rank="2"] .artist-flip-card,
  .artist-circle[data-rank="2"] .artist-flip-inner {
    width: 80px;
    height: 80px;
  }

  .artist-circle[data-rank="3"] .artist-flip-card,
  .artist-circle[data-rank="3"] .artist-flip-inner {
    width: 70px;
    height: 70px;
  }

  .artist-circle[data-rank="4"] .artist-flip-card,
  .artist-circle[data-rank="4"] .artist-flip-inner,
  .artist-circle[data-rank="5"] .artist-flip-card,
  .artist-circle[data-rank="5"] .artist-flip-inner {
    width: 60px;
    height: 60px;
  }

  .minutes-value {
    color: white;
    font-weight: 700;
    font-size: var(--text-lg);
  }

  .minutes-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--text-xs);
    text-transform: uppercase;
  }

  .artist-name {
    color: white;
    font-size: var(--text-sm);
    font-weight: 600;
    display: block;
    margin-top: 8px;
  }

  .artist-genre {
    color: var(--color-text-secondary);
    font-size: var(--text-xs);
    display: block;
  }

  /* ─── Expanded variant ──────────────────────────── */
  .artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 20px;
  }

  .artist-card {
    padding: 20px;
    text-align: center;
  }

  .artist-flip-card--small,
  .artist-flip-card--small .artist-flip-inner {
    width: 80px;
    height: 80px;
    margin: 0 auto 8px;
  }

  .artist-flip-card--small .minutes-value {
    font-size: var(--text-base);
  }

  .artist-card-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .artist-rank {
    color: var(--color-spotify);
    font-size: var(--text-xs);
    font-weight: 700;
  }

  /* ─── Mobile ──────────────────────────────── */
  @media (max-width: 767px) {
    .artists-row {
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 8px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }

    .artist-circle {
      scroll-snap-align: start;
    }

    .artist-circle[data-rank="1"] .artist-flip-card,
    .artist-circle[data-rank="1"] .artist-flip-inner {
      width: 76px;
      height: 76px;
    }

    .artist-circle[data-rank="2"] .artist-flip-card,
    .artist-circle[data-rank="2"] .artist-flip-inner {
      width: 64px;
      height: 64px;
    }

    .artist-circle[data-rank="3"] .artist-flip-card,
    .artist-circle[data-rank="3"] .artist-flip-inner {
      width: 56px;
      height: 56px;
    }

    .artist-circle[data-rank="4"] .artist-flip-card,
    .artist-circle[data-rank="4"] .artist-flip-inner,
    .artist-circle[data-rank="5"] .artist-flip-card,
    .artist-circle[data-rank="5"] .artist-flip-inner {
      width: 48px;
      height: 48px;
    }

    .minutes-value {
      font-size: var(--text-sm);
    }

    .minutes-label {
      font-size: 8px;
    }

    .artist-name {
      font-size: 10px;
    }

    .artist-genre {
      font-size: 8px;
    }

    .artists-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 12px;
    }

    .artist-card {
      padding: 12px;
    }
  }

  /* Touch devices: tap to flip */
  @media (hover: none) {
    .artist-flip-card {
      cursor: pointer;
    }
  }
</style>
```

- [ ] **Step 4: Update `time-range.ts` — `updateArtistsCompact` function**

The `updateArtistsCompact` function (lines 69-83 of `time-range.ts`) currently looks for `.artist-circle img` which won't match the new flip structure. Update it:

```typescript
function updateArtistsCompact(artists: SpotifyArtist[]) {
  const container = document.getElementById('artists-compact');
  if (!container) return;
  const circles = container.querySelectorAll('.artist-circle');
  artists.slice(0, 5).forEach((artist, i) => {
    const el = circles[i];
    if (!el) return;
    const img = el.querySelector('.artist-flip-front img') as HTMLImageElement;
    const name = el.querySelector('.artist-name');
    const genre = el.querySelector('.artist-genre');
    if (img) { img.src = artist.image; img.alt = artist.name; }
    if (name) name.textContent = artist.name;
    if (genre) genre.textContent = artist.genres[0] || '';
  });
}
```

- [ ] **Step 5: Update `updateArtistsExpanded` in `time-range.ts` for flip card structure**

The `updateArtistsExpanded` function (lines 85-96 of `time-range.ts`) rebuilds the expanded grid via `innerHTML` using the old HTML structure. Update it to use the flip card markup:

```typescript
function updateArtistsExpanded(artists: SpotifyArtist[]) {
  const grid = document.getElementById('artists-expanded');
  if (!grid) return;
  grid.innerHTML = artists.map((a, i) => `
    <div class="artist-card glass-card">
      <span class="artist-rank">#${i + 1}</span>
      <div class="artist-flip-card artist-flip-card--small">
        <div class="artist-flip-inner">
          <div class="artist-flip-front">
            <img src="${a.image}" alt="${a.name}" class="artist-card-img" loading="lazy" />
          </div>
          <div class="artist-flip-back">
            <span class="minutes-value">${allMinutesData[i]?.toLocaleString() ?? '--'}</span>
            <span class="minutes-label">min</span>
          </div>
        </div>
      </div>
      <span class="artist-name">${a.name}</span>
      <span class="artist-genre">${a.genres[0] || ''}</span>
    </div>
  `).join('');
}
```

Note: `allMinutesData` is defined in the Astro component frontmatter but not available in `time-range.ts`. Since the expanded variant is not currently rendered on the main page (only `compact` is used), this function can safely use static fallback values. If the expanded variant is re-enabled later, the minutes data should be embedded in the JSON data.

- [ ] **Step 6: Add tap-to-flip JavaScript for touch devices**

Add this script block at the bottom of `TopArtists.astro`, after the closing `</style>` tag:

```html
<script>
  // Touch devices: toggle flip on tap
  if (navigator.maxTouchPoints > 0) {
    document.querySelectorAll('.artist-flip-card').forEach(card => {
      card.addEventListener('click', () => {
        const inner = card.querySelector('.artist-flip-inner') as HTMLElement;
        if (!inner) return;
        const isFlipped = inner.style.transform === 'rotateY(180deg)';
        inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
      });
    });
  }
</script>
```

- [ ] **Step 7: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/TopArtists.astro src/scripts/time-range.ts
git commit -m "feat(reto-02): flip card for artist minutes + mobile responsive circles"
```

---

### Task 5: GenreBreakdown — Mobile Fix + Dynamic Growing Bars

Fix the fixed-width labels on mobile. Add GSAP ScrollTrigger so bars animate from 0 to their target width when the section scrolls into view.

**Files:**
- Modify: `reto-02/src/components/GenreBreakdown.astro:45-97`

- [ ] **Step 1: Add mobile styles and ScrollTrigger-ready classes**

Replace the `<style>` block (lines 45-97) with:

```css
<style>
  .section-heading {
    color: white;
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: 16px;
  }

  .genre-breakdown {
    padding: 20px;
  }

  .genre-bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .genre-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .genre-name {
    color: var(--color-text-secondary);
    font-size: 11px;
    width: 70px;
    text-align: right;
    flex-shrink: 0;
    text-transform: capitalize;
  }

  .genre-track {
    flex: 1;
    height: 20px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    overflow: hidden;
  }

  .genre-fill {
    height: 100%;
    border-radius: 10px;
    width: 0;
  }

  .genre-percent {
    font-size: 11px;
    font-weight: 600;
    width: 40px;
    text-align: right;
  }

  @media (max-width: 767px) {
    .genre-breakdown {
      padding: 16px;
    }

    .genre-name {
      width: 55px;
      font-size: 10px;
    }

    .genre-percent {
      width: 32px;
      font-size: 10px;
    }

    .genre-track {
      height: 16px;
    }
  }
</style>
```

Key changes:
- `.genre-fill` starts at `width: 0` (GSAP will animate it in)
- Mobile: reduced label widths (55px), smaller font, thinner bars

- [ ] **Step 2: Add `data-target-width` attribute to genre fills**

In the HTML template (lines 30-41), change the genre fill div to include a data attribute for the target width:

```astro
<div
  class="genre-fill"
  data-target-width={`${genre.percent}%`}
  style={`background: linear-gradient(90deg, ${gradientColors[i]});`}
></div>
```

Remove the inline `width` — the ScrollTrigger animation will handle it.

- [ ] **Step 3: Update `updateGenres` in `time-range.ts` for ScrollTrigger compatibility**

The `updateGenres` function (lines 98-111 of `time-range.ts`) rebuilds genre bars via `innerHTML` and sets `width` directly in the inline style. After a tab switch, this would bypass the ScrollTrigger animation. Update it to use `data-target-width` and animate the bars:

```typescript
function updateGenres(artists: SpotifyArtist[]) {
  const genres = computeGenres(artists);
  const container = document.getElementById('genre-bars');
  if (!container) return;
  container.innerHTML = genres.map((g, i) => `
    <div class="genre-row">
      <span class="genre-name">${g.name}</span>
      <div class="genre-track">
        <div class="genre-fill" data-target-width="${g.percent}%" style="width: 0; background: linear-gradient(90deg, ${gradientColors[i]});"></div>
      </div>
      <span class="genre-percent" style="color: ${gradientColors[i].split(',')[0]}">${g.percent}%</span>
    </div>
  `).join('');

  // Animate bars after rebuilding
  const fills = container.querySelectorAll<HTMLElement>('.genre-fill');
  fills.forEach((el, i) => {
    const target = el.dataset.targetWidth || '0%';
    gsap.to(el, {
      width: target,
      duration: 0.6,
      delay: i * 0.06,
      ease: 'power2.out',
    });
  });
}
```

Note: `gsap` is already imported at the top of `time-range.ts`.

- [ ] **Step 4: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/GenreBreakdown.astro src/scripts/time-range.ts
git commit -m "fix(reto-02): genre bars mobile responsive + ScrollTrigger-compatible updateGenres"
```

---

### Task 6: SoundDNA — Mobile Fix

Fix the feature label fixed widths on mobile.

**Files:**
- Modify: `reto-02/src/components/SoundDNA.astro:87-154`

- [ ] **Step 1: Add mobile media query to SoundDNA styles**

Add the following at the end of the `<style>` block (before the closing `</style>` tag):

```css
@media (max-width: 767px) {
  .sound-dna {
    padding: 16px;
  }

  .radar-svg {
    max-width: 160px;
  }

  .feature-label {
    width: 55px;
    font-size: 10px;
  }

  .feature-value {
    width: 32px;
    font-size: 10px;
  }

  .feature-track {
    height: 16px;
  }
}
```

- [ ] **Step 2: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/SoundDNA.astro
git commit -m "fix(reto-02): sound DNA mobile responsive label widths"
```

---

### Task 7: ListeningHours — Mobile Fix

Remove the `min-width: 500px` that causes horizontal scroll. Make bars responsive on mobile by showing fewer labels.

**Files:**
- Modify: `reto-02/src/components/ListeningHours.astro:115-120`

- [ ] **Step 1: Replace the mobile media query**

Replace lines 115-120 with:

```css
@media (max-width: 767px) {
  .listening-hours {
    padding: 16px;
  }

  .hours-chart {
    gap: 2px;
    height: 120px;
  }

  .hour-label {
    font-size: 7px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  .hour-bar-wrapper:nth-child(odd) .hour-label {
    visibility: hidden;
  }
}
```

Key changes: removed `min-width: 500px` and `overflow-x: auto`. Instead, bars squeeze to fit, labels rotate vertical, alternating labels hidden for readability.

- [ ] **Step 2: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/ListeningHours.astro
git commit -m "fix(reto-02): listening hours mobile - remove forced horizontal scroll"
```

---

### Task 8: MonthlyTrend — Mobile Fix

Fix the stats row overflow on mobile.

**Files:**
- Modify: `reto-02/src/components/MonthlyTrend.astro:75-142`

- [ ] **Step 1: Add mobile media query to styles**

Add the following before the closing `</style>` tag:

```css
@media (max-width: 767px) {
  .monthly-trend {
    padding: 16px;
  }

  .trend-svg {
    height: 120px;
  }

  .trend-label {
    font-size: 7px;
  }

  .trend-label:nth-child(even) {
    visibility: hidden;
  }

  .trend-stats {
    gap: 8px;
  }

  .trend-stat-value {
    font-size: var(--text-lg);
  }

  .trend-stat-label {
    font-size: 8px;
    letter-spacing: 0.05em;
  }
}
```

Key changes: smaller chart height, alternating month labels hidden, smaller stat values, tighter gaps.

- [ ] **Step 2: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/MonthlyTrend.astro
git commit -m "fix(reto-02): monthly trend mobile - fix stats overflow"
```

---

### Task 9: CTA Banner — Mobile Polish

Increase tap target size and improve readability.

**Files:**
- Modify: `reto-02/src/components/CtaBanner.astro:42-47`

- [ ] **Step 1: Update mobile media query**

Replace lines 42-47 with:

```css
@media (max-width: 767px) {
  .cta-banner {
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    margin-top: 16px;
  }

  .cta-button {
    padding: 10px 24px;
    font-size: var(--text-sm);
    width: 100%;
    text-align: center;
  }

  .cta-text {
    font-size: var(--text-sm);
    text-align: center;
  }
}
```

Key changes: full-width button for easier tapping, larger padding, centered text.

- [ ] **Step 2: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/components/CtaBanner.astro
git commit -m "fix(reto-02): CTA banner mobile - larger tap targets"
```

---

## Chunk 3: ScrollTrigger Animations & Info Toggles

### Task 10: GSAP ScrollTrigger — Dynamic Animations on Scroll

Register ScrollTrigger plugin. Add scroll-based entrance animations for: genre bars growing, listening hours bars growing, radar polygon morphing, monthly trend line drawing.

**Files:**
- Modify: `reto-02/src/scripts/gsap-init.ts`

- [ ] **Step 1: Rewrite gsap-init.ts with ScrollTrigger**

Replace the entire file content with:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything immediately without animation
    gsap.set('.stat-card, .artist-circle, .cta-banner', {
      opacity: 1, y: 0, x: 0, scale: 1,
    });
    // Genre fills: set to target widths immediately
    document.querySelectorAll<HTMLElement>('.genre-fill').forEach(el => {
      const target = el.dataset.targetWidth || el.style.getPropertyValue('--target-width') || '0%';
      el.style.width = target;
    });
    // Listening hours bars: show immediately
    document.querySelectorAll<HTMLElement>('.hour-bar').forEach(el => {
      el.style.height = el.style.getPropertyValue('--bar-height') || el.style.height;
    });
    return;
  }

  // 1. Sidebar stat cards stagger in
  gsap.from('.stat-card', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.1,
    ease: 'power2.out',
  });

  // 2. Top artist circles scale up
  gsap.from('.artist-circle', {
    scale: 0, opacity: 0, duration: 0.5, stagger: 0.08,
    ease: 'power2.out',
    delay: 0.2,
  });

  // 3. Genre bars: animate from 0 to target width on scroll
  ScrollTrigger.create({
    trigger: '.genre-breakdown',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const fills = document.querySelectorAll<HTMLElement>('.genre-fill');
      fills.forEach((el, i) => {
        const target = el.dataset.targetWidth || '0%';
        gsap.to(el, {
          width: target,
          duration: 0.8,
          delay: i * 0.08,
          ease: 'power2.out',
        });
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

    // Also hide vertex dots initially
    const radarSvg = document.getElementById('radar-svg');
    const dots = radarSvg?.querySelectorAll('circle[fill="#1DB954"]');
    dots?.forEach(dot => gsap.set(dot, { opacity: 0 }));

    ScrollTrigger.create({
      trigger: '.sound-dna',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(radarPoly, {
          attr: { points: finalPoints },
          duration: 1,
          ease: 'power2.out',
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
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const bars = document.querySelectorAll<HTMLElement>('.hour-bar');
      // Store target heights and set to 0
      bars.forEach(bar => {
        const targetH = bar.style.getPropertyValue('--bar-height');
        bar.dataset.targetHeight = targetH;
        bar.style.height = '0%';
      });
      // Animate to target height
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          height: bar.dataset.targetHeight,
          duration: 0.6,
          delay: i * 0.03,
          ease: 'power2.out',
        });
      });
    },
  });

  // 6. Monthly trend line draws in on scroll
  ScrollTrigger.create({
    trigger: '.monthly-trend',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const polyline = document.querySelector('.trend-svg polyline') as SVGPolylineElement;
      const polygon = document.querySelector('.trend-svg polygon') as SVGPolygonElement;
      const dots = document.querySelectorAll('.trend-svg circle');

      if (polyline) {
        const length = polyline.getTotalLength();
        gsap.set(polyline, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(polyline, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' });
      }

      if (polygon) {
        gsap.from(polygon, { opacity: 0, duration: 0.8, delay: 0.4 });
      }

      dots.forEach((dot, i) => {
        gsap.from(dot, {
          scale: 0, opacity: 0, duration: 0.3,
          delay: 0.3 + i * 0.06,
          transformOrigin: 'center',
          ease: 'back.out(2)',
        });
      });

      // Animate stat values (counter)
      document.querySelectorAll('.trend-stat-value').forEach(el => {
        gsap.from(el, { opacity: 0, y: 10, duration: 0.4, delay: 0.6 });
      });
    },
  });

  // 7. CTA banner fades up
  gsap.from('.cta-banner', {
    y: 20, opacity: 0, duration: 0.4,
    scrollTrigger: {
      trigger: '.cta-banner',
      start: 'top 90%',
      once: true,
    },
  });
}

// Use requestAnimationFrame after DOMContentLoaded so time-range.ts has
// already populated the DOM and set genre bar widths before we capture them.
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(initAnimations);
});
```

- [ ] **Step 2: Update ListeningHours bars to start at height 0 via CSS**

In `ListeningHours.astro`, update the `.hour-bar` CSS rule to start with `height: 0` instead of `var(--bar-height)`. The actual height is stored in the inline style `--bar-height` and will be read by GSAP:

Change `.hour-bar` (line ~77-83):
```css
.hour-bar {
  width: 100%;
  height: 0;
  border-radius: 4px 4px 0 0;
  min-height: 0;
  position: relative;
  transition: opacity 0.2s ease;
}
```

Also update the inline style in the HTML template (line ~31) to use `--bar-height` as a CSS custom property that GSAP reads, not as the actual height:
```astro
<div class="hour-bar" style={`--bar-height: ${h.value}%; background: linear-gradient(180deg, var(--color-spotify), var(--color-accent-purple-dark));`}>
```

This is already correct — the inline style sets `--bar-height` as a CSS variable. The CSS just needs to NOT use it as the default height.

- [ ] **Step 3: Verify build and commit**

```bash
cd reto-02 && npm run build
git add src/scripts/gsap-init.ts src/components/ListeningHours.astro
git commit -m "feat(reto-02): ScrollTrigger animations for all chart sections"
```

---

### Task 11: Contextual Info Toggle Component

Create a reusable `SectionInfo` component that shows a small info icon button. When clicked, it toggles a description paragraph that explains what the section shows, contextualized to the current time range.

**Files:**
- Create: `reto-02/src/components/SectionInfo.astro`
- Modify: `reto-02/src/components/ListeningHours.astro`
- Modify: `reto-02/src/components/SoundDNA.astro`
- Modify: `reto-02/src/components/MonthlyTrend.astro`
- Modify: `reto-02/src/scripts/time-range.ts`

- [ ] **Step 1: Create `SectionInfo.astro`**

```astro
---
interface Props {
  sectionId: string;
  descriptions: {
    short: string;
    medium: string;
    long: string;
  };
}
const { sectionId, descriptions } = Astro.props;
---

<div class="section-info" data-info-section={sectionId}>
  <button class="info-toggle" aria-label="Toggle section description" aria-expanded="false">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
      <path d="M8 7v4M8 5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <p class="info-text" data-info-short={descriptions.short} data-info-medium={descriptions.medium} data-info-long={descriptions.long}>
    {descriptions.short}
  </p>
</div>

<style>
  .section-info {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }

  .info-toggle {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 2px;
    flex-shrink: 0;
    transition: color var(--transition-fast);
  }

  .info-toggle:hover {
    color: var(--color-spotify);
  }

  .info-toggle[aria-expanded="true"] {
    color: var(--color-spotify);
  }

  .info-text {
    color: var(--color-text-secondary);
    font-size: var(--text-xs);
    line-height: 1.5;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .info-text.visible {
    max-height: 60px;
    opacity: 1;
  }
</style>

<script>
  document.querySelectorAll('.info-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const text = btn.nextElementSibling as HTMLElement;
      if (text) text.classList.toggle('visible');
    });
  });
</script>
```

- [ ] **Step 2: Add SectionInfo to ListeningHours**

In `ListeningHours.astro`, add the import and component after the heading:

At the top of the frontmatter:
```astro
import SectionInfo from './SectionInfo.astro';
```

After `<h2 class="section-heading">Listening Activity</h2>`, replace the `<p class="section-subtitle">` with:

```astro
<SectionInfo
  sectionId="hours"
  descriptions={{
    short: "Your average daily listening pattern over the last 4 weeks.",
    medium: "Your average daily listening pattern over the last 6 months.",
    long: "Your average daily listening pattern across all time.",
  }}
/>
```

Remove the existing `<p class="section-subtitle">When you listen the most</p>` and its CSS rule `.section-subtitle`.

- [ ] **Step 3: Add SectionInfo to SoundDNA**

In `SoundDNA.astro`, add the import and component after the heading:

At the top of the frontmatter, add:
```astro
import SectionInfo from './SectionInfo.astro';
```

After `<h2 class="section-heading">Your Sound DNA</h2>`, add:

```astro
<SectionInfo
  sectionId="radar"
  descriptions={{
    short: "Your music's audio fingerprint based on the last 4 weeks of listening.",
    medium: "Your music's audio fingerprint based on the last 6 months of listening.",
    long: "Your music's audio fingerprint across your entire listening history.",
  }}
/>
```

- [ ] **Step 4: Add SectionInfo to MonthlyTrend**

In `MonthlyTrend.astro`, add the import and component after the heading:

At the top of the frontmatter, add:
```astro
import SectionInfo from './SectionInfo.astro';
```

After `<h2 class="section-heading">Monthly Trend</h2>`, replace the `<p class="section-subtitle">` with:

```astro
<SectionInfo
  sectionId="trend"
  descriptions={{
    short: "Monthly listening hours for the last 4 weeks.",
    medium: "Monthly listening hours over the last 6 months.",
    long: "Monthly listening hours across your entire history.",
  }}
/>
```

Remove the existing `<p class="section-subtitle">Hours listened per month</p>` and its CSS rule.

- [ ] **Step 5: Update `time-range.ts` to update info text on range switch**

Add this function to `time-range.ts` (after `updateSidebarStats`):

```typescript
function updateInfoToggles(range: TimeRange) {
  document.querySelectorAll<HTMLElement>('.info-text').forEach(el => {
    const text = el.dataset[`info${range.charAt(0).toUpperCase() + range.slice(1)}` as keyof typeof el.dataset];
    if (text) el.textContent = text;
  });
}
```

Then add `updateInfoToggles(range)` calls inside `switchTimeRange` — both in the `animate` branch (inside the `onComplete` callback, after `updateSidebarStats`) and in the `else` branch (after `updateSidebarStats`).

Add to the animate `onComplete` (after line 202):
```typescript
updateInfoToggles(range);
```

Add to the non-animate else (after line 213):
```typescript
updateInfoToggles(range);
```

- [ ] **Step 6: Also add SectionInfo to GenreBreakdown**

In `GenreBreakdown.astro`, add the import and component:

At the top of the frontmatter, add:
```astro
import SectionInfo from './SectionInfo.astro';
```

After `<h2 class="section-heading">Genre Breakdown</h2>`, add:

```astro
<SectionInfo
  sectionId="genres"
  descriptions={{
    short: "Your top genres from the last 4 weeks of listening.",
    medium: "Your top genres from the last 6 months of listening.",
    long: "Your top genres across your entire listening history.",
  }}
/>
```

- [ ] **Step 7: Verify build**

```bash
cd reto-02 && npm run build
```

- [ ] **Step 8: Commit**

```bash
git add src/components/SectionInfo.astro src/components/ListeningHours.astro src/components/SoundDNA.astro src/components/MonthlyTrend.astro src/components/GenreBreakdown.astro src/scripts/time-range.ts
git commit -m "feat(reto-02): contextual info toggles for all chart sections"
```

---

### Task 12: Final Integration Verification

- [ ] **Step 1: Full build**

```bash
cd reto-02 && npm run build
```
Expected: Build succeeds, `dist/index.html` generated.

- [ ] **Step 2: Visual verification checklist**

Run `npm run dev` and verify on desktop and mobile (Chrome DevTools → Toggle Device):

**Desktop (>1024px):**
- [ ] Artist circles display with real images (top 8)
- [ ] Hover on artist circle → card flips showing minutes
- [ ] Genre bars grow when scrolled into view
- [ ] Radar chart morphs from center when scrolled into view
- [ ] Listening hours bars grow when scrolled into view
- [ ] Monthly trend line draws when scrolled into view
- [ ] Info toggle icons visible, clicking shows/hides description
- [ ] Time range tabs switch all data + info text

**Mobile (375px / iPhone):**
- [ ] No horizontal scroll on any section
- [ ] Sidebar shows 3 stat cards in horizontal strip at bottom
- [ ] TopBar tabs fit without overflow
- [ ] Artist circles scaled down, tap flips the card
- [ ] Genre bars visible with readable labels
- [ ] All charts fit within viewport width
- [ ] CTA button full-width, easy to tap

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -u
git commit -m "fix(reto-02): final integration polish"
```
