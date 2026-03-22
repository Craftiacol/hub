import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../services/invoice-service";

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();

vi.mock("@craftia/db", () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    }),
  }),
}));

describe("Invoice Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockReturnValue({ select: () => ({ single: mockSingle }) });
    mockSingle.mockResolvedValue({ data: { id: "1", invoice_number: "INV-001" }, error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: () => ({ single: mockSingle }) });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  describe("getInvoices", () => {
    it("should return a list of invoices", async () => {
      const invoices = [
        { id: "1", invoice_number: "INV-001", status: "draft", total: 1000 },
        { id: "2", invoice_number: "INV-002", status: "sent", total: 2500 },
      ];
      mockOrder.mockResolvedValue({ data: invoices, error: null });
      const result = await getInvoices();
      expect(result).toEqual(invoices);
    });

    it("should throw on error", async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });
      await expect(getInvoices()).rejects.toThrow("DB error");
    });
  });

  describe("getInvoiceById", () => {
    it("should return a single invoice", async () => {
      const invoice = { id: "1", invoice_number: "INV-001" };
      mockSelect.mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: invoice, error: null }) }) });
      const result = await getInvoiceById("1");
      expect(result).toEqual(invoice);
    });
  });

  describe("createInvoice", () => {
    it("should create and return a new invoice", async () => {
      const result = await createInvoice({ invoice_number: "INV-003", due_date: "2026-04-01", total: 500 });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("invoice_number", "INV-001");
    });
  });

  describe("updateInvoice", () => {
    it("should update and return the invoice", async () => {
      mockEq.mockReturnValue({ select: () => ({ single: vi.fn().mockResolvedValue({ data: { id: "1", status: "sent" }, error: null }) }) });
      const result = await updateInvoice("1", { status: "sent" });
      expect(result).toHaveProperty("status", "sent");
    });
  });

  describe("deleteInvoice", () => {
    it("should delete without error", async () => {
      await expect(deleteInvoice("1")).resolves.not.toThrow();
    });
  });
});
