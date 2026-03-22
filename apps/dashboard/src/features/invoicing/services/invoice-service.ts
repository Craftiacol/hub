import { createClient as createSupabaseClient } from "@craftia/db";

function getSupabase() {
  return createSupabaseClient();
}

export async function getInvoices() {
  const { data, error } = await getSupabase()
    .from("invoices")
    .select("*, clients(name)")
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
    .insert(invoiceData as never)
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
    .update(invoiceData as never)
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

export interface InvoiceListOptions {
  search?: string;
  status?: string;
  clientId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

export async function getInvoicesFiltered(
  options: InvoiceListOptions = {}
): Promise<PaginatedResult<Record<string, unknown>>> {
  const { search, status, clientId, page = 1, pageSize = 10 } = options;

  let query = getSupabase()
    .from("invoices")
    .select("*, clients(name)", { count: "exact" });

  if (search) {
    query = query.ilike("invoice_number", `%${search}%`);
  }

  if (status) {
    query = query.eq(
      "status",
      status as "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
    );
  }

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    data: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}
