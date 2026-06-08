'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserDoc } from '@/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getDocs(collection(db, 'users')).then((snap) => {
      setUsers(snap.docs.map((d) => ({ ...d.data() } as UserDoc)))
      setLoading(false)
    })
  }, [])

  async function approveUser(uid: string) {
    await updateDoc(doc(db, 'users', uid), { approved: true })
    setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, approved: true } : u))
  }

  const filtered = users.filter((u) => {
    if (filter === 'customers') return u.role === 'customer'
    if (filter === 'wholesale') return u.role === 'wholesale' && u.approved
    if (filter === 'pending') return u.role === 'wholesale' && !u.approved
    return true
  })

  const pendingCount = users.filter((u) => u.role === 'wholesale' && !u.approved).length

  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#8B4513] mb-6">
        Users
        {pendingCount > 0 && (
          <span className="ml-3 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
            {pendingCount} pending approval
          </span>
        )}
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'customers', label: 'Customers' },
          { key: 'wholesale', label: 'Wholesale' },
          { key: 'pending', label: 'Pending' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === key ? 'bg-[#8B4513] text-[#fdf8f0]' : 'bg-white text-gray-600 hover:bg-[#f5e6d3]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fdf8f0] text-left">
                {['Name', 'Email', 'Role', 'Company', 'ABN', 'Approved', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.uid} className="hover:bg-[#fdf8f0] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-[#8B4513] text-[#fdf8f0]' :
                      user.role === 'wholesale' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.company || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{user.abn || '—'}</td>
                  <td className="px-4 py-3">
                    {user.role === 'wholesale' ? (
                      user.approved ? (
                        <span className="text-green-600 text-xs font-medium">✓ Approved</span>
                      ) : (
                        <button onClick={() => approveUser(user.uid)} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                          Approve
                        </button>
                      )
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('en-AU')}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${user.uid}`} className="text-[#8B4513] hover:underline text-xs font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
