'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserOrders } from '@/lib/firestore'
import { OrderDoc } from '@/types'

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-[#F5EAD8] text-[#5C2B0F]',
  paid:       'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped:    'bg-indigo-50 text-indigo-700',
  delivered:  'bg-[#E4F2EA] text-[#1A5C3A]',
  cancelled:  'bg-red-50 text-red-600',
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
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-2">Account</p>
          <h1 className="font-playfair text-4xl font-bold text-[#1C0A00]">My Orders</h1>
        </div>
        <Link href="/account" className="text-sm font-semibold text-[#5C2B0F] hover:underline hidden sm:block">
          ← Dashboard
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        {['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              filter === s
                ? 'bg-[#5C2B0F] text-[#FAF6EF]'
                : 'bg-white text-[#7A5A42] border border-[#E8D5B8] hover:border-[#5C2B0F] hover:text-[#5C2B0F]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#A08060]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#A08060]">
          <p className="text-4xl mb-4">📦</p>
          <p className="font-medium">No orders yet.</p>
          <Link href="/products" className="inline-block mt-4 text-[#5C2B0F] font-semibold hover:underline text-sm">
            Shop now
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EF] text-left border-b border-[#F2E4CE]">
                  {['Order #', 'Date', 'Items', 'Total', 'Status', 'Invoice', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#7A5A42] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EAD8]">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6EF] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#5C2B0F]">{order.invoiceNumber}</td>
                    <td className="px-5 py-3.5 text-[#7A5A42] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-5 py-3.5 text-[#7A5A42]">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#1C0A00]">${(order.total / 100).toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${STATUS_STYLES[order.status] ?? 'bg-[#F5EAD8] text-[#5C2B0F]'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {order.invoiceUrl ? (
                        <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-[#5C2B0F] hover:underline text-xs font-semibold">
                          Download
                        </a>
                      ) : (
                        <span className="text-[#D0B898] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/account/orders/${order.id}`} className="text-[#5C2B0F] hover:underline text-xs font-semibold">
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
