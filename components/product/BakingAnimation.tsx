'use client'

import { useState, useEffect, useRef } from 'react'

interface Step {
  id: number
  title: string
  subtitle: string
  desc: string
  icon: string
  color: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Step 1: Ripe QLD Bananas',
    subtitle: 'Sourcing the Gold',
    desc: 'Every single loaf starts with 100% real Queensland bananas, ripened to perfection until they are highly aromatic and naturally sweet. We pair them with local flours and zero artificial preservatives.',
    icon: '🍌',
    color: '#f5c518',
  },
  {
    id: 2,
    title: 'Step 2: Gentle Folding',
    subtitle: 'No Shortcuts, Small Batches',
    desc: 'No high-speed mechanical over-mixing here. We hand-fold our ingredients slowly in small batches to preserve that dense, moist crumb texture that Brisbane banana bread lovers have adored for years.',
    icon: '🥣',
    color: '#c4771a',
  },
  {
    id: 3,
    title: 'Step 3: The Slow Bake',
    subtitle: 'Caramelising in the Oven',
    desc: 'Baked low and slow in our Brisbane ovens. As the loaf rises, the kitchen fills with the scent of warm cinnamon and brown sugar, while the outer crust caramelises to a rich, golden brown.',
    icon: '🔥',
    color: '#e05a10',
  },
  {
    id: 4,
    title: 'Step 4: Cooling & Slicing',
    subtitle: 'Ready for the Butter',
    desc: 'Slipped from the baking tins, cooled on rustic wire racks, and sliced thick (café-style). Ready to be grilled on a sandwich press and served warm with a melting slab of butter or honey.',
    icon: '🍞',
    color: '#a66829',
  },
]

export default function BakingAnimation() {
  const [activeStep, setActiveStep] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll position within the section to toggle the visual state
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const sectionHeight = rect.height
      const scrolledIntoSection = -rect.top // how far the top of the section is above the viewport top
      
      if (scrolledIntoSection < 0) {
        setActiveStep(1)
        return
      }
      
      // Calculate fraction of progress through the section
      const progressFraction = scrolledIntoSection / (sectionHeight - window.innerHeight)
      const clampedProgress = Math.max(0, Math.min(progressFraction, 0.99))
      
      // Map progress fraction to step index (1 to 4)
      const stepIndex = Math.floor(clampedProgress * 4) + 1
      setActiveStep(stepIndex)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '240vh', // long scroll distance to give space for animation
        background: 'var(--ink-2)',
        borderTop: '1px solid var(--hairline-2)',
        borderBottom: '1px solid var(--hairline-2)',
      }}
    >
      {/* Visual Animation Sticky Column */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {/* Left Side (Desktop Only Graphic Container) */}
        <div
          className="bbk-wrap"
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: '80px',
          }}
        >
          {/* Sticky Visual Stage */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '400px',
              borderRadius: '24px',
              background: 'rgba(255,255,255,.01)',
              border: '1px solid var(--hairline-2)',
              backdropFilter: 'blur(8px)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,.3)',
              overflow: 'hidden',
            }}
          >
            {/* Spotlight light behind illustration */}
            <div
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${STEPS[activeStep - 1].color}1a 0%, transparent 70%)`,
                transition: 'background 0.8s ease',
                zIndex: 0,
              }}
            />

            {/* Step 1: Banana Sourcing Visual */}
            <div
              style={{
                position: 'absolute',
                opacity: activeStep === 1 ? 1 : 0,
                transform: activeStep === 1 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: '100px', filter: 'drop-shadow(0 10px 20px rgba(245,197,24,.3))', animation: 'banana-float 3s ease-in-out infinite' }}>🍌</span>
              <p style={{ marginTop: '24px', fontFamily: 'var(--font-anton)', fontSize: '20px', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>100% QLD Bananas</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span className="tag-gf">Sweet</span>
                <span className="tag-gf">Ripe</span>
                <span className="tag-gf">Natural</span>
              </div>
            </div>

            {/* Step 2: Mixing Visual */}
            <div
              style={{
                position: 'absolute',
                opacity: activeStep === 2 ? 1 : 0,
                transform: activeStep === 2 ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-15deg)',
                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <div style={{ position: 'relative', width: '120px', height: '120px', display: 'grid', placeItems: 'center' }}>
                <span style={{ fontSize: '90px' }}>🥣</span>
                {/* Rotating folding swirl */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20%',
                    width: '60px',
                    height: '60px',
                    border: '3px dashed var(--gold)',
                    borderRadius: '50%',
                    animation: 'spin 4s linear infinite',
                    opacity: 0.6,
                  }}
                />
              </div>
              <p style={{ marginTop: '24px', fontFamily: 'var(--font-anton)', fontSize: '20px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hand-Folded Batter</p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Small batches only</p>
            </div>

            {/* Step 3: Oven Bake Visual */}
            <div
              style={{
                position: 'absolute',
                opacity: activeStep === 3 ? 1 : 0,
                transform: activeStep === 3 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-20px)',
                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '110px', animation: 'oven-glow 2s ease-in-out infinite' }}>🔥</span>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '25px',
                    width: '70px',
                    height: '35px',
                    background: 'rgba(224,90,16,0.3)',
                    filter: 'blur(10px)',
                    borderRadius: '50% 50% 0 0',
                    animation: 'heat-rise 1.5s ease-in-out infinite',
                  }}
                />
              </div>
              <p style={{ marginTop: '16px', fontFamily: 'var(--font-anton)', fontSize: '20px', color: '#e05a10', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Brisbane Deck Oven</p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Baked low & slow</p>
            </div>

            {/* Step 4: Slices & Steaming Visual */}
            <div
              style={{
                position: 'absolute',
                opacity: activeStep === 4 ? 1 : 0,
                transform: activeStep === 4 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '110px' }}>🍞</span>
                {/* Steaming lines */}
                <div style={{ position: 'absolute', top: '-20px', display: 'flex', gap: '8px' }}>
                  <span className="steam-line" style={{ animationDelay: '0s' }}>~</span>
                  <span className="steam-line" style={{ animationDelay: '0.4s' }}>~</span>
                  <span className="steam-line" style={{ animationDelay: '0.2s' }}>~</span>
                </div>
              </div>
              <p style={{ marginTop: '16px', fontFamily: 'var(--font-anton)', fontSize: '20px', color: '#a66829', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sliced Café-Style</p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>Ready to toast + butter</p>
            </div>

            {/* Steps indicator bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                display: 'flex',
                gap: '8px',
                zIndex: 2,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '4px',
                    borderRadius: '2px',
                    background: activeStep === i ? STEPS[i - 1].color : 'var(--hairline-2)',
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Side Text Block (Invisible placeholder to align layout with scrolling text) */}
          <div style={{ opacity: 0, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Scrolling Text Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
        }}
      >
        <div
          className="bbk-wrap"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: '80px',
          }}
        >
          {/* Left Column Placeholder (for alignment on desktop) */}
          <div className="hidden md:block" />

          {/* Right Column Scrolling Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10vh 0',
            }}
          >
            {STEPS.map((step) => {
              const isSelected = activeStep === step.id
              return (
                <div
                  key={step.id}
                  style={{
                    minHeight: '50vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: isSelected ? 1 : 0.25,
                    transform: isSelected ? 'translateX(0)' : 'translateX(10px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                    marginBottom: '10vh',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-anton)',
                      fontSize: '62px',
                      color: isSelected ? step.color : 'var(--muted-2)',
                      lineHeight: 1,
                      marginBottom: '12px',
                      transition: 'color 0.4s',
                    }}
                  >
                    0{step.id}
                  </span>
                  
                  {/* Mobile-only icon display */}
                  <div className="md:hidden" style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {step.icon}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: 'var(--cream)',
                      marginBottom: '8px',
                    }}
                  >
                    {step.subtitle}
                  </h3>
                  
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: step.color,
                      marginBottom: '16px',
                    }}
                  >
                    {step.title}
                  </p>

                  <p
                    style={{
                      color: 'var(--cream-dim)',
                      fontSize: '15px',
                      lineHeight: 1.7,
                      maxWidth: '44ch',
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Embedded Animations CSS */}
      <style jsx global>{`
        @keyframes banana-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes oven-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(224,90,16,0.3)); }
          50% { filter: drop-shadow(0 0 35px rgba(224,90,16,0.85)); }
        }
        @keyframes heat-rise {
          0% { transform: translateY(5px) scale(0.9); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-15px) scale(1.1); opacity: 0; }
        }
        .steam-line {
          display: inline-block;
          font-family: monospace;
          font-size: 28px;
          color: var(--cream-dim);
          opacity: 0;
          transform: rotate(-90deg);
          animation: steam-rise 2.5s ease-in-out infinite;
        }
        @keyframes steam-rise {
          0% { transform: translateY(10px) rotate(-90deg) scaleX(0.8); opacity: 0; }
          25% { opacity: 0.5; }
          50% { transform: translateY(-15px) rotate(-85deg) scaleX(1.2); }
          75% { opacity: 0.2; }
          100% { transform: translateY(-30px) rotate(-95deg) scaleX(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
