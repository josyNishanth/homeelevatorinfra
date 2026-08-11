/**
 * Generates the placeholder art set for HomeElevatorInfra.
 *
 * The art direction is deliberate architectural abstraction (flat planes, light
 * shafts, hairlines, one gold accent) rather than fake photorealism, so the
 * placeholders read as designed while real photography is unavailable.
 *
 * Run: npm run gen:images
 *
 * Replacing with real assets: keep the same file names (or point the `image`
 * fields in src/data/*.ts at the new .webp/.avif files). Nothing else changes.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'public');

const GOLD = '#B9955A';

let written = 0;
function write(rel, svg) {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, `${svg.trim()}\n`, 'utf8');
  written += 1;
}

/* ---------------------------------------------------------------- colour ---- */

const hex = (h) => {
  const s = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const toHex = (rgb) => `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, t) => {
  const [x, y] = [hex(a), hex(b)];
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};
const shade = (c, t) => mix(c, '#000000', t);
const tint = (c, t) => mix(c, '#ffffff', t);

/* ------------------------------------------------------ product renders ---- */

const ENVS = {
  light: { top: '#F5F3EF', bot: '#D9D5CD', floor: '#CDC8BF', wall: '#EAE7E1', ink: '#5C5A55' },
  dark: { top: '#141A22', bot: '#070A0F', floor: '#0B0F16', wall: '#182031', ink: '#9FB2CB' },
};

const FORMS = {
  // rx drives the silhouette: pill = air-driven tube, soft = circular cabin, box = shaft
  tube: { rx: 268, cap: 'dome', drive: 'turbine' },
  soft: { rx: 200, cap: 'dome', drive: 'ring' },
  box: { rx: 12, cap: 'flat', drive: 'beam' },
};

/**
 * Product render. `cabin` drives the exterior finish, `form` the silhouette
 * (vacuum / cylindrical / hydraulic), `env` the studio background. Default frame
 * is portrait 3:4 for product tiles; pass `wide` for the landscape hero crop.
 */
function elevator({
  cabin,
  frame = '#A7ADB5',
  form = 'box',
  env = 'light',
  glassTone = '#FFFFFF',
  wide = false,
}) {
  const e = ENVS[env];
  const f = FORMS[form];
  const dark = env === 'dark';

  const VW = wide ? 1600 : 1200;
  const VH = wide ? 1100 : 1600;
  const CX = VW / 2;

  const W = wide ? 360 : 540;
  const X = Math.round(CX - W / 2);
  const X2 = X + W;
  const Y = wide ? 130 : 150;
  const FLOOR = wide ? 900 : 1246;
  const H = FLOOR - Y;

  const cabDark = shade(cabin, 0.35);
  const cabLight = tint(cabin, 0.22);
  const inner = X + 46;
  const innerW = W - 92;

  const drive =
    f.drive === 'turbine'
      ? `<rect x="${X + 60}" y="${Y - 84}" width="${W - 120}" height="76" rx="24" fill="${shade(frame, 0.25)}"/>
         <rect x="${X + 100}" y="${Y - 104}" width="${W - 200}" height="30" rx="15" fill="${shade(frame, 0.45)}"/>
         <line x1="${X + 100}" y1="${Y - 46}" x2="${X2 - 100}" y2="${Y - 46}" stroke="${tint(frame, 0.4)}" stroke-width="2" opacity=".7"/>`
      : f.drive === 'ring'
        ? `<rect x="${X + 40}" y="${Y - 54}" width="${W - 80}" height="46" rx="23" fill="${shade(frame, 0.2)}"/>
           <rect x="${X + 70}" y="${Y - 44}" width="${W - 140}" height="8" rx="4" fill="${GOLD}" opacity=".85"/>`
        : `<rect x="${X - 24}" y="${Y - 56}" width="${W + 48}" height="56" rx="6" fill="${shade(frame, 0.3)}"/>
           <rect x="${X - 24}" y="${Y - 56}" width="${W + 48}" height="6" fill="${tint(frame, 0.35)}" opacity=".6"/>`;

  const rails =
    form === 'box'
      ? `<rect x="${X - 18}" y="${Y}" width="20" height="${H}" fill="${shade(frame, 0.28)}"/>
         <rect x="${X2 - 2}" y="${Y}" width="20" height="${H}" fill="${shade(frame, 0.28)}"/>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" width="${VW}" height="${VH}">
  <defs>
    <linearGradient id="env" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${e.top}"/><stop offset="1" stop-color="${e.bot}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${glassTone}" stop-opacity="${dark ? 0.1 : 0.34}"/>
      <stop offset=".5" stop-color="${glassTone}" stop-opacity="${dark ? 0.03 : 0.12}"/>
      <stop offset="1" stop-color="${glassTone}" stop-opacity="${dark ? 0.12 : 0.28}"/>
    </linearGradient>
    <linearGradient id="cab" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${cabDark}"/><stop offset=".42" stop-color="${cabLight}"/>
      <stop offset=".62" stop-color="${cabin}"/><stop offset="1" stop-color="${cabDark}"/>
    </linearGradient>
    <linearGradient id="back" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint(e.wall, dark ? 0.12 : 0.5)}"/><stop offset="1" stop-color="${shade(e.wall, dark ? 0.35 : 0.12)}"/>
    </linearGradient>
    <radialGradient id="lamp" cx=".5" cy="0" r="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="${dark ? 0.55 : 0.72}"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="contact" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#000000" stop-opacity="${dark ? 0.7 : 0.34}"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${dark ? 0.16 : 0.4}"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="body"><rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="${f.rx}"/></clipPath>
  </defs>

  <rect width="${VW}" height="${VH}" fill="url(#env)"/>
  <rect y="${FLOOR}" width="${VW}" height="${VH - FLOOR}" fill="${e.floor}"/>
  <line x1="0" y1="${FLOOR}" x2="${VW}" y2="${FLOOR}" stroke="${e.ink}" stroke-width="2" opacity=".28"/>
  <line x1="86" y1="${FLOOR - Math.round(H * 0.43)}" x2="${X - 70}" y2="${FLOOR - Math.round(H * 0.43)}" stroke="${e.ink}" stroke-width="2" opacity=".2"/>
  <line x1="${X2 + 70}" y1="${FLOOR - Math.round(H * 0.64)}" x2="${VW - 86}" y2="${FLOOR - Math.round(H * 0.64)}" stroke="${e.ink}" stroke-width="2" opacity=".2"/>
  <ellipse cx="${CX}" cy="${FLOOR + 26}" rx="${Math.round(W * 0.78)}" ry="66" fill="url(#contact)"/>

  ${rails}
  ${drive}

  <g clip-path="url(#body)">
    <rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="url(#back)"/>
    <rect x="${inner}" y="${Y + 60}" width="${innerW}" height="${H - 210}" fill="${shade(e.wall, dark ? 0.5 : 0.06)}"/>
    <ellipse cx="${CX}" cy="${Y + 66}" rx="${innerW * 0.46}" ry="26" fill="${tint(cabin, 0.55)}" opacity=".85"/>
    <rect x="${inner}" y="${Y + 60}" width="${innerW}" height="${H - 210}" fill="url(#lamp)"/>
    <path d="M${inner} ${FLOOR - 150} L${X2 - 46} ${FLOOR - 150} L${X2 - 96} ${FLOOR - 60} L${inner + 50} ${FLOOR - 60} Z" fill="${shade(e.floor, 0.18)}"/>
    <line x1="${inner + 18}" y1="${Y + Math.round(H * 0.43)}" x2="${X2 - 64}" y2="${Y + Math.round(H * 0.43)}" stroke="${tint(frame, 0.5)}" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    <rect x="${X2 - 118}" y="${Y + Math.round(H * 0.31)}" width="34" height="150" rx="17" fill="${shade(e.wall, 0.55)}" opacity=".9"/>
    <circle cx="${X2 - 101}" cy="${Y + Math.round(H * 0.31) + 32}" r="7" fill="${GOLD}"/>
    <circle cx="${X2 - 101}" cy="${Y + Math.round(H * 0.31) + 64}" r="7" fill="${tint(GOLD, 0.5)}" opacity=".6"/>
    <circle cx="${X2 - 101}" cy="${Y + Math.round(H * 0.31) + 96}" r="7" fill="${tint(GOLD, 0.5)}" opacity=".35"/>
    <rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="url(#glass)"/>
    <rect x="${X}" y="${Y}" width="${W}" height="86" fill="url(#cab)"/>
    <rect x="${X}" y="${Y + 84}" width="${W}" height="4" fill="${GOLD}" opacity=".9"/>
    <rect x="${X}" y="${FLOOR - 104}" width="${W}" height="104" fill="url(#cab)"/>
    <rect x="${X}" y="${Y}" width="58" height="${H}" fill="url(#cab)" opacity=".96"/>
    <rect x="${X2 - 58}" y="${Y}" width="58" height="${H}" fill="url(#cab)" opacity=".96"/>
    <line x1="${CX}" y1="${Y + 88}" x2="${CX}" y2="${FLOOR - 104}" stroke="${cabDark}" stroke-width="3" opacity=".5"/>
    <path d="M${X - 60} ${Y + 240} L${X + 240} ${Y - 60} L${X + 360} ${Y - 60} L${X - 60} ${Y + 360} Z" fill="url(#streak)"/>
    <path d="M${X + 60} ${Y + Math.round(H * 0.86)} L${X + 300} ${Y + Math.round(H * 0.64)} L${X + 360} ${Y + Math.round(H * 0.64)} L${X + 120} ${Y + Math.round(H * 0.86)} Z" fill="url(#streak)" opacity=".7"/>
  </g>
  <rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="${f.rx}" fill="none" stroke="${shade(frame, dark ? 0.1 : 0.3)}" stroke-width="5"/>
  <rect x="${X + 14}" y="${Y + 14}" width="${W - 28}" height="${H - 28}" rx="${Math.max(0, f.rx - 14)}" fill="none" stroke="${tint(frame, 0.45)}" stroke-width="2" opacity=".45"/>
</svg>`;
}

/* -------------------------------------------------------- scene renders ---- */

const PALS = {
  stone: { bg: '#E7E4DD', wall: '#D8D4CB', wall2: '#BDB8AD', floor: '#A9A399', ink: '#2B2E33', light: '#FFFFFF' },
  warm: { bg: '#E5DACA', wall: '#D6C8B2', wall2: '#B9A788', floor: '#A08D6E', ink: '#332C22', light: '#FFF4E2' },
  navy: { bg: '#0B2748', wall: '#0E3160', wall2: '#061B33', floor: '#04101F', ink: '#C9D9EE', light: '#DCEAFB' },
  charcoal: { bg: '#1B1E23', wall: '#24282F', wall2: '#101317', floor: '#0A0C0F', ink: '#DFE2E7', light: '#F1F3F6' },
};

/** Small glazed home lift, so an "integration" scene actually shows a lift. */
const liftGlyph = (p, x, y, w, h) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(w / 2)}" fill="${p.light}" opacity=".2"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(w / 2)}" fill="none" stroke="${p.ink}" stroke-width="5" stroke-opacity=".5"/>
    <rect x="${x + 10}" y="${y + 8}" width="${w - 20}" height="${Math.round(h * 0.09)}" rx="8" fill="${p.ink}" opacity=".45"/>
    <rect x="${x + 10}" y="${y + h - Math.round(h * 0.13)}" width="${w - 20}" height="${Math.round(h * 0.11)}" rx="8" fill="${p.ink}" opacity=".45"/>
    <rect x="${x + 10}" y="${y + Math.round(h * 0.105)}" width="${w - 20}" height="5" fill="${GOLD}" opacity=".85"/>
    <line x1="${x + Math.round(w * 0.22)}" y1="${y + Math.round(h * 0.52)}" x2="${x + Math.round(w * 0.78)}" y2="${y + Math.round(h * 0.52)}" stroke="${p.light}" stroke-width="6" stroke-linecap="round" opacity=".6"/>
    <line x1="${x + Math.round(w / 2)}" y1="${y + Math.round(h * 0.12)}" x2="${x + Math.round(w / 2)}" y2="${y + h - Math.round(h * 0.14)}" stroke="${p.ink}" stroke-width="2" opacity=".3"/>`;

const MOTIFS = {
  shaft: (p) => `
    <rect x="0" y="0" width="960" height="1000" fill="${p.wall}"/>
    <rect x="960" y="0" width="640" height="1000" fill="${p.wall2}"/>
    <g stroke="${p.ink}" stroke-width="2" opacity=".18">
      <line x1="80" y1="300" x2="880" y2="300"/><line x1="80" y1="560" x2="880" y2="560"/><line x1="80" y1="820" x2="880" y2="820"/>
    </g>
    <rect x="948" y="0" width="4" height="1000" fill="${GOLD}" opacity=".55"/>
    ${liftGlyph(p, 1050, 80, 330, 800)}
    <path d="M1050 300 L1380 120 L1380 200 L1050 380 Z" fill="${p.light}" opacity=".14"/>`,

  stair: (p) => `
    <rect width="1600" height="1000" fill="${p.wall}"/>
    <rect y="700" width="1600" height="300" fill="${p.floor}"/>
    <g fill="${p.wall2}">
      ${Array.from({ length: 7 }, (_, i) => `<rect x="${170 + i * 140}" y="${700 - (i + 1) * 82}" width="140" height="${(i + 1) * 82}"/>`).join('\n      ')}
    </g>
    <g stroke="${p.ink}" stroke-width="2" opacity=".22">
      ${Array.from({ length: 7 }, (_, i) => `<line x1="${170 + i * 140}" y1="${700 - (i + 1) * 82}" x2="${310 + i * 140}" y2="${700 - (i + 1) * 82}"/>`).join('\n      ')}
    </g>
    <line x1="200" y1="600" x2="1180" y2="18" stroke="${p.ink}" stroke-width="7" stroke-linecap="round" opacity=".55"/>
    <g stroke="${p.ink}" stroke-width="3" opacity=".35">
      ${Array.from({ length: 6 }, (_, i) => `<line x1="${250 + i * 150}" y1="${640 - i * 82}" x2="${250 + i * 150}" y2="${570 - i * 89}"/>`).join('\n      ')}
    </g>
    <rect x="1300" y="120" width="4" height="580" fill="${GOLD}" opacity=".5"/>`,

  aperture: (p) => `
    <rect width="1600" height="1000" fill="${p.wall}"/>
    <rect y="760" width="1600" height="240" fill="${p.floor}"/>
    <defs><linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.light}" stop-opacity=".92"/><stop offset="1" stop-color="${p.light}" stop-opacity=".45"/>
    </linearGradient></defs>
    <rect x="900" y="70" width="560" height="770" fill="url(#win)"/>
    <g stroke="${p.wall2}" stroke-width="10">
      <line x1="1080" y1="70" x2="1080" y2="840"/><line x1="1280" y1="70" x2="1280" y2="840"/>
    </g>
    <rect x="900" y="70" width="560" height="770" fill="none" stroke="${p.ink}" stroke-width="6" opacity=".5"/>
    <path d="M900 840 L1460 840 L1080 1000 L360 1000 Z" fill="${p.light}" opacity=".2"/>
    <rect x="120" y="700" width="380" height="46" rx="8" fill="${p.wall2}"/>
    <rect x="150" y="746" width="26" height="60" fill="${p.ink}" opacity=".35"/>
    <rect x="444" y="746" width="26" height="60" fill="${p.ink}" opacity=".35"/>
    ${liftGlyph(p, 600, 170, 240, 670)}
    <rect x="120" y="180" width="4" height="380" fill="${GOLD}" opacity=".6"/>`,

  terrace: (p) => `
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint(p.light, 0.2)}" stop-opacity=".95"/><stop offset="1" stop-color="${p.wall2}" stop-opacity=".9"/>
    </linearGradient></defs>
    <rect width="1600" height="1000" fill="url(#sky)"/>
    <rect y="640" width="1600" height="360" fill="${p.floor}"/>
    <line x1="0" y1="470" x2="1600" y2="470" stroke="${p.ink}" stroke-width="2" opacity=".22"/>
    <rect x="60" y="380" width="1480" height="12" rx="6" fill="${p.ink}" opacity=".55"/>
    <g stroke="${p.ink}" stroke-width="4" opacity=".38">
      ${Array.from({ length: 24 }, (_, i) => `<line x1="${76 + i * 62}" y1="392" x2="${76 + i * 62}" y2="640"/>`).join('\n      ')}
    </g>
    <rect x="60" y="632" width="1480" height="16" fill="${p.wall2}"/>
    ${liftGlyph(p, 1120, 140, 230, 500)}
    <rect x="140" y="700" width="240" height="120" rx="6" fill="${p.wall2}"/>`,

  // Steel elevator structure: braced frame on the left, one glazed bay carrying
  // a cabin, so the drawing reads as a shaft rather than a generic grid.
  structure: (p) => {
    const COLS = [180, 470, 760, 1050, 1400];
    const ROWS = [90, 300, 510, 720, 880];
    return `
    <defs><linearGradient id="stx" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint(p.wall, 0.16)}"/><stop offset="1" stop-color="${shade(p.wall2, 0.12)}"/>
    </linearGradient></defs>
    <rect width="1600" height="1000" fill="url(#stx)"/>
    <path d="M0 880 L1600 830 L1600 1000 L0 1000 Z" fill="${shade(p.floor, 0.1)}"/>

    <rect x="${COLS[3]}" y="${ROWS[0]}" width="${COLS[4] - COLS[3]}" height="${ROWS[4] - ROWS[0]}" fill="${p.light}" opacity=".16"/>
    <rect x="${COLS[3] + 44}" y="${ROWS[1]}" width="${COLS[4] - COLS[3] - 88}" height="${ROWS[3] - ROWS[1]}" fill="${p.light}" opacity=".22"/>
    <rect x="${COLS[3] + 44}" y="${ROWS[1]}" width="${COLS[4] - COLS[3] - 88}" height="26" fill="${GOLD}" opacity=".8"/>
    <rect x="${COLS[3] + 44}" y="${ROWS[3] - 34}" width="${COLS[4] - COLS[3] - 88}" height="34" fill="${p.ink}" opacity=".45"/>
    <line x1="${COLS[3] + 70}" y1="${(ROWS[1] + ROWS[3]) / 2}" x2="${COLS[4] - 70}" y2="${(ROWS[1] + ROWS[3]) / 2}" stroke="${p.light}" stroke-width="7" stroke-linecap="round" opacity=".6"/>

    <g stroke="${p.ink}" stroke-width="2.5" opacity=".32">
      ${[0, 1, 2].map((c) => {
        const x1 = COLS[c];
        const x2 = COLS[c + 1];
        return [0, 1, 2, 3]
          .map((r) =>
            (c + r) % 2 === 0
              ? `<line x1="${x1}" y1="${ROWS[r]}" x2="${x2}" y2="${ROWS[r + 1]}"/>`
              : `<line x1="${x2}" y1="${ROWS[r]}" x2="${x1}" y2="${ROWS[r + 1]}"/>`,
          )
          .join('\n      ');
      }).join('\n      ')}
    </g>

    <g stroke="${p.ink}" stroke-width="9" opacity=".6" stroke-linecap="square">
      ${COLS.map((x) => `<line x1="${x}" y1="${ROWS[0]}" x2="${x}" y2="${ROWS[4]}"/>`).join('\n      ')}
    </g>
    <g stroke="${p.ink}" stroke-width="5" opacity=".45">
      ${ROWS.map((y) => `<line x1="${COLS[0]}" y1="${y}" x2="${COLS[4]}" y2="${y}"/>`).join('\n      ')}
    </g>
    <g fill="${p.ink}" opacity=".55">
      ${COLS.map((x) => `<rect x="${x - 20}" y="${ROWS[4]}" width="40" height="30"/>`).join('\n      ')}
    </g>
    <rect x="${COLS[0]}" y="${ROWS[0] - 26}" width="${COLS[4] - COLS[0]}" height="8" fill="${GOLD}" opacity=".55"/>`;
  },

  panel: (p) => `
    <defs><linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tint(p.light, 0.1)}" stop-opacity=".9"/><stop offset="1" stop-color="${p.wall2}"/>
    </linearGradient></defs>
    <rect width="1600" height="1000" fill="url(#roof)"/>
    <path d="M0 700 L1600 620 L1600 1000 L0 1000 Z" fill="${p.floor}"/>
    <circle cx="1300" cy="220" r="120" fill="none" stroke="${GOLD}" stroke-width="6" opacity=".7"/>
    <circle cx="1300" cy="220" r="58" fill="${GOLD}" opacity=".22"/>
    <path d="M220 700 L1080 640 L1180 420 L360 470 Z" fill="${p.wall}" opacity=".95"/>
    <path d="M220 700 L1080 640 L1180 420 L360 470 Z" fill="none" stroke="${p.ink}" stroke-width="5" opacity=".5"/>
    <g stroke="${p.ink}" stroke-width="2" opacity=".35">
      ${Array.from({ length: 5 }, (_, i) => `<line x1="${220 + (i + 1) * 160}" y1="${700 - (i + 1) * 11}" x2="${360 + (i + 1) * 164}" y2="${470 - (i + 1) * 10}"/>`).join('\n      ')}
      <line x1="290" y1="585" x2="1130" y2="530"/>
    </g>
    <rect x="1200" y="700" width="120" height="240" rx="14" fill="${p.wall}" stroke="${p.ink}" stroke-width="4" stroke-opacity=".45"/>
    <rect x="1218" y="726" width="84" height="10" rx="5" fill="${GOLD}" opacity=".8"/>`,

  swatch: (p) => `
    <rect width="1600" height="1000" fill="${p.wall}"/>
    <g>
      ${['#EDEDE9', '#16181C', '#8A8F98', '#D8CBB6', '#1F3A5F', '#6B4A34', '#2E4636', '#23262B', '#C3C7CC', '#B9955A', '#8C6239', '#E8E6E1']
        .map((c, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 160 + col * 320;
          const y = 130 + row * 250;
          return `<rect x="${x}" y="${y}" width="260" height="190" rx="6" fill="${c}"/>
      <rect x="${x}" y="${y + 176}" width="260" height="14" fill="#000" opacity=".18"/>`;
        })
        .join('\n      ')}
    </g>
    <rect x="1116" y="366" width="288" height="218" rx="10" fill="none" stroke="${GOLD}" stroke-width="6"/>
    <rect x="160" y="70" width="4" height="40" fill="${GOLD}"/>`,
};

function scene({ motif, pal = 'stone' }) {
  const p = PALS[pal];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <radialGradient id="vig" cx=".5" cy=".45" r=".78">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="${p.bg}"/>
  ${MOTIFS[motif](p)}
  <rect width="1600" height="1000" fill="url(#vig)"/>
</svg>`;
}

/* ------------------------------------------------------------- manifest ---- */

// Exterior finishes. Hex values mirror src/data/colors.ts.
const FINISHES = [
  ['white', '#EDEDE9', '#B6BAC0'],
  ['black', '#16181C', '#6E747C'],
  ['grey', '#8A8F98', '#AEB4BC'],
  ['beige', '#D8CBB6', '#B9A98F'],
  ['blue', '#1F3A5F', '#7F91AA'],
  ['brown', '#6B4A34', '#9C8471'],
  ['green', '#2E4636', '#83958A'],
  ['carbon', '#23262B', '#5F656D'],
  ['silver', '#C3C7CC', '#DDE1E6'],
  ['gold', '#B9955A', '#D9C79B'],
  ['bronze', '#8C6239', '#C0A183'],
];

for (const [name, cabin, frame] of FINISHES) {
  write(`images/elevators/${name}.svg`, elevator({ cabin, frame, form: 'soft' }));
}

// All three product slots now use real photography (see elevators.ts).

const SCENES = {
  // Decorative texture behind the hero gradients.
  'hero/backdrop': { motif: 'structure', pal: 'navy' },

  'services/structure-design': { motif: 'structure', pal: 'navy' },
  'services/fabrication-installation': { motif: 'structure', pal: 'charcoal' },
  'services/commissioning': { motif: 'shaft', pal: 'charcoal' },
  'services/solar-water-heater': { motif: 'panel', pal: 'warm' },

  'why/space-efficient': { motif: 'shaft', pal: 'stone' },
  'why/designed-for-home': { motif: 'aperture', pal: 'warm' },
  'why/personalised-finishes': { motif: 'swatch', pal: 'stone' },
  'why/professional-installation': { motif: 'structure', pal: 'charcoal' },
  'why/modern-engineering': { motif: 'structure', pal: 'navy' },

  'compare/before': { motif: 'stair', pal: 'stone' },
  'compare/after': { motif: 'shaft', pal: 'stone' },
};

for (const [path, opts] of Object.entries(SCENES)) {
  write(`images/${path}.svg`, scene(opts));
}

write(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#082B5C"/>
  <rect x="22" y="10" width="20" height="44" rx="10" fill="none" stroke="#F7F7F5" stroke-width="3"/>
  <rect x="26" y="18" width="12" height="4" rx="2" fill="#B9955A"/>
  <rect x="26" y="42" width="12" height="4" rx="2" fill="#B9955A"/>
</svg>`,
);

console.log(`gen-placeholders: wrote ${written} files to public/`);
