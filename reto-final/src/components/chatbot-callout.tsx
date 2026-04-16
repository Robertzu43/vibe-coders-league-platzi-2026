"use client"

import { useState } from 'react'
import { Bot, Send, X, MessageCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const quickResponses = [
  "What's your return policy?",
  "How long does shipping take?",
  "Do you ship internationally?",
  "Where is my order?",
]

export function ChatbotCallout() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    { role: 'bot', content: "Hi! I'm your Platzi Store assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState('')

  const handleSend = (message: string) => {
    if (!message.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: message }])
    setInput('')

    // Simulate bot response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "What's your return policy?": "We offer a 30-day hassle-free return policy. If you're not satisfied with your purchase, simply return it in its original condition for a full refund.",
        "How long does shipping take?": "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Free shipping on orders over $50!",
        "Do you ship internationally?": "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on your location.",
        "Where is my order?": "You can track your order using the tracking link in your confirmation email. If you need help, please provide your order number and I'll look it up for you.",
      }

      const botResponse = responses[message] || "Thanks for your question! Our team will get back to you shortly. For immediate assistance, please fill out the contact form or email us at support@platzistore.com"

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
            <h2 className="text-2xl font-bold text-foreground">AI Assistant</h2>
            <p className="text-muted-foreground">Get instant answers</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Need quick answers? Our AI-powered assistant is available 24/7 to help with
          shipping, returns, product questions, and more.
        </p>

        <Button
          onClick={() => setIsOpen(true)}
          className="w-full h-14 text-base font-semibold"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Start Chat
        </Button>
      </div>

      {/* Contact Info */}
      <div className="bg-card rounded-3xl border border-border p-8 lg:p-12">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Other Ways to Reach Us
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <span className="text-lg">@</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">support@platzistore.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="text-foreground font-medium">Within 24 hours</p>
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
                  <h3 className="font-semibold text-foreground">Platzi Assistant</h3>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Online
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
                  placeholder="Type your message..."
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
