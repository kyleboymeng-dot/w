"use client"

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, User, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleItem {
  subject: string;
  teacher: string;
  room: string;
}

interface ScheduleSlot {
  time: string;
  days: {
    mon?: ScheduleItem;
    tue?: ScheduleItem;
    wed?: ScheduleItem;
    thu?: ScheduleItem;
    fri?: ScheduleItem;
    sat?: ScheduleItem;
  };
}

const SCHEDULE_DATA: ScheduleSlot[] = [
  {
    time: "07:30 09:00",
    days: {
      mon: { subject: "Data Structures", teacher: "Prof. Sarah Johnson", room: "Room 301" },
      tue: { subject: "Web Development", teacher: "Prof. Michael Chen", room: "Room 205" },
      wed: { subject: "Data Structures", teacher: "Prof. Sarah Johnson", room: "Room 301" },
      thu: { subject: "Database Systems", teacher: "Prof. Emily Davis", room: "Room 402" },
      fri: { subject: "Computer Networks", teacher: "Prof. Robert Brown", room: "Room 103" },
    }
  },
  {
    time: "09:00 10:30",
    days: {
      mon: { subject: "Operating Systems", teacher: "Prof. David Wilson", room: "Room 215" },
      tue: { subject: "Software Engineering", teacher: "Prof. Jennifer Lee", room: "Room 308" },
      wed: { subject: "Web Development", teacher: "Prof. Michael Chen", room: "Room 205" },
      thu: { subject: "Operating Systems", teacher: "Prof. David Wilson", room: "Room 215" },
      fri: { subject: "Software Engineering", teacher: "Prof. Jennifer Lee", room: "Room 308" },
    }
  },
  {
    time: "10:30 12:00",
    days: {
      wed: { subject: "Computer Architecture", teacher: "Prof. Thomas Anderson", room: "Room 410" },
      fri: { subject: "Theory of Computation", teacher: "Prof. Lisa Martinez", room: "Room 312" },
    }
  }
];

const DAYS = [
  { label: 'Mon', date: '02/03/26', key: 'mon' },
  { label: 'Tue', date: '02/04/26', key: 'tue' },
  { label: 'Wed', date: '02/05/26', key: 'wed' },
  { label: 'Thu', date: '02/06/26', key: 'thu' },
  { label: 'Fri', date: '02/07/26', key: 'fri' },
  { label: 'Sat', date: '02/08/26', key: 'sat' },
] as const;

export default function SchedulePage() {
  const { user } = useAuth();
  const isRegistrar = user?.role === 'registrar';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <section>
          <h1 className="text-3xl font-bold text-[#1a237e] dark:text-primary">
            {isRegistrar ? "Master Schedule Management" : "Class Schedule"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isRegistrar 
              ? "Oversee and coordinate all institutional time slots and room assignments." 
              : "View your weekly assigned classes and instructors."}
          </p>
        </section>
        <div className="flex gap-2">
          {isRegistrar && (
            <Button variant="outline" className="gap-2 h-10 font-bold text-xs">
              <Filter className="w-4 h-4" /> Filter by Section
            </Button>
          )}
          <Button className="bg-[#1a237e] dark:bg-primary gap-2 h-10 font-bold text-xs">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-card border-none shadow-sm rounded-xl overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-muted/10">
                <th className="py-6 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">
                  <div className="flex flex-col items-center gap-1">
                    <Clock className="w-4 h-4 opacity-30" />
                    <span>Time Slot</span>
                  </div>
                </th>
                {DAYS.map((day) => (
                  <th key={day.key} className="py-6 px-4 text-center">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{day.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter">[{day.date}]</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHEDULE_DATA.map((slot, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <td className="py-8 px-4 text-center">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{slot.time.split(' ')[0]}</p>
                      <div className="w-4 h-[1px] bg-slate-200 mx-auto" />
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{slot.time.split(' ')[1]}</p>
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const item = slot.days[day.key];
                    return (
                      <td key={day.key} className="p-2 align-middle">
                        {item ? (
                          <div className="bg-[#f0f7ff] dark:bg-primary/5 border-l-4 border-l-[#1a237e] dark:border-l-primary rounded-lg p-3 space-y-1.5 transition-all hover:shadow-md cursor-default group">
                            <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.subject}</h4>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                                <User className="w-3 h-3 opacity-60" />
                                <span className="line-clamp-1">{item.teacher}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                <MapPin className="w-3 h-3 opacity-60" />
                                <span>{item.room}</span>
                              </div>
                            </div>
                            {isRegistrar && (
                              <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="ghost" className="h-6 w-full text-[9px] font-bold uppercase tracking-wider text-primary p-0">
                                  Edit Slot
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-slate-200 dark:text-slate-800">
                            <span className="text-xl">•</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      {!isRegistrar && (
        <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed">
          <Calendar className="w-5 h-5 text-primary opacity-50" />
          <p className="text-xs text-muted-foreground italic">
            Note: This schedule is effective for the current academic session. For any conflicts, please coordinate with the Registrar's office.
          </p>
        </div>
      )}
    </div>
  );
}