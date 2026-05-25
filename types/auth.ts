import { Role } from "./permissions"

export interface AuthSession {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    name: string
    avatar?: string
    role: Role
  } | null
}
