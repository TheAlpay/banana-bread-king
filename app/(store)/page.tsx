'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import type { Variety } from '@/types'

// ─── Builder data ──────────────────────────────────────────────────────────
const RANGES = {
  classic: {
    label: 'Classic',
    base: { '600g': 1200, '2.4kg': 3800 },
    flavours: [
      { name: 'Classic',            slug: 'classic-banana-bread',          prem: 0,   c: ['#8a5621','#4d2c10'] },
      { name: 'Choc Chip',          slug: 'choc-chip-banana-bread',         prem: 100, c: ['#5e3a1a','#2c1707'] },
      { name: 'Banana & Walnut',    slug: 'banana-walnut-banana-bread',     prem: 100, c: ['#7a4e22','#43260f'] },
      { name: 'Banana & Date',      slug: 'banana-date-banana-bread',       prem: 100, c: ['#6e441c','#39200d'] },
      { name: 'Lemon & Poppy Seed', slug: 'lemon-poppy-seed-banana-bread',  prem: 100, c: ['#a07b2a','#5c4112'] },
      { name: 'Cinnamon & Raisin',  slug: 'cinnamon-raisin-banana-bread',   prem: 100, c: ['#73431d','#3c220e'] },
    ],
  },
  gf: {
    label: 'Gluten Free & Vegan',
    base: { '600g': 1400, '2.4kg': 4200 },
    flavours: [
      { name: 'Raspberry & Pear',   slug: 'raspberry-pear-banana-bread-gf',    prem: 0,   c: ['#8a3a4a','#4d1f29'] },
      { name: 'Blueberry',          slug: 'blueberry-banana-bread-gf',          prem: 0,   c: ['#48507e','#262b4a'] },
      { name: 'Apple & Cinnamon',   slug: 'apple-cinnamon-banana-bread-gf',     prem: 0,   c: ['#8a6224','#4d3411'] },
      { name: 'Mango & Coconut',    slug: 'mango-coconut-banana-bread-gf',      prem: 0,   c: ['#a07e2a','#5c4512'] },
      { name: 'Walnut (GF)',        slug: 'walnut-banana-bread-gf',             prem: 0,   c: ['#75502a','#402b14'] },
      { name: 'Classic (GF)',       slug: 'classic-banana-bread-gf',            prem: 0,   c: ['#8a5621','#4d2c10'] },
    ],
  },
} as const

type RangeKey = 'classic' | 'gf'
type SizeKey  = '600g' | '2.4kg'

// ─── Signature product cards ───────────────────────────────────────────────
const SIGNATURE_PRODUCTS = [
  { id: 'sig-classic',  slug: 'classic-banana-bread',         name: 'Classic',            desc: 'The original. Moist, dense, gently caramelised crust.', price: 1200, tag: 'fresh today' },
  { id: 'sig-choc',     slug: 'choc-chip-banana-bread',        name: 'Choc Chip',          desc: 'Dark chocolate folded through every slice.',            price: 1300, tag: null          },
  { id: 'sig-walnut',   slug: 'banana-walnut-banana-bread',    name: 'Banana & Walnut',    desc: 'Toasted walnuts for a deep, nutty crunch.',             price: 1300, tag: 'fan fav'     },
  { id: 'sig-date',     slug: 'banana-date-banana-bread',      name: 'Banana & Date',      desc: 'Naturally sweetened with Medjool dates.',               price: 1300, tag: null          },
  { id: 'sig-lemon',    slug: 'lemon-poppy-seed-banana-bread', name: 'Lemon & Poppy Seed', desc: 'Bright, zesty and just a little bit tart.',             price: 1300, tag: null          },
  { id: 'sig-cinnamon', slug: 'cinnamon-raisin-banana-bread',  name: 'Cinnamon & Raisin',  desc: 'Warm spice and plump raisins in every bite.',           price: 1300, tag: null          },
]

interface ParticleStyle {
  left: string
  bottom: string
  duration: string
  delay: string
  opacity: number
}

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

export default function HomePage() {
  const { addItem, openCart } = useCartStore()

  // Builder state
  const [size, setSize]           = useState<SizeKey>('600g')
  const [range, setRange]         = useState<RangeKey>('classic')
  const [flavourIdx, setFlavourIdx] = useState(0)

  // Particles — client-only to avoid hydration mismatch
  const [particles, setParticles] = useState<ParticleStyle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 26 }, () => ({
        left:     `${Math.random() * 100}%`,
        bottom:   `${Math.random() * 40}%`,
        duration: `${5 + Math.random() * 7}s`,
        delay:    `${Math.random() * 7}s`,
        opacity:  0.4 + Math.random() * 0.5,
      }))
    )
  }, [])

  // Scroll reveals
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Builder helpers
  const currentRange   = RANGES[range]
  const safeFlavourIdx = Math.min(flavourIdx, currentRange.flavours.length - 1)
  const currentFlavour = currentRange.flavours[safeFlavourIdx]
  const price          = currentRange.base[size] + currentFlavour.prem

  function handleRangeChange(r: RangeKey) {
    setRange(r)
    setFlavourIdx(0)
  }

  const handleAddFromBuilder = useCallback(() => {
    addItem({
      productId: `${currentFlavour.slug}-${size}`,
      name:      `${currentFlavour.name} Banana Bread`,
      slug:      currentFlavour.slug,
      variety:   size as Variety,
      quantity:  1,
      unitPrice: price,
      imageUrl:  '/images/placeholder.svg',
    })
    openCart()
  }, [addItem, openCart, currentFlavour, size, price])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative' }}>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        style={{
          position:        'relative',
          minHeight:       '100svh',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          padding:         '120px 0 48px',
          overflow:        'hidden',
          zIndex:          1,
        }}
      >
        {/* Spotlight glow */}
        <div
          style={{
            position:  'absolute',
            top:       '50%',
            left:      '50%',
            transform: 'translate(-50%,-50%)',
            width:     'min(720px,84vw)',
            height:    'min(720px,84vw)',
            background:
              'radial-gradient(circle, rgba(245,197,24,.18) 0%, rgba(196,119,26,.08) 38%, transparent 64%)',
            filter:        'blur(8px)',
            zIndex:        0,
            pointerEvents: 'none',
          }}
        />

        {/* Floating particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          {particles.map((p, i) => (
            <span
              key={i}
              style={{
                position:     'absolute',
                left:         p.left,
                bottom:       p.bottom,
                width:        '3px',
                height:       '3px',
                borderRadius: '50%',
                background:   'var(--gold)',
                opacity:      p.opacity,
                boxShadow:    '0 0 8px 1px rgba(245,197,24,.6)',
                animation:    `float-particle ${p.duration} ${p.delay} linear infinite`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          className="bbk-wrap"
          style={{
            position:       'relative',
            zIndex:         2,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
          }}
        >
          <h1
            style={{
              fontFamily:    'var(--font-anton)',
              color:         'var(--cream)',
              textAlign:     'center',
              whiteSpace:    'nowrap',
              fontSize:      'clamp(52px,10.5vw,150px)',
              lineHeight:    0.82,
              letterSpacing: '.01em',
              textTransform: 'uppercase',
            }}
          >
            {"Brisbane's"}
          </h1>

          <h1
            style={{
              fontFamily:    'var(--font-anton)',
              color:         'var(--gold)',
              textAlign:     'center',
              whiteSpace:    'nowrap',
              fontSize:      'clamp(52px,10.5vw,150px)',
              lineHeight:    0.82,
              letterSpacing: '.01em',
              textTransform: 'uppercase',
              marginTop:     '16px',
            }}
          >
            Finest Bread
          </h1>

          {/* Subtitle + CTAs */}
          <div
            style={{
              position:       'relative',
              zIndex:         3,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '16px',
              textAlign:      'center',
              marginTop:      '32px',
            }}
          >
            <p
              style={{
                maxWidth:  '460px',
                color:     'var(--cream-dim)',
                fontSize:  'clamp(14px,1.4vw,16px)',
              }}
            >
              Hand-baked banana bread, the way Brisbane has loved it for years.
              Real Queensland bananas. No shortcuts. Just the loaf.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/products/classic" className="bbk-btn bbk-btn-gold">
                Build Your Loaf <span className="ar">→</span>
              </Link>
              <Link href="/products" className="bbk-btn bbk-btn-ghost">
                View The Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position:      'absolute',
            bottom:        '26px',
            left:          '50%',
            transform:     'translateX(-50%)',
            zIndex:        3,
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '8px',
            color:         'var(--muted)',
            fontSize:      '11px',
            letterSpacing: '.3em',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll</span>
          <span
            style={{
              width:      '1px',
              height:     '42px',
              background: 'linear-gradient(var(--gold),transparent)',
              animation:  'drip 2.2s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════ REVEAL ══════════════════════════════ */}
      <section
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(120px,18vh,220px) 0',
          background: 'linear-gradient(180deg, var(--ink) 0%, var(--brown) 60%, var(--brown-2) 100%)',
        }}
      >
        <div className="bbk-wrap">
          <div
            style={{
              fontFamily:    'var(--font-anton)',
              textTransform: 'uppercase',
              lineHeight:    0.86,
            }}
          >
            <div
              className="reveal"
              style={{ fontSize: 'clamp(56px,11vw,170px)', color: 'var(--cream)' }}
            >
              One Loaf.
            </div>
            <div
              className="reveal d1"
              style={{
                fontSize:   'clamp(56px,11vw,170px)',
                color:      'var(--gold)',
                marginLeft: 'clamp(20px,8vw,160px)',
              }}
            >
              Endless Flavours.
            </div>
          </div>

          <div
            className="reveal d2"
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '48px' }}
          >
            {[
              { href: '/products/classic',          label: 'Classic Range',        isGf: false },
              { href: '/products/gluten-free-vegan', label: 'Gluten Free & Vegan', isGf: true  },
            ].map(({ href, label, isGf }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  gap:            '40px',
                  padding:        '22px 30px',
                  borderRadius:   '16px',
                  minWidth:       'min(380px,90vw)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.01))',
                  border:         '1px solid var(--hairline)',
                  transition:     'transform .4s cubic-bezier(.2,.8,.2,1), border-color .4s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform   = 'translateY(-5px)'
                  el.style.borderColor = 'var(--gold)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform   = 'none'
                  el.style.borderColor = 'var(--hairline)'
                }}
              >
                <span
                  style={{
                    fontFamily:    'var(--font-anton)',
                    fontSize:      'clamp(20px,2.4vw,30px)',
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color:         'var(--cream)',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize:   '24px',
                    color:      isGf ? 'var(--green)' : 'var(--gold)',
                    transition: 'transform .35s',
                  }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SIGNATURE ═══════════════════════════════ */}
      <section
        id="signature"
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(90px,12vh,150px) 0',
          background: 'var(--brown-2)',
          overflow:   'hidden',
        }}
      >
        <div
          className="bbk-wrap"
          style={{
            display:        'flex',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            gap:            '30px',
            flexWrap:       'wrap',
            marginBottom:   '54px',
          }}
        >
          <div>
            <span className="eyebrow reveal">Our Classics</span>
            <h2
              className="reveal d1"
              style={{
                fontFamily:    'var(--font-anton)',
                textTransform: 'uppercase',
                fontSize:      'clamp(40px,6.5vw,104px)',
                lineHeight:    0.86,
                color:         'var(--cream)',
              }}
            >
              Signature{' '}
              <span style={{ color: 'var(--gold)' }}>Banana</span>{' '}
              Breads
            </h2>
          </div>
          <p
            className="reveal d2"
            style={{ maxWidth: '34ch', color: 'var(--muted)', fontSize: '15px' }}
          >
            Baked fresh every morning at our Brisbane bakehouse.{' '}
            <span
              style={{
                fontFamily: 'var(--font-caveat)',
                fontSize:   '22px',
                color:      'var(--gold)',
              }}
            >
              fan favourites ↓
            </span>
          </p>
        </div>

        {/* Horizontal scroll row */}
        <div
          style={{
            display:                  'flex',
            gap:                      '26px',
            overflowX:                'auto',
            padding:                  `30px clamp(20px,5vw,72px) 50px`,
            scrollSnapType:           'x mandatory',
            WebkitOverflowScrolling:  'touch',
            scrollbarWidth:           'none',
          }}
        >
          {SIGNATURE_PRODUCTS.map((p) => (
            <article key={p.id} className="pcard-dark reveal">
              {/* Photo placeholder */}
              <div style={{ position: 'relative', aspectRatio: '4 / 3.4' }}>
                {p.tag && (
                  <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}>
                    <span
                      style={{
                        display:     'inline-flex',
                        alignItems:  'center',
                        gap:         '.55em',
                        padding:     '6px 12px',
                        borderRadius:'999px',
                        border:      '1px solid var(--hairline)',
                        background:  'rgba(255,255,255,.02)',
                        color:       'var(--cream)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-caveat)',
                          fontSize:   '16px',
                          color:      'var(--gold)',
                        }}
                      >
                        {p.tag}
                      </span>
                    </span>
                  </div>
                )}
                <div
                  style={{
                    width:          '100%',
                    height:         '100%',
                    background:
                      'radial-gradient(70% 60% at 50% 38%, rgba(245,197,24,.08), transparent 70%), linear-gradient(180deg,#171009,#0c0805)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily:    'monospace',
                      fontSize:      '11px',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color:         'var(--muted)',
                      opacity:       0.5,
                    }}
                  >
                    {p.name.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '22px 22px 26px' }}>
                <h3
                  style={{
                    fontFamily:    'var(--font-anton)',
                    fontSize:      '26px',
                    textTransform: 'uppercase',
                    letterSpacing: '.01em',
                    lineHeight:    0.92,
                    color:         'var(--cream)',
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    color:     'var(--muted)',
                    fontSize:  '14px',
                    margin:    '10px 0 18px',
                    minHeight: '42px',
                  }}
                >
                  {p.desc}
                </p>
                <div
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    gap:            '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize:   '26px',
                      color:      'var(--gold)',
                    }}
                  >
                    {fmt(p.price)}{' '}
                    <small
                      style={{
                        fontFamily:    'var(--font-hanken)',
                        fontSize:      '12px',
                        color:         'var(--muted)',
                        letterSpacing: '.05em',
                      }}
                    >
                      / 600g
                    </small>
                  </div>
                  <button
                    style={{
                      fontSize:      '12px',
                      fontWeight:    700,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color:         '#1a1206',
                      background:    'var(--gold)',
                      padding:       '11px 16px',
                      borderRadius:  '999px',
                      border:        'none',
                      cursor:        'pointer',
                      transition:    'background .3s, transform .3s',
                    }}
                    onClick={() => {
                      addItem({
                        productId: `${p.id}-600g`,
                        name:      `${p.name} Banana Bread`,
                        slug:      p.slug,
                        variety:   '600g',
                        quantity:  1,
                        unitPrice: p.price,
                        imageUrl:  '/images/placeholder.svg',
                      })
                      openCart()
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background =
                        'var(--gold-soft)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '12px',
            color:          'var(--muted)',
            fontSize:       '12px',
            letterSpacing:  '.2em',
            textTransform:  'uppercase',
            padding:        `0 clamp(20px,5vw,72px)`,
          }}
        >
          <span style={{ flex: 1, height: '1px', background: 'var(--hairline)' }} />
          <span>Drag / scroll to explore</span>
          <span style={{ flex: 1, height: '1px', background: 'var(--hairline)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════ BUILDER ═════════════════════════════ */}
      <section
        id="builder"
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(90px,12vh,150px) 0',
          background: 'var(--ink)',
          borderTop:  '1px solid var(--hairline-2)',
        }}
      >
        <div
          className="bbk-wrap"
          style={{
            display:             'grid',
            gridTemplateColumns: 'clamp(280px,45%,560px) 1fr',
            gap:                 'clamp(40px,6vw,90px)',
            alignItems:          'center',
          }}
        >
          {/* ── Loaf visualisation ── */}
          <div
            className="reveal"
            style={{
              position:    'relative',
              aspectRatio: '1 / 1',
              display:     'grid',
              placeItems:  'center',
            }}
          >
            {/* Glow ring */}
            <div
              style={{
                position:     'absolute',
                inset:        '6%',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(245,197,24,.18), transparent 65%)',
                transition:   'background .6s',
              }}
            />
            {/* Loaf shape */}
            <div
              style={{
                position:     'relative',
                width:        size === '2.4kg' ? '88%' : '78%',
                aspectRatio:  '1 / .62',
                borderRadius: '26px 26px 30px 30px',
                background:   `linear-gradient(170deg, ${currentFlavour.c[0]}, ${currentFlavour.c[1]})`,
                boxShadow:
                  'inset 0 6px 18px rgba(255,255,255,.12), inset 0 -20px 40px rgba(0,0,0,.45), 0 40px 70px -30px rgba(0,0,0,.8)',
                transition:     'width .5s cubic-bezier(.2,.8,.2,1)',
                display:        'grid',
                placeItems:     'center',
              }}
            >
              {/* Centre crack */}
              <div
                style={{
                  position:     'absolute',
                  top:          '6%',
                  left:         '50%',
                  width:        '6%',
                  height:       '80%',
                  transform:    'translateX(-50%)',
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,.4), transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              {/* Flavour label */}
              <div
                style={{
                  position:   'relative',
                  zIndex:     2,
                  fontFamily: 'var(--font-caveat)',
                  fontSize:   'clamp(22px,2.6vw,34px)',
                  color:      'var(--cream)',
                  textShadow: '0 2px 10px rgba(0,0,0,.6)',
                  textAlign:  'center',
                  padding:    '0 16px',
                  lineHeight: 1.1,
                }}
              >
                {currentFlavour.name}
              </div>
              {/* Size badge */}
              <div
                style={{
                  position:      'absolute',
                  bottom:        '8%',
                  left:          '50%',
                  transform:     'translateX(-50%)',
                  fontFamily:    'var(--font-hanken)',
                  fontSize:      '12px',
                  fontWeight:    700,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color:         'var(--gold)',
                  background:    'rgba(8,6,4,.55)',
                  padding:       '7px 16px',
                  borderRadius:  '999px',
                  border:        '1px solid rgba(245,197,24,.3)',
                  whiteSpace:    'nowrap',
                }}
              >
                {size === '600g' ? '600g loaf' : '2.4kg party loaf'}
              </div>
            </div>
          </div>

          {/* ── Controls ── */}
          <div>
            <span className="eyebrow reveal">Interactive Lab</span>
            <h2
              className="reveal d1"
              style={{
                fontFamily:    'var(--font-anton)',
                textTransform: 'uppercase',
                fontSize:      'clamp(40px,6vw,82px)',
                color:         'var(--cream)',
                lineHeight:    0.86,
                margin:        '14px 0 36px',
              }}
            >
              Build Your
              <br />
              Perfect Loaf
            </h2>

            {/* Step 1 — Size */}
            <div className="reveal d1" style={{ marginBottom: '30px' }}>
              <StepLabel n={1} label="Choose Size" />
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(['600g', '2.4kg'] as SizeKey[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      padding:      '14px 26px',
                      borderRadius: '12px',
                      border:       `1px solid ${size === s ? 'var(--gold)' : 'var(--hairline)'}`,
                      background:   size === s ? 'var(--gold)' : 'rgba(255,255,255,.02)',
                      color:        size === s ? '#1a1206' : 'var(--cream-dim)',
                      fontSize:     '14px',
                      fontWeight:   600,
                      letterSpacing:'.04em',
                      cursor:       'pointer',
                      transition:   'all .3s cubic-bezier(.2,.8,.2,1)',
                      boxShadow:    size === s ? '0 0 30px -6px rgba(245,197,24,.7)' : 'none',
                    }}
                  >
                    {s}
                    <small
                      style={{
                        display:       'block',
                        fontWeight:    500,
                        fontSize:      '11px',
                        opacity:       0.7,
                        letterSpacing: '.02em',
                        marginTop:     '2px',
                      }}
                    >
                      {s === '600g' ? 'Everyday loaf' : 'Party loaf'}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Range */}
            <div className="reveal d2" style={{ marginBottom: '30px' }}>
              <StepLabel n={2} label="Choose Range" />
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(['classic', 'gf'] as RangeKey[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRangeChange(r)}
                    style={{
                      padding:       '14px 26px',
                      borderRadius:  '12px',
                      border:        `1px solid ${range === r ? 'var(--gold)' : 'var(--hairline)'}`,
                      background:    range === r ? 'var(--gold)' : 'rgba(255,255,255,.02)',
                      color:         range === r ? '#1a1206' : 'var(--cream-dim)',
                      fontSize:      '14px',
                      fontWeight:    600,
                      letterSpacing: '.04em',
                      cursor:        'pointer',
                      transition:    'all .3s cubic-bezier(.2,.8,.2,1)',
                      boxShadow:     range === r ? '0 0 30px -6px rgba(245,197,24,.7)' : 'none',
                    }}
                  >
                    {RANGES[r].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 — Flavour */}
            <div className="reveal d3" style={{ marginBottom: '30px' }}>
              <StepLabel n={3} label="Choose Flavour" />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {currentRange.flavours.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => setFlavourIdx(i)}
                    style={{
                      padding:       '10px 18px',
                      borderRadius:  '999px',
                      border:        `1px solid ${safeFlavourIdx === i ? 'var(--gold)' : 'var(--hairline)'}`,
                      background:
                        safeFlavourIdx === i
                          ? 'rgba(245,197,24,.14)'
                          : 'rgba(255,255,255,.02)',
                      color:         safeFlavourIdx === i ? 'var(--gold)' : 'var(--cream-dim)',
                      fontSize:      '13px',
                      fontWeight:    600,
                      letterSpacing: '.02em',
                      cursor:        'pointer',
                      transition:    'all .3s',
                    }}
                  >
                    {f.name}
                    {f.prem > 0 ? ` +${fmt(f.prem)}` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div
              className="reveal d3"
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                gap:            '24px',
                flexWrap:       'wrap',
                marginTop:      '38px',
                paddingTop:     '28px',
                borderTop:      '1px solid var(--hairline)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize:      '11px',
                    fontWeight:    700,
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    color:         'var(--muted)',
                    marginBottom:  '2px',
                  }}
                >
                  Total
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-anton)',
                    fontSize:   'clamp(42px,5vw,64px)',
                    color:      'var(--gold)',
                    lineHeight: 0.9,
                  }}
                >
                  {fmt(price)}
                </div>
              </div>
              <button
                onClick={handleAddFromBuilder}
                className="bbk-btn bbk-btn-gold"
                style={{ padding: '18px 34px', fontSize: '15px' }}
              >
                Add to Cart <span className="ar">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ WHY US ══════════════════════════════ */}
      <section
        id="why"
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(90px,12vh,140px) 0',
          background: 'var(--brown)',
        }}
      >
        <div className="bbk-wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="eyebrow">Why Banana Bread King</span>
            <h2
              style={{
                fontFamily:    'var(--font-anton)',
                textTransform: 'uppercase',
                fontSize:      'clamp(36px,5.5vw,80px)',
                color:         'var(--cream)',
                lineHeight:    0.9,
                marginTop:     '12px',
              }}
            >
              Brisbane Baked, Always
            </h2>
          </div>

          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
              gap:                 '20px',
            }}
          >
            {[
              {
                icon:  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />,
                title: 'Local QLD Bananas',
                desc:  'Sourced from Queensland growers, ripened to perfection.',
              },
              {
                icon:  (
                  <>
                    <path d="M5 20c0-7 5-13 14-13 0 8-6 13-14 13z" />
                    <path d="M5 20c2-5 5-8 9-9.5" />
                  </>
                ),
                title: 'Gluten Free Options',
                desc:  "A full range that doesn't compromise on texture or taste.",
              },
              {
                icon:  <path d="M12 21c-3.3 0-6-2.4-6-6 0-4.4 3-9 6-12 3 3 6 7.6 6 12 0 3.6-2.7 6-6 6z" />,
                title: 'Egg Free',
                desc:  'Every loaf in our vegan range is completely egg free.',
              },
              {
                icon:  (
                  <>
                    <path d="M3 21V10l6 3V9l6 3V8l6 3v10H3z" />
                    <path d="M3 21h18" />
                  </>
                ),
                title: 'Wholesale Available',
                desc:  'Cafés & retailers — order by the carton. Login for trade pricing.',
              },
            ].map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className={`glass reveal${i > 0 ? ` d${i}` : ''}`}
                style={{
                  padding:        '34px 28px',
                  borderRadius:   '18px',
                  minHeight:      '240px',
                  display:        'flex',
                  flexDirection:  'column',
                  justifyContent: 'space-between',
                  transition:     'transform .45s cubic-bezier(.2,.8,.2,1), border-color .45s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = 'none'
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width:       '48px',
                    height:      '48px',
                    stroke:      'var(--gold)',
                    strokeWidth: '1.4',
                    fill:        'none',
                  }}
                >
                  {icon}
                </svg>
                <div>
                  <h3
                    style={{
                      fontFamily:    'var(--font-hanken)',
                      fontWeight:    700,
                      fontSize:      '19px',
                      letterSpacing: '.01em',
                      color:         'var(--cream)',
                      marginBottom:  '8px',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ QUOTE ═══════════════════════════════ */}
      <section
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(120px,20vh,260px) 0',
          background: 'var(--ink)',
          textAlign:  'center',
          overflow:   'hidden',
        }}
      >
        {/* Giant decorative quote mark */}
        <div
          style={{
            position:      'absolute',
            top:           '6%',
            left:          '50%',
            transform:     'translateX(-50%)',
            fontFamily:    'var(--font-playfair)',
            fontSize:      'clamp(160px,26vw,420px)',
            color:         'rgba(245,197,24,.08)',
            lineHeight:    1,
            pointerEvents: 'none',
            userSelect:    'none',
          }}
        >
          &ldquo;
        </div>

        <div className="bbk-wrap">
          <blockquote
            className="reveal"
            style={{
              position:   'relative',
              maxWidth:   '18ch',
              margin:     '0 auto',
              fontFamily: 'var(--font-playfair)',
              fontStyle:  'italic',
              fontWeight: 500,
              fontSize:   'clamp(30px,5.2vw,72px)',
              lineHeight: 1.15,
              color:      'var(--cream)',
            }}
          >
            In the heart of Brisbane, time is measured by the rising of dough and the warmth of the oven. We brought that rhythm to you.
          </blockquote>
          <div
            className="reveal d1"
            style={{
              marginTop:     '38px',
              fontSize:      '13px',
              fontWeight:    600,
              letterSpacing: '.24em',
              textTransform: 'uppercase',
              color:         'var(--amber)',
            }}
          >
            — Banana Bread King, Brisbane
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FINALE CTA ══════════════════════════ */}
      <section
        style={{
          position:   'relative',
          zIndex:     1,
          minHeight:  '88vh',
          display:    'grid',
          placeItems: 'center',
          overflow:   'hidden',
          textAlign:  'center',
        }}
      >
        {/* Textured background */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            zIndex:     0,
            background: 'linear-gradient(135deg, #241809 0%, #1a1208 30%, #2c1e09 60%, #1a1208 100%)',
          }}
        >
          <div
            style={{
              position:            'absolute',
              inset:               0,
              backgroundImage:     'repeating-linear-gradient(45deg, rgba(245,197,24,.03) 0 2px, transparent 2px 20px)',
            }}
          />
        </div>
        {/* Vignette */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            zIndex:     1,
            background: 'radial-gradient(80% 80% at 50% 50%, rgba(8,6,4,.55), rgba(8,6,4,.88))',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex:   2,
            padding:  `80px clamp(20px,5vw,72px)`,
          }}
        >
          <h2
            className="reveal"
            style={{
              fontFamily:    'var(--font-anton)',
              textTransform: 'uppercase',
              fontSize:      'clamp(44px,8.5vw,150px)',
              lineHeight:    0.86,
              color:         'var(--cream)',
            }}
          >
            One Bite And
            <br />
            {"You're "}
            <span style={{ color: 'var(--gold)' }}>Hooked.</span>
          </h2>

          <p
            className="reveal d1"
            style={{
              color:     'var(--cream-dim)',
              fontSize:  'clamp(15px,1.6vw,19px)',
              margin:    '26px 0 38px',
            }}
          >
            Order fresh. Order local. Order now.
          </p>

          <div
            className="reveal d2"
            style={{
              display:        'flex',
              gap:            '14px',
              justifyContent: 'center',
              flexWrap:       'wrap',
            }}
          >
            <Link href="/products/classic" className="bbk-btn bbk-btn-gold" style={{ padding: '18px 34px' }}>
              Order Your Loaf <span className="ar">→</span>
            </Link>
            <Link href="/products" className="bbk-btn bbk-btn-outline" style={{ padding: '18px 34px' }}>
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

// ─── Small helper component ────────────────────────────────────────────────
function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '12px',
        marginBottom:  '14px',
        fontSize:      '12px',
        fontWeight:    700,
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        color:         'var(--muted)',
      }}
    >
      <span
        style={{
          width:         '22px',
          height:        '22px',
          borderRadius:  '50%',
          border:        '1px solid var(--hairline)',
          display:       'grid',
          placeItems:    'center',
          fontSize:      '11px',
          color:         'var(--gold)',
          flexShrink:    0,
        }}
      >
        {n}
      </span>
      {label}
    </div>
  )
}
