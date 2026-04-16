import { Suspense } from 'react'
import { CatalogContent } from '@/components/catalog-content'

export const metadata = {
  title: 'Catalog | Platzi Store',
  description: 'Browse our complete collection of premium tech merchandise.',
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            All Products
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Explore our complete collection of premium tech merchandise designed for developers.
          </p>
        </div>

        {/* Content with filters */}
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent />
        </Suspense>
      </div>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 w-24 bg-card rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-card rounded-2xl overflow-hidden">
            <div className="aspect-square bg-secondary animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-secondary rounded animate-pulse" />
              <div className="h-4 bg-secondary rounded w-2/3 animate-pulse" />
              <div className="h-6 bg-secondary rounded w-1/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
