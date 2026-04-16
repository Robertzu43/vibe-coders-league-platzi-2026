"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Product } from '@/lib/products'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NeuralNetworkBg } from '@/components/neural-network-bg'

interface HeroSectionProps {
  featuredProducts: Product[]
}

function useTypewriter(line1: string, line2: string, speed = 80) {
  const [displayLine1, setDisplayLine1] = useState("")
  const [displayLine2, setDisplayLine2] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(true)
  const prevLine1 = useRef(line1)
  const prevLine2 = useRef(line2)

  useEffect(() => {
    // Reset when text changes (language switch)
    setDisplayLine1("")
    setDisplayLine2("")
    setShowCursor(true)
    setIsTyping(true)
    prevLine1.current = line1
    prevLine2.current = line2

    let charIndex = 0
    const totalChars = line1.length + line2.length

    const interval = setInterval(() => {
      charIndex++

      if (charIndex <= line1.length) {
        setDisplayLine1(line1.slice(0, charIndex))
      } else if (charIndex <= totalChars) {
        const line2Index = charIndex - line1.length
        setDisplayLine2(line2.slice(0, line2Index))
      } else {
        clearInterval(interval)
        setIsTyping(false)

        // Blink cursor a few times then hide it
        let blinks = 0
        const blinkInterval = setInterval(() => {
          blinks++
          setShowCursor((prev) => !prev)
          if (blinks >= 6) {
            clearInterval(blinkInterval)
            setShowCursor(false)
          }
        }, 400)
      }
    }, speed)

    return () => {
      clearInterval(interval)
    }
  }, [line1, line2, speed])

  return { displayLine1, displayLine2, showCursor, isTyping }
}

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  const { t } = useLanguage()
  const { displayLine1, displayLine2, showCursor, isTyping } = useTypewriter(
    t.hero.title1,
    t.hero.title2
  )

  // Determine where the cursor should be shown
  const cursorOnLine1 = displayLine1.length < t.hero.title1.length
  const cursorOnLine2 = !cursorOnLine1

  return (
    <section className="relative overflow-hidden">
      {/* Neural Network Background */}
      <NeuralNetworkBg />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" style={{ zIndex: 1 }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" style={{ zIndex: 1 }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32" style={{ zIndex: 2 }}>
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            {t.hero.badge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight text-balance">
            {displayLine1}
            {showCursor && cursorOnLine1 && (
              <span className="text-primary animate-pulse">|</span>
            )}
            <span className="block text-primary mt-2">
              {displayLine2}
              {showCursor && cursorOnLine2 && (
                <span className="animate-pulse">|</span>
              )}
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-base font-semibold">
              <Link href="/catalog">
                {t.hero.shopBtn}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold border-border hover:bg-secondary">
              <Link href="#featured">
                {t.hero.viewBtn}
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured Products Spotlight */}
        <div id="featured" className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {featuredProducts.slice(0, 2).map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group relative bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  preload={index === 0}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                {product.badge && (
                  <Badge className="mb-3 bg-primary text-primary-foreground">
                    {product.badge}
                  </Badge>
                )}
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t.hero.viewDetails}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
