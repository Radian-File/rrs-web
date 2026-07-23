import { expect, test } from "@playwright/test";

test("homepage communicates the quotation-first workflow", async ({ page, context }) => {
  await context.clearCookies();
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");

  await expect(page.getByRole("heading", { level: 1, name: "Karya digital yang baik dimulai dari kejelasan." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Login untuk mengajukan quotation" }).first()).toBeVisible();
  await expect(page.getByText("Ketahui apa yang dibangun sebelum pekerjaan dimulai.")).toBeVisible();
  await expect(page.getByText(/Pembayaran berasal dari invoice setelah quotation dan agreement/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Feedback setelah pekerjaan benar-benar selesai." })).toBeVisible();
});
