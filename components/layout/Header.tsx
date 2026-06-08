'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { ShoppingBag, Menu, X, User } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="bg-[#1C0A00] text-[#FAF6EF] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[66px]">

        {/* Logo */}
        <Link href="/" className="font-playfair text-[22px] font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
          <span className="text-[#C6862A]">🍌</span>
          <span>Banana Bread King</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {[
            { href: '/products', label: 'Shop All' },
            { href: '/products/classic', label: 'Classic Range' },
            { href: '/products/gluten-free-vegan', label: 'GF & Vegan' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] font-medium text-[#B89878] hover:text-[#FAF6EF] transition-colors tracking-wide"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link href="/account" className="hidden md:block text-[#B89878] hover:text-[#FAF6EF] transition-colors" aria-label="Account">
            <User size={18} />
          </Link>

          <button
            onClick={openCart}
            className="relative text-[#B89878] hover:text-[#FAF6EF] transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#C6862A] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5 leading-none">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden text-[#B89878] hover:text-[#FAF6EF] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1C0A00] px-5 py-5 flex flex-col gap-1">
          {[
            { href: '/products', label: 'Shop All' },
            { href: '/products/classic', label: 'Classic Range' },
            { href: '/products/gluten-free-vegan', label: 'GF & Vegan Range' },
            { href: '/account', label: 'My Account' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-[#B89878] hover:text-white py-2.5 text-sm font-medium transition-colors border-b border-white/5 last:border-0"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
