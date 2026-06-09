'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BakingAnimation from '@/components/product/BakingAnimation'

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
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Builder state
  const [size, setSize]           = useState<SizeKey>('600g')
  const [range, setRange]         = useState<RangeKey>('classic')
  const [flavourIdx, setFlavourIdx] = useState(0)

  // Particles — client-only to avoid hydration mismatch
  const [particles, setParticles] = useState<ParticleStyle[]>([])

  useEffect(() => {
    setMounted(true)
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
    if (!mounted) return
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
  }, [mounted])

  // Builder helpers
  const currentRange   = RANGES[range]
  const safeFlavourIdx = Math.min(flavourIdx, currentRange.flavours.length - 1)
  const currentFlavour = currentRange.flavours[safeFlavourIdx]
  const price          = currentRange.base[size] + currentFlavour.prem

  function handleRangeChange(r: RangeKey) {
    setRange(r)
    setFlavourIdx(0)
  }

  // WhatsApp Link Builder for custom loaf
  const handleWhatsAppOrder = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const msg = `Merhaba! Banana Bread King web sitenizden kendi ekmeğimi oluşturdum ve sipariş vermek istiyorum:\n\n🍞 *Sipariş Detayları*:\n- Boyut: ${size}\n- Seri: ${range === 'classic' ? 'Classic' : 'Gluten Free & Vegan'}\n- Lezzet: ${currentFlavour.name}\n- Toplam Tutar: ${fmt(price)}\n\nŞimdiden teşekkürler!`
    const waUrl = `https://wa.me/61448550416?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
  }

  // Realistic toppings renderer
  const getToppings = () => {
    const slug = currentFlavour.slug
    const toppings: React.ReactNode[] = []
    
    if (slug.includes('choc-chip')) {
      const chips = [
        { top: '15%', left: '20%' }, { top: '30%', left: '45%' }, 
        { top: '22%', left: '75%' }, { top: '55%', left: '30%' }, 
        { top: '48%', left: '60%' }, { top: '65%', left: '78%' },
        { top: '35%', left: '15%' }, { top: '60%', left: '15%' }
      ]
      chips.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`choc-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '12px', height: '12px',
              background: '#241409',
              borderRadius: '50% 50% 60% 40% / 60% 40% 60% 40%',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.1)',
              transform: `rotate(${idx * 45}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
    } else if (slug.includes('walnut')) {
      const walnuts = [
        { top: '20%', left: '25%' }, { top: '35%', left: '55%' }, 
        { top: '25%', left: '70%' }, { top: '55%', left: '35%' },
        { top: '50%', left: '75%' }
      ]
      walnuts.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`walnut-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '24px', height: '18px',
              background: '#8c5827',
              borderRadius: '50% 50% 45% 45%',
              border: '2px solid #593512',
              boxShadow: '2px 3px 5px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.15)',
              transform: `rotate(${idx * 60}deg)`,
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '100%', height: '2px', background: '#593512' }} />
          </div>
        )
      })
    } else if (slug.includes('date')) {
      const dates = [
        { top: '18%', left: '30%' }, { top: '32%', left: '60%' }, 
        { top: '22%', left: '80%' }, { top: '60%', left: '25%' },
        { top: '55%', left: '65%' }
      ]
      dates.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`date-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '16px', height: '12px',
              background: '#361d15',
              borderRadius: '6px 4px 8px 5px',
              boxShadow: '1px 2px 4px rgba(0,0,0,0.6)',
              transform: `rotate(${idx * 35}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
    } else if (slug.includes('lemon')) {
      toppings.push(
        <div
          key="glaze"
          style={{
            position: 'absolute',
            inset: '5%',
            borderTop: '6px solid rgba(255,255,255,0.6)',
            borderLeft: '3px solid rgba(255,255,255,0.3)',
            borderRadius: 'inherit',
            filter: 'blur(2px)',
            zIndex: 2,
            opacity: 0.8,
            pointerEvents: 'none'
          }}
        />
      )
      const seeds = [
        { top: '15%', left: '20%' }, { top: '30%', left: '45%' }, { top: '22%', left: '75%' },
        { top: '55%', left: '30%' }, { top: '48%', left: '60%' }, { top: '65%', left: '78%' },
        { top: '40%', left: '15%' }, { top: '60%', left: '40%' }, { top: '25%', left: '35%' },
        { top: '70%', left: '55%' }, { top: '50%', left: '20%' }, { top: '35%', left: '70%' }
      ]
      seeds.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`poppy-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '3px', height: '3px',
              background: '#111',
              borderRadius: '50%',
              zIndex: 3,
              opacity: 0.95
            }}
          />
        )
      })
    } else if (slug.includes('cinnamon')) {
      toppings.push(
        <div
          key="cinnamon-swirl"
          style={{
            position: 'absolute',
            inset: '10%',
            border: '2px solid rgba(89, 43, 11, 0.4)',
            borderRadius: 'inherit',
            filter: 'blur(3px)',
            transform: 'scale(0.85) rotate(5deg)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
      )
      const raisins = [
        { top: '15%', left: '22%' }, { top: '33%', left: '48%' }, 
        { top: '20%', left: '78%' }, { top: '58%', left: '28%' }, 
        { top: '50%', left: '63%' }, { top: '62%', left: '80%' }
      ]
      raisins.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`raisin-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '14px', height: '10px',
              background: '#211611',
              borderRadius: '50% 40% 50% 40%',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.5)',
              transform: `rotate(${idx * 75}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
    } else if (slug.includes('raspberry-pear')) {
      const raspberries = [
        { top: '20%', left: '20%' }, { top: '35%', left: '50%' }, 
        { top: '25%', left: '75%' }, { top: '55%', left: '30%' },
        { top: '50%', left: '68%' }
      ]
      raspberries.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`rasp-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '16px', height: '16px',
              background: 'radial-gradient(circle, #b5223c, #630819)',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(181,34,60,0.5), 1px 2px 3px rgba(0,0,0,0.4)',
              zIndex: 3,
            }}
          />
        )
      })
      const pears = [
        { top: '30%', left: '30%' }, { top: '45%', left: '60%' }
      ]
      pears.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`pear-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '32px', height: '16px',
              background: 'linear-gradient(135deg, #e3c481, #b59247)',
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              boxShadow: '1px 2px 4px rgba(0,0,0,0.4)',
              transform: `rotate(${idx * 90 - 45}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
    } else if (slug.includes('blueberry')) {
      const blueberries = [
        { top: '15%', left: '25%' }, { top: '30%', left: '42%' }, 
        { top: '20%', left: '70%' }, { top: '55%', left: '33%' }, 
        { top: '48%', left: '58%' }, { top: '65%', left: '75%' },
        { top: '40%', left: '18%' }
      ]
      blueberries.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`blue-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '14px', height: '14px',
              background: 'radial-gradient(circle, #384275, #161a36)',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(56,66,117,0.6), 1px 2px 3px rgba(0,0,0,0.5)',
              zIndex: 3,
            }}
          />
        )
      })
    } else if (slug.includes('apple-cinnamon')) {
      toppings.push(
        <div
          key="cinnamon-swirl-2"
          style={{
            position: 'absolute',
            inset: '8%',
            border: '2.5px solid rgba(89, 43, 11, 0.4)',
            borderRadius: 'inherit',
            filter: 'blur(3px)',
            transform: 'scale(0.85) rotate(-10deg)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
      )
      const apples = [
        { top: '22%', left: '25%' }, { top: '35%', left: '50%' }, 
        { top: '24%', left: '72%' }, { top: '55%', left: '30%' },
        { top: '50%', left: '68%' }
      ]
      apples.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`apple-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '18px', height: '12px',
              background: '#dbab51',
              borderRadius: '3px',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.4)',
              transform: `rotate(${idx * 70}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
    } else if (slug.includes('mango-coconut')) {
      const mangos = [
        { top: '20%', left: '22%' }, { top: '32%', left: '48%' }, 
        { top: '22%', left: '76%' }, { top: '58%', left: '28%' },
        { top: '50%', left: '66%' }
      ]
      mangos.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`mango-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '16px', height: '14px',
              background: 'radial-gradient(circle, #f7b131, #c7830c)',
              borderRadius: '5px 4px 6px 3px',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.4)',
              transform: `rotate(${idx * 40}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
      const shreds = [
        { top: '15%', left: '30%', r: 15 }, { top: '35%', left: '15%', r: 60 },
        { top: '25%', left: '60%', r: -45 }, { top: '55%', left: '45%', r: 30 },
        { top: '45%', left: '78%', r: -20 }, { top: '65%', left: '20%', r: 75 },
        { top: '60%', left: '60%', r: 10 }
      ]
      shreds.forEach((pos, idx) => {
        toppings.push(
          <div
            key={`shred-${idx}`}
            style={{
              position: 'absolute',
              top: pos.top, left: pos.left,
              width: '15px', height: '2px',
              background: '#fffefb',
              opacity: 0.9,
              transform: `rotate(${pos.r}deg)`,
              zIndex: 3,
            }}
          />
        )
      })
    }
    
    return toppings
  }


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
          justifyContent:  'flex-start',
          padding:         '180px 0 48px',
          overflow:        'hidden',
          zIndex:          1,
        }}
      >
        {/* Background Video */}
        {mounted && (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position:      'absolute',
              top:           0,
              left:          0,
              width:         '100%',
              height:        '100%',
              objectFit:     'cover',
              zIndex:        0,
              opacity:       0.78,
            }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}


        {/* Video Overlay Gradient (for premium dark aesthetic & text contrast) */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            background:    'linear-gradient(to bottom, rgba(8, 6, 4, 0.35) 0%, rgba(8, 6, 4, 0.82) 100%)',
            zIndex:        1,
            pointerEvents: 'none',
          }}
        />

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
              'radial-gradient(circle, rgba(245,197,24,.22) 0%, rgba(196,119,26,.1) 38%, transparent 64%)',
            filter:        'blur(8px)',
            zIndex:        2,
            pointerEvents: 'none',
          }}
        />

        {/* Floating particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
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
            zIndex:         4,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'flex-start',
            width:          '100%',
          }}
        >
          <h1
            style={{
              fontFamily:    'var(--font-anton)',
              textAlign:     'left',
              fontSize:      'clamp(40px, 7.5vw, 92px)',
              lineHeight:    1.1,
              letterSpacing: '.01em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ display: 'block', color: 'var(--cream)' }}>{"Brisbane's"}</span>
            <span style={{ display: 'block', color: 'var(--gold)', marginTop: '12px' }}>Finest Bread</span>
          </h1>

          {/* Subtitle + CTAs */}
          <div
            style={{
              position:       'relative',
              zIndex:         5,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'flex-start',
              gap:            '16px',
              textAlign:      'left',
              marginTop:      '24px',
            }}
          >
            <p
              style={{
                maxWidth:  '430px',
                color:     'var(--cream-dim)',
                fontSize:  'clamp(13px, 1.25vw, 15px)',
              }}
            >
              Hand-baked banana bread, the way Brisbane has loved it for years.
              Real Queensland bananas. No shortcuts. Just the loaf.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
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
            zIndex:        4,
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

      {/* Baking scroll animation storytelling */}
      <BakingAnimation />

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
              lineHeight:    1.1,
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
                lineHeight:    1.1,
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
                  <Link
                    href={`/product/${p.slug}`}
                    style={{
                      fontSize:      '12px',
                      fontWeight:    700,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color:         '#1a1206',
                      background:    'var(--gold)',
                      padding:       '11px 16px',
                      borderRadius:  '999px',
                      textDecoration: 'none',
                      cursor:        'pointer',
                      transition:    'background .3s, transform .3s',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        'var(--gold-soft)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background = 'var(--gold)'
                    }}
                  >
                    Details
                  </Link>
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
              key={`${range}-${size}-${flavourIdx}`} // remount key for cool bake animations!
              style={{
                position:     'relative',
                width:        size === '2.4kg' ? '88%' : '78%',
                aspectRatio:  '1 / .62',
                borderRadius: '55% 55% 38% 38% / 75% 75% 30% 30%', // realistic dome top, flatter bottom
                background:   `linear-gradient(165deg, ${currentFlavour.c[0]}, ${currentFlavour.c[1]})`,
                boxShadow: `
                  inset 0 10px 24px rgba(255,255,255,0.18),
                  inset 0 -15px 35px rgba(0,0,0,0.55),
                  0 20px 45px -10px rgba(0,0,0,0.75),
                  0 12px 25px -12px ${currentFlavour.c[0]}80
                `,
                display:        'grid',
                placeItems:     'center',
                overflow:       'hidden',
                animation:      'loaf-bake 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                transition:     'width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {/* Realistic Bread Crust texture overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)',
                  backgroundSize: '8px 8px, 12px 12px',
                  backgroundPosition: '0 0, 4px 4px',
                  opacity: 0.85,
                  mixBlendMode: 'overlay',
                  borderRadius: 'inherit',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
              
              {/* Darker edge gradient shading for realistic baking crust */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(8,6,4,0.45) 85%)',
                  borderRadius: 'inherit',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              {/* Centre crack (realistic deep split showing moist yellow crumbs) */}
              <div
                style={{
                  position:     'absolute',
                  top:          '5%',
                  left:         '50%',
                  width:        '12%',
                  height:       '88%',
                  transform:    'translateX(-50%) rotate(0.5deg)',
                  background:   'linear-gradient(90deg, #593315 0%, #d89635 25%, #fcd66a 50%, #d89635 75%, #593315 100%)',
                  boxShadow: `
                    0 0 10px rgba(0,0,0,0.6),
                    inset 2px 0 5px rgba(0,0,0,0.5),
                    inset -2px 0 5px rgba(0,0,0,0.5)
                  `,
                  borderRadius: '60% 60% 50% 50% / 10% 10% 90% 90%',
                  zIndex: 2,
                }}
              >
                {/* Crack interior crumb textures */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '4px',
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                    opacity: 0.6
                  }}
                />
              </div>

              {/* Dynamic ingredients toppings */}
              {getToppings()}

              {/* Flavour label text overlay */}
              <div
                style={{
                  position:   'relative',
                  zIndex:     4,
                  fontFamily: 'var(--font-caveat)',
                  fontSize:   'clamp(22px,2.6vw,34px)',
                  color:      'var(--cream)',
                  textShadow: '0 2px 12px rgba(8,6,4,0.95), 0 0 8px rgba(8,6,4,0.85)',
                  textAlign:  'center',
                  padding:    '0 16px',
                  lineHeight: 1.1,
                  pointerEvents: 'none',
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
                  background:    'rgba(8,6,4,.75)',
                  padding:       '7px 16px',
                  borderRadius:  '999px',
                  border:        '1px solid rgba(245,197,24,.3)',
                  whiteSpace:    'nowrap',
                  zIndex:        4,
                  pointerEvents: 'none',
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
                lineHeight:    1.1,
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
              <a
                href="#"
                onClick={handleWhatsAppOrder}
                className="bbk-btn bbk-btn-gold"
                style={{ padding: '18px 34px', fontSize: '15px', textDecoration: 'none' }}
              >
                Shop <span className="ar">→</span>
              </a>
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
                lineHeight:    1.1,
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
                desc:  'Cafés & retailers — order by the carton. Contact us for bulk wholesale rates.',
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
          padding:    'clamp(100px,16vh,200px) 0',
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

      {/* ═══════════════════════════════ TESTIMONIALS MARQUEE ═══════════════════════════════ */}
      <section
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    '80px 0',
          background: 'var(--ink-2)',
          overflow:   'hidden',
          borderTop:  '1px solid var(--hairline-2)',
          borderBottom: '1px solid var(--hairline-2)',
        }}
      >
        <div className="bbk-wrap" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span className="eyebrow">Word of Mouth</span>
          <h2 style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(32px,5vw,70px)', textTransform: 'uppercase', color: 'var(--cream)', marginTop: '8px' }}>
            Loved Across <span style={{ color: 'var(--gold)' }}>Brisbane</span>
          </h2>
        </div>

        {/* Marquee Row 1 (scrolls left) */}
        <div style={{ display: 'flex', overflow: 'hidden', padding: '10px 0', width: '100%' }}>
          <div className="marquee-track">
            {Array.from({ length: 2 }).flatMap(() => [
              { quote: "The best gluten-free banana bread in Paddington. Incredibly moist!", author: "Sarah, Café Owner in Paddington" },
              { quote: "We stock the vegan loaves in West End, our customers love them toasted.", author: "James, West End Espresso Bar" },
              { quote: "Classic Brisbane taste. Our regular carton orders keep us perfectly stocked.", author: "Lucy, Windsor Coffee Shop" },
              { quote: "Egg-free recipe is a game changer. Pure Queensland bananas, outstanding texture.", author: "David, Bulimba Baker" },
              { quote: "Best wholesale banana bread supplier in Fortitude Valley. Reliable morning drops.", author: "Tom, Valley Drive-Thru" },
              { quote: "Gluten-free and dairy-free options are a hit in Spring Hill.", author: "Emma, Spring Hill Corporate" },
              { quote: "Golden, moist, caramelised crust that toasts beautifully.", author: "Chloe, Red Hill Coffee Hub" },
              { quote: "Highly recommended for allergen-conscious schools in Chermside.", author: "Robert, Chermside School" },
              { quote: "Sourced locally, baked fresh. The finest loaves in Clayfield.", author: "Aria, Clayfield Organics" },
              { quote: "Individual pre-sliced GF packs prevent cross-contamination perfectly.", author: "Marcus, CBD Espresso Cart" },
            ]).map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--hairline-2)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  minWidth: '300px',
                  maxWidth: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <p style={{ color: 'var(--cream-dim)', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{t.quote}&rdquo;</p>
                <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>— {t.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (scrolls right) */}
        <div style={{ display: 'flex', overflow: 'hidden', padding: '10px 0', width: '100%', marginTop: '16px' }}>
          <div className="marquee-track-reverse">
            {Array.from({ length: 2 }).flatMap(() => [
              { quote: "Always moist, dense, and naturally sweet. Outstanding quality.", author: "Isabella, New Farm Café Owner" },
              { quote: "Our customers in Teneriffe can't get enough of the Walnut & Date loaves.", author: "Noah, Teneriffe Social Club" },
              { quote: "Quick weekend pickup in Brendale. Excellent service and local produce.", author: "Oliver, Brendale Local" },
              { quote: "The Mango & Coconut gluten-free loaf is a tropical masterpiece.", author: "Sophie, Carindale Brunch Spot" },
              { quote: "Reliable delivery schedules across Southside hubs.", author: "Lucas, Mt Gravatt Café" },
              { quote: "Warming cinnamon and plump raisins in every classic bite.", author: "Mia, Hamilton Coffee Roasters" },
              { quote: "We upgraded our café menu in Ascot with these signature slabs.", author: "Ethan, Ascot Bistro" },
              { quote: "No shortcuts, just real loaves. Pure banana goodness.", author: "Zoe, Indooroopilly Eats" },
              { quote: "Our wholesale trade account was approved quickly. Free sample was delicious!", author: "Jack, Sandgate Espresso" },
              { quote: "Perfect caramelised crust when toasted. Brisbane's finest.", author: "Harper, Nundah Café" },
            ]).map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--hairline-2)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  minWidth: '300px',
                  maxWidth: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <p style={{ color: 'var(--cream-dim)', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{t.quote}&rdquo;</p>
                <p style={{ color: 'var(--gold)', fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>— {t.author}</p>
              </div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          .marquee-track {
            display: flex;
            gap: 20px;
            width: max-content;
            animation: scroll-left 50s linear infinite;
          }
          .marquee-track-reverse {
            display: flex;
            gap: 20px;
            width: max-content;
            animation: scroll-right 50s linear infinite;
          }
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════ FAQ SECTION ═══════════════════════════════ */}
      <section
        id="faq"
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(90px,12vh,150px) 0',
          background: 'var(--brown)',
          borderBottom: '1px solid var(--hairline-2)',
        }}
      >
        <div className="bbk-wrap">
          <div style={{ marginBottom: '56px', textAlign: 'center' }}>
            <span className="eyebrow">Any Questions?</span>
            <h2 style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(32px,5vw,70px)', textTransform: 'uppercase', color: 'var(--cream)', marginTop: '8px' }}>
              Frequently Asked <span style={{ color: 'var(--gold)' }}>Questions</span>
            </h2>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                q: "Where can I find the best gluten-free banana bread in Brisbane?",
                a: "You can order our premium, house-baked gluten-free banana bread directly through our website for delivery across Brisbane, or find us stocked in select local coffee shops from Paddington to Chermside. We use a special blend of alternative flours and 100% Queensland bananas to ensure our gluten-free loaves are just as moist, dense, and naturally sweet as our traditional recipes, without any compromise on texture."
              },
              {
                q: "Do you offer vegan or dairy-free banana bread options for Brisbane delivery?",
                a: "Yes! Alongside our classic recipes, we bake highly rated vegan and dairy-free banana bread daily. We supply many plant-based friendly cafés across the Brisbane CBD, West End, and South Brisbane. Our plant-based loaves use coconut oil and ripe local bananas to achieve that perfect caramelised crust when toasted."
              },
              {
                q: "Are your banana breads nut-free and school-safe?",
                a: "Our original traditional loaves and standard gluten-free slices are baked without nuts, making them an excellent choice for school lunchboxes and allergen-conscious Brisbane cafes. However, because we also bake a popular Walnut & Espresso Banana Bread, all items are prepared in a kitchen that handles tree nuts. We maintain strict segregation protocols to prevent cross-contamination."
              },
              {
                q: "How do I order wholesale banana bread for my Brisbane coffee shop?",
                a: "Artisan wholesale orders are easy to coordinate. We partner with independent Brisbane coffee shops, espresso bars, and drive-thrus across all suburbs—from Albany Creek down to Helensvale. To apply for a wholesale banana bread account, head over to our contact page or email our Brisbane baking team directly to request a free sample box for your café."
              },
              {
                q: "Do your wholesale loaves come pre-sliced or individually wrapped?",
                a: "We offer flexible packaging options tailored to your café's workflow. You can order our wholesale loaves as whole café-style slabs (perfect for cutting thick, rustic slices to your liking) or as individually wrapped, pre-sliced gluten-free banana bread portions. The single-serve wrapped slices are a massive hit for fast-paced espresso bars in the Brisbane CBD looking to prevent cross-contamination."
              },
              {
                q: "What is the delivery schedule for cafés in the Brisbane suburbs?",
                a: "We offer reliable, early-morning delivery to cafes, bakeries, and food trucks across major Brisbane regions. Our dispatch routes cover the Inner North (Windsor, Kedron, Red Hill), the East (New Farm, Teneriffe), and Southside hubs. Delivery schedules vary by zone, but most local coffee shops receive fresh drop-offs 2 to 3 times a week to keep stock perfectly fresh."
              },
              {
                q: "What is the shelf life of your artisan banana bread?",
                a: "Because we don't load our recipes with artificial preservatives, our fresh loaves stay incredibly moist for up to 5 days when stored in an airtight container at room temp. For Brisbane cafes managing stock control, our banana bread can be kept frozen for up to 3 months. Once thawed, it retains its signature texture and aromatic spice blend flawlessly."
              },
              {
                q: "What is the best way to toast café-style banana bread?",
                a: "To get that iconic café finish at home, cut a thick slice (around 2cm) and grill it on a sandwich press or under a toaster until the edges are golden brown and slightly caramelised. For the ultimate Brisbane brunch vibe, serve it warm with a generous slab of salted butter, a drizzle of local honey, or a smear of espresso cream cheese."
              },
              {
                q: "Can I buy single loaves directly from your Brisbane bakery, or is it wholesale only?",
                a: "While a large portion of our kitchen focuses on wholesale bakery supplies for Brisbane coffee shops, retail customers can absolutely buy direct! You can place an order online for weekend local pickup at our main kitchen, or catch us popping up at various local markets around the Greater Brisbane region."
              },
              {
                q: "Do you cater to corporate events and functions in South-East Queensland?",
                a: "Absolutely. We provide bulk catering platters, assorted mini-loaves, and mixed dietary boxes (including our popular gluten-free dairy-free options) for corporate events, office meetings, and private functions across Brisbane City and surrounding suburbs."
              },
              {
                q: "Where do you source the ingredients for your Brisbane-made banana bread?",
                a: "We are immensely proud to support regional growers. Every single loaf we bake uses 100% Queensland bananas sourced straight from North Queensland farms. We pair these with locally milled flours and Australian dairy to ensure our products reflect the absolute best of local, sunshine-state produce."
              }
            ].map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} style={{ borderBottom: '1px solid var(--hairline-2)' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '24px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                    }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--cream)', paddingRight: '20px' }}>
                      {item.q}
                    </span>
                    <span style={{ color: 'var(--gold)', fontSize: '20px', transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '350px' : '0',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease',
                    }}
                  >
                    <p style={{ paddingBottom: '24px', color: 'var(--cream-dim)', fontSize: '15px', lineHeight: 1.6, maxWidth: '68ch' }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ LOCAL SEO MAP SECTION ═══════════════════════════════ */}
      <section
        id="location"
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    'clamp(90px,12vh,150px) 0',
          background: 'var(--brown-2)',
          borderBottom: '1px solid var(--hairline-2)',
        }}
      >
        <div className="bbk-wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Location details card */}
            <div>
              <span className="eyebrow">Local Bakehouse</span>
              <h2 style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(32px,5vw,70px)', textTransform: 'uppercase', color: 'var(--cream)', marginTop: '8px', marginBottom: '24px', lineHeight: 1.1 }}>
                Visit Us In <span style={{ color: 'var(--gold)' }}>Brendale</span>
              </h2>
              <p style={{ color: 'var(--cream-dim)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px', maxWidth: '45ch' }}>
                Our artisan bakery is located in the heart of Brendale. While we bake cartons of signature banana bread for cafés all over South East Queensland, you can buy fresh loaves directly from our kitchen.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px' }}>📍</span>
                  <p style={{ fontSize: '14px', color: 'var(--cream)' }}>
                    <strong>Address:</strong><br />
                    Unit 4 / 4 Unley Street, Brendale QLD 4500, Brisbane, Australia
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px' }}>📞</span>
                  <p style={{ fontSize: '14px', color: 'var(--cream)' }}>
                    <strong>Phone:</strong><br />
                    <a href="tel:+61448550416" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>0448 550 416</a>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px' }}>🕒</span>
                  <p style={{ fontSize: '14px', color: 'var(--cream)' }}>
                    <strong>Opening Hours:</strong><br />
                    Monday – Sunday: 5:00 AM – 2:00 PM (Fresh hot loaves daily)
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Unit+4+%2F+4+Unley+street%2C+Brendale%2C+4500%2C+QLD%2C+BRISBANE"
                target="_blank"
                rel="noopener noreferrer"
                className="bbk-btn bbk-btn-gold"
                style={{ display: 'inline-flex', padding: '16px 28px', textDecoration: 'none' }}
              >
                Get Directions on Google Maps
              </a>
            </div>

            {/* Embedded maps iframe */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '420px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--hairline)',
                boxShadow: '0 20px 50px rgba(0,0,0,.3)',
              }}
            >
              <iframe
                title="Banana Bread King Brendale Bakehouse Location"
                src="https://maps.google.com/maps?q=Unit%204%20%2F%204%20Unley%20street%20Brendale%20QLD%204500&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
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
              lineHeight:    1.1,
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
            Brisbane's favourite artisan banana bread.
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
            <a
              href={process.env.NEXT_PUBLIC_SHOPIFY_URL || 'https://shop.bananabreadking.com.au'}
              target="_blank"
              rel="noopener noreferrer"
              className="bbk-btn bbk-btn-gold"
              style={{ padding: '18px 34px', textDecoration: 'none' }}
            >
              Shop <span className="ar">→</span>
            </a>
            <Link href="/products" className="bbk-btn bbk-btn-outline" style={{ padding: '18px 34px' }}>
              View Our Menu
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
