import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bananabreadking.com.au'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/api/',
        '/checkout/success',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
