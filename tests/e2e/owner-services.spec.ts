import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("owner can open a service type workspace and create within its locked type", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/owner/services/types");
  await page.getByRole("link", { name: "Buka layanan jenis Website Development" }).click();
  await expect(page).toHaveURL(/\/owner\/services\?type=website-development/);
  await expect(page.getByText("Jenis aktif:", { exact: true }).locator("..")).toContainText("Website Development");
  await page.getByRole("link", { name: "Buat layanan di Website Development" }).click();
  await expect(page).toHaveURL(/\/owner\/services\/create\?type=website-development/);
  await expect(page.getByLabel("Jenis layanan terkunci")).toHaveValue("Website Development");
  await expect(page.getByText("Dipilih dari workspace Jenis Layanan.")).toBeVisible();

  await page.goto("/owner/services");
  await expect(page.getByRole("button", { name: "Impor preset Services III" })).toBeVisible();
});

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
  await expect(page.getByRole("button", { name: "Buat draft Level 1–3" })).toBeVisible();
  await page.getByRole("button", { name: "Buat draft Level 1–3" }).click();
  await expect(page.getByText("Draft Level 1–3 telah dibuat", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Nama level untuk Client")).toHaveCount(3);

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
