"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  X,
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
    content: "Initial review completed. This appears to be a valid report. Investigating the reported content.",
    timestamp: "6h ago",
  },
  {
    id: "2",
    author: {
      name: "Dummy User",
      role: "Senior Moderator",
    },
    content: "I've reviewed the user's history. There are 3 similar reports in the past 30 days. Recommend escalation.",
    timestamp: "4h ago",
    attachments: ["screenshot-1.png", "screenshot-2.png"],
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

interface ReportDetailViewProps {
  report: Report
  onClose: () => void
}

export function ReportDetailView({ report, onClose }: ReportDetailViewProps) {
  const [comments, setComments] = useState<Comment[]>(sampleComments)
  const [newComment, setNewComment] = useState("")
  const [selectedStaff, setSelectedStaff] = useState(report.assignedTo?.name || "unassigned")

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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-card border border-border rounded-lg shadow-lg flex flex-col lg:flex-row min-h-[600px] max-h-[90vh]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b border-border p-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold text-foreground">{report.id}</h2>
                  <Badge variant="outline" className={`${getStatusColor(report.status)} font-medium`}>
                    {getStatusLabel(report.status)}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{report.reason}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Report Details */}
            <div className="border-b border-border p-6 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Reported User</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{report.reportedUser.name}</div>
                      <div className="text-xs text-muted-foreground">{report.reportedUser.username}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Reported By</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{report.reportedBy.name}</div>
                      <div className="text-xs text-muted-foreground">{report.reportedBy.username}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Timestamp</div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {report.timestamp}
                  </div>
                </div>

                {report.closedTime && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Closed Time</div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {report.closedTime}
                    </div>
                  </div>
                )}

                {report.assignedTo && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Assigned To</div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                      {report.assignedTo.name}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {comment.author.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <div className="text-sm text-foreground leading-relaxed mb-2">{comment.content}</div>
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {comment.attachments.map((attachment, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-3 py-2 bg-muted rounded border border-border text-xs"
                            >
                              <Paperclip className="h-3 w-3 text-muted-foreground" />
                              <span className="text-foreground">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="border-t border-border p-6">
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Paperclip className="h-4 w-4" />
                    Attach Screenshot
                  </Button>
                  <Button onClick={handleAddComment} size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-muted/20 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 bg-card" size="sm">
                  <MessageSquare className="h-4 w-4" />
                  Create Chat Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-card" size="sm">
                  <User className="h-4 w-4" />
                  View User Profile
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 bg-card" size="sm">
                  <Lock className="h-4 w-4" />
                  View Lock Notes
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Assignment
              </h3>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-full bg-card border-border text-foreground">
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

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Status
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-card" size="sm">
                  Mark as Inactionable
                </Button>
                <Button className="w-full justify-start gap-2 bg-success hover:bg-success/90 text-white" size="sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Close Ticket
                </Button>
              </div>
            </div>

            <Separator />

            <div className="pt-4">
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-foreground">{report.timestamp}</span>
                </div>
                {report.closedTime && (
                  <div className="flex justify-between">
                    <span>Closed:</span>
                    <span className="text-foreground">{report.closedTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Report ID:</span>
                  <span className="text-foreground font-mono">{report.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
