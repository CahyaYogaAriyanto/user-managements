"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  iconBgColor?: string
  iconColor?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}: StatsCardProps) {
  return (
    <Card className="group hover:scale-[1.02] transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold mt-3 text-slate-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-2 mt-4">
                <span
                  className={cn(
                    "text-sm font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1",
                    trend.isPositive 
                      ? "bg-green-50 text-green-700" 
                      : "bg-red-50 text-red-700"
                  )}
                >
                  <span className="text-base">{trend.isPositive ? "↑" : "↓"}</span>
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-4 rounded-2xl transition-transform duration-200 group-hover:scale-110",
            iconBgColor
          )}>
            <Icon className={cn("h-7 w-7", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
