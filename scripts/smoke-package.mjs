import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server.js';
import { Button, Theme } from '@radix-ui/themes';
import { Button as StandaloneButton } from '@radix-ui/themes/components/button';
import * as helpers from '@radix-ui/themes/helpers';
import * as props from '@radix-ui/themes/props';

const require = createRequire(import.meta.url);
assert.equal(Button, StandaloneButton);
const cjs = require('@radix-ui/themes');
assert.equal(cjs.Button, require('@radix-ui/themes/components/button').Button);

for (const exports of [helpers, props]) {
  assert(Object.keys(exports).length > 0);
}

for (const components of [{ Theme, Button }, cjs]) {
  const tree = React.createElement(
    components.Theme,
    { accentColor: 'indigo' },
    React.createElement(components.Button, null, 'Install check'),
  );
  const markup = renderToStaticMarkup(tree);
  assert.match(markup, /data-accent-color="indigo"/);
  assert.match(markup, /rt-Button/);
  assert.match(markup, /Install check/);
}

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
