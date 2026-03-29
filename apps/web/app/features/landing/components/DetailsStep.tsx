"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ContactFormData } from "../schemas";
import type { FormAction } from "../types";

interface DetailsStepProps {
  data: Partial<ContactFormData>;
  errors: Record<string, string>;
  dispatch: React.Dispatch<FormAction>;
}

const BUDGET_OPTIONS = [
  { value: "under5k", label: "Under $5K" },
  { value: "5k-10k", label: "$5K–$10K" },
  { value: "10k-25k", label: "$10K–$25K" },
  { value: "25k-50k", label: "$25K–$50K" },
  { value: "50k+", label: "$50K+" },
] as const;

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1-2months", label: "1–2 Months" },
  { value: "3-6months", label: "3–6 Months" },
  { value: "flexible", label: "Flexible" },
] as const;

export function DetailsStep({ data, errors, dispatch }: DetailsStepProps) {
  function handleChange(field: string, value: string) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Project details</h3>
        <p className="text-sm text-muted-foreground">
          Help us understand your budget, timeline, and vision.
        </p>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <Label>
          Budget range <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {BUDGET_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange("budget", value)}
              className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                data.budget === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.budget && (
          <p className="text-xs text-destructive">{errors.budget}</p>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Label>
          Timeline <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {TIMELINE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange("timeline", value)}
              className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                data.timeline === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.timeline && (
          <p className="text-xs text-destructive">{errors.timeline}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="wizard-message">
          Tell us about your project <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="wizard-message"
          placeholder="Describe your project, goals, and any specific requirements..."
          rows={5}
          value={data.message ?? ""}
          onChange={(e) => handleChange("message", e.target.value)}
          className={errors.message ? "border-destructive" : ""}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>
    </div>
  );
}
