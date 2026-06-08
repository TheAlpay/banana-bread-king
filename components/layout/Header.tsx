'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

const CrownSvg = () => (
  <svg className="w-[22px] h-[22px] flex-none" viewBox="0 0 24 24" fill="none">
    <path d="M2 7l4 4 6-7 6 7 4-4-2 13H4L2 7z" stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round" fill="rgba(245,197,24,.12)"/>
  </svg>
)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '14px clamp(20px,5vw,72px)' : '22px clamp(20px,5vw,72px)',
          background: scrolled ? 'rgba(8,6,4,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--hairline-2)' : '1px solid transparent',
          transition: 'background .4s, backdrop-filter .4s, padding .4s, border-color .4s',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-anton)',
            fontSize: '20px',
            letterSpacing: '.04em',
            textTransform: 'uppercase',
            color: 'var(--cream)',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
          }}
        >
          <CrownSvg />
          Banana Bread King
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex" style={{ gap: '38px' }}>
          {[
            { href: '/products', label: 'Menu' },
            { href: '/about', label: 'Story' },
            { href: '/#why', label: 'Local' },
            { href: '/#foot', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: 'var(--cream-dim)',
                position: 'relative',
                padding: '4px 0',
                transition: 'color .3s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)'; }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: cart + order now + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Cart */}
          <button
            onClick={openCart}
            aria-label="Open cart"
            style={{
              position: 'relative',
              width: '42px', height: '42px',
              borderRadius: '50%',
              border: '1px solid var(--hairline)',
              display: 'grid',
              placeItems: 'center',
              background: 'none',
              cursor: 'pointer',
              transition: 'border-color .3s',
              color: 'var(--cream)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline)'; }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" style={{ width: '18px', height: '18px', stroke: 'var(--cream)' }}>
              <path d="M6 7h13l-1.3 9.3a2 2 0 0 1-2 1.7H9.3a2 2 0 0 1-2-1.7L6 7zM6 7L5 3H3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9.5" cy="20.5" r="1.2" fill="var(--cream)" stroke="none"/>
              <circle cx="16" cy="20.5" r="1.2" fill="var(--cream)" stroke="none"/>
            </svg>
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px', right: '-5px',
                  minWidth: '20px', height: '20px',
                  padding: '0 5px',
                  borderRadius: '999px',
                  background: 'var(--gold)',
                  color: '#1a1206',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  animation: 'cart-bump .5s cubic-bezier(.2,.8,.2,1)',
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Order Now button - desktop only */}
          <Link
            href="/products"
            className="hidden md:inline-flex bbk-btn bbk-btn-amber"
            style={{ padding: '11px 22px', fontSize: '13px' }}
          >
            Order Now
          </Link>

          {/* Hamburger - mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
            style={{
              width: '42px', height: '42px',
              border: '1px solid var(--hairline)',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M1 4h16M1 9h16M1 14h16" stroke="var(--cream)" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          background: 'rgba(8,6,4,0.98)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: 'opacity .4s, visibility .4s',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '24px', right: '24px',
            width: '48px', height: '48px',
            borderRadius: '50%',
            border: '1px solid var(--hairline)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            color: 'var(--cream)',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        {[
          { href: '/products', label: 'Menu' },
          { href: '/about', label: 'Story' },
          { href: '/#why', label: 'Local' },
          { href: '/#foot', label: 'Contact' },
          { href: '/account', label: 'Account' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(34px,9vw,56px)',
              textTransform: 'uppercase',
              color: 'var(--cream-dim)',
              letterSpacing: '.02em',
              transition: 'color .3s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)'; }}
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  )
}
