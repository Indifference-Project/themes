import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/test/interactions');
});

test('composes the custom dialog node and localizes the close button', async ({
  page,
  isMobile,
}) => {
  const trigger = page.getByRole('button', { name: 'Open custom dialog' });
  await expect(trigger).toBeVisible();
  if (isMobile) {
    await trigger.tap();
  } else {
    await trigger.press('Enter');
  }

  const dialog = page.getByRole('dialog', { name: 'Keyboard settings' });
  await expect(dialog).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(dialog).toHaveClass(/rt-DialogContent/);
  await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
  await expect(dialog).toHaveAttribute('aria-describedby', /.+/);
  await expect(dialog).toHaveAccessibleDescription('Manage shortcuts for this demo.');
  const close = dialog.getByRole('button', { name: 'Cerrar' });
  await expect(close).toBeVisible();
  if (isMobile) {
    await close.tap();
  } else {
    await close.click();
  }
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('keeps the default close label and returns focus after Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'About this demo' });
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('has no serious or critical accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
  ).toEqual([]);
});

test('opens the existing composed dialog without a built-in close button', async ({ page }) => {
  await page.goto('/sink/dialog');
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Share resource' });
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();
});

test('submits the selected form value and clears required validity', async ({ page }) => {
  const nativeSelect = page.locator('select[name="color"]');
  await expect(page.locator('select[name="color"]:invalid')).toHaveCount(1);
  const trigger = page.getByRole('combobox', { name: 'Accent color' });
  await trigger.click();
  await page.getByRole('option', { name: 'Green' }).click();
  await page.getByRole('button', { name: 'Save color' }).click();
  await expect(page.getByRole('status')).toHaveText('green');
  await page.getByRole('button', { name: 'Clear color' }).click();
  await expect(nativeSelect).toHaveValue('');
  await expect(page.locator('select[name="color"]:invalid')).toHaveCount(1);
});
