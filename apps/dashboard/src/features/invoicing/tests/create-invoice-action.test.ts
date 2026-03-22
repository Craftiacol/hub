import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase auth
const mockGetUser = vi.fn();
const mockInsert = vi.fn();

vi.mock("@craftia/auth", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
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
const { createInvoiceAction } = await import(
  "../actions/invoice-actions"
);

describe("createInvoiceAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockInsert.mockReturnValue({
      select: () => ({
        single: () => Promise.resolve({ data: { id: "inv-new" }, error: null }),
      }),
    });
  });

  it("should store client_id when provided", async () => {
    await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
      notes: "",
      client_id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "550e8400-e29b-41d4-a716-446655440000",
      })
    );
  });

  it("should store client_id as null when empty string", async () => {
    await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
      notes: "",
      client_id: "",
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: null })
    );
  });

  it("should store client_id as null when not provided", async () => {
    await createInvoiceAction({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
      notes: "",
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: null })
    );
  });
});
