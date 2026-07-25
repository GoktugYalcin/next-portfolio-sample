# Design — A. Göktuğ Yalçın portfolio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- Home (bio): **Letter** — first-person "Dear," greeting, single narrow column, no CTA.
- Projects / Last-listened (work index): **Portfolio Grid** — filterable/responsive card grid, typographic-only links, no global CTA.
- Photos: **Photographic** — full-bleed image bands, small corner captions, no display headline.
- Blog: **Index-First** — vertical link list, hairline rules, no hero.

## Theme
Atelier (catalog) — custom-tuned OKLCH, warm terracotta anchor.

- `--background` (paper)  oklch(97% 0.012 60) · dark oklch(15% 0.012 40)
- `--foreground` (ink)    oklch(20% 0.014 40) · dark oklch(94% 0.008 60)
- `--card` (paper-2)      oklch(95% 0.013 60) · dark oklch(18% 0.013 40)
- `--border` (rule)       oklch(85% 0.012 60) · dark oklch(30% 0.012 40)
- `--accent`              oklch(52% 0.15 40)  · dark oklch(68% 0.14 42)
- `--ring` (focus)        = accent

## Typography
- Display: Fraunces, variable serif, weight 600, style normal (next/font/google, `--font-display`)
- Body: Newsreader, weight 400 (next/font/google, `--font-body-serif` → `--font-body`)
- No mono face — project has no code blocks.
- Headings always roman. Italic reserved for Letter's salutation line only.

## Spacing
Tailwind's default scale, used via utility classes (`gap-*`, `p-*`, `mt-*`). No raw px in new markup.

## Motion
- Easings: `--ease-out` (0.16, 1, 0.3, 1), `--ease-in` (0.7, 0, 0.84, 0).
- Reveal pattern: none / quiet fade only where a macrostructure calls for it (Letter, Index-First: none). No scroll-triggered fade-up on every section.
- Reduced-motion: existing `.anim` sprite and rotate keyframes are functional/personal signatures, kept as-is; they already respect short, bounded durations.

## Microinteractions stance
- Silent success everywhere — no toasts.
- Focus rings: instant, `outline: 2px solid oklch(var(--ring))`, no transition on outline.
- Hover: single-signal only (colour or 1px shift), never combined lift+shadow+colour.

## CTA voice
- No filled buttons anywhere on the site. Every action is a **typographic-only** link — underline or weight/colour shift on hover, per Atelier voice.
- Primary "action" per page is implicit (visit a project, look at a photo) — never a marketing CTA strip.

## Per-page allowances
- Home, Photos: may carry one quiet personal signature each (walking sprite, photo hover rotate) — pre-existing, not new enrichment.
- Projects/Last-listened/Blog: typography + grid only, no enrichment.

## What pages MUST share
- Fraunces + Newsreader pairing.
- The terracotta accent, used at <5% of any viewport (links, focus rings, active nav state only).
- Nav: N9 Edge-aligned minimal, bottom-fixed (positional deviation from Atelier's usual top placement — kept because it's this site's pre-existing personal signature, not a generic AI-nav pattern).
- Footer: Ft6 Letter close.
- No pure black / pure white anywhere — all paper/ink is hue-tinted.

## What pages MAY differ on
- Macrostructure within their declared family (none currently vary further — one macrostructure per page type).
- Whether a personal enrichment signature is present (Home/Photos have one; Projects/Blog/Last-listened don't).

## Exports

### tokens.css
See `tokens.css` at project root — mirrors the `:root` / `.dark` blocks in `app/globals.css`.
