import { expect, test } from '@playwright/test';

test('#147 context menu relocates immediately when right-clicked again', async ({ page }) => {
  await page.goto('/test/upstream-regressions');
  const area = page.locator('#ctx-area > div').first();
  const box = await area.boundingBox();
  if (!box) throw new Error('no box');

  await page.mouse.click(box.x + 30, box.y + 30, { button: 'right' });
  await page.waitForTimeout(200);
  const first = page.locator('[data-radix-popper-content-wrapper]').first();
  const transform1 = await first.evaluate((el) => (el as HTMLElement).style.transform);

  await page.mouse.click(box.x + 220, box.y + 80, { button: 'right' });
  await page.waitForTimeout(60);
  const transform2 = await page
    .locator('[data-radix-popper-content-wrapper]')
    .first()
    .evaluate((el) => (el as HTMLElement).style.transform);

  // The menu should move to the new pointer location, not stay locked while
  // the closing animation plays.
  expect(transform2).not.toBe(transform1);
});
