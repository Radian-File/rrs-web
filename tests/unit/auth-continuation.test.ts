import { describe, expect, it } from "vitest";
import { getAuthContinuationKind } from "@/lib/auth-continuation";

describe("getAuthContinuationKind", () => {
  it("classifies known protected destinations", () => {
    expect(getAuthContinuationKind("/start-project?service=website-development")).toBe("technical-brief");
    expect(getAuthContinuationKind("/quotation/secure-token")).toBe("quotation");
    expect(getAuthContinuationKind("/client/projects/project-id")).toBe("client-workspace");
    expect(getAuthContinuationKind("/owner")).toBe("protected-workspace");
  });

  it.each([undefined, "", "https://evil.example/start-project", "//evil.example/path", "/\\evil.example"])(
    "does not expose an unsafe or missing destination: %s",
    (value) => {
      expect(getAuthContinuationKind(value)).toBeNull();
    },
  );
});
