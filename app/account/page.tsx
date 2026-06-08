'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, getUserOrders } from '@/lib/firestore'
import { UserDoc, OrderDoc } from '@/types'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserDoc | null>(null)
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/auth/login?redirect=/account')
        return
      }
      const [userData, ordersData] = await Promise.all([
        getUser(firebaseUser.uid),
        getUserOrders(firebaseUser.uid),
      ])
      setUser(userData)
      setOrders(ordersData.slice(0, 5))
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 text-center text-[#A08060]">
        Loading...
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">My Account</p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-[#1C0A00] mb-2">
              Welcome, {user?.name?.split(' ')[0]}!
            </h1>
            {user?.role === 'wholesale' && user.approved && (
              <span className="inline-flex items-center gap-1.5 bg-[#5C2B0F] text-[#FAF6EF] text-xs px-3 py-1.5 rounded-full font-semibold">
                🏢 Wholesale Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Total Spent', value: `$${(totalSpent / 100).toFixed(2)}` },
          { label: 'Active Orders', value: orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-center">
            <p className="text-3xl font-bold text-[#5C2B0F] font-playfair">{value}</p>
            <p className="text-sm text-[#A08060] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#1C0A00]">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs font-semibold text-[#5C2B0F] hover:underline">
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-[#A08060] text-sm py-6 text-center">No orders yet. Time to stock up!</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF6EF] transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1A0800]">{order.invoiceNumber}</p>
                  <p className="text-xs text-[#A08060] mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-AU')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#5C2B0F]">
                    ${(order.total / 100).toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                    order.status === 'delivered' ? 'bg-[#E4F2EA] text-[#1A5C3A]' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-[#F5EAD8] text-[#5C2B0F]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'View All Orders', href: '/account/orders', icon: '📦' },
          { label: 'My Favourites', href: '/account/favorites', icon: '❤️' },
          { label: 'Edit Profile', href: '/account/profile', icon: '👤' },
        ].map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow group"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-semibold text-[#3D1A08] group-hover:text-[#5C2B0F] transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
