import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

// The trainer's page sits next to this test; turn its path into a file:// URL
const pageUrl = pathToFileURL(path.join(__dirname, "index.html")).href;

test("Drill: Save shows Saved", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole("button", { name: "Save" }).click();

  // UNFIXED: guess how long the message takes, then read it once
  await page.waitForTimeout(500);
  // The status paragraph has no role or label, so it is located by its id
  const text = await page.locator("#status").textContent();
  expect(text).toBe("Saved");
});
