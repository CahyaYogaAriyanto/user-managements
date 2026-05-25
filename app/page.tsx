"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useHydration } from "@/hooks/use-hydration"
import { LoginForm } from "@/components/auth/login-form"
import { Users } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isHydrated, isAuthenticated, router])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md animate-in scale-in">
        <div className="relative">
          {/* Form Container */}
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"></div>
            <div className="p-8 lg:p-10">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  UserFlow
                </h1>
                <p className="text-slate-600">
                  Sign in to your account
                </p>
              </div>
              <LoginForm />
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                  Protected by enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
