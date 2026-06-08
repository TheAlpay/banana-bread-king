'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { OrderDoc, OrderStatus } from '@/types'
import Button from '@/components/ui/Button'

const STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'orders', orderId)).then((snap) => {
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() } as OrderDoc)
      setLoading(false)
    })
  }, [orderId])

  async function updateStatus(status: OrderStatus) {
    setStatusUpdating(true)
    await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date().toISOString() })
    setOrder((o) => o ? { ...o, status } : o)
    setStatusUpdating(false)
  }

  async function saveNotes() {
    await updateDoc(doc(db, 'orders', orderId), { adminNotes: notes })
  }

  async function generateInvoice() {
    setInvoiceLoading(true)
    try {
      const { auth } = await import('@/lib/firebase')
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.invoiceUrl) setOrder((o) => o ? { ...o, invoiceUrl: data.invoiceUrl } : o)
    } finally {
      setInvoiceLoading(false)
    }
  }

  async function sendInvoice() {
    setEmailLoading(true)
    try {
      const { auth } = await import('@/lib/firebase')
      const token = await auth.currentUser?.getIdToken()
      await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      })
      alert('Invoice email sent!')
    } finally {
      setEmailLoading(false)
    }
  }

  if (loading) return <div className="py-16 text-center text-gray-400">Loading...</div>
  if (!order) return <div className="py-16 text-center text-gray-400">Order not found.</div>

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#8B4513]">Order {order.invoiceNumber}</h1>
          <p className="text-gray-400 text-sm mt-1">{new Date(order.createdAt).toLocaleString('en-AU')}</p>
        </div>
        <Link href="/admin/orders" className="text-sm text-[#8B4513] hover:underline">← Orders</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer info */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm">Customer</h2>
          <div className="text-sm space-y-1 text-gray-600">
            <p className="font-medium text-gray-900">{order.userName}</p>
            {order.userCompany && <p>{order.userCompany}</p>}
            <p>{order.userEmail}</p>
            <Link href={`/admin/users/${order.userId}`} className="text-[#8B4513] hover:underline text-xs">View profile →</Link>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm">Status</h2>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
            disabled={statusUpdating}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 capitalize"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm">Shipping</h2>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress.city} {order.shippingAddress.state} {order.shippingAddress.postcode}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2">Product</th><th className="pb-2 text-center">Qty</th>
            <th className="pb-2 text-right">Unit</th><th className="pb-2 text-right">Total</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2">{item.name} ({item.variety})</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">${(item.unitPrice / 100).toFixed(2)}</td>
                <td className="py-2 text-right font-medium">${(item.total / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-gray-100 mt-4 pt-4 text-sm space-y-1 text-right">
          <div className="flex justify-end gap-8 text-gray-500"><span>Subtotal</span><span>${(order.subtotal / 100).toFixed(2)}</span></div>
          {order.discountAmount > 0 && <div className="flex justify-end gap-8 text-green-600"><span>Discount</span><span>−${(order.discountAmount / 100).toFixed(2)}</span></div>}
          <div className="flex justify-end gap-8 text-gray-500"><span>GST</span><span>${(order.gst / 100).toFixed(2)}</span></div>
          <div className="flex justify-end gap-8 font-bold text-base"><span>Total</span><span>${(order.total / 100).toFixed(2)}</span></div>
        </div>
      </div>

      {/* Invoice actions + notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">Invoice</h2>
          <div className="flex flex-col gap-2">
            <Button onClick={generateInvoice} loading={invoiceLoading} variant="secondary" size="sm">
              {order.invoiceUrl ? 'Regenerate PDF' : 'Generate PDF'}
            </Button>
            {order.invoiceUrl && (
              <>
                <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:underline text-xs">
                  View Invoice PDF
                </a>
                <Button onClick={sendInvoice} loading={emailLoading} variant="ghost" size="sm">
                  Send Invoice Email
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm">Internal Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Admin notes (not visible to customer)..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 resize-none mb-2"
          />
          <Button onClick={saveNotes} variant="secondary" size="sm">Save Notes</Button>
        </div>
      </div>
    </div>
  )
}
