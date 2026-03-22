"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";

export async function loginAction(data: { email: string; password: string }) {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}
