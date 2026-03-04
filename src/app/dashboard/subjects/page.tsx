
"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase 
} from "@/firebase"
import { collection } from "firebase/firestore"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Loader2, Info } from "lucide-react"

export default function SubjectsPage() {
  const { user } = useAuth()
  const db = useFirestore()

  const coursesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, "courses")
  }, [db])

  const { data: courses, isLoading } = useCollection(coursesQuery)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Curriculum & Subjects</h1>
          <p className="text-muted-foreground">Comprehensive list of available academic courses.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading course catalog...</p>
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => (
              <Card key={course.id} className="border-none shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-default">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {course.credits} Units
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
                  <CardDescription className="font-mono font-bold text-xs text-primary">
                    {course.courseCode}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {course.description || "No description available for this course."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-sm p-12 flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Catalog Empty</h3>
              <p className="text-muted-foreground text-sm max-w-xs">No courses have been added to the institutional catalog yet.</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
