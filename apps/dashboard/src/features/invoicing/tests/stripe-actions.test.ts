import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase auth
const mockGetUser = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@craftia/auth", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      select: mockSelect,
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

// Mock stripe-service
const mockCreatePaymentLink = vi.fn();
vi.mock("../services/stripe-service", () => ({
  createPaymentLink: mockCreatePaymentLink,
}));

// Import after mocks
const { generatePaymentLinkAction, markInvoicePaidAction } = await import(
  "../actions/stripe-actions"
);

describe("generatePaymentLinkAction", () => {
  const mockInvoice = {
    id: "inv-1",
    invoice_number: "INV-001",
    status: "sent",
    total: 1500,
    payment_link: null,
    paid_at: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: mockInvoice, error: null });
    mockCreatePaymentLink.mockResolvedValue(
      "https://checkout.stripe.com/pay/cs_test_123"
    );
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it("should redirect to login when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(generatePaymentLinkAction("inv-1")).rejects.toThrow(
      "REDIRECT:/login"
    );
  });

  it("should return error when invoice is not found", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Not found" },
    });

    const result = await generatePaymentLinkAction("inv-1");

    expect(result).toEqual({ error: "Not found" });
  });

  it("should return error when invoice is already paid", async () => {
    mockSingle.mockResolvedValue({
      data: { ...mockInvoice, status: "paid" },
      error: null,
    });

    const result = await generatePaymentLinkAction("inv-1");

    expect(result).toEqual({ error: "Invoice is already paid" });
  });

  it("should create a payment link and store it on the invoice", async () => {
    const result = await generatePaymentLinkAction("inv-1");

    expect(mockCreatePaymentLink).toHaveBeenCalledWith({
      id: mockInvoice.id,
      invoice_number: mockInvoice.invoice_number,
      total: mockInvoice.total,
      currency: undefined,
    });
    expect(result).toEqual({
      success: true,
      paymentLink: "https://checkout.stripe.com/pay/cs_test_123",
    });
  });

  it("should update the invoice with the payment link", async () => {
    await generatePaymentLinkAction("inv-1");

    expect(mockUpdate).toHaveBeenCalledWith({
      payment_link: "https://checkout.stripe.com/pay/cs_test_123",
    });
  });
});

describe("markInvoicePaidAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it("should redirect to login when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(markInvoicePaidAction("inv-1")).rejects.toThrow(
      "REDIRECT:/login"
    );
  });

  it("should update invoice status to paid with paid_at timestamp", async () => {
    const result = await markInvoicePaidAction("inv-1");

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "paid",
        paid_at: expect.any(String),
      })
    );
    expect(result).toEqual({ success: true });
  });

  it("should set paid_at to a valid ISO timestamp", async () => {
    await markInvoicePaidAction("inv-1");

    const callArgs = mockUpdate.mock.calls[0]![0];
    const paidAt = new Date(callArgs.paid_at);
    expect(paidAt.getTime()).not.toBeNaN();
  });

  it("should return error when update fails", async () => {
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: { message: "DB error" } }),
    });

    const result = await markInvoicePaidAction("inv-1");

    expect(result).toEqual({ error: "DB error" });
  });
});
