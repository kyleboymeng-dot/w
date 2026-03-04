"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase 
} from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Loader2, Info, GraduationCap } from "lucide-react"

export default function GradesPage() {
  const { user } = useAuth()
  const db = useFirestore()

  const gradesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "grades"), where("studentProfileId", "==", user.id))
  }, [db, user])
  
  const { data: grades, isLoading } = useCollection(gradesQuery)

  const groupedGrades = React.useMemo(() => {
    if (!grades) return []
    const map = new Map()
    grades.forEach((g: any) => {
      const classKey = g.assignmentClassId || "Unknown Subject"
      if (!map.has(classKey)) map.set(classKey, [])
      map.get(classKey).push(g)
    })
    return Array.from(map.entries())
  }, [grades])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Academic Report Card</h1>
            <p className="text-muted-foreground">Performance tracked according to DepEd SHS standards.</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="q1">
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select Quarter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1">1st Quarter</SelectItem>
                <SelectItem value="q2">2nd Quarter</SelectItem>
                <SelectItem value="q3">3rd Quarter</SelectItem>
                <SelectItem value="q4">4th Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Preparing your report card...</p>
          </div>
        ) : groupedGrades.length > 0 ? (
          <div className="grid gap-8">
            {groupedGrades.map(([classId, classGrades]: [string, any]) => (
              <Card key={classId} className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-primary/5 border-b py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Subject: {classId}
                    </CardTitle>
                    <div className="flex gap-2">
                       <Badge variant="outline" className="bg-background">Core Subject</Badge>
                       <Badge className="bg-primary">Final Grade: 91</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[10px] uppercase font-bold">Component</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold">Raw Score</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold">Weighted</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-bold">Date Logged</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classGrades.map((grade: any) => (
                        <TableRow key={grade.id} className="border-muted/10">
                          <TableCell className="font-semibold text-sm">
                            {grade.assignmentId}
                            <p className="text-[10px] text-muted-foreground font-medium uppercase">{grade.type || "Performance Task"}</p>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{grade.score}</TableCell>
                          <TableCell className="font-mono text-sm text-primary">{(grade.score * 0.4).toFixed(1)}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {grade.gradedDate ? new Date(grade.gradedDate).toLocaleDateString() : "Pending"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-sm p-12 flex flex-col items-center text-center gap-4 bg-white/50 border-2 border-dashed">
            <div className="p-4 bg-primary/10 rounded-full">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">No Data Found</h3>
              <p className="text-muted-foreground text-sm max-w-xs">Please wait for your teachers to post your grades for this quarter.</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
