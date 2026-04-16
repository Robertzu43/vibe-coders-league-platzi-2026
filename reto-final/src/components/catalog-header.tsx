"use client"

import { useLanguage } from '@/lib/language-context'

export function CatalogHeader() {
  const { t } = useLanguage()

  return (
    <div className="mb-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
        {t.catalog.allProducts}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        {t.catalog.subtitle}
      </p>
    </div>
  )
}
