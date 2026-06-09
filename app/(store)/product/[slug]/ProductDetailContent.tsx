'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import type { ProductDoc, Variety } from '@/types'

interface Props {
  product: ProductDoc
  related: ProductDoc[]
}

export default function ProductDetailContent({ product, related }: Props) {
  const [selectedVariety, setSelectedVariety] = useState<Variety>(product.varieties[0])

  const isGF = product.range === 'gluten-free-vegan'
  const shopifyUrl = process.env.NEXT_PUBLIC_SHOPIFY_URL || 'https://shop.bananabreadking.com.au'

  // Calculate pricing based on size
  const is2_4kg = selectedVariety === '2.4kg'
  const displayPrice = is2_4kg 
    ? (isGF ? 4200 : 3800) // standard pricing from spec
    : product.basePrice

  return (
    <div
      style={{
        maxWidth: 'var(--maxw)',
        margin: '0 auto',
        padding: 'clamp(100px,14vw,160px) clamp(20px,5vw,72px) clamp(60px,8vw,100px)',
      }}
    >
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--muted)',
          marginBottom: '48px',
        }}
      >
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={12} />
        <Link
          href={`/products/${product.range}`}
          style={{ color: 'var(--muted)', textDecoration: 'none' }}
        >
          {isGF ? 'GF & Vegan' : 'Classic'}
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--cream-dim)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))',
          gap: 'clamp(32px,6vw,80px)',
          alignItems: 'start',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(160deg,#3a2210,#1c0e05)',
            border: '1px solid var(--hairline)',
          }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
          />
          {isGF && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
              <span className="tag-gf">GF · VEGAN</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Feature badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {product.features.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--amber)',
                  border: '1px solid rgba(196,119,26,.35)',
                  borderRadius: '999px',
                  padding: '4px 12px',
                }}
              >
                {f}
              </span>
            ))}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(32px,5vw,52px)',
              fontWeight: 700,
              color: 'var(--cream)',
              lineHeight: 1.05,
              marginBottom: '16px',
            }}
          >
            {product.name}
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '36px', fontSize: '15px' }}>
            {product.description}
          </p>

          {/* Variety selector */}
          {product.varieties.length > 1 && (
            <div style={{ marginBottom: '28px' }}>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: '12px',
                }}
              >
                Size
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.varieties.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariety(v)}
                    style={{
                      padding: '12px 22px',
                      borderRadius: '12px',
                      border: `1px solid ${selectedVariety === v ? 'var(--gold)' : 'var(--hairline)'}`,
                      background: selectedVariety === v ? 'var(--gold)' : 'rgba(255,255,255,.02)',
                      color: selectedVariety === v ? '#1a1206' : 'var(--cream-dim)',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '.06em',
                      cursor: 'pointer',
                      transition: 'all .3s',
                      boxShadow: selectedVariety === v ? '0 0 24px -6px rgba(245,197,24,.6)' : 'none',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(32px,5vw,48px)',
                color: 'var(--gold)',
              }}
            >
              ${(displayPrice / 100).toFixed(2)}
            </span>
          </div>

          {/* Action: Order on Shopify */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={`${shopifyUrl}/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'var(--gold)',
                color: '#1a1206',
                padding: '18px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background .3s, transform .3s',
                boxShadow: '0 10px 40px -12px rgba(245,197,24,.6)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-soft)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)' }}
            >
              <ShoppingCart size={18} />
              Shop
            </a>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: '80px', borderTop: '1px solid var(--hairline)', paddingTop: '60px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              marginBottom: '12px',
            }}
          >
            More from this range
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px,4vw,42px)',
              fontWeight: 700,
              color: 'var(--cream)',
              marginBottom: '36px',
            }}
          >
            You might also like
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px,100%), 1fr))',
              gap: '16px',
            }}
          >
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                style={{
                  background: 'linear-gradient(180deg, var(--char-2), var(--char))',
                  border: '1px solid var(--hairline)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'transform .4s, border-color .4s',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-6px)'
                  el.style.borderColor = 'rgba(245,197,24,.4)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'none'
                  el.style.borderColor = 'var(--hairline)'
                }}
              >
                <div
                  style={{
                    height: '120px',
                    background: 'linear-gradient(160deg,#3a2210,#1c0e05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                  }}
                >
                  🍌
                </div>
                <div style={{ padding: '14px' }}>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--cream)',
                      lineHeight: 1.3,
                      marginBottom: '6px',
                    }}
                  >
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--gold)',
                      fontSize: '16px',
                    }}
                  >
                    ${(p.basePrice / 100).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
