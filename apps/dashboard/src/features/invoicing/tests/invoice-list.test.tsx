import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InvoiceList } from "../components/InvoiceList";

const mockInvoices = [
  { id: "1", invoice_number: "INV-001", status: "draft" as const, total: 1000, currency: "USD", due_date: "2026-04-01", client_id: null, project_id: null, user_id: "u1", issue_date: "2026-03-01", subtotal: 1000, tax_rate: 0, tax_amount: 0, notes: null, payment_link: null, paid_at: null, created_at: "2026-03-01", updated_at: "2026-03-01" },
  { id: "2", invoice_number: "INV-002", status: "paid" as const, total: 2500, currency: "USD", due_date: "2026-03-15", client_id: null, project_id: null, user_id: "u1", issue_date: "2026-03-01", subtotal: 2500, tax_rate: 0, tax_amount: 0, notes: null, payment_link: null, paid_at: "2026-03-20", created_at: "2026-03-01", updated_at: "2026-03-20" },
];

describe("InvoiceList", () => {
  it("should render all invoices", () => {
    render(<InvoiceList invoices={mockInvoices} />);
    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("INV-002")).toBeInTheDocument();
  });

  it("should display invoice total formatted", () => {
    render(<InvoiceList invoices={mockInvoices} />);
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
    expect(screen.getByText("$2,500.00")).toBeInTheDocument();
  });

  it("should display invoice status", () => {
    render(<InvoiceList invoices={mockInvoices} />);
    expect(screen.getByText("draft")).toBeInTheDocument();
    expect(screen.getByText("paid")).toBeInTheDocument();
  });

  it("should show empty state when no invoices", () => {
    render(<InvoiceList invoices={[]} />);
    expect(screen.getByText(/no invoices/i)).toBeInTheDocument();
  });

  it("should render create invoice button", () => {
    render(<InvoiceList invoices={[]} />);
    expect(screen.getByRole("link", { name: /create invoice/i })).toBeInTheDocument();
  });

  it("should render edit links", () => {
    render(<InvoiceList invoices={mockInvoices} />);
    const editLinks = screen.getAllByRole("link", { name: /edit/i });
    expect(editLinks).toHaveLength(2);
  });

  it("should call onDelete when delete is clicked", () => {
    const onDelete = vi.fn();
    render(<InvoiceList invoices={mockInvoices} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    deleteButtons[0].click();
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
