"use client";

import { Input } from "@craftia/ui/input";
import { Button } from "@craftia/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@craftia/ui/table";

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number | null;
}

export interface LineItemsChangeData {
  items: LineItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
}

interface InvoiceLineItemsProps {
  items: LineItem[];
  onChange: (data: LineItemsChangeData) => void;
  taxRate?: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function calculateTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax_amount = subtotal * (taxRate / 100);
  const total = subtotal + tax_amount;
  return { subtotal, tax_amount, total };
}

export function InvoiceLineItems({ items, onChange, taxRate = 0 }: InvoiceLineItemsProps) {
  const { subtotal, tax_amount, total } = calculateTotals(items, taxRate);

  function emitChange(updatedItems: LineItem[]) {
    const totals = calculateTotals(updatedItems, taxRate);
    onChange({ items: updatedItems, ...totals });
  }

  function handleAddItem() {
    const newItem: LineItem = {
      description: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
      sort_order: items.length,
    };
    emitChange([...items, newItem]);
  }

  function handleRemoveItem(index: number) {
    const updatedItems = items
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, sort_order: i }));
    emitChange(updatedItems);
  }

  function handleFieldChange(index: number, field: keyof LineItem, value: string | number) {
    const updatedItems = items.map((item, i) => {
      if (i !== index) return item;

      const updated = { ...item, [field]: value };

      if (field === "quantity" || field === "unit_price") {
        const qty = field === "quantity" ? Number(value) : item.quantity;
        const price = field === "unit_price" ? Number(value) : item.unit_price;
        updated.quantity = qty;
        updated.unit_price = price;
        updated.total = qty * price;
      }

      return updated;
    });
    emitChange(updatedItems);
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                    aria-label={`Item ${index + 1} description`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleFieldChange(index, "quantity", Number(e.target.value))}
                    aria-label={`Item ${index + 1} quantity`}
                    min={0}
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handleFieldChange(index, "unit_price", Number(e.target.value))}
                    aria-label={`Item ${index + 1} unit price`}
                    min={0}
                    step="0.01"
                  />
                </TableCell>
                <TableCell>{formatCurrency(item.total)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button type="button" variant="outline" onClick={handleAddItem}>
        Add Item
      </Button>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal: </span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {taxRate > 0 && (
          <div className="flex justify-between">
            <span>Tax ({taxRate}%): </span>
            <span>{formatCurrency(tax_amount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total: </span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
