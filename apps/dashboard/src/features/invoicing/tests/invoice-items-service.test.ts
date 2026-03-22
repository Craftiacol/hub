import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getInvoiceItems,
  createInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
  bulkSaveInvoiceItems,
} from "../services/invoice-items-service";

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

describe("Invoice Items Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: vi.fn().mockReturnValue({ order: mockOrder }) });
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockReturnValue({ select: () => ({ single: mockSingle }) });
    mockSingle.mockResolvedValue({
      data: { id: "item-1", description: "Design work", quantity: 1, unit_price: 100, total: 100 },
      error: null,
    });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: () => ({ single: mockSingle }) });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  describe("getInvoiceItems", () => {
    it("should return items for a given invoice ordered by sort_order", async () => {
      const items = [
        { id: "item-1", description: "Design", quantity: 2, unit_price: 50, total: 100, sort_order: 0 },
        { id: "item-2", description: "Dev", quantity: 1, unit_price: 200, total: 200, sort_order: 1 },
      ];
      mockOrder.mockResolvedValue({ data: items, error: null });
      const result = await getInvoiceItems("inv-1");
      expect(result).toEqual(items);
    });

    it("should throw on error", async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });
      await expect(getInvoiceItems("inv-1")).rejects.toThrow("DB error");
    });
  });

  describe("createInvoiceItem", () => {
    it("should create and return a new invoice item", async () => {
      const result = await createInvoiceItem("inv-1", {
        description: "Design work",
        quantity: 1,
        unit_price: 100,
        total: 100,
      });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("description", "Design work");
    });
  });

  describe("updateInvoiceItem", () => {
    it("should update and return the item", async () => {
      mockEq.mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({
            data: { id: "item-1", description: "Updated", quantity: 2, unit_price: 100, total: 200 },
            error: null,
          }),
        }),
      });
      const result = await updateInvoiceItem("item-1", { description: "Updated", quantity: 2, total: 200 });
      expect(result).toHaveProperty("description", "Updated");
    });
  });

  describe("deleteInvoiceItem", () => {
    it("should delete without error", async () => {
      await expect(deleteInvoiceItem("item-1")).resolves.not.toThrow();
    });
  });

  describe("bulkSaveInvoiceItems", () => {
    it("should delete existing items and insert new ones", async () => {
      // Setup: delete returns eq which resolves, insert resolves
      mockEq.mockResolvedValue({ error: null });
      mockInsert.mockResolvedValue({ error: null });

      const items = [
        { description: "Item 1", quantity: 1, unit_price: 100, total: 100, sort_order: 0 },
        { description: "Item 2", quantity: 2, unit_price: 50, total: 100, sort_order: 1 },
      ];

      await expect(bulkSaveInvoiceItems("inv-1", items)).resolves.not.toThrow();
    });

    it("should throw when delete fails", async () => {
      mockEq.mockResolvedValue({ error: { message: "Delete failed" } });

      await expect(
        bulkSaveInvoiceItems("inv-1", [{ description: "Item", quantity: 1, unit_price: 100, total: 100, sort_order: 0 }])
      ).rejects.toThrow("Delete failed");
    });

    it("should throw when insert fails", async () => {
      mockEq.mockResolvedValue({ error: null });
      mockInsert.mockResolvedValue({ error: { message: "Insert failed" } });

      await expect(
        bulkSaveInvoiceItems("inv-1", [{ description: "Item", quantity: 1, unit_price: 100, total: 100, sort_order: 0 }])
      ).rejects.toThrow("Insert failed");
    });
  });
});
