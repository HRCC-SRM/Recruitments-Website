import { corporateFormConfig } from "@/lib/form-configs"
import { corporateApplications } from "@/lib/sample-applications"
import { corporateResponses } from "@/lib/sample-responses"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Params = { params: { id: string } }

export default function CorporateApplicantResponses({ params }: Params) {
  const { id } = params
  const app = corporateApplications.find((a) => a.id === id)
  const responses = corporateResponses[id] || {}

  if (!app) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">Application not found</h1>
        <p className="text-muted-foreground mt-2">No application with id {id}.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Corporate: {app.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Reg. No: {app.registrationNumber} · Year: {app.yearOfStudy} · Branch: {app.branch}
            </p>
          </div>
          <Link href="/dashboard/corporate">
            <Button variant="outline">← Back to Admin</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {corporateFormConfig.steps.map((step) => (
          <div key={step.id} className="space-y-4">
            <h2 className="text-lg font-semibold">{step.title}</h2>
            <div className="space-y-3">
              {step.questions.map((q: any) => (
                <div key={q.id} className="border border-border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">{q.label}</div>
                  <div className="mt-1 whitespace-pre-wrap">{responses[q.id] ?? "-"}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


