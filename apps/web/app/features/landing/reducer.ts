import {
  projectTypeSchema,
  contactInfoSchema,
  projectDetailsSchema,
} from "./schemas";
import type { FormState, FormAction, FormStep } from "./types";

export const initialFormState: FormState = {
  step: 1,
  data: {},
  errors: {},
  isSubmitting: false,
};

/**
 * Validates the current step data against the corresponding Zod schema.
 * Returns an errors record (empty if valid).
 */
function validateStep(
  step: FormStep,
  data: FormState["data"]
): Record<string, string> {
  const schemas = {
    1: projectTypeSchema,
    2: contactInfoSchema,
    3: projectDetailsSchema,
  } as const;

  const schema = schemas[step];
  const result = schema.safeParse(data);

  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && typeof field === "string") {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "NEXT_STEP": {
      const errors = validateStep(state.step, state.data);
      if (Object.keys(errors).length > 0) {
        return { ...state, errors };
      }
      return {
        ...state,
        step: Math.min(state.step + 1, 3) as FormStep,
        errors: {},
      };
    }

    case "PREV_STEP": {
      return {
        ...state,
        step: Math.max(state.step - 1, 1) as FormStep,
        errors: {},
      };
    }

    case "UPDATE_FIELD": {
      const { field, value } = action;
      const newErrors = { ...state.errors };
      delete newErrors[field];
      return {
        ...state,
        data: { ...state.data, [field]: value },
        errors: newErrors,
      };
    }

    case "SET_ERRORS": {
      return { ...state, errors: action.errors };
    }

    case "RESET": {
      return initialFormState;
    }

    default:
      return state;
  }
}
