"use client";

import {
  Layers,
  Layout,
  Brain,
  Code,
  Smartphone,
  ShoppingCart,
  Check,
} from "lucide-react";
import type { ProjectType } from "../schemas";
import type { FormAction } from "../types";

interface ProjectTypeStepProps {
  selected: ProjectType | undefined;
  error: string | undefined;
  dispatch: React.Dispatch<FormAction>;
}

const PROJECT_TYPES: {
  value: ProjectType;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "saas", label: "SaaS Platform", icon: Layers },
  { value: "landing", label: "Landing Page", icon: Layout },
  { value: "ai", label: "AI Integration", icon: Brain },
  { value: "custom", label: "Custom Software", icon: Code },
  { value: "mobile", label: "Mobile App", icon: Smartphone },
  { value: "ecommerce", label: "E-Commerce", icon: ShoppingCart },
];

export function ProjectTypeStep({
  selected,
  error,
  dispatch,
}: ProjectTypeStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          What type of project do you need?
        </h3>
        <p className="text-sm text-muted-foreground">
          Select the category that best describes your project.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {PROJECT_TYPES.map(({ value, label, icon: Icon }) => {
          const isSelected = selected === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "projectType",
                  value,
                })
              }
              className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:scale-[1.02] ${
                isSelected
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="size-4 text-accent" />
                </div>
              )}
              <Icon
                className={`size-8 ${isSelected ? "text-accent" : "text-muted-foreground"}`}
              />
              <span
                className={`text-sm font-medium ${isSelected ? "text-accent" : "text-foreground"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
