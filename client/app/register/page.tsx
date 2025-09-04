"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    srmEmail: "",
    regNo: "",
    branch: "",
    yearOfStudy: 1,
    domain: "Technical",
    linkedinLink: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      await apiClient.registerUser(formData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/thank-you')
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
    if (error) {
      setError("")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <img src="/Logo Light Wide.png" alt="HackerRank" className="mx-auto mb-6" />
          </div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Join HRCC</CardTitle>
              <CardDescription>
                Register for HackerRank Campus Crew recruitment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-medium mb-2">Registration Successful!</div>
                  <p className="text-muted-foreground">Redirecting to thank you page...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Personal Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="srmEmail">SRMIST Email</Label>
                    <Input
                      id="srmEmail"
                      name="srmEmail"
                      type="email"
                      value={formData.srmEmail}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="your.name@srmist.edu.in"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="9999999999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="regNo">Registration Number</Label>
                    <Input
                      id="regNo"
                      name="regNo"
                      value={formData.regNo}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="RA123456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="CSE, IT, ECE, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearOfStudy">Year of Study</Label>
                    <select
                      id="yearOfStudy"
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <select
                      id="domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Creative">Creative</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="linkedinLink">LinkedIn Profile (Optional)</Label>
                    <Input
                      id="linkedinLink"
                      name="linkedinLink"
                      type="url"
                      value={formData.linkedinLink}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Admin login?{" "}
                      <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
