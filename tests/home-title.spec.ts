import { test, expect } from "@playwright/test";

test("home page has the expected title", async ({ page }) => {
  // "/" resolves against baseURL from playwright.config.ts
  await page.goto("/");

  // Title confirmed on the live site
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");
});
