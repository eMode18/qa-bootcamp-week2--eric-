import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

// The trainer's page sits next to this test; turn its path into a file:// URL
const pageUrl = pathToFileURL(path.join(__dirname, "index.html")).href;

test("Drill: Save shows Saved", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole("button", { name: "Save" }).click();

  // FIXED: no guessed wait. toHaveText keeps re-checking until the message
  // appears (up to 5 s), so any delay from 0 to 1 second passes, and the test
  // moves on as soon as "Saved" shows.
  // The status paragraph has no role or label, so it is located by its id
  await expect(page.locator("#status")).toHaveText("Saved");
});
