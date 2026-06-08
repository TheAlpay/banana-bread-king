import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-playfair text-4xl font-bold text-[#8B4513] text-center mb-4">
        Our Ranges
      </h1>
      <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
        Choose your range — classic comfort or allergy-friendly goodness.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/products/classic" className="group relative overflow-hidden rounded-3xl bg-[#8B4513] text-[#fdf8f0] p-12 min-h-[280px] flex flex-col justify-end">
          <div className="absolute top-8 right-8 text-8xl opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 transform duration-300">🍌</div>
          <p className="text-xs uppercase tracking-widest text-[#f5d9b3] mb-2">6 Flavours</p>
          <h2 className="font-playfair text-4xl font-bold mb-3">Classic Range</h2>
          <p className="text-[#f5d9b3] mb-6">Our original recipes — egg free, no added sugar.</p>
          <span className="inline-flex w-fit items-center gap-2 bg-[#fdf8f0] text-[#8B4513] px-5 py-2.5 rounded-xl font-semibold text-sm group-hover:bg-white transition-colors">
            Shop Classic →
          </span>
        </Link>

        <Link href="/products/gluten-free-vegan" className="group relative overflow-hidden rounded-3xl bg-[#3d7a47] text-white p-12 min-h-[280px] flex flex-col justify-end">
          <div className="absolute top-8 right-8 text-8xl opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 transform duration-300">🌿</div>
          <p className="text-xs uppercase tracking-widest text-green-200 mb-2">6 Flavours</p>
          <h2 className="font-playfair text-4xl font-bold mb-3">Gluten Free & Vegan</h2>
          <p className="text-green-100 mb-6">Coconut & rice flour. Completely free-from.</p>
          <span className="inline-flex w-fit items-center gap-2 bg-white text-[#3d7a47] px-5 py-2.5 rounded-xl font-semibold text-sm group-hover:bg-green-50 transition-colors">
            Shop GF & Vegan →
          </span>
        </Link>
      </div>
    </div>
  )
}
