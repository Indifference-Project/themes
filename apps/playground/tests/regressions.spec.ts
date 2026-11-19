import { expect, test } from '@playwright/test';

const SM_BREAKPOINT = 768;
/** A viewport below the `sm` breakpoint, where only the `initial` value applies. */
const BELOW_SM = { width: 400, height: 900 };
/** A viewport above the `sm` breakpoint, where the `sm` value applies. */
const ABOVE_SM = { width: SM_BREAKPOINT + 100, height: 900 };

test.beforeEach(async ({ page }) => {
  await page.goto('/test/regressions');
});

async function computedStyle(page: import('@playwright/test').Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      marginTop: style.marginTop,
      marginLeft: style.marginLeft,
      boxShadow: style.boxShadow,
      height: style.height,
    };
  });
}

test('applies arbitrary margin values to ScrollArea', async ({ page }) => {
  const style = await computedStyle(page, '#sa-m-arbitrary .rt-ScrollAreaRoot');
  expect(style.marginTop).toBe('100px');
  expect(style.marginLeft).toBe('100px');
});

test('applies responsive arbitrary margin values to ScrollArea', async ({ page }) => {
  await page.setViewportSize(BELOW_SM);
  const initial = await computedStyle(page, '#sa-m-responsive .rt-ScrollAreaRoot');
  expect(initial.marginTop).toBe('100px');

  await page.setViewportSize(ABOVE_SM);
  const aboveSm = await computedStyle(page, '#sa-m-responsive .rt-ScrollAreaRoot');
  expect(aboveSm.marginTop).toBe('200px');
});

test('applies responsive arbitrary margin values to ScrollArea axes', async ({ page }) => {
  await page.setViewportSize(BELOW_SM);
  const initial = await computedStyle(page, '#sa-mx-responsive .rt-ScrollAreaRoot');
  expect(initial.marginLeft).toBe('100px');

  await page.setViewportSize(ABOVE_SM);
  const aboveSm = await computedStyle(page, '#sa-mx-responsive .rt-ScrollAreaRoot');
  expect(aboveSm.marginLeft).toBe('200px');
});

test('matches the shared code path for responsive margins', async ({ page }) => {
  await page.setViewportSize(ABOVE_SM);
  const scrollArea = await computedStyle(page, '#sa-m-responsive .rt-ScrollAreaRoot');
  const box = await computedStyle(page, '#box-m-responsive .rt-Box');
  expect(scrollArea.marginTop).toBe(box.marginTop);
});

test('keeps the classic variant shadow when the input is invalid', async ({ page }) => {
  const invalid = await computedStyle(page, '.rt-TextFieldRoot:has(#tf-classic-invalid)');
  const valid = await computedStyle(page, '.rt-TextFieldRoot:has(#tf-classic-valid)');
  const surfaceInvalid = await computedStyle(page, '.rt-TextFieldRoot:has(#tf-surface-invalid)');

  // The red ring is layered on top of the classic shadow instead of replacing
  // it, so the invalid field has exactly one more inset layer than the valid one.
  expect(valid.boxShadow.split('inset').length).toBeGreaterThan(2);
  expect(invalid.boxShadow.split('inset').length).toBe(valid.boxShadow.split('inset').length + 1);

  // The surface variant replaces its grey border with the red ring.
  expect(surfaceInvalid.boxShadow.split('inset').length).toBe(2);
});

test('does not mutate or reject consumer props', async ({ page }) => {
  // A frozen responsive prop object must not throw during render.
  await expect(page.getByRole('button', { name: 'Frozen size' })).toBeVisible();

  // A shared responsive prop object must not be written to. The value is
  // recorded after mount, so this retries until the effect has run.
  await expect(page.locator('#shared-size-json')).toHaveText('{"size":{"sm":"3"}}');
});

test('renders `ghost` and `ghost-offset` as distinct variants', async ({ page }) => {
  const ghost = await computedStyle(page, '#button-ghost');
  const ghostOffset = await computedStyle(page, '#button-ghost-offset');

  // `ghost` is content-sized, `ghost-offset` keeps the standard button height.
  expect(ghost.height).not.toBe(ghostOffset.height);
});
