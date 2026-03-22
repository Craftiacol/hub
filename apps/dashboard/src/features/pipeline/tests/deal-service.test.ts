import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} from "../services/deal-service";

// Mock Supabase client
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();

vi.mock("@craftia/db", () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    }),
  }),
}));

describe("Deal Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockReturnValue({
      select: () => ({ single: mockSingle }),
    });
    mockSingle.mockResolvedValue({
      data: { id: "1", title: "Test Deal" },
      error: null,
    });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: () => ({ single: mockSingle }) });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  describe("getDeals", () => {
    it("should return a list of deals with client name", async () => {
      const deals = [
        {
          id: "1",
          title: "Deal A",
          value: 5000,
          stage: "lead",
          clients: { name: "Acme Corp" },
        },
        {
          id: "2",
          title: "Deal B",
          value: 10000,
          stage: "proposal",
          clients: { name: "Beta Inc" },
        },
      ];
      mockSelect.mockReturnValue({ order: mockOrder });
      mockOrder.mockResolvedValue({ data: deals, error: null });

      const result = await getDeals();
      expect(result).toEqual(deals);
    });

    it("should throw on error", async () => {
      mockOrder.mockResolvedValue({
        data: null,
        error: { message: "DB error" },
      });
      await expect(getDeals()).rejects.toThrow("DB error");
    });
  });

  describe("getDealById", () => {
    it("should return a single deal", async () => {
      const deal = {
        id: "1",
        title: "Deal A",
        value: 5000,
        stage: "lead",
        clients: { name: "Acme Corp" },
      };
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: deal, error: null }),
        }),
      });

      const result = await getDealById("1");
      expect(result).toEqual(deal);
    });

    it("should throw on error", async () => {
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: { message: "Not found" } }),
        }),
      });

      await expect(getDealById("999")).rejects.toThrow("Not found");
    });
  });

  describe("createDeal", () => {
    it("should create and return a new deal", async () => {
      const newDeal = {
        title: "New Deal",
        value: 5000,
        stage: "lead" as const,
      };
      const result = await createDeal(newDeal);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title", "Test Deal");
    });

    it("should throw on error", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      await expect(createDeal({ title: "Fail" })).rejects.toThrow(
        "Insert failed"
      );
    });
  });

  describe("updateDeal", () => {
    it("should update and return the deal", async () => {
      mockEq.mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({
            data: { id: "1", title: "Updated Deal" },
            error: null,
          }),
        }),
      });
      const result = await updateDeal("1", { title: "Updated Deal" });
      expect(result).toHaveProperty("title", "Updated Deal");
    });

    it("should throw on error", async () => {
      mockEq.mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Update failed" },
          }),
        }),
      });

      await expect(updateDeal("1", { title: "Fail" })).rejects.toThrow(
        "Update failed"
      );
    });
  });

  describe("deleteDeal", () => {
    it("should delete without error", async () => {
      await expect(deleteDeal("1")).resolves.not.toThrow();
    });

    it("should throw on error", async () => {
      mockEq.mockResolvedValue({ error: { message: "Delete failed" } });
      await expect(deleteDeal("1")).rejects.toThrow("Delete failed");
    });
  });
});
