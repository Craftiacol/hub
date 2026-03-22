import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock stripe-service
const mockHandleWebhookEvent = vi.fn();
vi.mock("@/features/invoicing/services/stripe-service", () => ({
  handleWebhookEvent: mockHandleWebhookEvent,
}));

// Mock invoice-service
const mockUpdateInvoice = vi.fn();
vi.mock("@/features/invoicing/services/invoice-service", () => ({
  updateInvoice: mockUpdateInvoice,
}));

// Import after mocks
const { POST } = await import("../route");

function createMockRequest(body: string, signature = "sig_test"): Request {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body,
    headers: {
      "stripe-signature": signature,
    },
  });
}

describe("Stripe Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when signature verification fails", async () => {
    mockHandleWebhookEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const request = createMockRequest(JSON.stringify({}));
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: "Invalid signature" });
  });

  it("should handle checkout.session.completed event", async () => {
    mockHandleWebhookEvent.mockReturnValue({
      invoiceId: "inv-1",
      status: "paid",
    });
    mockUpdateInvoice.mockResolvedValue(undefined);

    const request = createMockRequest(JSON.stringify({}));
    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockUpdateInvoice).toHaveBeenCalledWith("inv-1", {
      status: "paid",
      paid_at: expect.any(String),
    });
  });

  it("should return 200 for unknown event types", async () => {
    mockHandleWebhookEvent.mockReturnValue(null);

    const request = createMockRequest(JSON.stringify({}));
    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockUpdateInvoice).not.toHaveBeenCalled();
  });

  it("should return 400 when stripe-signature header is missing", async () => {
    const request = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
