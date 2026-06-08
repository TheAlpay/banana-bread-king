'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getOrder } from '@/lib/firestore'
import { OrderDoc } from '@/types'

const STATUS_STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const router = useRouter()
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<OrderDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push('/auth/login'); return }
      const data = await getOrder(orderId)
      if (!data || data.userId !== user.uid) { router.push('/account/orders'); return }
      setOrder(data)
      setLoading(false)
    })
  }, [orderId, router])

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-[#B89878]">Loading...</div>
  if (!order) return null

  const stepIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F]">Order Details</h1>
          <p className="text-[#A08060] text-sm mt-1">{order.invoiceNumber}</p>
        </div>
        <Link href="/account/orders" className="text-sm text-[#5C2B0F] hover:underline">← Orders</Link>
      </div>

      {/* Status timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-[#1C0A00] mb-4 text-sm">Order Status</h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex
              const active = i === stepIndex
              return (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      done ? 'bg-[#5C2B0F] border-[#5C2B0F] text-white' : 'bg-white border-[#E8D5B8] text-[#D0B898]'
                    }`}>
                      {done && i < stepIndex ? '✓' : i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < stepIndex ? 'bg-[#5C2B0F]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <p className={`text-xs mt-2 capitalize font-medium ${active ? 'text-[#5C2B0F]' : done ? 'text-[#7A5A42]' : 'text-[#D0B898]'}`}>
                    {step}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-6">
          This order was cancelled.
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-[#1C0A00] mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-[#3D1A08]">{item.name} ({item.variety}) × {item.quantity}</span>
              <span className="font-medium">${(item.total / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#F2E4CE] mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-[#A08060]">
            <span>Subtotal</span><span>${(order.subtotal / 100).toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount {order.discountCode ? `(${order.discountCode})` : ''}</span>
              <span>−${(order.discountAmount / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#A08060]">
            <span>GST (10%)</span><span>${(order.gst / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-[#1C0A00] pt-1">
            <span>Total</span><span>${(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping + Invoice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-[#1C0A00] mb-3 text-sm">Shipping Address</h2>
          <div className="text-sm text-[#7A5A42] space-y-0.5">
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress.city} {order.shippingAddress.state} {order.shippingAddress.postcode}</p>
          </div>
        </div>
        {order.invoiceUrl && (
          <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col justify-between">
            <h2 className="font-semibold text-[#1C0A00] mb-3 text-sm">Invoice</h2>
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#5C2B0F] text-[#FAF6EF] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3D1A08] transition-colors"
            >
              🧾 Download Invoice PDF
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
