import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Palette, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/Logo Light Narrow.svg" alt="HackerRank" width={32} height={32} className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <Image src="/Logo Light Wide.png" alt="HackerRank" width={200} height={80} className="h-16 mx-auto mb-6" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">Campus Crew</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Be part of our dynamic team across three exciting domains. Choose your path and start your journey with us.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Technical Domain */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="h-10 w-10 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Technical</CardTitle>
              <CardDescription className="text-base">
                Build, code, & innovate with us
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Join our technical team to work on exciting projects, develop innovative solutions, and grow your programming skills.
                </p>
                <div className="pt-4">
                  <Link href="/domains/technical">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creatives Domain */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="h-10 w-10 text-purple-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Creatives</CardTitle>
              <CardDescription className="text-base">
                Design, create, and bring ideas to life
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Express your creativity through design, content creation, and multimedia projects that inspire and engage.
                </p>
                <div className="pt-4">
                  <Link href="/domains/creatives">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corporate Domain */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="h-10 w-10 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Corporate</CardTitle>
              <CardDescription className="text-base">
                Lead, manage, and drive business success
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Develop leadership skills, manage projects, and contribute to strategic business initiatives and growth.
                </p>
                <div className="pt-4">
                  <Link href="/domains/corporate">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
