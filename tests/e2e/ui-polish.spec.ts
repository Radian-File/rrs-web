import { expect, test } from "@playwright/test";

test("keyboard users can skip repeated navigation", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Lewati ke konten" })).toBeFocused();
});

test("homepage initializes the coordinated motion system and static content remains present", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("[data-hero-motion]")).toBeVisible();
  await expect(page.locator("[data-hero-artifact]")).toHaveCount(3);
  const revealGroup = page.locator("[data-reveal-group]").first();
  await revealGroup.scrollIntoViewIfNeeded();
  await expect(revealGroup).toHaveClass(/is-visible/);
  await expect(page.locator("[data-process-motion]")).toBeVisible();
  await expect(page.locator("[data-perspective-cta]")).toBeVisible();
});

test("reduced motion keeps all essential homepage content visible", async ({ page, context }) => {
  await context.clearCookies();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(300);
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(page.getByRole("heading", { level: 1, name: "Karya digital yang baik dimulai dari kejelasan." })).toBeVisible();
  await expect(page.locator("[data-hero-artifact]")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Feedback setelah pekerjaan benar-benar selesai." })).toBeVisible();
});

test("portal navigation exposes active state and breadcrumbs", async ({ page }) => {
  test.setTimeout(60_000);
  const email = `ui-client-${Date.now()}-${test.info().project.name}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Full name").fill("UI Polish Client");
  await page.getByLabel("WhatsApp number").fill("628111999888");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password");
  await page.getByLabel("Confirm password").fill("password");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((element) => element.textContent?.trim() === "Create an account");
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
