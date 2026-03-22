import { describe, it, expect } from "vitest";
import { invoiceSchema } from "../schemas/invoice-schema";

describe("invoiceSchema", () => {
  it("should pass with valid data", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "draft",
      notes: "Test notes",
      client_id: "550e8400-e29b-41d4-a716-446655440000",
      tax_rate: 16,
    });

    expect(result.success).toBe(true);
  });

  it("should pass with minimal valid data", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
    });

    expect(result.success).toBe(true);
  });

  it("should fail when invoice_number is empty", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "",
      due_date: "2026-04-01",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat.fieldErrors.invoice_number).toBeDefined();
    }
  });

  it("should fail when due_date is empty", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat.fieldErrors.due_date).toBeDefined();
    }
  });

  it("should fail with invalid status", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      status: "invalid-status",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat.fieldErrors.status).toBeDefined();
    }
  });

  it("should pass with all valid status values", () => {
    const statuses = [
      "draft",
      "sent",
      "viewed",
      "paid",
      "overdue",
      "cancelled",
    ] as const;

    for (const status of statuses) {
      const result = invoiceSchema.safeParse({
        invoice_number: "INV-001",
        due_date: "2026-04-01",
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("should default status to 'draft' when not provided", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("draft");
    }
  });

  it("should pass with empty notes string", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      notes: "",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with empty client_id string", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      client_id: "",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with valid items array", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      items: [
        { description: "Service A", quantity: 2, unit_price: 100 },
        { description: "Service B", quantity: 1, unit_price: 50 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("should fail when item has negative quantity", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      items: [{ description: "Service", quantity: -1, unit_price: 100 }],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when item has empty description", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      items: [{ description: "", quantity: 1, unit_price: 100 }],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when item has negative unit_price", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      items: [{ description: "Service", quantity: 1, unit_price: -10 }],
    });

    expect(result.success).toBe(false);
  });

  it("should pass with tax_rate as null", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      tax_rate: null,
    });

    expect(result.success).toBe(true);
  });

  it("should fail when tax_rate exceeds 100", () => {
    const result = invoiceSchema.safeParse({
      invoice_number: "INV-001",
      due_date: "2026-04-01",
      tax_rate: 101,
    });

    expect(result.success).toBe(false);
  });
});
