import { createServerClient } from "@craftia/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getDealById } from "@/features/pipeline/services/deal-service";
import { EditDealPage } from "./EditDealPage";

interface EditDealProps {
  params: Promise<{ id: string }>;
}

export default async function EditDeal({ params }: EditDealProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;

  let deal;
  try {
    deal = await getDealById(id);
  } catch {
    notFound();
  }

  if (!deal) notFound();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">Edit Deal</h2>
      <div className="mt-6 max-w-2xl">
        <EditDealPage deal={deal} clients={clients || []} />
      </div>
    </DashboardLayout>
  );
}
