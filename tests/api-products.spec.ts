import { test, expect } from "@playwright/test";

test("GET /products returns a list of products", async ({ request }) => {
  // Full API address: baseURL in playwright.config.ts points at the UI site, not the API
  const response = await request.get("https://api.practicesoftwaretesting.com/products");

  expect(response.status()).toBe(200);

  // The product list lives in the "data" field and should not be empty
  const body = await response.json();
  expect(body.data.length).toBeGreaterThan(0);
});
