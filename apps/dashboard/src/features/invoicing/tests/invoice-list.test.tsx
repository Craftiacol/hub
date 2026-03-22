import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InvoiceList } from "../components/InvoiceList";

// Mock stripe actions used by InvoiceList
vi.mock("../actions/stripe-actions", () => ({
  generatePaymentLinkAction: vi.fn().mockResolvedValue({ success: true, paymentLink: "https://checkout.stripe.com/test" }),
  markInvoicePaidAction: vi.fn().mockResolvedValue({ success: true }),
}));

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

  describe("client name column", () => {
    const invoicesWithClients = [
      { ...mockInvoices[0], client_id: "c1", clients: { name: "Acme Corp" } },
      { ...mockInvoices[1], client_id: null, clients: null },
    ];

    it("should render a Client column header", () => {
      render(<InvoiceList invoices={invoicesWithClients} />);
      expect(screen.getByText("Client")).toBeInTheDocument();
    });

    it("should display client name when invoice has a client", () => {
      render(<InvoiceList invoices={invoicesWithClients} />);
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });

    it("should display dash when invoice has no client", () => {
      render(<InvoiceList invoices={invoicesWithClients} />);
      const rows = screen.getAllByRole("row");
      // Row 0 is header, row 2 is the second invoice (no client)
      expect(rows[2]).toHaveTextContent("—");
    });
  });

  describe("delete confirmation", () => {
    it("should show confirmation dialog when delete button is clicked", () => {
      const onDelete = vi.fn();
      render(<InvoiceList invoices={mockInvoices} onDelete={onDelete} />);
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
      expect(
        screen.getByText(/are you sure you want to delete invoice INV-001/i)
      ).toBeInTheDocument();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("should call onDelete when confirming the dialog", () => {
      const onDelete = vi.fn();
      render(<InvoiceList invoices={mockInvoices} onDelete={onDelete} />);
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
      // The confirm button is inside the dialog overlay
      const dialog = screen.getByTestId("confirm-dialog-overlay");
      const confirmButton = dialog.querySelector("button:last-child")!;
      fireEvent.click(confirmButton);
      expect(onDelete).toHaveBeenCalledWith("1");
    });

    it("should not call onDelete when canceling the dialog", () => {
      const onDelete = vi.fn();
      render(<InvoiceList invoices={mockInvoices} onDelete={onDelete} />);
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe("payment actions", () => {
    it("should show Generate Payment Link button for draft invoices without payment_link", () => {
      render(<InvoiceList invoices={mockInvoices} />);
      expect(screen.getByTestId("generate-link-1")).toBeInTheDocument();
    });

    it("should not show Generate Payment Link button for paid invoices", () => {
      render(<InvoiceList invoices={mockInvoices} />);
      expect(screen.queryByTestId("generate-link-2")).not.toBeInTheDocument();
    });

    it("should show Copy Payment Link button when payment_link exists", () => {
      const invoicesWithLink = [
        { ...mockInvoices[0], payment_link: "https://checkout.stripe.com/test" },
      ];
      render(<InvoiceList invoices={invoicesWithLink} />);
      expect(screen.getByTestId("copy-link-1")).toBeInTheDocument();
    });

    it("should show Mark as Paid button for unpaid invoices", () => {
      render(<InvoiceList invoices={mockInvoices} />);
      expect(screen.getByTestId("mark-paid-1")).toBeInTheDocument();
    });

    it("should not show Mark as Paid button for paid invoices", () => {
      render(<InvoiceList invoices={mockInvoices} />);
      expect(screen.queryByTestId("mark-paid-2")).not.toBeInTheDocument();
    });

    it("should display paid_at date for paid invoices", () => {
      render(<InvoiceList invoices={mockInvoices} />);
      // paid_at is "2026-03-20", formatted as locale date
      expect(screen.getByText(new Date("2026-03-20").toLocaleDateString())).toBeInTheDocument();
    });
  });
});
