import { expect, test } from "@playwright/test";

test("registration keeps contact details but clears passwords after validation failure", async ({ page }) => {
  const email = `retained-${Date.now()}-${test.info().project.name}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Retained Client");
  await page.getByLabel("WhatsApp number").fill("628111000999");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByLabel("Confirm password").fill("short");
  await page.getByRole("button", { name: "Create an account" }).click();

  await expect(page.getByText("Use at least 8 characters.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue(email);
  await expect(page.getByLabel("Full name")).toHaveValue("Retained Client");
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Confirm password")).toHaveValue("");
});

test("contact validation retains input and renders an inline message error", async ({ page }) => {
  const email = `contact-retained-${Date.now()}-${test.info().project.name}@example.com`;
  await page.goto("/contact");
  await page.getByLabel("Name", { exact: true }).fill("Retained Contact");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Subject").fill("Hello");
  await page.getByLabel("Message").fill("Too short");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Pesan minimal 20 karakter.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Retained Contact");
  await expect(page.getByLabel("Email")).toHaveValue(email);
  await expect(page.getByLabel("Message")).toHaveValue("Too short");
  await expect(page).toHaveURL(/\/contact$/);
});
