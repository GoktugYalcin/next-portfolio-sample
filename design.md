# Design — A. Göktuğ Yalçın portfolio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
Framed Index — a monochrome, hairline-framed developer index.

## Structure
- One **760px column** (`.frame`) with dashed side rules runs the full height of every page.
- Each section opens with a **band** (`SectionHeader`): full-bleed diagonal stripes, hairline top/bottom, 3px corner marks where the band meets the frame, serif title left, mono aside right.
- Pages are a stack of `Section`s (`components/generated/Frame`). No content sits outside the frame except the index rail.
- Home: banner → profile → About → Now → Projects → Writing → Photos. A fixed **index rail** right of the frame (xl and up) tracks the section in view.
- Projects: filterable 2-column card grid (All / Live / Open source).
- Blog: index rows — mono date, serif title, tag chips.
- Photos: stat cells, then the tilted grayscale grid.
- Last listened: 2-column CD cards.
- Footer (every page): "Yours," band → contact link cells → now-listening row.

## Theme
Neutral monochrome, dark and light. Tokens live in `app/globals.css` as OKLCH channels.

- `--background` · `--card` · `--chip` — page, raised surface, tag surface
- `--foreground` · `--muted-foreground` · `--soft` — text, secondary text, tertiary/labels
- `--border` — every hairline (10% ink) · `--stripe` — band/plate hatching · `--hover`
- `--accent` — emerald; status only (live dots, equalizer, "copied")
- `--warn` — amber; reserved for in-progress/featured badges

## Typography
- Display: Instrument Serif 400 (`--font-display`) — h1/h2, post titles, salutation.
- Body: Inter (`--font-sans`).
- Mono: JetBrains Mono (`--font-mono`) — labels, dates, chips, meta. `.label-mono` = 10px uppercase tracked.
- Italic reserved for the salutation ("Dear reader,") and the sign-off ("Yours,").

## Components
- `.chip` — mono tag. `StatusBadge` — LIVE / SOURCE pills.
- Cards: `rounded-xl border bg-card p-4`, inner plate `rounded-lg border bg-stripes`.
- Segmented filter: bordered group, active item inverted (fg on bg).
- One filled button style (inverted fg/bg), used at most once per page.

## Motion
- Easings: `--ease-out` (0.16, 1, 0.3, 1), `--ease-in` (0.7, 0, 0.84, 0).
- View transitions between routes (fade + rise). No scroll-triggered reveals.
- Theme toggle: Pin UI Theme Switch engine (`components/pinui`), **rain** effect, hosted as a page-wide scene by `NavMenu/ThemeButton` — rain of the next theme wets the viewport, then the theme commits. Instant under reduced motion.
- Hover: single signal only — border or colour, never lift+shadow+colour.
- Personal signatures kept: walking sprite (banner + Konami run), avatar tilt, photo tilt→straighten and grayscale→colour, spinning CD, bouncing hobby icons, live equalizer.
- `prefers-reduced-motion` disables the sprite walk and view transitions.

## What pages MUST share
- The frame, the band header, the three-font pairing.
- Nav: sticky top bar inside the frame; active item gets weight + underline.
- Accent used for status only — the palette is otherwise ink on paper.

## Exports

### tokens.css
See `tokens.css` at project root — mirrors the `:root` / `.dark` blocks in `app/globals.css`.
