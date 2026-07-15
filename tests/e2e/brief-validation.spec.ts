import { expect, test } from "@playwright/test";

test("an invalid project step cannot advance to submission", async ({ page }) => {
  await page.goto("/start-project");
  await page.getByLabel("Full name").fill("Validation Client");
  await page.getByLabel("WhatsApp number").fill("628123456789");
  await page.getByLabel("Email").fill(`validation-${Date.now()}-${test.info().project.name}@example.com`);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Project title").fill("x");
  await page.getByLabel("Project type").fill("Website");
  await page.getByLabel("Project description").fill("A valid description that is long enough to satisfy the project brief schema.");
  await page.getByLabel("Project goals").fill("Validate the step guard.");
  await page.getByLabel("Required features").fill("Contact form");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Too small: expected string to have >=3 characters", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Budget range (optional)")).toBeHidden();
  await expect(page.getByLabel("Project title")).toBeVisible();
});
