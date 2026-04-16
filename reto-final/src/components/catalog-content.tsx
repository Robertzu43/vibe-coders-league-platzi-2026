"use client"

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { products } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCollection = searchParams.get('collection') || 'all'
  const { t } = useLanguage()

  const [activeCollection, setActiveCollection] = useState(initialCollection)
  const [sortBy, setSortBy] = useState('featured')

  const collections = [
    { value: 'all', label: t.catalog.filterAll },
    { value: 'premium', label: t.catalog.filterPremium },
    { value: 'fun', label: t.catalog.filterFun },
    { value: 'limited', label: t.catalog.filterLimited },
  ]

  const sortOptions = [
    { value: 'featured', label: t.catalog.sortFeatured },
    { value: 'price-asc', label: t.catalog.sortPriceLow },
    { value: 'price-desc', label: t.catalog.sortPriceHigh },
    { value: 'name', label: t.catalog.sortName },
  ]

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by collection
    if (activeCollection !== 'all') {
      filtered = filtered.filter(p => p.collection === activeCollection)
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return filtered
  }, [activeCollection, sortBy])

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Sort'

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Collection Pills */}
        <div className="flex flex-wrap gap-2">
          {collections.map(collection => (
            <button
              key={collection.value}
              onClick={() => setActiveCollection(collection.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeCollection === collection.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              {collection.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-border">
              <SlidersHorizontal className="w-4 h-4" />
              {currentSortLabel}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={cn(
                  "cursor-pointer",
                  sortBy === option.value && "text-primary font-medium"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {t.catalog.showing} {filteredAndSortedProducts.length} {filteredAndSortedProducts.length !== 1 ? t.catalog.products : t.catalog.product}
      </p>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{t.catalog.noProducts}</p>
        </div>
      )}
    </div>
  )
}
