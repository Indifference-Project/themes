# Release process

Use topic branches and pull requests into `main`. Require the **Required checks** job before merging. Review the affected browsers and peer versions, and describe user-visible changes in `packages/radix-ui-themes/CHANGELOG.md` (the package changelog is the canonical version history; there is no separate root changelog). Use the same checks for urgent patches.

## Publish the fork

1. Before enabling releases, configure a protected `v*.*.*` tag ruleset, require pull-request checks and code-owner review on `main`, and put the publishing job behind a protected `release` environment with required reviewers. These controls live in GitHub Settings/API and must be verified there; the workflow file alone cannot enforce them.
2. Update the version in `packages/radix-ui-themes/package.json` and create the matching heading in its changelog. Follow semantic versioning.
3. Merge the release PR after reviewing the checks and diffs. From an up-to-date `main`, tag the merged commit with `vX.Y.Z` and push the tag to the fork.
4. The [release workflow](.github/workflows/release.yml) validates tag and package version agreement, checks that the tagged commit belongs to `main`, and runs CI. It stages the tested tarball, checksums and metadata on a draft GitHub Release. It downloads and verifies the staged files before publishing.
5. Confirm the workflow passes its public download and checksum checks. The package, `SHA256SUMS`, and `release.json` should all be present. This fork does not claim GitHub artifact attestation until the repository has enabled and verified that capability.

If a run stops after creating a draft, inspect the failure and compare its assets to the successful CI artifact. Keep it in draft while correcting assets and publish only after validation. If a stable version contains a defect, publish a higher patch version. Immutable-release and attestation guarantees apply only after the corresponding GitHub settings and provenance verification have been enabled; the current workflow itself validates SHA-256 assets but does not create attestations.

The upstream `@radix-ui/themes` npm publishing workflow is scoped to `radix-ui/themes`. This fork distributes its compatible package name via GitHub Release tarballs.

## Install, verify, and roll back

Use [the fork's release list](https://github.com/yuchen0x1/themes/releases) to discover versions. `gh release view --repo yuchen0x1/themes` shows the latest stable release and its notes. Compare the version and React peer ranges in `release.json` with the consuming application's requirements.

Download a specific version and verify the chosen package before installing. Substitute its tag for `v3.4.0` when using a different release.

```sh
gh release download v3.4.0 --repo yuchen0x1/themes
gh release verify-asset v3.4.0 ./radix-ui-themes-3.4.0.tgz --repo yuchen0x1/themes
npm install ./radix-ui-themes-3.4.0.tgz
```

The manifest records the tag version, source commit, size, peer dependencies, and SHA-256. Verify the downloaded archive against `SHA256SUMS` before installing it. When a CI system needs to reinstall from a clean clone, pin a versioned release asset URL or keep the verified archive in the package cache your team controls.

Approve dependency changes in the consuming project, rerun its tests, and redeploy its build. To roll back, restore the previous manifest and lockfile and redeploy the previous build. Keep the current version pinned if GitHub or attestation verification is unavailable. The library has no persistent application data or migration step.

For upstream npm installs, use ordinary dependency updates with lockfile integrity and your project's existing dependency review.
