"use server";

import { createServerClient } from "@craftia/auth";
import { redirect } from "next/navigation";
import { invoiceSchema } from "../schemas/invoice-schema";

interface LineItemData {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}

interface InvoiceFormData {
  invoice_number: string;
  due_date: string;
  status: string;
  notes?: string;
  client_id?: string;
  tax_rate?: string | number;
  items?: LineItemData[];
  subtotal?: string | number;
  tax_amount?: string | number;
  total?: string | number;
  [key: string]: unknown;
}

export async function createInvoiceAction(data: InvoiceFormData) {
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      error: "Validation failed",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const taxRate = Number(data.tax_rate) || 0;
  const subtotal = Number(data.subtotal) || 0;
  const taxAmount = Number(data.tax_amount) || 0;
  const total = Number(data.total) || 0;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      invoice_number: data.invoice_number,
      due_date: data.due_date,
      status: (data.status as "draft" | "sent" | "paid") || "draft",
      notes: data.notes || null,
      client_id: data.client_id || null,
      tax_rate: taxRate,
      subtotal,
      tax_amount: taxAmount,
      total,
    } as never)
    .select()
    .single();

  if (error) return { error: error.message };

  // Save line items if provided
  if (data.items && data.items.length > 0 && invoice) {
    const itemsWithInvoiceId = data.items.map((item, index) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
      sort_order: item.sort_order ?? index,
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsWithInvoiceId as never);

    if (itemsError) return { error: itemsError.message };
  }

  return { success: true };
}

export async function updateInvoiceAction(
  id: string,
  data: InvoiceFormData
) {
  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      error: "Validation failed",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const updateData: Record<string, unknown> = {
    invoice_number: data.invoice_number,
    due_date: data.due_date,
    status: (data.status as "draft" | "sent" | "paid") || "draft",
    notes: data.notes || null,
    client_id: data.client_id || null,
  };

  // Include financial fields if items are provided
  if (data.items !== undefined) {
    updateData.tax_rate = Number(data.tax_rate) || 0;
    updateData.subtotal = Number(data.subtotal) || 0;
    updateData.tax_amount = Number(data.tax_amount) || 0;
    updateData.total = Number(data.total) || 0;
  }

  const { error } = await supabase
    .from("invoices")
    .update(updateData as never)
    .eq("id", id);

  if (error) return { error: error.message };

  // Save line items if provided
  if (data.items !== undefined) {
    // Delete existing items
    const { error: deleteError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);

    if (deleteError) return { error: deleteError.message };

    // Insert new items
    if (data.items.length > 0) {
      const itemsWithInvoiceId = data.items.map((item, index) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sort_order: item.sort_order ?? index,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsWithInvoiceId as never);

      if (itemsError) return { error: itemsError.message };
    }
  }

  return { success: true };
}

export async function deleteInvoiceAction(id: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
