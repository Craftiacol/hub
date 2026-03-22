"use client";

import { useState, useRef } from "react";
import { Input } from "@craftia/ui/input";
import { Label } from "@craftia/ui/label";
import { Select } from "@craftia/ui/select";
import { Textarea } from "@craftia/ui/textarea";
import { Button } from "@craftia/ui/button";
import { InvoiceLineItems, LineItem, LineItemsChangeData } from "./InvoiceLineItems";

interface Client {
  id: string;
  name: string;
}

interface InvoiceFormProps {
  invoice?: {
    id: string;
    invoice_number: string;
    due_date: string;
    status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
    notes?: string | null;
    client_id?: string | null;
    tax_rate?: number | null;
  };
  items?: LineItem[];
  clients?: Client[];
  onSubmit: (data: {
    invoice_number: string;
    due_date: string;
    status: string;
    notes: string;
    client_id: string;
    tax_rate: number;
    items: LineItem[];
    subtotal: number;
    tax_amount: number;
    total: number;
  }) => void;
  isLoading?: boolean;
}

export function InvoiceForm({ invoice, items: initialItems, clients, onSubmit, isLoading }: InvoiceFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoice_number ?? "");
  const [dueDate, setDueDate] = useState(invoice?.due_date ?? "");
  const [status, setStatus] = useState(invoice?.status ?? "draft");
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [clientId, setClientId] = useState(invoice?.client_id ?? "");
  const [taxRate, setTaxRate] = useState<number>(invoice?.tax_rate ?? 0);
  const [lineItems, setLineItems] = useState<LineItem[]>(initialItems ?? []);
  const [error, setError] = useState("");

  const lineItemsDataRef = useRef<LineItemsChangeData>({
    items: initialItems ?? [],
    subtotal: (initialItems ?? []).reduce((sum, item) => sum + item.total, 0),
    tax_amount: 0,
    total: (initialItems ?? []).reduce((sum, item) => sum + item.total, 0),
  });

  function handleLineItemsChange(data: LineItemsChangeData) {
    setLineItems(data.items);
    lineItemsDataRef.current = data;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!invoiceNumber.trim()) {
      setError("Invoice number is required");
      return;
    }

    if (!dueDate.trim()) {
      setError("Due date is required");
      return;
    }

    onSubmit({
      invoice_number: invoiceNumber,
      due_date: dueDate,
      status,
      notes,
      client_id: clientId,
      tax_rate: taxRate,
      items: lineItemsDataRef.current.items,
      subtotal: lineItemsDataRef.current.subtotal,
      tax_amount: lineItemsDataRef.current.tax_amount,
      total: lineItemsDataRef.current.total,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invoice_number">Invoice Number</Label>
        <Input
          id="invoice_number"
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Input
          id="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled")}
        >
          <option value="draft">draft</option>
          <option value="sent">sent</option>
          <option value="viewed">viewed</option>
          <option value="paid">paid</option>
          <option value="overdue">overdue</option>
          <option value="cancelled">cancelled</option>
        </Select>
      </div>

      {clients && clients.length > 0 && (
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
      )}

      <div className="space-y-2">
        <Label htmlFor="tax_rate">Tax Rate (%)</Label>
        <Input
          id="tax_rate"
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(Number(e.target.value))}
          min={0}
          max={100}
          step="0.01"
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

      <InvoiceLineItems
        items={lineItems}
        onChange={handleLineItemsChange}
        taxRate={taxRate}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Invoice"}
      </Button>
    </form>
  );
}
