import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Owner can publish a guide level and a guest can use its quotation-first handoff", async ({ page, browser }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium" || !process.env.RUN_CATALOG_MUTATION_E2E, "This focused shared-catalog mutation test runs only in its isolated validation command.");
  test.setTimeout(120_000);

  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.OWNER_EMAIL ?? "owner@example.com");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD ?? "ChangeMe123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/owner$/, { timeout: 30_000 });

  let editUrl = "";
  for (let index = 1; index <= 10; index += 1) {
    await page.goto(index === 1 ? "/owner/services" : `/owner/services?page=${index}`);
    const serviceCard = page.getByRole("region", { name: "Website Development" });
    if (await serviceCard.count() === 0) continue;
    await serviceCard.getByRole("link", { name: "Edit" }).click();
    await page.waitForURL(/\/owner\/services\/[^/]+\/edit/);
    editUrl = page.url();
    break;
  }
  expect(editUrl).toContain("/owner/services/");

  const guideVisibility = page.getByRole("checkbox", { name: "Tampilkan di Project Fit Guide" });
  const publicVisibility = page.getByRole("checkbox", { name: "Publikasikan ke halaman publik" });
  if (!await guideVisibility.isChecked()) await guideVisibility.check();
  if (!await publicVisibility.isChecked()) await publicVisibility.check();
  await page.getByRole("button", { name: "Simpan perubahan" }).click();

  const levelVisibility = page.getByRole("checkbox", { name: "Tampilkan di Pricing Guide" });
  const levelCount = await levelVisibility.count();
  expect(levelCount).toBe(3);
  for (let index = 0; index < levelCount; index += 1) {
    const checkbox = levelVisibility.nth(index);
    if (!await checkbox.isChecked()) await checkbox.check();
    const levelForm = checkbox.locator("xpath=ancestor::form");
    await levelForm.getByRole("button", { name: "Simpan level" }).click();
    await expect(checkbox).toBeChecked();
  }

  const guestContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    storageState: { cookies: [{ name: "rrs-locale", value: "en", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }], origins: [] },
  });
  const guest = await guestContext.newPage();
  try {
    await guest.goto("/services");
    await expect(guest.getByRole("heading", { name: "Essential" })).toBeVisible();
    await guest.getByRole("button", { name: "Advanced" }).click();
    await expect(guest.getByRole("heading", { name: "Advanced" })).toBeVisible();
    await expect(guest.getByRole("link", { name: "Sign in to send a brief" })).toHaveAttribute("href", /callbackUrl=.*start-project/);
  } finally {
    await guestContext.close();
  }

  const clientContext = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    storageState: { cookies: [{ name: "rrs-locale", value: "en", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }], origins: [] },
  });
  const clientPage = await clientContext.newPage();
  try {
    const email = `project-fit-${Date.now()}@example.com`;
    await clientPage.goto("/register");
    await clientPage.getByLabel("Full name").fill("Project Fit Client");
    await clientPage.getByLabel("WhatsApp number").fill("628123456789");
    await clientPage.getByLabel("Email").fill(email);
    await clientPage.getByLabel("Password", { exact: true }).fill("password");
    await clientPage.getByLabel("Confirm password").fill("password");
    await clientPage.getByRole("button", { name: "Create an account" }).click();
    await expect(clientPage).toHaveURL(/\/client$/, { timeout: 30_000 });
    await clientPage.goto("/start-project?service=website-development&level=ADVANCED");
    await expect(clientPage.getByLabel("Service of interest")).toHaveValue("website-development");
    await expect(clientPage.getByLabel("Complexity starting point (optional)").locator("option:checked")).toHaveText(/Advanced/);
  } finally {
    await clientContext.close();
  }

  await page.goto(editUrl);
  await guideVisibility.uncheck();
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  for (let index = 0; index < levelCount; index += 1) {
    const checkbox = levelVisibility.nth(index);
    if (!await checkbox.isChecked()) continue;
    await checkbox.uncheck();
    await checkbox.locator("xpath=ancestor::form").getByRole("button", { name: "Simpan level" }).click();
  }
});
