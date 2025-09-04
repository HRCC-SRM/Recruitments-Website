"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  items: { id: string; label: string; onClick: () => void; isActive?: boolean }[]
  className?: string
}

export function AdminSidebar({ items, className }: AdminSidebarProps) {
  return (
    <div className={cn("hidden lg:block w-64 bg-card p-6", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Admin Panel</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage applications</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-all duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              item.isActive && "bg-primary text-primary-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}


