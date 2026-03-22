import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit_price: z.number().min(0, "Price must be non-negative"),
});

export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  due_date: z.string().min(1, "Due date is required"),
  status: z
    .enum(["draft", "sent", "viewed", "paid", "overdue", "cancelled"])
    .default("draft"),
  notes: z.string().optional().or(z.literal("")),
  client_id: z.string().uuid().optional().or(z.literal("")),
  tax_rate: z.number().min(0).max(100).optional().nullable(),
  items: z.array(invoiceItemSchema).optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
