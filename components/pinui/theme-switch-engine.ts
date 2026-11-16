/* Vendored from Pin UI — https://www.pinui.xyz/components/theme-switch (registry: /r/theme-switch.json). */
/**
 * The Theme Switch's engine — three ways to switch a theme.
 *
 * DROPLET
 * A drop of the next theme's colour falls from the top of the scene onto the
 * icon on real kinematics (s = v0·t + ½·g·t²), stretching with its speed
 * while keeping its volume. It squashes on impact, the button dips and
 * springs back, ripples spread, and the next theme floods out from the point
 * of impact as a circle.
 *
 * RAIN
 * Rain of the next theme's colour falls at terminal velocity, slanted by
 * wind, with depth: near drops faster, longer and brighter. Every drop
 * splashes (a crown of droplets under gravity, a ripple on dry ground), and
 * near drops leave a puddle that spreads like liquid wetting a surface. The
 * shower builds, the puddles merge, and the last merge is computed rather
 * than guessed: the puddles are scaled by exactly what closes the largest
 * dry gap left.
 *
 * DIWALI
 * Rockets of the next theme's colour fly out from behind the toggle in every
 * direction with spark trails and a whistle, burst into peonies and tilted
 * rings under air drag and gravity (solved in closed form, so frame-rate
 * independent), and the stars settle and bloom into dots that fill the
 * scene. Every dot's final place is known at click time, so full coverage is
 * a guarantee. Whistle, boom (a beat after the flash) and crackle are
 * synthesised with Web Audio and panned to where each shell bursts.
 *
 * Everything happens inside the component's own box. The next theme is
 * painted under the controls, and each control (the toggle, and anything
 * marked data-pts-target) takes the new theme the moment the flood reaches its
 * centre — so it changes "when the rain hits it". When the scene is covered,
 * the scene itself commits. Reduced motion switches at once; a watchdog
 * finishes any run that stalls (a tab put in the background), so a switch can
 * never hang half done.
 */

export type ThemeName = "light" | "dark";
export type EffectName = "droplet" | "rain" | "diwali";

export type ThemeSwitchEngine = {
  /** Switch with the current effect; resolves once the scene has taken the next theme. */
  toggle: () => void;
  /** Warm the Diwali plan and the audio device before the click that needs them. */
  prepare: () => void;
  busy: () => boolean;
  destroy: () => void;
};

type Options = {
  root: HTMLElement;
  button: HTMLButtonElement;
  fx: HTMLElement;
  effect: () => EffectName;
  sound: () => boolean;
  /** The moment the scene is fully covered by the next theme. */
  onCommit: (theme: ThemeName) => void;
};

/* Site change: backgrounds match --background in app/globals.css (pinui ships #ffffff / #141414). */
const THEMES: Record<ThemeName, { bg: string; ring: string }> = {
  light: { bg: "#fcfcfb", ring: "rgba(0, 0, 0, 0.10)" },
  dark: { bg: "#0a0a0a", ring: "rgba(255, 255, 255, 0.10)" },
};

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_DRAWER = "cubic-bezier(0.32, 0.72, 0, 1)";
/* the longest real run is ~2.4s (Diwali in a large scene) */
const WATCHDOG_MS = 5000;

/* ── utils ─────────────────────────────────────────────────────────────── */

const noop = () => {};
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const finished = (anim: Animation) => anim.finished.then(noop, noop);
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

/* "#rrggbb" at zero alpha: fading to "transparent" fades through black in some engines */
function transparentOf(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0)`;
}

/* a damped harmonic oscillator sampled into a CSS linear() easing */
function springLinear(durationS: number, bounce: number) {
  const zeta = 1 - bounce;
  const omega = (2 * Math.PI) / durationS;
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const pts: string[] = [];
  for (let i = 0, n = 48; i <= n; i++) {
    const t = (durationS * i) / n;
    const x =
      1 -
      Math.exp(-zeta * omega * t) *
        (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
    pts.push(i === n ? "1" : x.toFixed(4));
  }
  return `linear(${pts.join(", ")})`;
}

const SPRING_MS = 520;

/* ── shared puddle maths (Rain and Diwali) ─────────────────────────────── */

type Lobe = { dx: number; dy: number; s: number };
type Spot = {
  x: number;
  y: number;
  born: number;
  r0: number;
  rmax: number;
  lobes: Lobe[];
  tau?: number;
  creep?: number;
};
type Target = { el: HTMLElement; x: number; y: number; done: boolean };

const RAIN = {
  spawnMs: 900, // how long new drops keep entering
  windDeg: 9, // slant from vertical
  puddleArea: 85 * 85, // about one surface-wetting drop per this many px²
  minPuddles: 30,
  maxPuddles: 170,
  ambientRatio: 1.4, // far drops per wetting drop
  spreadTauMs: 260, // how fast a wet spot spreads
  creepPxPerS: 14, // the slow spread after the splash
  mergeMs: 460,
  splashGravity: 2400,
  rippleMs: 420,
  tailMs: 380, // the last splashes settle after the switch
};

function puddleBase(p: Spot, t: number) {
  const age = Math.max(0, t - p.born);
  const tau = p.tau || RAIN.spreadTauMs;
  const creep = p.creep != null ? p.creep : RAIN.creepPxPerS;
  return (
    p.r0 + (p.rmax - p.r0) * (1 - Math.exp(-age / tau)) + (creep * age) / 1000
  );
}

/*
 * The smallest uniform scale k at which the spots' main circles cover every
 * pixel. Cell centres are sampled with half a cell's diagonal added to each
 * distance, which makes it a bound for every pixel in the cell rather than an
 * estimate. Spots are bucketed and the search stops once no farther bucket
 * could do better, so it is exact without being slow.
 */
function coverageScale(spots: Spot[], t: number, w: number, h: number) {
  const n = spots.length;
  if (!n) return 1;
  const cell = Math.max(40, Math.max(w, h) / 48);
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const half = Math.hypot(w / cols, h / rows) / 2;
  const bases = new Array<number>(n);
  let maxBase = 0;
  for (let i = 0; i < n; i++) {
    bases[i] = puddleBase(spots[i], t);
    if (bases[i] > maxBase) maxBase = bases[i];
  }
  const B = cell * 2;
  const nx = Math.max(1, Math.ceil(w / B));
  const ny = Math.max(1, Math.ceil(h / B));
  const buckets: number[][] = Array.from({ length: nx * ny }, () => []);
  for (let i = 0; i < n; i++) {
    /* a spot outside the scene joins the edge bucket: it is only ever farther than that */
    const bx = clamp(Math.floor(spots[i].x / B), 0, nx - 1);
    const by = clamp(Math.floor(spots[i].y / B), 0, ny - 1);
    buckets[by * nx + bx].push(i);
  }
  const maxRing = Math.max(nx, ny);
  let worst = 1;
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const x = ((ix + 0.5) * w) / cols;
      const y = ((iy + 0.5) * h) / rows;
      const cbx = clamp(Math.floor(x / B), 0, nx - 1);
      const cby = clamp(Math.floor(y / B), 0, ny - 1);
      let best = Infinity;
      for (let r = 0; r <= maxRing; r++) {
        if (r >= 1 && ((r - 1) * B + half) / maxBase >= best) break;
        for (let gy = cby - r; gy <= cby + r; gy++) {
          if (gy < 0 || gy >= ny) continue;
          for (let gx = cbx - r; gx <= cbx + r; gx++) {
            if (gx < 0 || gx >= nx) continue;
            if (Math.max(Math.abs(gx - cbx), Math.abs(gy - cby)) !== r)
              continue;
            for (const q of buckets[gy * nx + gx]) {
              const need =
                (Math.hypot(x - spots[q].x, y - spots[q].y) + half) / bases[q];
              if (need < best) best = need;
            }
          }
        }
      }
      if (best > worst) worst = best;
    }
  }
  return worst * 1.01;
}

/* ── Diwali's closed-form stars ────────────────────────────────────────── */

const DIWALI = {
  launchGapMs: 45,
  minBurstDist: 110, // no shell bursts right on top of the toggle
  dragK: 2.4, // 1/s air drag
  gravity: 40, // a gentle droop as stars slow
  bloomTauMs: 420,
  settleMs: 300,
  mergeMs: 440,
  trailSparksPerS: 110,
};

type Star = {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  born: number;
  r0: number;
  rmax: number;
};
type Shell = {
  x0: number;
  y0: number;
  tx: number;
  ty: number;
  launch: number;
  flight: number;
  burst: number;
  kind: "ring" | "peony";
  crackle: boolean;
  speed: number;
  curve: number;
  launched: boolean;
  burstDone: boolean;
  stars: Star[];
  sparkDebt: number;
  prevPos: { x: number; y: number } | null;
};
type DiwaliPlan = {
  shells: Shell[];
  stars: Star[];
  ignition: Spot;
  scale: number;
  mergeStart: number;
  mergeK: number;
};

/*
 * Under air drag (dv/dt = −k·v + g) a star's path has a closed form:
 * v(t) = g/k + (v0 − g/k)·e^(−kt)
 * s(t) = (g/k)·t + (v0 − g/k)·(1 − e^(−kt))/k
 * so where every star is at any moment is known exactly.
 */
function starPos(d: Star, t: number) {
  const age = Math.max(0, (t - d.born) / 1000);
  const k = DIWALI.dragK;
  const g = DIWALI.gravity;
  const e = 1 - Math.exp(-k * age);
  return {
    x: d.x0 + (d.vx / k) * e,
    y: d.y0 + (g / k) * age + ((d.vy - g / k) * e) / k,
  };
}

function dotRadius(d: Star, t: number) {
  const age = Math.max(0, t - d.born);
  return d.r0 + (d.rmax - d.r0) * (1 - Math.exp(-age / DIWALI.bloomTauMs));
}

function makeStars(s: Shell, scale: number, cellR: number): Star[] {
  const stars: Star[] = [];
  const count = Math.round((s.kind === "ring" ? 110 : 140) * Math.sqrt(scale));
  const tilt = rand(0, Math.PI);
  const squash = rand(0.45, 0.8);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand(-0.06, 0.06);
    let v: number;
    if (s.kind === "ring") {
      v = s.speed * (i % 3 ? rand(0.96, 1.04) : Math.sqrt(Math.random()));
    } else if (i % 2) {
      /* a spherical shell seen head-on: stars bunch toward the rim, like the real thing */
      const c = rand(-1, 1);
      v = s.speed * Math.sqrt(1 - c * c) * rand(0.9, 1.05);
    } else {
      /* the other half fills the disc evenly, so a shell leaves a solid patch, not a hollow ring */
      v = s.speed * Math.sqrt(Math.random()) * rand(0.95, 1.05);
    }
    let vx = Math.cos(a) * v;
    let vy = Math.sin(a) * v;
    if (s.kind === "ring" && i % 3) {
      /* most of a ring shell forms the tilted ring; a third fills inside it */
      const rx = vx;
      const ry = vy * squash;
      vx = rx * Math.cos(tilt) - ry * Math.sin(tilt);
      vy = rx * Math.sin(tilt) + ry * Math.cos(tilt);
    }
    stars.push({
      x0: s.tx,
      y0: s.ty,
      vx,
      vy,
      born: s.burst,
      r0: 1.4 * Math.min(1.3, scale + 0.2),
      /* settled stars bloom into dots big enough to overlap their neighbours */
      rmax: cellR * 0.17 * rand(0.75, 1.25),
    });
  }
  return stars;
}

function planDiwali(
  w: number,
  h: number,
  origin: { x: number; y: number }
): DiwaliPlan {
  const scale = clamp(Math.sqrt((w * h) / (1280 * 800)), 0.7, 1.3);
  /* one shell per cell of a full grid: no empty cells, so no bare regions */
  const target = clamp(Math.round((w * h) / 110000), 6, 14);
  const cols = Math.max(2, Math.round(Math.sqrt((target * w) / h)));
  const rows = Math.max(2, Math.round(target / cols));
  const cw = w / cols;
  const ch = h / rows;
  const cellR = Math.sqrt(cw * ch) / 2;
  /* past the cell's corners, so neighbouring shells overlap even with jitter */
  const reach = (1.25 * Math.hypot(cw, ch)) / 2;
  const minDist = DIWALI.minBurstDist * scale;

  const pts: { x: number; y: number; d: number }[] = [];
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      let x = (gx + 0.5 + rand(-0.28, 0.28)) * cw;
      let y = (gy + 0.5 + rand(-0.28, 0.28)) * ch;
      let d = Math.hypot(x - origin.x, y - origin.y);
      if (d < minDist) {
        const a =
          d > 0.001
            ? Math.atan2(y - origin.y, x - origin.x)
            : rand(0, Math.PI * 2);
        x = origin.x + Math.cos(a) * minDist;
        y = origin.y + Math.sin(a) * minDist;
        d = minDist;
      }
      pts.push({ x, y, d });
    }
  }
  /* nearest first: the show radiates out from the toggle like a wave */
  pts.sort((a, b) => a.d - b.d);

  const shells: Shell[] = pts.map((p, i) => {
    const launch = i * DIWALI.launchGapMs + rand(0, 25);
    const flight = clamp(240 + p.d * 0.5, 300, 640);
    return {
      x0: origin.x,
      y0: origin.y,
      tx: p.x,
      ty: p.y,
      launch,
      flight,
      burst: launch + flight,
      kind: i % 4 === 3 ? "ring" : "peony",
      crackle: Math.random() < 0.3,
      speed: reach * DIWALI.dragK * rand(0.92, 1.08), // a star's reach is v/k
      curve: rand(-0.12, 0.12) * p.d, // rockets arc a little, never ruler-straight
      launched: false,
      burstDone: false,
      stars: [],
      sparkDebt: 0,
      prevPos: null,
    };
  });

  const stars: Star[] = [];
  for (const s of shells) {
    s.stars = makeStars(s, scale, cellR);
    stars.push(...s.stars);
  }

  /* the launcher's own ignition: a ring of the new theme round the 54px toggle, so it switches as it fires */
  const ignition: Spot = {
    x: origin.x,
    y: origin.y,
    born: 0,
    r0: 28,
    rmax: 52 * Math.max(1, scale),
    tau: 160,
    creep: 0,
    lobes: [],
  };

  const lastBurst = shells.reduce((m, s) => Math.max(m, s.burst), 0);
  const mergeStart = lastBurst + DIWALI.settleMs;
  const tEnd = mergeStart + DIWALI.mergeMs;

  /* where every dot ends, and how big: exact, so the merge is a guarantee */
  const final: Spot[] = stars.map((d) => {
    const p = starPos(d, tEnd);
    const r = dotRadius(d, tEnd);
    return {
      x: p.x,
      y: p.y,
      born: 0,
      r0: r,
      rmax: r,
      tau: 1,
      creep: 0,
      lobes: [],
    };
  });
  final.push(ignition);
  const mergeK = Math.max(1, coverageScale(final, tEnd, w, h));
  return { shells, stars, ignition, scale, mergeStart, mergeK };
}

/* one anti-aliased disc, drawn once and stamped per star: ~1,000 quads are far cheaper than ~1,000 arcs */
function makeDotSprite(color: string) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d")!;
  x.fillStyle = color;
  x.beginPath();
  x.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  x.fill();
  return c;
}

/* ── sound: Web Audio, no files ────────────────────────────────────────── */

function createSound(enabled: () => boolean) {
  let ac: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;

  function ensure(): AudioContext | null {
    if (!enabled()) return null;
    try {
      if (!ac) {
        const AC =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AC) return null;
        ac = new AC();
        master = ac.createGain();
        master.gain.value = 0.5;
        const comp = ac.createDynamicsCompressor();
        comp.threshold.value = -16;
        comp.knee.value = 12;
        comp.ratio.value = 5;
        master.connect(comp);
        comp.connect(ac.destination);
        const len = ac.sampleRate * 2;
        noise = ac.createBuffer(1, len, ac.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      }
      if (ac.state === "suspended") void ac.resume();
      return ac;
    } catch {
      return null;
    }
  }

  function out(pan: number): AudioNode {
    /* the types say every engine has a panner; older Safari did not */
    if (
      typeof (ac as AudioContext & { createStereoPanner?: unknown })
        .createStereoPanner === "function"
    ) {
      const p = ac!.createStereoPanner();
      p.pan.value = clamp(pan, -1, 1);
      p.connect(master!);
      return p;
    }
    return master!;
  }

  function noiseSource(when: number, offset: number, dur: number) {
    const s = ac!.createBufferSource();
    s.buffer = noise;
    s.start(when, offset);
    s.stop(when + dur);
    return s;
  }

  function env(
    param: AudioParam,
    when: number,
    peak: number,
    attack: number,
    release: number
  ) {
    param.setValueAtTime(0.0001, when);
    param.linearRampToValueAtTime(peak, when + attack);
    param.exponentialRampToValueAtTime(0.0001, when + attack + release);
  }

  return {
    unlock: ensure,
    /* a rising whistle and hiss for the flight */
    launch(durS: number, pan: number) {
      const a = ensure();
      if (!a) return;
      try {
        const now = a.currentTime;
        const o = out(pan * 0.5);
        const osc = a.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + durS);
        const g = a.createGain();
        env(g.gain, now, 0.035, 0.06, durS);
        osc.connect(g).connect(o);
        osc.start(now);
        osc.stop(now + durS + 0.1);
        const hiss = noiseSource(now, Math.random(), durS + 0.1);
        const bp = a.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 3000;
        bp.Q.value = 0.8;
        const hg = a.createGain();
        env(hg.gain, now, 0.05, 0.03, durS);
        hiss.connect(bp).connect(hg).connect(o);
      } catch {
        /* a sound that cannot play is no reason to stop the show */
      }
    },
    /* the boom: a noise body and a low thump, a beat after the flash, as sound is slower than light */
    boom(pan: number, size: number, delayS: number) {
      const a = ensure();
      if (!a) return;
      try {
        const when = a.currentTime + delayS;
        const o = out(pan);
        const body = noiseSource(when, Math.random() * 0.6, 1.3);
        const lp = a.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(2600, when);
        lp.frequency.exponentialRampToValueAtTime(160, when + 0.9);
        const bg = a.createGain();
        env(bg.gain, when, 0.75 * size, 0.004, 1.1);
        body.connect(lp).connect(bg).connect(o);
        const thump = a.createOscillator();
        thump.type = "sine";
        thump.frequency.setValueAtTime(120, when);
        thump.frequency.exponentialRampToValueAtTime(38, when + 0.3);
        const tg = a.createGain();
        env(tg.gain, when, 0.8 * size, 0.003, 0.35);
        thump.connect(tg).connect(o);
        thump.start(when);
        thump.stop(when + 0.45);
      } catch {
        /* as above */
      }
    },
    /* crackle: a scatter of tiny high-passed clicks as stars pop */
    crackle(pan: number, delayS: number, count: number) {
      const a = ensure();
      if (!a) return;
      try {
        const hp = a.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 2200;
        hp.connect(out(pan));
        for (let i = 0; i < count; i++) {
          const when = a.currentTime + delayS + rand(0.35, 0.95);
          const s = noiseSource(when, Math.random() * 1.8, 0.03);
          const g = a.createGain();
          env(g.gain, when, rand(0.12, 0.3), 0.002, 0.018);
          s.connect(g).connect(hp);
        }
      } catch {
        /* as above */
      }
    },
    dispose() {
      void ac?.close().catch(noop);
      ac = null;
    },
  };
}

/* ── the engine ────────────────────────────────────────────────────────── */

export function createThemeSwitch({
  root,
  button,
  fx,
  effect,
  sound: soundOn,
  onCommit,
}: Options): ThemeSwitchEngine {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const supportsLinear = CSS.supports(
    "transition-timing-function",
    "linear(0, 1)"
  );
  const springEase = supportsLinear
    ? springLinear(SPRING_MS / 1000, 0.3)
    : EASE_OUT;
  const Sound = createSound(soundOn);

  let busy = false;
  let runId = 0;
  let destroyed = false;
  /* effect-specific teardown, run when a switch ends or is cut short */
  const cleanups: (() => void)[] = [];
  /* the layers an effect paints under the controls */
  const layers = new Set<HTMLElement>();

  const currentTheme = (): ThemeName =>
    root.dataset.theme === "dark" ? "dark" : "light";
  const size = () => ({ w: root.clientWidth, h: root.clientHeight });

  /* a point in the scene's own coordinates */
  function centreOf(el: Element) {
    const o = root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - o.left + r.width / 2,
      y: r.top - o.top + r.height / 2,
    };
  }

  function commit(next: ThemeName) {
    root.dataset.theme = next;
    updateLabel();
    onCommit(next);
  }

  function updateLabel() {
    button.setAttribute(
      "aria-label",
      `Switch to ${currentTheme() === "dark" ? "light" : "dark"} theme`
    );
  }

  function pressButton(depth: number) {
    const s = 1 - depth;
    const down = button.animate(
      [{ transform: "scale(1)" }, { transform: `scale(${s})` }],
      {
        duration: 90,
        easing: EASE_OUT,
        fill: "forwards",
      }
    );
    return finished(down).then(() => {
      const up = button.animate(
        [{ transform: `scale(${s})` }, { transform: "scale(1)" }],
        {
          duration: SPRING_MS,
          easing: springEase,
          fill: "forwards",
        }
      );
      down.cancel();
      return finished(up).then(() => up.cancel());
    });
  }

  /* a canvas the size of the scene; under the controls unless it is put in the fx layer */
  function makeCanvas(className: string, over = false) {
    const { w, h } = size();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.className = className;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    if (over) fx.appendChild(canvas);
    else {
      root.insertBefore(canvas, root.firstChild);
      layers.add(canvas);
    }
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { canvas, ctx, w, h };
  }

  /* the controls that take the next theme when the flood reaches them */
  function floodTargets(): Target[] {
    const els = [
      button,
      /* Site change: Array.from, since this project compiles to an ES5 target. */
      ...Array.from(root.querySelectorAll<HTMLElement>("[data-pts-target]")),
    ];
    return els.map((el) => ({ el, ...centreOf(el), done: false }));
  }

  function releaseTargets(targets: Target[]) {
    for (const tg of targets) tg.el.removeAttribute("data-theme");
  }

  /* ─ droplet ─ */

  const DROP = {
    gravity: 4000, // px/s²: a ~350px fall reads in about 0.35s
    entryVelocity: 250, // already falling as it enters
    maxStretch: 0.2,
    stretchPerVelocity: 1 / 10000,
    w: 22,
    h: 30,
    squashMs: 220,
    floodDelayMs: 50,
    floodMs: 800,
    rippleMs: 900,
    rippleStaggerMs: 120,
  };

  let dropId = 0;
  function createDrop(color: string) {
    const el = document.createElement("div");
    el.className = "pts__drop";
    const body =
      "M12 0.5C12 0.5 2 12.6 2 21a10 10 0 0 0 20 0C22 12.6 12 0.5 12 0.5Z";
    const shade = `pts-drop-shade-${++dropId}`;
    el.innerHTML =
      '<svg viewBox="0 0 24 32" aria-hidden="true">' +
      `<defs><linearGradient id="${shade}" x1="0" y1="0" x2="1" y2="1">` +
      '<stop offset="0.45" stop-color="#000" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity="0.25"/>' +
      "</linearGradient></defs>" +
      `<path d="${body}" fill="${color}"/>` +
      `<path d="${body}" fill="url(#${shade})" opacity="0.5"/>` +
      '<ellipse cx="8.2" cy="20" rx="2" ry="3.6" transform="rotate(18 8.2 20)" fill="#fff" opacity="0.35"/>' +
      "</svg>";
    return el;
  }

  function fallKeyframes(cy: number) {
    const distance = cy + 8;
    const g = DROP.gravity;
    const v0 = DROP.entryVelocity;
    const T = (-v0 + Math.sqrt(v0 * v0 + 2 * g * distance)) / g; // s(T) = distance
    const frames: Keyframe[] = [];
    let lastSy = 1;
    for (let i = 0, steps = 30; i <= steps; i++) {
      const t = (T * i) / steps;
      const s = v0 * t + 0.5 * g * t * t;
      const sy =
        1 + Math.min(DROP.maxStretch, (v0 + g * t) * DROP.stretchPerVelocity);
      const sx = 1 / Math.sqrt(sy);
      lastSy = sy;
      frames.push({
        offset: i / steps,
        transform: `translateY(${(s - distance).toFixed(
          2
        )}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
      });
    }
    return { frames, durationMs: T * 1000, impactScaleY: lastSy };
  }

  function squash(drop: HTMLElement, sy: number) {
    return drop.animate(
      [
        {
          transform: `translateY(0) scale(${1 / Math.sqrt(sy)}, ${sy})`,
          opacity: 1,
        },
        {
          transform: "translateY(0) scale(1.55, 0.5)",
          opacity: 1,
          offset: 0.3,
        },
        { transform: "translateY(0) scale(2.4, 0.12)", opacity: 0 },
      ],
      { duration: DROP.squashMs, easing: EASE_OUT, fill: "forwards" }
    );
  }

  function ripples(cx: number, cy: number, color: string) {
    const all: Promise<void>[] = [];
    for (let i = 0; i < 2; i++) {
      const ring = document.createElement("div");
      ring.className = "pts__ripple";
      ring.style.left = `${cx}px`;
      ring.style.top = `${cy}px`;
      ring.style.color = color;
      fx.appendChild(ring);
      all.push(
        finished(
          ring.animate(
            [
              { transform: "scale(1.1)", opacity: 1 },
              { transform: `scale(${5 + i * 2.5})`, opacity: 0 },
            ],
            {
              duration: DROP.rippleMs,
              delay: i * DROP.rippleStaggerMs,
              easing: EASE_OUT,
              fill: "both",
            }
          )
        )
      );
    }
    return Promise.all(all);
  }

  /*
   * The flood: a circle of the next theme opening from the impact under the
   * controls, on the drawer curve. The compositor runs the clip; each frame
   * the circle's actual radius is read back from the animation, and a control
   * takes the new theme the moment the circle reaches its centre.
   */
  function circleFlood(next: ThemeName, cx: number, cy: number, id: number) {
    const { w, h } = size();
    const R =
      Math.ceil(Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy))) + 2;
    const overlay = document.createElement("div");
    overlay.className = "pts__flood";
    overlay.style.background = THEMES[next].bg;
    root.insertBefore(overlay, root.firstChild);
    layers.add(overlay);
    const targets = floodTargets();
    cleanups.push(() => releaseTargets(targets));
    const anim = overlay.animate(
      {
        clipPath: [
          `circle(0px at ${cx}px ${cy}px)`,
          `circle(${R}px at ${cx}px ${cy}px)`,
        ],
      },
      { duration: DROP.floodMs, easing: EASE_DRAWER, fill: "forwards" }
    );
    const watch = () => {
      if (id !== runId) return;
      const p = Number(anim.effect?.getComputedTiming().progress ?? 1);
      const r = p * R;
      for (const tg of targets) {
        if (!tg.done && Math.hypot(tg.x - cx, tg.y - cy) < r) {
          tg.done = true;
          tg.el.dataset.theme = next;
        }
      }
      if (anim.playState === "running") requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
    return finished(anim).then(() => {
      if (id !== runId) return;
      commit(next);
      releaseTargets(targets);
    });
  }

  function effectDroplet(next: ThemeName, id: number) {
    const c = centreOf(button);
    const drop = createDrop(THEMES[next].bg);
    drop.style.left = `${c.x - DROP.w / 2}px`;
    drop.style.top = `${c.y - DROP.h}px`; // the belly's tip lands on the icon's centre
    fx.appendChild(drop);
    const k = fallKeyframes(c.y);
    const fall = drop.animate(k.frames, {
      duration: k.durationMs,
      easing: "linear",
      fill: "forwards",
    });
    return finished(fall).then(() => {
      if (id !== runId) return;
      const effects = Promise.all([
        finished(squash(drop, k.impactScaleY)),
        pressButton(0.08),
        ripples(c.x, c.y, THEMES[next].ring),
      ]);
      const flood = wait(DROP.floodDelayMs).then(() =>
        id === runId ? circleFlood(next, c.x, c.y, id) : undefined
      );
      return Promise.all([effects, flood]).then(noop);
    });
  }

  /* ─ rain ─ */

  type Drop = {
    z: number;
    speed: number;
    len: number;
    width: number;
    alpha: number;
    x0: number;
    y0: number;
    landX: number;
    landY: number;
    spawn: number;
    land: number;
    puddle: boolean;
    landed: boolean;
    hero?: boolean;
    spot?: Spot;
  };

  /* a jittered grid: random-looking, with no large dry holes */
  function stratified(n: number, w: number, h: number) {
    const cols = Math.max(1, Math.round(Math.sqrt((n * w) / h)));
    const rows = Math.max(1, Math.ceil(n / cols));
    const cells: [number, number][] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) cells.push([c, r]);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    const cw = w / cols;
    const ch = h / rows;
    return cells.slice(0, n).map(([c, r]) => ({
      x: (c + Math.random()) * cw,
      y: (r + Math.random()) * ch,
    }));
  }

  /* a wet spot is not a perfect disc: bumps where the splash spread further, and specks flung past its edge */
  function makeSpot(d: Drop, scale: number): Spot {
    const lobes: Lobe[] = [];
    const nl = 3 + ((Math.random() * 3) | 0);
    for (let l = 0; l < nl; l++) {
      const a = rand(0, Math.PI * 2);
      const off = rand(0.55, 0.85);
      lobes.push({
        dx: Math.cos(a) * off,
        dy: Math.sin(a) * off,
        s: rand(0.28, 0.46),
      });
    }
    const ns = 2 + ((Math.random() * 4) | 0);
    for (let m = 0; m < ns; m++) {
      const a = rand(0, Math.PI * 2);
      const off = rand(1.2, 1.9);
      lobes.push({
        dx: Math.cos(a) * off,
        dy: Math.sin(a) * off,
        s: rand(0.06, 0.14),
      });
    }
    return {
      x: d.landX,
      y: d.landY,
      born: d.land,
      lobes,
      r0: 1.5 + 2.5 * d.z,
      /* the toggle's spot spills well past the 54px button, so it reads */
      rmax: (d.hero ? 64 : 10 + 38 * d.z) * scale * rand(0.9, 1.15),
    };
  }

  function planRain(w: number, h: number) {
    const tan = Math.tan((RAIN.windDeg * Math.PI) / 180);
    const nP = clamp(
      Math.round((w * h) / RAIN.puddleArea),
      RAIN.minPuddles,
      RAIN.maxPuddles
    );
    const nA = Math.round(nP * RAIN.ambientRatio);
    const scale = clamp(Math.sqrt((w * h) / (1280 * 800)), 0.75, 1.35);
    const drops: Drop[] = [];

    const makeDrop = (
      z: number,
      landX: number,
      landY: number,
      puddle: boolean
    ): Drop => {
      const speed = 1300 + 1500 * z; // terminal velocity: near drops read faster
      const len = (16 + 40 * z) * scale;
      const y0 = -len - rand(0, 80);
      /* the shower builds: spawn density rises linearly */
      const spawn = RAIN.spawnMs * Math.sqrt(Math.random());
      return {
        z,
        speed,
        len,
        width: 0.8 + 1.4 * z,
        alpha: 0.3 + 0.6 * z,
        x0: landX - tan * (landY - y0),
        y0,
        landX,
        landY,
        spawn,
        land: spawn + ((landY - y0) / speed) * 1000,
        puddle,
        landed: false,
      };
    };

    for (const p of stratified(nP, w, h))
      drops.push(makeDrop(rand(0.55, 1), p.x, p.y, true));
    for (let i = 0; i < nA; i++)
      drops.push(
        makeDrop(
          rand(0.1, 0.5),
          rand(-0.05, 1.05) * w,
          rand(0.05, 1.02) * h,
          false
        )
      );
    /* a near drop lands on the toggle mid-shower, so the button changes with the rain, not in the final merge */
    const c = centreOf(button);
    const hero = makeDrop(1, c.x, c.y, true);
    const travel = ((c.y - hero.y0) / hero.speed) * 1000;
    hero.land = Math.max(travel + 40, RAIN.spawnMs * 0.55 + travel * 0.5);
    hero.spawn = hero.land - travel;
    hero.hero = true;
    drops.push(hero);

    /* every wet spot is decided now, while nothing moves, so the final merge costs no frame mid-shower */
    let lastLand = 0;
    const spots: Spot[] = [];
    for (const d of drops) {
      if (!d.puddle) continue;
      if (d.land > lastLand) lastLand = d.land;
      d.spot = makeSpot(d, scale);
      spots.push(d.spot);
    }
    const mergeStart = lastLand + 40;
    const mergeK = Math.max(
      1,
      coverageScale(spots, mergeStart + RAIN.mergeMs, w, h)
    );
    return { drops, tan, scale, mergeStart, mergeK };
  }

  /* paint the spots (body and lobes) of the next theme, and flip any control a spot reaches */
  function paintSpots(
    c: CanvasRenderingContext2D,
    w: number,
    h: number,
    spots: Spot[],
    t: number,
    k: number,
    color: string,
    targets: Target[],
    next: ThemeName
  ) {
    c.clearRect(0, 0, w, h);
    c.fillStyle = color;
    c.beginPath();
    for (const p of spots) {
      const r = puddleBase(p, t) * k;
      c.moveTo(p.x + r, p.y);
      c.arc(p.x, p.y, r, 0, Math.PI * 2);
      for (const lb of p.lobes) {
        const lx = p.x + lb.dx * r;
        const ly = p.y + lb.dy * r;
        const lr = r * lb.s;
        c.moveTo(lx + lr, ly);
        c.arc(lx, ly, lr, 0, Math.PI * 2);
      }
      for (const tg of targets) {
        if (!tg.done && Math.hypot(tg.x - p.x, tg.y - p.y) < r) {
          tg.done = true;
          tg.el.dataset.theme = next;
        }
      }
    }
    c.fill("nonzero");
  }

  function effectRain(next: ThemeName, id: number) {
    const color = THEMES[next].bg;
    /* puddles of the next theme under the controls; the rain over them */
    const wet = makeCanvas("pts__layer");
    const sky = makeCanvas("pts__layer", true);
    const { w, h, ctx } = sky;
    const wctx = wet.ctx;
    const plan = planRain(w, h);
    const targets = floodTargets();
    const puddles: Spot[] = [];
    const splashes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      born: number;
      life: number;
    }[] = [];
    const rings: {
      x: number;
      y: number;
      born: number;
      rmax: number;
      z: number;
    }[] = [];
    const tilt = -Math.atan(plan.tan);
    /* one shared streak gradient in unit space, placed per drop by a transform */
    const streak = ctx.createLinearGradient(0, -1, 0, 0);
    streak.addColorStop(0, transparentOf(color));
    streak.addColorStop(1, color);
    let revealed = false;
    let revealedAt = 0;
    const t0 = performance.now();
    cleanups.push(() => releaseTargets(targets));

    return new Promise<void>((resolve) => {
      const land = (d: Drop) => {
        const { landX: x, landY: y } = d;
        if (d.puddle && d.spot) {
          puddles.push(d.spot);
          if (d.hero) void pressButton(0.05);
        }
        /* a crown splash: droplets thrown up and out, more for near drops */
        const n = Math.round(2 + d.z * 4);
        for (let j = 0; j < n; j++) {
          const ang = rand(-Math.PI * 0.92, -Math.PI * 0.08);
          const v = rand(60, 210) * (0.5 + d.z);
          splashes.push({
            x,
            y,
            vx: Math.cos(ang) * v,
            vy: Math.sin(ang) * v,
            r: rand(0.6, 1.2) * (0.6 + d.z),
            born: d.land,
            life: rand(200, 340),
          });
        }
        /* a ripple only on dry ground: inside a fresh puddle a ring reads as a target, not water */
        if (!d.puddle)
          rings.push({
            x,
            y,
            born: d.land,
            rmax: (5 + 16 * d.z) * plan.scale,
            z: d.z,
          });
      };

      const drawSky = (t: number) => {
        ctx.fillStyle = streak;
        for (const d of plan.drops) {
          if (d.landed || t < d.spawn) continue;
          const y = d.y0 + (d.speed * (t - d.spawn)) / 1000;
          const x = d.x0 + plan.tan * (y - d.y0);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(tilt);
          ctx.scale(1, d.len);
          ctx.globalAlpha = d.alpha;
          ctx.fillRect(-d.width / 2, -1, d.width, 1);
          ctx.restore();
        }
        /* ripple rings, a little flattened, as seen at an angle */
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        for (let r = rings.length - 1; r >= 0; r--) {
          const g = rings[r];
          const p = (t - g.born) / RAIN.rippleMs;
          if (p >= 1) {
            rings.splice(r, 1);
            continue;
          }
          const rad = 1 + g.rmax * easeOutCubic(p);
          ctx.globalAlpha = (1 - p) * (0.3 + 0.4 * g.z);
          ctx.beginPath();
          ctx.ellipse(g.x, g.y, rad, rad * 0.85, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        /* crown droplets under gravity */
        ctx.fillStyle = color;
        for (let s = splashes.length - 1; s >= 0; s--) {
          const sp = splashes[s];
          const age = t - sp.born;
          if (age >= sp.life) {
            splashes.splice(s, 1);
            continue;
          }
          const at = age / 1000;
          ctx.globalAlpha = 1 - age / sp.life;
          ctx.beginPath();
          ctx.arc(
            sp.x + sp.vx * at,
            sp.y + sp.vy * at + 0.5 * RAIN.splashGravity * at * at,
            sp.r,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      const frame = (now: number) => {
        if (id !== runId) {
          resolve();
          return;
        }
        const t = now - t0;
        for (const d of plan.drops) {
          if (!d.landed && t >= d.land) {
            d.landed = true;
            land(d);
          }
        }
        let k = 1;
        if (t >= plan.mergeStart && !revealed) {
          const p = clamp((t - plan.mergeStart) / RAIN.mergeMs, 0, 1);
          k = 1 + (plan.mergeK - 1) * easeInOutCubic(p);
          if (p >= 1) {
            /* the scene's background now equals the puddles' colour: seamless */
            revealed = true;
            revealedAt = t;
            commit(next);
            wet.canvas.remove();
            layers.delete(wet.canvas);
            releaseTargets(targets);
          }
        }
        if (!revealed)
          paintSpots(wctx, w, h, puddles, t, k, color, targets, next);
        ctx.clearRect(0, 0, w, h);
        drawSky(t);
        if (revealed && t - revealedAt > RAIN.tailMs) {
          resolve();
          return;
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }

  /* ─ diwali ─ */

  /*
   * Planning ~1,000 stars and proving coverage costs a few ms (tens on a cold
   * JIT), so it is done before the click — on pointer-down, or when idle once
   * Diwali is chosen — and the click only starts the show. A plan is reused
   * only for the same scene size and toggle position.
   */
  let preplanned: {
    w: number;
    h: number;
    x: number;
    y: number;
    plan: DiwaliPlan;
  } | null = null;

  function prepare() {
    if (busy || destroyed || effect() !== "diwali" || reducedMotion.matches)
      return;
    Sound.unlock();
    try {
      const { w, h } = size();
      const o = centreOf(button);
      preplanned = { w, h, x: o.x, y: o.y, plan: planDiwali(w, h, o) };
    } catch {
      preplanned = null;
    }
  }

  function takePlan(w: number, h: number, origin: { x: number; y: number }) {
    const pre = preplanned;
    preplanned = null;
    if (
      pre &&
      pre.w === w &&
      pre.h === h &&
      Math.abs(pre.x - origin.x) < 0.5 &&
      Math.abs(pre.y - origin.y) < 0.5
    )
      return pre.plan;
    return planDiwali(w, h, origin);
  }

  function effectDiwali(next: ThemeName, id: number) {
    Sound.unlock(); // inside the click: audio is only allowed from a gesture
    const color = THEMES[next].bg; // everything is made of the next theme
    /* the stars' dots under the controls, the rockets just above them and still under the controls */
    const sky = makeCanvas("pts__layer");
    const wet = makeCanvas("pts__layer");
    const { w, h, ctx } = sky;
    const wctx = wet.ctx;
    const origin = centreOf(button);
    const plan = takePlan(w, h, origin);
    const dot = makeDotSprite(color);
    const targets = floodTargets();
    const live: Star[] = [];
    const sparks: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      born: number;
      life: number;
      size: number;
    }[] = [];
    const rings: { x: number; y: number; born: number; r: number }[] = [];
    const t0 = performance.now();
    let last = 0;
    cleanups.push(() => releaseTargets(targets));
    void pressButton(0.06); // the launcher kicks as it fires

    const flip = (x: number, y: number, r: number) => {
      for (const tg of targets) {
        if (tg.done) continue;
        const dx = tg.x - x;
        const dy = tg.y - y;
        if (dx * dx + dy * dy < r * r) {
          tg.done = true;
          tg.el.dataset.theme = next;
        }
      }
    };

    const rocketPos = (s: Shell, t: number) => {
      const p = clamp((t - s.launch) / s.flight, 0, 1);
      const e = 1 - (1 - p) * (1 - p); // decelerating to the burst, like a coasting shell
      const dx = s.tx - s.x0;
      const dy = s.ty - s.y0;
      const len = Math.hypot(dx, dy) || 1;
      const bow = Math.sin(Math.PI * e) * s.curve;
      return {
        x: s.x0 + dx * e - (dy / len) * bow,
        y: s.y0 + dy * e + (dx / len) * bow,
      };
    };

    return new Promise<void>((resolve) => {
      const burst = (s: Shell) => {
        live.push(...s.stars);
        rings.push({ x: s.tx, y: s.ty, born: s.burst, r: 46 * plan.scale });
        const pan = (s.tx / w) * 2 - 1;
        const delay = 0.04 + rand(0, 0.06); // the sound lags the flash
        Sound.boom(pan, s.kind === "ring" ? 0.8 : 1, delay);
        if (s.crackle) Sound.crackle(pan, delay, 18);
      };

      /* the dots bloom where stars settle (stamped from the sprite); fast stars also streak */
      const paintParticles = (t: number, k: number) => {
        wctx.clearRect(0, 0, w, h);
        wctx.fillStyle = color;
        wctx.beginPath();
        const ig = plan.ignition;
        const ir = puddleBase(ig, t) * k;
        wctx.moveTo(ig.x + ir, ig.y);
        wctx.arc(ig.x, ig.y, ir, 0, Math.PI * 2);
        flip(ig.x, ig.y, ir);
        wctx.fill();
        /* one allocation-free pass, so no collection pauses mid-show */
        const K = DIWALI.dragK;
        const gk = DIWALI.gravity / K;
        const tau = DIWALI.bloomTauMs;
        const streaks = k === 1;
        if (streaks) {
          wctx.strokeStyle = color;
          wctx.lineCap = "round";
          wctx.lineWidth = 2 * Math.min(1.3, plan.scale + 0.2);
          wctx.beginPath();
        }
        for (const d of live) {
          const ageMs = t - d.born;
          if (ageMs < 0) continue;
          const age = ageMs / 1000;
          const f = Math.exp(-K * age);
          const e = 1 - f;
          const x = d.x0 + (d.vx / K) * e;
          const y = d.y0 + gk * age + ((d.vy - gk) * e) / K;
          const r = (d.r0 + (d.rmax - d.r0) * (1 - Math.exp(-ageMs / tau))) * k;
          wctx.drawImage(dot, x - r, y - r, r * 2, r * 2);
          flip(x, y, r);
          if (streaks) {
            const vx = d.vx * f;
            const vy = gk + (d.vy - gk) * f;
            if (vx * vx + vy * vy >= 6400) {
              wctx.moveTo(x - vx * 0.04, y - vy * 0.04);
              wctx.lineTo(x, y);
            }
          }
        }
        if (streaks) wctx.stroke();
      };

      const drawRockets = (t: number, dt: number) => {
        ctx.fillStyle = color;
        for (const s of plan.shells) {
          if (!s.launched || s.burstDone) continue;
          const r = rocketPos(s, t);
          /* trail sparks at a fixed rate a second, the same at 60Hz or 144Hz */
          s.sparkDebt += DIWALI.trailSparksPerS * dt;
          const prev = s.prevPos ?? r;
          while (s.sparkDebt >= 1) {
            s.sparkDebt -= 1;
            const f = Math.random();
            sparks.push({
              x: prev.x + (r.x - prev.x) * f + rand(-1, 1),
              y: prev.y + (r.y - prev.y) * f + rand(-1, 1),
              vx: rand(-25, 25),
              vy: rand(15, 60),
              born: t,
              life: rand(200, 380),
              size: rand(1, 2),
            });
          }
          s.prevPos = r;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.6 * plan.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      /* the burst's shock ring marks the pop */
      const drawRings = (t: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        for (let i = rings.length - 1; i >= 0; i--) {
          const g = rings[i];
          const p = (t - g.born) / 260;
          if (p >= 1) {
            rings.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = 1 - p;
          ctx.beginPath();
          ctx.arc(
            g.x,
            g.y,
            g.r * (0.3 + 0.7 * easeOutCubic(p)),
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      };

      const drawSparks = (t: number, dt: number) => {
        ctx.fillStyle = color;
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          const age = t - sp.born;
          if (age >= sp.life) {
            sparks.splice(i, 1);
            continue;
          }
          sp.vy += 220 * dt;
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
          ctx.globalAlpha = 1 - age / sp.life;
          ctx.fillRect(
            sp.x - sp.size / 2,
            sp.y - sp.size / 2,
            sp.size,
            sp.size
          );
        }
        ctx.globalAlpha = 1;
      };

      const frame = (now: number) => {
        if (id !== runId) {
          resolve();
          return;
        }
        const t = now - t0;
        const dt = clamp((t - last) / 1000, 0, 0.05);
        last = t;
        for (const s of plan.shells) {
          if (!s.launched && t >= s.launch) {
            s.launched = true;
            Sound.launch(s.flight / 1000, (s.tx / w) * 2 - 1);
          }
          if (s.launched && !s.burstDone && t >= s.burst) {
            s.burstDone = true;
            burst(s);
          }
        }
        let k = 1;
        if (t >= plan.mergeStart) {
          const p = clamp((t - plan.mergeStart) / DIWALI.mergeMs, 0, 1);
          k = 1 + (plan.mergeK - 1) * easeInOutCubic(p);
          if (p >= 1) {
            /* the dots cover every pixel in the next theme's colour: commit */
            commit(next);
            releaseTargets(targets);
            resolve();
            return;
          }
        }
        paintParticles(t, k);
        ctx.clearRect(0, 0, w, h);
        drawRockets(t, dt);
        drawRings(t);
        drawSparks(t, dt);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }

  /* ─ core ─ */

  const EFFECTS: Record<
    EffectName,
    (next: ThemeName, id: number) => Promise<void>
  > = {
    droplet: effectDroplet,
    rain: effectRain,
    diwali: effectDiwali,
  };

  function cleanup() {
    cleanups.splice(0).forEach((fn) => {
      try {
        fn();
      } catch {
        /* one teardown failing must not keep the rest from running */
      }
    });
    fx.replaceChildren();
    layers.forEach((el) => el.remove());
    layers.clear();
    root.classList.remove("is-switching");
    button.getAnimations().forEach((a) => a.cancel());
    button.removeAttribute("data-theme");
    button.removeAttribute("aria-busy");
  }

  function toggle() {
    if (busy || destroyed) return;
    busy = true;
    const id = ++runId;
    const next: ThemeName = currentTheme() === "dark" ? "light" : "dark";
    root.classList.add("is-switching");
    button.setAttribute("aria-busy", "true");

    const instant =
      reducedMotion.matches || document.visibilityState !== "visible";
    let run: Promise<void>;
    try {
      run = instant
        ? Promise.resolve(commit(next))
        : EFFECTS[effect()](next, id);
    } catch (err) {
      run = Promise.reject(err);
    }

    let watchdog = 0;
    const guard = new Promise<void>((resolve) => {
      watchdog = window.setTimeout(() => {
        runId++; // stops any effect still in flight
        fx.getAnimations({ subtree: true }).forEach((a) => {
          try {
            a.finish();
          } catch {
            a.cancel();
          }
        });
        resolve();
      }, WATCHDOG_MS);
    });

    Promise.race([run, guard])
      .catch((err) => console.error("[ThemeSwitch]", err))
      .then(() => {
        window.clearTimeout(watchdog);
        if (destroyed) return;
        /* never leave the scene on the old theme, whatever happened above */
        if (currentTheme() !== next) commit(next);
        cleanup();
        busy = false;
      });
  }

  const onPointerDown = () => prepare();
  button.addEventListener("pointerdown", onPointerDown);
  button.addEventListener("click", toggle);
  updateLabel();

  return {
    toggle,
    prepare,
    busy: () => busy,
    destroy() {
      destroyed = true;
      runId++;
      button.removeEventListener("pointerdown", onPointerDown);
      button.removeEventListener("click", toggle);
      cleanup();
      Sound.dispose();
    },
  };
}
