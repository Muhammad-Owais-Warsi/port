import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Coordinates follow the reference image; viewBox crops to the content.
const VB = { x: 66, y: 22, w: 850, h: 246 };

const C = {
    card: '#f3f4f5',
    cardBorder: '#d9dcdf',
    modelBorder: '#9aa3ab',
    modelHead: '#cfd5da',
    modelBody: '#f1f3f4',
    text: '#1f2933',
    muted: '#6b7580',
    blue: '#1f6fa8',
    pink: '#c93b6b',
    pill: '#dfe3e6',
    cell: '#cdd2d7',
};

const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const MONO = "'Fira Code', Consolas, 'Courier New', monospace";

function grid({ x, y, label, marks }) {
    const cell = 8, gap = 2;
    let out = `<text x="${x + 4}" y="${y - 10}" font-family="${SANS}" font-size="12.5" fill="${C.muted}" dominant-baseline="central">${label}</text>`;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
            const m = marks.find((k) => k[0] === r && k[1] === c);
            out += `<rect x="${x + c * (cell + gap)}" y="${y + r * (cell + gap)}" width="${cell}" height="${cell}" rx="1" fill="${m ? m[2] : C.cell}" />`;
        }
    }
    return out;
}

const gray = 'stroke="currentColor" stroke-opacity="0.55"';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" width="${VB.w}" height="${VB.h}">
<defs>
  <marker id="ah-g" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
    <path d="M1,1 L7,4 L1,7" fill="none" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </marker>
  <marker id="ah-b" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
    <path d="M1,1 L8,5 L1,9" fill="none" stroke="${C.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </marker>
  <filter id="sh" x="-10%" y="-10%" width="120%" height="125%">
    <feDropShadow dx="0" dy="2" stdDeviation="2
" flood-color="#000" flood-opacity="0.18" />
  </filter>
</defs>

<!-- Task prompt: Task top -> LLM agent -->
<path d="M161,102 V70 Q161,56 175,56 H340" fill="none" ${gray} stroke-width="2" stroke-linecap="round" marker-end="url(#ah-g)" />
<text x="252" y="43" font-family="${SANS}" font-size="14.5" fill="currentColor" fill-opacity="0.7" text-anchor="middle" dominant-baseline="central">Task prompt</text>

<!-- LLM agent -->
<rect x="348" y="36" width="132" height="36" rx="18" fill="${C.pill}" />
<text x="414" y="54" font-family="${SANS}" font-size="17" font-weight="700" fill="#454e57" text-anchor="middle" dominant-baseline="central">LLM agent</text>

<!-- Feedback: Metric top -> LLM agent -->
<path d="M833,102 V70 Q833,56 819,56 H488" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round" marker-end="url(#ah-b)" />
<text x="536" y="43" font-family="${SANS}" font-size="14.5" font-weight="700" fill="${C.blue}" dominant-baseline="central">Performance guides the next revision</text>

<!-- No training badge + writes label + arrow -->
<rect x="268" y="77" width="136" height="24" rx="12" fill="${C.pink}" />
<text x="336" y="89.5" font-family="${SANS}" font-size="13.5" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">No training allowed</text>
<text x="422" y="89.5" font-family="${SANS}" font-size="13.5" font-weight="700" fill="${C.blue}" dominant-baseline="central">Writes every weight</text>
<line x1="414" y1="86" x2="414" y2="103" stroke="${C.blue}" stroke-width="2.5" stroke-linecap="round" marker-end="url(#ah-b)" />

<!-- Task card -->
<rect x="82" y="102" width="158" height="153" rx="9" fill="${C.card}" stroke="${C.cardBorder}" stroke-width="1.5" filter="url(#sh)" />
<text x="161" y="165" font-family="${SANS}" font-size="17" font-weight="700" fill="${C.text}" text-anchor="middle" dominant-baseline="central">Task</text>
<text x="161" y="191" font-family="${SANS}" font-size="14" fill="${C.muted}" text-anchor="middle" dominant-baseline="central">Input <tspan font-style="italic">x</tspan>, target <tspan font-style="italic">y</tspan></text>

<line x1="244" y1="182" x2="254" y2="182" ${gray} stroke-width="2" stroke-linecap="round" marker-end="url(#ah-g)" />

<!-- Model card -->
<rect x="253" y="104" width="322" height="151" rx="7" fill="${C.modelBody}" stroke="${C.modelBorder}" stroke-width="1.5" filter="url(#sh)" />
<path d="M253,128 V111 Q253,104 260,104 H568 Q575,104 575,111 V128 Z" fill="${C.modelHead}" />
<text x="414" y="116.5" font-family="${SANS}" font-size="14" font-weight="700" fill="${C.text}" text-anchor="middle" dominant-baseline="central">Model: weights written as code</text>

<g font-family="${MONO}" font-size="13" fill="${C.text}" dominant-baseline="central">
  <text x="271" y="143">def write_weights(model):</text>
  <text x="283" y="161" fill="${C.pink}" text-decoration="line-through">optimizer.step()</text>
  <text x="283" y="179">model.layer1[0, 3] = <tspan fill="${C.blue}">1.0</tspan></text>
  <text x="283" y="197">model.layer1[1, 0] = <tspan fill="${C.pink}">-4.0</tspan></text>
  <text x="283" y="215">model.layer2[0, 1] = <tspan fill="${C.blue}">2.5</tspan></text>
  <text x="283" y="233">model.layer2[2, 4] = <tspan fill="${C.pink}">-1.5</tspan></text>
</g>
${grid({ x: 506, y: 156, label: 'Layer 1', marks: [[0, 3, C.blue], [1, 0, C.pink]] })}
${grid({ x: 506, y: 213, label: 'Layer 2', marks: [[0, 1, C.blue], [2, 4, C.pink]] })}

<line x1="580" y1="182" x2="598" y2="182" ${gray} stroke-width="2" stroke-linecap="round" marker-end="url(#ah-g)" />

<!-- Fixed evaluator -->
<rect x="600" y="102" width="144" height="153" rx="9" fill="${C.card}" stroke="${C.cardBorder}" stroke-width="1.5" filter="url(#sh)" />
<text x="672" y="160" font-family="${SANS}" font-size="16.5" font-weight="700" fill="${C.text}" text-anchor="middle" dominant-baseline="central">Fixed evaluator</text>
<text x="672" y="185" font-family="${SANS}" font-size="14" fill="${C.muted}" text-anchor="middle" dominant-baseline="central">Compares the</text>
<text x="672" y="203" font-family="${SANS}" font-size="14" fill="${C.muted}" text-anchor="middle" dominant-baseline="central">output with <tspan font-style="italic">y</tspan></text>

<line x1="750" y1="182" x2="768" y2="182" ${gray} stroke-width="2" stroke-linecap="round" marker-end="url(#ah-g)" />

<!-- Performance metric -->
<rect x="772" y="102" width="122" height="153" rx="9" fill="${C.card}" stroke="${C.cardBorder}" stroke-width="1.5" filter="url(#sh)" />
<text x="833" y="127" font-family="${SANS}" font-size="16.5" font-weight="700" fill="${C.text}" text-anchor="middle" dominant-baseline="central">Performance</text>
<text x="833" y="146" font-family="${SANS}" font-size="16.5" font-weight="700" fill="${C.text}" text-anchor="middle" dominant-baseline="central">metric</text>
<path d="M802,208 H822 V192 H843 V176 H864 V162" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linejoin="miter" />
<circle cx="865" cy="160" r="4.5" fill="${C.blue}" />
<line x1="800" y1="221" x2="868" y2="221" stroke="${C.cardBorder}" stroke-width="1.5" />
</svg>`;

writeFileSync(resolve(__dirname, '../src/content/blog/iWSP/iwsp-loop.svg'), svg, 'utf-8');
console.log('✓ Written iwsp-loop.svg');
