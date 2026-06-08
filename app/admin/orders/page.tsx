'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { OrderDoc } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc)))
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#8B4513] mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-[#8B4513] text-[#fdf8f0]' : 'bg-white text-gray-600 hover:bg-[#f5e6d3]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fdf8f0] text-left">
                  {['Order #', 'Date', 'Customer', 'Company', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fdf8f0] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#8B4513]">{order.invoiceNumber}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-4 py-3">{order.userName}</td>
                    <td className="px-4 py-3 text-gray-400">{order.userCompany || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-4 py-3 font-semibold">${(order.total / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#8B4513] hover:underline text-xs font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
