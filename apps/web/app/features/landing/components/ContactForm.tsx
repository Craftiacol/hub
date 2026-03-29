"use client";

import { useReducer, useActionState } from "react";
import { ArrowLeft, ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/app/features/landing/actions";
import { formReducer, initialFormState } from "../reducer";
import { StepIndicator } from "./StepIndicator";
import { ProjectTypeStep } from "./ProjectTypeStep";
import { ContactStep } from "./ContactStep";
import { DetailsStep } from "./DetailsStep";
import { projectDetailsSchema } from "../schemas";
import type { ProjectType } from "../schemas";

export function ContactForm() {
  const [form, dispatch] = useReducer(formReducer, initialFormState);

  const [serverState, formAction, isPending] = useActionState(
    submitContactForm,
    { success: false, message: "" }
  );

  function handleNext() {
    if (form.step < 3) {
      dispatch({ type: "NEXT_STEP" });
    }
  }

  function handleBack() {
    dispatch({ type: "PREV_STEP" });
  }

  function handleSubmit() {
    // Validate step 3 inline (reducer dispatch is async from our perspective)
    const result = projectDetailsSchema.safeParse(form.data);
    if (!result.success) {
      // Show errors via reducer
      dispatch({ type: "NEXT_STEP" });
      return;
    }

    // Build FormData and submit via server action
    const formData = new FormData();
    for (const [key, value] of Object.entries(form.data)) {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    }
    formAction(formData);
  }

  // Success state
  if (serverState.success) {
    return (
      <div
        className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center"
        style={{ animation: "fade-in-up 0.5s ease-out" }}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="size-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold">Message sent!</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. We&apos;ll get back to you within 24
          hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: "RESET" });
            // Reset server state by reloading — or we can just show the form
            window.location.hash = "#contact";
            window.location.reload();
          }}
          className="mt-2"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {/* Step indicator */}
      <StepIndicator currentStep={form.step} />

      {/* Step content */}
      <div
        key={form.step}
        className="mt-8"
        style={{ animation: "fade-in-up 0.35s ease-out" }}
      >
        {form.step === 1 && (
          <ProjectTypeStep
            selected={form.data.projectType as ProjectType | undefined}
            error={form.errors.projectType}
            dispatch={dispatch}
          />
        )}

        {form.step === 2 && (
          <ContactStep
            data={form.data}
            errors={form.errors}
            dispatch={dispatch}
          />
        )}

        {form.step === 3 && (
          <DetailsStep
            data={form.data}
            errors={form.errors}
            dispatch={dispatch}
          />
        )}
      </div>

      {/* Server error */}
      {serverState.message && !serverState.success && (
        <p className="mt-4 text-center text-sm text-destructive">
          {serverState.message}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {form.step > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        ) : (
          <div /> /* Spacer */
        )}

        {form.step < 3 ? (
          <Button type="button" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="gradient-bg text-white"
          >
            {isPending ? (
              "Sending..."
            ) : (
              <>
                Submit
                <Send className="ml-2 size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
