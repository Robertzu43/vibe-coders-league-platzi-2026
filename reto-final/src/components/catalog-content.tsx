"use client"

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { products } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const collections = [
  { value: 'all', label: 'All Products' },
  { value: 'premium', label: 'Premium Collection' },
  { value: 'fun', label: 'Fun & Community' },
  { value: 'limited', label: 'Limited Edition' },
]

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Alphabetical' },
]

export function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCollection = searchParams.get('collection') || 'all'

  const [activeCollection, setActiveCollection] = useState(initialCollection)
  const [sortBy, setSortBy] = useState('featured')

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
        Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
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
          <p className="text-muted-foreground">No products found in this collection.</p>
        </div>
      )}
    </div>
  )
}
