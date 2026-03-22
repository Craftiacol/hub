import { createServerClient } from "@craftia/auth";
import { redirect, notFound } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getInvoiceById } from "@/features/invoicing/services/invoice-service";
import { getInvoiceItems } from "@/features/invoicing/services/invoice-items-service";
import { getClients } from "@/features/crm/services/client-service";
import { EditInvoicePage } from "./EditInvoicePage";

interface EditInvoiceProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoice({ params }: EditInvoiceProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;

  let invoice;
  try {
    invoice = await getInvoiceById(id);
  } catch {
    notFound();
  }

  if (!invoice) notFound();

  const [clients, items] = await Promise.all([
    getClients(),
    getInvoiceItems(id),
  ]);

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email || ""}
    >
      <h2 className="text-2xl font-bold text-foreground">Edit Invoice</h2>
      <div className="mt-6 max-w-2xl">
        <EditInvoicePage invoice={invoice} clients={clients} items={items} />
      </div>
    </DashboardLayout>
  );
}
