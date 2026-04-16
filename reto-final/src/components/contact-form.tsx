"use client"

import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { useLanguage } from '@/lib/language-context'

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-3xl border border-border p-8 lg:p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t.contact.successTitle}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {t.contact.successDescription}
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="mt-8"
        >
          {t.contact.sendAnother}
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-3xl border border-border p-8 lg:p-12">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {t.contact.formTitle}
      </h2>
      <p className="text-muted-foreground mb-8">
        {t.contact.formSubtitle}
      </p>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="firstName">{t.contact.firstName}</FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                className="h-12 bg-background border-border"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">{t.contact.lastName}</FieldLabel>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                className="h-12 bg-background border-border"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email">{t.contact.email}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="h-12 bg-background border-border"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="subject">{t.contact.subject}</FieldLabel>
            <Input
              id="subject"
              name="subject"
              placeholder={t.contact.subjectPlaceholder}
              required
              className="h-12 bg-background border-border"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="message">{t.contact.message}</FieldLabel>
            <Textarea
              id="message"
              name="message"
              placeholder={t.contact.messagePlaceholder}
              required
              rows={5}
              className="bg-background border-border resize-none"
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-base font-semibold mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t.contact.sendMessage}
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
