"use client"

import { useAuthStore } from "@/store/auth-store"
import { useUserStore } from "@/store/user-store"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const users = useUserStore((state) => state.users)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Get last month date
  const lastMonth = new Date(currentYear, currentMonth - 1, 1)
  const lastMonthNumber = lastMonth.getMonth()
  const lastMonthYear = lastMonth.getFullYear()

  // Calculate current month stats
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "Active").length
  
  const newUsersThisMonth = users.filter((u) => {
    const createdDate = new Date(u.createdAt)
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    )
  }).length

  // Calculate last month stats for comparison
  const usersLastMonth = users.filter((u) => {
    const createdDate = new Date(u.createdAt)
    return createdDate < new Date(currentYear, currentMonth, 1)
  }).length

  const newUsersLastMonth = users.filter((u) => {
    const createdDate = new Date(u.createdAt)
    return (
      createdDate.getMonth() === lastMonthNumber &&
      createdDate.getFullYear() === lastMonthYear
    )
  }).length

  // Calculate this week's new users
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const newUsersThisWeek = users.filter((u) => {
    const createdDate = new Date(u.createdAt)
    return createdDate >= oneWeekAgo
  }).length

  // Calculate trends
  const totalUsersTrend = usersLastMonth > 0 
    ? Math.round(((totalUsers - usersLastMonth) / usersLastMonth) * 100)
    : totalUsers > 0 ? 100 : 0

  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
  
  const newUsersMonthTrend = newUsersLastMonth > 0
    ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
    : newUsersThisMonth > 0 ? 100 : 0

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Section - Modern Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening with your users today.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          trend={
            totalUsersTrend !== 0
              ? {
                  value: `${totalUsersTrend > 0 ? '+' : ''}${totalUsersTrend}% from last month`,
                  isPositive: totalUsersTrend > 0,
                }
              : undefined
          }
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          trend={{ value: `${activePercentage}% active rate`, isPositive: activePercentage >= 50 }}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="New This Month"
          value={newUsersThisMonth}
          icon={UserPlus}
          trend={
            newUsersThisWeek > 0
              ? {
                  value: `+${newUsersThisWeek} this week`,
                  isPositive: true,
                }
              : { value: "No new users this week", isPositive: false }
          }
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>
      <RecentActivity />
    </div>
  )
}
