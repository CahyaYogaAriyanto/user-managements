import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthSession } from "@/types/auth"
import { useUserStore } from "./user-store"

interface AuthStore extends AuthSession {
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (data: { name: string; email: string; avatar?: string; password?: string }) => void
  verifyPassword: (password: string) => boolean
  isHydrated: boolean
  setHydrated: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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
      verifyPassword: (password: string) => {
        const currentUser = get().user
        
        if (!currentUser) return false
        
        // Check admin account
        if (currentUser.id === "admin-1") {
          return password === "admin123"
        }
        
        // Check user in user store
        const userStore = useUserStore.getState()
        const foundUser = userStore.users.find(u => u.id === currentUser.id)
        
        return foundUser ? foundUser.password === password : false
      },
      updateProfile: (data) => {
        const currentUser = get().user
        
        set((state) => ({
          user: state.user ? { ...state.user, name: data.name, email: data.email, avatar: data.avatar } : null,
        }))
        
        // Update user in user store if exists
        const userStore = useUserStore.getState()
        if (currentUser && currentUser.id !== "admin-1") {
          const userInStore = userStore.users.find(u => u.id === currentUser.id)
          if (userInStore) {
            userStore.updateUser(currentUser.id, {
              name: data.name,
              email: data.email,
              avatar: data.avatar,
              password: data.password || userInStore.password,
              role: userInStore.role,
              status: userInStore.status,
            })
          }
        }
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
