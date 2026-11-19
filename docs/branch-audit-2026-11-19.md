# Branch audit — 2026-11-19

This record captures the branch state before the safe cleanup performed in this governance pass.
The base branch is `origin/main` at `3720860910b8323c3e3e6257f563f2e7aeb4be28` (`docs: track releases published by this fork [skip ci]`).
The audit used commit ancestry, `rev-list`, `merge-base`, `merge-tree`, file diffs, open pull requests, and local validation results; branch names alone were not used for classification.

## Inventory before cleanup

- Local branches: **2** — `main`, `codex/web-release-foundation`.
- Remote branches: **4** — `main`, `codex/web-release-foundation`, and two Dependabot branches.
- Topic branches compared with `main`: **3**.
- All three topic branches were one commit ahead of `main`, contained the `main` baseline, and had no textual merge conflict with `main`.

| Branch                                                            | Tip       | Difference from `main`                  | Pull request                                           | Category | Decision                                                                                                                                 |
| ----------------------------------------------------------------- | --------- | --------------------------------------- | ------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `codex/web-release-foundation`                                    | `1d5805c` | 43 files, +2404/-2517                   | [#3](https://github.com/yuchen0x1/themes/pull/3), open | **B**    | Keep. Broad governance, release, accessibility, docs, and test changes require review and required checks; do not auto-merge.            |
| `dependabot/npm_and_yarn/esbuild-0.28.1`                          | `1dcaa62` | `package.json` and `pnpm-lock.yaml`     | [#2](https://github.com/yuchen0x1/themes/pull/2), open | **D**    | Superseded. The current feature branch already uses `esbuild` `0.28.2`; do not merge the older update.                                   |
| `dependabot/npm_and_yarn/packages/radix-ui-themes/postcss-8.5.23` | `5690520` | `packages/radix-ui-themes/package.json` | [#1](https://github.com/yuchen0x1/themes/pull/1), open | **D**    | Superseded/invalid as-is. The current feature branch uses direct `postcss` `8.5.33`; the old branch also leaves its lockfile at `8.5.9`. |

`main` is the stable baseline and is not counted as an A/B/C/D topic branch. No branch met the A criteria at audit time: the two dependency PRs had no completed status checks, and the broad feature PR required human review. Therefore no branch was merged automatically.

## Cleanup performed

After recording the inventory, the two superseded Dependabot pull requests were closed with explanatory comments and their remote topic branches were deleted. No local developer branch was deleted, no force-push was used, and `main` was not rewritten. The active feature branch and PR #3 were retained.

## Protection and follow-up

GitHub classic branch protection for `main` was then created and verified in the repository settings. It requires pull requests, one approval, dismissal of stale approvals after new pushes, resolved conversations, and linear history; force-push and branch deletion remain disabled, and administrators cannot bypass the rule. Required status checks were not enabled because GitHub exposed no recent check contexts while the rule was created; once the CI check names are available, a maintainer should add the required `CI / Required checks` context. Code-owner approval was intentionally left off to avoid making a single-owner repository impossible to merge until another reviewer is available.

The scheduled [branch governance workflow](../.github/workflows/branch-governance.yml) and [scanner](../scripts/branch-governance.mjs) now produce an advisory report. They never merge, force-push, close pull requests, or delete branches automatically.
