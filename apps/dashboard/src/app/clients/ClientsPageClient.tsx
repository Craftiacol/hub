"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ClientList } from "@/features/crm/components/ClientList";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { Pagination } from "@/components/Pagination";

interface Client {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: "lead" | "active" | "inactive" | "churned";
  phone: string | null;
  website: string | null;
  notes: string | null;
  tags: string[] | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ClientsPageClientProps {
  clients: Client[];
  totalPages: number;
  currentPage: number;
}

const STATUS_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "churned", label: "Churned" },
];

export function ClientsPageClient({
  clients,
  totalPages,
  currentPage,
}: ClientsPageClientProps) {
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

      // Reset to page 1 when filters change
      if (!("page" in updates)) {
        params.delete("page");
      }

      router.push(`/clients?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div>
      <SearchFilterBar
        searchPlaceholder="Search clients by name..."
        filters={[
          { name: "status", label: "Status", options: STATUS_OPTIONS },
        ]}
        onSearchChange={(value) => updateParams({ search: value })}
        onFilterChange={(name, value) => updateParams({ [name]: value })}
        currentSearch={currentSearch}
        currentFilters={{ status: currentStatus }}
      />

      <ClientList clients={clients} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />
    </div>
  );
}
