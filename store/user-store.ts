import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserFormData } from "@/types/user"
import { useActivityStore } from "./activity-store"

interface UserStore {
  users: User[]
  isHydrated: boolean
  setHydrated: () => void
  addUser: (user: UserFormData) => void
  updateUser: (id: string, user: UserFormData) => void
  deleteUser: (id: string) => void
  initializeSeedData: () => void
}

const generateSeedData = (): User[] => {
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "Admin",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      createdAt: new Date("2024-01-15").toISOString(),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password123",
      role: "Manager",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      createdAt: new Date("2024-02-20").toISOString(),
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      password: "password123",
      role: "User",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      createdAt: new Date("2024-03-10").toISOString(),
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      password: "password123",
      role: "User",
      status: "Inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      createdAt: new Date("2024-01-25").toISOString(),
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      password: "password123",
      role: "Manager",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      createdAt: new Date("2024-02-15").toISOString(),
    },
    {
      id: "6",
      name: "Diana Prince",
      email: "diana.prince@example.com",
      password: "password123",
      role: "Admin",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
      createdAt: new Date("2024-03-01").toISOString(),
    },
    {
      id: "7",
      name: "Ethan Hunt",
      email: "ethan.hunt@example.com",
      password: "password123",
      role: "User",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
      createdAt: new Date("2024-03-15").toISOString(),
    },
    {
      id: "8",
      name: "Fiona Green",
      email: "fiona.green@example.com",
      password: "password123",
      role: "User",
      status: "Inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona",
      createdAt: new Date("2024-02-05").toISOString(),
    },
    {
      id: "9",
      name: "George Miller",
      email: "george.miller@example.com",
      password: "password123",
      role: "Manager",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=George",
      createdAt: new Date("2024-01-30").toISOString(),
    },
    {
      id: "10",
      name: "Hannah Lee",
      email: "hannah.lee@example.com",
      password: "password123",
      role: "User",
      status: "Active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah",
      createdAt: new Date("2024-03-20").toISOString(),
    },
  ]
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      initializeSeedData: () => {
        const { users } = get()
        if (users.length === 0) {
          set({ users: generateSeedData() })
        }
      },
      addUser: (userData: UserFormData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          users: [...state.users, newUser],
        }))
        
        // Log activity
        useActivityStore.getState().addActivity("user_created", newUser.name)
      },
      updateUser: (id: string, userData: UserFormData) => {
        const user = get().users.find(u => u.id === id)
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...userData } : user
          ),
        }))
        
        // Log activity
        if (user) {
          useActivityStore.getState().addActivity("user_updated", userData.name)
        }
      },
      deleteUser: (id: string) => {
        const user = get().users.find(u => u.id === id)
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }))
        
        // Log activity
        if (user) {
          useActivityStore.getState().addActivity("user_deleted", user.name)
        }
      },
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
