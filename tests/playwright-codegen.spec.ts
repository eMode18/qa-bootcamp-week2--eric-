import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page
    .locator('[data-test="product-01M8693VZZPRPAV4N0586ZBXNP"]')
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Quantity$/ })
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Quantity$/ })
    .click();
  await page.getByText("Add to cart Add to favourites").click();
  await page.locator('[data-test="nav-home"]').click();
  await page
    .locator('[data-test="product-01M8693W13BQ76GH9RGHKAJGCW"]')
    .click();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.getByRole("link", { name: "Bolt Cutters Bolt Cutters" }).click();
  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="decrease-quantity"]').click();
  await page.locator('[data-test="increase-quantity"]').dblclick();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.locator('[data-test="nav-cart"]').click();
  await page
    .getByRole("spinbutton", { name: "Quantity for Bolt Cutters" })
    .click();
  await page
    .getByRole("spinbutton", { name: "Quantity for Bolt Cutters" })
    .fill("2");
  await page
    .getByText(
      "View the Documentation for this application. Practice Black Box Testing & Bug",
    )
    .click();
  await page.locator('[data-test="continue-shopping"]').click();
  await page.locator('[data-test="sort"]').selectOption("price,asc");
  await page
    .locator('[data-test="category-01M8693VYKHDWT3CP91BXGS4ET"]')
    .check();
  await page.getByText("Grinder").click();
  await page
    .locator('[data-test="category-01M8693VYKHDWT3CP91BXGS4F1"]')
    .check();
  await page.getByText("Drill").click();
  await page
    .locator('[data-test="category-01M8693VYKHDWT3CP91BXGS4F4"]')
    .check();
  await page.getByText("Grinder").click();
  await page
    .locator('[data-test="category-01M8693VYKHDWT3CP91BXGS4F1"]')
    .uncheck();
  await page.locator('[data-test="eco-friendly-filter"]').check();
  await page.getByText("Show only eco-friendly").click();
  await page.locator('[data-test="eco-friendly-filter"]').uncheck();
  await page.getByRole("slider", { name: "ngx-slider-max" }).click();
  await page.getByRole("slider", { name: "ngx-slider-max" }).click();
  await page.locator('[data-test="sort"]').selectOption("price,desc");
  await page.getByRole("slider", { name: "ngx-slider-max" }).click();
  await page.getByRole("slider", { name: "ngx-slider-max" }).click();
  await page.getByText("Grinder").click();
  await page
    .locator('[data-test="category-01M8693VYKHDWT3CP91BXGS4F1"]')
    .check();
  await page.getByText("Grinder").click();
  await page
    .locator('[data-test="category-01M8693VYKHDWT3CP91BXGS4F1"]')
    .uncheck();
  await page.getByRole("slider", { name: "ngx-slider-max" }).click();
  await page.locator('[data-test="nav-home"]').click();
  await page.locator('[data-test="nav-cart"]').click();
});
