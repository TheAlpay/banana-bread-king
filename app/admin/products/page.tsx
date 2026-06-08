'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ProductDoc } from '@/types'
import Button from '@/components/ui/Button'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDoc[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    const snap = await getDocs(collection(db, 'products'))
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductDoc)))
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    await deleteDoc(doc(db, 'products', id))
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold text-[#8B4513]">Products</h1>
        <Link href="/admin/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fdf8f0] text-left">
                  {['Name', 'Range', 'Price', 'Varieties', 'Stock', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fdf8f0] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.range === 'classic' ? 'bg-[#f5e6d3] text-[#8B4513]' : 'bg-green-100 text-green-700'
                      }`}>
                        {p.range === 'classic' ? 'Classic' : 'GF & Vegan'}
                      </span>
                    </td>
                    <td className="px-4 py-3">${(p.basePrice / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-500">{p.varieties.join(', ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link href={`/admin/products/${p.id}`} className="text-[#8B4513] hover:underline text-xs font-medium">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-400 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
