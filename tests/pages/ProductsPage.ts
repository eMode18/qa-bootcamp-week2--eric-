import { type Page, type Locator } from "@playwright/test";

// Page object for the Toolshop product list (the home page).
// All locators for this page live here, so tests only call methods.
export class ProductsPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.getByRole("combobox", { name: "sort" });
    // Prices have no ARIA role of their own, so use the site's test id
    this.productPrices = page.locator('[data-test="product-price"]');
  }

  async open() {
    await this.page.goto("/");
  }

  // option is the visible label, e.g. "Price (Low - High)"
  async sortBy(option: string) {
    await this.sortDropdown.selectOption({ label: option });
  }

  // Returns the shown prices as numbers, e.g. "$3.55" -> 3.55
  async prices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((text) => Number(text.replace(/[^0-9.]/g, "")));
  }
}
