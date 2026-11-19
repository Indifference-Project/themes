'use client';

import * as React from 'react';
import { Box, Button, Dialog, Flex, Select, Text } from '@radix-ui/themes';

export default function Interactions() {
  const [color, setColor] = React.useState('');
  const [submitted, setSubmitted] = React.useState('');

  return (
    <Flex asChild direction="column" align="start" gap="5" p="5">
      <main>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>Open custom dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content asChild closeButton closeButtonLabel="Cerrar">
            <article>
              <Dialog.Title>Keyboard settings</Dialog.Title>
              <Dialog.Description>Manage shortcuts for this demo.</Dialog.Description>
              <Dialog.Close>
                <Button mt="4">Done</Button>
              </Dialog.Close>
            </article>
          </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root>
          <Dialog.Trigger>
            <Button>Open dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content closeButton>
            <Dialog.Title>About this demo</Dialog.Title>
            <Dialog.Description>Dialog with the default close label.</Dialog.Description>
          </Dialog.Content>
        </Dialog.Root>

        <Box asChild>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(String(new FormData(event.currentTarget).get('color')));
            }}
          >
            <Flex gap="3" wrap="wrap">
              <Select.Root name="color" value={color} onValueChange={setColor} required>
                <Select.Trigger aria-label="Accent color" placeholder="Choose a color" />
                <Select.Content>
                  <Select.Item value="blue">Blue</Select.Item>
                  <Select.Item value="green">Green</Select.Item>
                </Select.Content>
              </Select.Root>
              <Button type="submit">Save color</Button>
              <Button type="button" onClick={() => setColor('')}>
                Clear color
              </Button>
            </Flex>
            <Text as="div" role="status" mt="3">
              {submitted}
            </Text>
          </form>
        </Box>
      </main>
    </Flex>
  );
}
