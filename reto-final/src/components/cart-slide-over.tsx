"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, CreditCard, Wallet, Coins, CheckCircle2, Loader2, Check, Sparkles } from 'lucide-react'
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

// --- Confetti Particle Component ---
function ConfettiParticle({ delay, color, left }: { delay: number; color: string; left: number }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti-fall pointer-events-none"
      style={{
        backgroundColor: color,
        left: `${left}%`,
        animationDelay: `${delay}ms`,
        top: '-8px',
      }}
    />
  )
}

function ConfettiEffect() {
  const colors = ['#0AE88A', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FCD34D', '#F59E0B', '#818CF8']
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: Math.random() * 600,
    color: colors[i % colors.length],
    left: Math.random() * 100,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} delay={p.delay} color={p.color} left={p.left} />
      ))}
    </div>
  )
}

// --- Processing Step Component ---
function ProcessingStep({
  label,
  status,
}: {
  label: string
  status: 'pending' | 'active' | 'complete'
}) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 ${
      status === 'pending' ? 'opacity-40' : 'opacity-100'
    }`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
        status === 'complete'
          ? 'bg-[#0AE88A] scale-100'
          : status === 'active'
            ? 'border-2 border-[#0AE88A] scale-110'
            : 'border-2 border-[#3A3A3A]'
      }`}>
        {status === 'complete' ? (
          <Check className="w-3.5 h-3.5 text-black" />
        ) : status === 'active' ? (
          <div className="w-2 h-2 rounded-full bg-[#0AE88A] animate-pulse" />
        ) : null}
      </div>
      <span className={`text-sm transition-colors duration-500 ${
        status === 'complete'
          ? 'text-[#0AE88A] font-medium'
          : status === 'active'
            ? 'text-white font-medium'
            : 'text-[#6B6B6B]'
      }`}>
        {label}
      </span>
    </div>
  )
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

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Snapshot of items/total for processing screen
  const [processingSnapshot, setProcessingSnapshot] = useState<{
    items: typeof items
    subtotal: number
    discountAmount: number
    total: number
    discountPercent: number | null
  } | null>(null)

  // Ref to store API promise result
  const apiResultRef = useRef<{ orderNumber: string; total: number } | null>(null)
  const apiDoneRef = useRef(false)

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

  // Transition from processing to success
  const finishProcessing = useCallback(() => {
    const result = apiResultRef.current
    if (result) {
      setIsProcessing(false)
      setProcessingStep(0)
      setOrderSuccess(result)
      setShowConfetti(true)
      apiResultRef.current = null
      apiDoneRef.current = false
      // Hide confetti after a few seconds
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  // Animate through processing steps
  useEffect(() => {
    if (!isProcessing) return

    const stepDelays = [0, 600, 1200, 1800]
    const timers: ReturnType<typeof setTimeout>[] = []

    stepDelays.forEach((delay, index) => {
      const timer = setTimeout(() => {
        setProcessingStep(index + 1)
      }, delay)
      timers.push(timer)
    })

    // After all steps complete + buffer, check if API is done
    const finalTimer = setTimeout(() => {
      if (apiDoneRef.current) {
        finishProcessing()
      } else {
        // API still pending; the handlePlaceOrder will call finishProcessing when ready
      }
    }, 2600)
    timers.push(finalTimer)

    return () => timers.forEach(clearTimeout)
  }, [isProcessing, finishProcessing])

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    // Snapshot current cart state for display during processing
    setProcessingSnapshot({
      items: [...items],
      subtotal,
      discountAmount,
      total,
      discountPercent: discount?.percent_off ?? null,
    })

    // Enter processing state
    setIsProcessing(true)
    setProcessingStep(0)
    apiResultRef.current = null
    apiDoneRef.current = false
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
        apiResultRef.current = { orderNumber: data.orderNumber, total: data.total }
        apiDoneRef.current = true
        // If the step animation already finished (step 4 complete + buffer passed), transition now
        // Otherwise the useEffect timer will handle it
        if (processingStep >= 4) {
          finishProcessing()
        }
      }
    } catch {
      // On error, exit processing and let user retry
      setIsProcessing(false)
      setProcessingStep(0)
    } finally {
      setOrderLoading(false)
    }
  }

  // Also check: if apiDone and steps are complete, finish
  useEffect(() => {
    if (isProcessing && apiDoneRef.current && processingStep >= 4) {
      const timer = setTimeout(() => finishProcessing(), 400)
      return () => clearTimeout(timer)
    }
  }, [isProcessing, processingStep, finishProcessing])

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
    setShowConfetti(false)
    setProcessingSnapshot(null)
    setIsOpen(false)
  }

  const paymentOptions: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: 'credit_card', label: t.cart.creditCard, icon: <CreditCard className="w-5 h-5" /> },
    { key: 'paypal', label: t.cart.paypal, icon: <Wallet className="w-5 h-5" /> },
    { key: 'platzi_credits', label: t.cart.platziCredits, icon: <Coins className="w-5 h-5" /> },
  ]

  const processingSteps = [
    t.cart.stepVerifyingItems,
    t.cart.stepApplyingDiscount,
    t.cart.stepProcessingPayment,
    t.cart.stepSendingConfirmation,
  ]

  const getStepStatus = (index: number): 'pending' | 'active' | 'complete' => {
    if (processingStep > index + 1) return 'complete'
    if (processingStep === index + 1) return 'active'
    return 'pending'
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => !isProcessing && setIsOpen(false)}
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
              {totalItems > 0 && !orderSuccess && !isProcessing && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            {!isProcessing && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-secondary transition-colors"
                aria-label={t.cart.closeCart}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Processing Screen */}
          {isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
              {/* Spinner */}
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-[#2A2A2A]" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0AE88A] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-[#0AE88A]" />
                </div>
              </div>

              {/* Processing text */}
              <h3 className="text-lg font-semibold text-white mb-8">
                {t.cart.processingOrder}
              </h3>

              {/* Animated steps */}
              <div className="w-full max-w-xs space-y-4 mb-10">
                {processingSteps.map((step, index) => (
                  <ProcessingStep
                    key={index}
                    label={step}
                    status={getStepStatus(index)}
                  />
                ))}
              </div>

              {/* Condensed order summary */}
              {processingSnapshot && (
                <div className="w-full max-w-xs bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-4">
                  <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider mb-3">
                    {t.cart.orderSummary}
                  </p>
                  <div className="space-y-1.5 mb-3">
                    {processingSnapshot.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-[#999] truncate mr-2">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[#CCC] shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#2A2A2A] pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{t.cart.total}</span>
                      <span className="text-lg font-bold text-[#0AE88A]">
                        ${processingSnapshot.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : orderSuccess ? (
            /* Order Success Screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative animate-in fade-in duration-500">
              {showConfetti && <ConfettiEffect />}

              <div className="relative w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 animate-in slide-in-from-bottom-4 duration-500">
                {t.cart.orderConfirmed}
              </h3>
              <div className="bg-card border border-border rounded-xl px-6 py-4 mb-4 w-full max-w-xs animate-in slide-in-from-bottom-4 duration-500 delay-100">
                <p className="text-sm text-muted-foreground mb-1">{t.cart.orderNumber}</p>
                <p className="text-lg font-mono font-bold text-primary">{orderSuccess.orderNumber}</p>
              </div>

              {/* Enhanced order details */}
              {processingSnapshot && (
                <div className="bg-card border border-border rounded-xl px-5 py-3 mb-4 w-full max-w-xs text-left animate-in slide-in-from-bottom-4 duration-500 delay-150">
                  <div className="space-y-1">
                    {processingSnapshot.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">{item.quantity}x {item.name}</span>
                        <span className="text-foreground shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {processingSnapshot.discountPercent && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-green-500">{t.cart.discountLine} (-{processingSnapshot.discountPercent}%)</span>
                      <span className="text-green-500">-${processingSnapshot.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border mt-2 pt-2 flex justify-between">
                    <span className="text-sm font-semibold text-foreground">{t.cart.total}</span>
                    <span className="text-base font-bold text-primary">${processingSnapshot.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                {t.cart.checkEmail}
              </p>
              <Button
                onClick={handleContinueShopping}
                className="w-full max-w-xs h-12 text-base font-semibold animate-in slide-in-from-bottom-4 duration-500 delay-300"
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
