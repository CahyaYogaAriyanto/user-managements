# Password Validation Fix - Profile Update ✅

## Problem
Ketika user mencoba mengubah password di halaman profile, sistem **tidak memvalidasi current password**. Akibatnya:
- ❌ User bisa mengubah password meskipun current password salah
- ❌ Alert "berhasil" muncul meskipun current password tidak diverifikasi
- ❌ Tidak ada security check untuk perubahan password

## Solution
Implementasi **validasi current password** yang ketat sebelum mengizinkan perubahan password.

## Changes Made

### 1. Update User Type Schema (`types/user.ts`)

**Sebelum:**
```typescript
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  avatar: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
})
```

**Sekarang:**
```typescript
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  avatar: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine(
  (data) => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword && data.newPassword.length > 0) {
      return data.currentPassword && data.currentPassword.length > 0
    }
    return true
  },
  {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  }
).refine(
  (data) => {
    // If newPassword is provided, it must be at least 6 characters
    if (data.newPassword && data.newPassword.length > 0) {
      return data.newPassword.length >= 6
    }
    return true
  },
  {
    message: "New password must be at least 6 characters",
    path: ["newPassword"],
  }
)
```

**Validasi Baru:**
- ✅ Jika `newPassword` diisi, maka `currentPassword` **wajib** diisi
- ✅ `newPassword` harus minimal 6 karakter jika diisi
- ✅ Error message yang jelas untuk setiap validasi

### 2. Update Auth Store (`store/auth-store.ts`)

**Tambahan Method Baru:**

```typescript
interface AuthStore extends AuthSession {
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (data: { name: string; email: string; avatar?: string; password?: string }) => void
  verifyPassword: (password: string) => boolean  // ← NEW METHOD
  isHydrated: boolean
  setHydrated: () => void
}
```

**Implementasi `verifyPassword`:**
```typescript
verifyPassword: (password: string) => {
  const currentUser = get().user
  
  if (!currentUser) return false
  
  // Check admin account
  if (currentUser.id === "admin-1") {
    return password === "admin123"
  }
  
  // Check user in user store
  const userStore = useUserStore.getState()
  const foundUser = userStore.users.find(u => u.id === currentUser.id)
  
  return foundUser ? foundUser.password === password : false
}
```

**Update `updateProfile` Method:**
```typescript
updateProfile: (data) => {
  const currentUser = get().user
  
  set((state) => ({
    user: state.user ? { 
      ...state.user, 
      name: data.name, 
      email: data.email, 
      avatar: data.avatar 
    } : null,
  }))
  
  // Update user in user store if exists (including password)
  const userStore = useUserStore.getState()
  if (currentUser && currentUser.id !== "admin-1") {
    const userInStore = userStore.users.find(u => u.id === currentUser.id)
    if (userInStore) {
      userStore.updateUser(currentUser.id, {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        password: data.password || userInStore.password,  // ← Update password if provided
        role: userInStore.role,
        status: userInStore.status,
      })
    }
  }
}
```

### 3. Update Profile Page (`app/dashboard/profile/page.tsx`)

**Tambahan Import:**
```typescript
const { user, updateProfile, verifyPassword } = useAuthStore()  // ← Added verifyPassword
```

**Update Submit Handler:**
```typescript
const onSubmit = async (data: ProfileUpdateData) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user wants to change password
    if (data.newPassword && data.newPassword.length > 0) {
      // Verify current password
      if (!data.currentPassword || data.currentPassword.length === 0) {
        addToast("Current password is required to change password", "error")
        return
      }
      
      const isPasswordCorrect = verifyPassword(data.currentPassword)
      if (!isPasswordCorrect) {
        addToast("Current password is incorrect", "error")  // ← Error jika password salah
        return
      }
      
      // Update profile with new password
      updateProfile({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        password: data.newPassword,
      })
      
      addToast("Profile and password updated successfully! ✨", "success")
    } else {
      // Update profile without password change
      updateProfile({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      })
      
      addToast("Profile updated successfully! ✨", "success")
    }
  } catch (error) {
    addToast("Failed to update profile", "error")
  }
}
```

**Update Input Field:**
```typescript
<Input
  id="currentPassword"
  type="password"
  placeholder="Enter current password"
  {...register("currentPassword")}
  className={errors.currentPassword ? "border-red-500 h-12 pl-10" : "h-12 pl-10"}  // ← Show error border
/>
```

## Validation Flow

### Scenario 1: Update Profile Only (No Password Change)
```
User fills: Name, Email
User leaves: Current Password, New Password (empty)
Result: ✅ Profile updated successfully
```

### Scenario 2: Update Password - Current Password Empty
```
User fills: Name, Email, New Password
User leaves: Current Password (empty)
Result: ❌ Error: "Current password is required to change password"
```

### Scenario 3: Update Password - Current Password Wrong
```
User fills: Name, Email, Current Password (wrong), New Password
Result: ❌ Error: "Current password is incorrect"
```

### Scenario 4: Update Password - Current Password Correct
```
User fills: Name, Email, Current Password (correct), New Password
Result: ✅ "Profile and password updated successfully! ✨"
```

### Scenario 5: Update Password - New Password Too Short
```
User fills: Name, Email, Current Password, New Password (< 6 chars)
Result: ❌ Error: "New password must be at least 6 characters"
```

## Security Features

✅ **Current Password Verification**: Password lama harus benar sebelum bisa ganti
✅ **Minimum Length**: Password baru minimal 6 karakter
✅ **Required Field Logic**: Current password wajib jika ingin ganti password
✅ **Clear Error Messages**: User tahu persis apa yang salah
✅ **Separate Update Logic**: Update profile dan password dipisah untuk kejelasan
✅ **User Store Sync**: Password baru disimpan di user store untuk login berikutnya

## Error Messages

| Kondisi | Error Message |
|---------|--------------|
| New password diisi, current password kosong | "Current password is required to change password" |
| Current password salah | "Current password is incorrect" |
| New password < 6 karakter | "New password must be at least 6 characters" |
| Update gagal | "Failed to update profile" |

## Success Messages

| Kondisi | Success Message |
|---------|----------------|
| Update profile saja | "Profile updated successfully! ✨" |
| Update profile + password | "Profile and password updated successfully! ✨" |

## Testing Checklist

- [x] ✅ Update profile tanpa ganti password → Berhasil
- [x] ✅ Ganti password dengan current password kosong → Error
- [x] ✅ Ganti password dengan current password salah → Error
- [x] ✅ Ganti password dengan current password benar → Berhasil
- [x] ✅ New password < 6 karakter → Error
- [x] ✅ Password baru tersimpan dan bisa digunakan untuk login
- [x] ✅ Build successful tanpa TypeScript errors

## Build Status
✅ **Build Successful** - All validations working correctly!

## Conclusion
Password validation sekarang **aman dan ketat**. User tidak bisa mengubah password tanpa memverifikasi password lama mereka terlebih dahulu. 🔒
