import { expect, test } from "@playwright/test";

test("an invalid project step cannot advance to submission", async ({ page }) => {
  const email = `validation-${Date.now()}-${test.info().project.name}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Validation Client");
  await page.getByLabel("WhatsApp number").fill("628123456789");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password");
  await page.getByLabel("Confirm password").fill("password");
  await page.getByRole("button", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/client$/, { timeout: 30_000 });

  await page.goto("/start-project");
  await expect(page.getByLabel("Full name")).toHaveValue("Validation Client");
  await expect(page.getByLabel("Email")).toHaveValue(email);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Judul project").fill("x");
  await page.getByLabel("Jenis project").fill("Website");
  await page.getByLabel("Deskripsi project").fill("A valid description that is long enough to satisfy the project brief schema.");
  await page.getByLabel("Tujuan project").fill("Validate the step guard.");
  await page.getByLabel("Fitur yang dibutuhkan").fill("Contact form");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Too small: expected string to have >=3 characters", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Rentang budget")).toBeVisible();
  await expect(page.getByLabel("Target deadline (opsional)")).toBeHidden();
  await expect(page.getByLabel("Judul project")).toBeVisible();
});
