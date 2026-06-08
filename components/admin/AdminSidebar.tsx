'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Menu, X, LogOut } from 'lucide-react'

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
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <Link href="/admin" className="font-playfair text-lg font-bold text-[#FAF6EF] flex items-center gap-2">
          <span className="text-[#C6862A]">🍌</span>
          BBK Admin
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#5C2B0F] text-[#FAF6EF]'
                  : 'text-[#8A6A52] hover:bg-white/[0.06] hover:text-[#FAF6EF]'
              }`}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#8A6A52] hover:bg-white/[0.06] hover:text-[#FAF6EF] transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1C0A00] text-[#FAF6EF] p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#1C0A00] z-40 transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 bg-[#1C0A00] h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>
    </>
  )
}
