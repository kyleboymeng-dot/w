
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ClipboardList,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export function RegistrarDashboard() {
  const stats = [
    { label: "Total Students", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Schedules Set", value: "48/48", icon: Calendar, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Pending Requests", value: "12", icon: Clock, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Enrolled This Term", value: "320", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground font-headline">Registrar Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Management of institutional schedules, enrollment, and student records.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-6 shadow-md font-bold text-sm rounded-xl">
            <Link href="/dashboard/students">
              <ClipboardList className="w-4 h-4 mr-2" />
              New Enrollment
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                </div>
                <div className={`p-3 ${stat.bg} rounded-xl`}>
                  <stat.icon className={`${stat.color} w-5 h-5`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Schedule Changes */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Schedule Updates</CardTitle>
                <CardDescription>Latest modifications made to the institutional timetable.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs font-bold border-border">
                <Link href="/dashboard/schedule">View Master List</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                { class: "STEM 12-A", subject: "Advanced Physics", action: "Room Changed to 402", time: "10 mins ago" },
                { class: "HUMSS 11-B", subject: "Creative Writing", action: "Instructor Assigned", time: "1 hour ago" },
                { class: "STEM 12-C", subject: "Calculus", action: "Time Adjusted", time: "3 hours ago" },
                { class: "STEM 11-A", subject: "Biology", action: "New Schedule Created", time: "5 hours ago" },
              ].map((log, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-xs">
                      {log.class.split(' ')[0][0]}{log.class.split(' ')[1][0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{log.class} • {log.subject}</p>
                      <p className="text-xs text-muted-foreground">{log.action}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tools */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="text-sm font-bold uppercase tracking-tight">Quick Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search student records..." className="pl-9 h-10 text-sm bg-background border-border" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button asChild variant="secondary" className="justify-start text-xs font-bold gap-2 bg-muted hover:bg-muted/80">
                  <Link href="/dashboard/enrollment">
                    <LayoutDashboard className="w-4 h-4" /> Enrollment Analytics
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="justify-start text-xs font-bold gap-2 bg-muted hover:bg-muted/80">
                  <Link href="/dashboard/schedule">
                    <Calendar className="w-4 h-4" /> Open Schedule Editor
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="justify-start text-xs font-bold gap-2 bg-muted hover:bg-muted/80">
                  <Link href="/dashboard/students">
                    <Users className="w-4 h-4" /> Manage Student Sections
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-base font-bold">Academic Status</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-xs">SY 2025-2026 Semester 1</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enrollment Window</span>
                <Badge className="bg-green-500 hover:bg-green-500 border-none text-white">OPEN</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Days Until Term Start</span>
                <span className="text-xl font-bold">14</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
