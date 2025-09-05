"use client"

import { useEffect, useState } from "react"
import { technicalFormConfig } from "@/lib/form-configs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { apiClient, User } from "@/lib/api"

export default function TechnicalApplicantResponses() {
  const params = useParams()
  const id = (params?.id as string) || ""
  const [user, setUser] = useState<User | null>(null)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!id) return
      setLoading(true)
      setError("")
      try {
        const res = await apiClient.getTechnicalUser(id)
        if (cancelled) return
        setUser(res.user)
        setResponses(res.user.responses || {})
      } catch (e: unknown) {
        if (cancelled) return
        const errorMessage = e instanceof Error ? e.message : "Failed to load application";
        setError(errorMessage)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id])

  if (!id || (!loading && !user)) {
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
            <h1 className="text-2xl font-bold">Technical: {user?.name || "..."}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Reg. No: {user?.regNo || "-"} · Year: {user?.yearOfStudy || "-"} · Branch: {user?.branch || "-"}
            </p>
          </div>
          <Link href="/dashboard/technical">
            <Button variant="outline">← Back to Admin</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{error}</div>
        )}
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          technicalFormConfig.steps.map((step) => {
            // Filter questions for basic-info by user's yearOfStudy
            const questions = step.id === "basic-info"
              ? step.questions.filter((q: { showForYears?: number[] }) => !q.showForYears || q.showForYears.includes(Number(user?.yearOfStudy)))
              : step.questions
            
            const valueFromUser = (qid: string): string | number | undefined => {
              if (!user) return undefined
              const map: Record<string, string | number | undefined> = {
                name: user.name,
                email: user.email,
                srmEmail: user.srmEmail,
                phone: user.phone,
                regNo: user.regNo,
                branch: user.branch,
                yearOfStudy: user.yearOfStudy,
                linkedinLink: user.linkedinLink,
              }
              return map[qid]
            }

            return (
            <div key={step.id} className="space-y-4">
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <div className="space-y-3">
                {questions.map((q: { id: string; label: string; type: string; options?: Array<{ label: string; value: string | number }> }) => (
                  <div key={q.id} className="border border-border rounded-md p-4">
                    <div className="text-sm text-muted-foreground">{q.label}</div>
                    <div className="mt-1 whitespace-pre-wrap">{String(responses[q.id] ?? valueFromUser(q.id) ?? "-")}</div>
                  </div>
                ))}
              </div>
            </div>
            )
          })
        )}
      </div>
    </div>
  )
}


