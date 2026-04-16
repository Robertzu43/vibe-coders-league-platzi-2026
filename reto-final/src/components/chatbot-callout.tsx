"use client"

import { useState } from 'react'
import { Bot, Send, X, MessageCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export function ChatbotCallout() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    { role: 'bot', content: t.chatbot.greeting }
  ])
  const [input, setInput] = useState('')

  const quickResponses = [
    t.chatbot.returnPolicy,
    t.chatbot.shippingTime,
    t.chatbot.international,
    t.chatbot.orderStatus,
  ]

  const handleSend = (message: string) => {
    if (!message.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: message }])
    setInput('')

    // Simulate bot response
    setTimeout(() => {
      const responses: Record<string, string> = {
        [t.chatbot.returnPolicy]: t.chatbot.returnPolicyAnswer,
        [t.chatbot.shippingTime]: t.chatbot.shippingTimeAnswer,
        [t.chatbot.international]: t.chatbot.internationalAnswer,
        [t.chatbot.orderStatus]: t.chatbot.orderStatusAnswer,
      }

      const botResponse = responses[message] || t.chatbot.defaultAnswer

      setMessages(prev => [...prev, { role: 'bot', content: botResponse }])
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Info Cards */}
      <div className="bg-card rounded-3xl border border-border p-8 lg:p-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t.chatbot.title}</h2>
            <p className="text-muted-foreground">{t.chatbot.subtitle}</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {t.chatbot.description}
        </p>

        <Button
          onClick={() => setIsOpen(true)}
          className="w-full h-14 text-base font-semibold"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {t.chatbot.startChat}
        </Button>
      </div>

      {/* Contact Info */}
      <div className="bg-card rounded-3xl border border-border p-8 lg:p-12">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          {t.chatbot.otherWays}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <span className="text-lg">@</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.chatbot.emailLabel}</p>
              <p className="text-foreground font-medium">support@platzistore.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.chatbot.responseTime}</p>
              <p className="text-foreground font-medium">{t.chatbot.responseTimeValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.chatbot.assistantName}</h3>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {t.chatbot.online}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-secondary text-foreground rounded-tl-none'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Responses */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(response)}
                    className="px-3 py-1.5 text-xs bg-secondary hover:bg-border rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.chatbot.inputPlaceholder}
                  className="flex-1 h-12 bg-background border-border"
                />
                <Button type="submit" size="icon" className="h-12 w-12">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
