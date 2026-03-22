import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase query builder
const mockRange = vi.fn();
const mockOrder = vi.fn(() => ({ range: mockRange }));
const mockIlike = vi.fn(() => ({ order: mockOrder }));
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

import { getInvoicesFiltered } from "../services/invoice-service";

describe("getInvoicesFiltered", () => {
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

  it("queries the invoices table with client join and count", async () => {
    await getInvoicesFiltered({});

    expect(mockFrom).toHaveBeenCalledWith("invoices");
    expect(mockSelect).toHaveBeenCalledWith("*, clients(name)", {
      count: "exact",
    });
  });

  it("adds ilike filter when search is provided", async () => {
    await getInvoicesFiltered({ search: "INV-001" });

    expect(mockIlike).toHaveBeenCalledWith("invoice_number", "%INV-001%");
  });

  it("adds eq filter when status is provided", async () => {
    await getInvoicesFiltered({ status: "paid" });

    expect(mockEq).toHaveBeenCalledWith("status", "paid");
  });

  it("adds eq filter when clientId is provided", async () => {
    await getInvoicesFiltered({ clientId: "client-123" });

    expect(mockEq).toHaveBeenCalledWith("client_id", "client-123");
  });

  it("uses range for pagination with default page 1 and pageSize 10", async () => {
    await getInvoicesFiltered({});

    expect(mockRange).toHaveBeenCalledWith(0, 9);
  });

  it("uses range for custom page and pageSize", async () => {
    await getInvoicesFiltered({ page: 2, pageSize: 20 });

    expect(mockRange).toHaveBeenCalledWith(20, 39);
  });

  it("returns totalCount and totalPages", async () => {
    mockRange.mockResolvedValue({
      data: [{ id: "1", invoice_number: "INV-001" }],
      error: null,
      count: 45,
    });

    const result = await getInvoicesFiltered({ pageSize: 10 });

    expect(result.totalCount).toBe(45);
    expect(result.totalPages).toBe(5);
  });

  it("returns data array", async () => {
    const mockInvoices = [
      { id: "1", invoice_number: "INV-001" },
      { id: "2", invoice_number: "INV-002" },
    ];
    mockRange.mockResolvedValue({
      data: mockInvoices,
      error: null,
      count: 2,
    });

    const result = await getInvoicesFiltered({});

    expect(result.data).toEqual(mockInvoices);
  });

  it("throws on error", async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
      count: null,
    });

    await expect(getInvoicesFiltered({})).rejects.toThrow("Database error");
  });
});
