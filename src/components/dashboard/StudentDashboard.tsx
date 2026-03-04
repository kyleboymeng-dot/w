
"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  useFirestore, 
  useCollection, 
  useDoc, 
  useMemoFirebase 
} from "@/firebase"
import { collection, query, where, doc, collectionGroup } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, CheckCircle2, AlertCircle, Calendar, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function StudentDashboard() {
  const { user } = useAuth()
  const db = useFirestore()

  // Determine current day of the week
  const today = React.useMemo(() => DAYS[new Date().getDay()], [])
  const todayDate = React.useMemo(() => format(new Date(), "EEEE, MMMM do"), [])

  const studentProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "student_profiles", user.id)
  }, [db, user])
  const { data: profile, isLoading: isProfileLoading } = useDoc(studentProfileRef)

  // Fetch today's schedule
  const scheduleQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collectionGroup(db, "schedules"), where("dayOfWeek", "==", today))
  }, [db, today])
  const { data: schedules, isLoading: isScheduleLoading } = useCollection(scheduleQuery)

  const stats = [
    { 
      label: "General Average", 
      value: profile?.currentGwa?.toFixed(1) || "0.0", 
      sub: "Performance", 
      icon: GraduationCap, 
      color: "text-primary" 
    },
    { 
      label: "Attendance Rate", 
      value: "96%", 
      sub: "Current Quarter", 
      icon: CheckCircle2, 
      color: "text-green-600" 
    },
    { 
      label: "Today's Classes", 
      value: schedules?.length || "0", 
      sub: "Active Sessions", 
      icon: Clock, 
      color: "text-accent" 
    },
  ]

  if (isProfileLoading || isScheduleLoading) {
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
          <Card key={i} className="hover:shadow-md transition-shadow border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">{todayDate}</CardDescription>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {schedules && schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot: any) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-muted/30 group hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-sm min-w-[70px]">
                        <span className="text-[10px] font-bold text-primary uppercase">Time</span>
                        <span className="text-xs font-black">{slot.startTime}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">{slot.classId}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {slot.endTime} End
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {slot.roomNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-white">Active</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/5">
                <Calendar className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-sm font-bold text-muted-foreground">No Classes Today</h3>
                <p className="text-xs text-muted-foreground max-w-[200px] mt-1">Take this time to review your modules or complete performance tasks.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-widest">Learner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[10px] uppercase opacity-70 font-bold">LRN (Learner Reference Number)</p>
                <p className="text-lg font-mono font-bold">{profile?.studentIdNumber || "N/A"}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] uppercase opacity-70 font-bold">Track/Strand</p>
                  <p className="font-bold">{profile?.strand || "STEM"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase opacity-70 font-bold">Grade & Section</p>
                  <p className="font-bold">{profile?.gradeLevel || "12"}-{profile?.section || "A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-accent/10 border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" /> Upcoming Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold">Quarterly Examination</p>
              <p className="text-xs text-muted-foreground">Starts on October 15, 2024</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
