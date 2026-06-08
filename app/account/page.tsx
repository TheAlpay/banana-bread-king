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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center text-gray-400">
        Loading...
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#8B4513]">
            Welcome, {user?.name?.split(' ')[0]}!
          </h1>
          {user?.role === 'wholesale' && user.approved && (
            <span className="inline-flex items-center gap-1 bg-[#8B4513] text-[#fdf8f0] text-xs px-3 py-1 rounded-full mt-2 font-medium">
              🏢 Wholesale Account
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Total Spent', value: `$${(totalSpent / 100).toFixed(2)}` },
          { label: 'Active Orders', value: orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-2xl font-bold text-[#8B4513]">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-[#8B4513] hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#fdf8f0] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.invoiceNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-AU')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#8B4513]">
                    ${(order.total / 100).toFixed(2)}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
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
            className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
