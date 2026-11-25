import { test, expect } from "@playwright/test";

test("invalid login is rejected with an error message", async ({ page }) => {
  await page.goto("/auth/login");

  // An account that does not exist
  await page.getByRole("textbox", { name: "Email address" }).fill("nobody@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("WrongPass123!");
  await page.getByRole("button", { name: "Login" }).click();

  // The error box has no ARIA role (only aria-live), so match it by its text
  await expect(page.getByText("Invalid email or password")).toBeVisible();
});
