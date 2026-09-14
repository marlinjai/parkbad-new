# Roadmap

**This file is the only index of open work in this repository.** Every open item has exactly one home: a plan under `docs/superpowers/plans/` or `docs/superpowers/specs/` when it carries a decision or a sequence (the line here links it), or a single line under Leftovers when it does not. Every open line ends with the date it was last confirmed. `roadmap-check` in CI fails a line older than 30 days, an open line on a finished plan, or a live plan indexed nowhere. Rule and line grammar: `document-lifecycle.md` in the `knowledge-base` repository, section 4.

This repository has been dormant since 2026-05-21 (no commits since). Its two non-terminal plans (newsletter and contact admin improvements, multi-slot event days) were both already shipped in code; reconciled to `completed` in this pass with a reality update in each.

## Leftovers (clear, do not carry)

- [ ] Three customer-reported fixes are committed and pushed to main (the swiper loop
      fix, the gallery face-visibility hotspot crop, and the Winterpause contact-form
      auto-reply fix) but were shipped on type-check alone: the Sanity test dataset used
      locally has no events and no gallery images, so none of the three could be seen
      working. No one has confirmed any of them on the live site since. Verify all three
      against production (2026-09-10)
