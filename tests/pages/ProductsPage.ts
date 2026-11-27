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
    // Prices as the shopper sees them, e.g. "$14.15" (one per product card)
    this.productPrices = page.getByText(/^\$\d+\.\d{2}$/);
  }

  async open() {
    await this.page.goto("/");
  }

  // option is the visible label, e.g. "Price (Low - High)"
  async sortBy(option: string) {
    await this.sortDropdown.selectOption({ label: option });
  }

  // Click a page number in the pagination bar below the products
  async goToPage(pageNumber: number) {
    await this.page.getByRole("button", { name: `Page-${pageNumber}` }).click();
  }

  // Returns the shown prices as numbers, e.g. "$3.55" -> 3.55
  async prices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((text) => Number(text.replace(/[^0-9.]/g, "")));
  }
}
