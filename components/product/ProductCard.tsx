'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { ProductDoc, Variety } from '@/types'
import { useCartStore } from '@/store/cartStore'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: ProductDoc
  userPrice?: number
  isFavorite?: boolean
  onToggleFavorite?: (productId: string) => void
}

export default function ProductCard({ product, userPrice, isFavorite, onToggleFavorite }: ProductCardProps) {
  const [selectedVariety, setSelectedVariety] = useState<Variety>(product.varieties[0])
  const { addItem, openCart } = useCartStore()

  const unitPrice = userPrice ?? product.basePrice

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      variety: selectedVariety,
      quantity: 1,
      unitPrice,
      imageUrl: product.imageUrl,
    })
    openCart()
  }

  const isGF = product.range === 'gluten-free-vegan'

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <div className="relative h-52 bg-[#fdf8f0] overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/images/placeholder.svg'
              }}
            />
          </div>
        </Link>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 hover:scale-110 transition-transform"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={16}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-playfair font-semibold text-gray-900 hover:text-[#8B4513] transition-colors mb-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1 mb-3">
          {isGF && <Badge label="Gluten Free" variant="green" />}
          {product.features.slice(0, 2).map((f) => (
            <Badge key={f} label={f} />
          ))}
        </div>

        {product.varieties.length > 1 && (
          <div className="flex gap-2 mb-3">
            {product.varieties.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariety(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedVariety === v
                    ? 'bg-[#8B4513] text-[#fdf8f0] border-[#8B4513]'
                    : 'border-[#e8d5c0] text-gray-600 hover:border-[#8B4513]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-[#8B4513]">
            ${(unitPrice / 100).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-2 bg-[#8B4513] text-[#fdf8f0] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#7a3b10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
