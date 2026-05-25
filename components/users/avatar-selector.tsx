"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check } from "lucide-react"

interface AvatarSelectorProps {
  currentAvatar: string
  userName: string
  onSelect: (avatar: string) => void
}

const avatarStyles = [
  { id: "avataaars", name: "Avataaars", style: "avataaars" },
  { id: "bottts", name: "Bottts", style: "bottts" },
  { id: "personas", name: "Personas", style: "personas" },
  { id: "lorelei", name: "Lorelei", style: "lorelei" },
  { id: "notionists", name: "Notionists", style: "notionists" },
  { id: "adventurer", name: "Adventurer", style: "adventurer" },
]

export function AvatarSelector({ currentAvatar, userName, onSelect }: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState("avataaars")
  const [seed, setSeed] = useState(userName || Date.now().toString())

  const generateAvatar = (style: string, customSeed?: string) => {
    const avatarSeed = customSeed || seed
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${avatarSeed}`
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style)
    const newAvatar = generateAvatar(style)
    onSelect(newAvatar)
  }

  const handleGenerate = () => {
    const newSeed = Date.now().toString()
    setSeed(newSeed)
    const newAvatar = generateAvatar(selectedStyle, newSeed)
    onSelect(newAvatar)
  }

  return (
    <div className="space-y-4">
      {/* Current Avatar Preview */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <img
          src={currentAvatar}
          alt="Selected avatar"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerate}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Generate New
        </Button>
      </div>

      {/* Avatar Style Selector */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Choose Avatar Style</h4>
        <div className="grid grid-cols-3 gap-3">
          {avatarStyles.map((style) => {
            const avatarUrl = generateAvatar(style.style)
            const isSelected = selectedStyle === style.style
            
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleChange(style.style)}
                className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={style.name}
                  className="w-full aspect-square rounded-lg"
                />
                <p className="text-xs font-medium mt-2 text-center">{style.name}</p>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
