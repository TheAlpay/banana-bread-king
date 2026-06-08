'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getFavorites, getProducts, toggleFavorite } from '@/lib/firestore'
import { ProductDoc } from '@/types'
import ProductCard from '@/components/product/ProductCard'

export default function FavoritesPage() {
  const router = useRouter()
  const [uid, setUid] = useState<string>('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<ProductDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push('/auth/login?redirect=/account/favorites'); return }
      setUid(user.uid)
      const [favData, allProducts] = await Promise.all([
        getFavorites(user.uid),
        getProducts(),
      ])
      const favIds = favData?.productIds ?? []
      setFavorites(favIds)
      setProducts(allProducts.filter((p) => favIds.includes(p.id)))
      setLoading(false)
    })
  }, [router])

  async function handleToggle(productId: string) {
    const isFav = favorites.includes(productId)
    await toggleFavorite(uid, productId, !isFav)
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== productId))
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } else {
      setFavorites((prev) => [...prev, productId])
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl font-bold text-[#5C2B0F]">My Favourites</h1>
        <Link href="/account" className="text-sm text-[#5C2B0F] hover:underline">← Dashboard</Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">❤️</p>
          <p>No favourites yet.</p>
          <Link href="/products" className="inline-block mt-4 text-[#5C2B0F] hover:underline text-sm">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
