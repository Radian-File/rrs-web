import { expect, test } from "@playwright/test";

test("defaults to Indonesian and persists an English language change", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Proses yang tepat untuk proyek digital Anda.",
    }),
  ).toBeVisible();

  let englishButton = page.getByRole("button", { name: "en", exact: true });
  if (!(await englishButton.isVisible().catch(() => false))) {
    await page.getByLabel("Open navigation menu").click();
    englishButton = page.getByRole("button", { name: "en", exact: true });
  }
  await englishButton.evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 100);
  });

  await expect(page.locator("html")).toHaveAttribute("lang", "en", {
    timeout: 30_000,
  });
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The right process for your next digital project.",
    }),
  ).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
