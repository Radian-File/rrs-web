import { expect, test } from "@playwright/test";

test("owner can review analytics and change the shared period URL", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/owner/analytics");
  await expect(page.getByRole("heading", { name: "Business health, without the noise." })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Selected period" }).getByRole("link", { name: "30 days" })).toBeVisible();

  await page.getByRole("navigation", { name: "Selected period" }).getByRole("link", { name: "7 days" }).click();
  await expect(page).toHaveURL(/period=7d/);
  await expect(page.getByRole("heading", { name: "Business health, without the noise." })).toBeVisible();
});
