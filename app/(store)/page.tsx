import Link from 'next/link'
import { classicProducts, gfVeganProducts } from '@/data/products'

export default function HomePage() {
  const featured = [...classicProducts.slice(0, 2), gfVeganProducts[0]]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#fdf8f0] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center relative">
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-bold text-[#8B4513] leading-tight mb-6">
            {"Brisbane's Favourite"}
            <br />
            <span className="italic">Banana Bread</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-10">
            Handcrafted with love using fresh local Queensland bananas. Egg free, no added sugar, and baked fresh to order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products/classic"
              className="bg-[#8B4513] text-[#fdf8f0] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#7a3b10] transition-colors"
            >
              Classic Range
            </Link>
            <Link
              href="/products/gluten-free-vegan"
              className="bg-transparent border-2 border-[#8B4513] text-[#8B4513] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#8B4513] hover:text-[#fdf8f0] transition-colors"
            >
              Gluten Free & Vegan
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-[#8B4513] text-[#fdf8f0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#7a3b10]">
          {[
            { icon: '🍌', title: 'Local QLD Bananas', desc: 'Sourced fresh from Queensland farms' },
            { icon: '🌿', title: 'Gluten Free Options', desc: 'Coconut & rice flour recipes' },
            { icon: '🐣', title: 'Egg Free & No Added Sugar', desc: 'Wholesome ingredients always' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 px-6 py-3 sm:py-0 first:pl-0 last:pr-0">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-[#f5d9b3] text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-playfair text-3xl font-bold text-[#8B4513] text-center mb-10">
          Fan Favourites
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <Link key={product.slug} href={`/product/${product.slug}`} className="group">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-48 bg-[#f5e6d3] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  🍌
                </div>
                <div className="p-4">
                  <h3 className="font-playfair font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B4513] font-bold">
                      From ${(product.basePrice / 100).toFixed(2)}
                    </span>
                    <span className="text-xs text-[#8B4513] font-medium bg-[#f5e6d3] px-3 py-1 rounded-full group-hover:bg-[#8B4513] group-hover:text-[#fdf8f0] transition-colors">
                      Shop Now
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Range Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/products/classic" className="group relative overflow-hidden rounded-2xl bg-[#8B4513] text-[#fdf8f0] p-10 min-h-[220px] flex flex-col justify-end">
            <div className="absolute top-6 right-6 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">🍌</div>
            <p className="text-xs uppercase tracking-widest text-[#f5d9b3] mb-2">Our Classics</p>
            <h3 className="font-playfair text-3xl font-bold mb-3">Classic Range</h3>
            <p className="text-[#f5d9b3] text-sm mb-4">6 timeless flavours. The originals.</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold border border-[#fdf8f0]/40 rounded-lg px-4 py-2 w-fit group-hover:bg-[#fdf8f0] group-hover:text-[#8B4513] transition-colors">
              Shop Classic Range →
            </span>
          </Link>
          <Link href="/products/gluten-free-vegan" className="group relative overflow-hidden rounded-2xl bg-[#3d7a47] text-white p-10 min-h-[220px] flex flex-col justify-end">
            <div className="absolute top-6 right-6 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">🌿</div>
            <p className="text-xs uppercase tracking-widest text-green-200 mb-2">Allergy Friendly</p>
            <h3 className="font-playfair text-3xl font-bold mb-3">Gluten Free & Vegan</h3>
            <p className="text-green-100 text-sm mb-4">6 delicious flavours. All naturally free-from.</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold border border-white/40 rounded-lg px-4 py-2 w-fit group-hover:bg-white group-hover:text-[#3d7a47] transition-colors">
              Shop GF & Vegan →
            </span>
          </Link>
        </div>
      </section>

      {/* Carton CTA */}
      <section className="bg-[#f5e6d3] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#8B4513] font-semibold text-lg">
            🏢 Buying for your cafe or restaurant?
          </p>
          <p className="text-gray-600 mt-2 mb-6">
            Order 10+ loaves for a full carton. Perfect for wholesale and bulk orders.
          </p>
          <a
            href="mailto:order@bananabreadking.com.au?subject=Wholesale Enquiry"
            className="bg-[#8B4513] text-[#fdf8f0] px-8 py-3 rounded-xl font-semibold hover:bg-[#7a3b10] transition-colors inline-block"
          >
            Contact Us for Wholesale
          </a>
        </div>
      </section>

      {/* Order Banner */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-playfair text-3xl font-bold text-[#8B4513] mb-4">Ready to order?</h2>
        <p className="text-gray-500 mb-6">Fresh baked and shipped from Brisbane.</p>
        <a
          href="mailto:order@bananabreadking.com.au"
          className="bg-[#8B4513] text-[#fdf8f0] px-8 py-3 rounded-xl font-semibold hover:bg-[#7a3b10] transition-colors inline-block"
        >
          Email Us Your Order
        </a>
      </section>
    </div>
  )
}
