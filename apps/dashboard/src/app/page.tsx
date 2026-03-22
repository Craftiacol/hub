import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground">Craftia Dashboard</h1>
      <p className="mt-4 text-muted-foreground">
        Welcome, {user.user_metadata?.full_name || user.email}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        CRM, Projects, and Invoicing coming soon.
      </p>
    </main>
  );
}
