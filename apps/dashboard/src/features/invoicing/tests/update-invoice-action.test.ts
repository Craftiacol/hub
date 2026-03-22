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
const { updateInvoiceAction } = await import(
  "../actions/invoice-actions"
);

describe("updateInvoiceAction", () => {
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
      updateInvoiceAction("inv-1", {
        invoice_number: "INV-001",
        due_date: "2026-04-01",
        status: "draft",
      })
    ).rejects.toThrow("REDIRECT:/login");
  });

  it("should update invoice and return success", async () => {
    const result = await updateInvoiceAction("inv-1", {
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "sent",
      notes: "Updated notes",
    });

    expect(result).toEqual({ success: true });
  });

  it("should return error when update fails", async () => {
    mockEq.mockResolvedValue({ error: { message: "DB error" } });

    const result = await updateInvoiceAction("inv-1", {
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
    });

    expect(result).toEqual({ error: "DB error" });
  });

  it("should store client_id when provided", async () => {
    await updateInvoiceAction("inv-1", {
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "sent",
      notes: "",
      client_id: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "550e8400-e29b-41d4-a716-446655440000",
      })
    );
  });

  it("should store client_id as null when empty string", async () => {
    await updateInvoiceAction("inv-1", {
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "sent",
      notes: "",
      client_id: "",
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: null })
    );
  });
});
