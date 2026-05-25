"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, UserMinus, Settings, Activity } from "lucide-react"
import { useActivityStore } from "@/store/activity-store"
import { formatDistanceToNow } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

const activityIcons = {
  user_created: UserPlus,
  user_updated: Settings,
  user_deleted: UserMinus,
}

const activityColors = {
  user_created: {
    bg: "bg-green-50",
    text: "text-green-600",
    ring: "ring-green-100",
  },
  user_updated: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-100",
  },
  user_deleted: {
    bg: "bg-red-50",
    text: "text-red-600",
    ring: "ring-red-100",
  },
}

export function RecentActivity() {
  const allActivities = useActivityStore((state) => state.activities)
  
  const activities = useMemo(() => {
    return allActivities.slice(0, 5)
  }, [allActivities])

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No recent activity</p>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">
              Activity will appear here when you create, update, or delete users
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type]
            const colors = activityColors[activity.type]
            
            return (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 group"
              >
                <div className={cn(
                  "p-3 rounded-xl ring-4 transition-transform duration-200 group-hover:scale-110",
                  colors.bg,
                  colors.ring
                )}>
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                    {formatDistanceToNow(activity.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
