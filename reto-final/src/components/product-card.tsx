"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Product, getLocalizedName, getLocalizedDescription, getLocalizedBadge } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { locale, t } = useLanguage()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: getLocalizedName(product, locale),
      price: product.price,
      image: product.image,
      variant: product.variants?.[0],
    })
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.image}
            alt={getLocalizedName(product, locale)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {getLocalizedBadge(product, locale) && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-medium">
              {getLocalizedBadge(product, locale)}
            </Badge>
          )}
          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
            aria-label={t.product.addToCart}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {getLocalizedName(product, locale)}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {getLocalizedDescription(product, locale)}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-primary">${product.price}</span>
            {product.variants && (
              <span className="text-xs text-muted-foreground">
                {product.variants.length} {t.product.sizes}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
