---
target: history
total_score: 20
max_score: 36
na_heuristics: 5
p0_count: 2
p1_count: 2
target_identity: "file:/Users/Guirec/Documents/GitHub/codinquest/app/dashboard/history/page.tsx"
target_fingerprint: "sha256:057091654a5ecbf608fa25de1462df62d34c6df52928a93d2776d828adf360de"
target_path: /Users/Guirec/Documents/GitHub/codinquest/app/dashboard/history/page.tsx
timestamp: 2026-10-20T13-29-54Z
slug: app-dashboard-history-page-tsx
---
Method: dual-agent (A: design-review subagent · B: detector/browser-evidence subagent)

⚠️ Mobile could not be visually confirmed this session (the srcdoc-iframe workaround was blocked by this run's own tool-permission classifier). Mobile findings below are inferred from source (breakpoint-prefix count, flex-wrap behavior), not visually verified.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Filter counts update live correctly, but active-filter state is color-only — no `aria-pressed` for assistive tech. |
| 2 | Match System / Real World | 3 | Correctly labeled, but copy is generic quiz-app language, not the ranked-ladder metaphor the rest of the product leans on. |
| 3 | User Control and Freedom | 2 | No way to act on what you see — a failed attempt's natural next step (retry) has no link anywhere. |
| 4 | Consistency and Standards | 1 | Difficulty badges use raw `green-500/yellow-500/red-500` instead of the system's tokens, and every interactive element on the page lacks the documented focus ring — two system rules broken on one page. |
| 5 | Error Prevention | n/a | Read-only display page; no destructive or input actions exist. |
| 6 | Recognition Rather Than Recall | 4 | Pass/fail signaled via icon + border + chip + text; passing threshold shown alongside the score. |
| 7 | Flexibility and Efficiency | 1 | Only 3 filter states; silent 100-attempt cap; no sort, search, or per-quiz grouping. |
| 8 | Aesthetic and Minimalist Design | 3 | Pass/fail state signaled up to four times per card — reinforcing, borders on noisy. |
| 9 | Error Recovery | 2 | Failures framed non-judgmentally, but no recovery path (no retry CTA) is offered. |
| 10 | Help and Documentation | 1 | The "only first pass counts" rule — the entire reason repeat attempts exist — is invisible here. |
| **Total** | | **20/36** | **Acceptable** (heuristic 5 marked n/a, denominator renormalized) |

## Design Specificity Verdict

**LLM assessment:** Reads as a generic "list of past attempts" admin table wearing the neo-brutalist skin, not a page authored for CodeInQuest's ranked-ladder identity. It never imports `DivisionBadge`, never references streaks or promotion, and gives zero visibility to the product's own anti-cheat rule — even though the seeded test account's own history (3 fails + 1 pass on the same quiz) is exactly the scenario that rule exists for. One genuine bright spot: the per-card progress bar renders a tick mark at the passing-score threshold — a bespoke touch tied to a real business rule, not boilerplate.

**Deterministic scan:** `impeccable detect` ran clean (zero findings) — confirmed as a genuine clean result (re-verified with `--no-config` and checked for suppression files/inline ignores, none found). This is a real gap between the detector's regex coverage and what a manual pass turns up: the raw-Tailwind-color badges sit in plain sight and the detector missed them entirely.

**Visual overlays:** Blocked by the same site-wide CSP confirmed on every prior page — not a regression.

## Overall Impression

The filter pills get color tokens exactly right (`bg-success`/`bg-error`/`bg-accent`), which makes the difficulty badges sitting right next to them on raw Tailwind colors even more visible as an inconsistency — the page visibly disagrees with itself. Structurally, this is also the one surface in the whole critique sweep where the product's signature mechanic (the anti-cheat first-pass rule) is actively happening in the test data and completely invisible in the UI.

## Priority Issues

**[P0] Difficulty badges use raw, unauthorized Tailwind colors**
- **Why it matters:** Confirmed in source — `difficultyConfig` (lines 51-55) hard-codes `bg-green-500/20 text-green-400`, `bg-yellow-500/20 text-yellow-400`, `bg-red-500/20 text-red-400`, introducing a yellow hue that exists nowhere else in the system (violating the One Accent Rule) and shades that don't match `victory-green`/`alert-red` used two elements away on the same card. This is the exact anti-pattern already fixed in `QuizCard.tsx` and `levels/[id]/page.tsx` earlier this session — and a shared, neutral `lib/quiz/difficulty.ts` config already exists specifically to prevent this drift.
- **Fix:** Replace the local `difficultyConfig` with an import from `lib/quiz/difficulty.ts` (already shared with `QuizCard` and the level detail page).
- **Suggested command:** `/impeccable colorize`

**[P0] No focus-visible ring on any interactive element**
- **Why it matters:** Confirmed via grep — zero `focus`/`focus-visible` classes anywhere in the file, across the 3 filter buttons and the empty-state CTA. DESIGN.md explicitly documents this treatment for every interactive element; this page is the one outlier, right after a session that specifically fixed a `shadow-hard`/focus-ring composition bug elsewhere.
- **Fix:** Add `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring` to all 4 buttons.
- **Suggested command:** `/impeccable harden`

**[P1] No retry/review link from any history row**
- **Why it matters:** Confirmed in source — each attempt card is a plain `<div>` with no `onClick`, `Link`, or `href` anywhere. The single most natural action after seeing a failed attempt — try the quiz again — doesn't exist, undercutting both "user control" and the "track your growth" framing the page could otherwise have.
- **Fix:** Link each card (or an explicit per-card CTA) to the quiz's play page (`/dashboard/quiz/[id]`), styled with the Press Rule like the empty-state CTA already does.
- **Suggested command:** `/impeccable clarify`

**[P1] The anti-cheat "first pass only counts" rule is invisible on the one page that shows it happening**
- **Why it matters:** The seeded test account's own history (fail, fail, fail, pass — all on the same quiz) is exactly the scenario PRODUCT.md's anti-cheat invariant governs, yet nothing on the page distinguishes the attempt that actually counted from the ones that didn't. This is a trust-critical mechanic ("le classement doit rester gagné, pas gaméable") on the one page a confused player would visit to understand why a repeat pass didn't move their score.
- **Fix:** Within the already-fetched attempt list, compute the earliest passed attempt per `quiz.id` client-side and add a small "Comptabilisé" label on that one row (best-effort within the page's 100-attempt window — not a new backend query).
- **Suggested command:** `/impeccable clarify`

**[P2] Flat, ungrouped list doesn't scale for repeat-heavy history**
- **Why it matters:** `getUserHistory` caps at 100 attempts with no pagination UI, and every attempt renders chronologically with no per-quiz grouping. A quiz attempted 10+ times produces a long, repetitive scroll of near-identical cards — the direct cause of the cognitive-load failures below.
- **Fix:** Group repeat attempts per quiz into a collapsed cluster (latest/best shown, older attempts expandable), or at minimum surface a visible "100 tentatives les plus récentes" boundary note.
- **Suggested command:** `/impeccable distill`

No P0 beyond the two listed — nothing here fabricates content or leaks data; both issues above are real, confirmed system-rule violations.

## What's Working

- **Empty states are genuinely well-handled**: a true zero-history state gets encouraging copy + a CTA back to `/dashboard`; a zero-results-for-filter state gets a distinct, correctly-scoped message. Both confirmed in source and live.
- **Filter pills correctly use design tokens**: active "Réussis"/"Échoués" states render `bg-success`/`bg-error`, not raw Tailwind — this is the exact pattern the difficulty badges should have followed.
- **The score-bar passing-threshold tick mark**: a small, specific touch tied to the actual `passingScore` business rule rather than being decorative.

## Cognitive Load

Failing items: **chunking** (each card surfaces ~11 discrete data points with no sub-grouping), **one-thing-at-a-time** (the default "Tous" view dumps every attempt into one flat, equally-weighted scroll), **progressive disclosure** (full detail shown for every row at all times, no summarized view for repeat attempts of the same quiz).

**Rating: Moderate, trending toward High** for any account with meaningful history — the seeded test account already shows the pattern (4 rows for one quiz, no summarization).

## Persona Red Flags

**Jordan (First-Timer):** the empty state is solid, but on a second visit — after a retry that doesn't move the score — nothing explains why (P1).

**Alex (Power User):** no sort/search/grouping; zero tie to the division/streak system; the invisible first-pass rule directly affects how Alex interprets their own practice attempts.

**Riley (Stress-Tester):** found the raw-Tailwind-color anti-pattern exactly where expected; found the missing focus rings by keyboard-tabbing; the attempt cards have `transition-all` and `shadow-hard` — they *look* clickable but have no `onClick`/`href` at all, a false affordance Riley would immediately probe and find dead.

## Minor Observations

- `formatTimeSpent` treats `timeSpent === 0` the same as `null` (`if (!seconds) return 'N/A'`) — conflates "not tracked" with "took zero seconds."
- Responsive breakpoint count is 6 in this file vs. 9 in `layout.tsx` — not inherently wrong (Tailwind is mobile-first), but the filter-pills row has no `flex-wrap` fallback if labels don't fit a narrow viewport — not visually confirmed this session, worth a real-device check.
- Per-card information density (~11 data points) gets no visual de-emphasis of secondary fields (time spent, min score) regardless of recency or relevance.

## Questions to Consider

- If the ranking ladder is "le moteur de rétention, pas un habillage," why does the one page showing a player's entire competitive history never reference divisions, streaks, or promotions at all?
- Would simply labeling the counting attempt turn "here are your mistakes" into "here's proof you're improving"?
