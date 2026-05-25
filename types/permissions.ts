export type Role = "Admin" | "Manager" | "User"

export type Permission = 
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "profile.view"
  | "profile.update"

export const rolePermissions: Record<Role, Permission[]> = {
  Admin: [
    "users.view",
    "users.create",
    "users.update",
    "users.delete",
    "profile.view",
    "profile.update",
  ],
  Manager: [
    "users.view",
    "users.delete",
    "profile.view",
    "profile.update",
  ],
  User: [
    "users.view",
    "profile.view",
    "profile.update",
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function canEditUser(userRole: Role, targetUserId: string, currentUserId: string): boolean {
  // Admin can edit anyone
  if (userRole === "Admin") return true
  
  // Manager cannot edit users (only delete)
  if (userRole === "Manager") return false
  
  // User can only edit their own profile
  if (userRole === "User") return targetUserId === currentUserId
  
  return false
}

export function canDeleteUser(userRole: Role): boolean {
  return hasPermission(userRole, "users.delete")
}

export function canCreateUser(userRole: Role): boolean {
  return hasPermission(userRole, "users.create")
}
