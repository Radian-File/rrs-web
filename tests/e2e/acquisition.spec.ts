import { expect, test } from "@playwright/test";

test("visitor can submit a structured brief and continue to WhatsApp", async ({ page }) => {
  await page.goto("/start-project?service=website-development");
  await page.getByLabel("Full name").fill("E2E Client");
  await page.getByLabel("WhatsApp number").fill("628123456789");
  await page.getByLabel("Email").fill(`e2e-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Project title").fill("Inventory management platform");
  await page.getByLabel("Project type").fill("Web application");
  await page.getByLabel("Project description").fill("A responsive inventory platform for tracking products, stock movements, and operational reporting across the business.");
  await page.getByLabel("Project goals").fill("Reduce manual stock errors and make inventory status visible to the operations team.");
  await page.getByLabel("Required features").fill("Authentication\nInventory dashboard\nStock movement history");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Budget range (optional)").fill("Rp8.000.000–Rp12.000.000");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (element) => element.textContent?.trim() === "Submit Project Brief",
    );
    window.setTimeout(() => (button as HTMLButtonElement | undefined)?.click(), 100);
  });

  await expect(page).toHaveURL(/brief-submitted/, { timeout: 30_000 });
  await expect(page.getByText("Brief received")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open WhatsApp" })).toBeVisible();
});

test("seeded owner can authenticate and open the owner workspace", async ({ page }) => {
  await page.goto("/owner");
  await expect(page).toHaveURL(/login/);
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/);
  await expect(page.getByText("Owner overview")).toBeVisible();
});

test("service detail keeps quotation as the primary conversion", async ({ page }) => {
  await page.goto("/services/website-development");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Website Development");
  await expect(page.getByRole("link", { name: "Request Quotation" })).toBeVisible();
  await expect(page.getByText("Final pricing follows the agreed scope")).toBeVisible();
});

test("owner can draft and send a quotation that the client accepts atomically", async ({ page }) => {
  test.setTimeout(120_000);
  const email = `quotation-${Date.now()}-${test.info().project.name}@example.com`;

  await page.goto("/owner/quotations/create");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/);
  await expect(page.getByText("Owner overview")).toBeVisible();
  await page.goto("/owner/quotations/create");

  await page.getByLabel("Client name").fill("Quotation E2E Client");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("WhatsApp").fill("628123456789");
  await page.getByLabel("Project title").fill("Quotation workflow test");
  await page.getByLabel("Project type").fill("Web application");
  await page.getByLabel("Project summary").fill("A complete project used to validate quotation drafting, secure delivery, and atomic acceptance.");
  await page.getByLabel("Item 1 title").fill("Product design and development");
  await page.getByLabel("Item 1 description").fill("Discovery, interface design, and implementation");
  await page.getByLabel("Unit price").fill("8000000");
  await page.getByLabel("Scope included").fill("- Discovery\n- UI/UX design\n- Full-stack implementation");
  await page.getByLabel("Terms and conditions").fill("Work begins after agreement acceptance and the first invoice is confirmed as paid.");
  await page.getByRole("button", { name: "Save Draft" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 0);
  });
  await expect(page).toHaveURL(/owner\/quotations\/[A-Za-z0-9-]+$/, { timeout: 30_000 });
  await expect(page.getByText(/QT-2026-/).first()).toBeVisible();

  await page.getByRole("link", { name: "Edit Draft" }).click();
  await page.getByRole("button", { name: "Save and Send" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 0);
  });
  await expect(page).toHaveURL(/token=/, { timeout: 30_000 });
  const publicHref = await page.getByRole("link", { name: "Open Client View" }).getAttribute("href");
  expect(publicHref).toBeTruthy();

  await page.goto(publicHref!);
  await expect(page.getByText("VIEWED", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Full name").fill("Quotation E2E Client");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("WhatsApp number").fill("628123456789");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Accept Quotation" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 0);
  });
  await expect(page).toHaveURL(/action=accepted/, { timeout: 30_000 });
  await expect(page.getByText("Quotation accepted.")).toBeVisible();

  await page.goto("/register");
  await page.getByLabel("Full name").fill("Quotation E2E Client");
  await page.getByLabel("WhatsApp number").fill("628123456789");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("StrongClient123!");
  await page.getByLabel("Confirm password").fill("StrongClient123!");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (element) => element.textContent?.trim() === "Create Client Account",
    );
    window.setTimeout(() => (button as HTMLButtonElement | undefined)?.click(), 100);
  });
  await expect(page).toHaveURL(/\/client$/, { timeout: 30_000 });

  await page.goto("/client/projects");
  await page.getByText("Quotation workflow test", { exact: true }).click();
  await expect(page.getByText("Project agreement is ready")).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Accept Agreement" }).click();
  await expect(page.getByText("AWAITING DOWN PAYMENT", { exact: true })).toBeVisible();
  const clientProjectUrl = page.url();
  const invoiceLink = page.getByRole("link", { name: /View INV-2026-/ });
  await expect(invoiceLink).toBeVisible();
  const invoiceUrl = await invoiceLink.getAttribute("href");
  const invoiceLabel = await invoiceLink.textContent();
  const invoiceNumber = invoiceLabel?.replace("View ", "").trim();
  expect(invoiceUrl).toBeTruthy();
  expect(invoiceNumber).toBeTruthy();

  await page.goto(invoiceUrl!);
  await page.locator('input[name="proof"]').setInputFiles({
    name: "payment-proof.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\nRRS manual payment E2E fixture"),
  });
  await page.getByRole("button", { name: "Submit Proof" }).click();
  await expect(page.getByText("UNDER_VERIFICATION", { exact: true })).toBeVisible();

  await page.context().clearCookies();
  await page.goto("/owner/payments");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Owner overview")).toBeVisible();
  await page.goto("/owner/payments");
  const paymentCard = page.locator(`[data-invoice="${invoiceNumber}"]`);
  await expect(paymentCard).toBeVisible();
  await paymentCard.getByRole("button", { name: "Verify Payment" }).click();
  await expect(paymentCard.getByText("VERIFIED", { exact: true })).toBeVisible();

  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("StrongClient123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/client$/);
  await page.goto(invoiceUrl!);
  await expect(page.getByText("PAID", { exact: true }).first()).toBeVisible();
  await page.goto(clientProjectUrl);
  await expect(page.getByText("PLANNING", { exact: true })).toBeVisible();
});
