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
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CorporateForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const steps = corporateFormConfig.steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    isCompleted: false, // This would be calculated based on saved data
    isCurrent: index === currentStep
  }))

  const currentStepConfig = corporateFormConfig.steps[currentStep]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const responses: Record<string, string> = {}
      Object.keys(formData).forEach((key) => {
        if (![
          'name','personalEmail','phone','srmEmail','registrationNumber','branch','yearOfStudy'
        ].includes(key)) {
          const val = formData[key]
          if (val !== undefined && val !== null && val !== '') responses[key] = String(val)
        }
      })

      await apiClient.registerUser({
        name: formData.name as string,
        email: formData.personalEmail as string,
        phone: formData.phone as string,
        srmEmail: formData.srmEmail as string,
        regNo: formData.registrationNumber as string,
        branch: formData.branch as string,
        department: formData.department as string,
        yearOfStudy: Number(formData.yearOfStudy),
        domain: "Corporates",
        linkedinLink: formData.linkedinLink as string || undefined,
        responses,
      })

      router.push('/thank-you')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Validate current step before proceeding
  const validateCurrentStep = () => {
    const currentStepQuestions = currentStepConfig.questions
    const requiredQuestions = currentStepQuestions.filter(q => q.required)
    
    for (const question of requiredQuestions) {
      const value = formData[question.id]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setError("Please fill in all required fields before proceeding to the next step.")
      return
    }
    
    if (currentStep < corporateFormConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setError("") // Clear any previous errors
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setError("") // Clear any previous errors
    }
  }

  const handleStepClick = (stepIndex: number) => {
    // Only allow going to previous steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
      setError("") // Clear any previous errors
    } else {
      setError("Please complete the current step before proceeding to the next step.")
    }
  }

  const renderQuestion = (question: { id: string; label: string; type: string; placeholder?: string; required: boolean; inputType?: string; pattern?: string; options?: Array<{ label: string; value: string | number }> }) => {
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
            {(question.options || []).map((opt: { label: string; value: string | number }) => (
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
              <Image src="/Logo Light Narrow.svg" alt="HackerRank" width={32} height={32} className="h-8" />
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

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md mb-4">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStepConfig.id === "your-details" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Inject Name and SRM Email fields required by backend */}
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label htmlFor="srmEmail">SRMIST Email *</Label>
                      <Input id="srmEmail" name="srmEmail" value={formData.srmEmail || ''} onChange={handleChange} required className="mt-1" placeholder="your.name@srmist.edu.in" />
                    </div>
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
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg w-full sm:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
