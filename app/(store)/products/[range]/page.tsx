import { notFound } from 'next/navigation'
import Link from 'next/link'
import { classicProducts, gfVeganProducts } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'
import type { ProductDoc } from '@/types'

interface Params { range: string }

const rangeMap: Record<string, { label: string; desc: string; products: Omit<ProductDoc, 'id' | 'createdAt'>[]; isGF: boolean }> = {
  classic: {
    label: 'Classic Range',
    desc: 'Our original banana bread recipes — egg free, no added sugar, baked with love.',
    products: classicProducts,
    isGF: false,
  },
  'gluten-free-vegan': {
    label: 'Gluten Free & Vegan Range',
    desc: 'All the flavour, none of the gluten. Made with coconut and rice flour — completely vegan.',
    products: gfVeganProducts,
    isGF: true,
  },
}

export default async function RangePage({ params }: { params: Promise<Params> }) {
  const { range } = await params
  const config = rangeMap[range]
  if (!config) notFound()

  const productsWithId = config.products.map((p, i) => ({
    ...p,
    id: `${range}-${i}`,
    createdAt: '',
  })) as ProductDoc[]

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs text-[#A08060] mb-4">
          <Link href="/" className="hover:text-[#5C2B0F] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#5C2B0F] transition-colors">Ranges</Link>
          <span>/</span>
          <span className="text-[#5C2B0F] font-medium">{config.label}</span>
        </div>
        <p className={`text-[11px] font-bold tracking-[0.25em] uppercase mb-3 ${config.isGF ? 'text-[#1A5C3A]' : 'text-[#C6862A]'}`}>
          {config.isGF ? '6 Gluten Free & Vegan Flavours' : '6 Classic Flavours'}
        </p>
        <h1 className="font-playfair text-5xl font-bold text-[#1C0A00] mb-3">{config.label}</h1>
        <p className="text-[#7A5A42] max-w-lg leading-relaxed">{config.desc}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {productsWithId.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {/* Carton notice */}
      <div className={`mt-14 rounded-2xl p-7 text-center ${config.isGF ? 'bg-[#E4F2EA] border border-[#B8DEC8]' : 'bg-[#F5EAD8] border border-[#E8D5B8]'}`}>
        <p className={`font-semibold mb-1.5 ${config.isGF ? 'text-[#1A5C3A]' : 'text-[#5C2B0F]'}`}>
          🏢 Ordering for a café or restaurant?
        </p>
        <p className="text-[#7A5A42] text-sm">
          Add 10+ loaves to your cart for a full carton bulk order — perfect for wholesale customers.
        </p>
      </div>
    </div>
  )
}
