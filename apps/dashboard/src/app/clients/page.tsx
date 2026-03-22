import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getClientsFiltered } from "@/features/crm/services/client-service";
import { ClientsPageClient } from "./ClientsPageClient";

interface ClientsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: clients, totalPages } = await getClientsFiltered({
    search: params.search,
    status: params.status,
    page,
    pageSize: 10,
  });

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">Clients</h2>
      <div className="mt-6">
        <ClientsPageClient
          clients={clients as never[]}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </DashboardLayout>
  );
}
