---
target: dashboard
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:/Users/Guirec/Documents/GitHub/codinquest/app/dashboard/page.tsx"
target_fingerprint: "sha256:8d5f3913038e57c37ee641a632f26018ab94a078997eaa5ad5b36e28f153b7c0"
target_path: /Users/Guirec/Documents/GitHub/codinquest/app/dashboard/page.tsx
timestamp: 2026-10-15T16-43-10Z
slug: app-dashboard-page-tsx
closed: true
---
Method: dual-agent (A: design-review subagent · B: detector/browser-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Division/points/promotion state is clear and live; no major gaps. |
| 2 | Match System / Real World | 4 | Ranked-ladder language is consistent and in-domain French throughout. |
| 3 | User Control and Freedom | 3 | Locked cards have no `<Link>` at all (can't misclick), but no way to collapse/skip irrelevant locked levels. |
| 4 | Consistency and Standards | 3 | Press Rule, badge grammar, uppercase labels all consistent — but DESIGN.md's documented focus ring is implemented nowhere on this surface, and gold appears off-spec on 2/3 stat icons. |
| 5 | Error Prevention | 4 | Locked quizzes are structurally unclickable, not just visually discouraged. |
| 6 | Recognition Rather Than Recall | 4 | Passing-score legend, progress caption, and division badge all keep state visible instead of requiring memory. |
| 7 | Flexibility and Efficiency | 2 | No resume/next-quiz shortcut, no collapse of locked levels, no filter. |
| 8 | Aesthetic and Minimalist Design | 3 | Strong adherence to the system's language; docked for a redundant level-name chip and doubled lock iconography on locked cards. |
| 9 | Error Recovery | 2 | `layout.tsx`'s division re-fetch silently swallows failures (`.catch(() => {})`) with no retry or indication. |
| 10 | Help and Documentation | 2 | The new inline rule explanation is good, but there's still no link to the full division order from the dashboard. |
| **Total** | | **31/40** | **Good** |

*(Previous run: 25/40, Acceptable — +6 points.)*

## Design Specificity Verdict

**LLM assessment:** The fixes are genuinely authored for this product, not generic polish — the Crown/Zap promotion treatment deliberately quotes the leaderboard's podium language, the difficulty badges use a weight-progression instead of borrowing a hue, and the Target glyph now reads as a bullseye. What's missing is the *next* layer of specificity: the page still renders all 7 divisions' content flatly regardless of what's reachable, and Treasure Gold has crept onto two passive stat icons that have nothing to do with the "chase this" semantics the color is reserved for.

**Deterministic scan:** `impeccable detect --json app/dashboard components` ran clean (exit 0, zero findings) — confirmed as a genuine clean scan, not a silent failure.

**Visual overlays:** Still blocked by the app's site-wide CSP (`script-src 'self'`), confirmed again via a `securitypolicyviolation` event — same restriction as the first run, not a regression. No overlay available in the **[Human]** tab this session either.

## Overall Impression

Real, measurable improvement (+6 points) and every fix lands exactly where it was supposed to — the Press Rule works on hover, the recolored badges no longer fight the accent, and the promotion moment genuinely borrows the Leaderboard's energy. What's left is a mechanical accessibility gap (no focus-visible ring anywhere despite DESIGN.md mandating one) and a page-density problem the prior pass didn't touch: all 7 divisions render in full regardless of what a player can actually reach.

## What's Working

- **Press Rule verified live**: hovering a non-locked quiz card flips the border gold, drops the shadow, and shifts the card +3px/+3px exactly per spec.
- **Surgical recoloring**: difficulty badges and the lock banner use a weight-based neutral-steel progression rather than a lazy gray swap, staying differentiated without touching a second accent hue.
- **Rule transparency in the ladder's own voice**: the consecutive-win caveat sits directly under the mechanic it explains, and the Crown/Zap treatment reuses leaderboard iconography — the dashboard now feels like one system with the leaderboard rather than two different apps.

## Priority Issues

**[P1] No focus-visible treatment anywhere on this surface, despite DESIGN.md mandating one**
- **Why it matters:** Verified via computed styles — a focused quiz-card link and the sign-out button both fall back to the browser's default blue outline, not the documented `focus:ring-[3px] focus:ring-focus-ring` gold ring. Confirmed independently: `focus:ring`/`focus-visible` classes exist only on the two auth form inputs in the whole codebase, nowhere else. This directly contradicts the system's own written spec and is a real keyboard-accessibility gap.
- **Fix:** Add `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring` to the QuizCard link wrapper, nav links, and sign-out button (and audit the rest of the app while there).
- **Suggested command:** `/impeccable harden`

**[P2] All 7 levels render unconditionally; locked content isn't collapsed**
- **Why it matters:** A Bronze player scrolls past ~30 fully-locked cards across 5 levels before/after their 12 actionable ones — feeds both the cognitive-load and flexibility-of-use gaps, and dilutes the new Crown/Zap celebratory work since the page's dominant visual mass is gray locked content, not the player's next step.
- **Fix:** Collapse locked levels into a single summary ("5 niveaux verrouillés · prochain : Silver"), auto-expanding only the current and next level.
- **Suggested command:** `/impeccable layout`

**[P3] The new streak-reset caption fails contrast (~3.85:1, needs 4.5:1)**
- **Why it matters:** The `text-text-secondary/80` opacity modifier on the line added to fix "the rule is never explained" drops it below AA for normal text — undermining that very fix's accessibility.
- **Fix:** Drop the opacity modifier; plain `text-text-secondary` alone measures ~5.2:1 and passes.
- **Suggested command:** `/impeccable polish`

**[P3] Treasure Gold used decoratively on 2 of 3 stat-card icons, off-spec per the One Accent Rule**
- **Why it matters:** "Score Total" and "Taux de Réussite" icons both use `text-accent`; neither is a CTA, active-nav, new/passed, or promotion state — the exact categories DESIGN.md reserves gold for. This dilutes the "look here" signal the same page's new Crown/Zap banners depend on.
- **Fix:** Make stat icons neutral/steel by default; reserve gold for at most one stat.
- **Suggested command:** `/impeccable quieter`

No P0 found — nothing breaks the Square Corner Rule, the No-Blur Rule, or blocks task completion.

## Persona Red Flags

**Alex (Power User):** still forced to scroll past ~30 locked cards every visit with no collapse/jump-to-current-level shortcut; tabbing to a quiz card produces the browser's default blue outline instead of the system's gold ring — jarring for keyboard navigation.

**Sam (Accessibility-Dependent User):** confirmed via devtools that keyboard focus on the quiz-card link and sign-out button gets no custom ring at all; the newly-added streak-reset line measures under WCAG AA contrast. Both measured, not assumed.

**Jordan (First-Timer):** the previously-flagged "promotion rule never explained" red flag is **resolved** — both the rule and the reset caveat are now visible. Remaining gap: "Division Silver requise" still assumes Jordan already knows the division order, with no inline link to the full ladder.

## Minor Observations

- Each quiz card repeats a `levelName` chip that duplicates the enclosing section's own header.
- Locked cards show the lock glyph twice (centered overlay + "Verrouillé" badge) — could consolidate to one.
- The per-quiz `passingScore` override path reads correctly in source but wasn't exercised live (every seeded quiz in the test account is exactly 70%).
- Mobile viewport still could not be independently verified — `resize_window` did not change the rendered viewport in this environment (same known quirk as the first run). Treat any mobile-layout claim as unconfirmed, not as a pass.

## Questions to Consider

- If the ladder metaphor is "climb one rung at a time," should a Bronze player see Diamond/IA content behind a lock at all — or does showing the full climb up front serve retention better than hiding it?
- Treasure Gold now lights up two passive stat icons *and* the Crown/Zap promotion cues on the same screen — once a player is promotion-ready, does gold still interrupt the way the One Accent Rule intends, or has it already become wallpaper by the time it needs to shout?
