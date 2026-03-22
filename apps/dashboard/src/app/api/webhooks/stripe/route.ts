import { NextResponse } from "next/server";
import { handleWebhookEvent } from "@/features/invoicing/services/stripe-service";
import { updateInvoice } from "@/features/invoicing/services/invoice-service";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let result;
  try {
    result = handleWebhookEvent(body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (result) {
    await updateInvoice(result.invoiceId, {
      status: result.status,
      paid_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
