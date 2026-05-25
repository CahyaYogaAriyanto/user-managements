import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "User", "Manager"]),
  status: z.enum(["Active", "Inactive"]),
  avatar: z.string().optional(),
  createdAt: z.string(),
})
export type User = z.infer<typeof userSchema>

export const userFormSchema = userSchema.omit({ id: true, createdAt: true })
export type UserFormData = z.infer<typeof userFormSchema>

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  avatar: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
})
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
