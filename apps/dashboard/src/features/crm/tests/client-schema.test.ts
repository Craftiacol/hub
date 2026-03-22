import { describe, it, expect } from "vitest";
import { clientSchema } from "../schemas/client-schema";

describe("clientSchema", () => {
  it("should pass with valid data", () => {
    const result = clientSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      company: "Acme Inc",
      phone: "+1234567890",
      status: "active",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with minimal valid data (name only)", () => {
    const result = clientSchema.safeParse({
      name: "Jane",
    });

    expect(result.success).toBe(true);
  });

  it("should fail when name is empty", () => {
    const result = clientSchema.safeParse({
      name: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat.fieldErrors.name).toBeDefined();
      expect(flat.fieldErrors.name![0]).toContain("Name is required");
    }
  });

  it("should fail when name is missing", () => {
    const result = clientSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("should fail with invalid email", () => {
    const result = clientSchema.safeParse({
      name: "John",
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat.fieldErrors.email).toBeDefined();
    }
  });

  it("should pass with empty email string", () => {
    const result = clientSchema.safeParse({
      name: "John",
      email: "",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with valid status values", () => {
    const statuses = ["lead", "active", "inactive", "churned"] as const;

    for (const status of statuses) {
      const result = clientSchema.safeParse({ name: "John", status });
      expect(result.success).toBe(true);
    }
  });

  it("should fail with invalid status", () => {
    const result = clientSchema.safeParse({
      name: "John",
      status: "invalid-status",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat.fieldErrors.status).toBeDefined();
    }
  });

  it("should default status to 'lead' when not provided", () => {
    const result = clientSchema.safeParse({ name: "John" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("lead");
    }
  });

  it("should fail when name exceeds 100 characters", () => {
    const result = clientSchema.safeParse({
      name: "A".repeat(101),
    });

    expect(result.success).toBe(false);
  });
});
