"use client";

import { useState } from "react";
import { Input } from "@craftia/ui/input";
import { Label } from "@craftia/ui/label";
import { Select } from "@craftia/ui/select";
import { Textarea } from "@craftia/ui/textarea";
import { Button } from "@craftia/ui/button";

interface DealFormProps {
  deal?: {
    id: string;
    title: string;
    value: number | null;
    stage: string;
    expected_close_date: string | null;
    notes: string | null;
    client_id: string | null;
  };
  clients: { id: string; name: string }[];
  onSubmit: (data: {
    title: string;
    value: string;
    stage: string;
    expected_close_date: string;
    notes: string;
    client_id: string;
  }) => void;
  isLoading?: boolean;
}

export function DealForm({ deal, clients, onSubmit, isLoading }: DealFormProps) {
  const [title, setTitle] = useState(deal?.title ?? "");
  const [value, setValue] = useState(deal?.value ?? "");
  const [stage, setStage] = useState(deal?.stage ?? "lead");
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    deal?.expected_close_date ?? ""
  );
  const [notes, setNotes] = useState(deal?.notes ?? "");
  const [clientId, setClientId] = useState(deal?.client_id ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    onSubmit({
      title,
      value: String(value),
      stage,
      expected_close_date: expectedCloseDate,
      notes,
      client_id: clientId,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <Select
          id="stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="lead">Lead</option>
          <option value="contacted">Contacted</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expected_close_date">Expected Close Date</Label>
        <Input
          id="expected_close_date"
          type="date"
          value={expectedCloseDate}
          onChange={(e) => setExpectedCloseDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_id">Client</Label>
        <Select
          id="client_id"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">No client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Deal"}
      </Button>
    </form>
  );
}
