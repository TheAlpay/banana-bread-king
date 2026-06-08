'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useCartStore } from '@/store/cartStore'
import { Address } from '@/types'
import Button from '@/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal } = useCartStore()
  const [uid, setUid] = useState<string | null>(null)
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isWholesale, setIsWholesale] = useState(false)
  const [invoiceRequested, setInvoiceRequested] = useState(false)
  const [notes, setNotes] = useState('')
  const [address, setAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: 'QLD',
    postcode: '',
    country: 'Australia',
  })

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login?redirect=/checkout')
        return
      }
      setUid(user.uid)
      const t = await user.getIdToken()
      setToken(t)
    })
  }, [router])

  useEffect(() => {
    if (items.length === 0) router.push('/cart')
  }, [items, router])

  function updateAddress(k: keyof Address, v: string) {
    setAddress((a) => ({ ...a, [k]: v }))
  }

  const subtotal = getSubtotal()
  const gst = Math.round(subtotal * 0.1)
  const total = subtotal + gst

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!uid || !token) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          notes,
          invoiceRequested,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F] mb-8">Checkout</h1>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#1C0A00]">Shipping Address</h2>
          {[
            { label: 'Address Line 1', key: 'line1', placeholder: '123 Banana St', required: true },
            { label: 'Address Line 2', key: 'line2', placeholder: 'Unit 4', required: false },
            { label: 'City', key: 'city', placeholder: 'Brisbane', required: true },
            { label: 'State', key: 'state', placeholder: 'QLD', required: true },
            { label: 'Postcode', key: 'postcode', placeholder: '4000', required: true },
          ].map(({ label, key, placeholder, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#3D1A08] mb-1">{label}</label>
              <input
                type="text"
                value={address[key as keyof Address] ?? ''}
                onChange={(e) => updateAddress(key as keyof Address, e.target.value)}
                required={required}
                placeholder={placeholder}
                className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-[#3D1A08] mb-1">Order Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special instructions..."
              className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F] resize-none"
            />
          </div>

          {isWholesale && (
            <label className="flex items-center gap-3 cursor-pointer bg-[#FAF6EF] rounded-xl p-4">
              <input
                type="checkbox"
                checked={invoiceRequested}
                onChange={(e) => setInvoiceRequested(e.target.checked)}
                className="w-4 h-4"
              />
              <div>
                <p className="text-sm font-medium text-[#3D1A08]">Request invoice (Net 30)</p>
                <p className="text-xs text-[#B89878]">Our team will contact you for payment arrangements.</p>
              </div>
            </label>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="font-semibold text-[#1C0A00] mb-4">Order Summary</h2>
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variety}`} className="flex justify-between text-sm">
                <span className="text-[#7A5A42]">{item.name} ({item.variety}) × {item.quantity}</span>
                <span className="font-medium">${((item.unitPrice * item.quantity) / 100).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-[#F2E4CE] pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#A08060]">
                <span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#A08060]">
                <span>GST (10%)</span><span>${(gst / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#1C0A00]">
                <span>Total</span><span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-4" size="lg">
              Pay with Stripe
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
