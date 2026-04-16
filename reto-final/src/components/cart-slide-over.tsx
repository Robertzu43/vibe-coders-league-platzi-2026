"use client"

import { useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, CreditCard, Wallet, Coins, CheckCircle2, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type PaymentMethod = 'credit_card' | 'paypal' | 'platzi_credits'

interface DiscountState {
  code: string
  percent_off: number
  description: string
}

export function CartSlideOver() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()
  const { t } = useLanguage()

  // Discount state
  const [discountInput, setDiscountInput] = useState('')
  const [discount, setDiscount] = useState<DiscountState | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [discountSuccess, setDiscountSuccess] = useState('')

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')

  // Customer form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({})

  // Order state
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string; total: number } | null>(null)

  // Calculated values
  const subtotal = totalPrice
  const discountAmount = discount ? subtotal * (discount.percent_off / 100) : 0
  const total = Math.round((subtotal - discountAmount) * 100) / 100

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return

    setDiscountLoading(true)
    setDiscountError('')
    setDiscountSuccess('')

    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setDiscount({ code: data.code, percent_off: data.percent_off, description: data.description })
        setDiscountSuccess(`${t.cart.discountSuccess} -${data.percent_off}%`)
        setDiscountError('')
      } else {
        setDiscountError(t.cart.discountError)
        setDiscount(null)
      }
    } catch {
      setDiscountError(t.cart.discountError)
      setDiscount(null)
    } finally {
      setDiscountLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: { name?: string; email?: string } = {}

    if (!customerName.trim()) {
      errors.name = t.cart.nameRequired
    }
    if (!customerEmail.trim()) {
      errors.email = t.cart.emailRequired
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errors.email = t.cart.emailInvalid
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setOrderLoading(true)

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          items: items.map(item => ({
            name: item.name,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          paymentMethod,
          discountCode: discount?.code || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setOrderSuccess({ orderNumber: data.orderNumber, total: data.total })
      }
    } catch {
      // Silently handle - user can retry
    } finally {
      setOrderLoading(false)
    }
  }

  const handleContinueShopping = () => {
    clearCart()
    setOrderSuccess(null)
    setDiscount(null)
    setDiscountInput('')
    setDiscountError('')
    setDiscountSuccess('')
    setCustomerName('')
    setCustomerEmail('')
    setFormErrors({})
    setPaymentMethod('credit_card')
    setIsOpen(false)
  }

  const paymentOptions: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: 'credit_card', label: t.cart.creditCard, icon: <CreditCard className="w-5 h-5" /> },
    { key: 'paypal', label: t.cart.paypal, icon: <Wallet className="w-5 h-5" /> },
    { key: 'platzi_credits', label: t.cart.platziCredits, icon: <Coins className="w-5 h-5" /> },
  ]

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
              {totalItems > 0 && !orderSuccess && (
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

          {/* Order Success Screen */}
          {orderSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t.cart.orderConfirmed}
              </h3>
              <div className="bg-card border border-border rounded-xl px-6 py-4 mb-4 w-full max-w-xs">
                <p className="text-sm text-muted-foreground mb-1">{t.cart.orderNumber}</p>
                <p className="text-lg font-mono font-bold text-primary">{orderSuccess.orderNumber}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                {t.cart.checkEmail}
              </p>
              <Button
                onClick={handleContinueShopping}
                className="w-full max-w-xs h-12 text-base font-semibold"
              >
                {t.cart.continueShopping}
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-2">{t.cart.emptyCart}</p>
                    <p className="text-muted-foreground text-sm">
                      {t.cart.emptyCartDescription}
                    </p>
                  </div>
                ) : (
                  <div className="px-6 py-4 space-y-4">
                    {/* Items list */}
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

                    {/* Discount Code Input */}
                    <div className="pt-2">
                      <div className="flex gap-2">
                        <Input
                          value={discountInput}
                          onChange={(e) => setDiscountInput(e.target.value)}
                          placeholder={t.cart.discountPlaceholder}
                          className="flex-1 bg-card border-border"
                          onKeyDown={(e) => { if (e.key === 'Enter') handleApplyDiscount() }}
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyDiscount}
                          disabled={discountLoading || !discountInput.trim()}
                          className="shrink-0"
                        >
                          {discountLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t.cart.discountApply
                          )}
                        </Button>
                      </div>
                      {discountSuccess && (
                        <p className="text-xs text-green-500 mt-1.5">{discountSuccess}</p>
                      )}
                      {discountError && (
                        <p className="text-xs text-red-500 mt-1.5">{discountError}</p>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-card rounded-xl border border-border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t.cart.subtotal}</span>
                        <span className="text-sm font-medium text-foreground">${subtotal.toFixed(2)}</span>
                      </div>
                      {discount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-500">
                            {t.cart.discountLine} (-{discount.percent_off}%)
                          </span>
                          <span className="text-sm font-medium text-green-500">
                            -${discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-border pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-semibold text-foreground">{t.cart.total}</span>
                          <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">{t.cart.paymentMethod}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {paymentOptions.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => setPaymentMethod(option.key)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              paymentMethod === option.key
                                ? 'border-green-500 bg-green-500/5'
                                : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                          >
                            <span className={paymentMethod === option.key ? 'text-green-500' : 'text-muted-foreground'}>
                              {option.icon}
                            </span>
                            <span className={`text-xs font-medium ${
                              paymentMethod === option.key ? 'text-green-500' : 'text-muted-foreground'
                            }`}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          {t.cart.customerName}
                        </label>
                        <Input
                          value={customerName}
                          onChange={(e) => { setCustomerName(e.target.value); setFormErrors(prev => ({ ...prev, name: undefined })) }}
                          placeholder={t.cart.customerNamePlaceholder}
                          className="bg-card border-border"
                        />
                        {formErrors.name && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          {t.cart.customerEmail}
                        </label>
                        <Input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => { setCustomerEmail(e.target.value); setFormErrors(prev => ({ ...prev, email: undefined })) }}
                          placeholder={t.cart.customerEmailPlaceholder}
                          className="bg-card border-border"
                        />
                        {formErrors.email && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={orderLoading}
                      className="w-full h-12 text-base font-semibold"
                    >
                      {orderLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.cart.placingOrder}
                        </span>
                      ) : (
                        t.cart.placeOrder
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground pb-2">
                      {t.cart.shippingNote}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
