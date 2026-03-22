import { createClient as createSupabaseClient } from "@craftia/db";

function getSupabase() {
  return createSupabaseClient();
}

export async function getDeals() {
  const { data, error } = await getSupabase()
    .from("pipeline_deals")
    .select("*, clients(name)")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getDealById(id: string) {
  const { data, error } = await getSupabase()
    .from("pipeline_deals")
    .select("*, clients(name)")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createDeal(dealData: Record<string, unknown>) {
  const { data, error } = await getSupabase()
    .from("pipeline_deals")
    .insert(dealData as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateDeal(
  id: string,
  dealData: Record<string, unknown>
) {
  const { data, error } = await getSupabase()
    .from("pipeline_deals")
    .update(dealData as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDeal(id: string) {
  const { error } = await getSupabase()
    .from("pipeline_deals")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export interface DealListOptions {
  search?: string;
  stage?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

export async function getDealsFiltered(
  options: DealListOptions = {}
): Promise<PaginatedResult<Record<string, unknown>>> {
  const { search, stage, page = 1, pageSize = 10 } = options;

  let query = getSupabase()
    .from("pipeline_deals")
    .select("*, clients(name)", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (stage) {
    query = query.eq(
      "stage",
      stage as "lead" | "contacted" | "proposal" | "negotiation" | "won" | "lost"
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    data: data ?? [],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}
