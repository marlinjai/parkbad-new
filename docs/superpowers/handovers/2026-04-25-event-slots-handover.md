# Handover: Multi-Slot Event Days

**Date:** 2026-04-25
**For:** Fresh Claude Code session (Sonnet) picking up where this Opus session left off.
**Goal of next session:** Execute the existing implementation plan via agent team and push to main.

---

## TL;DR for the next session

1. Read `docs/superpowers/plans/2026-04-25-event-slots.md` (it has all 9 tasks with exact code for each step).
2. Invoke `superpowers:subagent-driven-development` skill.
3. Dispatch one subagent per task, sequentially, with the spec-compliance + code-quality review pattern. Use Haiku for mechanical tasks (1-2 file edits with exact code given) and Sonnet for integration tasks (multi-file, schema validation, hash logic).
4. Push directly to main when all tasks pass and tests are green. **No PR.** No worktree. Per project convention.
5. Tell the user to run the prod migration after the deploy: `infisical run --env=prod -- npx tsx scripts/migrate-event-days-to-slots.ts --dry-run` first, then without `--dry-run`.

The plan is exhaustive. You shouldn't need to make design decisions — every code block, every commit message, every verification command is in there. If you find yourself making a decision the plan doesn't cover, stop and ask the user.

---

## Current state

- Branch: `main`. Clean working tree. PR #2 (newsletter admin improvements) was merged earlier today.
- Worktree: none. The previous worktree was removed after PR #2 merge.
- Latest commits:
  - `7cc6c41 docs(plan): multi-slot event days implementation plan`
  - `98f7d79 docs(spec): multi-slot event days design`
  - `dc3712c Merge pull request #2 from marlinjai/feature/newsletter-admin-improvements`
- Tests passing (7/7) on main: `contentHash.test.ts` (5) + `sendBroadcast.test.ts` (2).
- Vitest is set up. `npm test` works.
- Infisical user-session is logged in (`infisical login --domain https://infisical.lumitra.co`).
- Sanity CLI is logged in (`npx sanity login`).
- Sanity studio dev server may or may not still be running on port 3000. Check: `lsof -nP -iTCP:3000 -sTCP:LISTEN`.

---

## Project workflow conventions (important)

**Saved as feedback memory** at `~/.claude/projects/-Users-marlinjai-software-dev-parkbad-new/memory/feedback_workflow_no_pr.md`. Summary:

- This is a solo project. **No worktree, no PR.** Work directly on main, push when ready.
- Skip the `using-git-worktrees` and `finishing-a-development-branch`-PR-option flows.
- Still go through brainstorm → spec → plan → implement, just push to main when done.

**Other conventions** (from user's global CLAUDE.md):

- **No em-dashes or en-dashes** in any output (code, prose, commits). Use colons, parentheses, commas, or new sentences.
- **Secrets via Infisical**, never op/1password/literal env. Pattern: `infisical run --env=<env> -- <cmd>`.
- `.infisical.json` is gitignored (already set up).
- Commits should follow existing project style (lowercase scope prefix like `feat(events):`, `fix(...)`, `chore(...)`).
- Self-hosted Infisical at `https://infisical.lumitra.co`.

---

## Key context the plan assumes you know

### Files relevant to this feature

- **Schema:** `src/sanity/schemas/customevent.ts` (defines eventDays)
- **Types:** `src/types/componentTypes.ts` and `src/types/sanityTypes.ts` (BOTH define `EventDay` separately, both must be updated)
- **Renderers (read eventDays):**
  - `src/app/_components/Homepage_Components/RenderDate.tsx` (THE main one; `Post.tsx` delegates to this)
  - `src/app/_components/Posts&Events_Components/Archive.tsx` (only uses `eventDays[0].date`, no logic change needed)
  - `src/app/_components/Swiper&GaleryComponents/PostCardsSlider.tsx` (same as Archive)
- **Newsletter template:** `src/app/_components/email_templates/newsletter-template.tsx`
- **Newsletter API routes:** `src/app/api/newsletter/test/route.ts` and `src/app/api/newsletter/send-now/route.ts` (only the GROQ projection needs updating)
- **Content hash:** `src/lib/newsletter/contentHash.ts` (and its test) - feeds the manual send button's "test required" gate

### Pitfalls discovered in the previous session (avoid these)

1. **`src/sanity/desk/structure.ts` is NOT used.** It was orphaned dead code. The active studio structure lives inline in `src/sanity/lib/sanity.config.ts`. The previous session deleted the orphan. If you need to touch the structure, edit `sanity.config.ts`.

2. **`infisical run` from a Bash subprocess sometimes 403s** even when the user is logged in. If you get 403:
   - Make sure the cwd has `.infisical.json` (or pass `--projectId` flag explicitly: `d896344c-45a2-4da1-a752-22348055ebca`)
   - If still 403 from your shell tool, ask the user to run the command themselves with the `!` prefix.

3. **Sanity webhooks for newsletter (auto-send) were already deleted** in the previous session. Don't worry about them.

4. **`SANITY_API_WRITE_TOKEN` is provisioned** in Infisical (all 3 envs) and synced to Vercel. Don't ask the user for it again.

5. **Existing customevent docs already had the legacy `sendNewsletter` field cleaned** in the previous session. The new schema (after this plan) won't conflict with old data outside of the eventDays change.

6. **`sanity.cli.ts` exists** at the repo root with `projectId: 'qyrn8cjm'`, `dataset: 'production'`. Sanity CLI commands work from the repo root.

7. **TypeScript pre-existing errors:** there are 6 errors about missing asset module declarations (`Logo_redo_origclolours.png` etc.) that exist on main and are NOT this feature's responsibility. Filter them out when grepping tsc output: `grep -v "node_modules\|.next/types\|Logo\|LogoCloud\|StudioIcon\|asset"`.

8. **`.next/types` cache stales easily** when routes are added/removed. Run `rm -rf .next` before the final tsc check.

---

## Plan execution recipe

For each of the 9 tasks in `docs/superpowers/plans/2026-04-25-event-slots.md`:

1. **Pick a model based on complexity:**
   - Tasks 1, 2, 4, 7, 8: mechanical (Haiku). Plan gives exact code.
   - Tasks 3 (schema), 5 (RenderDate), 6 (newsletter template): integration / nontrivial (Sonnet).
   - Task 9: final integration (Sonnet, or do inline yourself since it's verification).

2. **Implementer prompt template:** copy from `~/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.7/skills/subagent-driven-development/implementer-prompt.md`. Paste the full task text from the plan. Include the working directory and "no PR, push to main" reminder.

3. **Skip review-agent dispatch for trivial tasks** (Task 1 single-helper-with-tests, Task 7 GROQ-projection-replace). Inline-verify by reading the diff. Dispatch review agents for substantive changes (Tasks 3, 5, 6, 8). Same approach the previous session used.

4. **Between tasks**, run `npm test` if the task added tests, and check `git log --oneline main..HEAD` to make sure commits look clean.

5. **Final integration (Task 9):**
   - Full `npm test` (expect 12 tests after this feature: 7 existing + 6 eventDays + carry-over of contentHash tests)
   - `rm -rf .next && npx tsc --noEmit | grep -v "node_modules\|.next/types\|Logo\|LogoCloud\|StudioIcon\|asset"` — should be empty
   - `npm run lint` — should exit 0 (warnings about workspace root are cosmetic and OK)
   - End-to-end smoke test on dev (start dev server, open Studio, edit event, add second slot, save, view public site, send newsletter test)
   - `git push origin main`
   - Tell user to run prod migration: `infisical run --env=prod -- npx tsx scripts/migrate-event-days-to-slots.ts --dry-run` then for real

6. **Don't invoke `finishing-a-development-branch`** — its PR option doesn't apply here. Just push to main and tell the user it's deployed.

---

## What the user will want to know at the end

When you finish, give the user a brief status:

- Tasks completed
- Tests passing count
- Commits pushed to main
- The exact prod migration command they need to run after Vercel deploys
- Any surprises or deviations from the plan

Don't bury the prod migration step. It's the only thing the user has to do manually after your work is done.

---

## If you get stuck

If a task in the plan turns out to have a wrong code snippet (e.g., a Sanity API that doesn't exist as written), don't silently improvise. Check the actual SDK behavior, then either:

- Patch the plan inline (commit the fix to the plan file with a note in the commit message)
- Or escalate: report what you found and what your alternative approach is, get user approval

The plan is the source of truth, but the source of truth is allowed to be wrong.

---

## Reference URLs

- Spec: `docs/superpowers/specs/2026-04-25-event-slots-design.md`
- Plan: `docs/superpowers/plans/2026-04-25-event-slots.md`
- Previous PR (just merged): https://github.com/marlinjai/parkbad-new/pull/2
- Sanity manage: https://www.sanity.io/manage/personal/project/qyrn8cjm
- Infisical UI: https://infisical.lumitra.co
- Vercel project: https://vercel.com/marlin-jais-projects/parkbad-new
