import { createClient as createSupabaseClient } from "@craftia/db";

function getSupabase() {
  return createSupabaseClient();
}

export async function getInvoices() {
  const { data, error } = await getSupabase()
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getInvoiceById(id: string) {
  const { data, error } = await getSupabase()
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createInvoice(invoiceData: Record<string, unknown>) {
  const { data, error } = await getSupabase()
    .from("invoices")
    .insert(invoiceData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateInvoice(
  id: string,
  invoiceData: Record<string, unknown>
) {
  const { data, error } = await getSupabase()
    .from("invoices")
    .update(invoiceData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteInvoice(id: string) {
  const { error } = await getSupabase()
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
