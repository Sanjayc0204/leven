"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useStepStore } from "../store/createCommunityStepStore";
import { Check, FileText, Layers } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Community",
    description: " ",
    icon: FileText,
  },
  {
    id: 2,
    title: "Modules",
    description: " ",
    icon: Layers,
  },
  {
    id: 3,
    title: "Finalize",
    description: " ",
    icon: Check,
  },
];

export default function ProgressiveStepper() {
  const currentStep = useStepStore((state) => state.stepData);
  const setStepLength = useStepStore((state) => state.setStepLength);
  setStepLength(steps.length);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 py-4 sticky pb-0">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <div className="mt-1 text-center">
                <p className="text-xs font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1">
                <div
                  className={cn(
                    "h-full transition-all duration-400 ease-in-out",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-6"></div>
    </div>
  );
}
