import { expect, test } from "@playwright/test";

test("anonymous users are redirected before a deep owner route renders", async ({
  page,
}) => {
  await page.goto("/owner/quotations/create");

  await expect(page).toHaveURL(/\/login/);
  expect(decodeURIComponent(page.url())).toContain("/owner/quotations/create");
  await expect(page.getByRole("heading", { name: "Sign in to your portal." })).toBeVisible();
});

test("client sessions cannot access owner routes and logout removes access", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const email = `protected-client-${Date.now()}-${test.info().project.name}@example.com`;

  await page.goto("/register");
  await page.getByLabel("Full name").fill("Protected Route Client");
  await page.getByLabel("WhatsApp number").fill("628111222333");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("StrongClient123!");
  await page.getByLabel("Confirm password").fill("StrongClient123!");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (element) => element.textContent?.trim() === "Create an account",
    );
    window.setTimeout(() => (button as HTMLButtonElement | undefined)?.click(), 100);
  });
  await expect(page).toHaveURL(/\/client$/, { timeout: 30_000 });

  await page.goto("/owner/inquiries");
  await expect(page).toHaveURL(/\/client$/);

  await page.getByRole("button", { name: "Sign out" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 100);
  });
  await expect(page).toHaveURL(/\/login$/, { timeout: 30_000 });

  await page.goto("/client/projects");
  await expect(page).toHaveURL(/\/login/);
});

test("owner sessions are redirected away from client-only routes", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  await page.goto("/client/projects");
  await expect(page).toHaveURL(/\/owner$/);
  await expect(page.getByText("Owner overview")).toBeVisible();
});
