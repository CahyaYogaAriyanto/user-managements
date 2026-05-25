import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ActivityType = "user_created" | "user_updated" | "user_deleted"

export interface Activity {
  id: string
  type: ActivityType
  message: string
  userName: string
  timestamp: string
}

interface ActivityStore {
  activities: Activity[]
  addActivity: (type: ActivityType, userName: string) => void
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set) => ({
      activities: [],
      addActivity: (type: ActivityType, userName: string) => {
        const messages = {
          user_created: `New user "${userName}" was created`,
          user_updated: `User "${userName}" was updated`,
          user_deleted: `User "${userName}" was deleted`,
        }

        const newActivity: Activity = {
          id: Date.now().toString(),
          type,
          message: messages[type],
          userName,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 50), // Keep last 50
        }))
      },
    }),
    {
      name: "activity-storage",
    }
  )
)
