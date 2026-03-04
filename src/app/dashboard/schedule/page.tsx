"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase 
} from "@/firebase"
import { collectionGroup } from "firebase/firestore"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Loader2, CalendarX } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SchedulePage() {
  const { user } = useAuth()
  const db = useFirestore()

  // Use collectionGroup for schedules as defined in backend.json subcollection structure
  const scheduleQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return collectionGroup(db, "schedules")
  }, [db, user])

  const { data: entries, isLoading } = useCollection(scheduleQuery)

  const groupedSchedule = React.useMemo(() => {
    const map = new Map()
    DAYS.forEach(day => map.set(day, []))
    if (entries) {
      entries.forEach((entry: any) => {
        const day = entry.dayOfWeek
        if (map.has(day)) {
          map.get(day).push(entry)
        }
      })
    }
    // Sort time slots per day
    map.forEach((slots) => {
      slots.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
    })
    return Array.from(map.entries())
  }, [entries])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">Your weekly academic routine.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your timetable...</p>
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {groupedSchedule.map(([day, slots]: [string, any]) => (
              <div key={day} className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-primary border-b pb-2">{day}</h3>
                <div className="space-y-3">
                  {slots.map((slot: any) => (
                    <Card key={slot.id} className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all">
                      <CardContent className="p-4 space-y-2">
                        <div className="text-xs font-bold text-primary flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <p className="text-sm font-semibold leading-tight">Room: {slot.roomNumber}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" />
                          Class ID: {slot.classId}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {slots.length === 0 && (
                    <p className="text-xs text-muted-foreground italic opacity-50">No classes</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4 bg-muted/20 rounded-2xl border-2 border-dashed">
            <CalendarX className="h-12 w-12 text-muted-foreground opacity-20" />
            <div>
              <h3 className="text-lg font-bold">Timetable Empty</h3>
              <p className="text-muted-foreground text-sm max-w-xs">You don't have any scheduled classes yet.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}