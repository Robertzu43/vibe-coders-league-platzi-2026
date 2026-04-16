"use client"

import Link from 'next/link'
import { ArrowRight, Gift, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { NeuralNetworkBg } from '@/components/neural-network-bg'

export function CtaBanner() {
  const { locale } = useLanguage()

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <NeuralNetworkBg />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" style={{ zIndex: 1 }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 2 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          {locale === 'es' ? 'Nunca Pares de Aprender' : 'Never Stop Learning'}
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
          {locale === 'es'
            ? 'Viste tu pasión por aprender'
            : 'Wear your passion for learning'}
        </h2>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {locale === 'es'
            ? 'Desde hoodies premium hasta el Enter Destructor, cada producto celebra la cultura dev. Regala conocimiento con una suscripción Platzi.'
            : 'From premium hoodies to the Enter Destructor, every product celebrates dev culture. Gift knowledge with a Platzi subscription.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 text-base font-semibold">
            <Link href="/catalog">
              {locale === 'es' ? 'Explorar Catálogo' : 'Explore Catalog'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold border-primary/30 hover:bg-primary/10 text-primary">
            <Link href="/product/nunca-pares-gift-subscription">
              <Gift className="mr-2 w-5 h-5" />
              {locale === 'es' ? 'Regalar Suscripción' : 'Gift a Subscription'}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
