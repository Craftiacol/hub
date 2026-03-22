import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InvoiceForm } from "../components/InvoiceForm";

describe("InvoiceForm with line items", () => {
  it("should render the InvoiceLineItems component", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
  });

  it("should render tax_rate field", () => {
    render(<InvoiceForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/tax rate/i)).toBeInTheDocument();
  });

  it("should pass existing items when editing", () => {
    const invoice = {
      id: "1",
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft" as const,
      notes: null,
      tax_rate: 16,
    };
    const items = [
      { description: "Design work", quantity: 2, unit_price: 50, total: 100, sort_order: 0 },
    ];
    render(<InvoiceForm invoice={invoice} items={items} onSubmit={vi.fn()} />);
    expect(screen.getByDisplayValue("Design work")).toBeInTheDocument();
  });

  it("should include items and totals in submission data", async () => {
    const onSubmit = vi.fn();
    const items = [
      { description: "Design", quantity: 1, unit_price: 100, total: 100, sort_order: 0 },
    ];
    render(<InvoiceForm onSubmit={onSubmit} items={items} />);

    fireEvent.change(screen.getByLabelText(/invoice number/i), { target: { value: "INV-001" } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: "2026-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          invoice_number: "INV-001",
          items: expect.arrayContaining([
            expect.objectContaining({ description: "Design" }),
          ]),
          subtotal: expect.any(Number),
          total: expect.any(Number),
        })
      );
    });
  });

  it("should pre-fill tax_rate when editing", () => {
    const invoice = {
      id: "1",
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft" as const,
      notes: null,
      tax_rate: 16,
    };
    render(<InvoiceForm invoice={invoice} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/tax rate/i)).toHaveValue(16);
  });
});
