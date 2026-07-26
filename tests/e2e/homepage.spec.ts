import { expect, test } from "@playwright/test";

test("homepage follows the reference-led quotation-first journey", async ({ page, context }) => {
  await context.clearCookies();
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");

  await expect(page.getByRole("heading", { level: 1, name: "WEBSITE & SISTEM DIGITAL, DENGAN SCOPE YANG JELAS." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mulai brief proyek" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "SEMUA YANG DIBUTUHKAN, DALAM SATU PROSES." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "DIBUAT UNTUK MENJAGA PROJECT TETAP JELAS." })).toBeVisible();
  await expect(page.getByRole("heading", { name: /APA YANG CLIENT SUKAI TENTANG RRS|BUKTI DELIVERY, BUKAN PUJIAN PALSU/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "MASIH PUNYA PERTANYAAN?" })).toBeVisible();
  await page.locator("[data-perspective-cta]").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "BANGUN DENGAN ARAH, BUKAN ASUMSI." })).toBeVisible();
});
