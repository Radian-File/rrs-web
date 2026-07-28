import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Owner can show and hide the default draft catalog without importing data", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/owner/services");
  await expect(page.getByRole("link", { name: "Tampilkan draft default" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Analytics Setup" })).toHaveCount(0);

  await page.getByRole("link", { name: "Tampilkan draft default" }).click();
  await expect(page.getByRole("heading", { name: "Analytics Setup" })).toBeVisible();
  await expect(page.getByText("Tanpa complexity level").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Sembunyikan draft default" })).toBeVisible();

  await page.getByRole("link", { name: "Sembunyikan draft default" }).click();
  await expect(page.getByRole("heading", { name: "Analytics Setup" })).toHaveCount(0);
});
