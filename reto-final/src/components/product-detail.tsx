"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag, Check, Truck, Shield, RotateCcw } from 'lucide-react'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProductDetailProps {
  product: Product
}

const features = [
  { icon: Truck, label: 'Free shipping over $50' },
  { icon: Shield, label: '2-year warranty' },
  { icon: RotateCcw, label: '30-day returns' },
]

function getCollectionLabel(collection: string): string {
  switch (collection) {
    case 'premium':
      return 'Premium Collection'
    case 'fun':
      return 'Fun & Community'
    case 'limited':
      return 'Limited Edition'
    default:
      return collection
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || '')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: selectedVariant || undefined,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Breadcrumb */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-card rounded-3xl overflow-hidden border border-border">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              preload
            />
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Header */}
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
              {getCollectionLabel(product.collection)}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            {/* Product badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.badges.map(b => (
                  <Badge key={b} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-8">
            <span className="text-4xl font-bold text-primary">${product.price}</span>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-8">
              <label className="text-sm font-medium text-foreground mb-3 block">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-w-[60px]",
                      selectedVariant === variant
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className={cn(
                "w-full h-14 text-base font-semibold transition-all duration-300",
                isAdded && "bg-green-600 hover:bg-green-600"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="mt-10 pt-10 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map(feature => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
