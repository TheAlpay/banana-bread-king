import { MetadataRoute } from 'next'
import { products } from '@/data/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bananabreadking.com.au'

  const staticUrls = [
    '',
    '/about',
    '/products',
    '/products/classic',
    '/products/gluten-free-vegan',
    '/terms',
  ]

  const staticEntries = staticUrls.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: url === '' ? 1.0 : 0.8,
  }))

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...productEntries]
}
