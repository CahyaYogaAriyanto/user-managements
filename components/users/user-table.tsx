"use client"

import { useState, useMemo } from "react"
import { useUserStore } from "@/store/user-store"
import { useAuthStore } from "@/store/auth-store"
import type { User } from "@/types/user"
import { hasPermission, canEditUser } from "@/types/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { UserFormModal } from "./user-form-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SortField = "name" | "email" | "role" | "status" | "createdAt"
type SortOrder = "asc" | "desc"

export function UserTable() {
  const users = useUserStore((state) => state.users)
  const currentUser = useAuthStore((state) => state.user)
  
  // Permission checks
  const canCreate = currentUser?.role && hasPermission(currentUser.role, "users.create")
  const canDelete = currentUser?.role && hasPermission(currentUser.role, "users.delete")
  const canUpdate = currentUser?.role && hasPermission(currentUser.role, "users.update")
  const isUserRole = currentUser?.role === "User"
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredUsers, sortField, sortOrder])

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedUsers.slice(startIndex, endIndex)
  }, [sortedUsers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, sortedUsers.length)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsFormModalOpen(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete({ id: user.id, name: user.name })
    setIsDeleteModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedUser(null)
    setIsFormModalOpen(true)
  }

  const canEditThisUser = (targetUser: User) => {
    if (!currentUser?.role) return false
    return canEditUser(currentUser.role, targetUser.id, currentUser.id)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        {canCreate && (
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="font-semibold text-sm text-slate-700">User</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 font-semibold text-sm text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Email
                    <SortIcon field="email" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("role")}
                    className="flex items-center gap-2 font-semibold text-sm text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Role
                    <SortIcon field="role" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 font-semibold text-sm text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-2 font-semibold text-sm text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Created At
                    <SortIcon field="createdAt" />
                  </button>
                </th>
                {!isUserRole && (
                  <th className="px-6 py-4 text-right font-semibold text-sm text-slate-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={isUserRole ? 5 : 6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-slate-300" />
                      <p className="text-slate-600">No users found</p>
                      {searchQuery && (
                        <p className="text-sm text-slate-500">
                          Try adjusting your search
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl border-2 border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          user.role === "Admin" &&
                            "bg-blue-50 text-blue-600",
                          user.role === "Manager" &&
                            "bg-purple-50 text-purple-600",
                          user.role === "User" && "bg-slate-100 text-slate-700"
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          user.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    {!isUserRole && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEditThisUser(user) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user)}
                              className="hover:bg-red-50 text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <Search className="h-12 w-12 text-slate-300" />
            <p className="text-slate-600">No users found</p>
            {searchQuery && (
              <p className="text-sm text-slate-500">Try adjusting your search</p>
            )}
          </div>
        ) : (
          paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl border-2 border-slate-200"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </div>
                {!isUserRole && (
                  <div className="flex gap-2">
                    {canEditThisUser(user) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    user.role === "Admin" && "bg-blue-50 text-blue-600",
                    user.role === "Manager" && "bg-purple-50 text-purple-600",
                    user.role === "User" && "bg-slate-100 text-slate-700"
                  )}
                >
                  {user.role}
                </span>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    user.status === "Active"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  )}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {sortedUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="w-20 bg-slate-800/50 border-slate-700 text-white"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
            <span className="text-sm text-slate-600">entries</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Showing {startIndex} to {endIndex} of {sortedUsers.length}{" "}
              entries
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-3 text-sm font-medium text-slate-700">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        user={selectedUser}
      />
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        userId={userToDelete?.id || null}
        userName={userToDelete?.name || null}
      />
    </div>
  )
}
