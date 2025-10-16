"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  MessageSquare,
  User,
  Lock,
  UserCog,
  CheckCircle2,
  Paperclip,
  Send,
  ExternalLink,
  Clock,
  AlertCircle,
  Ban,
} from "lucide-react"

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

interface Comment {
  id: string
  author: {
    name: string
    role: string
  }
  content: string
  timestamp: string
  attachments?: string[]
}

const sampleComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Dummy User",
      role: "Moderator",
    },
    content:
      "Initial review completed. This appears to be a valid report. Investigating the reported content.",
    timestamp: "6h ago",
  },
  {
    id: "2",
    author: {
      name: "Dummy User",
      role: "Senior Moderator",
    },
    content:
      "I've reviewed the user's history. There are 3 similar reports in the past 30 days. Recommend escalation.",
    timestamp: "4h ago",
    attachments: ["screenshot-1.png", "screenshot-2.png"],
  },
]

// Sample data - in real app this would come from API
const sampleReports: Report[] = [
  {
    id: "8288",
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
    id: "8287",
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
    reason: "Spam messages",
  },
  {
    id: "8286",
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
    reason: "Harassment",
  },
  {
    id: "8285",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "2d ago",
    status: "closed",
    closedTime: "1d ago",
    assignedTo: {
      name: "Dummy User",
    },
    reason: "False information",
  },
  {
    id: "8284",
    reportedUser: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    reportedBy: {
      name: "Dummy User",
      username: "@dummyuser",
    },
    timestamp: "3d ago",
    status: "open",
    reason: "Inappropriate content",
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

interface ReportDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(sampleComments)
  const [newComment, setNewComment] = useState("")
  const [selectedStaff, setSelectedStaff] = useState("unassigned")
  const [reportId, setReportId] = useState<string>("")

  // Get the report ID from params
  useEffect(() => {
    params.then(({ id }) => setReportId(id))
  }, [params])

  // Find the report by ID
  const report = sampleReports.find((r) => r.id === reportId)

  // Handle back navigation
  const handleBack = () => {
    router.back()
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleBack()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: String(comments.length + 1),
      author: {
        name: "Current User",
        role: "Moderator",
      },
      content: newComment,
      timestamp: "Just now",
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Report Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The report you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <span className="font-bold text-lg text-foreground">
                Report {report.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Report Details
                </h2>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(report.status)} font-medium`}
                >
                  {getStatusLabel(report.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Reported Reason
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {report.reason}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Reported User
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {report.reportedUser.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report.reportedUser.username}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Reported By
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {report.reportedBy.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {report.reportedBy.username}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Comments
                </h2>
                <Badge variant="outline" className="text-xs">
                  {comments.length}
                </Badge>
              </div>

              <div className="space-y-6 mb-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-4 p-4 rounded-xl bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-base font-semibold text-foreground">
                          {comment.author.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          {comment.author.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      <div className="text-sm text-foreground leading-relaxed mb-2">
                        {comment.content}
                      </div>
                      {comment.attachments &&
                        comment.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {comment.attachments.map((attachment, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border text-sm hover:shadow-sm transition-shadow"
                              >
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground font-medium">
                                  {attachment}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="border-t border-border pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-foreground">
                      Add a comment
                    </span>
                  </div>
                  <Textarea
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[120px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent hover:bg-muted/50 transition-colors"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach Screenshot
                    </Button>
                    <Button
                      onClick={handleAddComment}
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-primary" />
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-card hover:bg-muted/50 transition-colors"
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Create Chat Ticket
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-card hover:bg-muted/50 transition-colors"
                  size="sm"
                >
                  <User className="h-4 w-4" />
                  View User Profile
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-card hover:bg-muted/50 transition-colors"
                  size="sm"
                >
                  <Lock className="h-4 w-4" />
                  View Lock Notes
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
                <UserCog className="h-5 w-5 text-primary" />
                Assignment
              </h3>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-full bg-card border-border text-foreground hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Assign to staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="Dummy User">Dummy User</SelectItem>
                  <SelectItem value="Dummy User 2">Dummy User 2</SelectItem>
                  <SelectItem value="Dummy User 3">Dummy User 3</SelectItem>
                  <SelectItem value="Dummy User 4">Dummy User 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Status
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-card hover:bg-muted/50 transition-colors"
                  size="sm"
                >
                  <Ban className="h-4 w-4" />
                  Mark as Inactionable
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 bg-card hover:bg-muted/50 transition-colors"
                  size="sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Close Ticket
                </Button>
              </div>
            </div>

            {/* Report Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Report Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground font-medium">
                    {report.timestamp}
                  </span>
                </div>
                {report.closedTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Closed:</span>
                    <span className="text-foreground font-medium">
                      {report.closedTime}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Report ID:</span>
                  <span className="text-foreground font-mono font-semibold">
                    #{report.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
