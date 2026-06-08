'use client'

import Link from 'next/link'

const CrownSvg = () => (
  <svg className="w-[22px] h-[22px] flex-none" viewBox="0 0 24 24" fill="none">
    <path d="M2 7l4 4 6-7 6 7 4-4-2 13H4L2 7z" stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round" fill="rgba(245,197,24,.12)"/>
  </svg>
)

export default function Footer() {
  return (
    <footer
      id="foot"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'var(--ink)',
        borderTop: '1px solid rgba(245,197,24,.25)',
        overflow: 'hidden',
        padding: '90px 0 40px',
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-4%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-anton)',
          textTransform: 'uppercase',
          fontSize: 'clamp(80px,18vw,260px)',
          lineHeight: 1,
          color: 'rgba(250,246,238,0.03)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        Banana Bread King
      </div>

      <div className="bbk-wrap" style={{ position: 'relative', zIndex: 2 }}>
        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            paddingBottom: '70px',
          }}
          className="md:grid-cols-[1.6fr_1fr_1fr_1fr]"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-anton)',
                fontSize: '26px',
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                color: 'var(--cream)',
                marginBottom: '18px',
              }}
            >
              <CrownSvg />
              Banana Bread King
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '34ch', lineHeight: 1.6 }}>
              {`Brisbane's finest banana bread, baked fresh daily and delivered across South East Queensland. Egg free & gluten free ranges available.`}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '18px' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { href: '/products', label: 'Menu' },
                { href: '/products/classic', label: 'Classic Range' },
                { href: '/products/gluten-free-vegan', label: 'GF & Vegan' },
                { href: '/account', label: 'Account' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: 'var(--cream-dim)', fontSize: '14px', transition: 'color .3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)'; }}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '18px' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <li><a href="tel:+61413061411" style={{ color: 'var(--cream-dim)', fontSize: '14px', transition: 'color .3s' }}>+61 413 061 411</a></li>
              <li><a href="mailto:info@bananabreadking.com.au" style={{ color: 'var(--cream-dim)', fontSize: '14px', transition: 'color .3s' }}>info@bananabreadking.com.au</a></li>
              <li><a href="mailto:order@bananabreadking.com.au" style={{ color: 'var(--cream-dim)', fontSize: '14px', transition: 'color .3s' }}>order@bananabreadking.com.au</a></li>
              <li style={{ color: 'var(--cream-dim)', fontSize: '14px' }}>Fortitude Valley, Brisbane QLD</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '18px' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { href: '/auth/login', label: 'Login' },
                { href: '/auth/register', label: 'Register' },
                { href: '/account/orders', label: 'My Orders' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: 'var(--cream-dim)', fontSize: '14px', transition: 'color .3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream-dim)'; }}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            paddingTop: '28px',
            borderTop: '1px solid var(--hairline-2)',
            fontSize: '13px',
            color: 'var(--muted)',
          }}
        >
          <span>© 2026 Banana Bread King. All rights reserved.</span>
          <span>Made with 🍌 in Brisbane</span>
        </div>
      </div>
    </footer>
  )
}
