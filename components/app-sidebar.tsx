'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter, usePathname } from 'next/navigation'
import { PieChart, Book, Users } from "lucide-react"
import { useUserData } from '@/lib/user-data'
import { Skeleton } from "@/components/ui/skeleton"

interface SideBarProps {
  userRole?: 'lender' | 'admin' | 'farmer';
  userName?: string;
  userAvatar?: string;
}

export default function SideBar({ userRole: propUserRole, userName: propUserName, userAvatar: propUserAvatar }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUserData()

  if (loading) {
    return (
      <div className="flex">
        <aside className="hidden w-64 border-r bg-white lg:block p-4 space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </aside>
      </div>
    )
  }

  const rawRole = propUserRole || user?.app_metadata?.role || 'farmer';
  const userRole = rawRole.toLowerCase(); 

  const userName = propUserName || user?.user_metadata?.username || "User";
  const userAvatar = propUserAvatar || user?.user_metadata?.avatar_url;
  
  const isAdmin = userRole === 'admin';
  const isLender = userRole === 'lender';
  const isFarmer = userRole === 'farmer';

  const profilePath = `/dashboard/${userRole}/profile`;
  const mainPath = `/dashboard/${userRole}`;
  
  const mainLabel = isAdmin ? 'Accounts' : 'Rental Requests';
  const mainIcon = isAdmin ? <Users className="w-8 h-8" /> : <Book className="w-8 h-8" />;

  return (
    <div className="flex">
      <aside className="hidden w-64 border-r bg-white lg:block">
        <nav className="space-y-1 p-4">
          <div className="mb-8">
            <div className="space-y-1">
              <Button 
                variant="ghost"
                className={`p-8 w-full justify-start gap-2 border rounded-2xl ${pathname === profilePath ? 'bg-gray-100' : ''}`}
                onClick={() => router.push(profilePath)}
              >
                <Avatar>
                  <AvatarImage src={userAvatar} alt="Profile Picture" />
                  <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="truncate w-full font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                </div>
              </Button>
              
              {!isFarmer && (
                <Button 
                  variant="ghost" 
                  className={`p-8 w-full justify-start gap-2 border rounded-2xl ${pathname === '/dashboard/overview' ? 'bg-gray-100' : ''}`}
                  onClick={() => router.push('/dashboard/overview')}
                >
                  <PieChart className="w-8 h-8" />
                  Overview
                </Button>
              )}
              
              {!isFarmer && (
                <Button
                  variant="ghost"
                  className={`p-8 w-full justify-start gap-2 border rounded-2xl ${pathname === mainPath ? 'bg-gray-100' : ''}`}
                  onClick={() => router.push(mainPath)}
                >
                  {mainIcon}
                  {mainLabel}
                </Button>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}