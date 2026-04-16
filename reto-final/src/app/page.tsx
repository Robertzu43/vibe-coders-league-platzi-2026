"use client"

import { HeroSection } from '@/components/hero-section'
import { CollectionSection } from '@/components/collection-section'
import { CtaBanner } from '@/components/cta-banner'
import { getProductsByCollection, getFeaturedProducts } from '@/lib/products'
import { useLanguage } from '@/lib/language-context'

export default function HomePage() {
  const { t } = useLanguage()
  const featuredProducts = getFeaturedProducts()
  const premiumProducts = getProductsByCollection('premium')
  const funProducts = getProductsByCollection('fun')
  const limitedProducts = getProductsByCollection('limited')

  return (
    <div className="flex flex-col">
      <HeroSection featuredProducts={featuredProducts} />

      <CollectionSection
        title={t.collections.premium}
        subtitle={t.collections.premiumSubtitle}
        products={premiumProducts}
        collectionSlug="premium"
      />

      <CollectionSection
        title={t.collections.limited}
        subtitle={t.collections.limitedSubtitle}
        products={limitedProducts}
        collectionSlug="limited"
        className="bg-card"
      />

      <CollectionSection
        title={t.collections.fun}
        subtitle={t.collections.funSubtitle}
        products={funProducts}
        collectionSlug="fun"
      />

      <CtaBanner />
    </div>
  )
}
