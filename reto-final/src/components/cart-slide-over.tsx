"use client"

import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'

export function CartSlideOver() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const { t } = useLanguage()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">{t.cart.yourCart}</h2>
              {totalItems > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
              aria-label={t.cart.closeCart}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-2">{t.cart.emptyCart}</p>
                <p className="text-muted-foreground text-sm">
                  {t.cart.emptyCartDescription}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.variant}-${index}`}
                    className="flex gap-4 p-4 bg-card rounded-2xl border border-border"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t.cart.size}: {item.variant}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-primary mt-1">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-border flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3 text-foreground" />
                        </button>
                        <span className="text-sm font-medium text-foreground w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-border flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3 text-foreground" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.variant)}
                      className="self-start p-1.5 rounded-lg hover:bg-secondary transition-colors"
                      aria-label={t.cart.removeItem}
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span className="text-xl font-bold text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button className="w-full h-12 text-base font-semibold">
                {t.cart.checkout}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {t.cart.shippingNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
