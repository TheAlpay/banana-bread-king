'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getDoc, doc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserDoc, UserRole, OrderDoc } from '@/types'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function AdminUserDetailPage() {
  const router = useRouter()
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<UserDoc | null>(null)
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customPrice, setCustomPrice] = useState('')
  const [role, setRole] = useState<UserRole>('customer')

  useEffect(() => {
    async function load() {
      const userSnap = await getDoc(doc(db, 'users', userId))
      if (!userSnap.exists()) { router.push('/admin/users'); return }
      const userData = userSnap.data() as UserDoc
      setUser(userData)
      setRole(userData.role)
      setCustomPrice(userData.customPriceOverride ? (userData.customPriceOverride / 100).toFixed(2) : '')

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const ordersSnap = await getDocs(q)
      setOrders(ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc)))
      setLoading(false)
    }
    load()
  }, [userId, router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    try {
      const updates: Partial<UserDoc> = { role }
      if (customPrice) {
        updates.customPriceOverride = Math.round(Number(customPrice) * 100)
      } else {
        updates.customPriceOverride = undefined
      }
      await updateDoc(doc(db, 'users', userId), updates as Record<string, unknown>)
      setUser((u) => u ? { ...u, ...updates } : u)
    } finally {
      setSaving(false)
    }
  }

  async function handleApprove() {
    await updateDoc(doc(db, 'users', userId), { approved: true })
    setUser((u) => u ? { ...u, approved: true } : u)
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-400">Loading...</div>
  }
  if (!user) return null

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-[#8B4513] mb-2 flex items-center gap-1">
            ← Back to Users
          </button>
          <h1 className="font-playfair text-3xl font-bold text-[#8B4513]">{user.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>
        {user.role === 'wholesale' && !user.approved && (
          <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
            Approve Wholesale
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Total Spent', value: `$${(totalSpent / 100).toFixed(2)}` },
          { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-AU') },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-xl font-bold text-[#8B4513]">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
              >
                <option value="customer">Customer</option>
                <option value="wholesale">Wholesale</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Price Override (AUD / loaf)
              </label>
              <p className="text-xs text-gray-400 mb-2">Overrides base product price for this user. Leave blank to use default pricing.</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="e.g. 9.50"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
                />
              </div>
            </div>
            <Button onClick={handleSave} loading={saving} size="lg" className="w-full">
              Save Changes
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">User Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.role === 'wholesale' && !user.approved ? 'bg-orange-100 text-orange-700' :
                  user.approved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role === 'wholesale' && !user.approved ? 'Pending Approval' : user.approved ? 'Approved' : 'Active'}
                </span>
              </dd>
            </div>
            {user.company && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Company</dt>
                <dd className="font-medium">{user.company}</dd>
              </div>
            )}
            {user.abn && (
              <div className="flex justify-between">
                <dt className="text-gray-500">ABN</dt>
                <dd className="font-medium">{user.abn}</dd>
              </div>
            )}
            {user.shippingAddress && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Address</dt>
                <dd className="font-medium text-right">
                  {user.shippingAddress.line1},<br />
                  {user.shippingAddress.city} {user.shippingAddress.state} {user.shippingAddress.postcode}
                </dd>
              </div>
            )}
            {user.customPriceOverride && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Custom Price</dt>
                <dd className="font-medium text-[#8B4513]">${(user.customPriceOverride / 100).toFixed(2)} / loaf</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Order History</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fdf8f0] text-left">
                  {['Invoice', 'Date', 'Items', 'Total', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fdf8f0] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.invoiceNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-4 py-3 font-semibold text-[#8B4513]">${(order.total / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
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
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
