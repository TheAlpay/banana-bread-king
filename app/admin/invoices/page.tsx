'use client'

import { useEffect, useState } from 'react'
import { getDocs, collection, orderBy, query } from 'firebase/firestore'
import { getDb, auth } from '@/lib/firebase'
import { OrderDoc } from '@/types'
import Button from '@/components/ui/Button'

export default function AdminInvoicesPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    getDocs(query(collection(getDb(), 'orders'), orderBy('createdAt', 'desc'))).then((snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc)).filter((o) => o.invoiceNumber))
      setLoading(false)
    })
  }, [])

  async function regenerate(orderId: string) {
    setActionLoading(orderId)
    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.invoiceUrl) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, invoiceUrl: data.invoiceUrl } : o))
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function resendEmail(orderId: string) {
    setActionLoading(orderId + '-email')
    try {
      const token = await auth.currentUser?.getIdToken()
      await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      })
      alert('Invoice email sent!')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F] mb-6">Invoices</h1>

      {loading ? (
        <div className="text-center py-16 text-[#B89878]">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EF] text-left">
                  {['Invoice #', 'Order', 'Customer', 'Amount', 'Date', 'PDF', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium text-[#7A5A42] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6EF] transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-[#5C2B0F]">{order.invoiceNumber}</td>
                    <td className="px-4 py-3 text-[#A08060]">{order.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3">{order.userName}</td>
                    <td className="px-4 py-3 font-semibold">${(order.total / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#B89878] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-4 py-3">
                      {order.invoiceUrl ? (
                        <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-[#5C2B0F] hover:underline text-xs">
                          View PDF
                        </a>
                      ) : <span className="text-[#D0B898] text-xs">Not generated</span>}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => regenerate(order.id)}
                        disabled={actionLoading === order.id}
                        className="text-[#5C2B0F] hover:underline text-xs font-medium disabled:opacity-50"
                      >
                        {actionLoading === order.id ? '...' : 'Regenerate'}
                      </button>
                      {order.invoiceUrl && (
                        <button
                          onClick={() => resendEmail(order.id)}
                          disabled={actionLoading === order.id + '-email'}
                          className="text-blue-500 hover:underline text-xs font-medium disabled:opacity-50"
                        >
                          {actionLoading === order.id + '-email' ? '...' : 'Resend Email'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-[#B89878]">No invoices yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
