"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    badge: null,
  },
]

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  return (
    <>
      {/* Mobile overlay with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 lg:translate-x-0 shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          "w-72" 
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header - Logo Section */}
          <div className={cn(
            "flex items-center justify-between h-16 px-6 border-b border-slate-100",
            isCollapsed && "lg:justify-center lg:px-4"
          )}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">
                    UserFlow
                  </h2>
                  <p className="text-xs text-slate-500">Management System</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="hidden lg:flex relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="lg:hidden hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    isCollapsed && "lg:justify-center lg:px-3"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                  {!isCollapsed && (
                    <span className="text-sm flex-1">{item.title}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-slate-100 space-y-3">
            {/* Toggle button (desktop only) */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                onClick={onToggleCollapse}
                className={cn(
                  "w-full flex items-center gap-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-sm">Collapse</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
