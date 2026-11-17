/**
 * The things in the footer pile: what I reach for off the clock.
 * Line drawings on the page's own ink, so they follow the theme.
 *
 * w/h are the drawn size; `r` makes the body a circle, otherwise it is a
 * rounded box (bodyW/bodyH when the body should be slimmer than the drawing).
 */
export type PileItemDef = {
  id: string;
  w: number;
  h: number;
  r?: number;
  bodyW?: number;
  bodyH?: number;
  chamfer?: number;
  /** left out on narrow screens */
  roomy?: boolean;
  svg: string;
};

const S = `fill="var(--pile-fill)" stroke="var(--pile-ink)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
const L = `fill="none" stroke="var(--pile-ink)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"`;
const svg = (w: number, h: number, body: string) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

export const PILE_ITEMS: PileItemDef[] = [
  {
    id: "brick",
    w: 98,
    h: 56,
    chamfer: 4,
    svg: svg(
      98,
      56,
      `<rect x="11" y="3" width="16" height="12" rx="2.5" ${S}/><rect x="31" y="3" width="16" height="12" rx="2.5" ${S}/><rect x="51" y="3" width="16" height="12" rx="2.5" ${S}/><rect x="71" y="3" width="16" height="12" rx="2.5" ${S}/><rect x="2" y="13" width="94" height="41" rx="4" ${S}/><path d="M10 22h78" ${L} opacity=".45"/>`
    ),
  },
  {
    id: "mug",
    w: 72,
    h: 62,
    chamfer: 8,
    bodyW: 54,
    svg: svg(
      72,
      62,
      `<path d="M50 22h7a11 11 0 0 1 0 22h-7" ${S}/><path d="M4 8h48v38a12 12 0 0 1-12 12H16A12 12 0 0 1 4 46z" ${S}/><path d="M11 17h34" ${L}/><path d="M12 24c4 2 6-2 10 0s6-2 10 0 6-2 10 0" ${L} opacity=".55"/>`
    ),
  },
  {
    id: "tea",
    w: 46,
    h: 68,
    chamfer: 8,
    svg: svg(
      46,
      68,
      `<path d="M9 3h28c0 12-7 16-7 25s9 12 9 22c0 8-6 14-16 14S7 58 7 50c0-10 9-13 9-22S9 15 9 3z" ${S}/><path d="M13 12h20M12 46c4-3 8 2 11 0s7-3 11 0" ${L} opacity=".6"/>`
    ),
  },
  {
    id: "camera",
    w: 100,
    h: 72,
    chamfer: 9,
    svg: svg(
      100,
      72,
      `<rect x="32" y="3" width="30" height="14" rx="3" ${S}/><rect x="3" y="14" width="94" height="55" rx="9" ${S}/><circle cx="50" cy="42" r="19" ${S}/><circle cx="50" cy="42" r="10" ${L}/><path d="M44 37a8 8 0 0 1 6-3" ${L} opacity=".6"/><rect x="74" y="22" width="14" height="8" rx="2" ${L}/><circle cx="15" cy="26" r="2.5" ${L}/>`
    ),
  },
  {
    id: "disc",
    w: 78,
    h: 78,
    r: 37,
    svg: svg(
      78,
      78,
      `<circle cx="39" cy="39" r="36" ${S}/><circle cx="39" cy="39" r="13" ${L}/><circle cx="39" cy="39" r="4.5" ${S}/><path d="M14 30a27 27 0 0 1 16-16M64 48a27 27 0 0 1-16 16" ${L} opacity=".55"/>`
    ),
  },
  {
    id: "notebook",
    w: 74,
    h: 94,
    chamfer: 6,
    svg: svg(
      74,
      94,
      `<rect x="9" y="3" width="62" height="88" rx="6" ${S}/><path d="M24 26h34M24 38h34M24 50h22" ${L} opacity=".6"/><path d="M4 16h11M4 30h11M4 44h11M4 58h11M4 72h11" ${L}/>`
    ),
  },
  {
    id: "keycap",
    w: 58,
    h: 58,
    chamfer: 11,
    svg: svg(
      58,
      58,
      `<rect x="3" y="3" width="52" height="52" rx="11" ${S}/><rect x="10" y="8" width="38" height="36" rx="7" ${L}/><text x="29" y="31" text-anchor="middle" font-family="var(--font-mono), monospace" font-size="11" fill="var(--pile-ink)">esc</text>`
    ),
  },
  {
    id: "palette",
    w: 96,
    h: 74,
    chamfer: 30,
    bodyW: 86,
    bodyH: 62,
    roomy: true,
    svg: svg(
      96,
      74,
      `<path d="M49 4C24 4 4 19 4 39s17 31 39 31c9 0 9-7 5-11s-1-11 8-11h14c12 0 22-6 22-17C92 15 73 4 49 4z" ${S}/><circle cx="26" cy="28" r="6" ${L}/><circle cx="46" cy="18" r="6" ${L}/><circle cx="68" cy="22" r="6" ${L}/><circle cx="22" cy="48" r="5" ${L}/>`
    ),
  },
  {
    id: "pencil",
    w: 168,
    h: 18,
    chamfer: 6,
    bodyH: 13,
    roomy: true,
    svg: svg(
      168,
      18,
      `<path d="M3 9l22-6.5h116v13H25z" ${S}/><path d="M25 2.5v13M11 6.6v4.8" ${L}/><rect x="141" y="2.5" width="9" height="13" ${S}/><rect x="150" y="2.5" width="15" height="13" rx="3.5" ${S}/><path d="M32 9h102" ${L} opacity=".4"/>`
    ),
  },
];
