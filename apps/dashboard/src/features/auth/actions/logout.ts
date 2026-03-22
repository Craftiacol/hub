"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
