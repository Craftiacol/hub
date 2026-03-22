import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase auth
const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock("@craftia/auth", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
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
const { createDealAction, updateDealAction, updateDealStageAction, deleteDealAction } =
  await import("../actions/deal-actions");

describe("Deal Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
    mockDelete.mockReturnValue({ eq: mockEq });
  });

  describe("createDealAction", () => {
    it("should redirect to /login if user is not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(
        createDealAction({
          title: "Test Deal",
          value: "5000",
          stage: "lead",
        })
      ).rejects.toThrow("REDIRECT:/login");
    });

    it("should create deal and return success", async () => {
      const result = await createDealAction({
        title: "New Deal",
        value: "5000",
        stage: "lead",
        expected_close_date: "2026-06-01",
        notes: "Some notes",
        client_id: "client-1",
      });

      expect(result).toEqual({ success: true });
    });

    it("should return error when insert fails", async () => {
      mockInsert.mockResolvedValue({ error: { message: "DB error" } });

      const result = await createDealAction({
        title: "Fail Deal",
        value: "5000",
        stage: "lead",
      });

      expect(result).toEqual({ error: "DB error" });
    });
  });

  describe("updateDealAction", () => {
    it("should redirect to /login if user is not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(
        updateDealAction("deal-1", { title: "Updated" })
      ).rejects.toThrow("REDIRECT:/login");
    });

    it("should update deal and return success", async () => {
      const result = await updateDealAction("deal-1", {
        title: "Updated Deal",
        value: "10000",
        stage: "proposal",
        expected_close_date: "2026-07-01",
        notes: "Updated notes",
        client_id: "client-2",
      });

      expect(result).toEqual({ success: true });
    });

    it("should return error when update fails", async () => {
      mockEq.mockResolvedValue({ error: { message: "Update error" } });

      const result = await updateDealAction("deal-1", { title: "Fail" });

      expect(result).toEqual({ error: "Update error" });
    });
  });

  describe("updateDealStageAction", () => {
    it("should redirect to /login if user is not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(
        updateDealStageAction("deal-1", "won")
      ).rejects.toThrow("REDIRECT:/login");
    });

    it("should update deal stage and return success", async () => {
      const result = await updateDealStageAction("deal-1", "negotiation");

      expect(result).toEqual({ success: true });
    });

    it("should return error when stage update fails", async () => {
      mockEq.mockResolvedValue({ error: { message: "Stage error" } });

      const result = await updateDealStageAction("deal-1", "won");

      expect(result).toEqual({ error: "Stage error" });
    });
  });

  describe("deleteDealAction", () => {
    it("should redirect to /login if user is not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(deleteDealAction("deal-1")).rejects.toThrow(
        "REDIRECT:/login"
      );
    });

    it("should delete deal and return success", async () => {
      const result = await deleteDealAction("deal-1");

      expect(result).toEqual({ success: true });
    });

    it("should return error when delete fails", async () => {
      mockEq.mockResolvedValue({ error: { message: "Delete error" } });

      const result = await deleteDealAction("deal-1");

      expect(result).toEqual({ error: "Delete error" });
    });
  });
});
