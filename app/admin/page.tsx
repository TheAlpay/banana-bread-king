'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// This is a client component that fetches from admin API — for now, uses fetch
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-playfair text-3xl font-bold text-[#8B4513] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Orders Today', value: '—', icon: '📦', color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending Orders', value: '—', icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Pending Wholesale', value: '—', icon: '🏢', color: 'bg-orange-50 text-orange-700' },
          { label: 'Total Customers', value: '—', icon: '👥', color: 'bg-purple-50 text-purple-700' },
          { label: 'Revenue (Month)', value: '—', icon: '💰', color: 'bg-green-50 text-green-700' },
          { label: 'Low Stock', value: '—', icon: '⚠️', color: 'bg-red-50 text-red-700' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-3 ${color}`}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Quick Links</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'View Orders', href: '/admin/orders', icon: '📦' },
            { label: 'Manage Products', href: '/admin/products', icon: '🍌' },
            { label: 'Approve Wholesale', href: '/admin/users?filter=pending', icon: '✅' },
            { label: 'Create Discount', href: '/admin/discounts', icon: '🏷️' },
          ].map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-[#fdf8f0] hover:border-[#8B4513]/20 transition-colors text-center"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-gray-600">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
