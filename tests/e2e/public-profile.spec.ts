import { expect, test } from "@playwright/test";

test("portfolio and About page link to the professional profile with formal identity copy", async ({ page }) => {
  await page.goto("/portfolio");
  const portfolioLink = page.getByRole("link", { name: "Open portfolio" });
  await expect(portfolioLink).toHaveAttribute("href", "https://rrs-porto.vercel.app");
  await expect(portfolioLink).toHaveAttribute("target", "_blank");
  await expect(portfolioLink).toHaveAttribute("rel", "noreferrer");

  await page.goto("/about");
  await expect(page.getByText("RRS is an independent digital service practice", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "View full portfolio" })).toHaveAttribute("href", "https://rrs-porto.vercel.app");
});

test("contact page exposes the configured direct WhatsApp destination", async ({ page }) => {
  await page.goto("/contact");
  const whatsappLink = page.getByRole("link", { name: "Chat WhatsApp" });
  await expect(whatsappLink).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+/);
  await expect(page.getByText(/^\+62 /)).toBeVisible();
});
