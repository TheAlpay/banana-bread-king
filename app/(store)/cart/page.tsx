'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems, isCarton } = useCartStore()
  const [discountCode, setDiscountCode] = useState('')
  const [discountResult, setDiscountResult] = useState<{ discount?: number; error?: string } | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)

  const subtotal = getSubtotal()
  const totalItems = getTotalItems()
  const discount = discountResult?.discount ?? 0
  const afterDiscount = subtotal - discount
  const gst = Math.round(afterDiscount * 0.1)
  const total = afterDiscount + gst
  const cartons = Math.floor(totalItems / 10)
  const individuals = totalItems % 10

  async function validateDiscount() {
    setDiscountLoading(true)
    setDiscountResult(null)
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, orderAmount: subtotal, userId: 'guest' }),
      })
      const data = await res.json()
      if (data.valid && data.discount) {
        const d = data.discount
        const disc =
          d.type === 'percentage'
            ? Math.round(subtotal * (d.value / 100))
            : Math.min(d.value, subtotal)
        setDiscountResult({ discount: disc })
      } else {
        setDiscountResult({ error: data.error || 'Invalid code' })
      }
    } catch {
      setDiscountResult({ error: 'Could not validate code' })
    } finally {
      setDiscountLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-playfair text-3xl font-bold text-[#8B4513] mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some banana bread to get started!</p>
        <Link href="/products" className="bg-[#8B4513] text-[#fdf8f0] px-8 py-3 rounded-xl font-semibold hover:bg-[#7a3b10] transition-colors inline-block">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair text-3xl font-bold text-[#8B4513] mb-2">Your Cart</h1>
      {isCarton() && (
        <p className="text-green-700 bg-green-100 text-sm font-medium rounded-lg px-4 py-2 mb-6 inline-block">
          🎉 {cartons} full carton{cartons > 1 ? 's' : ''}{individuals > 0 ? ` + ${individuals} individual` : ''} — bulk order!
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variety}`} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
              <div className="w-20 h-20 bg-[#fdf8f0] rounded-xl flex-shrink-0 flex items-center justify-center text-3xl">🍌</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.variety}</p>
                <p className="text-[#8B4513] font-bold mt-1">${(item.unitPrice / 100).toFixed(2)} each</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.productId, item.variety)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-2 bg-[#f5e6d3] rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.productId, item.variety, item.quantity - 1)}>
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.variety, item.quantity + 1)}>
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

          {/* Discount */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Discount code"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]"
              />
              <Button variant="secondary" size="sm" onClick={validateDiscount} loading={discountLoading}>
                Apply
              </Button>
            </div>
            {discountResult?.error && (
              <p className="text-red-500 text-xs mt-1">{discountResult.error}</p>
            )}
            {discountResult?.discount && (
              <p className="text-green-600 text-xs mt-1 font-medium">
                ✓ Discount applied — saving ${(discountResult.discount / 100).toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−${(discount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>GST (10%)</span>
              <span>${(gst / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" className="block w-full mt-4">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/products" className="block text-center text-sm text-[#8B4513] mt-3 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
