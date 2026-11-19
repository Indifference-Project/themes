'use client';

import * as React from 'react';
import { Box, Button, ScrollArea, TextField, Theme } from '@radix-ui/themes';

/**
 * Regression fixtures for issues that are invisible to the type checker and
 * to the existing interaction tests.
 */

// A responsive prop object that is shared between two components. Rendering
// must not write the resolved `initial` breakpoint back into it.
const sharedSize = { size: { sm: '3' as const } };

// A frozen responsive prop object. Rendering must not throw.
const frozenSize = Object.freeze({ size: Object.freeze({ sm: '3' as const }) });

export default function Regressions() {
  React.useEffect(() => {
    // Record the shared prop object after the components below have rendered.
    // Writing to the DOM keeps the observation out of the render cycle.
    const element = document.getElementById('shared-size-json');
    if (element) element.textContent = JSON.stringify(sharedSize);
  }, []);

  return (
    <Theme>
      {/* ScrollArea must support arbitrary (non-scale) margin values. */}
      <Box id="sa-m-arbitrary" p="9">
        <ScrollArea m="100px">
          <div style={{ height: 40 }}>content</div>
        </ScrollArea>
      </Box>

      {/* …and responsive arbitrary margin values must change per breakpoint. */}
      <Box id="sa-m-responsive" p="9">
        <ScrollArea m={{ initial: '100px', sm: '200px' }}>
          <div style={{ height: 40 }}>content</div>
        </ScrollArea>
      </Box>

      <Box id="sa-mx-responsive" p="9">
        <ScrollArea mx={{ initial: '100px', sm: '200px' }}>
          <div style={{ height: 40 }}>content</div>
        </ScrollArea>
      </Box>

      {/* Reference: the same props on a component using the shared code path. */}
      <Box id="box-m-responsive" p="9">
        <Box m={{ initial: '100px', sm: '200px' }}>content</Box>
      </Box>

      {/* The invalid state must not strip the classic variant's box shadow. */}
      <TextField.Root id="tf-classic-invalid" variant="classic" defaultValue="x" aria-invalid />
      <TextField.Root id="tf-classic-valid" variant="classic" defaultValue="x" />
      <TextField.Root id="tf-surface-invalid" variant="surface" defaultValue="x" aria-invalid />

      {/* Frozen props must not throw, shared props must not be mutated. */}
      <Button id="frozen-size-button" {...frozenSize}>
        Frozen size
      </Button>
      <Button id="shared-size-button" {...sharedSize}>
        Shared size
      </Button>
      <Box id="shared-size-json" />

      {/* `ghost` and `ghost-offset` must not be identical. */}
      <Button id="button-ghost" variant="ghost">
        Ghost
      </Button>
      <Button id="button-ghost-offset" variant="ghost-offset">
        Ghost offset
      </Button>
    </Theme>
  );
}
