import { createClient as createSupabaseClient } from "@craftia/db";

function getSupabase() {
  return createSupabaseClient();
}

export async function getClients() {
  const { data, error } = await getSupabase()
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getClientById(id: string) {
  const { data, error } = await getSupabase()
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createClient(clientData: Record<string, unknown>) {
  const { data, error } = await getSupabase()
    .from("clients")
    .insert(clientData as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateClient(
  id: string,
  clientData: Record<string, unknown>
) {
  const { data, error } = await getSupabase()
    .from("clients")
    .update(clientData as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await getSupabase()
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export interface ClientListOptions {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

export async function getClientsFiltered(
  options: ClientListOptions = {}
): Promise<PaginatedResult<Record<string, unknown>>> {
  const { search, status, page = 1, pageSize = 10 } = options;

  let query = getSupabase().from("clients").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
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
