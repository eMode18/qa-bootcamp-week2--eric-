import { test, expect } from "@playwright/test";

test("searching for pliers returns only pliers", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: "Search" }).fill("pliers");
  await page.getByRole("button", { name: "Search" }).click();

  // Product names are rendered as level-5 headings on each product card
  const productNames = page.getByRole("heading", { level: 5 });

  // The home page already shows products before the search, so keep retrying
  // until the list is non-empty and every name contains "pliers"
  await expect
    .poll(async () => {
      const names = await productNames.allTextContents();
      return names.length > 0 && names.every((name) => /pliers/i.test(name));
    })
    .toBe(true);
});
