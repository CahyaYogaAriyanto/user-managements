"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { RefreshCw, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvatar: string
  userName: string
  onSelect: (avatar: string) => void
}

const avatarStyles = [
  { id: "avataaars", name: "Avataaars" },
  { id: "bottts", name: "Bottts" },
  { id: "personas", name: "Personas" },
  { id: "lorelei", name: "Lorelei" },
  { id: "notionists", name: "Notionists" },
  { id: "adventurer", name: "Adventurer" },
]

export function AvatarSelectorModal({
  open,
  onOpenChange,
  currentAvatar,
  userName,
  onSelect,
}: AvatarSelectorModalProps) {
  const [selectedStyle, setSelectedStyle] = useState("avataaars")
  const [seed, setSeed] = useState(userName || Date.now().toString())
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const scrollRef = useRef<HTMLDivElement>(null)

  const generateAvatar = (style: string, customSeed?: string) => {
    const avatarSeed = customSeed || seed
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${avatarSeed}`
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style)
    const newAvatar = generateAvatar(style)
    setSelectedAvatar(newAvatar)
  }

  const handleGenerate = () => {
    const newSeed = Date.now().toString()
    setSeed(newSeed)
    const newAvatar = generateAvatar(selectedStyle, newSeed)
    setSelectedAvatar(newAvatar)
  }

  const handleConfirm = () => {
    onSelect(selectedAvatar)
    onOpenChange(false)
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Avatar</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <div className="space-y-6 p-6 pt-2">
          {/* Current Selection Preview */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <img
              src={selectedAvatar}
              alt="Selected avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <Button
              type="button"
              onClick={handleGenerate}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New
            </Button>
          </div>

          {/* Avatar Style Selector with Horizontal Scroll */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Choose Style</h4>
            
            <div className="relative">
              {/* Left Arrow */}
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              {/* Scrollable Container */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {avatarStyles.map((style) => {
                  const avatarUrl = generateAvatar(style.id)
                  const isSelected = selectedStyle === style.id
                  
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleStyleChange(style.id)}
                      className={cn(
                        "relative flex-shrink-0 w-28 p-3 rounded-xl border-2 transition-all hover:scale-105",
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      )}
                    >
                      <img
                        src={avatarUrl}
                        alt={style.name}
                        className="w-full aspect-square rounded-lg"
                      />
                      <p className="text-xs font-medium mt-2 text-center text-gray-700">
                        {style.name}
                      </p>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
