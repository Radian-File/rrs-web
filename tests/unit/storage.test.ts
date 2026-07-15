import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import path from "node:path";
import {
  removePrivateFile,
  storePrivateFile,
} from "@/lib/storage/local";

const testRoot = "./uploads-test";

describe("private local storage", () => {
  beforeAll(() => {
    process.env.LOCAL_UPLOAD_DIR = testRoot;
  });

  afterAll(async () => {
    await rm(path.resolve(testRoot), { recursive: true, force: true });
  });

  it("stores a PDF with matching content signature", async () => {
    const file = new File([Buffer.from("%PDF-1.7\nvalid fixture")], "brief.pdf", {
      type: "application/pdf",
    });
    const stored = await storePrivateFile(file, "tests");

    expect(stored.storageKey).toMatch(/^tests\//);
    expect(stored.checksum).toHaveLength(64);
    await removePrivateFile(stored.storageKey);
  });

  it("rejects a renamed executable payload", async () => {
    const file = new File([Buffer.from("not a real pdf")], "fake.pdf", {
      type: "application/pdf",
    });

    await expect(storePrivateFile(file, "tests")).rejects.toThrow(
      "does not match",
    );
  });
});
