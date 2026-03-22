import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase auth
const mockGetUser = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock("@craftia/auth", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      update: mockUpdate,
    }),
  }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

// Import after mocks
const { updateClientAction } = await import(
  "../actions/client-actions"
);

describe("updateClientAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  it("should redirect to /login if user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      updateClientAction("client-1", { name: "Test" })
    ).rejects.toThrow("REDIRECT:/login");
  });

  it("should update client and return success", async () => {
    const result = await updateClientAction("client-1", {
      name: "Updated",
      email: "test@test.com",
      company: "TestCo",
      phone: "555",
      status: "active",
    });

    expect(result).toEqual({ success: true });
  });

  it("should return error when update fails", async () => {
    mockEq.mockResolvedValue({ error: { message: "DB error" } });

    const result = await updateClientAction("client-1", {
      name: "Updated",
    });

    expect(result).toEqual({ error: "DB error" });
  });
});
