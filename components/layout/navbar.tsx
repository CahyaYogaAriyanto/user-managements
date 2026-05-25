"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/auth-store"
import { useToastStore } from "@/store/toast-store"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, Bell, Search } from "lucide-react"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    addToast("Logged out successfully", "info")
    router.push("/")
  }

  const getAvatarUrl = (avatar?: string, name?: string) => {
    if (avatar) return avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "user"}`
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 h-16 flex items-center sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-slate-100 rounded-xl"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </Button>
        
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200"
            >
              <img
                src={getAvatarUrl(user?.avatar, user?.name)}
                alt={user?.name}
                className="w-9 h-9 rounded-xl border-2 border-blue-100 shadow-sm"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/60 py-2 z-20 animate-in scale-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowDropdown(false)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Profile Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-medium transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
