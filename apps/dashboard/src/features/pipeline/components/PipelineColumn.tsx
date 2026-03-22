"use client";

import { Badge } from "@craftia/ui/badge";
import { DealCard } from "./DealCard";

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

interface PipelineColumnProps {
  stage: string;
  label: string;
  deals: Deal[];
  onDrop: (dealId: string, stage: string) => void;
  onDeleteDeal: (id: string) => void;
}

export function PipelineColumn({
  stage,
  label,
  deals,
  onDrop,
  onDeleteDeal,
}: PipelineColumnProps) {
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");
    if (dealId) {
      onDrop(dealId, stage);
    }
  }

  return (
    <div
      className="flex min-w-[250px] flex-col rounded-lg bg-accent/30 p-3"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold capitalize text-foreground">
          {label}
        </h3>
        <span
          data-testid={`column-count-${stage}`}
          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {deals.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onDelete={onDeleteDeal} />
        ))}
      </div>
    </div>
  );
}
