"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { InvoiceList } from "@/features/invoicing/components/InvoiceList";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { Pagination } from "@/components/Pagination";

interface Invoice {
  id: string;
  invoice_number: string;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  total: number;
  currency: string | null;
  due_date: string;
  client_id: string | null;
  clients?: { name: string } | null;
  project_id: string | null;
  user_id: string;
  issue_date: string;
  subtotal: number;
  tax_rate: number | null;
  tax_amount: number | null;
  notes: string | null;
  payment_link: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

interface InvoicesPageClientProps {
  invoices: Invoice[];
  totalPages: number;
  currentPage: number;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "viewed", label: "Viewed" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

export function InvoicesPageClient({
  invoices,
  totalPages,
  currentPage,
}: InvoicesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      if (!("page" in updates)) {
        params.delete("page");
      }

      router.push(`/invoices?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div>
      <SearchFilterBar
        searchPlaceholder="Search by invoice number..."
        filters={[
          { name: "status", label: "Status", options: STATUS_OPTIONS },
        ]}
        onSearchChange={(value) => updateParams({ search: value })}
        onFilterChange={(name, value) => updateParams({ [name]: value })}
        currentSearch={currentSearch}
        currentFilters={{ status: currentStatus }}
      />

      <InvoiceList invoices={invoices} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />
    </div>
  );
}
