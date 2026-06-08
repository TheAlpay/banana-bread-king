'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, updateUser } from '@/lib/firestore'
import { UserDoc, Address } from '@/types'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uid, setUid] = useState('')

  const [form, setForm] = useState({
    name: '',
    company: '',
    abn: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'AU',
  })

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { router.push('/auth/login?redirect=/account/profile'); return }
      setUid(firebaseUser.uid)
      const userData = await getUser(firebaseUser.uid)
      if (userData) {
        setUser(userData)
        setForm({
          name: userData.name || '',
          company: userData.company || '',
          abn: userData.abn || '',
          line1: userData.shippingAddress?.line1 || '',
          line2: userData.shippingAddress?.line2 || '',
          city: userData.shippingAddress?.city || '',
          state: userData.shippingAddress?.state || '',
          postcode: userData.shippingAddress?.postcode || '',
          country: userData.shippingAddress?.country || 'AU',
        })
      }
      setLoading(false)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const shippingAddress: Address = {
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postcode: form.postcode,
        country: form.country,
      }
      await updateUser(uid, {
        name: form.name,
        company: form.company || undefined,
        abn: form.abn || undefined,
        shippingAddress,
      })
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: form.name })
      }
      setUser((u) => u ? { ...u, name: form.name } : u)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-[#B89878]">Loading...</div>
  }

  const isWholesale = user?.role === 'wholesale'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/account" className="text-sm text-[#B89878] hover:text-[#5C2B0F] flex items-center gap-1 mb-2">
            ← My Account
          </Link>
          <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F]">Edit Profile</h1>
        </div>
        {isWholesale && (
          <span className="inline-flex items-center gap-1 bg-[#5C2B0F] text-[#FAF6EF] text-xs px-3 py-1 rounded-full font-medium">
            Wholesale Account
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-[#1C0A00] mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3D1A08] mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3D1A08] mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border border-[#F2E4CE] rounded-xl px-4 py-2.5 text-sm bg-[#FAF6EF] text-[#B89878] cursor-not-allowed"
              />
              <p className="text-xs text-[#B89878] mt-1">Email cannot be changed here.</p>
            </div>
          </div>
        </div>

        {/* Business Info — only for wholesale */}
        {isWholesale && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-[#1C0A00] mb-4">Business Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3D1A08] mb-1">Company Name</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D1A08] mb-1">ABN</label>
                <input
                  type="text"
                  value={form.abn}
                  onChange={(e) => setForm((f) => ({ ...f, abn: e.target.value }))}
                  placeholder="12 345 678 901"
                  className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-[#1C0A00] mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3D1A08] mb-1">Address Line 1</label>
              <input
                type="text"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                placeholder="123 Main Street"
                className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3D1A08] mb-1">Address Line 2 (optional)</label>
              <input
                type="text"
                value={form.line2}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                placeholder="Unit, Suite, Apt..."
                className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-[#3D1A08] mb-1">City / Suburb</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Brisbane"
                  className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D1A08] mb-1">State</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                >
                  <option value="">Select</option>
                  {['QLD', 'NSW', 'VIC', 'SA', 'WA', 'TAS', 'ACT', 'NT'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D1A08] mb-1">Postcode</label>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(e) => setForm((f) => ({ ...f, postcode: e.target.value }))}
                  placeholder="4000"
                  maxLength={4}
                  className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" loading={saving} size="lg">
            Save Profile
          </Button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">Profile saved!</span>
          )}
        </div>
      </form>
    </div>
  )
}
