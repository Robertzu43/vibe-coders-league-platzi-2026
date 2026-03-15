import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SpotifyArtist {
  name: string;
  genres: string[];
  popularity: number;
  image: string;
  id: string;
}

interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumImage: string;
  duration_ms: number;
  id: string;
  played_at?: string;
}

interface AudioFeatures {
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  liveness: number;
  tempo: number;
}

interface SpotifyData {
  artists: { short: SpotifyArtist[]; medium: SpotifyArtist[]; long: SpotifyArtist[] };
  tracks: { short: SpotifyTrack[]; medium: SpotifyTrack[]; long: SpotifyTrack[] };
  audio: { short: AudioFeatures; medium: AudioFeatures; long: AudioFeatures };
  recent: SpotifyTrack[];
}

type TimeRange = 'short' | 'medium' | 'long';

let data: SpotifyData;

// Fix #1: HTML escape utility to prevent XSS
function esc(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// Fix #2: Safe data loading with error handling
function loadData(): SpotifyData | null {
  const el = document.getElementById('spotify-data');
  if (!el || !el.textContent) {
    console.error('Missing #spotify-data element');
    return null;
  }
  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    console.error('Failed to parse spotify data:', e);
    return null;
  }
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

const gradientColors = [
  '#1DB954,#1ed760', '#a855f7,#7c3aed', '#f43f5e,#e11d48',
  '#3b82f6,#2563eb', '#f59e0b,#d97706', '#06b6d4,#0891b2'
];

const glowColors = ['#e11d48', '#7c3aed', '#2563eb', '#f59e0b', '#1DB954'];

// Fix #6: Single genre computation used by both server-rendered initial and client updates
function computeGenres(artists: SpotifyArtist[]) {
  const counts: Record<string, number> = {};
  artists.forEach(a => a.genres.forEach(g => { counts[g] = (counts[g] || 0) + 1; }));
  const top6 = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const top6Total = top6.reduce((s, [, c]) => s + c, 0);
  const raw = top6.map(([name, count]) => ({ name, raw: (count / top6Total) * 100, percent: Math.floor((count / top6Total) * 100) }));
  let remainder = 100 - raw.reduce((s, g) => s + g.percent, 0);
  const byRemainder = [...raw].sort((a, b) => (b.raw - b.percent) - (a.raw - a.percent));
  for (let i = 0; i < remainder; i++) byRemainder[i].percent++;
  return raw;
}

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

// Fix #1: All innerHTML uses esc() for user-facing strings
function updateArtistsExpanded(artists: SpotifyArtist[]) {
  const grid = document.getElementById('artists-expanded');
  if (!grid) return;
  grid.innerHTML = artists.map((a, i) => `
    <div class="artist-card glass-card">
      <span class="artist-rank">#${i + 1}</span>
      <div class="artist-flip-card artist-flip-card--small">
        <div class="artist-flip-inner">
          <div class="artist-flip-front">
            <img src="${esc(a.image)}" alt="${esc(a.name)}" class="artist-card-img" loading="lazy" />
          </div>
          <div class="artist-flip-back">
            <span class="minutes-value">--</span>
            <span class="minutes-label">min</span>
          </div>
        </div>
      </div>
      <span class="artist-name">${esc(a.name)}</span>
      <span class="artist-genre">${esc(a.genres[0] || '')}</span>
    </div>
  `).join('');
}

function updateGenres(artists: SpotifyArtist[], animate = true) {
  const genres = computeGenres(artists);
  const container = document.getElementById('genre-bars');
  if (!container) return;
  container.innerHTML = genres.map((g, i) => {
    const colors = gradientColors[i].split(',');
    return `
    <div class="genre-tile" style="--genre-color: ${colors[0]}; --genre-color-end: ${colors[1]}">
      <div class="genre-big-number">
        <span class="genre-number" data-target-value="${g.percent}" style="color: ${colors[0]}">${animate ? '0' : g.percent}</span>
        <span class="genre-unit" style="color: ${colors[0]}">%</span>
      </div>
      <div class="genre-bar-wrap">
        <div class="genre-fill" data-target-width="${g.percent}%" style="width: ${animate ? '0' : g.percent + '%'}; background: linear-gradient(90deg, ${gradientColors[i]});"></div>
      </div>
      <span class="genre-name">${esc(g.name)}</span>
    </div>`;
  }).join('');

  if (animate) {
    const fills = container.querySelectorAll<HTMLElement>('.genre-fill');
    fills.forEach((el, i) => {
      const target = el.dataset.targetWidth || '0%';
      gsap.to(el, {
        width: target,
        duration: 1.5,
        delay: i * 0.12,
        ease: 'power2.out',
      });
    });
    container.querySelectorAll<HTMLElement>('.genre-number').forEach((el, i) => {
      const target = parseInt(el.dataset.targetValue || '0', 10);
      gsap.fromTo(el, { textContent: '0' }, {
        textContent: target,
        duration: 2,
        delay: i * 0.12,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate() {
          el.textContent = Math.round(parseFloat(el.textContent || '0')).toString();
        },
      });
    });
  }
}

function updateRadar(audio: AudioFeatures) {
  const polygon = document.getElementById('radar-polygon');
  if (!polygon) return;
  const features = [audio.energy, audio.danceability, audio.valence, audio.acousticness, audio.liveness, audio.tempo];
  const cx = 90, cy = 80, radius = 65;
  const points = features.map((v, i) => {
    const angle = ((360 / 6) * i - 90) * (Math.PI / 180);
    return `${(cx + v * radius * Math.cos(angle)).toFixed(1)},${(cy + v * radius * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
  polygon.setAttribute('points', points);

  const svg = document.getElementById('radar-svg');
  if (!svg) return;
  const dots = svg.querySelectorAll('circle[fill="#1DB954"]');
  features.forEach((v, i) => {
    const angle = ((360 / 6) * i - 90) * (Math.PI / 180);
    const dot = dots[i];
    if (dot) {
      dot.setAttribute('cx', (cx + v * radius * Math.cos(angle)).toFixed(1));
      dot.setAttribute('cy', (cy + v * radius * Math.sin(angle)).toFixed(1));
    }
  });

  const featureDetails = document.querySelector('.feature-details');
  if (featureDetails) {
    const featureKeys = ['energy', 'danceability', 'valence', 'acousticness', 'liveness', 'tempo'];
    const labels = ['Energy', 'Dance', 'Valence', 'Acoustic', 'Liveness', 'Tempo'];
    featureDetails.innerHTML = featureKeys.map((f, i) => {
      const val = Math.round((audio as any)[f] * 100);
      return `
        <div class="feature-row">
          <span class="feature-label">${labels[i]}</span>
          <div class="feature-track">
            <div class="feature-fill" style="width: ${val}%; background: linear-gradient(90deg, var(--color-spotify), var(--color-spotify-light));"></div>
          </div>
          <span class="feature-value">${val}%</span>
        </div>
      `;
    }).join('');
  }
}

function updateTracks(tracks: SpotifyTrack[]) {
  const container = document.getElementById('top-tracks');
  if (!container) return;
  container.innerHTML = tracks.map((t, i) => `
    <div class="track-row">
      <span class="track-rank">${i + 1}</span>
      <img src="${esc(t.albumImage)}" alt="${esc(t.album)} album art" class="track-album-art" loading="lazy" />
      <div class="track-info">
        <span class="track-name">${esc(t.name)}</span>
        <span class="track-artist">${esc(t.artist)}</span>
      </div>
      <span class="track-duration">${formatDuration(t.duration_ms)}</span>
    </div>
  `).join('');
}

function updateSidebarStats(artists: SpotifyArtist[], tracks: SpotifyTrack[]) {
  const allGenres = new Set<string>();
  artists.forEach(a => a.genres.forEach(g => allGenres.add(g)));

  const artistStat = document.querySelector('[data-stat="artists"]');
  const trackStat = document.querySelector('[data-stat="tracks"]');
  const genreStat = document.querySelector('[data-stat="genres"]');

  if (artistStat) artistStat.textContent = String(artists.length);
  if (trackStat) trackStat.textContent = String(tracks.length);
  if (genreStat) genreStat.textContent = String(allGenres.size);
}

function updateInfoToggles(range: TimeRange) {
  const rangeKey = range.charAt(0).toUpperCase() + range.slice(1);
  document.querySelectorAll<HTMLElement>('.info-text').forEach(el => {
    const text = el.dataset[`info${rangeKey}`];
    if (text) el.textContent = text;
  });
}

function switchTimeRange(range: TimeRange, animate = true) {
  const artists = data.artists[range];
  const tracks = data.tracks[range];
  const audio = data.audio[range];

  if (animate) {
    const main = document.querySelector<HTMLElement>('.dashboard-main');
    if (main) {
      gsap.to(main, {
        opacity: 0, duration: 0.15, ease: 'power2.in',
        onComplete: () => {
          updateArtistsCompact(artists);
          updateArtistsExpanded(artists);
          updateGenres(artists);
          updateRadar(audio);
          updateTracks(tracks);
          updateSidebarStats(artists, tracks);
          updateInfoToggles(range);
          gsap.to(main, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        }
      });
    }
  } else {
    updateArtistsCompact(artists);
    updateArtistsExpanded(artists);
    updateGenres(artists, false);
    updateRadar(audio);
    updateTracks(tracks);
    updateSidebarStats(artists, tracks);
    updateInfoToggles(range);
  }
}

function initTimeRange() {
  const loaded = loadData();
  if (!loaded) return;
  data = loaded;

  switchTimeRange('short', false);

  const tabs = document.querySelectorAll<HTMLButtonElement>('.tab[data-range]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const range = tab.dataset.range as TimeRange;
      if (!range) return;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      switchTimeRange(range);
    });
  });
}

// Fix #4: Refresh ScrollTrigger on resize across breakpoint
let lastScroller = window.innerWidth > 767 ? '.dashboard-main' : undefined;
window.addEventListener('resize', () => {
  const newScroller = window.innerWidth > 767 ? '.dashboard-main' : undefined;
  if (newScroller !== lastScroller) {
    lastScroller = newScroller;
    ScrollTrigger.refresh(true);
  }
});

document.addEventListener('DOMContentLoaded', initTimeRange);
