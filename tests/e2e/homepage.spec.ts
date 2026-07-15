import { expect, test } from "@playwright/test";

test("homepage communicates the quotation-first workflow", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("right process");
  await expect(page.getByRole("link", { name: "Start a Project" }).first()).toBeVisible();
  await expect(page.getByText("Know the scope and cost before the work begins.")).toBeVisible();
  await expect(page.getByText("No payment is requested before the quotation")).toBeVisible();
});
