import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase query builder
const mockRange = vi.fn();
const mockOrder = vi.fn(() => ({ range: mockRange }));
const mockIlike = vi.fn(() => ({ order: mockOrder, eq: mockEq }));
const mockEq = vi.fn(() => ({ order: mockOrder, ilike: mockIlike, eq: mockEq as ReturnType<typeof vi.fn> }));
const mockSelect = vi.fn(() => ({
  eq: mockEq,
  ilike: mockIlike,
  order: mockOrder,
}));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock("@craftia/db", () => ({
  createClient: () => ({ from: mockFrom }),
}));

import { getClientsFiltered } from "../services/client-service";

describe("getClientsFiltered", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: return empty data with count
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

  it("queries the clients table with count", async () => {
    await getClientsFiltered({});

    expect(mockFrom).toHaveBeenCalledWith("clients");
    expect(mockSelect).toHaveBeenCalledWith("*", { count: "exact" });
  });

  it("adds ilike filter when search is provided", async () => {
    await getClientsFiltered({ search: "john" });

    expect(mockIlike).toHaveBeenCalledWith("name", "%john%");
  });

  it("adds eq filter when status is provided", async () => {
    await getClientsFiltered({ status: "active" });

    expect(mockEq).toHaveBeenCalledWith("status", "active");
  });

  it("uses range for pagination with default page 1 and pageSize 10", async () => {
    await getClientsFiltered({});

    expect(mockRange).toHaveBeenCalledWith(0, 9);
  });

  it("uses range for custom page and pageSize", async () => {
    await getClientsFiltered({ page: 3, pageSize: 5 });

    expect(mockRange).toHaveBeenCalledWith(10, 14);
  });

  it("returns totalCount and totalPages", async () => {
    mockRange.mockResolvedValue({
      data: [{ id: "1", name: "Test" }],
      error: null,
      count: 25,
    });

    const result = await getClientsFiltered({ pageSize: 10 });

    expect(result.totalCount).toBe(25);
    expect(result.totalPages).toBe(3);
  });

  it("returns data array", async () => {
    const mockClients = [
      { id: "1", name: "Client A" },
      { id: "2", name: "Client B" },
    ];
    mockRange.mockResolvedValue({
      data: mockClients,
      error: null,
      count: 2,
    });

    const result = await getClientsFiltered({});

    expect(result.data).toEqual(mockClients);
  });

  it("throws on error", async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: "Something went wrong" },
      count: null,
    });

    await expect(getClientsFiltered({})).rejects.toThrow(
      "Something went wrong"
    );
  });
});
