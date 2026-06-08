'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { setUser, getUser } from '@/lib/firestore'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    abn: '',
    isWholesale: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  function update(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)

      const existing = await getUser(cred.user.uid)
      if (!existing) {
        await setUser(cred.user.uid, {
          uid: cred.user.uid,
          email: cred.user.email!,
          name: cred.user.displayName || cred.user.email!.split('@')[0],
          role: form.isWholesale ? 'wholesale' : 'customer',
          company: form.company || undefined,
          abn: form.abn || undefined,
          approved: !form.isWholesale,
          createdAt: new Date().toISOString(),
        })
      }

      const token = await cred.user.getIdToken()
      document.cookie = `firebase-token=${token}; path=/; max-age=3600`

      if (form.isWholesale && !existing) {
        router.push('/auth/pending-approval')
      } else {
        router.push('/account')
      }
    } catch (err: unknown) {
      console.error('Google register error:', err)
      const code = (err as { code?: string })?.code ?? ''
      if (code === 'auth/popup-closed-by-user') {
        setError('')
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.')
      } else if (code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please contact support.')
      } else {
        setError(`Google sign-in failed: ${code || 'Unknown error'}`)
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(cred.user, { displayName: form.name })

      await setUser(cred.user.uid, {
        uid: cred.user.uid,
        email: form.email,
        name: form.name,
        role: form.isWholesale ? 'wholesale' : 'customer',
        company: form.company || undefined,
        abn: form.abn || undefined,
        approved: !form.isWholesale,
        createdAt: new Date().toISOString(),
      })

      const token = await cred.user.getIdToken()
      document.cookie = `firebase-token=${token}; path=/; max-age=3600`

      if (form.isWholesale) {
        router.push('/auth/pending-approval')
      } else {
        router.push('/account')
      }
    } catch (err: unknown) {
      console.error('Register error:', err)
      const code = (err as { code?: string })?.code ?? ''
      const msg = err instanceof Error ? err.message : ''
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/password sign-in is not enabled. Please contact support.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your connection and try again.')
      } else {
        setError(`Registration failed: ${code || msg || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-playfair text-2xl font-bold text-[#1C0A00]">
            <span className="text-[#C6862A]">🍌</span>
            Banana Bread King
          </Link>
          <h1 className="text-xl font-semibold text-[#1C0A00] mt-5 mb-1">Create an account</h1>
          <p className="text-[#A08060] text-sm">Join Brisbane's favourite banana bread bakery</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Wholesale toggle — applies to both Google and email paths */}
          <div className="mb-5 p-4 bg-[#FAF6EF] rounded-xl border-2 border-[#E8D5B8]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isWholesale}
                onChange={(e) => update('isWholesale', e.target.checked)}
                className="w-4 h-4 rounded border-[#E8D5B8] accent-[#5C2B0F]"
              />
              <span className="text-sm font-semibold text-[#3D1A08]">
                {"I'm registering as a wholesale customer"}
              </span>
            </label>
            {form.isWholesale && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-[#7A5A42] bg-[#F5EAD8] px-3 py-2 rounded-lg">
                  Wholesale accounts require approval before placing orders.
                </p>
                {[
                  { label: 'Company Name', key: 'company', placeholder: 'Acme Cafe' },
                  { label: 'ABN', key: 'abn', placeholder: '12 345 678 901' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#7A5A42] mb-1.5">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border-2 border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm text-[#1C0A00] placeholder:text-[#C4A882] focus:outline-none focus:border-[#5C2B0F] bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-[#E8D5B8] rounded-xl py-3 text-sm font-semibold text-[#3D1A08] hover:bg-[#FAF6EF] hover:border-[#5C2B0F] transition-all disabled:opacity-60 mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F2E4CE]" />
            </div>
            <div className="relative flex justify-center text-xs text-[#B89878] bg-white px-3">
              or sign up with email
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'jane@example.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#7A5A42] mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => update(key, e.target.value)}
                  required
                  placeholder={placeholder}
                  className="w-full border-2 border-[#E8D5B8] rounded-xl px-4 py-3 text-sm text-[#1C0A00] placeholder:text-[#C4A882] focus:outline-none focus:border-[#5C2B0F] transition-colors bg-[#FAF6EF]"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5C2B0F] text-[#FAF6EF] py-3.5 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors disabled:opacity-60 shadow-sm"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#A08060] mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#5C2B0F] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
