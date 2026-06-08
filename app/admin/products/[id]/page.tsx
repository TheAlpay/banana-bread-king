'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { ProductDoc, Range, Variety } from '@/types'
import Button from '@/components/ui/Button'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    range: 'classic' as Range,
    description: '',
    features: '',
    varieties: ['600g'] as Variety[],
    basePrice: '',
    stripePriceId: '',
    imageUrl: '',
    inStock: true,
  })

  useEffect(() => {
    getDoc(doc(getDb(), 'products', id)).then((snap) => {
      if (!snap.exists()) { router.push('/admin/products'); return }
      const p = snap.data() as ProductDoc
      setForm({
        name: p.name,
        slug: p.slug,
        range: p.range,
        description: p.description,
        features: p.features.join(', '),
        varieties: p.varieties,
        basePrice: (p.basePrice / 100).toFixed(2),
        stripePriceId: p.stripePriceId || '',
        imageUrl: p.imageUrl,
        inStock: p.inStock,
      })
      setLoading(false)
    })
  }, [id, router])

  function toggleVariety(v: Variety) {
    setForm((f) => ({
      ...f,
      varieties: f.varieties.includes(v) ? f.varieties.filter((x) => x !== v) : [...f.varieties, v],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.varieties.length) { alert('Select at least one variety'); return }
    setSaving(true)
    try {
      await updateDoc(doc(getDb(), 'products', id), {
        name: form.name,
        slug: form.slug,
        range: form.range,
        description: form.description,
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
        varieties: form.varieties,
        basePrice: Math.round(Number(form.basePrice) * 100),
        stripePriceId: form.stripePriceId || null,
        imageUrl: form.imageUrl,
        inStock: form.inStock,
      })
      router.push('/admin/products')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[#B89878]">Loading...</div>
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F]">Edit Product</h1>
        <button onClick={() => router.back()} className="text-sm text-[#5C2B0F] hover:underline">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D1A08] mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D1A08] mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              required
              className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D1A08] mb-1">Range</label>
          <select
            value={form.range}
            onChange={(e) => setForm((f) => ({ ...f, range: e.target.value as Range }))}
            className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          >
            <option value="classic">Classic Range</option>
            <option value="gluten-free-vegan">Gluten Free & Vegan Range</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D1A08] mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
            rows={3}
            className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D1A08] mb-1">Features (comma-separated)</label>
          <input
            type="text"
            value={form.features}
            onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
            placeholder="Egg Free, No Added Sugar, Gluten Free"
            className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D1A08] mb-2">Varieties</label>
          <div className="flex gap-3">
            {(['600g', '2.4kg'] as Variety[]).map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.varieties.includes(v)}
                  onChange={() => toggleVariety(v)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{v}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D1A08] mb-1">Base Price (AUD)</label>
            <input
              type="number"
              step="0.01"
              value={form.basePrice}
              onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))}
              required
              placeholder="12.00"
              className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D1A08] mb-1">Stripe Price ID (optional)</label>
            <input
              type="text"
              value={form.stripePriceId}
              onChange={(e) => setForm((f) => ({ ...f, stripePriceId: e.target.value }))}
              placeholder="price_..."
              className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D1A08] mb-1">Image URL</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="/images/my-product.jpg"
            className="w-full border border-[#E8D5B8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-[#3D1A08]">In Stock</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving} size="lg">Save Changes</Button>
          <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
