import Link from 'next/link'
import { classicProducts, gfVeganProducts } from '@/data/products'
import ProductCard from '@/components/product/ProductCard'
import type { ProductDoc } from '@/types'

export default function HomePage() {
  const featured = [...classicProducts.slice(0, 2), gfVeganProducts[0]].map((p, i) => ({
    ...p,
    id: `featured-${i}`,
    createdAt: '',
  })) as ProductDoc[]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#FAF6EF] overflow-hidden">
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-28 sm:py-36 text-center">
          <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.3em] uppercase mb-7">
            Brisbane, Queensland · Est. 2024
          </p>
          <h1 className="font-playfair text-[clamp(3rem,9vw,6rem)] font-bold text-[#1C0A00] leading-[0.92] mb-8 tracking-tight">
            {"Brisbane's"}
            <br />
            <em className="text-[#5C2B0F] italic">Favourite</em>
            <br />
            Banana Bread
          </h1>
          <p className="text-[#7A5A42] text-lg max-w-sm mx-auto mb-12 leading-relaxed">
            Handcrafted with local Queensland bananas. Egg free, no added sugar, baked fresh to order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products/classic"
              className="bg-[#5C2B0F] text-[#FAF6EF] px-8 py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#3D1A08] transition-colors shadow-sm"
            >
              Classic Range
            </Link>
            <Link
              href="/products/gluten-free-vegan"
              className="border-2 border-[#5C2B0F] text-[#5C2B0F] px-8 py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-[#5C2B0F] hover:text-[#FAF6EF] transition-colors"
            >
              Gluten Free & Vegan
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-[#F5EAD8] border-y border-[#E8D5B8]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x divide-[#E8D5B8]">
          {[
            { icon: '🍌', title: 'Local QLD Bananas', desc: 'Sourced fresh from Queensland farms' },
            { icon: '🌿', title: 'Gluten Free Options', desc: 'Coconut & rice flour recipes' },
            { icon: '🐣', title: 'Egg Free · No Added Sugar', desc: 'Wholesome ingredients always' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 sm:px-8 first:pl-0 last:pr-0">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm text-[#3D1A08]">{item.title}</p>
                <p className="text-[#A08060] text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-2">Most Loved</p>
            <h2 className="font-playfair text-4xl font-bold text-[#1C0A00]">Fan Favourites</h2>
          </div>
          <Link href="/products" className="text-sm text-[#5C2B0F] font-semibold hover:underline hidden sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="sm:hidden text-center mt-6">
          <Link href="/products" className="text-sm text-[#5C2B0F] font-semibold hover:underline">
            View all products →
          </Link>
        </div>
      </section>

      {/* Range Promo */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            href="/products/classic"
            className="group relative overflow-hidden rounded-2xl bg-[#1C0A00] text-[#FAF6EF] p-10 min-h-[240px] flex flex-col justify-end"
          >
            <div className="absolute top-7 right-7 text-7xl opacity-[0.12] group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
              🍌
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C6862A] font-bold mb-2">6 Flavours</p>
            <h3 className="font-playfair text-3xl font-bold mb-2">Classic Range</h3>
            <p className="text-[#8A6A52] text-sm mb-5">Our original recipes. Egg free, no added sugar.</p>
            <span className="inline-flex items-center gap-2 bg-[#FAF6EF] text-[#1C0A00] px-5 py-2.5 rounded-xl text-sm font-semibold w-fit group-hover:bg-[#C6862A] group-hover:text-white transition-colors">
              Shop Classic →
            </span>
          </Link>

          <Link
            href="/products/gluten-free-vegan"
            className="group relative overflow-hidden rounded-2xl bg-[#0E3D26] text-white p-10 min-h-[240px] flex flex-col justify-end"
          >
            <div className="absolute top-7 right-7 text-7xl opacity-[0.12] group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
              🌿
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">6 Flavours</p>
            <h3 className="font-playfair text-3xl font-bold mb-2">Gluten Free & Vegan</h3>
            <p className="text-[#5A9070] text-sm mb-5">Coconut & rice flour. Completely free-from.</p>
            <span className="inline-flex items-center gap-2 bg-white text-[#0E3D26] px-5 py-2.5 rounded-xl text-sm font-semibold w-fit group-hover:bg-emerald-400 group-hover:text-white transition-colors">
              Shop GF & Vegan →
            </span>
          </Link>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="bg-[#F5EAD8]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
          <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-4">Wholesale</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1C0A00] mb-4">
            Buying for your café or restaurant?
          </h2>
          <p className="text-[#7A5A42] mb-8 max-w-md mx-auto">
            Order 10+ loaves for a full carton. Perfect for wholesale and bulk orders across Brisbane.
          </p>
          <a
            href="mailto:order@bananabreadking.com.au?subject=Wholesale Enquiry"
            className="inline-block bg-[#5C2B0F] text-[#FAF6EF] px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors shadow-sm"
          >
            Enquire About Wholesale
          </a>
        </div>
      </section>

      {/* Order Banner */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1C0A00] mb-4">
          Ready to order?
        </h2>
        <p className="text-[#7A5A42] mb-8">Fresh baked and shipped from Brisbane.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="bg-[#5C2B0F] text-[#FAF6EF] px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors shadow-sm"
          >
            Shop Now
          </Link>
          <a
            href="mailto:order@bananabreadking.com.au"
            className="border-2 border-[#5C2B0F] text-[#5C2B0F] px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[#5C2B0F] hover:text-[#FAF6EF] transition-colors"
          >
            Email Us
          </a>
        </div>
      </section>
    </div>
  )
}
