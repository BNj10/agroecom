"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import ChangePasswordSkeleton from "./ChangePasswordSkeleton"

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(true)

    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleChangePassword = async () => {
  //    const supabase = createClient()
  // setLoading(true)

  // try {
  //   // 1. Get current user (to get email)
  //   const { data: { user } } = await supabase.auth.getUser()
  //   if (!user) {
  //     toast.error("You must be logged in to change your password.")
  //     return
  //   }

  //   const email = user.email

  //   // 2. Re-authenticate with the old password
  //   const { error: authError } = await supabase.auth.signInWithPassword({
  //     email,
  //     password: oldPassword,
  //   })

  //   if (authError) {
  //     toast.error("Old password is incorrect.")
  //     return
  //   }

  //   // 3. Update to the new password
  //   const { error: updateError } = await supabase.auth.updateUser({
  //     password: newPassword,
  //   })

  //   if (updateError) {
  //     toast.error(updateError.message)
  //     return
  //   }

  //   toast.success("Password updated successfully.")

  //   // 4. OPTIONAL: Force logout after update
  //   await supabase.auth.signOut()
  //   window.location.href = "/login"

  // } catch (err) {
  //   toast.error("Something went wrong.")
  // } finally {
  //   setLoading(false)
  // }
  }

  if (loading) {
    return <ChangePasswordSkeleton />
  }

  return (
    <Card>
      <CardHeader className="text-xl font-(--font-geist-sans)">
        Change password
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Old Password</Label>
          <Input 
            id="oldPassword" 
            type="password" 
            className="font-(--font-geist-sans)"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input 
            id="newPassword" 
            type="password" 
            className="font-(--font-geist-sans)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-sm text-muted-foreground font-(--font-geist-sans)">
            Minimum of 6 characters
          </p>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleChangePassword}
            disabled={loading}
            className="font-(--font-geist-sans) px-6"
            variant='default'
          >
            {loading ? "Changing..." : "Change"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}