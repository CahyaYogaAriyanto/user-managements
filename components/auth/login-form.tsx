"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/store/auth-store"
import { useToastStore } from "@/store/toast-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Mail, Lock } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const addToast = useToastStore((state) => state.addToast)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const success = login(data.email, data.password)
    
    if (success) {
      addToast("Welcome back! 🎉", "success")
      router.push("/dashboard")
    } else {
      addToast("Invalid email or password", "error")
    }
    
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            id="email"
            type="email"
            placeholder="admin@demo.com"
            {...register("email")}
            className={errors.email ? "border-red-500 pl-12" : "pl-12"}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-500 pl-12" : "pl-12"}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </>
        )}
      </Button>
    </form>
  )
}
