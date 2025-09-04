"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ContactSupport() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the contact form data to your backend
    alert("Thank you for your message! We'll get back to you within 24 hours.")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/Logo Light Narrow.svg" alt="HackerRank" className="h-8" />
              <span className="text-xl font-bold text-foreground">Campus Crew</span>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Support</h1>
            <p className="text-xl text-muted-foreground">
              Need help? We're here to assist you with any questions or concerns.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      className="mt-1"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      className="mt-1"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                    placeholder="your.email@srmist.edu.in"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    className="mt-1"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
                  >
                    <option value="">Select a category</option>
                    <option value="application">Application Issues</option>
                    <option value="technical">Technical Problems</option>
                    <option value="general">General Questions</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="mt-1"
                    placeholder="Please describe your issue or question in detail..."
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-6">
                  Have questions about the recruitment process, need technical support, or want to provide feedback? 
                  We're here to help! Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                    <p className="text-muted-foreground mb-2">
                      For general inquiries and support
                    </p>
                    <a 
                      href="mailto:support@hackerrank-campus-crew.com" 
                      className="text-primary hover:underline"
                    >
                      support@hackerrank-campus-crew.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Phone className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone Support</h3>
                    <p className="text-muted-foreground mb-2">
                      Available during business hours
                    </p>
                    <a 
                      href="tel:+91-XXXXXXXXXX" 
                      className="text-primary hover:underline"
                    >
                      +91-XXXXXXXXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Location</h3>
                    <p className="text-muted-foreground mb-2">
                      SRM Institute of Science and Technology
                    </p>
                    <p className="text-muted-foreground">
                      Kattankulathur, Chennai, Tamil Nadu 603203
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary">
                      How long does the application review take?
                    </summary>
                    <p className="text-sm text-muted-foreground mt-2 pl-4">
                      Applications are typically reviewed within 3-5 business days. You'll receive an email notification once the review is complete.
                    </p>
                  </details>
                  
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary">
                      Can I apply to multiple domains?
                    </summary>
                    <p className="text-sm text-muted-foreground mt-2 pl-4">
                      Currently, you can only apply to one domain at a time. Choose the domain that best matches your skills and interests.
                    </p>
                  </details>
                  
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary">
                      What if I don't receive confirmation emails?
                    </summary>
                    <p className="text-sm text-muted-foreground mt-2 pl-4">
                      Check your spam folder first. If you still don't receive emails, contact us and we'll help you troubleshoot the issue.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
