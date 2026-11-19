# Branch governance

The repository treats branch cleanup as a reviewable operation, not as a cosmetic task.
The scheduled [Branch governance workflow](../.github/workflows/branch-governance.yml)
refreshes remote refs and runs `scripts/branch-governance.mjs`. The workflow only reads
branches, pull requests, commit ancestry, mergeability, and file differences. It publishes a
Markdown report to the Actions summary and stores a 30-day artifact.

## Categories

- **A — ready to merge:** the branch has a clear owner, no merge conflict, completed required
  checks, and a reviewed pull request. The report does not assign A automatically because test
  and review policy must be verified by maintainers.
- **B — needs cleanup before merge:** the change is bounded and valuable, such as a dependency
  update, but required checks or review are not complete.
- **C — retain:** active work, an open feature pull request, unresolved conflict, unclear owner,
  or any other condition where automated merge or deletion would be unsafe.
- **D — cleanup candidate:** fully contained in the base branch, has no open pull request, and
  has no independent commits that need preserving. A maintainer must still confirm deletion.

The scanner never force-pushes, merges, closes pull requests, or deletes local or remote branches.
A human maintainer must approve high-risk merges and branch deletion. Dependabot branches remain
reviewable pull requests until CI and repository policy mark them safe.

## Review checklist

1. Run the workflow manually before a release or cleanup window.
2. Confirm each branch's owner, last activity, ahead/behind counts, changed files, and conflict
   status in the generated report.
3. For A candidates, verify the required CI checks and code-owner review in GitHub before merging.
4. For B branches, resolve conflicts or add tests in the pull request rather than rewriting main.
5. Keep C branches and ask the owner before closing or deleting them.
6. For D candidates, confirm no open work depends on the branch, then delete through GitHub's
   normal branch controls.
