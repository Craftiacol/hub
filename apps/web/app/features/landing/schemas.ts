import { z } from "zod";

// Step 1: Project type
export const projectTypeSchema = z.object({
  projectType: z.enum(
    ["saas", "landing", "ai", "custom", "mobile", "ecommerce"],
    {
      message: "Please select a project type",
    }
  ),
});

// Step 2: Contact info
export const contactInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
});

// Step 3: Project details
export const projectDetailsSchema = z.object({
  budget: z.enum(["under5k", "5k-10k", "10k-25k", "25k-50k", "50k+"], {
    message: "Please select a budget range",
  }),
  timeline: z.enum(["asap", "1-2months", "3-6months", "flexible"], {
    message: "Please select a timeline",
  }),
  message: z
    .string()
    .min(10, "Please describe your project (at least 10 characters)"),
});

// Full form schema (all steps combined)
export const contactFormSchema = projectTypeSchema
  .merge(contactInfoSchema)
  .merge(projectDetailsSchema);

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProjectType = z.infer<typeof projectTypeSchema>["projectType"];
