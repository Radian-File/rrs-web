import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("guest technical brief requires a Client account", async ({ page }) => {
  await page.goto("/start-project?service=website-development");
  await expect(page).toHaveURL(/\/login/);
  expect(decodeURIComponent(page.url())).toContain("/start-project?service=website-development");
  await expect(page.getByRole("heading", { name: "Sign in to your portal." })).toBeVisible();
});

test("seeded owner can authenticate and open the owner workspace", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });
  await expect(page.getByText("Owner overview")).toBeVisible();
});

test("service detail keeps quotation as the primary conversion", async ({ page }) => {
  await page.goto("/services/website-development");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Website Development");
  await expect(page.locator("main:visible").getByRole("link", { name: "Sign in to request a quotation" })).toBeVisible();
  await expect(page.getByText("Final pricing follows the agreed scope")).toBeVisible();
});

test("owner can draft and send a quotation that the client accepts atomically", async ({ page }) => {
  test.setTimeout(180_000);
  const email = `quotation-${Date.now()}-${test.info().project.name}@example.com`;

  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });
  await expect(page.getByText("Owner overview")).toBeVisible();
  await page.goto("/owner/quotations/create");

  const ownerMain = page.locator("main:visible");
  await ownerMain.getByLabel("Client name").fill("Quotation E2E Client");
  await ownerMain.getByLabel("Email").fill(email);
  await ownerMain.getByLabel("WhatsApp").fill("628123456789");
  await ownerMain.getByLabel("Project title").fill("Quotation workflow test");
  await ownerMain.getByLabel("Project type").fill("Web application");
  await ownerMain.getByLabel("Project summary").fill("A complete project used to validate quotation drafting, secure delivery, and atomic acceptance.");
  await ownerMain.getByLabel("Item 1 title").fill("Product design and development");
  await ownerMain.getByLabel("Item 1 description").fill("Discovery, interface design, and implementation");
  await ownerMain.getByLabel("Unit price").fill("8000000");
  await ownerMain.getByLabel("Scope included").fill("- Discovery\n- UI/UX design\n- Full-stack implementation");
  await ownerMain.getByLabel("Terms and conditions").fill("Work begins after agreement acceptance and the first invoice is confirmed as paid.");
  await ownerMain.getByRole("button", { name: "Save Draft" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 0);
  });
  await expect(page).toHaveURL(/owner\/quotations\/(?!create$)[A-Za-z0-9-]+$/, { timeout: 30_000 });
  await expect(page.getByText(/QT-2026-/).first()).toBeVisible({ timeout: 30_000 });

  await page.getByRole("link", { name: "Edit Draft" }).click();
  await page.getByRole("button", { name: "Save and Send" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 0);
  });
  await expect(page).toHaveURL(/token=/, { timeout: 30_000 });
  const publicHref = await page.getByRole("link", { name: "Open Client View" }).getAttribute("href");
  expect(publicHref).toBeTruthy();

  await page.goto(publicHref!);
  let publicMain = page.locator("main:visible");
  await expect(publicMain.getByText("VIEWED", { exact: true })).toBeVisible();
  await expect(publicMain.getByRole("link", { name: "Sign in to continue" })).toBeVisible();
  await expect(publicMain.getByRole("button", { name: "Accept quotation" })).toHaveCount(0);

  const publicUrl = new URL(publicHref!, page.url());
  const callbackPath = `${publicUrl.pathname}${publicUrl.search}`;
  await page.context().clearCookies();
  await page.context().addCookies([{ name: "rrs-locale", value: "en", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }]);
  await page.goto(`/register?callbackUrl=${encodeURIComponent(callbackPath)}`);
  await page.getByLabel("Full name").fill("Quotation E2E Client");
  await page.getByLabel("WhatsApp number").fill("628123456789");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password");
  await page.getByLabel("Confirm password").fill("password");
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (element) => element.textContent?.trim() === "Create an account",
    );
    window.setTimeout(() => (button as HTMLButtonElement | undefined)?.click(), 100);
  });
  await expect(page).toHaveURL(/\/quotation\//, { timeout: 30_000 });

  await page.goto(publicHref!);
  publicMain = page.locator("main:visible");
  await publicMain.getByRole("checkbox").check();
  await publicMain.getByRole("button", { name: "Accept quotation" }).evaluate((element) => {
    window.setTimeout(() => (element as HTMLButtonElement).click(), 0);
  });
  await expect(page).toHaveURL(/action=accepted/, { timeout: 30_000 });
  await expect(page.locator("main:visible").getByText("Quotation accepted.")).toBeVisible();

  await page.goto("/client/projects");
  await page.locator("main:visible").getByText("Quotation workflow test", { exact: true }).click();
  await expect(page.getByText("Project agreement is ready")).toBeVisible();
  await page.getByRole("link", { name: "Review Agreement" }).click();
  await expect(page.getByRole("heading", { name: /AGR-2026-/ })).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Accept Agreement" }).click();
  await expect(page.getByText("Agreement accepted.", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: "Back to project" }).click();
  await expect(page.getByText("AWAITING DOWN PAYMENT", { exact: true })).toBeVisible();
  const clientProjectUrl = page.url();
  const projectId = clientProjectUrl.split("/").at(-1);
  expect(projectId).toBeTruthy();
  const invoiceLink = page.getByRole("link", { name: /View INV-2026-/ });
  await expect(invoiceLink).toBeVisible();
  const invoiceUrl = await invoiceLink.getAttribute("href");
  const invoiceLabel = await invoiceLink.textContent();
  const invoiceNumber = invoiceLabel?.replace("View ", "").trim();
  expect(invoiceUrl).toBeTruthy();
  expect(invoiceNumber).toBeTruthy();

  await page.goto(invoiceUrl!);
  const proofForm = page.locator('main:visible form:has(input[name="proof"])');
  await proofForm.locator('input[name="proof"]').setInputFiles({
    name: "payment-proof.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\nRRS manual payment E2E fixture"),
  });
  await proofForm.getByRole("button", { name: "Submit Proof" }).click();
  await expect(page.getByText("UNDER_VERIFICATION", { exact: true })).toBeVisible();

  await page.context().clearCookies();
  await page.context().addCookies([{ name: "rrs-locale", value: "en", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }]);
  await page.goto("/owner/payments");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Owner overview")).toBeVisible();
  await page.goto(`/owner/projects/${projectId}/agreement`);
  await expect(page.getByRole("heading", { name: /AGR-2026-/ })).toBeVisible();
  await page.goto("/owner/payments");
  const paymentCard = page.locator("main:visible").locator(`[data-invoice="${invoiceNumber}"]`);
  await expect(paymentCard).toBeVisible();
  await paymentCard.getByRole("button", { name: "Verify Payment" }).click();
  await expect(paymentCard.getByText("VERIFIED", { exact: true })).toBeVisible();
  await page.goto(`/owner/projects/${projectId}`);
  const nextStep = page.locator("main:visible").getByLabel("Next available step").first();
  await expect(nextStep).toHaveValue("IN_PROGRESS");
  await expect(nextStep.locator("option")).toHaveCount(3);
  await expect(nextStep.locator('option[value="CLIENT_REVIEW"]')).toHaveCount(0);
  const projectDetailMain = page.locator("main:visible").first();
  await projectDetailMain.getByPlaceholder("Milestone title").fill("Final delivery");
  await projectDetailMain.getByRole("button", { name: "Add Milestone" }).click();
  const milestoneStatus = projectDetailMain.getByLabel("Milestone Final delivery status");
  await expect(milestoneStatus).toBeVisible();
  await milestoneStatus.selectOption("COMPLETED");
  const milestoneForm = milestoneStatus.locator("xpath=ancestor::form");
  await milestoneForm.getByRole("button", { name: "Save" }).click();
  await nextStep.selectOption("IN_PROGRESS");
  await projectDetailMain.getByRole("button", { name: "Update status" }).click();
  await expect(projectDetailMain.getByText("Current: IN PROGRESS")).toBeVisible();
  const reviewStep = projectDetailMain.getByLabel("Next available step").first();
  await expect(reviewStep).toHaveValue("CLIENT_REVIEW");
  await reviewStep.selectOption("CLIENT_REVIEW");
  await projectDetailMain.getByRole("button", { name: "Update status" }).click();
  await expect(projectDetailMain.getByText("Current: CLIENT REVIEW")).toBeVisible();

  await page.context().clearCookies();
  await page.context().addCookies([{ name: "rrs-locale", value: "en", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }]);
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/client$/);
  await page.goto(invoiceUrl!);
  await expect(page.getByText("PAID", { exact: true }).first()).toBeVisible();
  await page.goto(clientProjectUrl);
  await page.getByRole("button", { name: "Approve Final Delivery" }).click();
  await expect(page.getByText("Verified project review")).toBeVisible();
  const reviewForm = page.locator('form:has(textarea[name="comment"])').first();
  await reviewForm.evaluate((form) => { (form as HTMLFormElement).noValidate = true; });
  await reviewForm.locator('textarea[name="comment"]').fill("Nice");
  await reviewForm.getByRole("button", { name: "Submit Verified Review" }).click();
  await expect(page.getByText("Write at least 20 characters.")).toBeVisible();
  await reviewForm.locator('textarea[name="comment"]').fill("The project was delivered clearly and professionally.");
  await reviewForm.getByRole("button", { name: "Submit Verified Review" }).click();
  await expect(page.getByRole("heading", { name: "Thank you for the project review." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Client Portal" })).toBeVisible();
});
