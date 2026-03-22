"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/features/invoicing/components/InvoiceForm";
import { createInvoiceAction } from "@/features/invoicing/actions/invoice-actions";

export function NewInvoicePage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: Record<string, string>) {
    setIsLoading(true);
    setError(undefined);
    const result = await createInvoiceAction(data);
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
      <InvoiceForm onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
