import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getDealsFiltered } from "@/features/pipeline/services/deal-service";
import { DealsPageClient } from "./DealsPageClient";

interface DealsPageProps {
  searchParams: Promise<{
    search?: string;
    stage?: string;
    page?: string;
  }>;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: deals, totalPages } = await getDealsFiltered({
    search: params.search,
    stage: params.stage,
    page,
    pageSize: 10,
  });

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <div className="mt-6">
        <DealsPageClient
          deals={deals as never[]}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </DashboardLayout>
  );
}
