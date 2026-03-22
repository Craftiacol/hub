import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function DashboardHome() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: clientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const { count: invoiceCount } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Clients</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {clientCount || 0}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Invoices</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {invoiceCount || 0}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Quick Actions</p>
          <div className="mt-2 flex gap-2">
            <a
              href="/clients/new"
              className="text-sm text-primary hover:underline"
            >
              Add Client
            </a>
            <a
              href="/invoices/new"
              className="text-sm text-primary hover:underline"
            >
              New Invoice
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
