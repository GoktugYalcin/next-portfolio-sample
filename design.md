# Design — A. Göktuğ Yalçın portfolio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
Dotted Notebook — warm paper, dotted rules, lowercase chrome, a few handmade touches.

## Structure
- The page system lives in `app/notebook.css` (plain CSS, named parts: `.page`, `.nav`, `.band`, `.sec`, `.cover`, `.profile`, `.pile`…). Tailwind remains only inside a few leaf components.
- One **720px column** (`.page`) with dotted side rules; every horizontal rule is dotted and full-bleed (`.wide-line`).
- Sections are separated by a **band** (32px of dot texture), then a title row (`.sec-head`).
- Home: painted cover → profile (avatar over the cover's edge, name, four facts, link pills) → about → right now → projects (lead entry + accordion rows) → writing.
- Inner pages: `PageHead` (crumb, big serif title, lede) → band → content.
- Footer (every page): say hi (address + copy, photo stamps, pills) → closing line by the visitor's clock → the pile → colophon with a rolling Istanbul clock and the Konami hint.

## Theme
Warm near-white paper and near-black ink, light and dark. Tokens live in `app/globals.css` as OKLCH channels.

- `--background` (#fdfdfc) · `--card` · `--chip`
- `--foreground` · `--muted-foreground` · `--soft`
- `--border` — every rule, always dotted outside cards · `--stripe` — dot texture · `--hover`
- `--accent` — emerald; status only. `--warn` — amber; reserved.

## Typography
- Display: Instrument Serif 400 — h1/h2 (lowercased in CSS), post titles, the address, salutation and closing (italic).
- Body: Geist. Mono: Geist Mono — labels, meta, pills, links (`.label-mono`, `.link-arrow`, `.pill`).
- Hand: Architects Daughter — margin notes only, never inside the column.
- Chrome is lowercase (nav, headings, labels, names). Written content keeps its own casing.

## Components
- `.pill` — bordered mono link. `.chip` — tag. `StatusBadge` — round pill with a status dot.
- `.link-dotted` — inline link, dotted underline that turns solid on hover.
- Cards: `rounded-lg border bg-card p-4`; rows are separated by dotted rules, not boxed.
- Opacity modifiers must be on Tailwind's scale (`/90`, not `/85`) or written as `/[0.85]`.

## Motion
- Easings: `--ease-out` (0.16, 1, 0.3, 1), `--ease-in-out` (0.65, 0, 0.35, 1), `--spring` (damped spring as `linear()`).
- **Intro** (`Motion/Intro`): first home visit per session (or `?intro`). A paper sheet covers the page, the avatar says hi in the middle, then flies to its place as the sheet lifts. 4s failsafe in the boot script.
- **Reveal** (`Motion`): `.reveal` starts blurred, lowered and transparent; settles on first view. Stagger with `--d`/`--i`. Waits for the intro.
- **Cover** (`Cover`): Unsplash photos redrawn as brush strokes on a canvas; paints itself in, ruffles under the pointer, click for the next.
- **Route transitions**: view transitions — old page blurs out (320ms), new page blurs in (600ms); the nav is held still.
- **Pile** (`Pile`): drawn objects with matter-js physics, loaded only near the footer; drag, throw at the walker, tidy up.
- **Theme toggle**: Pin UI Theme Switch engine, rain effect, page-wide.
- Grain film over everything. All of it off under reduced motion.

## What pages MUST share
- The frame, the dotted rules, the gutter + title row, the four-font system.
- Nav: sticky top bar inside the frame; active item is ink, the rest soft.

## Exports

### tokens.css
See `tokens.css` at project root — mirrors the `:root` / `.dark` blocks in `app/globals.css`.
