"use server";

import { contactFormSchema } from "./schemas";

interface ContactFormState {
  success: boolean;
  message: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    projectType: formData.get("projectType"),
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    budget: formData.get("budget"),
    timeline: formData.get("timeline"),
    message: formData.get("message"),
  };

  const result = contactFormSchema.safeParse(raw);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Invalid form data.";
    return { success: false, message: firstError };
  }

  // TODO: Replace with actual email service or database insert
  console.log("Contact form submission:", result.data);

  return {
    success: true,
    message: "Message sent! We'll get back to you within 24 hours.",
  };
}
