"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";

export async function createInvoiceAction(data: Record<string, string>) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    invoice_number: data.invoice_number,
    due_date: data.due_date,
    status: (data.status as "draft" | "sent" | "paid") || "draft",
    notes: data.notes || null,
    total: 0,
    subtotal: 0,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteInvoiceAction(id: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
