import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Our Story — Banana Bread King",
  description: "How Brisbane's favourite banana bread came to be. Real Queensland bananas, baked with love since day one.",
}

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: 'clamp(80px,12vw,140px) clamp(20px,5vw,48px)',
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/"
          style={{
            fontSize: '12px',
            color: 'var(--muted)',
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'color .3s',
          }}
          onMouseEnter={undefined}
        >
          ← Back to Home
        </Link>
      </div>

      <span className="eyebrow" style={{ marginBottom: '16px' }}>Our Story</span>

      <h1
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(36px,7vw,72px)',
          fontWeight: 700,
          color: 'var(--cream)',
          lineHeight: 1.05,
          marginBottom: '48px',
        }}
      >
        Brisbane&apos;s{' '}
        <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Favourite</span>
        {' '}Banana Bread
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          color: 'var(--cream-dim)',
          fontSize: 'clamp(15px,1.4vw,17px)',
          lineHeight: 1.75,
        }}
      >
        <p>
          It started the way most good things do — with a kitchen, a bunch of overripe bananas,
          and a stubborn refusal to let them go to waste. What began as a weekend ritual became
          something the whole neighbourhood started talking about.
        </p>
        <p>
          We source our bananas direct from Queensland growers. No imports, no shortcuts.
          When the bananas are right — properly freckled, naturally sweet, almost too ripe —
          the bread practically makes itself.
        </p>
        <p>
          Every loaf is{' '}
          <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>egg free</strong> and made
          with{' '}
          <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>no added sugar</strong>.
          Not because it&apos;s trendy, but because we genuinely believe the banana should do
          the work. Our gluten free &amp; vegan range uses coconut and rice flour, and honestly
          — it&apos;s just as good.
        </p>
        <p>
          We bake fresh in Brisbane and deliver across South East Queensland. Cafés,
          restaurants, and households — we&apos;ll bake for anyone who appreciates a proper loaf.
        </p>
        <p>
          If you&apos;re ordering for a business, ask us about wholesale. We do full cartons,
          custom labelling isn&apos;t out of the question, and we&apos;ll always make time for
          a conversation over a slice.
        </p>
      </div>

      {/* Trust strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          margin: '56px 0',
          padding: '32px',
          background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01))',
          border: '1px solid var(--hairline)',
          borderRadius: '20px',
        }}
      >
        {[
          { icon: '🍌', label: 'Local QLD Bananas' },
          { icon: '🌿', label: 'Gluten Free Options' },
          { icon: '🐣', label: 'Egg Free · No Added Sugar' },
        ].map(({ icon, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
        <Link href="/products/classic" className="bbk-btn bbk-btn-gold">
          Shop Classic Range <span className="ar">→</span>
        </Link>
        <Link href="/products/gluten-free-vegan" className="bbk-btn bbk-btn-ghost">
          Gluten Free &amp; Vegan
        </Link>
      </div>
    </div>
  )
}
