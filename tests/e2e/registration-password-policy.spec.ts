import { expect, test } from "@playwright/test";

async function fillRegistration(page: import("@playwright/test").Page, password: string) {
  await page.getByLabel("Full name").fill("Password Policy Client");
  await page.getByLabel("WhatsApp number").fill("628111555777");
  await page.getByLabel("Email").fill(`password-policy-${Date.now()}-${test.info().project.name}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
}

test("client registration rejects a password shorter than eight characters", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, "secret1");
  await page.getByRole("button", { name: "Create an account" }).click();
  await expect(page.getByText("Use at least 8 characters.", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("client registration accepts a simple matching eight-character password", async ({ page }) => {
  await page.goto("/register");
  await fillRegistration(page, "password");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((element) => element.textContent?.trim() === "Create an account");
    window.setTimeout(() => (button as HTMLButtonElement | undefined)?.click(), 100);
  });
  await expect(page).toHaveURL(/\/client$/, { timeout: 30_000 });
});
