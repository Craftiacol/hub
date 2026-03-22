"use client";

import { useState } from "react";
import { Button } from "@craftia/ui/button";
import { Badge } from "@craftia/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@craftia/ui/table";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  generatePaymentLinkAction,
  markInvoicePaidAction,
} from "../actions/stripe-actions";

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

interface InvoiceListProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const statusColors: Record<Invoice["status"], string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  viewed: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-500",
};

function canGeneratePaymentLink(status: Invoice["status"]): boolean {
  return ["draft", "sent", "overdue"].includes(status);
}

export function InvoiceList({ invoices, onDelete }: InvoiceListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleDeleteClick(invoice: Invoice) {
    setDeleteTarget(invoice);
  }

  function handleConfirm() {
    if (deleteTarget) {
      onDelete?.(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  function handleCancel() {
    setDeleteTarget(null);
  }

  async function handleGeneratePaymentLink(invoiceId: string) {
    setLoadingId(invoiceId);
    try {
      const result = await generatePaymentLinkAction(invoiceId);
      if ("error" in result) {
        alert(result.error);
      }
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCopyPaymentLink(paymentLink: string, invoiceId: string) {
    await navigator.clipboard.writeText(paymentLink);
    setCopiedId(invoiceId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleMarkAsPaid(invoiceId: string) {
    setLoadingId(invoiceId);
    try {
      const result = await markInvoicePaidAction(invoiceId);
      if ("error" in result) {
        alert(result.error);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <a
        href="/invoices/new"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Create Invoice
      </a>

      {invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No invoices yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.clients?.name ?? "\u2014"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[invoice.status]}`}>
                    {invoice.status}
                  </span>
                  {invoice.status === "paid" && invoice.paid_at && (
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(invoice.paid_at).toLocaleDateString()}
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>{invoice.due_date}</TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <a
                    href={`/invoices/${invoice.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>

                  {canGeneratePaymentLink(invoice.status) &&
                    !invoice.payment_link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePaymentLink(invoice.id)}
                        disabled={loadingId === invoice.id}
                        data-testid={`generate-link-${invoice.id}`}
                      >
                        {loadingId === invoice.id
                          ? "Generating..."
                          : "Generate Payment Link"}
                      </Button>
                    )}

                  {invoice.payment_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopyPaymentLink(
                          invoice.payment_link!,
                          invoice.id
                        )
                      }
                      data-testid={`copy-link-${invoice.id}`}
                    >
                      {copiedId === invoice.id
                        ? "Copied!"
                        : "Copy Payment Link"}
                    </Button>
                  )}

                  {invoice.status !== "paid" &&
                    invoice.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPaid(invoice.id)}
                        disabled={loadingId === invoice.id}
                        data-testid={`mark-paid-${invoice.id}`}
                      >
                        Mark as Paid
                      </Button>
                    )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(invoice)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Invoice"
        message={
          deleteTarget
            ? `Are you sure you want to delete invoice ${deleteTarget.invoice_number}? This action cannot be undone.`
            : ""
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
