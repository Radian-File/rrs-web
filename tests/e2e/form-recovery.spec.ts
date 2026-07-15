import { expect, test } from "@playwright/test";

test("registration keeps contact details but clears passwords after validation failure", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Retained Client");
  await page.getByLabel("WhatsApp number").fill("628111000999");
  await page.getByLabel("Email").fill("retained@example.com");
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByLabel("Confirm password").fill("short");
  await page.getByRole("button", { name: "Create an account" }).click();

  await expect(page.getByText("Use at least 8 characters.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue("retained@example.com");
  await expect(page.getByLabel("Full name")).toHaveValue("Retained Client");
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Confirm password")).toHaveValue("");
});

test("contact validation retains input and renders an inline message error", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Nama").fill("Retained Contact");
  await page.getByLabel("Email").fill("contact-retained@example.com");
  await page.getByLabel("Subjek").fill("Halo");
  await page.getByLabel("Pesan").fill("Terlalu singkat");
  await page.getByRole("button", { name: "Kirim pesan" }).click();

  await expect(page.getByText("Pesan minimal 20 karakter.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Nama")).toHaveValue("Retained Contact");
  await expect(page.getByLabel("Email")).toHaveValue("contact-retained@example.com");
  await expect(page.getByLabel("Pesan")).toHaveValue("Terlalu singkat");
  await expect(page).toHaveURL(/\/contact$/);
});
