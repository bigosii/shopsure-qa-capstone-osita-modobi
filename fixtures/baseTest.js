import { test as base } from '@playwright/test';

// Ad and tracking hosts on automationexercise.com. Their full-screen ads
// cover the page and make tests slow and flaky, so we stop them loading.
const adHostPattern = /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages|googletagmanager|google-analytics/;

// Same "test" as Playwright's, but every page blocks ads before the test starts
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(adHostPattern, (route) => route.abort());
    await use(page);
  },
});
