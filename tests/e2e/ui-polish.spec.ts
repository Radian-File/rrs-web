import { expect, test } from "@playwright/test";

test("keyboard users can skip repeated navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("reduced motion prevents reveal initialization", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(300);
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
});

test("portal navigation exposes active state and breadcrumbs", async ({ page }) => {
  test.setTimeout(60_000);
  const email = `ui-client-${Date.now()}-${test.info().project.name}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Full name").fill("UI Polish Client");
  await page.getByLabel("WhatsApp number").fill("628111999888");
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
  await page.goto("/client/projects");

  const current = page.locator('a[aria-current="page"][href="/client/projects"]').first();
  await expect(current).toHaveAttribute("aria-current", "page");
  const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(breadcrumb).toContainText("Overview");
  await expect(breadcrumb).toContainText("Projects");
});
