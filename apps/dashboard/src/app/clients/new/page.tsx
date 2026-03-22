import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NewClientPage } from "./NewClientPage";

export default async function NewClient() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">New Client</h2>
      <div className="mt-6 max-w-2xl">
        <NewClientPage />
      </div>
    </DashboardLayout>
  );
}
