"use client"

import { useLanguage } from '@/lib/language-context'

export function ContactHeader() {
  const { t } = useLanguage()

  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
        {t.contact.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {t.contact.subtitle}
      </p>
    </div>
  )
}
