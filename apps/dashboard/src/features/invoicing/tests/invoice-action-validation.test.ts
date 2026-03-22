import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase auth
const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockDelete = vi.fn();
const mockDeleteEq = vi.fn();

vi.mock("@craftia/auth", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: (table: string) => {
      if (table === "invoice_items") {
        return {
          insert: mockInsert,
          delete: () => ({ eq: mockDeleteEq }),
        };
      }
      return {
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
      };
    },
  }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

// Import after mocks
const { createInvoiceAction, updateInvoiceAction } = await import(
  "../actions/invoice-actions"
);

describe("createInvoiceAction validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockInsert.mockReturnValue({
      select: () => ({
        single: () =>
          Promise.resolve({ data: { id: "inv-new" }, error: null }),
      }),
    });
  });

  it("should return validation error when invoice_number is empty", async () => {
    const result = await createInvoiceAction({
      invoice_number: "",
      due_date: "2026-04-01",
      status: "draft",
    });

    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("fieldErrors");
    expect(result.fieldErrors?.invoice_number).toBeDefined();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should return validation error when due_date is empty", async () => {
    const result = await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "",
      status: "draft",
    });

    expect(result).toHaveProperty("error");
    expect(result.fieldErrors?.due_date).toBeDefined();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid status", async () => {
    const result = await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "bogus",
    });

    expect(result).toHaveProperty("error");
    expect(result.fieldErrors?.status).toBeDefined();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid items", async () => {
    const result = await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
      items: [
        { description: "", quantity: -1, unit_price: 100, total: 100, sort_order: 0 },
      ],
    });

    expect(result).toHaveProperty("error");
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should proceed to supabase when data is valid", async () => {
    await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
    });

    expect(mockInsert).toHaveBeenCalled();
  });
});

describe("updateInvoiceAction validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  it("should return validation error when invoice_number is empty", async () => {
    const result = await updateInvoiceAction("inv-1", {
      invoice_number: "",
      due_date: "2026-04-01",
      status: "draft",
    });

    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("fieldErrors");
    expect(result.fieldErrors?.invoice_number).toBeDefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid status", async () => {
    const result = await updateInvoiceAction("inv-1", {
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "bogus",
    });

    expect(result).toHaveProperty("error");
    expect(result.fieldErrors?.status).toBeDefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should proceed to supabase when data is valid", async () => {
    await updateInvoiceAction("inv-1", {
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "sent",
    });

    expect(mockUpdate).toHaveBeenCalled();
  });
});
