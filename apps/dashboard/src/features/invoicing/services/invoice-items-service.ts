import { createClient as createSupabaseClient } from "@craftia/db";

function getSupabase() {
  return createSupabaseClient();
}

export interface InvoiceItemData {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order?: number;
}

export async function getInvoiceItems(invoiceId: string) {
  const { data, error } = await getSupabase()
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createInvoiceItem(
  invoiceId: string,
  itemData: InvoiceItemData
) {
  const { data, error } = await getSupabase()
    .from("invoice_items")
    .insert({ ...itemData, invoice_id: invoiceId } as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateInvoiceItem(
  id: string,
  itemData: Partial<InvoiceItemData>
) {
  const { data, error } = await getSupabase()
    .from("invoice_items")
    .update(itemData as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteInvoiceItem(id: string) {
  const { error } = await getSupabase()
    .from("invoice_items")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function bulkSaveInvoiceItems(
  invoiceId: string,
  items: InvoiceItemData[]
) {
  const supabase = getSupabase();

  // Delete existing items for this invoice
  const { error: deleteError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", invoiceId);

  if (deleteError) throw new Error(deleteError.message);

  // Insert new items if any
  if (items.length === 0) return;

  const itemsWithInvoiceId = items.map((item, index) => ({
    ...item,
    invoice_id: invoiceId,
    sort_order: item.sort_order ?? index,
  }));

  const { error: insertError } = await supabase
    .from("invoice_items")
    .insert(itemsWithInvoiceId as never);

  if (insertError) throw new Error(insertError.message);
}
