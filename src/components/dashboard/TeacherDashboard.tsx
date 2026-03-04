"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase 
} from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, ClipboardCheck, Plus, BookOpen, Calendar } from "lucide-react"
import Link from "next/link"

export function TeacherDashboard() {
  const { user } = useAuth()
  const db = useFirestore()

  // Aligned with backend.json: /classes where teacherId matches UID
  const classesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "classes"), where("teacherId", "==", user.id))
  }, [db, user])
  const { data: classes, isLoading: isClassesLoading } = useCollection(classesQuery)

  const stats = [
    { label: "Active Classes", value: classes?.length || "0", icon: GraduationCap, color: "bg-accent text-accent-foreground" },
    { label: "Total Students", value: classes?.reduce((acc: number, c: any) => acc + (c.currentEnrollmentCount || 0), 0) || "0", icon: Users, color: "bg-primary text-primary-foreground" },
    { label: "Attendance Avg.", value: "92%", icon: ClipboardCheck, color: "border border-muted text-primary" },
  ]

  if (isClassesLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => <Card key={i} className="h-32 animate-pulse bg-muted/50 border-none" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className={`${stat.color} border-none shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">{stat.value}</div>
              <stat.icon className="mt-4 h-8 w-8 opacity-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Instructional Load</CardTitle>
              <CardDescription>Managed sections for the current academic year</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {classes && classes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section & Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls: any) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <div className="font-bold">{cls.sectionName}</div>
                        <div className="text-xs text-muted-foreground">{cls.courseId}</div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{cls.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {cls.currentEnrollmentCount}/{cls.maxCapacity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/classes/${cls.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No assigned classes found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Quick Resources
              </CardTitle>
              <CardDescription>Institutional links and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-xs" asChild>
                <Link href="/dashboard/attendance-logger">
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Attendance Logger
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs" asChild>
                <Link href="/dashboard/students">
                  <Users className="mr-2 h-4 w-4" /> Student Roster
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs" asChild>
                <Link href="/dashboard/schedule">
                  <Calendar className="mr-2 h-4 w-4" /> View My Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Button className="w-full h-12" variant="secondary">
            <Plus className="h-4 w-4 mr-2" /> New Class Announcement
          </Button>
        </div>
      </div>
    </div>
  )
}
