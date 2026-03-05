
"use client"

import { MOCK_ADMIN_STATS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  CalendarCheck, 
  ArrowUpRight,
  School,
  FileBarChart,
  Activity,
  UserPlus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const attendanceData = [
  { name: 'Mon', rate: 94 },
  { name: 'Tue', rate: 96 },
  { name: 'Wed', rate: 92 },
  { name: 'Thu', rate: 95 },
  { name: 'Fri', rate: 91 },
];

const activityLog = [
  { id: 1, type: 'enrollment', message: 'New student enrolled in STEM-12A', time: '2 mins ago', icon: UserPlus, color: 'text-blue-500' },
  { id: 2, type: 'grade', message: 'Dr. Smith posted grades for Physics Midterms', time: '1 hour ago', icon: FileBarChart, color: 'text-green-500' },
  { id: 3, type: 'system', message: 'Quarterly attendance report generated', time: '3 hours ago', icon: Activity, color: 'text-slate-500' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-headline">System Overview</h2>
          <div className="text-muted-foreground text-sm mt-1">
            Academic Session: <span className="font-semibold text-primary">{MOCK_ADMIN_STATS.academicSession}</span> | Status: <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 ml-2">Live</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-4 py-2 font-bold uppercase tracking-widest text-[10px]">Total Faculty: 42</Badge>
          <Badge variant="secondary" className="px-4 py-2 font-bold uppercase tracking-widest text-[10px]">Total Rooms: 28</Badge>
        </div>
      </section>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Students</p>
                <h3 className="text-3xl font-bold mt-1">{MOCK_ADMIN_STATS.totalStudents}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+12% vs last term</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Active Classes</p>
                <h3 className="text-3xl font-bold mt-1">{MOCK_ADMIN_STATS.activeClasses}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="text-blue-600 w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-400 font-medium">
              <span>Enrollment stable</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Avg. Attendance</p>
                <h3 className="text-3xl font-bold mt-1">{MOCK_ADMIN_STATS.attendanceRate}%</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CalendarCheck className="text-green-600 w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>Above 90% target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Daily Attendance Analytics</CardTitle>
                <CardDescription>Average participation rate for the current week.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/20 text-primary">WEEK 14</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(51, 78, 138, 0.05)' }}
                />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-muted/10 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-tight">Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activityLog.map((log) => (
                  <div key={log.id} className="p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-muted/5 transition-colors">
                    <div className={`p-2 rounded-lg bg-white dark:bg-card border shadow-sm shrink-0 ${log.color}`}>
                      <log.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{log.message}</p>
                      <p className="text-[10px] text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-muted/5 text-center">
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All Logs</button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-base font-bold">Quick Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left group">
                <School className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium">Academic Strands</span>
                <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left group">
                <FileBarChart className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium">Export Session Data</span>
                <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
