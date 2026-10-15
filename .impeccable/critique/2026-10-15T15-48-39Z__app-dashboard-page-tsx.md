---
target: dashboard
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:/Users/Guirec/Documents/GitHub/codinquest/app/dashboard/page.tsx"
target_fingerprint: "sha256:9988adfed8a979607978616f060d1365b6cea1ed4661b4fce2057626a75c99f1"
target_path: /Users/Guirec/Documents/GitHub/codinquest/app/dashboard/page.tsx
timestamp: 2026-10-15T15-48-39Z
slug: app-dashboard-page-tsx
closed: true
---
Method: dual-agent (A: design-review subagent · B: detector/browser-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Promotion progress bar is clear and live, but stat values ("8", "100%") carry no trend/delta — no sense of "this went up since last visit." |
| 2 | Match System / Real World | 3 | French copy is natural, but the "Taux de Réussite" pixel icon (a plain nested square at 8×8) doesn't read as a target/bullseye. |
| 3 | User Control and Freedom | 3 | Locked quiz cards correctly render with no `<Link>` at all rather than a dead-end click — deliberate, correct. |
| 4 | Consistency and Standards | 2 | `QuizCard` is the system's most-clicked element and the only `shadow-hard` surface that does **not** implement DESIGN.md's own Press Rule on hover. |
| 5 | Error Prevention | 3 | Locked quizzes are structurally unclickable; no destructive actions live on this page. |
| 6 | Recognition Rather Than Recall | 3 | Division badge shown redundantly (navbar + hero) is good; "MOYEN" difficulty chip is near-indistinguishable from "NOUVEAU" at a glance. |
| 7 | Flexibility and Efficiency | 1 | No sort/filter/jump-to-incomplete on the Niveaux list, unlike `/dashboard/history` which has Tous/Réussis/Échoués pills. |
| 8 | Aesthetic and Minimalist Design | 3 | "Score minimum requis : 70%" is printed on every single card despite being a fixed system-wide constant — disclosed 20+ times instead of once. |
| 9 | Error Recovery | 2 | No first-time nudge copy for a 0-attempts user at the stats level; only one quiz-list empty state exists. |
| 10 | Help and Documentation | 2 | The core "3 réussites réellement consécutives" promotion rule — PRODUCT.md's own anti-cheat invariant — is never explained anywhere on the dashboard. |
| **Total** | | **25/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment (Assessment A):** The pixel-icon system, hard-offset shadows, and division badge are consistently applied, so this isn't a bare template — but the dashboard itself reads as a generic "stats + card list" admin screen wearing the retro-arcade skin, not a screen authored for a ranked ladder. Tellingly, the Leaderboard page delivers the "climbing a competitive ladder" feeling far better (gold podium tile, crown "Top 3" label, medal icons) — proving the visual language exists in this codebase but wasn't carried into the primary daily-use surface. Swap "division" for "tier" and "quiz" for "lesson" and this reads as Duolingo's or any LMS's dashboard.

**Deterministic scan (Assessment B):** `impeccable detect --json app/dashboard components` ran cleanly (exit 0) across 21 real source files and returned **zero findings** — no rule-based style violations. This is worth reading correctly: it means nothing is breaking a documented DESIGN.md invariant at the single-element level (no stray border-radius, no stray soft shadow). It does **not** mean the page is well-designed — all of Assessment A's priority issues below are systemic/cross-component consistency and semantic-color problems (the Press Rule missing on one component type, a difficulty color colliding with the brand accent), which a static regex-style detector structurally cannot catch. The two assessments agree in the sense that they're measuring different things, and neither contradicts the other.

**Visual overlays:** Injection failed — not because of a tooling problem, but because the app enforces a strict `Content-Security-Policy: script-src 'self'` header on every route. Assessment B confirmed the detector's `detect.js` endpoint itself serves correctly (200 OK, valid CORS) and that plain DOM mutation (e.g. `document.title`) succeeds on the page; the browser blocked only the cross-origin `<script src>` load, with a `securitypolicyviolation` event naming `script-src-elem`. No user-visible overlay is available in the **[Human]** tab for this run. Note for future sessions: this CSP applies site-wide, so live-mode/overlay-based Impeccable commands will hit the same wall on every route of this app unless run against a temporarily relaxed CSP (with the user's consent) or via a different inspection path.

## Overall Impression

The system is legible and consistent at the token level (one accent, one shadow, zero radius — all holding up), but the dashboard — the screen a logged-in player sees every single day — undersells the one thing that makes CodeInQuest different from a generic quiz app: the ranked ladder. The biggest opportunity is pulling the Leaderboard's podium/crown/gold-tile energy back into the dashboard's promotion moment, instead of reducing "you're 1 win from Gold" to a thin gray bar with `text-xs` helper copy.

## What's Working

- **Locked-level treatment**: the "DIVISION SILVER REQUISE" per-card scrim + lock icon + `opacity-60`, with no `<Link>` rendered at all for locked cards (not just a disabled click target) — a real anti-cheat-aligned engineering choice that also reads clearly as "this is ahead of you" rather than a dead end.
- **The Press Rule on primary buttons**: sign-out/sign-in buttons sell the "physical cartridge button" feel exactly as DESIGN.md specifies — shadow disappears, element presses in on hover.
- **Persistent division status**: the division badge appears in both the navbar and the hero card, reinforcing the product's core differentiator without needing a second page visit.

## Priority Issues

**[P1] Quiz cards don't follow the system's own Press Rule**
- **Why it matters:** DESIGN.md states explicitly that a shadowed, interactive element which doesn't press on hover "reads as broken." `QuizCard` — the single most-clicked element in the entire app (every quiz launch starts here) — only gets `hover:border-accent-border`, never the `hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]` treatment the buttons get. The inconsistency lands exactly where it's most visible.
- **Fix:** Add the Press Rule hover/active classes to the non-locked branch of `QuizCard`, matching the button treatment exactly.
- **Suggested command:** `/impeccable harden`

**[P2] The "MOYEN" difficulty badge collides with the Treasure Gold accent**
- **Why it matters:** `difficultyConfig.MEDIUM` uses a raw Tailwind `yellow-400/500`, which reads as near-identical to the brand's one accent color against the navy background. Since most seeded quizzes are MEDIUM difficulty, nearly every card carries 1-2 gold-toned chips — training the eye to ignore gold as "look here," which directly undermines DESIGN.md's own One Accent Rule everywhere else (CTAs, promotion, "new").
- **Fix:** Recolor EASY/MEDIUM/HARD badges to a neutral steel scale (icon-only differentiation, or reuse victory-green/alert-red strictly for pass/fail semantics) — difficulty is informational, not a "chase this" signal.
- **Suggested command:** `/impeccable colorize`

**[P2] The locked-level banner borrows the error color for a non-error state**
- **Why it matters:** The level-header "Division X requise" banner uses `alert-red` — the same red reserved (per DESIGN.md) for failed quiz attempts and sign-in errors — while `QuizCard`'s own "Verrouillé" badge correctly uses the neutral dimmed treatment. Being gated by division is a progression state, not a failure; a self-taught first-timer reading a red banner on login may read it as "I broke something," which is the wrong emotional note for a product whose whole premise is encouragement toward the next tier.
- **Fix:** Swap the level-header lock banner to the same dimmed/neutral steel treatment the per-card "Verrouillé" badge already uses; reserve red exclusively for actual failure.
- **Suggested command:** `/impeccable colorize`

**[P3] The "Taux de Réussite" icon doesn't read as a target**
- **Why it matters:** At the 8×8 pixel resolution used, the `Target` glyph renders as a plain nested square with no visible ring/bullseye cue — defeating the point of pairing an icon with a number for quick scanning on one of only 3 top-line stats.
- **Fix:** Redesign the 8×8 glyph with a visible concentric-ring pattern, or swap to a different icon metaphor legible at this resolution.
- **Suggested command:** `/impeccable polish`

**[P3] "Score minimum requis : 70%" is repeated on every single quiz card**
- **Why it matters:** Per PRODUCT.md, `passingScore` defaults to 70% system-wide, so this constant is disclosed 20+ times in one page scroll — reading weight with no added information for the common case (progressive disclosure failure).
- **Fix:** Move the passing-score note to a single page-level legend/tooltip; show it per-card only when a specific quiz's `passingScore` deviates from the default.
- **Suggested command:** `/impeccable distill`

## Persona Red Flags

**Jordan (First-Timer, PRODUCT.md's primary audience):**
- Hits a red "DIVISION SILVER REQUISE" banner on the very first scroll past HTML — reads as an error/failure rather than "something to look forward to" (same root cause as the P2 color issue above).
- The anti-cheat "3 réussites réellement consécutives" rule that defines the entire ranking mechanic is never explained — only implied by a countdown number — leaving a newcomer to guess what breaks a streak.
- The gold "MOYEN" badge next to an actual "Nouveau" CTA-colored badge risks being misread as "this is recommended" rather than "this is medium difficulty."

**Alex (Power User):**
- No sort/filter/jump-to-incomplete on the Niveaux list — forced to scroll past already-passed quizzes every session to reach new content in lower-priority levels.
- No streak/momentum indicator distinguishing "1 win from promotion today" from a cold start, despite the promotion mechanic being PRODUCT.md's stated core retention driver.

**Sam (Accessibility-Dependent User):**
- The standalone `CheckCircle2` "passed" icon floating top-right of a `QuizCard` has no `aria-label` and no visible text pairing — conveys "passed" to sighted users only; a screen reader gets nothing until it reaches the redundant "Réussi" badge further down.
- `faded-steel` (#8a93ad) secondary text on `arcade-panel` (#1b2133) — used for card descriptions and the repeated "score minimum requis" line — is a low-saturation gray-on-navy pairing worth a dedicated contrast-ratio check; it's the kind of combination that often falls under 4.5:1 at the `text-xs`/`text-sm` sizes used here.

## Minor Observations

- The "Admin" chip and "BRONZE" division badge in the navbar share identical border treatment, reading as one combined unit rather than two separate pieces of identity info.
- The green "passed" checkmark icon and the "RÉUSSI" text badge on the same card are two redundant signals for one state — reinforcing, but adding to an already dense card.
- The division progress bar fills in the player's *current* division color rather than hinting at the *next* division's color — a missed chance to visually preview what's being climbed toward.
- The app enforces a site-wide CSP (`script-src 'self'`) that blocks any future Impeccable live-mode/overlay session on this app without a deliberate, consented CSP exception — noted for awareness, not a defect.

## Questions to Consider

- If the Leaderboard page can deliver a podium, a crown, and a glowing gold "#1" tile, why does the page a signed-in player sees every single day reduce the same ranked-ladder mechanic to a thin gray progress bar?
- The One Accent Rule exists so gold means "look here, this matters" — if an inert, non-actionable metadata label ("MOYEN") also gets gold, what is Treasure Gold actually training users to notice anymore?
- PRODUCT.md calls the 3-consecutive-win promotion rule the product's core differentiating, deliberately-arbitrated mechanic — why does the dashboard never explain it, leaving the named target user (a self-taught first-timer) to reverse-engineer the rule from a countdown number?
