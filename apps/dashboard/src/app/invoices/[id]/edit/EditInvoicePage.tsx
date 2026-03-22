"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/features/invoicing/components/InvoiceForm";
import { updateInvoiceAction } from "@/features/invoicing/actions/invoice-actions";
import type { LineItem } from "@/features/invoicing/components/InvoiceLineItems";

interface Client {
  id: string;
  name: string;
}

interface EditInvoicePageProps {
  invoice: {
    id: string;
    invoice_number: string;
    due_date: string;
    status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
    notes?: string | null;
    client_id?: string | null;
    tax_rate?: number | null;
  };
  clients: Client[];
  items?: LineItem[];
}

export function EditInvoicePage({ invoice, clients, items }: EditInvoicePageProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    setError(undefined);
    const result = await updateInvoiceAction(invoice.id, data as Parameters<typeof updateInvoiceAction>[1]);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/invoices");
    }
  }

  return (
    <>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <InvoiceForm
        invoice={invoice}
        items={items}
        clients={clients}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
