import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Ranges — Banana Bread King',
  description: 'Classic and Gluten Free & Vegan banana bread ranges from Brisbane\'s favourite bakehouse.',
}

export default function ProductsPage() {
  return (
    <div
      style={{
        maxWidth: 'var(--maxw)',
        margin: '0 auto',
        padding: 'clamp(100px,14vw,160px) clamp(20px,5vw,72px) clamp(60px,8vw,100px)',
      }}
    >
      <style>{`
        .range-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          min-height: 360px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px;
          border: 1px solid var(--hairline);
          text-decoration: none;
          transition: transform .5s cubic-bezier(.2,.8,.2,1), border-color .5s, box-shadow .5s;
        }
        .range-card-classic {
          background: linear-gradient(160deg, var(--brown-2), var(--ink));
        }
        .range-card-gf {
          background: linear-gradient(160deg, #0e2a1a, #06130d);
        }
        .range-card:hover {
          transform: translateY(-8px);
        }
        .range-card-classic:hover {
          border-color: rgba(245,197,24,.5);
          box-shadow: 0 40px 70px -30px rgba(245,197,24,.3);
        }
        .range-card-gf:hover {
          border-color: rgba(95,174,90,.4);
          box-shadow: 0 40px 70px -30px rgba(95,174,90,.25);
        }
        .range-deco {
          position: absolute;
          top: 32px;
          right: 32px;
          font-size: 100px;
          opacity: 0.07;
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="eyebrow" style={{ marginBottom: '16px' }}>Our Collection</span>
        <h1
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(40px,8vw,110px)',
            textTransform: 'uppercase',
            lineHeight: 0.86,
            letterSpacing: '.01em',
            color: 'var(--cream)',
            marginBottom: '20px',
          }}
        >
          Our <span style={{ color: 'var(--gold)' }}>Ranges</span>
        </h1>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: 'clamp(14px,1.3vw,16px)',
            maxWidth: '36ch',
            margin: '0 auto',
            lineHeight: 1.65,
          }}
        >
          Choose your range — classic comfort or allergy-friendly goodness.
        </p>
      </div>

      {/* Range cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))',
          gap: '24px',
        }}
      >
        {/* Classic Range */}
        <Link href="/products/classic" className="range-card range-card-classic">
          <div className="range-deco">🍌</div>

          <p
            style={{
              fontSize: '10px',
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            6 Flavours
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(36px,5vw,58px)',
              textTransform: 'uppercase',
              letterSpacing: '.01em',
              lineHeight: 0.9,
              color: 'var(--cream)',
              marginBottom: '14px',
            }}
          >
            Classic Range
          </h2>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '32ch',
              marginBottom: '28px',
            }}
          >
            Our original banana bread recipes — egg free, no added sugar, baked with love.
          </p>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--gold)',
              color: '#1a1206',
              padding: '14px 24px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              width: 'fit-content',
            }}
          >
            Shop Classic →
          </span>
        </Link>

        {/* GF & Vegan Range */}
        <Link href="/products/gluten-free-vegan" className="range-card range-card-gf">
          <div className="range-deco">🌿</div>

          <p
            style={{
              fontSize: '10px',
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            6 Flavours
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(36px,5vw,58px)',
              textTransform: 'uppercase',
              letterSpacing: '.01em',
              lineHeight: 0.9,
              color: 'var(--cream)',
              marginBottom: '14px',
            }}
          >
            Gluten Free<br />&amp; Vegan
          </h2>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '32ch',
              marginBottom: '28px',
            }}
          >
            All the flavour, none of the gluten. Made with coconut and rice flour — completely vegan.
          </p>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--green)',
              color: '#fff',
              padding: '14px 24px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              width: 'fit-content',
            }}
          >
            Shop GF &amp; Vegan →
          </span>
        </Link>
      </div>

      {/* Trust strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1px',
          marginTop: '60px',
          background: 'var(--hairline)',
          border: '1px solid var(--hairline)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        {[
          { icon: '🍌', label: 'Local QLD Bananas' },
          { icon: '🌿', label: 'Gluten Free Options' },
          { icon: '🐣', label: 'Egg Free · No Added Sugar' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            style={{
              padding: '28px 24px',
              textAlign: 'center',
              background: 'var(--ink)',
            }}
          >
            <div style={{ fontSize: '26px', marginBottom: '10px' }}>{icon}</div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
