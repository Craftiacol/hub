import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../services/client-service";

// Mock Supabase client
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

describe("Client Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockReturnValue({
      select: () => ({ single: mockSingle }),
    });
    mockSingle.mockResolvedValue({
      data: { id: "1", name: "Test" },
      error: null,
    });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: () => ({ single: mockSingle }) });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  describe("getClients", () => {
    it("should return a list of clients", async () => {
      const clients = [
        { id: "1", name: "Client A", status: "active" },
        { id: "2", name: "Client B", status: "lead" },
      ];
      mockOrder.mockResolvedValue({ data: clients, error: null });

      const result = await getClients();
      expect(result).toEqual(clients);
    });

    it("should throw on error", async () => {
      mockOrder.mockResolvedValue({
        data: null,
        error: { message: "DB error" },
      });
      await expect(getClients()).rejects.toThrow("DB error");
    });
  });

  describe("getClientById", () => {
    it("should return a single client", async () => {
      const client = { id: "1", name: "Client A" };
      mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: client, error: null }),
        }),
      });

      const result = await getClientById("1");
      expect(result).toEqual(client);
    });
  });

  describe("createClient", () => {
    it("should create and return a new client", async () => {
      const newClient = {
        name: "New Client",
        email: "new@test.com",
        status: "lead" as const,
      };
      const result = await createClient(newClient);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name", "Test");
    });
  });

  describe("updateClient", () => {
    it("should update and return the client", async () => {
      mockEq.mockReturnValue({
        select: () => ({
          single: vi.fn().mockResolvedValue({
            data: { id: "1", name: "Updated" },
            error: null,
          }),
        }),
      });
      const result = await updateClient("1", { name: "Updated" });
      expect(result).toHaveProperty("name", "Updated");
    });
  });

  describe("deleteClient", () => {
    it("should delete without error", async () => {
      await expect(deleteClient("1")).resolves.not.toThrow();
    });
  });
});
