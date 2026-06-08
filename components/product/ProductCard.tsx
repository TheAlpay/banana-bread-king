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
  const isGF = product.range === 'gluten-free-vegan'

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

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col group">

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative h-52 bg-[#F5EAD8] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = '/images/placeholder.svg'
            }}
          />
          {isGF && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#1A5C3A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                GF · VEGAN
              </span>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-[#A08060] bg-white px-3 py-1 rounded-full shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {onToggleFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(product.id) }}
            className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={15} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-[#D0B898]'} />
          </button>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-playfair font-semibold text-[#1A0800] hover:text-[#5C2B0F] transition-colors leading-snug mb-2 text-[15px]">
            {product.name}
          </h3>
        </Link>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 2).map((f) => (
            <Badge key={f} label={f} />
          ))}
        </div>

        {/* Variety selector */}
        {product.varieties.length > 1 && (
          <div className="flex gap-1.5 mb-4">
            {product.varieties.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariety(v)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  selectedVariety === v
                    ? 'bg-[#5C2B0F] text-[#FAF6EF] border-[#5C2B0F]'
                    : 'border-[#E5D0B8] text-[#7A5A42] hover:border-[#5C2B0F]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F2E4CE]">
          <span className="text-lg font-bold text-[#5C2B0F]">
            ${(unitPrice / 100).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 bg-[#5C2B0F] text-[#FAF6EF] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#3D1A08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
