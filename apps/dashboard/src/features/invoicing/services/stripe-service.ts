import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

interface InvoiceForPayment {
  id: string;
  invoice_number: string;
  total: number;
  currency?: string;
}

/**
 * Creates a Stripe Checkout session for the given invoice.
 * Returns the checkout session URL.
 */
export async function createPaymentLink(
  invoice: InvoiceForPayment
): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const currency = (invoice.currency ?? "USD").toLowerCase();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: Math.round(invoice.total * 100),
          product_data: {
            name: `Invoice ${invoice.invoice_number}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/invoices/${invoice.id}?payment=success`,
    cancel_url: `${appUrl}/invoices/${invoice.id}?payment=cancelled`,
    metadata: { invoice_id: invoice.id },
  });

  return session.url!;
}

interface WebhookResult {
  invoiceId: string;
  status: string;
}

/**
 * Verifies a Stripe webhook signature and processes the event.
 * Returns invoice update info for checkout.session.completed, or null for unhandled events.
 */
export function handleWebhookEvent(
  payload: string,
  signature: string
): WebhookResult | null {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoice_id;

    if (invoiceId) {
      return { invoiceId, status: "paid" };
    }
  }

  return null;
}
