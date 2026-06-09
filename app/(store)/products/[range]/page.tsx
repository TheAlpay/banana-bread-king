import { notFound } from 'next/navigation'
import Link from 'next/link'
import { products as allProducts } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'
import type { ProductDoc } from '@/types'
import type { Metadata } from 'next'

interface Params { range: string }

const rangeConfig: Record<string, { label: string; desc: string; isGF: boolean }> = {
  classic: {
    label: 'Classic Range',
    desc: 'Our original banana bread recipes — egg free, no added sugar, baked with love.',
    isGF: false,
  },
  'gluten-free-vegan': {
    label: 'Gluten Free & Vegan Range',
    desc: 'All the flavour, none of the gluten. Made with coconut and rice flour — completely vegan.',
    isGF: true,
  },
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { range } = await params
  const config = rangeConfig[range]
  if (!config) return { title: 'Not Found' }
  return {
    title: `${config.label} — Banana Bread King`,
    description: config.desc,
  }
}

export default async function RangePage({ params }: { params: Promise<Params> }) {
  const { range } = await params
  const config = rangeConfig[range]
  if (!config) notFound()

  // Filter products by range from static data/products.ts
  const products: ProductDoc[] = allProducts
    .filter((p) => p.range === range)
    .map((p) => ({
      id: p.slug,
      createdAt: new Date().toISOString(),
      ...p,
    }))

  return (
    <div
      style={{
        maxWidth: 'var(--maxw)',
        margin: '0 auto',
        padding: 'clamp(100px,14vw,160px) clamp(20px,5vw,72px) clamp(60px,8vw,100px)',
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--muted)',
          marginBottom: '40px',
          letterSpacing: '.08em',
        }}
      >
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color .3s' }}>Home</Link>
        <span style={{ color: 'var(--hairline)' }}>/</span>
        <Link href="/products" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color .3s' }}>Ranges</Link>
        <span style={{ color: 'var(--hairline)' }}>/</span>
        <span style={{ color: 'var(--cream-dim)', fontWeight: 600 }}>{config.label}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            color: config.isGF ? 'var(--green)' : 'var(--amber)',
            marginBottom: '16px',
          }}
        >
          {config.isGF ? '6 Gluten Free & Vegan Flavours' : '6 Classic Flavours'}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(40px,8vw,100px)',
            textTransform: 'uppercase',
            lineHeight: 0.86,
            letterSpacing: '.01em',
            color: 'var(--cream)',
            marginBottom: '20px',
          }}
        >
          {config.isGF ? (
            <>Gluten Free<br /><span style={{ color: 'var(--green)' }}>&amp; Vegan</span></>
          ) : (
            <>Classic <span style={{ color: 'var(--gold)' }}>Range</span></>
          )}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '52ch', lineHeight: 1.6 }}>
          {config.desc}
        </p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--muted)',
            border: '1px dashed var(--hairline)',
            borderRadius: '20px',
          }}
        >
          <p style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.5 }}>🍌</p>
          <p style={{ fontWeight: 600, color: 'var(--cream-dim)', marginBottom: '8px' }}>No products yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
            gap: '24px',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}

      {/* Carton notice */}
      <div
        style={{
          marginTop: '56px',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
          background: config.isGF
            ? 'linear-gradient(160deg, rgba(46,125,50,.12), rgba(46,125,50,.04))'
            : 'linear-gradient(160deg, rgba(196,119,26,.12), rgba(196,119,26,.04))',
          border: `1px solid ${config.isGF ? 'rgba(95,174,90,.25)' : 'rgba(196,119,26,.25)'}`,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: config.isGF ? 'var(--green)' : 'var(--amber)',
            marginBottom: '8px',
            fontSize: '15px',
          }}
        >
          🏢 Ordering for a café or restaurant?
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>
          We offer our full range in wholesale carton quantities. Click into any product details or click order now to purchase bulk cartons directly on our Shopify store.
        </p>
      </div>
    </div>
  )
}
