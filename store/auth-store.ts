import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthSession } from "@/types/auth"
import { useUserStore } from "./user-store"

interface AuthStore extends AuthSession {
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (data: { name: string; email: string; avatar?: string }) => void
  isHydrated: boolean
  setHydrated: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      login: (email: string, password: string) => {
        // Check default admin account
        if (email === "admin@demo.com" && password === "admin123") {
          set({
            isAuthenticated: true,
            user: {
              id: "admin-1",
              email: "admin@demo.com",
              name: "Admin User",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
              role: "Admin",
            },
          })
          return true
        }

        // Check against created users in user store
        const userStore = useUserStore.getState()
        const foundUser = userStore.users.find(
          (u) => u.email === email && u.password === password && u.status === "Active"
        )

        if (foundUser) {
          set({
            isAuthenticated: true,
            user: {
              id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              avatar: foundUser.avatar,
              role: foundUser.role,
            },
          })
          return true
        }

        return false
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        })
      },
      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
