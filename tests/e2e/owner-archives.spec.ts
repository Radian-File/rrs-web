import { expect, test } from "@playwright/test";

async function signInAsOwner(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: /Sign In|Masuk/ }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });
}

test("owner archives and restores an inquiry without changing its status", async ({ page }) => {
  test.setTimeout(90_000);
  const title = `Archive inquiry ${Date.now()}-${test.info().project.name}`;
  await page.goto("/start-project?service=website-development");
  await page.getByLabel("Full name").fill("Archive Inquiry Client");
  await page.getByLabel("WhatsApp number").fill("628123456789");
  await page.getByLabel("Email").fill(`archive-inquiry-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Project title").fill(title);
  await page.getByLabel("Project type").fill("Web application");
  await page.getByLabel("Project description").fill("A complete project brief used to verify that archiving only removes an inquiry from the active owner list.");
  await page.getByLabel("Project goals").fill("Keep the project data and workflow status available after moving it to the archive list.");
  await page.getByLabel("Required features").fill("Archive workflow\nOwner dashboard");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((element) => element.textContent?.trim() === "Submit Project Brief");
    window.setTimeout(() => (button as HTMLButtonElement | undefined)?.click(), 100);
  });
  await expect(page).toHaveURL(/brief-submitted/, { timeout: 30_000 });

  await signInAsOwner(page);
  await page.goto(`/owner/inquiries?q=${encodeURIComponent(title)}`);
  await page.getByRole("row").filter({ hasText: title }).getByRole("link").click();
  await expect(page.getByText("SUBMITTED", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: /Archive|Arsipkan/ }).click();
  await expect(page.getByText("Archived", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("SUBMITTED", { exact: true }).first()).toBeVisible();
  await page.goto("/owner/inquiries");
  await expect(page.getByText(title, { exact: true })).not.toBeVisible();
  await page.goto("/owner/inquiries/archive");
  const archivedInquiry = page.getByRole("row").filter({ hasText: title });
  await expect(archivedInquiry).toBeVisible();
  await archivedInquiry.getByRole("link").click();
  await page.getByRole("button", { name: "Restore", exact: true }).click();
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toBeVisible();
  await page.goto(`/owner/inquiries?q=${encodeURIComponent(title)}`);
  await expect(page.locator("tr:visible").filter({ hasText: title })).toBeVisible();
});

test("owner archives and restores a quotation without changing its total", async ({ page }) => {
  test.setTimeout(90_000);
  const title = `Archive quotation ${Date.now()}-${test.info().project.name}`;
  await signInAsOwner(page);
  await page.goto("/owner/quotations/create");
  const main = page.locator("main:visible");
  await main.getByLabel("Client name").fill("Archive Quotation Client");
  await main.getByLabel("Email").fill(`archive-quote-${Date.now()}@example.com`);
  await main.getByLabel("Project title").fill(title);
  await main.getByLabel("Project summary").fill("A detailed quotation used to validate archive visibility without changing financial data.");
  await main.getByLabel("Item 1 title").fill("Archive-safe implementation");
  await main.getByLabel("Item 1 description").fill("Implementation kept intact after archive and restore.");
  await main.getByLabel("Unit price").fill("2500000");
  await main.getByLabel("Scope included").fill("- Discovery\n- Implementation");
  await main.getByLabel("Terms and conditions").fill("Work begins after agreement acceptance and the first payment confirmation.");
  await main.getByRole("button", { name: "Save Draft" }).click();
  await expect(page).toHaveURL(/owner\/quotations\/(?!create$)[A-Za-z0-9-]+$/, { timeout: 30_000 });
  await expect(page.getByText(/Rp\s?2\.500\.000/, { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: /Archive|Arsipkan/ }).click();
  await expect(page.getByText("Archived", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Rp\s?2\.500\.000/, { exact: true }).first()).toBeVisible();
  await page.goto("/owner/quotations");
  await expect(page.getByText(title, { exact: true })).not.toBeVisible();
  await page.goto("/owner/quotations/archive");
  const archivedQuotation = page.getByRole("row").filter({ hasText: title });
  await expect(archivedQuotation).toBeVisible();
  await archivedQuotation.getByRole("link").click();
  await page.getByRole("button", { name: "Restore", exact: true }).click();
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toBeVisible();
});
