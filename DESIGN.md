---
name: CodeInQuest
description: The Retro Arcade Ladder — pixel-art 8-bit UI wrapped around a ranked competitive ladder.
colors:
  treasure-gold: "#ffc53d"
  treasure-gold-border: "#8c6600"
  treasure-shadow: "#231a00"
  midnight-navy: "#0f1320"
  arcade-panel: "#1b2133"
  panel-shadow: "#161b2b"
  cabinet-black: "#20222c"
  pure-white: "#ffffff"
  steel-blue-border: "#5a6c9a"
  muted-steel-border: "#5f6b8c"
  hard-shadow-slate: "#55617d"
  bright-parchment: "#e9edf8"
  faded-steel: "#8a93ad"
  badge-navy: "#232b42"
  victory-green: "#42c97a"
  victory-green-surface: "#0f3624"
  alert-red: "#f2645a"
  alert-red-surface: "#3a1a1b"
typography:
  display:
    fontFamily: "Pixelify Sans, Silkscreen, monospace"
    fontWeight: 700
    letterSpacing: "normal"
  headline:
    fontFamily: "Pixelify Sans, Silkscreen, monospace"
    fontWeight: 700
    fontSize: "1.25rem"
  body:
    fontFamily: "Silkscreen, Pixelify Sans, monospace"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "Silkscreen, Pixelify Sans, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  none: "0px"
components:
  button-primary:
    backgroundColor: "{colors.treasure-gold}"
    textColor: "{colors.treasure-shadow}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  button-primary-disabled:
    backgroundColor: "{colors.treasure-gold}"
    textColor: "{colors.treasure-shadow}"
    rounded: "{rounded.none}"
  card:
    backgroundColor: "{colors.arcade-panel}"
    textColor: "{colors.bright-parchment}"
    rounded: "{rounded.none}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.arcade-panel}"
    textColor: "{colors.bright-parchment}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  input:
    backgroundColor: "{colors.panel-shadow}"
    textColor: "{colors.bright-parchment}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: CodeInQuest

## Overview

**Creative North Star: "The Retro Arcade Ladder"**

CodeInQuest reads as an 8-bit arcade cabinet wearing a competitive ranking
ladder: pixelated monochrome glyphs, a pixelated chest-icon mascot, and two
blocky retro typefaces (Pixelify Sans, Silkscreen) sit on top of a
neo-brutalist shell — thick 3px borders, flat colors, and a single hard,
unblurred drop shadow standing in for every elevation cue in the system. The
system commits to a single dark theme; there is no light mode to reconcile
against, which frees every surface color to be tuned for one context only.

Nothing in the system is rounded, and nothing is blurred. Those two absences
are deliberate rejections of default "soft SaaS" UI (rounded-xl cards,
diffuse Material-style shadows) in favor of something that reads like a
cartridge-era video game rendered in a browser. The single accent color —
Treasure Gold — is the one place warmth and value enter an otherwise cool,
steel-blue-on-navy palette, and it is reserved for the things the player is
meant to chase: calls to action, the active nav item, "new" and "passed"
states, promotion progress.

**Key Characteristics:**
- Pixel-perfect monochrome glyph icons (8×8 grid, `currentColor`, `crispEdges`) in place of a conventional icon library.
- One hard-edged, unblurred offset shadow (`3px 3px 0 0`) as the system's only elevation idiom — never a soft/blurred shadow.
- Zero border radius anywhere: every card, button, badge, input, and table cell is a hard rectangle.
- Thick (3px) borders on every contained surface; borders carry as much visual weight as fill color.
- A single accent (Treasure Gold) used sparingly and consistently for primary actions and "you should notice this" states.
- Uppercase, letter-spaced micro-labels (`text-xs uppercase tracking-wide`) for every badge, tag, and nav label.

## Colors

A cool steel-and-navy dark palette with exactly one warm accent; state colors (success/error) are the only other hues allowed in.

### Primary
- **Treasure Gold** (`#ffc53d`): the system's only accent. Primary buttons, active nav/tab state, "Nouveau" badges, promotion/progress fill, focus rings, and the accent rule under hero copy. Named for the chest-icon mascot it's paired with everywhere.
- **Treasure Gold Border** (`#8c6600`): the darker gold used as the 3px border on gold-filled surfaces (primary buttons, "locked" affordances don't use it — only active/gold ones).
- **Treasure Shadow** (`#231a00`): near-black text color used only on top of Treasure Gold fills, for contrast.

### Neutral
- **Midnight Navy** (`#0f1320`): page background (`body`). The darkest surface in the system; everything else sits visually "above" it.
- **Arcade Panel** (`#1b2133`): the default card/container surface — quiz cards, stat cards, auth forms, table body rows.
- **Panel Shadow** (`#161b2b`): a recessed variant of Arcade Panel — form inputs, locked-state badges, odd table rows (zebra striping).
- **Cabinet Black** (`#20222c`): the fixed navbar background (the one surface that never theme-swaps) and the scrim over locked quiz cards.
- **Pure White** (`#ffffff`): text on Cabinet Black (the navbar).
- **Steel Blue Border** (`#5a6c9a`): the default 3px border color on panels, badges, inputs, and table dividers.
- **Muted Steel Border** (`#5f6b8c`): a slightly softer border variant for dimmed/locked/secondary surfaces.
- **Hard Shadow Slate** (`#55617d`): the color of the system's one offset shadow (`shadow-hard`). Never used as a fill or text color — shadow-only.
- **Bright Parchment** (`#e9edf8`): primary text color on dark surfaces.
- **Faded Steel** (`#8a93ad`): secondary/muted text — descriptions, metadata, helper copy.
- **Badge Navy** (`#232b42`): background for the small letter/rank badge chip.

### Status (semantic)
- **Victory Green** (`#42c97a`) / **Victory Green Surface** (`#0f3624`): "Réussi" badges, success alerts, the checkmark icon color. Surface variant is the deep-green background behind success-colored text/borders.
- **Alert Red** (`#f2645a`) / **Alert Red Surface** (`#3a1a1b`): form and quiz error states (wrong answer, failed sign-in). Surface variant is the deep-red background behind error-colored text/borders.

### Named Rules
**The One Accent Rule.** Treasure Gold is the only warm color in the system and the only color used for calls to action. If a screen needs more than one "look here" signal, reach for size, position, or an icon — never a second accent hue.

**The No-Blur Rule.** Every shadow in the system is a flat, hard-edged offset block (`3px 3px 0 0`, `hard-shadow-slate`, zero blur radius). A soft/diffuse shadow is a Material-idiom import and does not belong here, even for "subtle" elevation.

## Typography

**Display Font:** Pixelify Sans (with Silkscreen, monospace fallback)
**Body Font:** Silkscreen (with Pixelify Sans, monospace fallback)

**Character:** Tactile and gamified — two blocky, low-fidelity pixel typefaces doing different jobs: Pixelify Sans carries weight and personality on headings and big numbers, while Silkscreen's flatter, more mechanical rhythm carries body copy and labels, so the pairing itself reads as "display vs. readout" rather than two interchangeable fonts.

### Hierarchy
- **Display** (700, `text-4xl`–`text-5xl`, tight leading): landing-page hero headline only.
- **Headline** (700, `text-xl`–`text-3xl`): section and card titles (quiz title, stat values, modal/page headings) — always `font-display`.
- **Body** (400, `text-sm`–`text-base`): descriptions, paragraph copy, table cell text — the un-classed default (`font-body` is never applied explicitly; it's the `body` tag's base font).
- **Label** (600, `text-xs`, `tracking-wide`, uppercase): every badge, tag, nav item, and form label. Always paired with `uppercase tracking-wide`, never sentence case.

### Named Rules
**The Uppercase Label Rule.** Any short, categorical piece of text — a badge, a nav item, a form label, a status tag — is uppercase with wide letter-spacing. Sentence-case labels are reserved for body copy and headings only.

## Layout

Single-column-first, container-constrained layout (`container mx-auto`, `max-w-7xl` on the dashboard shell, `max-w-md`/`max-w-6xl` on narrower auth/hero contexts). Desktop introduces two-column arrangements (landing hero: copy + division ladder side by side via `lg:grid-cols-[1.15fr_0.85fr]`) that collapse to a single stacked column below `lg`. Spacing uses Tailwind's default scale (4px steps) with no custom spacing tokens — cards consistently pad at `p-6`/`p-8`, inline clusters use `gap-2`–`gap-4`. The dashboard nav is `sticky top-0`, fixed at `h-16`, and is the one surface that never changes background across light/dark contexts (there is only a dark context, but this pins it as the visual anchor).

## Elevation & Depth

Depth is conveyed by exactly one technique: a solid, unblurred offset shadow (`box-shadow: 3px 3px 0 0 var(--color-shadow)`, the `shadow-hard` utility), used on virtually every contained surface (cards, panels, the leaderboard table, auth forms). There is no layered/tonal elevation system and no soft shadows anywhere. Interactive elements with `shadow-hard` simulate a physical press on hover/active: the shadow disappears and the element translates `3px, 3px` into the space the shadow occupied (`hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`) — depth doubling as the primary interaction affordance for buttons and clickable cards, not a separate motion system.

### Shadow Vocabulary
- **Hard** (`box-shadow: 3px 3px 0 0 #55617d`): the system's only shadow. Applied to cards, panels, buttons, badges, and the leaderboard table frame.

### Named Rules
**The Press Rule.** A `shadow-hard` element that is also interactive loses its shadow and shifts `+3px,+3px` on hover — simulating the surface being pressed flat. A disabled or non-interactive element keeps its shadow at rest and never animates it.

## Shapes

Zero border radius, system-wide: every button, card, input, badge, table, and image mask is a hard rectangle (`rounded: none`). Borders are thick and load-bearing — 3px everywhere a contained surface meets its background, in `steel-blue-border` or `muted-steel-border` — rather than a thin 1px hairline. The chest-icon logo and all glyph icons render at `image-rendering: pixelated` / `shapeRendering: crispEdges`, so edges stay blocky even when scaled.

### Named Rules
**The Square Corner Rule.** No element in this system ever receives a border-radius. A rounded corner is an immediate departure from the brand and should be treated as a bug, not a style choice.

## Components

Buttons, cards, and badges all share one tactile language: thick square borders, a hard offset shadow, and — for anything clickable — the Press Rule on hover. Component "character" comes entirely from color role (gold = act now, green = succeeded, red = failed, neutral steel = informational) rather than from varying shape.

### Buttons
- **Shape:** hard rectangle, no radius, 3px border.
- **Primary:** `treasure-gold` background, `treasure-gold-border` border, `treasure-shadow` text, `shadow-hard`, padding `py-3 px-4` (or `px-4 py-2` for compact nav-style CTAs).
- **Hover / Focus:** `hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]` (the Press Rule); focus uses a `3px` ring in `treasure-gold` (`focus:ring-[3px] focus:ring-focus-ring`), not a glow or outline.
- **Disabled:** `opacity-50`, shadow and position pinned at rest (`disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0`) — a disabled button visibly cannot be pressed.

### Badges / Tags
- **Style:** small rectangular chip, 3px border, `text-xs uppercase tracking-wide font-semibold`, often paired with a `PixelIcon`.
- **Variants:** neutral (`arcade-panel` / `steel-blue-border`, used for division badges), gold ("Nouveau"), green/`victory-green-surface` ("Réussi"), and dimmed (`panel-shadow` / `muted-steel-border`, "Verrouillé").

### Cards / Containers
- **Corner Style:** square (no radius).
- **Background:** `arcade-panel`, border `steel-blue-border`, `shadow-hard`.
- **Border:** 3px, always present — a card is never borderless.
- **Internal Padding:** `p-6` (compact: stat cards, quiz cards) or `p-8` (auth forms).
- **Locked state:** `opacity-60` plus a `cabinet-black/80` scrim with a centered lock icon, rather than a different border/shadow treatment.

### Inputs / Fields
- **Style:** `panel-shadow` background, 3px `steel-blue-border` border, square corners, generous `px-4 py-3` padding.
- **Focus:** `focus:ring-[3px]` in `treasure-gold` (`focus-ring` token), no border-color shift.
- **Error:** the field itself doesn't re-color; errors surface as a separate `alert-red-surface` banner above the form, bordered in `alert-red`.

### Navigation
- **Style:** fixed `cabinet-black` bar, `h-16`, never theme-swaps. Items are uppercase label-style text + `PixelIcon`, `px-4 py-2`; active item gets a solid `treasure-gold` fill (no underline/indicator line), inactive items are `on-ink/70` with a `hover:bg-white/10` wash.
- **Mobile:** nav links collapse out of the bar (no bottom tab bar observed); the brand wordmark hides below `sm`, leaving only the chest icon.

### Division Ladder (signature component)
The division system (Bronze → Challenger) is the product's core visual signature, not a generic status chip: each division gets its own pixel-icon badge and a reserved brand color (Bronze `#CD7F32`, Silver `#C0C0C0`, Gold `#FFD700`, Platine `#E5E4E2`, Diamond `#B9F2FF`, Master `#9B59B6`, Challenger `#FF1493`) used only for that division's icon/progress-bar fill — these division colors sit outside the core palette and must never be reassigned to a different division or reused as a generic UI color. The top-3 leaderboard ranks get a dedicated pixel-art medal (gold/silver/bronze metal gradient) instead of the division badge.

## Do's and Don'ts

### Do:
- **Do** keep every border at exactly 3px and every corner at 0 radius — consistency here is what reads as "one system" rather than "mismatched components."
- **Do** use the Press Rule (`shadow-hard` → `shadow-none` + `translate-x-[3px] translate-y-[3px]`) for anything clickable with a shadow; a shadowed element that doesn't press on hover reads as broken.
- **Do** reserve Treasure Gold for actionable/noteworthy states (CTAs, active nav, new/passed, promotion progress) — not as a general decorative color.
- **Do** render all icons as flat monochrome pixel glyphs (`PixelIcon`, 8×8 grid, `currentColor`, `crispEdges`) rather than introducing a smooth icon library.
- **Do** use uppercase + wide tracking for every badge, tag, and label.

### Don't:
- **Don't** add a border-radius anywhere, including "just this once" for a new component — it breaks the Square Corner Rule immediately and visibly.
- **Don't** introduce a second accent hue; a new "important" state should borrow Treasure Gold, size, or iconography, not a new color.
- **Don't** add a soft/blurred shadow, glow, or gradient for elevation — the system has exactly one elevation idiom (the hard offset shadow) and importing a Material-style soft shadow is an instant departure from the brand.
- **Don't** reuse a division's reserved color (Bronze/Silver/Gold/.../Challenger) for anything other than that division's own badge, icon, and progress fill.
