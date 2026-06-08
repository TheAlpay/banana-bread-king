'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch {
      setError('Could not send reset email. Please check the address and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center px-5">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-playfair text-2xl font-bold text-[#1C0A00]">
            <span className="text-[#C6862A]">🍌</span>
            Banana Bread King
          </Link>
          <h1 className="text-xl font-semibold text-[#1C0A00] mt-5 mb-1">Reset Password</h1>
          <p className="text-[#A08060] text-sm">We'll send a reset link to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-5">📧</div>
              <p className="font-semibold text-[#1C0A00] mb-2">Check your inbox</p>
              <p className="text-[#A08060] text-sm mb-6">We sent a reset link to <span className="font-medium text-[#5C2B0F]">{email}</span></p>
              <Link href="/auth/login" className="text-[#5C2B0F] font-semibold hover:underline text-sm">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#7A5A42] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-[#E8D5B8] rounded-xl px-4 py-3 text-sm text-[#1C0A00] placeholder:text-[#C4A882] focus:outline-none focus:border-[#5C2B0F] transition-colors bg-[#FAF6EF]"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5C2B0F] text-[#FAF6EF] py-3.5 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors disabled:opacity-60 shadow-sm"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link href="/auth/login" className="block text-center text-sm text-[#5C2B0F] font-medium hover:underline">
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
