"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userFormSchema, type UserFormData, type User } from "@/types/user"
import { useUserStore } from "@/store/user-store"
import { useToastStore } from "@/store/toast-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AvatarSelectorModal } from "./avatar-selector-modal"

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserFormModal({ open, onOpenChange, user }: UserFormModalProps) {
  const addUser = useUserStore((state) => state.addUser)
  const updateUser = useUserStore((state) => state.updateUser)
  const addToast = useToastStore((state) => state.addToast)
  const [avatarSeed, setAvatarSeed] = useState(Date.now().toString())
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          password: "******",
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        }
      : {
          name: "",
          email: "",
          password: "",
          role: "User",
          status: "Active",
          avatar: "",
        },
  })

  const watchedName = watch("name")
  const watchedAvatar = watch("avatar")

  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          password: "******",
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        })
      } else {
        const seed = Date.now().toString()
        setAvatarSeed(seed)
        reset({
          name: "",
          email: "",
          password: "",
          role: "User",
          status: "Active",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
        })
      }
    }
  }, [open, user, reset])

  const handleAvatarSelect = (avatar: string) => {
    setValue("avatar", avatar)
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      if (user) {
        const updateData = { ...data }
        if (data.password === "******") {
          updateData.password = user.password
        }
        updateUser(user.id, updateData)
        addToast("User updated successfully! ✨", "success")
      } else {
        addUser(data)
        addToast("User created successfully! 🎉", "success")
      }
      onOpenChange(false)
      reset()
    } catch (error) {
      addToast("An error occurred", "error")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {user ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogClose onClose={() => onOpenChange(false)} />
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 pt-2">
            {/* Avatar Preview - Click to Change */}
            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <button
                type="button"
                onClick={() => setShowAvatarSelector(true)}
                className="relative group cursor-pointer"
              >
                <img
                  src={watchedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${watchedName || avatarSeed}`}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Change</span>
                </div>
              </button>
              <p className="text-sm text-gray-600">Click avatar to change</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  {...register("name")}
                  className={errors.name ? "border-red-500 h-11" : "h-11"}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500 h-11" : "h-11"}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={user ? "Leave unchanged" : "Min. 6 characters"}
                  {...register("password")}
                  className={errors.password ? "border-red-500 h-11" : "h-11"}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
                {user && (
                  <p className="text-xs text-gray-500">
                    Leave as ****** to keep current password
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base font-medium">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select id="role" {...register("role")} className="h-11">
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status" className="text-base font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select id="status" {...register("status")} className="h-11">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
            </div>

            {/* Hidden avatar field */}
            <input type="hidden" {...register("avatar")} />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>{user ? "Update User" : "Create User"}</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        open={showAvatarSelector}
        onOpenChange={setShowAvatarSelector}
        currentAvatar={watchedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${watchedName || avatarSeed}`}
        userName={watchedName || avatarSeed}
        onSelect={handleAvatarSelect}
      />
    </>
  )
}
