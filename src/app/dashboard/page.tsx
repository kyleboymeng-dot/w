"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/Navbar"
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { StudentDashboard } from "@/components/dashboard/StudentDashboard"
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { RegistrarDashboard } from "@/components/dashboard/RegistrarDashboard"
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Settings, 
  FileText, 
  Users, 
  PieChart,
  ShieldAlert,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) return null

  const getDashboardContent = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard />
      case "teacher":
        return <TeacherDashboard />
      case "admin":
        return <AdminDashboard />
      case "registrar":
        return <RegistrarDashboard />
      default:
        return <div className="p-8 text-center border-2 border-dashed rounded-xl">Access Denied: Invalid Role Configuration</div>
    }
  }

  const getMenuItems = () => {
    const common = [
      { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    ]

    switch (user.role) {
      case "student":
        return [
          ...common,
          { title: "My Grades", icon: BookOpen, url: "/dashboard/grades" },
          { title: "Schedule", icon: Calendar, url: "/dashboard/schedule" },
          { title: "Attendance", icon: FileText, url: "/dashboard/attendance" },
        ]
      case "teacher":
        return [
          ...common,
          { title: "My Classes", icon: GraduationCap, url: "/dashboard/classes" },
          { title: "Attendance", icon: Calendar, url: "/dashboard/attendance-logger" },
          { title: "Student Records", icon: Users, url: "/dashboard/students" },
        ]
      case "admin":
        return [
          ...common,
          { title: "Analytics", icon: PieChart, url: "/dashboard/analytics" },
          { title: "Users", icon: Users, url: "/dashboard/users" },
          { title: "System Health", icon: ShieldAlert, url: "/dashboard/health" },
        ]
      case "registrar":
        return [
          ...common,
          { title: "Enrollments", icon: Users, url: "/dashboard/enrollments" },
          { title: "Official Transcripts", icon: FileText, url: "/dashboard/transcripts" },
          { title: "Faculty Load", icon: BookOpen, url: "/dashboard/faculty" },
        ]
      default:
        return common
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <SidebarProvider>
        <div className="flex flex-1">
          {user.role !== "student" && (
            <Sidebar className="hidden md:flex border-r">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent className="p-2">
                    <SidebarMenu>
                      {getMenuItems().map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <Link href={item.url} className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <div className="mt-auto p-4">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Settings">
                        <Link href="/settings" className="flex items-center gap-3">
                          <Settings className="h-5 w-5" />
                          <span className="font-medium">Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              </SidebarContent>
            </Sidebar>
          )}

          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <header className="mb-8">
              <h2 className="text-3xl font-bold font-headline tracking-tight capitalize">
                {user.role} Dashboard
              </h2>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Welcome back, <span className="font-medium text-foreground">{user.firstName} {user.lastName}</span>. Here's your academic summary.
              </p>
            </header>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {getDashboardContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
