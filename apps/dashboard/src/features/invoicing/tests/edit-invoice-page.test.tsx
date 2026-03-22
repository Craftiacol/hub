import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditInvoicePage } from "@/app/invoices/[id]/edit/EditInvoicePage";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock the update action
const mockUpdateInvoiceAction = vi.fn();
vi.mock("@/features/invoicing/actions/invoice-actions", () => ({
  updateInvoiceAction: (...args: unknown[]) =>
    mockUpdateInvoiceAction(...args),
}));

const mockClients = [
  { id: "c1", name: "Acme Corp" },
  { id: "c2", name: "Globex Inc" },
];

const mockInvoice = {
  id: "inv-1",
  invoice_number: "INV-001",
  due_date: "2026-04-01",
  status: "draft" as const,
  notes: "Some notes",
};

describe("EditInvoicePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form pre-filled with invoice data", () => {
    render(<EditInvoicePage invoice={mockInvoice} clients={mockClients} />);
    expect(screen.getByLabelText(/invoice number/i)).toHaveValue("INV-001");
    expect(screen.getByLabelText(/due date/i)).toHaveValue("2026-04-01");
  });

  it("should call updateInvoiceAction with invoice id and form data on submit", async () => {
    mockUpdateInvoiceAction.mockResolvedValue({ success: true });
    render(<EditInvoicePage invoice={mockInvoice} clients={mockClients} />);

    fireEvent.change(screen.getByLabelText(/invoice number/i), {
      target: { value: "INV-002" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateInvoiceAction).toHaveBeenCalledWith(
        "inv-1",
        expect.objectContaining({ invoice_number: "INV-002" })
      );
    });
  });

  it("should redirect to /invoices on successful update", async () => {
    mockUpdateInvoiceAction.mockResolvedValue({ success: true });
    render(<EditInvoicePage invoice={mockInvoice} clients={mockClients} />);

    fireEvent.change(screen.getByLabelText(/invoice number/i), {
      target: { value: "INV-002" },
    });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-05-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/invoices");
    });
  });

  it("should display error message on failed update", async () => {
    mockUpdateInvoiceAction.mockResolvedValue({ error: "Update failed" });
    render(<EditInvoicePage invoice={mockInvoice} clients={mockClients} />);

    fireEvent.change(screen.getByLabelText(/invoice number/i), {
      target: { value: "INV-002" },
    });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2026-05-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });
});
