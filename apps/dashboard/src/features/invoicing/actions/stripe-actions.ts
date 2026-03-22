"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { createPaymentLink } from "../services/stripe-service";

export async function generatePaymentLinkAction(invoiceId: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (error) return { error: error.message };

  if (invoice.status === "paid") {
    return { error: "Invoice is already paid" };
  }

  const paymentLink = await createPaymentLink({
    id: invoice.id,
    invoice_number: invoice.invoice_number,
    total: invoice.total,
    currency: invoice.currency ?? undefined,
  });

  await supabase
    .from("invoices")
    .update({ payment_link: paymentLink } as never)
    .eq("id", invoiceId);

  return { success: true, paymentLink };
}

export async function markInvoicePaidAction(invoiceId: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("invoices")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    } as never)
    .eq("id", invoiceId);

  if (error) return { error: error.message };
  return { success: true };
}
