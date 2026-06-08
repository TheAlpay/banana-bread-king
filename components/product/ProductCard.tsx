'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { ProductDoc, Variety } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: ProductDoc
  userPrice?: number
  isFavorite?: boolean
  onToggleFavorite?: (productId: string) => void
}

export default function ProductCard({ product, userPrice, isFavorite, onToggleFavorite }: ProductCardProps) {
  const [selectedVariety, setSelectedVariety] = useState<Variety>(product.varieties[0])
  const { addItem, openCart } = useCartStore()

  const unitPrice = userPrice ?? product.basePrice
  const isGF = product.range === 'gluten-free-vegan'

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      variety: selectedVariety,
      quantity: 1,
      unitPrice,
      imageUrl: product.imageUrl,
    })
    openCart()
  }

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

        {onToggleFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(product.id) }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              position: 'absolute', top: '14px', right: '14px',
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'rgba(8,6,4,.7)',
              border: '1px solid var(--hairline)',
              display: 'grid', placeItems: 'center',
              cursor: 'pointer',
              transition: 'transform .3s',
            }}
          >
            <Heart size={14} style={{ fill: isFavorite ? 'var(--gold)' : 'none', color: isFavorite ? 'var(--gold)' : 'var(--cream-dim)' }} />
          </button>
        )}
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

        {/* Price + Add to Cart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid var(--hairline-2)' }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '26px', color: 'var(--gold)' }}>
            ${(unitPrice / 100).toFixed(2)} <small style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '.05em' }}>/ {selectedVariety}</small>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#1a1206',
              background: 'var(--gold)',
              padding: '11px 16px',
              borderRadius: '999px',
              border: 'none',
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              opacity: product.inStock ? 1 : .4,
              transition: 'background .3s, transform .3s',
            }}
            onMouseEnter={e => { if (product.inStock) (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-soft)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
