'use client'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { useUserData} from '@/lib/user-data'

export default function DashboardIndex() {
  const { user, loading } = useUserData();
  // const supabase = await createClient()

  // const { data: { user }, error } = await supabase.auth.getUser()

  // if (error || !user) {
  //   redirect('/login')
  // }

  const role = user?.app_metadata?.role

  if (role === 'farmer') {
    redirect('/dashboard/farmer/profile')
  }
  redirect('/dashboard/overview')
}