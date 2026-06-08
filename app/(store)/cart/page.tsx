'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

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
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-28 text-center">
        <ShoppingBag size={48} className="mx-auto mb-5 text-[#D0B898]" />
        <h1 className="font-playfair text-4xl font-bold text-[#1C0A00] mb-3">Your cart is empty</h1>
        <p className="text-[#A08060] mb-10">Add some banana bread to get started!</p>
        <Link
          href="/products"
          className="bg-[#5C2B0F] text-[#FAF6EF] px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors inline-block shadow-sm"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">Review</p>
      <h1 className="font-playfair text-4xl font-bold text-[#1C0A00] mb-3">Your Cart</h1>

      {isCarton() && (
        <div className="inline-flex items-center gap-2 bg-[#E4F2EA] border border-[#B8DEC8] text-[#1A5C3A] text-sm font-semibold px-4 py-2.5 rounded-xl mb-8">
          🎉 {cartons} full carton{cartons > 1 ? 's' : ''}{individuals > 0 ? ` + ${individuals} individual` : ''} — bulk order!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variety}`} className="bg-white rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex gap-4">
              <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F5EAD8]">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1A0800] leading-tight">{item.name}</p>
                <p className="text-xs text-[#A08060] mt-0.5">{item.variety}</p>
                <p className="text-[#5C2B0F] font-bold text-sm mt-1">${(item.unitPrice / 100).toFixed(2)} each</p>
              </div>
              <div className="flex flex-col items-end justify-between flex-shrink-0">
                <button
                  onClick={() => removeItem(item.productId, item.variety)}
                  className="text-[#D0B898] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <div className="flex items-center gap-1.5 bg-[#F5EAD8] rounded-lg px-1.5 py-1 border border-[#E8D5B8]">
                  <button
                    onClick={() => updateQuantity(item.productId, item.variety, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#5C2B0F] hover:bg-[#E8D5B8] rounded transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-sm font-bold text-[#1A0800] w-5 text-center tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variety, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#5C2B0F] hover:bg-[#E8D5B8] rounded transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <p className="text-sm font-bold text-[#1A0800]">
                  ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 h-fit">
          <h2 className="font-semibold text-[#1C0A00] mb-5">Order Summary</h2>

          {/* Discount */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#7A5A42] mb-2">
              Discount Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10"
                className="flex-1 border-2 border-[#E8D5B8] rounded-xl px-3 py-2.5 text-sm text-[#1C0A00] placeholder:text-[#C4A882] focus:outline-none focus:border-[#5C2B0F] bg-[#FAF6EF] transition-colors"
              />
              <button
                onClick={validateDiscount}
                disabled={discountLoading || !discountCode}
                className="bg-[#F5EAD8] text-[#5C2B0F] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E8D5B8] transition-colors disabled:opacity-50"
              >
                {discountLoading ? '...' : 'Apply'}
              </button>
            </div>
            {discountResult?.error && (
              <p className="text-red-500 text-xs mt-1.5">{discountResult.error}</p>
            )}
            {discountResult?.discount != null && discountResult.discount > 0 && (
              <p className="text-[#1A5C3A] text-xs mt-1.5 font-semibold">
                ✓ Saving ${(discountResult.discount / 100).toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm border-t border-[#F2E4CE] pt-4">
            <div className="flex justify-between text-[#7A5A42]">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#1A5C3A] font-medium">
                <span>Discount</span>
                <span>−${(discount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#7A5A42]">
              <span>GST (10%)</span>
              <span>${(gst / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-[#1C0A00] pt-2 border-t border-[#F2E4CE]">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex items-center justify-center w-full mt-5 bg-[#5C2B0F] text-[#FAF6EF] py-3.5 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors shadow-sm"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="block text-center text-sm text-[#5C2B0F] font-medium mt-3 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
