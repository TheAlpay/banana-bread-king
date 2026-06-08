'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Menu, X, User } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="bg-[#8B4513] text-[#fdf8f0] shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-playfair text-xl font-bold tracking-wide hover:opacity-90 transition-opacity">
          🍌 Banana Bread King
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="hover:text-[#f5d9b3] transition-colors">
            Shop
          </Link>
          <Link href="/products/classic" className="hover:text-[#f5d9b3] transition-colors">
            Classic Range
          </Link>
          <Link href="/products/gluten-free-vegan" className="hover:text-[#f5d9b3] transition-colors">
            GF & Vegan
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/account" className="hidden md:flex items-center gap-1 hover:text-[#f5d9b3] transition-colors">
            <User size={18} />
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-1 hover:text-[#f5d9b3] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#fdf8f0] text-[#8B4513] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#7a3b10] px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/products" onClick={() => setMobileOpen(false)}>Shop All</Link>
          <Link href="/products/classic" onClick={() => setMobileOpen(false)}>Classic Range</Link>
          <Link href="/products/gluten-free-vegan" onClick={() => setMobileOpen(false)}>GF & Vegan Range</Link>
          <Link href="/account" onClick={() => setMobileOpen(false)}>My Account</Link>
        </div>
      )}
    </header>
  )
}
