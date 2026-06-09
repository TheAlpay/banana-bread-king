import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import ProductDetailContent from './ProductDetailContent'
import type { ProductDoc } from '@/types'
import type { Metadata } from 'next'

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Banana Bread King`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  // Make a full ProductDoc with dummy id/createdAt for typing compatibility
  const productWithId: ProductDoc = {
    id: product.slug,
    createdAt: new Date().toISOString(),
    ...product,
  }

  const related = products
    .filter((p) => p.range === product.range && p.slug !== slug)
    .slice(0, 4)
    .map((p) => ({
      id: p.slug,
      createdAt: new Date().toISOString(),
      ...p,
    })) as ProductDoc[]

  return <ProductDetailContent product={productWithId} related={related} />
}
