"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactFormData } from "../schemas";
import type { FormAction } from "../types";

interface ContactStepProps {
  data: Partial<ContactFormData>;
  errors: Record<string, string>;
  dispatch: React.Dispatch<FormAction>;
}

export function ContactStep({ data, errors, dispatch }: ContactStepProps) {
  function handleChange(field: string, value: string) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">How can we reach you?</h3>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about yourself so we can get in touch.
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="wizard-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="wizard-name"
            placeholder="Your name"
            value={data.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="wizard-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="wizard-email"
            type="email"
            placeholder="you@example.com"
            value={data.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Company (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="wizard-company">Company (optional)</Label>
          <Input
            id="wizard-company"
            placeholder="Your company name"
            value={data.company ?? ""}
            onChange={(e) => handleChange("company", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
