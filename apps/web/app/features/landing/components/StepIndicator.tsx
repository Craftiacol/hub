"use client";

import { Check } from "lucide-react";
import type { FormStep } from "../types";

interface StepIndicatorProps {
  currentStep: FormStep;
}

const STEPS = [
  { number: 1, label: "Project Type" },
  { number: 2, label: "Contact Info" },
  { number: 3, label: "Details" },
] as const;

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isUpcoming = currentStep < step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "border-accent bg-accent text-accent-foreground scale-100"
                    : isActive
                      ? "border-primary bg-primary text-primary-foreground scale-110"
                      : "border-muted-foreground/30 bg-transparent text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-accent"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line (except after last step) */}
            {index < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-12 rounded-full transition-colors duration-300 sm:mx-4 sm:w-20 ${
                  isCompleted
                    ? "bg-gradient-to-r from-accent to-primary"
                    : isUpcoming
                      ? "bg-muted-foreground/20"
                      : "bg-primary/40"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
