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
  title: "Banana Bread King — Brisbane's Finest",
  description:
    "Hand-baked banana bread, the way Brisbane has loved it for years. Real Queensland bananas. No shortcuts. Just the loaf.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      className={`${anton.variable} ${playfair.variable} ${hanken.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
