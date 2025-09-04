import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressStep {
  id: string
  title: string
  isCompleted: boolean
  isCurrent: boolean
}

interface ProgressSidebarProps {
  steps: ProgressStep[]
  currentStep: number
  onStepClick: (stepIndex: number) => void
  className?: string
}

export function ProgressSidebar({ steps, currentStep, onStepClick, className }: ProgressSidebarProps) {
  return (
    <>
      {/* Mobile Progress Bar */}
      <div className="lg:hidden bg-card border-b border-border p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground">Application Progress</h3>
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Step Indicators */}
        <div className="grid grid-cols-3 gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepClick(index)}
              className={cn(
                "flex flex-col items-center space-y-1 text-xs p-2 rounded-lg transition-all",
                step.isCurrent && "bg-primary/10 text-primary font-medium",
                step.isCompleted && !step.isCurrent && "bg-green-500/10 text-green-600",
                !step.isCompleted && !step.isCurrent && "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2",
                step.isCurrent && "bg-primary text-primary-foreground border-primary",
                step.isCompleted && !step.isCurrent && "bg-green-500 text-white border-green-500",
                !step.isCompleted && !step.isCurrent && "bg-muted text-muted-foreground border-muted-foreground"
              )}>
                {step.isCompleted ? "✓" : index + 1}
              </div>
              <span className="text-center font-medium leading-tight">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (no border; divider handled by page) */}
      <div className={cn("hidden lg:block w-64 bg-card p-6", className)}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Application Progress</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepClick(index)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                step.isCurrent && "bg-primary text-primary-foreground",
                step.isCompleted && !step.isCurrent && "bg-green-500/10 text-green-600",
                !step.isCompleted && !step.isCurrent && "bg-muted/50 text-muted-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  step.isCurrent && "bg-primary-foreground text-primary",
                  step.isCompleted && !step.isCurrent && "bg-green-500 text-white",
                  !step.isCompleted && !step.isCurrent && "bg-muted text-muted-foreground"
                )}>
                  {step.isCompleted ? "✓" : index + 1}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
