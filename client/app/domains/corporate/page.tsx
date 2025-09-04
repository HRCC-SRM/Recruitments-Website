"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProgressSidebar } from "@/components/ui/progress-sidebar"
import { corporateFormConfig } from "@/lib/form-configs"
import { Building2, ArrowLeft, LogOut, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function CorporateForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const steps = corporateFormConfig.steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    isCompleted: false, // This would be calculated based on saved data
    isCurrent: index === currentStep
  }))

  const currentStepConfig = corporateFormConfig.steps[currentStep]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the data to your backend
    // After successful submission, redirect to thank you page
    window.location.href = "/thank-you"
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNext = () => {
    if (currentStep < corporateFormConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const renderQuestion = (question: any) => {
    const commonProps = {
      id: question.id,
      name: question.id,
      value: formData[question.id] || "",
      onChange: handleChange,
      required: question.required,
      className: "mt-1",
      placeholder: question.placeholder
    }

    if (question.type === "input") {
      return <Input {...commonProps} type={question.inputType || "text"} pattern={question.pattern} />
    } else if (question.type === "textarea") {
      return <Textarea {...commonProps} rows={4} />
    } else if (question.type === "select") {
      return (
        <div className="relative mt-1">
          <select
            id={question.id}
            name={question.id}
            value={formData[question.id] || ""}
            onChange={handleChange}
            required={question.required}
            className="h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-ring hover:border-foreground/30 transition-colors"
          >
            <option value="" disabled>
              Select an option
            </option>
            {(question.options || []).map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/Logo Light Narrow.svg" alt="HackerRank" className="h-8" />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-64px)]">
        {/* Full-height divider under navbar (lg+) */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-64 w-px bg-border" aria-hidden />
        {/* Progress Sidebar */}
        <div className="lg:w-64 flex flex-col h-full">
          <ProgressSidebar
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            className="lg:block"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 p-4 bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Corporate Domain Application</h1>
                <p className="text-muted-foreground mt-2">{currentStepConfig.title}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStepConfig.id === "your-details" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentStepConfig.questions.map((question) => (
                      <div key={question.id}>
                        <Label htmlFor={question.id}>
                          {question.label} {question.required && "*"}
                        </Label>
                        {renderQuestion(question)}
                      </div>
                    ))}
                  </div>
                ) : (
                  currentStepConfig.questions.map((question) => (
                    <div key={question.id}>
                      <Label htmlFor={question.id}>
                        {question.label} {question.required && "*"}
                      </Label>
                      {renderQuestion(question)}
                    </div>
                  ))
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center order-2 sm:order-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-4 order-1 sm:order-2">
                    {currentStep < corporateFormConfig.steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-green-600 hover:bg-green-700 flex items-center w-full sm:w-auto"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg w-full sm:w-auto">
                        Submit Application
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
