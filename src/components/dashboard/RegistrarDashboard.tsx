"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileCheck, UserPlus, ShieldAlert, History, Users } from "lucide-react"

export function RegistrarDashboard() {
  const recentActivities = [
    { type: "Record Updated", student: "Emma Watson", info: "Official Transcript Request", date: "2 mins ago" },
    { type: "New Enrollment", student: "Michael Scott", info: "Computer Science Dept.", date: "15 mins ago" },
    { type: "Schedule Modified", student: "Jim Halpert", info: "MAT401 Section Change", date: "1 hour ago" },
    { type: "Access Logged", student: "Security", info: "Database backup completed", date: "3 hours ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search students, records, or schedules..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" /> New Enrollment
          </Button>
          <Button variant="outline">
            <FileCheck className="mr-2 h-4 w-4" /> Issue Certificate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Quick Actions</CardTitle>
              <CardDescription>Commonly used registrar tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Button variant="secondary" className="h-auto py-6 flex-col gap-2 items-start justify-start border-none">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <div className="text-left">
                  <p className="font-semibold">Security Audit</p>
                  <p className="text-[10px] text-muted-foreground">Last audit 3 days ago</p>
                </div>
              </Button>
              <Button variant="secondary" className="h-auto py-6 flex-col gap-2 items-start justify-start border-none">
                <History className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold">Manage Schedules</p>
                  <p className="text-[10px] text-muted-foreground">Assign rooms & faculty</p>
                </div>
              </Button>
              <Button variant="secondary" className="h-auto py-6 flex-col gap-2 items-start justify-start border-none">
                <FileCheck className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <p className="font-semibold">Official Records</p>
                  <p className="text-[10px] text-muted-foreground">Verify & seal documents</p>
                </div>
              </Button>
              <Button variant="secondary" className="h-auto py-6 flex-col gap-2 items-start justify-start border-none">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Student Database</p>
                  <p className="text-[10px] text-muted-foreground">View all profiles</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Pending Clearances</CardTitle>
              <CardDescription>Graduating students awaiting final review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        ST
                      </div>
                      <div>
                        <p className="text-sm font-medium">Student Candidate {i}</p>
                        <p className="text-xs text-muted-foreground">B.S. Information Tech • ID: 2021-000{i}</p>
                      </div>
                    </div>
                    <Button size="sm">Review Docs</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Registry Logs</CardTitle>
            <CardDescription>Recent system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((log, i) => (
                <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l border-muted last:border-0">
                  <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-primary tracking-wider">{log.type}</p>
                    <p className="text-sm font-medium">{log.student}</p>
                    <p className="text-xs text-muted-foreground">{log.info}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
