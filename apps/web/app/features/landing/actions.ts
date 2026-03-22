"use server";

interface ContactFormState {
  success: boolean;
  message: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, message: "All fields are required." };
  }

  // TODO: Replace with actual email service or database insert
  console.log("Contact form submission:", { name, email, message });

  return { success: true, message: "Message sent! We will get back to you soon." };
}
