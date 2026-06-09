import type { Metadata } from 'next'
import { Anton, Playfair_Display, Hanken_Grotesk, Caveat } from 'next/font/google'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['300', '400', '500', '600', '700'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['500', '600'],
})

export const metadata: Metadata = {
  title: "Banana Bread King — Brisbane's Finest Banana Bread",
  description:
    "Hand-baked banana bread, the way Brisbane has loved it for years. Real Queensland bananas. Egg-free, dairy-free & vegan options available.",
  keywords: [
    "Banana Bread",
    "Brisbane Banana Bread",
    "Vegan Banana Bread",
    "Gluten Free Banana Bread",
    "Bakehouse Brisbane",
    "Egg Free Banana Bread"
  ],
  metadataBase: new URL("https://bananabreadking.com.au"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Banana Bread King — Brisbane's Finest Banana Bread",
    description: "Hand-baked banana bread, the way Brisbane has loved it for years. Real Queensland bananas. No shortcuts. Just the loaf.",
    url: "https://bananabreadking.com.au",
    siteName: "Banana Bread King",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Banana Bread King",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banana Bread King — Brisbane's Finest Banana Bread",
    description: "Hand-baked banana bread, the way Brisbane has loved it for years. Real Queensland bananas.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Banana Bread King",
      "image": "https://bananabreadking.com.au/images/og-image.jpg",
      "@id": "https://bananabreadking.com.au/#localbusiness",
      "url": "https://bananabreadking.com.au",
      "telephone": "+61 448 550 416",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Unit 4 / 4 Unley Street",
        "addressLocality": "Brendale, Brisbane",
        "addressRegion": "QLD",
        "postalCode": "4500",
        "addressCountry": "AU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -27.324546,
        "longitude": 152.992224
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "05:00",
        "closes": "14:00"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Banana Bread King",
      "url": "https://bananabreadking.com.au"
    }
  ]

  return (
    <html
      lang="en-AU"
      className={`${anton.variable} ${playfair.variable} ${hanken.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
