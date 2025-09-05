import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/Logo Light Narrow.svg" alt="HackerRank" width={32} height={32} className="h-8" />
              <span className="text-xl font-bold text-foreground">Campus Crew</span>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-8 p-6 bg-green-500/10 rounded-full w-24 h-24 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Thank You for Your Application!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Your application has been successfully submitted. We&apos;re excited to have you join our team!
          </p>

          {/* Next Steps */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Email Confirmation</h3>
                  <p className="text-muted-foreground">
                    You&apos;ll receive a confirmation email within the next few minutes with details about your application.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Application Review</h3>
                  <p className="text-muted-foreground">
                    Our team will review your application within 3-5 business days. We&apos;ll contact you with the next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Team Assignment</h3>
                  <p className="text-muted-foreground">
                    Once approved, you&apos;ll be assigned to your domain team and receive your first tasks and project details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-3">Important Information</h3>
            <ul className="text-left text-muted-foreground space-y-2">
              <li>• Keep an eye on your email for updates and communications</li>
              <li>• Make sure to check your spam folder if you don&apos;t receive emails</li>
              <li>• You can update your application anytime by logging back in</li>
              <li>• Follow us on social media for team updates and announcements</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
