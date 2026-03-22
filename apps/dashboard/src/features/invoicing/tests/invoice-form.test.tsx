import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InvoiceForm } from "../components/InvoiceForm";

describe("InvoiceForm", () => {
  it("should render invoice number field", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument();
  });

  it("should render due date field", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it("should render status select", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("should render notes field", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should validate invoice number is required", async () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/invoice number is required/i)).toBeInTheDocument();
    });
  });

  it("should validate due date is required", async () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/invoice number/i), { target: { value: "INV-001" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/due date is required/i)).toBeInTheDocument();
    });
  });

  it("should call onSubmit with form data when valid", async () => {
    const onSubmit = vi.fn();
    render(<InvoiceForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/invoice number/i), { target: { value: "INV-001" } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: "2026-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          invoice_number: "INV-001",
          due_date: "2026-04-01",
        })
      );
    });
  });

  it("should pre-fill form when editing", () => {
    const invoice = {
      id: "1",
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "sent" as const,
      notes: "Payment pending",
    };
    render(<InvoiceForm invoice={invoice} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/invoice number/i)).toHaveValue("INV-001");
    expect(screen.getByLabelText(/due date/i)).toHaveValue("2026-04-01");
  });

  it("should show saving state", () => {
    render(<InvoiceForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  describe("client selector", () => {
    const mockClients = [
      { id: "c1", name: "Acme Corp" },
      { id: "c2", name: "Globex Inc" },
    ];

    it("should render client select dropdown when clients are provided", () => {
      render(<InvoiceForm onSubmit={vi.fn()} clients={mockClients} />);
      expect(screen.getByLabelText(/client/i)).toBeInTheDocument();
    });

    it("should include a 'No client' empty option", () => {
      render(<InvoiceForm onSubmit={vi.fn()} clients={mockClients} />);
      const select = screen.getByLabelText(/client/i) as HTMLSelectElement;
      const options = Array.from(select.options);
      expect(options[0].textContent).toMatch(/no client/i);
      expect(options[0].value).toBe("");
    });

    it("should list all clients as options", () => {
      render(<InvoiceForm onSubmit={vi.fn()} clients={mockClients} />);
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("Globex Inc")).toBeInTheDocument();
    });

    it("should include client_id in submission data", async () => {
      const onSubmit = vi.fn();
      render(<InvoiceForm onSubmit={onSubmit} clients={mockClients} />);
      fireEvent.change(screen.getByLabelText(/invoice number/i), { target: { value: "INV-001" } });
      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: "2026-04-01" } });
      fireEvent.change(screen.getByLabelText(/client/i), { target: { value: "c1" } });
      fireEvent.click(screen.getByRole("button", { name: /save/i }));
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ client_id: "c1" })
        );
      });
    });

    it("should submit empty string as client_id when no client selected", async () => {
      const onSubmit = vi.fn();
      render(<InvoiceForm onSubmit={onSubmit} clients={mockClients} />);
      fireEvent.change(screen.getByLabelText(/invoice number/i), { target: { value: "INV-001" } });
      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: "2026-04-01" } });
      fireEvent.click(screen.getByRole("button", { name: /save/i }));
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ client_id: "" })
        );
      });
    });

    it("should pre-select client when editing an invoice with client_id", () => {
      const invoice = {
        id: "1",
        invoice_number: "INV-001",
        due_date: "2026-04-01",
        status: "draft" as const,
        notes: null,
        client_id: "c2",
      };
      render(<InvoiceForm invoice={invoice} onSubmit={vi.fn()} clients={mockClients} />);
      expect(screen.getByLabelText(/client/i)).toHaveValue("c2");
    });
  });
});
