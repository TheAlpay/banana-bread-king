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
import Button from '@/components/ui/Button'

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
      if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
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
    <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-playfair text-2xl font-bold text-[#8B4513]">
            🍌 Banana Bread King
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-4">Create an account</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {/* Wholesale toggle — applies to both Google and email paths */}
          <div className="mb-5 p-4 bg-[#fdf8f0] rounded-xl border border-[#e8d5c0]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isWholesale}
                onChange={(e) => update('isWholesale', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#8B4513] focus:ring-[#8B4513]"
              />
              <span className="text-sm font-medium text-gray-700">
                {"I'm registering as a wholesale customer"}
              </span>
            </label>
            {form.isWholesale && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-[#8B4513]">
                  Wholesale accounts require approval before you can place orders.
                </p>
                {[
                  { label: 'Company Name', key: 'company', placeholder: 'Acme Cafe' },
                  { label: 'ABN', key: 'abn', placeholder: '12 345 678 901' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type="text"
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513] bg-white"
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
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 mb-5"
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
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
              or sign up with email
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith', required: true },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'jane@example.com', required: true },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', required: true },
            ].map(({ label, key, type, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => update(key, e.target.value)}
                  required={required}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]"
                />
              </div>
            ))}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#8B4513] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
