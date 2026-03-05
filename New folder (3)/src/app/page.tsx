"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Home() {
  const { user, login, loading: authLoading, error: authError } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoImage = PlaceHolderImages.find(img => img.id === 'school-logo');

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive"
      });
      setIsLoggingIn(false);
    }
  };

  if (!mounted) return null;
  if (user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white relative overflow-hidden font-body">
      {/* Navy Blue Wave Background */}
      <div className="absolute top-0 left-0 w-full h-[55%] z-0 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path 
            fill="#1a237e" 
            fillOpacity="1" 
            d="M0,192L80,181.3C160,171,320,149,480,160C640,171,800,213,960,224C1120,235,1280,213,1360,202.7L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4">
        {/* Centered Logo Section */}
        <div className="mb-8 w-32 h-32 relative bg-white rounded-full p-0.5 shadow-xl border-[3px] border-[#1a237e]">
          {logoImage && (
            <Image 
              src={logoImage.imageUrl} 
              alt="Puerto National High School Logo" 
              fill 
              className="object-contain rounded-full"
              priority
              data-ai-hint="school logo seal"
            />
          )}
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-xl border-none rounded-xl overflow-hidden bg-white max-w-[380px]">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#0f172a]">
                Welcome Back
              </h1>
              <p className="text-[#64748b] text-sm">
                Log in using your institutional credentials
              </p>
            </div>

            {authError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Profile Error</AlertTitle>
                <AlertDescription className="text-xs">
                  {authError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Email or LRN</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@shs.edu.ph" 
                    className="h-11 border-none focus-visible:ring-0 rounded-lg bg-[#f8fafc] pl-11 pr-4 text-sm text-[#334155] placeholder:text-[#94a3b8]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="h-11 border-none focus-visible:ring-0 rounded-lg bg-[#f8fafc] pl-11 pr-11 text-sm text-[#334155] placeholder:text-[#94a3b8]"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1a237e]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-[#1a237e] hover:bg-[#121858] h-12 rounded-lg text-base font-bold shadow-md transition-all active:scale-[0.98] text-white"
              >
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isLoggingIn ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Discreet Dev Helpers */}
        <div className="mt-8 flex flex-col items-center opacity-30 hover:opacity-100 transition-opacity">
          <p className="text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Dev Test Accounts</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-[#1a237e]" onClick={() => { setEmail('admin@campusconnect.edu'); setPassword('password'); }}>Admin</button>
            <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-[#1a237e]" onClick={() => { setEmail('teacher@campusconnect.edu'); setPassword('password'); }}>Teacher</button>
            <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-[#1a237e]" onClick={() => { setEmail('registrar@school.com'); setPassword('password'); }}>Registrar</button>
            <button className="text-[10px] uppercase font-bold text-slate-400 hover:text-[#1a237e]" onClick={() => { setEmail('student@campusconnect.edu'); setPassword('password'); }}>Student</button>
          </div>
        </div>
      </div>
    </div>
  );
}
