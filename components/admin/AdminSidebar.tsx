'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/products', label: 'Products', icon: '🍌' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/discounts', label: 'Discounts', icon: '🏷️' },
  { href: '/admin/invoices', label: 'Invoices', icon: '🧾' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await signOut(auth)
    document.cookie = 'firebase-token=; path=/; max-age=0'
    router.push('/auth/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-[#4a2a10]">
        <Link href="/admin" className="font-playfair text-lg font-bold text-[#fdf8f0]">
          🍌 BBK Admin
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#8B4513] text-[#fdf8f0]'
                  : 'text-[#c9a87c] hover:bg-[#4a2a10] hover:text-[#fdf8f0]'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-[#4a2a10]">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-[#c9a87c] hover:bg-[#4a2a10] hover:text-[#fdf8f0] transition-colors"
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#5C3317] text-[#fdf8f0] p-2 rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#5C3317] z-40 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 bg-[#5C3317] h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>
    </>
  )
}
