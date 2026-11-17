# Design — A. Göktuğ Yalçın portfolio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
Dotted Notebook — warm paper, dotted rules, lowercase chrome, a few handmade touches.

## Structure
- One **720px column** (`.frame`) with dotted side rules runs the full height of every page.
- Horizontal rules are dotted and **full-bleed** (`.rule-b`, `.rule-y`); the frame sits inside them.
- Sections are separated by a **gutter** — a 24px strip of dot texture inside the column — then a title row (`SectionHeader`): lowercase serif title left, mono aside right.
- Home: photo-reel banner → profile (avatar overlapping the banner, info rows, link pills) → about → now → projects (rows) → writing → photos (prints). An index rail sits right of the frame on xl screens.
- Projects: filterable card grid. Blog: serif title rows with mono dates. Photos: stat cells + tilted grid. Last listened: CD cards.
- Footer (every page): "say hi" (big serif address + pills) → time-aware closing line + "Yours," → now-listening row → mono colophon with a ticking Istanbul clock.

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
- Easings: `--ease-out` (0.16, 1, 0.3, 1), `--ease-in` (0.7, 0, 0.84, 0).
- View transitions between routes (fade + rise).
- `.reveal` — rows sharpen from a blur as they scroll in; CSS scroll-driven, only where supported, off under reduced motion.
- Theme toggle: Pin UI Theme Switch engine (`components/pinui`), **rain** effect, hosted as a page-wide scene by `NavMenu/ThemeButton`.
- Personal signatures kept: walking sprite (beside "Dear reader," + Konami run), avatar tilt, photo tilt→straighten and grayscale→colour, spinning CD, bouncing hobby icons, live equalizer.

## What pages MUST share
- The frame, the dotted rules, the gutter + title row, the four-font system.
- Nav: sticky top bar inside the frame; active item is ink, the rest soft.

## Exports

### tokens.css
See `tokens.css` at project root — mirrors the `:root` / `.dark` blocks in `app/globals.css`.
