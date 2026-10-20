---
target: leaderboard
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/Guirec/Documents/GitHub/codinquest/app/dashboard/leaderboard/page.tsx"
target_fingerprint: "sha256:dfca4a9e36e26d6d745554ff0c6b213eacfc6e4d5bd7709b3290f4346223eaf1"
target_path: /Users/Guirec/Documents/GitHub/codinquest/app/dashboard/leaderboard/page.tsx
timestamp: 2026-10-20T10-20-54Z
slug: app-dashboard-leaderboard-page-tsx
---
Method: dual-agent (A: design-review subagent · B: detector/browser-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Live rank/player counts are clear; zebra striping in the table is too faint (~3% luminance delta) to aid scanning. |
| 2 | Match System / Real World | 4 | French copy, trophy/crown/medal metaphors and division naming all read naturally as a game ladder. |
| 3 | User Control and Freedom | 1 | Hard-coded `limit: 100`, no pagination, no "see players near me" — past the top 100, a user gets one number and no way to browse. |
| 4 | Consistency and Standards | 2 | Podium tiles use raw Tailwind swatches (`bg-gray-400`, `bg-amber-700`) instead of the division-reserved colors (`#C0C0C0`, `#CD7F32`) already defined one component away. |
| 5 | Error Prevention | 3 | Read-only surface, so little to prevent; silent unexplained tie ordering risks feeling arbitrary against the product's own anti-cheat framing. |
| 6 | Recognition Rather Than Recall | 4 | Division badge + medal + current-user highlight are all inline; nothing to remember. |
| 7 | Flexibility and Efficiency | 1 | Zero sort/filter/search/jump-to-rank on a table meant for repeat visits. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and on-brand overall, but the ad hoc podium colors and a full-tile gold fill on #1 dent the system's usual precision. |
| 9 | Error Recovery | 2 | No loading/error affordance in this file; the dedicated "Aucun joueur" empty state in `LeaderboardTable` is unreachable from this page's actual render tree (confirmed in source — `LeaderboardTable` is only ever invoked inside a `restOfLeaderboard.length > 0` guard). |
| 10 | Help and Documentation | 2 | No inline explanation of how rank/division/promotion work — a first-timer needs to already know the ladder mechanic. |
| **Total** | | **25/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment:** The podium remains the strongest "this is CodeInQuest" moment in the dashboard — the pixel-art tri-metal medal, the floating Crown, division badges, and the current-user chip read as a genuine ranked-ladder trophy room, not a generic table with colors swapped. But it's authored at the surface level only: nothing on the page references the product's actual differentiator (3-consecutive-wins promotion), and the podium tiles reach for raw Tailwind swatches instead of the division-reserved hex values the app already defines in `DivisionIcon.tsx`/`RankMedal.tsx` — so the "reserved color per rank" idea is half-applied rather than fully committed to.

**Deterministic scan:** `impeccable detect` ran clean across the leaderboard page and its components — zero findings. The detector itself was sanity-checked against a deliberately bad file (gradient + AI buzzwords) and correctly flagged it, confirming the clean result here is genuine, not a tooling gap.

**Visual overlays:** Blocked by the same site-wide CSP (`script-src 'self'`) confirmed on every prior critique run — not a regression, no overlay available in the **[Human]** tab this session.

**Privacy check (per PRODUCT.md's "email never exposed in the leaderboard payload" invariant):** Verified clean two ways — `lib/data/leaderboard.ts` selects `email` server-side only to derive a display-name fallback and never serializes it into the returned object, and a full-DOM regex scan of the rendered page for email-shaped strings found zero matches. No leak.

## Overall Impression

The podium is real craft and still the app's best "this is a game, not a form" moment — but it's an island. The #2 tile has a genuine, measured contrast failure (confirmed via computed styles: white text on `gray-400` ≈ 2.5:1, below the 4.5:1 AA floor), the podium ignores the division-color system the rest of the app already has, and the page has no answer for anyone outside the top 3 beyond a bare rank number with no pagination past 100 players — directly undercutting the "competition as retention engine" principle PRODUCT.md states as a core design driver.

## What's Working

- **`RankMedal`'s tri-tone pixel medals**: a genuinely well-crafted bespoke asset — light/mid/dark metal bands read as "medal," not "emoji with square corners," and reuse the same 16×16 silhouette as `DivisionIcon` for visual family resemblance.
- **Current-user highlighting in the table**: `bg-accent/10 border-l-[3px] border-l-accent` on the row is textbook restrained use of Treasure Gold — exactly how the One Accent Rule is meant to work.
- **Podium layout**: silver-gold-bronze ordering with a taller, wider center tile correctly encodes "the biggest one wins" through size/position alone, without needing a fourth color.

## Priority Issues

**[P1] The Silver (#2) podium tile fails WCAG AA contrast**
- **Why it matters:** Verified via computed styles, not estimated — `bg-gray-400` (`rgb(156,163,175)`) with white `text-on-ink` text gives ≈2.5:1 contrast, well under the 4.5:1 normal-text floor. Every 2nd-place finisher's own name, rank, and score become hard to read on their own podium tile. (The bronze tile, `amber-700` + white, passes at ≈5:1 — this is specific to silver, not the whole podium.)
- **Fix:** Replace `bg-gray-400`/`text-on-ink` with the division-reserved Silver color (`#C0C0C0`) already defined in DESIGN.md, paired with dark text the way the gold tile already does correctly.
- **Suggested command:** `/impeccable harden`

**[P1] Podium colors bypass the design-token / division-color system entirely**
- **Why it matters:** `podiumStyles` in `page.tsx` hard-codes `bg-gray-400`, `bg-amber-700`, `border-ink` — values that exist nowhere in `app/globals.css`'s token set and don't match the Silver/Bronze hex values `DivisionIcon` and `RankMedal` already use. A side effect: the #1 gold medal sits on a nearly-identical gold tile fill (medal tones `#FFE873`/`#FFD700`/`#B8960A` vs. tile `#ffc53d` — all in the same gold family), giving the single most important icon on the page the weakest figure-ground separation of the three.
- **Fix:** Derive podium tile fills from the same reserved division-rank constants `RankMedal`/`DivisionIcon` already encode; give the #1 medal a small dark inset chip (echoing how the Crown is already set off above the tile) instead of floating directly on matching gold.
- **Suggested command:** `/impeccable harden`, then `/impeccable colorize`

**[P2] The #1 tile's full-bleed gold fill is a large, undocumented exception to the One Accent Rule**
- **Why it matters:** Confirmed against DESIGN.md directly — the Division Ladder signature-component section documents the medal's gold/silver/bronze treatment but says nothing about a full-tile gold fill. This is the single largest solid-gold surface in the app, used decoratively rather than as a CTA, sitting directly under the gold nav pill and gold primary buttons elsewhere — diluting gold's "act now" meaning by precedent nobody actually decided on.
- **Fix:** Either formally document this as the system's one sanctioned large-surface gold exception in DESIGN.md, or pull it back — e.g. a steel/navy tile with gold reserved for the border, medal, and "C'est toi !" chip, letting the medal and crown (not the fill) carry the "you won" signal, consistent with how #2/#3 already behave.
- **Suggested command:** `/impeccable quieter`

**[P2] No pagination or "nearby players" view beyond the hard-coded top 100**
- **Why it matters:** `getLeaderboard` is called once with `skip: 0, limit: 100` despite the data layer already supporting pagination. A player ranked #250 of 1000 gets exactly one artifact — a sticky "Tu es classé #250 sur 1000" bar — with no idea who's a few spots above them to chase, which is the entire competitive-ladder value proposition per PRODUCT.md's positioning. Minor today (7 seeded players); becomes the dominant experience as the player base grows.
- **Fix:** At minimum, show a "nearby players" slice (e.g. ±5 around the user's rank) alongside or instead of the bare number.
- **Suggested command:** `/impeccable layout`

**[P3] Tie-breaking is silent and looks arbitrary**
- **Why it matters:** Confirmed in `lib/data/leaderboard.ts` — the query orders by `[{division: 'desc'}, {totalScore: 'desc'}]` with no third-level tiebreak, so tied players (observed live: 4 seeded accounts tied at 0/0) get distinct, unexplained ranks. For a product whose own principle is "le classement doit rester gagné, pas gaméable," an invisible tiebreak undercuts the "earned" framing the moment two tied players compare themselves.
- **Fix:** Add a visible secondary sort cue (e.g. "quiz complétés" as tiebreak, named in copy), or collapse genuinely-tied ranks into a shared rank number the way real ranked ladders do.
- **Suggested command:** `/impeccable clarify`

**[P3] Current-user label is inconsistent between the podium and the table**
- **Why it matters:** The podium says "C'est toi !" while `LeaderboardTable` says "(Vous)" for the identical state — minor, but a visible inconsistency on the same page for the same concept.
- **Fix:** Pick one label and use it in both places.
- **Suggested command:** `/impeccable clarify`

No P0 found — the privacy invariant holds (no email leak, verified two ways), and nothing breaks a hard DESIGN.md invariant like the Square Corner or No-Blur rules.

## Persona Red Flags

**Alex (Power User):** Hits the flexibility gap immediately — no sort, filter, search-by-name, or jump-to-page on a table meant to be revisited often. Would also notice the tie ordering and read it as the system not meaningfully tracking anything yet.

**Sam (Accessibility-Dependent User):** Lands directly on the #2 tile's ~2.5:1 contrast — their own name, if in 2nd place, is sub-AA legible. The page's own content (podium, rows, badges, medals) has zero focusable elements, so there's no "jump to my row" keyboard affordance across up to 100 rows — a keyboard user must traverse sequentially.

**Riley (Stress-Tester):** Confirmed in source — with ≤3 total players, neither the podium guard (`top3.length > 0`) nor the table-section guard (`restOfLeaderboard.length > 0`) can both be satisfied with a true zero-player count, so in that edge case the page renders only the header with nothing below it; the dedicated "Aucun joueur" message in `LeaderboardTable` is unreachable from this call site. Also confirmed live: 4 of 7 seeded players tied at identical 0/0 stats with unexplained order.

## Minor Observations

- Table zebra striping is a ~3% luminance delta — essentially imperceptible; row borders do the real scanning work instead.
- Copy inconsistency: "C'est toi !" (podium) vs. "(Vous)" (table) for the same state.
- Mobile viewport still could not be independently verified — the same `resize_window` environment limitation as prior critique runs.

## Questions to Consider

- Is a flat, un-paginated top-100 table really the long-term design for "competition as retention engine," or does this page need a "players near me" view built now, before the seed data (a handful of tied players) becomes thousands of real ones and the gap becomes a support complaint instead of a design-review note?
- Should the #1 tile's full-bleed gold fill be written down as a deliberate, sanctioned exception to the One Accent Rule — and the #2/#3 tiles brought onto the same reserved division-color constants the medals already use — or is this page quietly the one place in the app where the rule is being broken without anyone having decided to?
