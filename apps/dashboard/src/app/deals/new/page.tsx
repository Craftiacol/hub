import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NewDealPage } from "./NewDealPage";

export default async function NewDeal() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">New Deal</h2>
      <div className="mt-6 max-w-2xl">
        <NewDealPage clients={clients || []} />
      </div>
    </DashboardLayout>
  );
}
