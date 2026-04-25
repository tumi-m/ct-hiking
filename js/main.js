const ROUTES_URL = './data/routes.json';

async function loadTrails() {
  const res = await fetch(ROUTES_URL);
  return res.json();
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

function difficultyClass(d) {
  return d === 'Easy' ? 'badge-easy' : d === 'Moderate' ? 'badge-moderate' : 'badge-hard';
}

function pricingLabel(pricing) {
  if (!pricing || pricing.adult === 0) return '<span class="price-free">Free</span>';
  if (pricing.adult === null) return '<span class="price-closed">Temporarily closed</span>';
  if (pricing.child === null) return `<span class="price-paid">R${pricing.adult} p.p.</span>`;
  return `<span class="price-paid">Adult R${pricing.adult} · Child R${pricing.child}</span>`;
}

function sourceClass(s) {
  return s === 'SANParks' ? 'badge-sanparks' : 'badge-capenature';
}

function trailCard(trail) {
  return `
    <article class="card" data-difficulty="${trail.difficulty}" data-source="${trail.source}">
      <div class="card-header">
        <h3 class="card-title">${trail.name}</h3>
        <div class="card-badges">
          <span class="badge ${difficultyClass(trail.difficulty)}">${trail.difficulty}</span>
          <span class="badge ${sourceClass(trail.source)}">${trail.source}</span>
        </div>
      </div>
      <p class="card-reserve">${trail.reserve}</p>
      <div class="card-stats">
        <div class="stat">
          <div class="stat-value">${trail.distance_km} km</div>
          <div class="stat-label">Distance</div>
        </div>
        <div class="stat">
          <div class="stat-value">${trail.elevation_gain_m} m</div>
          <div class="stat-label">Elevation</div>
        </div>
        <div class="stat">
          <div class="stat-value">${trail.estimated_time}</div>
          <div class="stat-label">Time</div>
        </div>
      </div>
      <div class="card-price">${pricingLabel(trail.pricing)}</div>
      <p class="card-description">${trail.description}</p>
      <div class="card-footer">
        <a class="card-link" href="trail.html?slug=${trail.slug}">View trail →</a>
      </div>
    </article>`;
}

function topoBackground() {
  const svg = document.getElementById('topo-svg');
  if (!svg) return;
  const W = 1600, H = 900;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  let paths = '';
  const centers = [
    [400, 300], [900, 200], [1300, 500], [200, 700], [750, 600], [1100, 800]
  ];
  const colors = ['#8b6914', '#3a7d44', '#1a5276', '#8b6914', '#3a7d44', '#1a5276'];
  centers.forEach(([cx, cy], ci) => {
    for (let r = 40; r <= 340; r += 38) {
      const rx = r * 1.6;
      const ry = r;
      const angle = ci * 28;
      const wave = r * 0.08;
      let d = '';
      const steps = 48;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const noise = Math.sin(t * 3 + ci) * wave + Math.cos(t * 5 + ci * 1.3) * wave * 0.5;
        const cosA = Math.cos((angle * Math.PI) / 180);
        const sinA = Math.sin((angle * Math.PI) / 180);
        const rawX = rx * Math.cos(t) + noise;
        const rawY = ry * Math.sin(t) + noise;
        const x = cx + rawX * cosA - rawY * sinA;
        const y = cy + rawX * sinA + rawY * cosA;
        d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      d += ' Z';
      paths += `<path d="${d}" fill="none" stroke="${colors[ci]}" stroke-width="1"/>`;
    }
  });
  svg.innerHTML = paths;
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  topoBackground();
  initNavToggle();
});
