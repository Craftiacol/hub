"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";

type PipelineStage =
  | "lead"
  | "contacted"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export async function createDealAction(data: Record<string, string>) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("pipeline_deals").insert({
    user_id: user.id,
    title: data.title,
    value: data.value ? parseFloat(data.value) : null,
    stage: (data.stage as PipelineStage) || "lead",
    expected_close_date: data.expected_close_date || null,
    notes: data.notes || null,
    client_id: data.client_id || null,
  } as never);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateDealAction(
  id: string,
  data: Record<string, string>
) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("pipeline_deals")
    .update({
      title: data.title,
      value: data.value ? parseFloat(data.value) : null,
      stage: (data.stage as PipelineStage) || "lead",
      expected_close_date: data.expected_close_date || null,
      notes: data.notes || null,
      client_id: data.client_id || null,
    } as never)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateDealStageAction(id: string, stage: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("pipeline_deals")
    .update({ stage: stage as PipelineStage } as never)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteDealAction(id: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("pipeline_deals")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
