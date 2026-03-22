import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase query builder
const mockRange = vi.fn();
const mockOrder = vi.fn(() => ({ range: mockRange }));
const mockIlike = vi.fn(() => ({ order: mockOrder, eq: mockEq }));
const mockEq = vi.fn(() => ({ order: mockOrder, ilike: mockIlike, eq: mockEq }));
const mockSelect = vi.fn(() => ({
  eq: mockEq,
  ilike: mockIlike,
  order: mockOrder,
}));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock("@craftia/db", () => ({
  createClient: () => ({ from: mockFrom }),
}));

import { getDealsFiltered } from "../services/deal-service";

describe("getDealsFiltered", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockRange.mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    });
    mockOrder.mockReturnValue({ range: mockRange });
    mockIlike.mockReturnValue({ order: mockOrder, eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder, ilike: mockIlike, eq: mockEq });
    mockSelect.mockReturnValue({
      eq: mockEq,
      ilike: mockIlike,
      order: mockOrder,
    });
  });

  it("queries the pipeline_deals table with client join and count", async () => {
    await getDealsFiltered({});

    expect(mockFrom).toHaveBeenCalledWith("pipeline_deals");
    expect(mockSelect).toHaveBeenCalledWith("*, clients(name)", {
      count: "exact",
    });
  });

  it("adds ilike filter when search is provided", async () => {
    await getDealsFiltered({ search: "website" });

    expect(mockIlike).toHaveBeenCalledWith("title", "%website%");
  });

  it("adds eq filter when stage is provided", async () => {
    await getDealsFiltered({ stage: "proposal" });

    expect(mockEq).toHaveBeenCalledWith("stage", "proposal");
  });

  it("uses range for pagination with default page 1 and pageSize 10", async () => {
    await getDealsFiltered({});

    expect(mockRange).toHaveBeenCalledWith(0, 9);
  });

  it("uses range for custom page and pageSize", async () => {
    await getDealsFiltered({ page: 2, pageSize: 15 });

    expect(mockRange).toHaveBeenCalledWith(15, 29);
  });

  it("returns totalCount and totalPages", async () => {
    mockRange.mockResolvedValue({
      data: [{ id: "1", title: "Deal A" }],
      error: null,
      count: 30,
    });

    const result = await getDealsFiltered({ pageSize: 10 });

    expect(result.totalCount).toBe(30);
    expect(result.totalPages).toBe(3);
  });

  it("returns data array", async () => {
    const mockDeals = [
      { id: "1", title: "Deal A" },
      { id: "2", title: "Deal B" },
    ];
    mockRange.mockResolvedValue({
      data: mockDeals,
      error: null,
      count: 2,
    });

    const result = await getDealsFiltered({});

    expect(result.data).toEqual(mockDeals);
  });

  it("throws on error", async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
      count: null,
    });

    await expect(getDealsFiltered({})).rejects.toThrow("Database error");
  });
});
