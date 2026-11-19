'use client';

import * as React from 'react';
import { Avatar, Box, ContextMenu, Popover, TextField, Theme, Text } from '@radix-ui/themes';

export default function UpstreamVerify() {
  return (
    <Theme>
      {/* #605: Popover triggered by Avatar in fallback mode (no src) */}
      <Box id="avatar-popover" p="5">
        <Popover.Root>
          <Popover.Trigger>
            <Avatar fallback="A" aria-label="Open popover" />
          </Popover.Trigger>
          <Popover.Content>
            <Text>Popover content</Text>
          </Popover.Content>
        </Popover.Root>
      </Box>

      {/* #605 control: with a real src */}
      <Box id="avatar-popover-src" p="5">
        <Popover.Root>
          <Popover.Trigger>
            <Avatar src="/avatar.png" fallback="B" aria-label="Open popover src" />
          </Popover.Trigger>
          <Popover.Content>
            <Text>Popover content src</Text>
          </Popover.Content>
        </Popover.Root>
      </Box>

      {/* #435: right-aligned TextField */}
      <Box id="tf-rtl" p="5">
        <TextField.Root
          defaultValue="1234"
          style={{ textAlign: 'right' }}
          aria-label="right aligned"
        />
      </Box>
      <Box id="tf-ltr" p="5">
        <TextField.Root defaultValue="1234" aria-label="left aligned" />
      </Box>

      {/* #147: context menu DOM structure */}
      <Box id="ctx-area" p="5" style={{ height: 200 }}>
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <Box style={{ height: 100, background: 'var(--gray-3)' }}>right click here</Box>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Item 1</ContextMenu.Item>
            <ContextMenu.Item>Item 2</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </Box>
    </Theme>
  );
}
