'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const CrownSvg = () => (
  <svg className="w-[22px] h-[22px] flex-none" viewBox="0 0 24 24" fill="none">
    <path d="M2 7l4 4 6-7 6 7 4-4-2 13H4L2 7z" stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round" fill="rgba(245,197,24,.12)"/>
  </svg>
)

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const token = await cred.user.getIdToken()
      document.cookie = `firebase-token=${token}; path=/; max-age=3600`
      router.push(redirect)
    } catch (err: unknown) {
      console.error('Login error:', err)
      const code = (err as { code?: string })?.code ?? ''
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment and try again.')
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/password sign-in is not enabled. Please contact support.')
      } else {
        setError(`Sign-in failed: ${code || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const token = await cred.user.getIdToken()
      document.cookie = `firebase-token=${token}; path=/; max-age=3600`
      router.push(redirect)
    } catch (err: unknown) {
      console.error('Google login error:', err)
      const code = (err as { code?: string })?.code ?? ''
      if (code === 'auth/popup-closed-by-user') {
        setError('')
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.')
      } else {
        setError(`Google sign-in failed: ${code || 'Unknown error'}`)
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,.03)',
    border: '1px solid var(--hairline)',
    borderRadius: '12px',
    padding: '15px 16px',
    color: 'var(--cream)',
    fontFamily: 'inherit',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color .3s, background .3s',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* LEFT: Visual side */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#241809,#1a1208)' }} className="hidden md:block">
        {/* Texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(245,197,24,.04) 0 2px,transparent 2px 18px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(8,6,4,.55),rgba(8,6,4,.35) 50%,rgba(8,6,4,.7))' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(34px,4vw,60px)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-anton)', fontSize: '21px', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--cream)', textDecoration: 'none' }}>
            <CrownSvg />
            Banana Bread King
          </Link>
          <div style={{ maxWidth: '18ch' }}>
            <blockquote style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(28px,3.6vw,48px)', lineHeight: 1.15, color: 'var(--cream)' }}>
              Every loaf begins before dawn, while Brisbane sleeps.
            </blockquote>
            <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              — The Bakehouse, Fortitude Valley
            </div>
          </div>
          <Link href="/" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--cream-dim)', textDecoration: 'none', transition: 'color .3s' }}>
            ← Back to home
          </Link>
        </div>
      </div>

      {/* RIGHT: Form side */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(40px,5vw,80px) clamp(24px,4vw,56px)', background: 'linear-gradient(180deg,#0c0907,#070504)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Mobile brand */}
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-anton)', fontSize: '20px', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--cream)', marginBottom: '32px' }}>
            <CrownSvg />
            Banana Bread King
          </div>

          {/* Tabs */}
          <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', borderRadius: '999px', border: '1px solid var(--hairline)', background: 'rgba(255,255,255,.02)', marginBottom: '34px' }}>
            <span style={{ padding: '9px 22px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, letterSpacing: '.06em', background: 'var(--gold)', color: '#1a1206' }}>
              Login
            </span>
            <Link href="/auth/register" style={{ padding: '9px 22px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, letterSpacing: '.06em', color: 'var(--muted)', textDecoration: 'none', transition: 'color .3s' }}>
              Register
            </Link>
          </div>

          <h1 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(34px,4vw,50px)', color: 'var(--cream)', lineHeight: 1.05, marginBottom: '10px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '30px' }}>
            Sign in to track orders, save favourites and reorder in a tap.
          </p>

          {error && (
            <div style={{ marginBottom: '20px', padding: '13px 16px', borderRadius: '12px', background: 'rgba(196,119,26,.12)', border: '1px solid rgba(196,119,26,.4)', color: 'var(--amber)', fontSize: '13px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '9px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(245,197,24,.04)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Password
                </label>
                <Link href="/auth/forgot-password" style={{ fontSize: '13px', color: 'var(--amber)', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(245,197,24,.04)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6em',
                padding: '17px', borderRadius: '999px', marginBottom: '4px',
                background: 'var(--gold)', color: '#1a1206',
                fontFamily: 'var(--font-hanken)', fontWeight: 700, fontSize: '14px', letterSpacing: '.08em', textTransform: 'uppercase',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1,
                transition: 'background .3s, transform .3s',
                boxShadow: '0 10px 40px -12px rgba(245,197,24,.6)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'} {!loading && <span>→</span>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--muted-2)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', margin: '18px 0' }}>
            <span style={{ flex: 1, height: '1px', background: 'var(--hairline)' }} />
            or
            <span style={{ flex: 1, height: '1px', background: 'var(--hairline)' }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '15px', borderRadius: '999px',
              border: '1px solid var(--hairline)', background: 'rgba(255,255,255,.02)',
              color: 'var(--cream)', fontFamily: 'var(--font-hanken)', fontWeight: 600, fontSize: '14px',
              cursor: googleLoading ? 'not-allowed' : 'pointer', opacity: googleLoading ? .6 : 1,
              transition: 'border-color .3s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--hairline)'; }}
          >
            <svg viewBox="0 0 48 48" style={{ width: '18px', height: '18px' }}>
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.2 13.4 17.6 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/>
              <path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.7 2.3-7.9 2.3-6.4 0-11.8-3.9-13.6-9.4l-7.9 6.1C6.4 42.6 14.6 48 24 48z"/>
            </svg>
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p style={{ marginTop: '26px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
            New to Banana Bread King?{' '}
            <Link href="/auth/register" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
