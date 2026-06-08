'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Button from '@/components/ui/Button'

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
      setError('Could not send reset email. Please check the address.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-playfair text-2xl font-bold text-[#8B4513]">
            🍌 Banana Bread King
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-4">Reset Password</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-700 font-medium">Check your inbox</p>
              <p className="text-gray-500 text-sm mt-2">We sent a reset link to {email}</p>
              <Link href="/auth/login" className="block mt-6 text-[#8B4513] hover:underline text-sm">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
              <p className="text-sm text-gray-500">Enter your email and we'll send a reset link.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Send Reset Link
              </Button>
              <Link href="/auth/login" className="block text-center text-sm text-[#8B4513] hover:underline">
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
