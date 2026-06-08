'use client'

import { useEffect, useState } from 'react'
import { getDocs, collection, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { OrderDoc } from '@/types'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#5C2B0F', '#c47a45', '#F5EAD8', '#3d7a47', '#68a87a', '#a8d4b3']

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')

  useEffect(() => {
    getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'asc'))).then((snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc)))
      setLoading(false)
    })
  }, [])

  // Revenue over time
  const revenueData = (() => {
    const map: Record<string, number> = {}
    orders.filter((o) => o.status !== 'cancelled').forEach((o) => {
      const d = new Date(o.createdAt)
      let key: string
      if (period === 'daily') key = d.toLocaleDateString('en-AU')
      else if (period === 'weekly') {
        const weekStart = new Date(d)
        weekStart.setDate(d.getDate() - d.getDay())
        key = weekStart.toLocaleDateString('en-AU')
      } else key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map[key] = (map[key] ?? 0) + o.total / 100
    })
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }))
  })()

  // Orders by status
  const statusData = (() => {
    const map: Record<string, number> = {}
    orders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  })()

  // Top products
  const topProducts = (() => {
    const map: Record<string, { name: string; revenue: number }> = {}
    orders.filter((o) => o.status !== 'cancelled').forEach((o) =>
      o.items.forEach((item) => {
        if (!map[item.name]) map[item.name] = { name: item.name, revenue: 0 }
        map[item.name].revenue += item.total / 100
      })
    )
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  })()

  // Wholesale vs retail
  const revenueByType = (() => {
    let wholesale = 0, retail = 0
    orders.filter((o) => o.status !== 'cancelled').forEach((o) => {
      if (o.userCompany) wholesale += o.total / 100
      else retail += o.total / 100
    })
    return [
      { name: 'Retail', value: Math.round(retail * 100) / 100 },
      { name: 'Wholesale', value: Math.round(wholesale * 100) / 100 },
    ]
  })()

  if (loading) return <div className="py-16 text-center text-gray-400">Loading...</div>

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F] mb-8">Analytics</h1>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Revenue Over Time</h2>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${period === p ? 'bg-[#5C2B0F] text-[#FAF6EF]' : 'bg-[#F5EAD8] text-[#5C2B0F]'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8da" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#5C2B0F" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders by status */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Wholesale vs retail */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Wholesale vs Retail Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revenueByType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {revenueByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Top 5 Products by Revenue</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8da" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
            <Bar dataKey="revenue" fill="#5C2B0F" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
