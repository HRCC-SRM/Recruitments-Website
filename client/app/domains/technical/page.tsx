"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProgressSidebar } from "@/components/ui/progress-sidebar"
import { technicalFormConfig } from "@/lib/form-configs"
import { Code, ArrowLeft, LogOut, ChevronLeft, ChevronRight, ChevronDown, CheckCircle } from "lucide-react"

// Import the Question type
type Question = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  inputType?: string;
  pattern?: string;
  options?: Array<{ label: string; value: string | number }>;
  showForYears?: number[];
}
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function TechnicalForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  const steps = technicalFormConfig.steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    isCompleted: index < currentStep,
    isCurrent: index === currentStep
  }))

  const currentStepConfig = technicalFormConfig.steps[currentStep]

  // Filter questions based on year of study for basic-info step
  const getFilteredQuestions = () => {
    if (currentStepConfig.id === "basic-info") {
      const selectedYear = formData.yearOfStudy as number
      
      // If no year is selected yet, show all questions
      if (!selectedYear) {
        return currentStepConfig.questions
      }
      
      const filtered = currentStepConfig.questions.filter(question => {
        if (!question.showForYears) return true // Show all questions without year filter
        return question.showForYears.includes(Number(selectedYear))
      })
      return filtered
    }
    return currentStepConfig.questions
  }

  const filteredQuestions = getFilteredQuestions()
  


  // Clear form data for questions that are no longer relevant when year changes
  useEffect(() => {
    if (currentStepConfig.id === "basic-info" && formData.yearOfStudy) {
      const selectedYear = formData.yearOfStudy as number
      
      // Remove data for questions that shouldn't be shown for this year
      const questionsToRemove = currentStepConfig.questions.filter(question => {
        if (!question.showForYears) return false
        return !question.showForYears.includes(selectedYear)
      })
      
      if (questionsToRemove.length > 0) {
        setFormData(prevFormData => {
          const updatedFormData = { ...prevFormData }
          questionsToRemove.forEach(question => {
            delete updatedFormData[question.id]
          })
          return updatedFormData
        })
      }
    }
  }, [formData.yearOfStudy, currentStep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      // Prepare data for backend API
      const registrationData = {
        name: formData.name as string,
        email: formData.email as string,
        phone: formData.phone as string,
        srmEmail: formData.srmEmail as string,
        regNo: formData.regNo as string,
        branch: formData.branch as string,
        yearOfStudy: formData.yearOfStudy as number,
        domain: "Technical",
        linkedinLink: formData.linkedinLink as string || undefined
      }
      
      await apiClient.registerUser(registrationData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/thank-you')
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
    if (error) {
      setError("")
    }
  }

  const handleNext = () => {
    if (currentStep < technicalFormConfig.steps.length - 1) {
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

  const renderQuestion = (question: Question) => {
    const commonProps = {
      id: question.id,
      name: question.id,
      value: formData[question.id] || "",
      onChange: handleChange,
      required: question.required,
      className: "mt-1",
      placeholder: question.placeholder || ""
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
                <div className="mx-auto mb-4 p-4 bg-blue-500/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Code className="h-8 w-8 text-blue-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Technical Domain Application</h1>
                <p className="text-muted-foreground mt-2">{currentStepConfig.title}</p>
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md mb-6">
                  {error}
                </div>
              )}

              {success ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 p-4 bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="text-green-600 text-lg font-medium mb-2">Application Submitted Successfully!</div>
                  <p className="text-muted-foreground">Redirecting to thank you page...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStepConfig.id === "application-review" ? (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-semibold mb-4">Review Your Application</h3>
                        <p className="text-muted-foreground">
                          Please review all the information you've provided before submitting your application.
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                        <h4 className="font-semibold text-lg">Your Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-medium">{formData.name || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Personal Email:</span>
                            <p className="font-medium">{formData.email || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">SRMIST Email:</span>
                            <p className="font-medium">{formData.srmEmail || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <p className="font-medium">{formData.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Registration Number:</span>
                            <p className="font-medium">{formData.regNo || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Branch:</span>
                            <p className="font-medium">{formData.branch || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Year of Study:</span>
                            <p className="font-medium">{formData.yearOfStudy ? `Year ${formData.yearOfStudy}` : "Not provided"}</p>
                          </div>
                          {formData.linkedinLink && (
                            <div>
                              <span className="text-muted-foreground">LinkedIn:</span>
                              <p className="font-medium">
                                <a href={formData.linkedinLink as string} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                  View Profile
                                </a>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                        <h4 className="font-semibold text-lg">Technical Information</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Programming Languages:</span>
                            <p className="font-medium">{formData.programmingLanguages || "Not provided"}</p>
                          </div>
                          {formData.frameworks && (
                            <div>
                              <span className="text-muted-foreground">Frameworks & Technologies:</span>
                              <p className="font-medium">{formData.frameworks}</p>
                            </div>
                          )}
                          {formData.experience && (
                            <div>
                              <span className="text-muted-foreground">Experience:</span>
                              <p className="font-medium">{formData.experience}</p>
                            </div>
                          )}
                          {formData.learningStyle && (
                            <div>
                              <span className="text-muted-foreground">Learning Style:</span>
                              <p className="font-medium">{formData.learningStyle}</p>
                            </div>
                          )}
                          {formData.challenges && (
                            <div>
                              <span className="text-muted-foreground">Challenging Problem Solved:</span>
                              <p className="font-medium">{formData.challenges}</p>
                            </div>
                          )}
                          {formData.projects && (
                            <div>
                              <span className="text-muted-foreground">Projects:</span>
                              <p className="font-medium">{formData.projects}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Why Join Technical Team:</span>
                            <p className="font-medium">{formData.whyJoin || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentStepConfig.id === "your-details" ? (
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
                    <div className="space-y-6">
                      {filteredQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No questions available for the selected year.</p>
                          <p className="text-sm mt-2">Please go back and select your year of study.</p>
                        </div>
                      ) : (
                        filteredQuestions.map((question) => (
                          <div key={question.id}>
                            <Label htmlFor={question.id}>
                              {question.label} {question.required && "*"}
                            </Label>
                            {renderQuestion(question)}
                          </div>
                        ))
                      )}
                    </div>
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
                      {currentStep < technicalFormConfig.steps.length - 1 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center w-full sm:w-auto"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg w-full sm:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
