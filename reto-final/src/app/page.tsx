import { HeroSection } from '@/components/hero-section'
import { CollectionSection } from '@/components/collection-section'
import { getProductsByCollection, getFeaturedProducts } from '@/lib/products'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
  const premiumProducts = getProductsByCollection('premium')
  const funProducts = getProductsByCollection('fun')
  const limitedProducts = getProductsByCollection('limited')

  return (
    <div className="flex flex-col">
      <HeroSection featuredProducts={featuredProducts} />

      <CollectionSection
        title="Limited Edition"
        subtitle="Exclusive drops you won't find anywhere else"
        products={limitedProducts}
        collectionSlug="limited"
        className="bg-card"
      />

      <CollectionSection
        title="Premium Collection"
        subtitle="Minimalist designs for the discerning developer"
        products={premiumProducts}
        collectionSlug="premium"
      />

      <CollectionSection
        title="Fun & Community"
        subtitle="Express your love for code with playful designs"
        products={funProducts}
        collectionSlug="fun"
        className="bg-card"
      />
    </div>
  )
}
