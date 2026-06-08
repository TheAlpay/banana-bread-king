import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Banana Bread King — Brisbane's Favourite Banana Bread",
  description:
    'Handcrafted banana bread made with local Queensland bananas. Classic and gluten-free vegan ranges. Order online for delivery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#fdf8f0] text-gray-800 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
