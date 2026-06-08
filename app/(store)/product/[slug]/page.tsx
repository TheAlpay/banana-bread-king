'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, ChevronRight, Minus, Plus } from 'lucide-react'
import { products } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import Badge from '@/components/ui/Badge'
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

  const fakeProduct: ProductDoc = { ...product, id: product.slug, createdAt: '' }
  const unitPrice = fakeProduct.basePrice
  const isGF = product.range === 'gluten-free-vegan'

  const cartonMsg =
    quantity >= 10 ? '🎉 Full carton — bulk order!' :
    quantity >= 5  ? `${10 - quantity} more for a carton` :
    'Individual purchase'

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

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-[#A08060] mb-10">
        <Link href="/" className="hover:text-[#5C2B0F] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/products/${product.range}`} className="hover:text-[#5C2B0F] transition-colors">
          {isGF ? 'GF & Vegan' : 'Classic'}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#5C2B0F] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5EAD8]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg' }}
          />
          {isGF && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#1A5C3A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide">
                GF · VEGAN
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.map((f) => <Badge key={f} label={f} />)}
          </div>

          <h1 className="font-playfair text-4xl font-bold text-[#1C0A00] mb-3">{product.name}</h1>
          <p className="text-[#7A5A42] leading-relaxed mb-8">{product.description}</p>

          {/* Variety selector */}
          {product.varieties.length > 1 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A08060] mb-3">Size</p>
              <div className="flex gap-2">
                {product.varieties.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariety(v)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedVariety === v
                        ? 'border-[#5C2B0F] bg-[#5C2B0F] text-[#FAF6EF]'
                        : 'border-[#E8D5B8] text-[#7A5A42] hover:border-[#5C2B0F] hover:text-[#5C2B0F]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A08060] mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#F5EAD8] rounded-xl overflow-hidden border border-[#E8D5B8]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-[#5C2B0F] hover:bg-[#E8D5B8] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-5 font-bold text-[#1C0A00] min-w-[3rem] text-center tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-[#5C2B0F] hover:bg-[#E8D5B8] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                quantity >= 10
                  ? 'bg-[#E4F2EA] text-[#1A5C3A]'
                  : 'bg-[#F5EAD8] text-[#5C2B0F]'
              }`}>
                {cartonMsg}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-bold text-[#5C2B0F]">
              ${((unitPrice * quantity) / 100).toFixed(2)}
            </span>
            {quantity > 1 && (
              <span className="text-[#A08060] text-sm">${(unitPrice / 100).toFixed(2)} each</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-[#5C2B0F] text-[#FAF6EF] py-4 rounded-xl font-semibold hover:bg-[#3D1A08] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <ShoppingCart size={18} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="p-4 border-2 border-[#E8D5B8] rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors">
              <Heart size={20} className="text-[#D0B898]" />
            </button>
          </div>

          {!product.inStock && (
            <p className="text-xs text-[#A08060] mt-3 text-center">
              This product is currently out of stock.
            </p>
          )}
        </div>
      </div>

      {/* Related */}
      <div className="mt-20">
        <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">More from this range</p>
        <h2 className="font-playfair text-3xl font-bold text-[#1C0A00] mb-8">You might also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((p) => p.range === product.range && p.slug !== product.slug)
            .slice(0, 4)
            .map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow"
              >
                <div className="h-28 bg-[#F5EAD8] flex items-center justify-center text-4xl">🍌</div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#1A0800] group-hover:text-[#5C2B0F] transition-colors line-clamp-2 leading-snug">
                    {p.name}
                  </p>
                  <p className="text-[#5C2B0F] font-bold text-sm mt-1.5">${(p.basePrice / 100).toFixed(2)}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
