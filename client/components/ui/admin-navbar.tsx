"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"
import Image from "next/image"

interface AdminNavbarProps {
  title: string;
  onLogout?: () => void;
}

export function AdminNavbar({ title, onLogout }: AdminNavbarProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/Logo Light Narrow.svg" alt="HackerRank" width={32} height={32} className="h-8" />
          </div>
          <div className="flex-1 text-center hidden sm:block">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


