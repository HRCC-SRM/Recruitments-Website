"use client"

import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { AdminNavbar } from "@/components/ui/admin-navbar"
import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient, User } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useDebounce } from "@/lib/hooks/useDebounce"

export default function CorporateAdminDashboard() {
  const [query, setQuery] = useState("")
  const [applications, setApplications] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  
  const { logout } = useAuth()
  const router = useRouter()
  
  // Debounce the query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 2000)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  // Use ref to track if a request is already in progress
  const requestInProgress = useRef(false)
  const lastFetchParams = useRef<string>("")
  const fetchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Memoized fetch function to prevent recreation
  const fetchApplications = useCallback(async () => {
    if (requestInProgress.current) return
    
    const params = JSON.stringify({
      page: currentPage,
      status: statusFilter,
      search: debouncedQuery
    })
    
    // Skip if same params as last fetch
    if (lastFetchParams.current === params) return
    
    requestInProgress.current = true
    lastFetchParams.current = params
    
    try {
      setLoading(true)
      const response = await apiClient.getCorporateUsers({
        page: currentPage,
        limit: 50,
        status: statusFilter || undefined,
        search: debouncedQuery || undefined
      })
      
      setApplications(response.users)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch applications';
      setError(errorMessage)
    } finally {
      setLoading(false)
      requestInProgress.current = false
    }
  }, [currentPage, statusFilter, debouncedQuery])

  // SIMPLE useEffect with manual throttling
  useEffect(() => {
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }
    
    // Set a new timeout to fetch data
    fetchTimeoutRef.current = setTimeout(() => {
      fetchApplications()
    }, 100) // Small delay to batch rapid changes
    
    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [fetchApplications])

  const [sortBy, setSortBy] = useState<keyof User | "">("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const sorted = useMemo(() => {
    const data = [...applications]
    if (!sortBy) return data
    return data.sort((a, b) => {
      const av = (a[sortBy] ?? "").toString().toLowerCase()
      const bv = (b[sortBy] ?? "").toString().toLowerCase()
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [applications, sortBy, sortDir])

  const handleSort = (key: keyof User) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(key)
      setSortDir("asc")
    }
  }

  const [selected, setSelected] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [localStatus, setLocalStatus] = useState<User["status"] | undefined>(undefined)

  useEffect(() => {
    if (selected) {
      setLocalStatus(selected.status)
    }
  }, [selected])

  const changeStatus = async (newStatus: 'active' | 'shortlisted' | 'rejected' | 'holded' | 'omitted') => {
    if (!selected) return
    try {
      setUpdatingStatus(true)
      const res = await apiClient.updateCorporateUserStatus(selected.id, { status: newStatus })
      setApplications((prev) => prev.map((u) => (u.id === selected.id ? { ...u, status: res.user.status } : u)))
      setSelected((prev) => (prev ? { ...prev, status: res.user.status } : prev))
      setLocalStatus(res.user.status)
    } catch (e) {
      console.error(e)
      alert("Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const exportCsv = () => {
    const headers = [
      "name",
      "id",
      "regNo",
      "srmEmail",
      "email",
      "phone",
      "yearOfStudy",
      "branch",
      "domain",
      "status"
    ]
    const rows = applications.map((a) =>
      headers
        .map((h) => {
          const value = (a as unknown as Record<string, unknown>)[h] ?? ""
          const str = String(value).replaceAll('"', '""')
          return `"${str}"`
        })
        .join(",")
    )
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "corporate_applications.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute requiredRole="corporate_lead" allowedDomains={["corporate"]}>
      <div className="min-h-screen bg-background flex flex-col">
        <AdminNavbar title="Corporate Admin Dashboard" onLogout={handleLogout} />
        <div className="relative flex-1 flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-64px)]">
          <div className="hidden lg:block absolute top-0 bottom-0 left-64 w-px bg-border" aria-hidden />
          <AdminSidebar
            items={[
              { id: "all", label: "All Applications", onClick: () => {} , isActive: true}
            ]}
          />
          <div className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">Applications</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Input 
                    id="search-applications"
                    name="search-applications"
                    placeholder="Search (name, reg no, email, year, branch)" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                  />
                  <select
                    id="status-filter"
                    name="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="holded">Holded</option>
                  </select>
                  <Button onClick={exportCsv} className="md:ml-2">Export CSV</Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100/api'
                        const token = apiClient.getToken() || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null)
                        const res = await fetch(`${base}/corporate-dashboard/notifications/send-to-shortlisted`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.message || 'Failed to send emails');
                        alert(data.message || 'Emails sent');
                      } catch (e: unknown) {
                        const errorMessage = e instanceof Error ? e.message : 'Failed to send emails';
                        alert(errorMessage);
                      }
                    }}
                  >
                    Email shortlisted
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading applications...</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("name")}>Name {sortBy==="name" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("regNo")}>Reg. No {sortBy==="regNo" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("srmEmail")}>SRM Email {sortBy==="srmEmail" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("email")}>Personal Email {sortBy==="email" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("phone")}>Phone {sortBy==="phone" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("yearOfStudy")}>Year {sortBy==="yearOfStudy" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("branch")}>Branch {sortBy==="branch" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                        <th className="text-left p-3 cursor-pointer select-none" onClick={() => handleSort("status")}>Status {sortBy==="status" ? (sortDir==="asc"?"▲":"▼") : ""}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 && (
                        <tr>
                          <td className="p-6 text-center text-muted-foreground" colSpan={8}>No applications found.</td>
                        </tr>
                      )}
                      {sorted.map((a, index) => (
                        <tr key={a.id || `${a.regNo}-${index}`} className="border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => { setSelected(a); setIsOpen(true) }}>
                          <td className="p-3">{a.name}</td>
                          <td className="p-3">{a.regNo}</td>
                          <td className="p-3">{a.srmEmail}</td>
                          <td className="p-3">{a.email}</td>
                          <td className="p-3">{a.phone}</td>
                          <td className="p-3">{a.yearOfStudy}</td>
                          <td className="p-3">{a.branch}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              a.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                              a.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              a.status === 'holded' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {a.status || 'active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="right" className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Application Details</SheetTitle>
                  </SheetHeader>
                  {selected && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-medium">{selected.name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Reg. No</div>
                          <div>{selected.regNo}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Year</div>
                          <div>{selected.yearOfStudy}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">SRM Email</div>
                          <div className="break-all">{selected.srmEmail}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Personal Email</div>
                          <div className="break-all">{selected.email}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Phone</div>
                          <div>{selected.phone}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Branch</div>
                          <div>{selected.branch}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Domain</div>
                          <div>{selected.domain}</div>
                        </div>
                      </div>
                      
                      {/* Status Section - Separate from grid */}
                      <div className="pt-4">
                        <div className="text-sm text-muted-foreground mb-2">Status</div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (localStatus || 'active') === 'shortlisted' ? 'bg-green-100 text-green-800' :
                            (localStatus || 'active') === 'rejected' ? 'bg-red-100 text-red-800' :
                            (localStatus || 'active') === 'holded' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {localStatus || 'active'}
                          </span>
                          <select
                            value={localStatus || 'active'}
                            onChange={(e) => setLocalStatus(e.target.value as User["status"])}
                            className="px-2 py-1 border border-input bg-background rounded text-xs"
                          >
                            <option value="active">Active</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="holded">Holded</option>
                          </select>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="ml-2 bg-orange-600 hover:bg-orange-700 text-white"
                            disabled={updatingStatus || localStatus === selected.status} 
                            onClick={() => changeStatus((localStatus || 'active') as 'active' | 'shortlisted' | 'rejected' | 'holded' | 'omitted')}
                          >
                            {updatingStatus ? 'Saving...' : 'Update'}
                          </Button>
                        </div>
                      </div>
                      {/* Registration answers moved to full responses page */}
                      {selected.linkedinLink && (
                        <div>
                          <div className="text-sm text-muted-foreground">LinkedIn</div>
                          <a href={selected.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            View Profile
                          </a>
                        </div>
                      )}
                      <Link className="inline-flex text-sm text-primary underline" href={`/dashboard/corporate/${selected.id}`}>Open full responses →</Link>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}