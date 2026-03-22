import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  status: z.enum(["lead", "active", "inactive", "churned"]).default("lead"),
});

export type ClientFormData = z.infer<typeof clientSchema>;
