"use client";

import { Button } from "@craftia/ui/button";
import { Card, CardContent } from "@craftia/ui/card";
import { Badge } from "@craftia/ui/badge";

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

interface DealCardProps {
  deal: Deal;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number | null): string {
  if (value === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

export function DealCard({ deal, onDelete }: DealCardProps) {
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", deal.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      className="rounded-lg border border-border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <h4 className="font-medium text-foreground">{deal.title}</h4>

      {deal.value !== null && (
        <p className="mt-1 text-sm font-semibold text-primary">
          {formatCurrency(deal.value)}
        </p>
      )}

      {deal.clients && (
        <p className="mt-1 text-xs text-muted-foreground">
          {deal.clients.name}
        </p>
      )}

      {deal.expected_close_date && (
        <p className="mt-1 text-xs text-muted-foreground">
          {deal.expected_close_date}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <a
          href={`/deals/${deal.id}/edit`}
          className="text-xs text-primary hover:underline"
        >
          Edit
        </a>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-destructive hover:underline hover:bg-transparent"
          onClick={() => onDelete(deal.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
