"use client";

import { useState } from "react";

interface InvoiceFormProps {
  invoice?: {
    id: string;
    invoice_number: string;
    due_date: string;
    status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
    notes?: string | null;
  };
  onSubmit: (data: {
    invoice_number: string;
    due_date: string;
    status: string;
    notes: string;
  }) => void;
  isLoading?: boolean;
}

export function InvoiceForm({ invoice, onSubmit, isLoading }: InvoiceFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoice_number ?? "");
  const [dueDate, setDueDate] = useState(invoice?.due_date ?? "");
  const [status, setStatus] = useState(invoice?.status ?? "draft");
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [error, setError] = useState("");

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
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="invoice_number">Invoice Number</label>
        <input
          id="invoice_number"
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="due_date">Due Date</label>
        <input
          id="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select
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
        </select>
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Invoice"}
      </button>
    </form>
  );
}
