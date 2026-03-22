import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase auth
const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock("@craftia/auth", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
      update: mockUpdate,
    }),
  }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

// Import after mocks
const { createClientAction, updateClientAction } = await import(
  "../actions/client-actions"
);

describe("createClientAction validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockInsert.mockResolvedValue({ error: null });
  });

  it("should return validation error when name is empty", async () => {
    const result = await createClientAction({ name: "" });

    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("fieldErrors");
    expect(result.fieldErrors?.name).toBeDefined();
    // Should NOT call supabase
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid email", async () => {
    const result = await createClientAction({
      name: "John",
      email: "not-an-email",
    });

    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("fieldErrors");
    expect(result.fieldErrors?.email).toBeDefined();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid status", async () => {
    const result = await createClientAction({
      name: "John",
      status: "bogus",
    });

    expect(result).toHaveProperty("error");
    expect(result.fieldErrors?.status).toBeDefined();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should proceed to supabase when data is valid", async () => {
    await createClientAction({
      name: "John",
      email: "john@test.com",
      status: "active",
    });

    expect(mockInsert).toHaveBeenCalled();
  });
});

describe("updateClientAction validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });
  });

  it("should return validation error when name is empty", async () => {
    const result = await updateClientAction("client-1", { name: "" });

    expect(result).toHaveProperty("error");
    expect(result).toHaveProperty("fieldErrors");
    expect(result.fieldErrors?.name).toBeDefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should return validation error for invalid email", async () => {
    const result = await updateClientAction("client-1", {
      name: "John",
      email: "bad-email",
    });

    expect(result).toHaveProperty("error");
    expect(result.fieldErrors?.email).toBeDefined();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should proceed to supabase when data is valid", async () => {
    await updateClientAction("client-1", {
      name: "John",
      email: "john@test.com",
      status: "active",
    });

    expect(mockUpdate).toHaveBeenCalled();
  });
});
