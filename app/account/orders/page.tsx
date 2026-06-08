'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserOrders } from '@/lib/firestore'
import { OrderDoc } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push('/auth/login?redirect=/account/orders'); return }
      const data = await getUserOrders(user.uid)
      setOrders(data)
      setLoading(false)
    })
  }, [router])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl font-bold text-[#8B4513]">My Orders</h1>
        <Link href="/account" className="text-sm text-[#8B4513] hover:underline">← Dashboard</Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === s ? 'bg-[#8B4513] text-[#fdf8f0]' : 'bg-white text-gray-600 hover:bg-[#f5e6d3]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <p>No orders yet.</p>
          <Link href="/products" className="inline-block mt-4 text-[#8B4513] hover:underline text-sm">Shop now</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fdf8f0] text-left">
                  {['Order #', 'Date', 'Items', 'Total', 'Status', 'Invoice', 'Actions'].map((h) => (
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
                    <td className="px-4 py-3 text-gray-500">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 font-semibold">${(order.total / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.invoiceUrl ? (
                        <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:underline text-xs font-medium">
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/account/orders/${order.id}`} className="text-[#8B4513] hover:underline text-xs font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
