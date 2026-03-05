
"use client"

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isStudent = user?.role === 'student';
  const logoImage = PlaceHolderImages.find(img => img.id === 'school-logo');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full w-9 h-9"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  const ProfileDropdown = ({ size = "h-8 w-8" }: { size?: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={cn(size, "border cursor-pointer hover:opacity-80 transition-opacity")}>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isStudent) {
    return (
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 relative rounded-full overflow-hidden border border-primary/20 bg-white">
            {logoImage && (
              <Image 
                src={logoImage.imageUrl} 
                alt="Logo" 
                fill 
                className="object-cover"
                data-ai-hint={logoImage.imageHint}
              />
            )}
          </div>
          <span className="font-bold text-[#1a237e] dark:text-primary text-lg hidden sm:block">CampusConnect</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/dashboard" 
            className={cn(
              "text-sm font-medium transition-colors relative py-5",
              pathname === '/dashboard' ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Home
          </Link>
          <Link 
            href="/dashboard/grades" 
            className={cn(
              "text-sm font-medium transition-colors relative py-5",
              pathname === '/dashboard/grades' ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Grades
          </Link>
          <Link 
            href="/dashboard/attendance" 
            className={cn(
              "text-sm font-medium transition-colors relative py-5",
              pathname === '/dashboard/attendance' ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Attendance
          </Link>
          <Link 
            href="/dashboard/schedule" 
            className={cn(
              "text-sm font-medium transition-colors relative py-5",
              pathname === '/dashboard/schedule' ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Schedule
          </Link>
          <Link 
            href="/dashboard/subjects" 
            className={cn(
              "text-sm font-medium transition-colors relative py-5",
              pathname === '/dashboard/subjects' ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Subjects
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search records..." className="pl-9 h-9 bg-muted/50 border-none" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <ProfileDropdown size="h-9 w-9" />
        </div>
      </div>
    </header>
  );
}
