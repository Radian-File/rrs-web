import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), findUnique: vi.fn(), redirect: vi.fn() }));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db/prisma", () => ({ prisma: { user: { findUnique: mocks.findUnique } } }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { requireOwner } from "@/lib/authz";

describe("database-backed authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.redirect.mockImplementation((path: string) => { throw new Error(`redirect:${path}`); });
  });

  it("returns the current database Owner rather than trusting the JWT alone", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "owner-current", role: "OWNER" } });
    mocks.findUnique.mockResolvedValue({ id: "owner-current", name: "Radian", email: "owner@example.com", role: "OWNER" });

    await expect(requireOwner()).resolves.toMatchObject({ id: "owner-current", role: "OWNER" });
    expect(mocks.findUnique).toHaveBeenCalledWith({ where: { id: "owner-current" }, select: { id: true, name: true, email: true, companyName: true, role: true } });
  });

  it("sends a stale JWT session through the cookie-clearing route after a reset", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "owner-removed", role: "OWNER" } });
    mocks.findUnique.mockResolvedValue(null);

    await expect(requireOwner()).rejects.toThrow("redirect:/auth/session-expired");
    expect(mocks.redirect).toHaveBeenCalledWith("/auth/session-expired");
  });

  it("clears a session whose stored role no longer matches the database", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1", role: "OWNER" } });
    mocks.findUnique.mockResolvedValue({ id: "user-1", name: "Client", email: "client@example.com", role: "CLIENT" });

    await expect(requireOwner()).rejects.toThrow("redirect:/auth/session-expired");
  });
});
