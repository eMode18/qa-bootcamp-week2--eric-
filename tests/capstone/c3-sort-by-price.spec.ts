import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";

// True when each price is no higher than the next one.
// Fewer than 2 prices means the list hasn't loaded yet, so that counts as false.
function isAscending(prices: number[]): boolean {
  if (prices.length < 2) return false;
  return prices.every((price, i) => i === 0 || prices[i - 1] <= price);
}

test("C3 Sort by price", async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await productsPage.open();
  await productsPage.sortBy("Price (Low - High)");

  // Page 1: the list reloads after sorting, so retry until it is cheapest first
  await expect.poll(async () => isAscending(await productsPage.prices())).toBe(true);
  const page1Prices = await productsPage.prices();
  const page1Highest = page1Prices[page1Prices.length - 1];

  // Page 2 must carry on from page 1, which proves the whole list is sorted,
  // not just each page on its own
  await productsPage.goToPage(2);
  await expect
    .poll(async () => {
      const page2Prices = await productsPage.prices();
      return isAscending(page2Prices) && page2Prices[0] >= page1Highest;
    })
    .toBe(true);
});
