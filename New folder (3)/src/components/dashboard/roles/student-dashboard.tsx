
"use client"

import { useAuth } from '@/hooks/use-auth';
import { useFirestore, useCollection } from '@/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BookOpen, 
  CalendarDays, 
  CheckCircle2,
  FileBarChart,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { collection, query, where, orderBy } from 'firebase/firestore';

export function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const db = useFirestore();

  // Fetch student's grades for dynamic stats
  const gradesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'grades'), 
      where('studentId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: grades, loading: gradesLoading } = useCollection(gradesQuery);

  const stats = useMemo(() => {
    const overallGWA = grades.length > 0 
      ? (grades.reduce((acc, g) => acc + (g.overall || 0), 0) / grades.length).toFixed(2)
      : '0.00';

    return [
      {
        label: "CURRENT GWA",
        value: overallGWA,
        subtext: parseFloat(overallGWA) >= 1.75 ? "Excellent Performance" : "Good Standing",
        subColor: "text-green-500",
        icon: <FileBarChart className="w-6 h-6 text-primary" />,
      },
      {
        label: "ENROLLED SUBJECTS",
        value: "8",
        subtext: "Current Semester",
        subColor: "text-green-500",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
      },
      {
        label: "OVERALL ATTENDANCE",
        value: "94.5%",
        subtext: "Live Sync Active",
        subColor: "text-green-500",
        icon: <CalendarDays className="w-6 h-6 text-primary opacity-40" />,
      },
      {
        label: "ACADEMIC STATUS",
        value: "Active",
        subtext: "Clearance: Passed",
        subColor: "text-green-500",
        icon: <CheckCircle2 className="w-6 h-6 text-green-500 opacity-40" />,
      }
    ];
  }, [grades]);

  if (authLoading || gradesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentGrades = grades.slice(0, 4);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <section className="text-left pt-6">
        <h2 className="text-3xl font-bold text-foreground mb-1">
          Welcome Back, {user?.name}!
        </h2>
        <p className="text-muted-foreground text-sm">
          {user?.gradeLevel || 'Student'} • {user?.section || 'Academic Portal'}
        </p>
      </section>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-shadow bg-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                <div className="p-1.5 rounded-lg bg-muted group-hover:bg-accent/10 transition-colors">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                <p className={cn("text-[11px] font-medium flex items-center gap-1", stat.subColor)}>
                  {idx === 0 && <TrendingUp className="w-3 h-3" />}
                  {stat.subtext}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Today's Schedule */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground">Today's Schedule</h3>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {[
                  { time: "07:30 - 09:00", subject: "Data Structures", teacher: "Prof. Sarah Johnson", room: "Room 301" },
                  { time: "09:00 - 10:30", subject: "Web Development", teacher: "Prof. Michael Chen", room: "Room 205" }
                ].map((item, idx) => (
                  <div key={idx} className={cn(
                    "p-6 flex flex-col gap-1 transition-colors hover:bg-muted/30",
                    idx !== 1 && "border-b border-border"
                  )}>
                    <span className="text-xs font-semibold text-muted-foreground">{item.time}</span>
                    <h4 className="font-bold text-foreground text-base">{item.subject}</h4>
                    <p className="text-xs text-muted-foreground">{item.teacher}</p>
                    <p className="text-xs text-muted-foreground/70">{item.room}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground">Recent Grade Postings</h3>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-card">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {recentGrades.length > 0 ? (
                  recentGrades.map((item, idx) => (
                    <div key={idx} className={cn(
                      "p-6 flex items-center justify-between transition-colors hover:bg-muted/30",
                      idx !== recentGrades.length - 1 && "border-b border-border"
                    )}>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-sm">{item.subject}</h4>
                        <p className="text-xs text-muted-foreground">{item.semester}</p>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="font-bold text-primary text-lg">{item.overall}</span>
                        <Badge className={cn(
                          "rounded-md font-bold text-[10px] px-3 py-1 border-none shadow-none uppercase tracking-wider",
                          item.overall <= 2.0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                          {item.overall <= 1.75 ? "Excellent" : "Passed"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground italic">No recent grades available.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

