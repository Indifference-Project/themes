import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/test/upstream-regressions');
});

test('#605 Popover opens when the trigger Avatar is in fallback mode', async ({ page }) => {
  const trigger = page.getByLabel('Open popover', { exact: true });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByText('Popover content', { exact: true })).toBeVisible();
});

test('#605 Popover still opens when the trigger Avatar has a src', async ({ page }) => {
  const trigger = page.getByLabel('Open popover src', { exact: true });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByText('Popover content src', { exact: true })).toBeVisible();
});

test('#435 right-aligned TextField keeps an inset on the end edge', async ({ page }) => {
  const input = page.locator('#tf-rtl input');
  const metrics = await input.evaluate((el: HTMLInputElement) => {
    const cs = getComputedStyle(el);
    return {
      textAlign: cs.textAlign,
      textIndent: cs.textIndent,
      paddingEnd: cs.paddingInlineEnd,
    };
  });
  expect(metrics.textAlign).toBe('right');
  // The inline-end padding must be non-zero so right-aligned text isn't flush
  // against the border.
  expect(parseFloat(metrics.paddingEnd)).toBeGreaterThan(0);
});
