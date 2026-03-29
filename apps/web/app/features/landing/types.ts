import type { ContactFormData } from "./schemas";

export type FormStep = 1 | 2 | 3;

export interface FormState {
  step: FormStep;
  data: Partial<ContactFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

export type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "UPDATE_FIELD"; field: string; value: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "RESET" };
