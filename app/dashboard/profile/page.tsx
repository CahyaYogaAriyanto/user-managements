"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileUpdateSchema, type ProfileUpdateData } from "@/types/user"
import { useAuthStore } from "@/store/auth-store"
import { useToastStore } from "@/store/toast-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarSelectorModal } from "@/components/users/avatar-selector-modal"
import { User, Mail, Lock, Save } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)
  const [avatarSeed, setAvatarSeed] = useState(Date.now().toString())
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      currentPassword: "",
      newPassword: "",
    },
  })

  const watchedAvatar = watch("avatar")
  const watchedName = watch("name")

  const handleAvatarSelect = (avatar: string) => {
    setValue("avatar", avatar)
  }

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      updateProfile({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      })

      addToast("Profile updated successfully! ✨", "success")
    } catch (error) {
      addToast("Failed to update profile", "error")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAvatarSelector(true)}
                  className="relative group cursor-pointer"
                >
                  <img
                    src={watchedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${watchedName || avatarSeed}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-blue-100 shadow-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Change</span>
                  </div>
                </button>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-2">Click avatar to change</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Personal Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      {...register("name")}
                      className={errors.name ? "border-red-500 h-12 pl-10" : "h-12 pl-10"}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500 h-12 pl-10" : "h-12 pl-10"}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Change Password
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-base font-medium">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      {...register("currentPassword")}
                      className="h-12 pl-10"
                    />
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-base font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password (min. 6 characters)"
                      {...register("newPassword")}
                      className={errors.newPassword ? "border-red-500 h-12 pl-10" : "h-12 pl-10"}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Leave blank to keep your current password
                  </p>
                </div>
              </div>

              {/* Hidden avatar field */}
              <input type="hidden" {...register("avatar")} />

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account ID</p>
                <p className="font-medium">{user?.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">January 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        open={showAvatarSelector}
        onOpenChange={setShowAvatarSelector}
        currentAvatar={watchedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${watchedName || avatarSeed}`}
        userName={watchedName || avatarSeed}
        onSelect={handleAvatarSelect}
      />
    </div>
  )
}
