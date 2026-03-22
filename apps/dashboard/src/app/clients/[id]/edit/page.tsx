import { createServerClient } from "@craftia/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getClientById } from "@/features/crm/services/client-service";
import { EditClientPage } from "./EditClientPage";

interface EditClientProps {
  params: Promise<{ id: string }>;
}

export default async function EditClient({ params }: EditClientProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;

  let client;
  try {
    client = await getClientById(id);
  } catch {
    notFound();
  }

  if (!client) notFound();

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">Edit Client</h2>
      <div className="mt-6 max-w-2xl">
        <EditClientPage client={client} />
      </div>
    </DashboardLayout>
  );
}
