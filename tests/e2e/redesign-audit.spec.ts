import { expect, test } from "@playwright/test";
import { Pool } from "pg";

const cleanupPool = new Pool({ connectionString: process.env.DATABASE_URL });

test.describe("A1-A6 redesign audit", () => {
  test.describe.configure({ mode: "serial" });
  const stackNames = new Set<string>();

  test.afterEach(async () => {
    if (stackNames.size > 0) {
      await cleanupPool.query('DELETE FROM "StudioStackItem" WHERE "name" = ANY($1::text[])', [[...stackNames]]);
      stackNames.clear();
    }
  });

  test.afterAll(async () => {
    await cleanupPool.end();
  });

  test("service discovery exposes type and service controls", async ({ page }) => {
    await page.goto("/services");
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toBeVisible();
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#service-navigator-title")).toBeVisible();
    await expect(page.locator("#service-options-panel button").first()).toBeVisible();

    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
      await expect(page.locator("#service-options-panel button").first()).toHaveAttribute("aria-pressed", "true");
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("About keeps verified identity inside the viewport", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Bandung & Bekasi, Indonesia", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("registration explains why contact fields are required", async ({ page }) => {
    await page.goto("/register");
    const whatsappHelp = page.getByRole("button", { name: "Contact number purpose" });
    await whatsappHelp.focus();
    const tooltip = whatsappHelp.locator("xpath=..").locator('span[aria-hidden="true"]');
    await expect(tooltip).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(tooltip).toBeHidden();

    await expect(page.getByRole("textbox", { name: "WhatsApp number", exact: true })).toHaveAttribute("autocomplete", "tel");
    await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveAttribute("autocomplete", "email");
    await expect(page.getByRole("textbox", { name: "Full name", exact: true })).toHaveAttribute("autocomplete", "name");
    await expect(page.getByRole("textbox", { name: "Company (optional)", exact: true })).toHaveAttribute("autocomplete", "organization");
  });

  test("Owner can publish and unpublish an About stack item", async ({ page }) => {
    test.setTimeout(90_000);
    const name = `Audit Stack ${Date.now()} ${test.info().project.name}`;
    stackNames.add(name);

    await page.goto("/login");
    await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
    await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

    await page.goto("/owner/settings");
    const createForm = page.locator("form").filter({ hasText: "New technology" });
    await createForm.getByLabel("Technology").fill(name);
    await createForm.getByLabel("Category").selectOption("TOOLING");
    await createForm.getByLabel("Order").fill("90");
    await createForm.getByRole("button", { name: "Add draft" }).click();
    await expect(page.getByText("Technology ditambahkan sebagai draft.")).toBeVisible();

    const item = page.getByRole("article").filter({ has: page.locator(`input[name="name"][value="${name}"]`) });
    await expect(item.getByRole("button", { name: "Publish" })).toBeVisible();
    await item.getByRole("button", { name: "Publish" }).click();
    await expect(item.getByRole("button", { name: "Unpublish" })).toBeVisible();
    await expect.poll(async () => {
      const state = await cleanupPool.query<{ isPublished: boolean }>('SELECT "isPublished" FROM "StudioStackItem" WHERE "name" = $1', [name]);
      return state.rows[0]?.isPublished;
    }).toBe(true);
    await page.goto(`/about?audit=${encodeURIComponent(name)}-published`);
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();

    await page.goto("/owner/settings");
    const publishedItem = page.getByRole("article").filter({ has: page.locator(`input[name="name"][value="${name}"]`) });
    await publishedItem.getByRole("button", { name: "Unpublish" }).click();
    await expect(publishedItem.getByRole("button", { name: "Publish" })).toBeVisible();
    await expect.poll(async () => {
      const state = await cleanupPool.query<{ isPublished: boolean }>('SELECT "isPublished" FROM "StudioStackItem" WHERE "name" = $1', [name]);
      return state.rows[0]?.isPublished;
    }).toBe(false);
    await page.goto(`/about?audit=${encodeURIComponent(name)}-unpublished`);
    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  });
});
