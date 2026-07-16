import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("owner can create, publish, and unpublish a service without deleting it", async ({ page }) => {
  test.setTimeout(90_000);
  const slug = `service-reference-${Date.now()}-${test.info().project.name}`;
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/owner/services/create");
  const main = page.locator("main:visible");
  await main.getByLabel("Nama layanan").fill("Service Reference Test");
  await main.getByLabel("Slug URL").fill(slug);
  await main.getByLabel("Jenis layanan").selectOption({ label: "Web Development" });
  await main.getByLabel("Harga mulai dari (IDR)").fill("1000000");
  await main.getByLabel("Ringkasan layanan").fill("Layanan referensi untuk menguji kontrol Owner.");
  await main.getByLabel("Deskripsi lengkap").fill("Deskripsi layanan referensi yang cukup lengkap untuk memvalidasi pembuatan, publikasi, dan unpublish dari Owner Dashboard.");
  await main.getByLabel("Deliverables").fill("Discovery\nImplementation");
  await main.getByLabel("Teknologi / keahlian").fill("Next.js\nTypeScript");
  await main.getByRole("button", { name: "Buat layanan" }).click();
  await expect(page.getByText("Layanan dibuat sebagai draf", { exact: false })).toBeVisible({ timeout: 30_000 });
  const editUrl = page.url();

  await page.goto(`/services/${slug}`);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.goto(editUrl);
  await page.getByRole("checkbox", { name: "Publikasikan ke halaman publik" }).check();
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page.getByText("berhasil diperbarui dan dipublikasikan", { exact: false })).toBeVisible();
  await page.goto(`/services/${slug}`);
  await expect(page.getByRole("heading", { name: "Service Reference Test" })).toBeVisible();

  await page.goto(editUrl);
  await page.getByRole("checkbox", { name: "Publikasikan ke halaman publik" }).uncheck();
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page.getByText("Draf layanan berhasil disimpan.", { exact: true })).toBeVisible();
  await page.goto(`/services/${slug}`);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
