'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, ChevronRight } from 'lucide-react'
import { products } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { ProductDoc, Variety } from '@/types'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = products.find((p) => p.slug === slug)

  const [selectedVariety, setSelectedVariety] = useState<Variety>()
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    if (product) setSelectedVariety(product.varieties[0])
  }, [product])

  if (!product) return notFound()

  const fakeProduct: ProductDoc = {
    ...product,
    id: product.slug,
    createdAt: '',
  }

  const unitPrice = fakeProduct.basePrice

  function handleAddToCart() {
    if (!selectedVariety) return
    addItem({
      productId: fakeProduct.id,
      name: fakeProduct.name,
      slug: fakeProduct.slug,
      variety: selectedVariety,
      quantity,
      unitPrice,
      imageUrl: fakeProduct.imageUrl,
    })
    openCart()
  }

  const isGF = product.range === 'gluten-free-vegan'
  const cartonMsg = quantity >= 10
    ? '🎉 Full carton — bulk order!'
    : quantity >= 5
    ? `Add ${10 - quantity} more for a full carton`
    : 'Individual purchase'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-[#8B4513]">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/products/${product.range}`} className="hover:text-[#8B4513] capitalize">
          {isGF ? 'GF & Vegan' : 'Classic'}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-[#fdf8f0] rounded-3xl overflow-hidden flex items-center justify-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-30 font-bold">🍌</div>
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {isGF && <Badge label="Gluten Free" variant="green" />}
            {product.features.map((f) => <Badge key={f} label={f} />)}
          </div>

          <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-500 text-base leading-relaxed mb-6">{product.description}</p>

          {/* Variety */}
          {product.varieties.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
              <div className="flex gap-3">
                {product.varieties.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariety(v)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                      selectedVariety === v
                        ? 'border-[#8B4513] bg-[#8B4513] text-[#fdf8f0]'
                        : 'border-gray-200 text-gray-600 hover:border-[#8B4513]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#f5e6d3] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-[#8B4513] font-bold hover:bg-[#e8d5c0] transition-colors"
                >
                  −
                </button>
                <span className="px-4 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-[#8B4513] font-bold hover:bg-[#e8d5c0] transition-colors"
                >
                  +
                </button>
              </div>
              <span className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                quantity >= 10 ? 'bg-green-100 text-green-700' : 'bg-[#f5e6d3] text-[#8B4513]'
              }`}>
                {cartonMsg}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-bold text-[#8B4513]">
              ${((unitPrice * quantity) / 100).toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm">${(unitPrice / 100).toFixed(2)} each</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              className="flex-1"
            >
              <ShoppingCart size={18} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <button className="p-4 border-2 border-[#e8d5c0] rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors">
              <Heart size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-20">
        <h2 className="font-playfair text-2xl font-bold text-[#8B4513] mb-6">You might also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((p) => p.range === product.range && p.slug !== product.slug)
            .slice(0, 4)
            .map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-28 bg-[#fdf8f0] rounded-lg flex items-center justify-center text-4xl mb-3">🍌</div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#8B4513] transition-colors line-clamp-2">
                  {p.name}
                </p>
                <p className="text-[#8B4513] font-bold text-sm mt-1">${(p.basePrice / 100).toFixed(2)}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
