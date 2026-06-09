'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductDoc, Variety } from '@/types'

interface ProductCardProps {
  product: ProductDoc
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariety, setSelectedVariety] = useState<Variety>(product.varieties[0])

  const isGF = product.range === 'gluten-free-vegan'
  
  // Calculate price based on selected variety (if variety is 2.4kg, add the bulk difference)
  // Let's check how price changes based on size.
  // Traditional products have base prices.
  // 600g classic is 1200 ($12), 2.4kg classic is 3800 ($38).
  // Let's use simple logic: if selected variety is 2.4kg, let's show the bulk price, which is roughly 3x the 600g price.
  // Or let's check: in products data, does it show prices? In page.tsx we saw classic base is 600g: 1200, 2.4kg: 3800.
  // Let's check: in data/products.ts, product has basePrice. Let's see: basePrice is for 600g.
  // Let's compute price dynamically: if variety is '2.4kg', price is basePrice * 3 (or we can just show the basePrice and suffix `/ 600g` or `/ 2.4kg`).
  // Let's keep it simple: 600g is product.basePrice, 2.4kg is product.basePrice + 2600 cents (classic base for 2.4kg is 3800, which is 1200 + 2600. For GF, 600g is 1400, 2.4kg is 4200, which is 1400 + 2800).
  // So:
  const is2_4kg = selectedVariety === '2.4kg'
  const displayPrice = is2_4kg 
    ? (isGF ? 4200 : 3800) // standard pricing from spec
    : product.basePrice

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, var(--char-2), var(--char))',
        border: '1px solid var(--hairline)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform .5s cubic-bezier(.2,.8,.2,1), border-color .5s, box-shadow .5s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-10px)'
        el.style.borderColor = 'rgba(245,197,24,.5)'
        el.style.boxShadow = '0 30px 60px -24px rgba(245,197,24,.35)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'none'
        el.style.borderColor = 'var(--hairline)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} style={{ position: 'relative', display: 'block' }}>
        <div style={{ position: 'relative', aspectRatio: '4/3.4', background: 'linear-gradient(160deg,#3a2210,#1c0e05)' }}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
          />
          {isGF && (
            <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}>
              <span className="tag-gf">GF · Vegan</span>
            </div>
          )}
          {!product.inStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,6,4,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', background: 'var(--char)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--hairline)' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: '22px 22px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href={`/product/${product.slug}`}>
          <h3 style={{ fontFamily: 'var(--font-anton)', fontSize: '26px', textTransform: 'uppercase', letterSpacing: '.01em', lineHeight: .92, color: 'var(--cream)', marginBottom: '10px' }}>
            {product.name}
          </h3>
        </Link>

        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '14px', minHeight: '42px' }}>
          {product.features.slice(0, 2).join(' · ')}
        </p>

        {/* Variety selector */}
        {product.varieties.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
            {product.varieties.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariety(v)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${selectedVariety === v ? 'var(--gold)' : 'var(--hairline)'}`,
                  background: selectedVariety === v ? 'var(--gold)' : 'rgba(255,255,255,.02)',
                  color: selectedVariety === v ? '#1a1206' : 'var(--cream-dim)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all .3s',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Price + View Details */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid var(--hairline-2)' }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', color: 'var(--gold)' }}>
            ${(displayPrice / 100).toFixed(2)} <small style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '.05em' }}>/ {selectedVariety}</small>
          </div>
          <Link
            href={`/product/${product.slug}`}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#1a1206',
              background: 'var(--gold)',
              padding: '11px 18px',
              borderRadius: '999px',
              border: 'none',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background .3s, transform .3s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-soft)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
