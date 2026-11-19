import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// `react-dom/server` is exposed as `react-dom/server.js` in React 16/17 and as
// `react-dom/server` from React 18 onwards. `require` resolves both, while the
// `react-dom/server.js` specifier is not part of the React 18/19 export map.
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const majorReactVersion = Number.parseInt(React.version, 10);

function renderInstallCheck(Theme, Button) {
  const tree = React.createElement(
    Theme,
    { accentColor: 'indigo' },
    React.createElement(Button, null, 'Install check'),
  );
  const markup = renderToStaticMarkup(tree);
  assert.match(markup, /data-accent-color="indigo"/);
  assert.match(markup, /rt-Button/);
  assert.match(markup, /Install check/);
}

/* --------------------------------- CommonJS --------------------------------- */

// The CommonJS build is the entry point React 16 and 17 consumers resolve, so
// it has to work on every supported React version.
const cjs = require('@radix-ui/themes');
const cjsButton = require('@radix-ui/themes/components/button');
assert.equal(cjs.Button, cjsButton.Button);

for (const exports of [require('@radix-ui/themes/helpers'), require('@radix-ui/themes/props')]) {
  assert(Object.keys(exports).length > 0);
}

renderInstallCheck(cjs.Theme, cjs.Button);

/* ----------------------------------- ESM ----------------------------------- */

// Node's ESM resolver requires an explicit file extension for bare subpaths
// that are not listed in the package export map. React 16 and 17 do not expose
// `react/jsx-runtime` that way, so the ESM build can only be exercised from
// React 18 onwards.
if (majorReactVersion >= 18) {
  const esm = await import('@radix-ui/themes');
  const esmButton = await import('@radix-ui/themes/components/button');
  assert.equal(esm.Button, esmButton.Button);

  for (const exports of [
    await import('@radix-ui/themes/helpers'),
    await import('@radix-ui/themes/props'),
  ]) {
    assert(Object.keys(exports).length > 0);
  }

  renderInstallCheck(esm.Theme, esm.Button);
}

/* ---------------------------------- Assets --------------------------------- */

for (const file of [
  'styles.css',
  'components.css',
  'utilities.css',
  'layout.css',
  'tokens.css',
  'tokens/colors/indigo.css',
]) {
  const contents = await readFile(new URL(import.meta.resolve('@radix-ui/themes/' + file)), 'utf8');
  assert(contents.length > 0, file + ' must contain styles');
}

const license = await readFile(new URL(import.meta.resolve('@radix-ui/themes/LICENSE')), 'utf8');
assert.match(license, /MIT License/);
console.log('Package smoke test passed on React ' + React.version);
