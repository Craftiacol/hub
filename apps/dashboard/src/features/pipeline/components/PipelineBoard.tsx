"use client";

import { useRouter } from "next/navigation";
import { Button } from "@craftia/ui/button";
import { PipelineColumn } from "./PipelineColumn";
import {
  updateDealStageAction,
  deleteDealAction,
} from "../actions/deal-actions";

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

const STAGES = [
  { key: "lead", label: "Lead" },
  { key: "contacted", label: "Contacted" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
] as const;

interface PipelineBoardProps {
  deals: Deal[];
}

export function PipelineBoard({ deals }: PipelineBoardProps) {
  const router = useRouter();

  function groupDealsByStage(deals: Deal[]) {
    const grouped: Record<string, Deal[]> = {};
    for (const stage of STAGES) {
      grouped[stage.key] = [];
    }
    for (const deal of deals) {
      const stageDeals = grouped[deal.stage];
      if (stageDeals) {
        stageDeals.push(deal);
      }
    }
    return grouped;
  }

  const grouped = groupDealsByStage(deals);

  async function handleDrop(dealId: string, stage: string) {
    await updateDealStageAction(dealId, stage);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteDealAction(id);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Pipeline</h2>
        <a
          href="/deals/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Add Deal
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <PipelineColumn
            key={stage.key}
            stage={stage.key}
            label={stage.label}
            deals={grouped[stage.key] ?? []}
            onDrop={handleDrop}
            onDeleteDeal={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
