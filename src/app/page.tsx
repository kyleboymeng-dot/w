"use client"

import * as React from "react"
import { useAuth, UserRole } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Users, ShieldCheck, FileText, Mail, Lock, Loader2, Flag } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function LoginPage() {
  const { login, emailLogin, isLoading } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    emailLogin(email, password)
  }

  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "student",
      title: "SHS Student",
      desc: "LRN & Academic Profile",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      id: "teacher",
      title: "Faculty",
      desc: "Grading & Attendance",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "admin",
      title: "System Admin",
      desc: "School Analytics",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      id: "registrar",
      title: "Registrar",
      desc: "Official SHS Records",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://picsum.photos/seed/shs-ph/1200/800" 
          alt="Philippine High School" 
          fill 
          className="object-cover opacity-10"
          priority
          data-ai-hint="philippine school"
        />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full shadow-2xl shadow-primary/20 mb-2 border-4 border-accent">
            <Flag className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-primary font-headline uppercase">
            Campus<span className="text-accent">Connect</span>
          </h1>
          <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">
            Official Senior High School Portal
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-black">Welcome Back</CardTitle>
            <CardDescription className="text-xs font-medium">Log in using your institutional credentials</CardDescription>
          </CardHeader>
          <form onSubmit={handleEmailLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email or LRN</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="student@shs.edu.ph" 
                    className="pl-10 h-11 border-muted/50 focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 border-muted/50 focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full font-bold h-12 text-sm shadow-lg shadow-primary/20" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </CardContent>
          </form>
          <div className="px-6 pb-6">
            <div className="relative flex items-center gap-4 py-2 mb-2">
              <span className="text-[9px] uppercase text-muted-foreground font-bold tracking-widest">Prototype Roles</span>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 h-auto py-3 group hover:border-primary hover:bg-primary/5 transition-all rounded-xl"
                  onClick={() => login(role.id)}
                  disabled={isLoading}
                >
                  <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {role.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black leading-none">{role.title}</p>
                    <p className="text-[8px] text-muted-foreground truncate font-medium uppercase">{role.desc}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          <CardFooter className="bg-primary/5 border-t flex flex-col p-4 gap-2">
            <p className="text-[10px] text-center text-muted-foreground font-medium">
              Unauthorized access is prohibited. All activity is monitored for security.
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
          © 2024 Philippine Academic Management Systems
        </p>
      </div>
    </div>
  )
}
