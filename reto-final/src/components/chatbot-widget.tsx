"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { ChatbotPanel } from "@/components/chatbot-panel"
import { cn } from "@/lib/utils"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat panel */}
      {isOpen && <ChatbotPanel onClose={() => setIsOpen(false)} />}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center",
          "shadow-lg shadow-primary/25",
          "hover:scale-110 active:scale-95",
          "transition-transform duration-200 ease-out",
          "cursor-pointer"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  )
}
