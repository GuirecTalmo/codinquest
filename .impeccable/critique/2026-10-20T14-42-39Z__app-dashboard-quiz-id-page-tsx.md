---
target: page de quiz (app/dashboard/quiz/[id]/page.tsx + QuizRunner/QuizQuestion/QuizTimer/QuizReview)
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
target_identity: "file:/Users/Guirec/Documents/GitHub/codinquest/app/dashboard/quiz/[id]/page.tsx"
target_fingerprint: "sha256:ad36722a8a78ebb05b5f131df398a163ba8d3b27614848a3c9dee2bde0078076"
target_path: /Users/Guirec/Documents/GitHub/codinquest/app/dashboard/quiz/[id]/page.tsx
timestamp: 2026-10-20T14-42-39Z
slug: app-dashboard-quiz-id-page-tsx
---
Method: dual-agent (A: design-review subagent · B: detector/browser-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Progress bar/counter is clear, but the one status that matters most — streak/division impact of this result — is never shown; no `role="progressbar"`, no `aria-live` region anywhere on the page |
| 2 | Match System / Real World | 3 | Clear French copy, exam-style lettered options, familiar QCM conventions |
| 3 | User Control and Freedom | 2 | Free navigation between questions is good; no save/resume, no exit confirmation, no undo after submit |
| 4 | Consistency and Standards | 2 | Missing focus rings present everywhere else in the app; "answered" jump-dots reuse Victory Green (reserved for success) regardless of correctness — confirmed live by both assessments |
| 5 | Error Prevention | 2 | Validates all-answered before submit, but via a raw `alert()` that breaks the entire visual system |
| 6 | Recognition Rather Than Recall | 3 | Options re-shown each question; jump dots give at-a-glance state |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts (1–4/arrows), no "flag for review," nothing for a power user to go faster with |
| 8 | Aesthetic and Minimalist Design | 3 | One question at a time, no clutter during the task |
| 9 | Error Recovery | 2 | A failed submit fetch dead-ends on "Retour au dashboard," discarding all 10 answers already chosen |
| 10 | Help and Documentation | 1 | Zero in-context explanation of scoring/streak rules — the dashboard explains them, the quiz never does |
| **Total** | | **21/40** | **Acceptable** |

## Design Specificity Verdict

**Split personality.** The per-question review (color + icon + explanation cards) and the answer-button "press" interaction are genuinely authored for this brand — a user who's only seen the dashboard would recognize the tactile language immediately here. But the moment that is supposed to be CodeInQuest's whole differentiator — the ranked-ladder streak — is entirely absent from this surface. Strip out the pixel borders and this could be any QCM app: a generic "Question X sur Y" counter, generic "Quiz réussi !"/"Quiz échoué," no streak, no division stakes. The dashboard, one click away, knows how to talk about the ladder; the screen where the ladder is actually won or lost doesn't.

**Deterministic scan**: `impeccable detect --json` ran clean across all six target files (`app/dashboard/quiz/[id]/page.tsx`, `QuizRunner.tsx`, `QuizQuestion.tsx`, `QuizTimer.tsx`, `QuizReview.tsx`, `InlineCode.tsx`) — **zero findings, exit code 0**. Worth naming as a detector blind spot rather than a clean bill of health: every real issue below (missing focus rings, missing ARIA, the native `alert()`, the green-before-correctness bug, the mobile overflow) is invisible to the automated scanner and was only caught by live browser inspection.

**Visual overlays**: injection of the detector's live-DOM overlay script failed — not from a scripting error, but because the quiz page's own CSP (`script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'`) blocks loading a cross-origin script from the live-server's port, confirmed via the page's response headers. No user-visible overlay is available from this run; the findings below rest on real screenshots and DOM/accessibility-tree reads instead, which both assessments independently gathered.

## Overall Impression

The actual mechanics of answering and reviewing a quiz are solid and mostly on-brand — this isn't a broken flow. What's missing is everything that makes CodeInQuest *CodeInQuest* rather than a generic quiz tool: the pass/fail moment never mentions the streak or division it just made or broke, accessibility semantics that are standard practice elsewhere in this app (focus rings, ARIA state) are simply absent here, and the mobile experience has at least one real, measured overflow problem. The single biggest opportunity: make the result screen say, out loud, what just happened to the player's ladder position — that's the one sentence this whole product exists to deliver, and right now it's silent.

## What's Working

1. **`QuizReview.tsx` per-question correction** — icon + color + highlighted wrong pick + correct answer + `InlineCode`-formatted explanation, all at once. Pedagogically strong and uses the design system's green/red semantics correctly in the one place they're unambiguous (after submission, correctness is known).
2. **Press-rule answer selection** (`QuizQuestion.tsx`) — picking an option does the shadow-hard→shadow-none+translate "physically pressed" treatment, not just a hover state. Confirmed live at both desktop and mobile widths: a small but real piece of brand-specific tactility at the exact moment of interaction, and both assessments confirmed this is a genuine persisted state change (not just a `:hover` artifact).
3. **Single-question pacing with honest progress** — counter + bar respect the ≤4 working-memory rule and never show more than one question's cognitive load at a time. Answer buttons are real `<button>` elements, natively keyboard-reachable even though their state isn't exposed to assistive tech (see P1 below).

## Priority Issues

**[P0] Streak/promotion consequence is invisible at the exact moment it happens.**
- **Why it matters**: PRODUCT.md's own Product Principle 2 calls the streak/promotion mechanic the product's "motor de rétention," and this review's brief independently called this "the highest-stakes moment in the whole product." Confirmed live: a deliberate fail silently flipped the dashboard's "1/3 quiz réussis" streak progress back to "0/3" with zero mention on the result screen itself; a pass was equally silent about progress toward promotion.
- **Fix**: have `/api/quiz/[id]/submit` return the resulting streak/division-points state (and whether this attempt just reset it), and render the same streak-progress component already built for the dashboard inside the result card, with explicit "série remise à zéro" / "+1 vers la promotion" messaging.
- **Suggested command**: `/impeccable onboard` or `/impeccable delight` (the fix is an emotional/informational addition to an existing screen, not a layout/visual pass).

**[P0] Mobile: the question-navigation row overflows the viewport, and part of it is unreachable.**
- **Why it matters**: Assessment A measured this directly at 390px width: `body.scrollWidth` 713px vs an 388px viewport, and the Précédent/dots/Suivant row itself at `scrollWidth` 697 vs `clientWidth` 356 — roughly half of it, including the "Suivant"/"Terminer" button on later questions, pushed off-screen with no visible scroll affordance. Every quiz in the current seed data has 10 questions, so this is the default mobile experience, not an edge case, on a product whose Operating Context explicitly includes mobile web. (Note: Assessment B's general mobile screenshots of the same page did not visually flag this — its pass didn't specifically re-measure the nav row's scrollWidth once question 2+ was reached. Given A's finding is a direct DOM measurement rather than a screenshot impression, treat it as the more reliable signal, but re-confirm directly while fixing.)
- **Fix**: give the dots row its own bounded `overflow-x-auto` with an edge fade or collapse it to a compact "3/10" indicator below a breakpoint, while keeping Précédent/Suivant permanently pinned in view.
- **Suggested command**: `/impeccable adapt`.

**[P1] No keyboard/ARIA semantics or focus styling anywhere on this surface, unlike the rest of the app.**
- **Why it matters**: zero `aria-*`/`role=` attributes and zero `focus`-related classes exist across `QuizRunner.tsx`, `QuizQuestion.tsx`, `QuizReview.tsx`, `QuizTimer.tsx`, while `HistoryList.tsx`/`QuizCard.tsx` consistently apply `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring`. Confirmed by direct accessibility-tree inspection: answer buttons ARE real `<button>` elements (keyboard-reachable, which is better than it could be), but `aria-pressed`/`aria-selected`/`aria-checked`/`aria-current` are all absent on the selected answer and the current-question pill — state is conveyed by CSS class only. The progress indicator has no `role="progressbar"` and there is no `aria-live` region anywhere for feedback. The heading structure also skips a level (`<h1>` → `<h3>`, no `<h2>` for the question text). And the flattened accessible name on an answer button concatenates the letter badge directly into the option text with no separator (e.g. `"AIl définit l'ordre de tabulation du champ associé"`), which a screen reader will read as one run-on word.
- **Fix**: add the documented focus-ring class to every interactive element here; wrap answers in `role="radiogroup"`/`role="radio"` + `aria-checked`; add `role="progressbar"` to the progress bar; insert a proper `<h2>` for the question text; separate the letter badge from the option text in the accessible name (e.g. `aria-label` or a visually-hidden separator).
- **Suggested command**: `/impeccable audit`.

**[P1] Native `window.alert()` breaks the entire pixel-art system at the one moment of friction.**
- **Why it matters**: an unstyled OS dialog box inside an app that otherwise enforces 3px borders/zero radius/hard shadow everywhere is an instant, jarring brand break — exactly the kind of thing the Square Corner Rule and No-Blur Rule exist to prevent, just via a different channel (a whole native dialog instead of a rounded corner).
- **Fix**: reuse the app's existing `alert-red-surface` banner pattern (already used in auth forms) instead of `alert()`.
- **Suggested command**: `/impeccable polish`.

**[P1] Mobile: the sticky nav header overlaps page content on scroll.**
- **Why it matters**: confirmed via a real scrolled screenshot at 390px width — the Dashboard/Historique/Classement row stays pinned at the top while scrolling, and visually overlaps the top of the question card: the top of the first answer option and the tail of the question text were partially hidden underneath it mid-scroll. On the one screen where reading the question correctly matters most, losing the first few pixels of it under a nav bar is a real, reproducible defect, not a hypothetical.
- **Fix**: add scroll-margin/padding-top to the question card equal to the sticky header's height, or confirm `z-index`/`top` offsets account for the header across all quiz states.
- **Suggested command**: `/impeccable adapt`.

**[P2] "Answered" jump-dots reuse Victory Green before correctness is known.**
- **Why it matters**: both assessments independently confirmed this live — Assessment B specifically tracked a wrong answer (Q1, later shown incorrect on the Correction screen) and verified its nav pill had already turned green upon leaving the question, with no correctness class present in the DOM at that point. DESIGN.md reserves Victory Green for "réussi" states; here a user who answers every question wrong sees an all-green board before submitting — a false signal that violates the One Accent Rule's intent (gold = "look here," green ≠ a second general-purpose "done" color).
- **Fix**: use a neutral steel "answered" fill; save green/red for the post-submit review only.
- **Suggested command**: `/impeccable colorize` or `/impeccable polish`.

**[P2] Retrying an already-passed quiz gives zero reassurance that it's risk-free, and the result screen never shows a "best" state.**
- **Why it matters**: confirmed live — navigating to an already-passed quiz goes straight into the normal question-answering UI with no "déjà validé" badge or interstitial; and completing it again (even failing, 40%/4/10 on a quiz passed before) simply shows that fresh fail, with no indication the earlier pass is still banked. PRODUCT.md explicitly protects replays of mastered quizzes from breaking the streak — exactly the fact that would encourage a cautious user to practice more — but nothing on this screen tells them that.
- **Fix**: surface a small badge/banner at quiz start ("Déjà validé — un échec ici ne cassera pas ta série") when a prior pass exists for this user, and show the best-ever score alongside the latest attempt's score on the result screen.
- **Suggested command**: `/impeccable clarify`.

## Persona Red Flags

**Casey (mobile)**: Hits the P0 mobile-overflow bug directly — by question 2 or 3, "Suivant" is no longer visible without an undiscoverable sideways scroll, and separately, the sticky header eats the first lines of the question/first answer on scroll. On a real phone, one-handed, interrupted, Casey risks getting stuck unable to tell how to continue.

**Sam (keyboard/screen-reader)**: Tab order does reach every answer button (they're real `<button>` elements — better than many apps default to), but focus is indicated only by the browser's default blue ring, not the brand's gold ring the rest of the app uses, and nothing is announced about which option is selected or which question is answered (no `aria-checked`/`aria-current`, no live region). The one fully-accessible-by-default element in the whole flow is, ironically, the `alert()` dialog that shouldn't be there at all. Worse, the flattened accessible name on each answer button runs the letter badge straight into the option text with no separator, so a screen reader announces a run-on string rather than "Option A: ...".

**Riley (stress tester)**: Browser back mid-quiz silently discards all answers (no `beforeunload`, no persistence) and going forward again remounts a blank quiz with no warning. Rapid-clicking "Terminer" is correctly guarded by an `isSubmitting` flag. A failed network submit dead-ends the user on "Retour au dashboard" with no retry, forcing a full 10-question redo for what might be a one-second network blip. Retrying an already-passed quiz is handled gracefully at the data layer (an old pass isn't erased by a new fail), but, per P2 above, that safety is invisible on screen.

## Minor Observations

- Nav bar's division/division-points badge flashes empty on quiz-page load before populating (likely an async session fetch) — low severity, but inconsistent with how quickly the rest of the chrome renders.
- Answer order is fixed from the DB's `order` field and never randomized on "Recommencer," slightly easing rote memorization on a repeat attempt.
- `QuizReview.tsx` question cards drop the system's otherwise-universal `shadow-hard` elevation (only a colored border) — a minor departure from "a card is never borderless."
- The results screen always reflects the latest attempt's score, never a cumulative "best score" — ties into the P2 retry-reassurance issue above.

## Questions to Consider

1. If the ranked-ladder streak is meant to be the product's "motor of retention," why is the one screen where it's won or lost completely silent about it?
2. Is the `alert()` call a deliberate stopgap, or a sign this submission-validation UI hasn't been revisited since an early prototype — and is there other leftover native-browser chrome hiding elsewhere in this flow?
3. The deterministic detector scanned clean on every file here — given every real issue found came from live interaction instead, does that change how much weight a clean detector run should carry on future surfaces?
