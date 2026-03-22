"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { clientSchema } from "../schemas/client-schema";

export async function createClientAction(data: Record<string, string>) {
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      error: "Validation failed",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("clients").insert({
    user_id: user.id,
    name: data.name,
    email: data.email || null,
    company: data.company || null,
    phone: data.phone || null,
    status:
      (data.status as "lead" | "active" | "inactive" | "churned") || "lead",
  } as never);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateClientAction(
  id: string,
  data: Record<string, string>
) {
  const parsed = clientSchema.safeParse(data);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      error: "Validation failed",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("clients")
    .update({
      name: data.name,
      email: data.email || null,
      company: data.company || null,
      phone: data.phone || null,
      status:
        (data.status as "lead" | "active" | "inactive" | "churned") || "lead",
    } as never)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteClientAction(id: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
