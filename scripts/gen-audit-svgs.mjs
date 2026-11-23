import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/content/blog/iWSP/audits.svg');

const C = {
    card: '#f3f4f5',
    cardBorder: '#d3d7db',
    head: '#cfd5da',
    text: '#1f2933',
    blue: '#1f6fa8',
    blueLight: '#dbeaf6',
    blueBorder: '#8db6d6',
    blueHead: '#bcd6ea',
    pink: '#c93b6b',
    cell: '#cdd2d7',
};
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

// ~column width so it renders near 1:1
const W = 700, H = 545;

const t = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" font-family="${SANS}" font-size="${o.size ?? 15}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? C.text}"${o.opacity ? ` fill-opacity="${o.opacity}"` : ''}${o.italic ? ' font-style="italic"' : ''} text-anchor="${o.anchor ?? 'start'}" dominant-baseline="central">${s}</text>`;

const check = (cx, cy) =>
    `<circle cx="${cx}" cy="${cy}" r="8" fill="${C.blue}" />` +
    `<path d="M${cx - 4},${cy + 0.3} L${cx - 1.2},${cy + 3.2} L${cx + 4},${cy - 3}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;

const title = (x, y, s) => t(x, y, s, { size: 17, weight: 700, fill: 'currentColor', anchor: 'middle' });

/* ───── Row 1 left: Audit by an LLM judge ───── */
const iconColors = [C.cell, C.cell, C.blue, C.cell, C.cell, C.cell, C.pink, C.cell, C.cell, C.blue, C.cell, C.cell, C.cell, C.pink, C.cell];
const iconCells = iconColors
    .map((col, i) => `<rect x="${52 + (i % 5) * 10}" y="${92 + Math.floor(i / 5) * 10}" width="8" height="8" rx="1" fill="${col}" />`)
    .join('');
const judge = `
${title(190, 20, 'Audit by an LLM judge')}
<rect x="20" y="44" width="340" height="200" rx="12" fill="${C.card}" stroke="${C.cardBorder}" stroke-width="1.5" filter="url(#a-sh)" />
<rect x="44" y="66" width="64" height="58" rx="5" fill="#fff" stroke="#9aa3ab" stroke-width="1.5" />
<path d="M44,78 V71 Q44,66 49,66 H103 Q108,66 108,71 V78 Z" fill="${C.head}" />
${iconCells}
<line x1="170" y1="95" x2="120" y2="95" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round" marker-end="url(#a-b)" />
<rect x="178" y="78" width="148" height="34" rx="9" fill="#fff" stroke="${C.cardBorder}" stroke-width="1.5" />
${t(252, 95.5, 'LLM judge', { size: 18, weight: 700, anchor: 'middle' })}
${check(52, 156)}${t(72, 156.5, 'no training', { size: 17 })}
${check(52, 188)}${t(72, 188.5, 'follows the rules', { size: 17 })}
${check(52, 220)}${t(72, 220.5, 'interpretable edits', { size: 17 })}`;

/* ───── Row 1 right: Hidden accuracy ───── */
const x0 = 470, x1 = 620, y0 = 62, y1 = 202;
const px = (v) => x0 + ((v - 50) / 50) * (x1 - x0);
const py = (v) => y1 - ((v - 50) / 50) * (y1 - y0);
const dots = [[55, 53], [70, 68], [80, 78], [88, 86], [89.5, 88]]
    .map(([a, b]) => `<circle cx="${px(a)}" cy="${py(b)}" r="4.5" fill="${C.pink}" />`)
    .join('');
const hidden = `
${title(545, 20, 'Hidden accuracy')}
<g stroke="currentColor" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round" fill="none">
  <path d="M${x0},${y0 - 8} V${y1} H${x1 + 8}" />
  <path d="M${x0 - 6},${y0} H${x0}" /><path d="M${x0 - 6},${y1} H${x0}" />
  <path d="M${x0},${y1} V${y1 + 6}" /><path d="M${x1},${y1} V${y1 + 6}" />
</g>
<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y0}" stroke="currentColor" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="6 5" />
${dots}
<circle cx="${x1}" cy="${y0}" r="5.5" fill="${C.blue}" />
<g font-family="${SANS}" fill="currentColor" fill-opacity="0.8" font-size="14.5" dominant-baseline="central">
  <text x="${x0 - 12}" y="${y0}" text-anchor="end">100</text>
  <text x="${x0 - 12}" y="${y1}" text-anchor="end">50</text>

  <text x="${x0}" y="${y1 + 20}" text-anchor="middle">50</text>
  <text x="${x1}" y="${y1 + 20}" text-anchor="middle">100</text>
  <text x="${(x0 + x1) / 2}" y="${y1 + 42}" text-anchor="middle" font-size="15.5">Original (%)</text>
  <text transform="translate(${x0 - 56},${(y0 + y1) / 2}) rotate(-90)" text-anchor="middle" font-size="15.5">Rebuilt (%)</text>
</g>
${t(x1 - 12, y0 - 16, 'Algorithmic', { size: 15.5, fill: C.blue, anchor: 'end' })}
${t(px(80) + 30, py(70) + 18, 'NLP', { size: 15.5, fill: C.pink, italic: true })}`;

/* ───── Row 2: Interpretability bottleneck test ───── */
const cardTop = 44, cardH = 196, headH = 34, arrowY = 142;
const card = (x, w, ttl, { fill = C.card, stroke = C.cardBorder, head = C.head } = {}) =>
    `<rect x="${x}" y="${cardTop}" width="${w}" height="${cardH}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5" filter="url(#a-sh)" />` +
    `<path d="M${x},${cardTop + headH} V${cardTop + 10} Q${x},${cardTop} ${x + 10},${cardTop} H${x + w - 10} Q${x + w},${cardTop} ${x + w},${cardTop + 10} V${cardTop + headH} Z" fill="${head}" />` +
    t(x + w / 2, cardTop + headH / 2 + 1, ttl, { size: 16, weight: 700, anchor: 'middle' });
const quote = ['“This model adds', 'in one cross-attention', 'read, treating the sum', 'as an angle on a', 'ten-sector ring…”'];
const arrow = (xa, xb) =>
    `<line x1="${xa}" y1="${arrowY}" x2="${xb}" y2="${arrowY}" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round" marker-end="url(#a-b)" />`;

const bottleneck = `<g transform="translate(0,290)">
${title(W / 2, 14, 'Interpretability bottleneck test: rebuild the model from its description')}

${card(15, 150, 'Example model')}
${t(90, 136, 'Addition', { size: 16, anchor: 'middle' })}
${t(90, 160, '27 parameters', { size: 16, anchor: 'middle' })}

${arrow(170, 242)}
${t(206, arrowY - 20, 'Describe', { size: 15, weight: 700, fill: C.blue, anchor: 'middle' })}
${t(206, arrowY + 22, '≤200', { size: 14, fill: 'currentColor', opacity: 0.7, anchor: 'middle' })}
${t(206, arrowY + 40, 'words', { size: 14, fill: 'currentColor', opacity: 0.7, anchor: 'middle' })}

${card(247, 172, 'Description', { fill: C.blueLight, stroke: C.blueBorder, head: C.blueHead })}
${quote.map((l, i) => t(333, 108 + i * 22, l, { size: 14, italic: true, fill: '#55626e', anchor: 'middle' })).join('\n')}

${arrow(424, 496)}
${t(460, arrowY - 38, 'Fresh', { size: 15, weight: 700, fill: C.blue, anchor: 'middle' })}
${t(460, arrowY - 20, 'agent', { size: 15, weight: 700, fill: C.blue, anchor: 'middle' })}

${card(501, 184, 'Rebuilt model')}
${t(519, 112, 'Almost the same:', { size: 15 })}
${check(527, 144)}${t(545, 144.5, 'performance', { size: 15 })}
${check(527, 174)}${t(545, 174.5, 'predictions', { size: 15 })}
${check(527, 204)}${t(545, 204.5, 'parameter counts', { size: 15 })}
</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <marker id="a-b" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto" markerUnits="userSpaceOnUse">
    <path d="M1,1.5 L9,6 L1,10.5" fill="none" stroke="${C.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </marker>
  <filter id="a-sh" x="-10%" y="-10%" width="120%" height="125%">
    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.18" />
  </filter>
</defs>
${judge}
${hidden}
${bottleneck}
</svg>`;

writeFileSync(OUT, svg);
console.log('✓ Written audits.svg');
