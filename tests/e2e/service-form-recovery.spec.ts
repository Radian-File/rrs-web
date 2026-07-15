import { expect, test } from "@playwright/test";

test("service editor retains entered fields when the slug is already used", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/owner/services/create");
  const main = page.locator("main:visible");
  await main.getByLabel("Nama layanan").fill("Retained Service Draft");
  await main.getByLabel("Slug URL").fill("website-development");
  await main.getByLabel("Kategori").fill("Website");
  await main.getByLabel("Ringkasan layanan").fill("Ringkasan layanan yang tidak boleh hilang saat slug ditolak.");
  await main.getByLabel("Deskripsi lengkap").fill("Deskripsi lengkap layanan yang cukup panjang untuk membuktikan seluruh input tetap tersedia setelah validasi slug gagal.");
  await main.locator('textarea[name="deliverables"]').fill("Discovery\nImplementation");
  await main.locator('textarea[name="technologies"]').fill("Next.js\nTypeScript");
  await main.getByRole("button", { name: "Buat layanan" }).click();

  await expect(main.getByText("Slug sudah digunakan oleh layanan lain.", { exact: true })).toBeVisible();
  await expect(main.getByLabel("Nama layanan")).toHaveValue("Retained Service Draft");
  await expect(main.getByLabel("Ringkasan layanan")).toHaveValue("Ringkasan layanan yang tidak boleh hilang saat slug ditolak.");
  await expect(main.getByLabel("Slug URL")).toHaveValue("website-development");
});
