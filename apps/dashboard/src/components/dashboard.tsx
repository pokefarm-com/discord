"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Calendar, Filter, Sun, Moon } from "lucide-react"
import { ReportDetailView } from "./detail-view"

type ReportStatus = "open" | "assigned" | "inactionable" | "closed"

interface Report {
  id: string
  reportedUser: {
    name: string
    username: string
  }
  reportedBy: {
    name: string
    username: string
  }
  timestamp: string
  closedTime?: string
  status: ReportStatus
  assignedTo?: {
    name: string
  }
  reason: string
}

const sampleReports: Report[] = [
  {
    id: "RPT-8288",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "8h ago",
    closedTime: "2h ago",
    status: "inactionable",
    assignedTo: {
      name: "Dummy User",
    },
    reason: "Inappropriate profile picture",
  },
  {
    id: "RPT-8287",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "12h ago",
    status: "assigned",
    assignedTo: {
      name: "Dummy User",
    },
    reason: "Scam or fraud attempt",
  },
  {
    id: "RPT-8286",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "1d ago",
    closedTime: "18h ago",
    status: "closed",
    assignedTo: {
      name: "Dummy User",
    },
    reason: "Hate speech",
  },
  {
    id: "RPT-8285",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "1d ago",
    status: "open",
    reason: "Impersonation",
  },
  {
    id: "RPT-8284",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "2d ago",
    closedTime: "1d ago",
    status: "inactionable",
    assignedTo: {
      name: "Dummy User",
    },
    reason: "False information",
  },
]

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "open":
      return "bg-primary/10 text-primary border-primary/20"
    case "assigned":
      return "bg-warning/10 text-warning border-warning/20"
    case "inactionable":
      return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20"
    case "closed":
      return "bg-success/10 text-success border-success/20"
  }
}

const getStatusLabel = (status: ReportStatus) => {
  switch (status) {
    case "open":
      return "Open"
    case "assigned":
      return "Assigned"
    case "inactionable":
      return "Inactionable"
    case "closed":
      return "Closed"
  }
}

export function ReportDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredReports = sampleReports.filter((report) => {
    const matchesSearch =
      searchQuery === "" ||
      report.reportedUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="font-semibold text-foreground">ModPanel</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="text-foreground font-medium">
              Reports
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Users
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </a>
          </nav>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-md hover:bg-muted"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground text-sm">Manage and review user reports across the platform</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports, users, or IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="inactionable">Inactionable</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="bg-card border-border">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-1">Total Reports</div>
            <div className="text-2xl font-semibold text-foreground">{sampleReports.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-1">Open</div>
            <div className="text-2xl font-semibold text-primary">
              {sampleReports.filter((r) => r.status === "open").length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-1">Assigned</div>
            <div className="text-2xl font-semibold text-warning">
              {sampleReports.filter((r) => r.status === "assigned").length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-1">Closed Today</div>
            <div className="text-2xl font-semibold text-success">
              {sampleReports.filter((r) => r.status === "closed").length}
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reported User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Closed
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-foreground">{report.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-sm font-medium text-foreground">{report.reportedUser.name}</div>
                          <div className="text-xs text-muted-foreground">{report.reportedUser.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-sm font-medium text-foreground">{report.reportedBy.name}</div>
                          <div className="text-xs text-muted-foreground">{report.reportedBy.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">{report.reason}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={`${getStatusColor(report.status)} font-medium`}>
                        {getStatusLabel(report.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {report.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{report.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{report.timestamp}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{report.closedTime || "—"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Closed</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {sampleReports.length} reports
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="bg-card">
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled className="bg-card">
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>

      {selectedReport && <ReportDetailView report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  )
}
