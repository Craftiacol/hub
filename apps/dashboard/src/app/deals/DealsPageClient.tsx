"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PipelineBoard } from "@/features/pipeline/components/PipelineBoard";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { Pagination } from "@/components/Pagination";

interface Deal {
  id: string;
  title: string;
  value: number | null;
  stage: string;
  expected_close_date: string | null;
  notes: string | null;
  client_id: string | null;
  clients: { name: string } | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface DealsPageClientProps {
  deals: Deal[];
  totalPages: number;
  currentPage: number;
}

const STAGE_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function DealsPageClient({
  deals,
  totalPages,
  currentPage,
}: DealsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStage = searchParams.get("stage") ?? "";

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

      router.push(`/deals?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div>
      <SearchFilterBar
        searchPlaceholder="Search deals by title..."
        filters={[
          { name: "stage", label: "Stage", options: STAGE_OPTIONS },
        ]}
        onSearchChange={(value) => updateParams({ search: value })}
        onFilterChange={(name, value) => updateParams({ [name]: value })}
        currentSearch={currentSearch}
        currentFilters={{ stage: currentStage }}
      />

      <PipelineBoard deals={deals} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />
    </div>
  );
}
