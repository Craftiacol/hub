import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Stripe SDK
const mockCheckoutSessionsCreate = vi.fn();
const mockWebhooksConstructEvent = vi.fn();

vi.mock("stripe", () => {
  const MockStripe = function () {
    return {
      checkout: { sessions: { create: mockCheckoutSessionsCreate } },
      webhooks: { constructEvent: mockWebhooksConstructEvent },
    };
  };
  return { default: MockStripe };
});

// Import after mocks
const { createPaymentLink, handleWebhookEvent } = await import(
  "../services/stripe-service"
);

describe("Stripe Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPaymentLink", () => {
    const invoice = {
      id: "inv-1",
      invoice_number: "INV-001",
      total: 1500,
      currency: "USD",
    };

    it("should create a Stripe checkout session with correct amount in cents", async () => {
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      await createPaymentLink(invoice);

      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: 150000,
                product_data: {
                  name: "Invoice INV-001",
                },
              },
              quantity: 1,
            },
          ],
        })
      );
    });

    it("should include success and cancel URLs", async () => {
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      await createPaymentLink(invoice);

      const callArgs = mockCheckoutSessionsCreate.mock.calls[0][0];
      expect(callArgs.success_url).toContain("/invoices/inv-1?payment=success");
      expect(callArgs.cancel_url).toContain(
        "/invoices/inv-1?payment=cancelled"
      );
    });

    it("should include invoice_id in metadata", async () => {
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      await createPaymentLink(invoice);

      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: { invoice_id: "inv-1" },
        })
      );
    });

    it("should return the session URL", async () => {
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      const result = await createPaymentLink(invoice);

      expect(result).toBe("https://checkout.stripe.com/pay/cs_test_123");
    });

    it("should use lowercase currency from invoice", async () => {
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      await createPaymentLink({ ...invoice, currency: "EUR" });

      const callArgs = mockCheckoutSessionsCreate.mock.calls[0][0];
      expect(callArgs.line_items[0].price_data.currency).toBe("eur");
    });

    it("should set mode to payment", async () => {
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      await createPaymentLink(invoice);

      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "payment",
        })
      );
    });
  });

  describe("handleWebhookEvent", () => {
    it("should verify the webhook signature", () => {
      const payload = '{"type":"checkout.session.completed"}';
      const signature = "whsec_test_sig";

      mockWebhooksConstructEvent.mockReturnValue({
        type: "checkout.session.completed",
        data: {
          object: {
            metadata: { invoice_id: "inv-1" },
          },
        },
      });

      handleWebhookEvent(payload, signature);

      expect(mockWebhooksConstructEvent).toHaveBeenCalledWith(
        payload,
        signature,
        expect.any(String)
      );
    });

    it("should return invoiceId and status for checkout.session.completed", () => {
      mockWebhooksConstructEvent.mockReturnValue({
        type: "checkout.session.completed",
        data: {
          object: {
            metadata: { invoice_id: "inv-42" },
          },
        },
      });

      const result = handleWebhookEvent("payload", "sig");

      expect(result).toEqual({
        invoiceId: "inv-42",
        status: "paid",
      });
    });

    it("should return null for unhandled event types", () => {
      mockWebhooksConstructEvent.mockReturnValue({
        type: "payment_intent.created",
        data: { object: {} },
      });

      const result = handleWebhookEvent("payload", "sig");

      expect(result).toBeNull();
    });

    it("should throw when signature verification fails", () => {
      mockWebhooksConstructEvent.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      expect(() => handleWebhookEvent("payload", "bad_sig")).toThrow(
        "Invalid signature"
      );
    });
  });
});
