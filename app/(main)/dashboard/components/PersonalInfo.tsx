"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import PersonalInfoSkeleton from "./PersonalInfoSkeleton"
import { User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

interface PersonalInfoProps {
  editable?: boolean;
  initialData?: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function PersonalInfo({ editable = true, initialData }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    avatarUrl: initialData?.avatarUrl || ""
  })

  const [originalData, setOriginalData] = useState({
    username: initialData?.username || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    avatarUrl: initialData?.avatarUrl || ""
  })

  // const supabase = createClient()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data: { user } } = await supabase.auth.getUser()
        
  //       if (!user) return

  //       setUser(user)

  //       const { data: profile, error } = await supabase
  //         .from('profiles')
  //         .select('username, first_name, last_name, avatar_url')
  //         .eq('id', user.id)
  //         .single()

  //       if (error && error.code !== 'PGRST116') {
  //         console.error('Error fetching profile:', error)
  //       }

  //       const initialData = {
  //         username: profile?.username || "",
  //         firstName: profile?.first_name || "",
  //         lastName: profile?.last_name || "",
  //         email: user.email || "",
  //         avatarUrl: profile?.avatar_url || ""
  //       }

  //       setFormData(initialData)
  //       setOriginalData(initialData)
  //     } catch (error) {
  //       console.error('Error loading user data:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [supabase])

    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSave = async () => {
  //   if (!user) return

  //   try {
  //     const { error } = await supabase
  //       .from('profiles')
  //       .upsert({
  //         id: user.id,
  //         username: formData.username,
  //         first_name: formData.firstName,
  //         last_name: formData.lastName,
  //         updated_at: new Date().toISOString(),
  //       })

  //     if (error) throw error

  //     setOriginalData(formData)
  //     setIsEditing(false)
  //     toast.success("Profile updated successfully")
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
  //     toast.error(errorMessage)
  //   }
  }

  const getInitials = () => {
    const first = formData.firstName ? formData.firstName[0] : ""
    const last = formData.lastName ? formData.lastName[0] : ""
    return (first + last).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || "U"
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0]
    // if (!file) return

    // // Validate file type
    // const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    // if (!validTypes.includes(file.type)) {
    //   toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)")
    //   return
    // }

    // // Validate file size (max 5MB)
    // const maxSize = 5 * 1024 * 1024
    // if (file.size > maxSize) {
    //   toast.error("Image must be less than 5MB")
    //   return
    // }

    // setUploading(true)

    // try {
    //   const supabase = createClient()
      
    //   // Get current user
    //   const { data: { user: currentUser } } = await supabase.auth.getUser()
    //   if (!currentUser) {
    //     throw new Error("User not found")
    //   }

    //   // Create unique file name
    //   const fileExt = file.name.split('.').pop()
    //   const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`
    //   const filePath = `avatars/${fileName}`

    //   // Upload to Supabase Storage
    //   const { error: uploadError } = await supabase.storage
    //     .from('profiles')
    //     .upload(filePath, file, { upsert: true })

    //   if (uploadError) throw uploadError

    //   // Get public URL
    //   const { data: { publicUrl } } = supabase.storage
    //     .from('profiles')
    //     .getPublicUrl(filePath)

    //   // Update form data with new avatar URL
    //   setFormData(prev => ({ ...prev, avatarUrl: publicUrl }))

    //   // Update profile in database
    //   const { error: updateError } = await supabase
    //     .from('profiles')
    //     .upsert({
    //       id: currentUser.id,
    //       avatar_url: publicUrl,
    //       updated_at: new Date().toISOString(),
    //     })

    //   if (updateError) throw updateError

    //   toast.success("Profile picture updated successfully")
    // } catch (error) {
    //   const errorMessage = error instanceof Error ? error.message : "Failed to upload image"
    //   toast.error(errorMessage)
    // } finally {
    //   setUploading(false)
    //   // Reset file input
    //   if (fileInputRef.current) {
    //     fileInputRef.current.value = ''
    //   }
    // }
  }

  if (loading) {
    return <PersonalInfoSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-xl font-(--font-geist-sans)">
          Personal Information
        </div>
        {editable && !isEditing && (
          <Button 
            onClick={handleEditClick}
            variant="outline"
            className="font-(--font-geist-sans)"
          >
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.avatarUrl || "/path/to/profile-image.png"} alt="User Avatar" /> 
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                className="font-(--font-geist-sans)"
                variant="outline"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload a picture"
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <Input 
              id="username" 
              value={formData.username}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`font-(--font-geist-sans) ${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>
          <div></div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`font-(--font-geist-sans) ${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`font-(--font-geist-sans) ${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>
          
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <Input 
              id="email" 
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              readOnly={true}
              className={`font-(--font-geist-sans) bg-muted`}
              title="Email cannot be changed here"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="font-(--font-geist-sans) px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="font-(--font-geist-sans) px-6"
            >
              Save personal info
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
