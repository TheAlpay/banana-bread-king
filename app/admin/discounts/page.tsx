'use client'

import { useEffect, useState } from 'react'
import { getDocs, collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { DiscountCodeDoc } from '@/types'
import Button from '@/components/ui/Button'

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCodeDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: '',
    active: true,
  })

  async function fetchDiscounts() {
    const snap = await getDocs(collection(getDb(), 'discountCodes'))
    setDiscounts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DiscountCodeDoc)))
    setLoading(false)
  }

  useEffect(() => { fetchDiscounts() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.type === 'percentage' ? Number(form.value) : Math.round(Number(form.value) * 100),
        minOrderAmount: form.minOrderAmount ? Math.round(Number(form.minOrderAmount) * 100) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
        active: form.active,
        usedCount: 0,
        usedBy: [],
        createdAt: new Date().toISOString(),
      }
      const ref = await addDoc(collection(getDb(), 'discountCodes'), data)
      setDiscounts((prev) => [...prev, { id: ref.id, ...data } as DiscountCodeDoc])
      setForm({ code: '', type: 'percentage', value: '', minOrderAmount: '', maxUses: '', expiresAt: '', active: true })
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await updateDoc(doc(getDb(), 'discountCodes', id), { active: !active })
    setDiscounts((prev) => prev.map((d) => d.id === id ? { ...d, active: !active } : d))
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this discount code?')) return
    await deleteDoc(doc(getDb(), 'discountCodes', id))
    setDiscounts((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F]">Discounts</h1>
        <Button onClick={() => setShowForm(!showForm)}>+ Create Code</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h2 className="font-semibold text-[#1C0A00] col-span-full">New Discount Code</h2>
          {[
            { label: 'Code', key: 'code', placeholder: 'WELCOME10', required: true },
            { label: 'Value', key: 'value', placeholder: form.type === 'percentage' ? '10' : '5.00', required: true },
            { label: 'Min Order (AUD)', key: 'minOrderAmount', placeholder: '50.00', required: false },
            { label: 'Max Uses', key: 'maxUses', placeholder: 'Unlimited', required: false },
            { label: 'Expires', key: 'expiresAt', placeholder: '', required: false, type: 'date' },
          ].map(({ label, key, placeholder, required, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[#7A5A42] mb-1">{label}</label>
              <input
                type={type || 'text'}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                required={required}
                placeholder={placeholder}
                className="w-full border border-[#E8D5B8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2B0F]/30 focus:border-[#5C2B0F]"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-[#7A5A42] mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'percentage' | 'fixed' }))}
              className="w-full border border-[#E8D5B8] rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div className="col-span-full flex gap-3">
            <Button type="submit" loading={saving}>Create</Button>
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EF] text-left">
                {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Status', 'Expires', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-[#7A5A42] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-[#FAF6EF] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-[#5C2B0F]">{d.code}</td>
                  <td className="px-4 py-3 capitalize text-[#A08060]">{d.type}</td>
                  <td className="px-4 py-3 font-medium">
                    {d.type === 'percentage' ? `${d.value}%` : `$${(d.value / 100).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3 text-[#A08060]">
                    {d.minOrderAmount ? `$${(d.minOrderAmount / 100).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-[#A08060]">
                    {d.usedCount}{d.maxUses ? `/${d.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${d.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#A08060]'}`}>
                      {d.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#B89878]">
                    {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('en-AU') : '—'}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => toggleActive(d.id, d.active)} className="text-[#5C2B0F] hover:underline text-xs font-medium">
                      {d.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:underline text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-[#B89878]">No discount codes yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
