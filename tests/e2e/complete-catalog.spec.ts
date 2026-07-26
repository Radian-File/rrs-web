import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Owner sees the complete draft catalog and can safely rerun its import", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/owner/services");
  await expect(page.getByRole("heading", { name: "Analytics Setup" })).toBeVisible();
  await expect(page.getByText("Tanpa complexity level").first()).toBeVisible();

  await page.goto("/owner/services?page=2");
  await expect(page.getByRole("heading", { name: "Android Development" })).toBeVisible();
  await page.getByRole("button", { name: "Impor katalog default" }).click();
  await expect(page.getByText(/Katalog default diperiksa:/)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/0 layanan/)).toBeVisible();
});
