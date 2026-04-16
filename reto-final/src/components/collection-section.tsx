import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'

interface CollectionSectionProps {
  title: string
  subtitle: string
  products: Product[]
  collectionSlug: string
  className?: string
}

export function CollectionSection({
  title,
  subtitle,
  products,
  collectionSlug,
  className,
}: CollectionSectionProps) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-muted-foreground text-lg">
              {subtitle}
            </p>
          </div>
          <Link
            href={`/catalog?collection=${collectionSlug}`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
