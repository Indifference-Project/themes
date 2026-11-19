[![Radix Themes Logo](https://radix-ui.com/social/themes.png)](https://radix-ui.com/themes)

# Radix Themes

An accessible React component library with pre-styled controls, responsive layout, CSS design tokens, and nested light and dark themes. This repository is a fork of [WorkOS Radix Themes](https://github.com/radix-ui/themes).

[![CI](https://github.com/yuchen0x1/themes/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/yuchen0x1/themes/actions/workflows/ci.yml)
[![Latest fork release](https://img.shields.io/github/v/release/yuchen0x1/themes)](https://github.com/yuchen0x1/themes/releases/latest)

## Install

For the upstream npm package, use `npm install @radix-ui/themes`. Fork builds are available in [GitHub Releases](https://github.com/yuchen0x1/themes/releases). Follow the [verification and installation steps](./release-process.md#install-verify-and-roll-back) before installing a fork build.

```tsx
import '@radix-ui/themes/styles.css';
import { Button, Theme } from '@radix-ui/themes';

export function App() {
  return (
    <Theme accentColor="indigo">
      <Button>Get started</Button>
    </Theme>
  );
}
```

Browse the [component docs](https://www.radix-ui.com/themes/docs/components), [theme settings](https://www.radix-ui.com/themes/docs/theme/overview), and [responsive breakpoints](https://www.radix-ui.com/themes/docs/theme/breakpoints) for usage examples.

## Latest update

See the [latest stable fork release](https://github.com/yuchen0x1/themes/releases/latest) for version notes and downloads, and the [package changelog](./packages/radix-ui-themes/CHANGELOG.md) for source history.

## Compatibility

| Target                    | Delivery                                                         | Verification                                                    |
| ------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| Desktop Web               | React library with shared CSS and keyboard interaction           | Playwright Chromium, Firefox, and WebKit                        |
| Mobile and responsive Web | Same library with responsive props and browser touch interaction | Mobile Chrome and Safari profiles in Playwright                 |
| Server-side rendering     | ESM and CommonJS entry points                                    | Tarball install and server render with React 16, 17, 18, and 19 |

The Playground is a Next.js workspace for component demos and regression tests. The [compatibility and maintenance record](./docs/maintenance.md) describes the checks, platform decisions, and remaining device coverage.

## Run the playground

Use Node.js 24 and the pnpm version declared in the root package manifest.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter playground start
```

Open [the component gallery](http://localhost:3000/sink) or [the demo](http://localhost:3000/demo). For dependency upgrades, use the [release process](./release-process.md) with your consuming app's lockfile and deployment pipeline.

## Contribute

Read the [contribution guidelines](./.github/CONTRIBUTING.md), propose changes through [Issues](https://github.com/yuchen0x1/themes/issues), or use the [private security reporting process](./SECURITY.md). The [research and upgrade backlog](./docs/ecosystem-review.md) records the current priorities.

See the [upstream changelog](https://www.radix-ui.com/themes/docs/overview/releases) and [upstream discussions](https://github.com/radix-ui/themes/discussions) for the original project.

## License

[MIT](./LICENSE), copyright © 2023–present WorkOS. Radix Themes was created by Benoît Grélard, Vlad Moroz, Andy Hook, and Lucas Motta.
