import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InvoiceLineItems } from "../components/InvoiceLineItems";

describe("InvoiceLineItems", () => {
  it("should render Add Item button", () => {
    render(<InvoiceLineItems items={[]} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
  });

  it("should render empty state when no items", () => {
    render(<InvoiceLineItems items={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  it("should render existing items", () => {
    const items = [
      { description: "Design work", quantity: 2, unit_price: 50, total: 100, sort_order: 0 },
      { description: "Dev work", quantity: 1, unit_price: 200, total: 200, sort_order: 1 },
    ];
    render(<InvoiceLineItems items={items} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("Design work")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dev work")).toBeInTheDocument();
  });

  it("should add a new empty row when Add Item is clicked", () => {
    const onChange = vi.fn();
    render(<InvoiceLineItems items={[]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ description: "", quantity: 1, unit_price: 0 }),
        ]),
      })
    );
  });

  it("should remove an item when Remove is clicked", () => {
    const onChange = vi.fn();
    const items = [
      { description: "Item 1", quantity: 1, unit_price: 100, total: 100, sort_order: 0 },
      { description: "Item 2", quantity: 1, unit_price: 200, total: 200, sort_order: 1 },
    ];
    render(<InvoiceLineItems items={items} onChange={onChange} />);
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    fireEvent.click(removeButtons[0]!);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [expect.objectContaining({ description: "Item 2" })],
      })
    );
  });

  it("should recalculate line total when quantity changes", () => {
    const onChange = vi.fn();
    const items = [
      { description: "Design", quantity: 1, unit_price: 100, total: 100, sort_order: 0 },
    ];
    render(<InvoiceLineItems items={items} onChange={onChange} />);
    const qtyInput = screen.getByDisplayValue("1");
    fireEvent.change(qtyInput, { target: { value: "3" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [expect.objectContaining({ quantity: 3, total: 300 })],
      })
    );
  });

  it("should recalculate line total when unit_price changes", () => {
    const onChange = vi.fn();
    const items = [
      { description: "Design", quantity: 2, unit_price: 50, total: 100, sort_order: 0 },
    ];
    render(<InvoiceLineItems items={items} onChange={onChange} />);
    const priceInput = screen.getByDisplayValue("50");
    fireEvent.change(priceInput, { target: { value: "75" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [expect.objectContaining({ unit_price: 75, total: 150 })],
      })
    );
  });

  it("should calculate correct subtotal", () => {
    const items = [
      { description: "Item 1", quantity: 2, unit_price: 100, total: 200, sort_order: 0 },
      { description: "Item 2", quantity: 1, unit_price: 50, total: 50, sort_order: 1 },
    ];
    render(<InvoiceLineItems items={items} onChange={vi.fn()} />);
    // Subtotal should be 250, Total should also be 250 (no tax)
    const allMatches = screen.getAllByText("$250.00");
    // Both subtotal and total display $250.00 when no tax
    expect(allMatches.length).toBeGreaterThanOrEqual(2);
  });

  it("should calculate tax amount when taxRate is provided", () => {
    const items = [
      { description: "Item 1", quantity: 1, unit_price: 100, total: 100, sort_order: 0 },
    ];
    render(<InvoiceLineItems items={items} onChange={vi.fn()} taxRate={16} />);
    // Tax: 100 * 0.16 = 16.00
    expect(screen.getByText("$16.00")).toBeInTheDocument();
  });

  it("should calculate grand total with tax", () => {
    const items = [
      { description: "Item 1", quantity: 1, unit_price: 100, total: 100, sort_order: 0 },
    ];
    render(<InvoiceLineItems items={items} onChange={vi.fn()} taxRate={16} />);
    // Grand total: 100 + 16 = 116.00
    expect(screen.getByText("$116.00")).toBeInTheDocument();
  });

  it("should call onChange with correct totals data", () => {
    const onChange = vi.fn();
    const items = [
      { description: "Item 1", quantity: 2, unit_price: 100, total: 200, sort_order: 0 },
    ];
    render(<InvoiceLineItems items={items} onChange={onChange} taxRate={10} />);
    // Add an item to trigger onChange
    fireEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotal: expect.any(Number),
        tax_amount: expect.any(Number),
        total: expect.any(Number),
      })
    );
  });

  it("should display line total as read-only", () => {
    const items = [
      { description: "Design", quantity: 2, unit_price: 50, total: 100, sort_order: 0 },
    ];
    render(<InvoiceLineItems items={items} onChange={vi.fn()} />);
    // The line total appears in both the row and the subtotal/total summary
    const allMatches = screen.getAllByText("$100.00");
    expect(allMatches.length).toBeGreaterThanOrEqual(1);
    // Ensure none of them are editable inputs
    allMatches.forEach((el) => {
      expect(el.tagName).not.toBe("INPUT");
    });
  });
});
