import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getInvoicesFiltered } from "@/features/invoicing/services/invoice-service";
import { InvoicesPageClient } from "./InvoicesPageClient";

interface InvoicesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function InvoicesPage({
  searchParams,
}: InvoicesPageProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: invoices, totalPages } = await getInvoicesFiltered({
    search: params.search,
    status: params.status,
    page,
    pageSize: 10,
  });

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">Invoices</h2>
      <div className="mt-6">
        <InvoicesPageClient
          invoices={invoices as never[]}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </DashboardLayout>
  );
}
