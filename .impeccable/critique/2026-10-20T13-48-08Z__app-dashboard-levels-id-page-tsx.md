---
target: level-detail
total_score: 28
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 1
target_identity: "file:/Users/Guirec/Documents/GitHub/codinquest/app/dashboard/levels/[id]/page.tsx"
target_fingerprint: "sha256:9b17445bdd556dceec26a3798eba714301c9cf0ad0ca2a7b6fe5ab1726a03e49"
target_path: /Users/Guirec/Documents/GitHub/codinquest/app/dashboard/levels/[id]/page.tsx
timestamp: 2026-10-20T13-48-08Z
slug: app-dashboard-levels-id-page-tsx
---
Method: dual-agent (A: design-review subagent · B: detector/browser-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress bar + count + % are all present and consistent; no live-region for score changes. |
| 2 | Match System / Real World | 4 | French copy and terminology read naturally. |
| 3 | User Control and Freedom | 3 | Breadcrumb works; no way to jump between adjacent levels without leaving. |
| 4 | Consistency and Standards | 2 | Inline-duplicated quiz card diverges from `QuizCard.tsx` — same concept, two implementations that disagree. |
| 5 | Error Prevention | 4 | Locked quizzes render no `<Link>` at all — can't be mis-clicked into a dead end. |
| 6 | Recognition Rather Than Recall | 4 | Difficulty, question count, best score, pass/fail icon all visible without navigating in. |
| 7 | Flexibility and Efficiency | 2 | No keyboard-visible focus anywhere on the page. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean hierarchy; the progress row has no responsive wrap and crowds at narrow widths. |
| 9 | Error Recovery | 3 | Failed attempts show a red border + red best-score clearly; no "see what you got wrong" link. |
| 10 | Help and Documentation | n/a | No help affordance expected on this surface, consistent with the rest of the app. |
| **Total** | | **28/36** | **Good** (heuristic 10 marked n/a, denominator renormalized) |

## Design Specificity Verdict

**LLM assessment:** Authored in the house style, but largely redundant with the dashboard — `app/dashboard/page.tsx` already renders every unlocked level's full quiz grid using the real `QuizCard` component. What this page legitimately adds (breadcrumb, per-level progress bar, a full view of a *locked* level's quizzes) is delivered via a hand-rolled duplicate of `QuizCard`'s markup that has already drifted from the original — so instead of reinforcing the system, it now reads as two different card designs for the same concept.

**Deterministic scan:** Clean, zero findings. Confirmed the earlier fixes from this session (neutral locked-state banner, shared `difficultyConfig`) are still correctly in place — no raw Tailwind colors, no `alert-red` on the locked banner.

**Visual overlays:** Blocked by the same site-wide CSP confirmed on every prior page — not a regression.

## Overall Impression

The locked-state and difficulty-badge fixes from earlier this session hold up perfectly here. What's new on this pass: this page's own quiz card was never ported to match `QuizCard`'s later fixes (no "Nouveau" badge, no conditional passing-score note — even though `passingScore` is already fetched and sitting unused), and it never had a focus ring to begin with — not a regression, an original gap.

## Priority Issues

**[P0] No focus-visible ring on any interactive element on this page**
- **Why it matters:** Confirmed via grep — zero `focus` matches in the file. Both breadcrumb links, the not-found page's link, and every quiz card's CTA lack any focus-ring class, while `QuizCard.tsx` (the component this page duplicates instead of reusing) already has it. A keyboard-only user tabbing through this page — whose entire job is "pick a quiz and go" — gets no visible indication of where they are at all.
- **Fix:** Add `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring` to both breadcrumb links, the not-found link, and the quiz-card CTA link.
- **Suggested command:** `/impeccable harden`

**[P1] Inline quiz-card markup has drifted from `QuizCard.tsx`**
- **Why it matters:** This page reimplements the quiz card instead of importing `QuizCard`. Since this session's earlier fixes to `QuizCard`, the two have diverged: no "Nouveau" badge for untried quizzes, no conditional passing-score note (even though `quiz.passingScore` is already fetched by `getLevelById` and sits completely unused here), and — per P0 — no focus ring. Every future fix to `QuizCard` will silently exclude this page unless someone remembers to hand-port it.
- **Fix:** Add an optional `showStatusBorder` prop to `QuizCard` (default `false`, preserving the dashboard's current look exactly) for the permanent pass/fail border this page's inline version has that `QuizCard` doesn't; import and use `QuizCard` here for unlocked quizzes with that prop enabled, passing `passingScore` through. Keep this page's own locked-card markup as-is (no `<Link>` at all) since that's a genuinely correct, distinct pattern worth preserving.
- **Suggested command:** `/impeccable distill`

**[P2] No completion/celebration state at 100%**
- **Why it matters:** `progressPercentage === 100` renders through identical styling as 40% or 80% — no color change, no badge, no copy swap. PRODUCT.md names competition/promotion "the retention engine, not window dressing"; finishing a level in full is a legitimate small win this page currently spends zero gold on.
- **Fix:** At 100%, swap the "Progression du niveau" label for a gold-accented "Niveau terminé" state (fill the bar fully gold, add a checkmark icon next to the heading) — reuses the existing Treasure Gold token, no new color.
- **Suggested command:** `/impeccable delight`

**[P3] The "Progression du niveau" row has no responsive handling and crowds at mobile widths**
- **Why it matters:** Verified via a genuine narrow-viewport iframe test (confirmed ~390px via `contentWindow.innerWidth`, since `resize_window` doesn't work in this environment) — the row keeps its label and count on one line with no wrap rule, sitting edge-to-edge at narrow widths. This page uses only 5 responsive-prefix tokens across 2 breakpoints vs. `layout.tsx`'s 9 across 3.
- **Fix:** Add `flex-col sm:flex-row sm:items-center` to that row, matching the pattern already used on the header block one section up.
- **Suggested command:** `/impeccable polish`

No P0 beyond focus rings — nothing here fabricates content or breaks a hard DESIGN.md invariant.

## What's Working

- **The locked-state fix holds up in practice**: visiting a SILVER-gated level renders the banner and per-card lock scrims in neutral tones — confirmed live, no red anywhere.
- **No-`<Link>` locked cards is a quietly correct call**: locked quizzes render a plain `<div>`, never a `<Link>` with an intercepted click, so a screen reader or keyboard user never lands on a dead control.
- **Permanent border-color state** (green=passed, red=failed-attempt, neutral=untried) gives at-a-glance status the dashboard's `QuizCard` doesn't have at rest — genuinely useful information density worth carrying into the shared component (see P1 fix).

## Cognitive Load

Failing items: **consistent patterns** (a second, diverging implementation of a pattern the app already established), **clear affordances for interactive elements** (zero focus-visible styling anywhere). **Rating: moderate** — the static layout itself is simple and well-chunked, but the missing focus system and component drift push it past "low."

## Persona Red Flags

**Sam (Accessibility-Dependent User):** tabbing through this page gives no visible focus indication anywhere — a hard blocker for keyboard-only navigation on a page whose core task is picking a quiz.

**Jordan (First-Timer):** lands here expecting something distinct from the dashboard, finds nearly the same cards again, slightly worse (no "Nouveau" flag).

**Alex (Power User):** reaching 100% on a level produces no signal distinct from 60%.

## Minor Observations

- Quiz `description` is `line-clamp-2`'d, but `title` isn't — an unusually long title could wrap 3+ lines and push the pass/fail icon awkwardly high.
- `difficultyConfig`'s HARD variant wasn't visible in any sampled level (all shown were MEDIUM) — worth a spot-check once reachable, though token values confirm contrast is fine on paper.
- `app/globals.css`'s `shadow-hard` composition fix is confirmed in place — once focus rings are added here (P0), they'll render correctly on `shadow-hard` elements with no follow-up needed.

## Questions to Consider

- If the dashboard already renders every unlocked level's full quiz grid, what is this route actually *for* on the unlocked path — is per-level progress % alone worth a dedicated page and a second card implementation, or should the dashboard grow a per-level progress strip and this route collapse to just the locked-level view?
- Given the anti-cheat invariant that only first-pass counts, should a failed re-attempt on an already-passed quiz still render with a red border here — currently it won't (a passed quiz always shows green) — is that communicated clearly enough that a player doesn't fear a "Refaire" attempt risking their stats?
