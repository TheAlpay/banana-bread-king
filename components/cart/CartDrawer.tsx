'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { X, Minus, Plus } from 'lucide-react'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalItems, isCarton, cartonProgress } = useCartStore()
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountError, setDiscountError] = useState(false)

  const subtotal = getSubtotal()
  const totalItems = getTotalItems()
  const cartonDone = isCarton()
  const cartons = Math.floor(totalItems / 10)
  const indiv = totalItems % 10

  const CODES: Record<string, number> = { 'BRISBANE10': 0.10, 'KING15': 0.15, 'FRESH': 0.05 }

  function applyDiscount() {
    const code = discountCode.trim().toUpperCase()
    if (CODES[code] != null) {
      setDiscount(CODES[code])
      setDiscountApplied(true)
      setDiscountError(false)
      setDiscountCode(code + ' ✓')
    } else {
      setDiscountError(true)
      setDiscountApplied(false)
    }
  }

  const discountAmt = subtotal * discount
  const total = Math.max(0, subtotal - discountAmt)

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,.6)',
          backdropFilter: 'blur(3px)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity .4s, visibility .4s',
        }}
      />

      {/* Drawer */}
      <aside
        aria-label="Shopping cart"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          zIndex: 1101,
          width: 'min(440px, 100vw)',
          background: 'linear-gradient(180deg,#0d0a07,#080604)',
          borderLeft: '1px solid var(--hairline)',
          transform: isOpen ? 'none' : 'translateX(100%)',
          transition: 'transform .5s cubic-bezier(.3,.9,.2,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '26px 26px 18px',
          borderBottom: '1px solid var(--hairline-2)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-anton)', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '.02em', color: 'var(--cream)' }}>
            Your Basket
          </h3>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              border: '1px solid var(--hairline)',
              display: 'grid', placeItems: 'center',
              fontSize: '18px', color: 'var(--cream)',
              background: 'none', cursor: 'pointer',
              transition: 'border-color .3s, transform .3s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'var(--gold)'
              el.style.transform = 'rotate(90deg)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'var(--hairline)'
              el.style.transform = 'none'
            }}
          >
            ✕
          </button>
        </div>

        {/* Carton notice */}
        {totalItems > 0 && (
          <div style={{
            margin: '16px 22px 0',
            padding: '13px 16px',
            borderRadius: '12px',
            background: 'rgba(245,197,24,.1)',
            border: '1px solid rgba(245,197,24,.28)',
            color: 'var(--gold-soft)',
            fontSize: '13px',
            fontWeight: 600,
          }}>
            🎉 {totalItems} {totalItems === 1 ? 'loaf' : 'loaves'} — {cartons} full carton{cartons !== 1 ? 's' : ''} + {indiv} individual
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', color: 'var(--muted)', textAlign: 'center', paddingTop: '60px' }}>
              <div style={{ fontSize: '40px', opacity: .5 }}>🍌</div>
              <p style={{ fontSize: '14px' }}>Your basket is empty.<br />Build a loaf to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variety}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px 1fr auto',
                  gap: '14px',
                  alignItems: 'center',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--hairline-2)',
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '12px',
                  background: 'linear-gradient(160deg,#6b4019,#3a2210)',
                  display: 'grid', placeItems: 'center', fontSize: '22px',
                }}>
                  🍞
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--cream)' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{item.variety}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variety, item.quantity - 1)}
                      style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: '1px solid var(--hairline)', color: 'var(--cream)',
                        display: 'grid', placeItems: 'center',
                        background: 'none', cursor: 'pointer',
                        transition: 'border-color .3s, color .3s',
                      }}
                    ><Minus size={10} /></button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, fontSize: '14px', color: 'var(--cream)' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variety, item.quantity + 1)}
                      style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: '1px solid var(--hairline)', color: 'var(--cream)',
                        display: 'grid', placeItems: 'center',
                        background: 'none', cursor: 'pointer',
                        transition: 'border-color .3s, color .3s',
                      }}
                    ><Plus size={10} /></button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variety)}
                    style={{ fontSize: '11px', color: 'var(--muted-2)', marginTop: '6px', letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)', fontSize: '17px' }}>
                  ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 22px 24px', borderTop: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Discount code */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder={discountError ? 'Invalid code — try BRISBANE10' : 'Discount code'}
                value={discountApplied ? discountCode : discountCode}
                onChange={e => { if (!discountApplied) { setDiscountCode(e.target.value); setDiscountError(false); } }}
                disabled={discountApplied}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,.03)',
                  border: `1px solid ${discountError ? 'var(--amber)' : discountApplied ? 'var(--green)' : 'var(--hairline)'}`,
                  borderRadius: '10px',
                  padding: '13px 15px',
                  color: 'var(--cream)',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  letterSpacing: '.06em',
                  outline: 'none',
                }}
              />
              <button
                onClick={applyDiscount}
                disabled={discountApplied}
                style={{
                  padding: '0 20px',
                  borderRadius: '10px',
                  background: 'var(--amber)',
                  color: 'var(--cream)',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: discountApplied ? 'default' : 'pointer',
                  opacity: discountApplied ? .6 : 1,
                }}
              >
                Apply
              </button>
            </div>

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--cream-dim)' }}>
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>

            {/* Discount */}
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--green)' }}>
                <span>Discount</span>
                <b>−${(discountAmt / 100).toFixed(2)}</b>
              </div>
            )}

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '16px', fontWeight: 700, color: 'var(--cream)',
              paddingTop: '10px',
              borderTop: '1px solid var(--hairline-2)',
            }}>
              <span>Total</span>
              <b style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold)', fontSize: '24px', fontWeight: 500 }}>
                ${(total / 100).toFixed(2)}
              </b>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '18px',
                borderRadius: '999px',
                background: 'var(--gold)',
                color: '#1a1206',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background .3s, transform .3s',
              }}
            >
              Checkout <span style={{ marginLeft: '.4em' }}>→</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
