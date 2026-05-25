"use client"

import { useEffect } from "react"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { useToastStore, type Toast } from "@/store/toast-store"
import { cn } from "@/lib/utils"

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: "bg-white border-green-200 text-slate-900 shadow-lg shadow-green-500/10",
  error: "bg-white border-red-200 text-slate-900 shadow-lg shadow-red-500/10",
  warning: "bg-white border-amber-200 text-slate-900 shadow-lg shadow-amber-500/10",
  info: "bg-white border-blue-200 text-slate-900 shadow-lg shadow-blue-500/10",
}

const iconStyles = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast)
  const Icon = toastIcons[toast.type]

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-2xl border-2 min-w-[320px] max-w-md animate-in slide-in-from-right backdrop-blur-sm",
        toastStyles[toast.type]
      )}
    >
      <div className={cn("p-2 rounded-xl bg-slate-50", iconStyles[toast.type])}>
        <Icon className={cn("h-5 w-5 flex-shrink-0", iconStyles[toast.type])} />
      </div>
      <p className="flex-1 text-sm font-medium pt-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
