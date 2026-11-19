// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotDir: './tests/__snapshots__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',

  // Shared settings for all projects
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Configure snapshot comparison
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  // Build and run the production server before starting tests
  webServer: {
    command: 'pnpm --filter "playground" build && pnpm --filter "playground" start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: process.env.CI ? '**/visual-regression.spec.ts' : undefined,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: process.env.CI ? '**/visual-regression.spec.ts' : undefined,
    },
    {
      name: 'android-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: '**/interactions.spec.ts',
    },
    {
      name: 'ios-safari',
      use: { ...devices['iPhone 15'] },
      testMatch: '**/interactions.spec.ts',
    },
  ],
});
