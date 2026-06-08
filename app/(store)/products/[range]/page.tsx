import { notFound } from 'next/navigation'
import { classicProducts, gfVeganProducts } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'
import type { ProductDoc, Variety } from '@/types'

interface Params { range: string }

const rangeMap: Record<string, { label: string; desc: string; products: Omit<ProductDoc, 'id' | 'createdAt'>[] }> = {
  classic: {
    label: 'Classic Range',
    desc: 'Our original banana bread recipes — egg free, no added sugar, baked with love.',
    products: classicProducts,
  },
  'gluten-free-vegan': {
    label: 'Gluten Free & Vegan Range',
    desc: 'All the flavour, none of the gluten. Made with coconut and rice flour — completely vegan.',
    products: gfVeganProducts,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-playfair text-4xl font-bold text-[#8B4513] mb-3">{config.label}</h1>
        <p className="text-gray-500 max-w-2xl">{config.desc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsWithId.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {/* Carton notice */}
      <div className="mt-12 bg-[#f5e6d3] rounded-2xl p-6 text-center">
        <p className="text-[#8B4513] font-semibold">
          🏢 Ordering for a cafe or restaurant?
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Add 10+ loaves to your cart for a full carton bulk order.
        </p>
      </div>
    </div>
  )
}
