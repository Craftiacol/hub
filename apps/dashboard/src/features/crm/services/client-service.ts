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
    .insert(clientData)
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
    .update(clientData)
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
