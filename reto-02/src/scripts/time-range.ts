import { gsap } from 'gsap';

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

function loadData(): SpotifyData {
  const el = document.getElementById('spotify-data');
  return JSON.parse(el!.textContent!);
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

function computeGenres(artists: SpotifyArtist[]) {
  const counts: Record<string, number> = {};
  let total = 0;
  artists.forEach(a => a.genres.forEach(g => { counts[g] = (counts[g] || 0) + 1; total++; }));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }));
}

function updateArtistsCompact(artists: SpotifyArtist[]) {
  const container = document.getElementById('artists-compact');
  if (!container) return;
  const circles = container.querySelectorAll('.artist-circle');
  artists.slice(0, 5).forEach((artist, i) => {
    const el = circles[i];
    if (!el) return;
    const img = el.querySelector('img');
    const name = el.querySelector('.artist-name');
    const genre = el.querySelector('.artist-genre');
    if (img) { (img as HTMLImageElement).src = artist.image; img.setAttribute('alt', artist.name); }
    if (name) name.textContent = artist.name;
    if (genre) genre.textContent = artist.genres[0] || '';
  });
}

function updateArtistsExpanded(artists: SpotifyArtist[]) {
  const grid = document.getElementById('artists-expanded');
  if (!grid) return;
  grid.innerHTML = artists.map((a, i) => `
    <div class="artist-card glass-card">
      <span class="artist-rank">#${i + 1}</span>
      <img src="${a.image}" alt="${a.name}" class="artist-card-img" loading="lazy" onerror="this.style.display='none'" />
      <span class="artist-name">${a.name}</span>
      <span class="artist-genre">${a.genres[0] || ''}</span>
    </div>
  `).join('');
}

function updateGenres(artists: SpotifyArtist[]) {
  const genres = computeGenres(artists);
  const container = document.getElementById('genre-bars');
  if (!container) return;
  container.innerHTML = genres.map((g, i) => `
    <div class="genre-row">
      <span class="genre-name">${g.name}</span>
      <div class="genre-track">
        <div class="genre-fill" style="--target-width: ${g.percent}%; width: ${g.percent}%; background: linear-gradient(90deg, ${gradientColors[i]});"></div>
      </div>
      <span class="genre-percent" style="color: ${gradientColors[i].split(',')[0]}">${g.percent}%</span>
    </div>
  `).join('');
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

  // Update vertex dots
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

  // Update expanded feature bars if visible
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
      <img src="${t.albumImage}" alt="${t.album} album art" class="track-album-art" loading="lazy" onerror="this.style.display='none'" />
      <div class="track-info">
        <span class="track-name">${t.name}</span>
        <span class="track-artist">${t.artist}</span>
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
          gsap.to(main, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        }
      });
    }
  } else {
    updateArtistsCompact(artists);
    updateArtistsExpanded(artists);
    updateGenres(artists);
    updateRadar(audio);
    updateTracks(tracks);
    updateSidebarStats(artists, tracks);
  }
}

function initTimeRange() {
  data = loadData();

  // Initialize with short_term, no animation
  switchTimeRange('short', false);

  // Listen for tab clicks
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

document.addEventListener('DOMContentLoaded', initTimeRange);
