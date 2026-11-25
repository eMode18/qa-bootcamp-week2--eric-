import { test, expect } from "@playwright/test";
import { ProductsPage } from "./pages/ProductsPage";

// True when each price is no higher than the next one.
// Fewer than 2 prices means the list hasn't loaded yet, so that counts as false.
function isAscending(prices: number[]): boolean {
  if (prices.length < 2) return false;
  return prices.every((price, i) => i === 0 || prices[i - 1] <= price);
}

test("EW-11: products are sorted from lowest to highest price", async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await productsPage.open();
  await productsPage.sortBy("Price (Low - High)");

  // The list reloads after sorting, so keep checking until it is in ascending order
  await expect.poll(async () => isAscending(await productsPage.prices())).toBe(true);
});
