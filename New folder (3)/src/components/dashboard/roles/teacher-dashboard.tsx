
"use client"

import { useAuth } from '@/hooks/use-auth';
import { MOCK_CLASSES } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ClipboardList, CheckSquare, Loader2 } from 'lucide-react';

export function TeacherDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div>
          <h2 className="text-3xl font-bold font-headline mb-2">Hello, {user?.name}!</h2>
          <p className="text-muted-foreground">Faculty Member • Academic Year 2025-2026</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Classes */}
          <Card>
            <CardHeader>
              <CardTitle>My Classes Today</CardTitle>
              <CardDescription>Manage attendance and grade logs for your assigned sections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_CLASSES.map((cls) => (
                  <div key={cls.id} className="p-5 rounded-lg border hover:shadow-md transition-shadow bg-white dark:bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{cls.name}</p>
                          <Badge variant="outline" className="text-[10px] uppercase">{cls.subject}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{cls.time} • {cls.students} Students</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8">Mark Attendance</Button>
                      <Button size="sm" className="h-8">Post Grades</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-yellow-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Grade Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">128</p>
                <p className="text-xs text-muted-foreground mt-1">Due in 3 days</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">42/48</p>
                <p className="text-xs text-muted-foreground mt-1">Sessions logged this month</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <ClipboardList className="w-4 h-4 mr-3 text-primary" />
                Generate Class Report
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <CheckSquare className="w-4 h-4 mr-3 text-primary" />
                Verify Attendance Appeals
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Users className="w-4 h-4 mr-3 text-primary" />
                View Student Profiles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
