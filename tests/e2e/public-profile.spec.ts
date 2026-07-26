import { expect, test } from "@playwright/test";

test("retired portfolio URL redirects to About and keeps RRS direct-ownership positioning", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page).toHaveURL(/\/about$/);

  const aboutMain = page.locator("main:visible").first();
  await expect(aboutMain.getByText("One technical partner, from scope to handover.")).toBeVisible();
  await expect(aboutMain.getByText("You work directly with the person who reviews the need", { exact: false })).toBeVisible();
  await expect(aboutMain.getByRole("link", { name: "Explore services" })).toBeVisible();
});

test("contact page exposes the configured direct WhatsApp destination", async ({ page }) => {
  await page.goto("/contact");
  const whatsappLink = page.locator("main:visible").getByRole("link", { name: "Discuss through WhatsApp" });
  await expect(whatsappLink).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+/);
  await expect(page.locator("main:visible").getByText(/^\+62 /)).toBeVisible();
});
