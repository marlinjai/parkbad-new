# Roadmap

**This file is the only index of open work in this repository.** Every open item has exactly one home: a plan under `docs/superpowers/plans/` or `docs/superpowers/specs/` when it carries a decision or a sequence (the line here links it), or a single line under Leftovers when it does not. Every open line ends with the date it was last confirmed. `roadmap-check` in CI fails a line older than 30 days, an open line on a finished plan, or a live plan indexed nowhere. Rule and line grammar: `document-lifecycle.md` in the `knowledge-base` repository, section 4.

This repository has been dormant since 2026-05-21 (no commits since). Its two non-terminal plans (newsletter and contact admin improvements, multi-slot event days) were both already shipped in code; reconciled to `completed` in this pass with a reality update in each.

## Leftovers (clear, do not carry)

- [ ] Three customer-reported fixes are committed and pushed to main (the swiper loop
      fix, the gallery face-visibility hotspot crop, and the Winterpause contact-form
      auto-reply fix) but were shipped on type-check alone: the Sanity test dataset used
      locally has no events and no gallery images, so none of the three could be seen
      working. No one has confirmed any of them on the live site since. Verify all three
      against production (2026-10-24)
- [ ] Move the filter and sort effect in the posts and events Archive
      (`src/app/_components/Posts&Events_Components/Archive.tsx`) out of `useEffect`
      (derive the list with `useMemo`, reset the reveal animation without setting state
      in an effect), then delete its single
      `eslint-disable-next-line react-hooks/set-state-in-effect`. It is the last site the
      React Compiler rules of eslint-plugin-react-hooks 7 flag after the Next 16 upgrade
      (the rules themselves stay at error); it drives the staggered reveal on the live
      archive page, so it needs a visual check there (2026-11-08)
- [ ] Dependabot alert 233 stays open: minimatch 10.2.6 (GHSA-g3hv-75wg-m249, moderate,
      denial of service through glob patterns) is patched only in 11.0.1. Its parents,
      @oclif/core 4.14.0 (inside the Sanity command-line tool) and
      @typescript-eslint/typescript-estree 8.72.1 (inside eslint-config-next 16), are at
      their latest release and declare `^10.2.x`, and forcing a new major under them is
      not safe. Both are command-line tooling, not part of the deployed bundle, and only
      match glob patterns written in this repository. Bump when either parent allows
      minimatch 11 (2026-11-08)
