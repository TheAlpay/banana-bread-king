import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <div className="text-center mb-14">
        <p className="text-[#C6862A] text-[11px] font-bold tracking-[0.25em] uppercase mb-3">Our Collection</p>
        <h1 className="font-playfair text-5xl font-bold text-[#1C0A00] mb-4">Our Ranges</h1>
        <p className="text-[#7A5A42] max-w-sm mx-auto leading-relaxed">
          Choose your range — classic comfort or allergy-friendly goodness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/products/classic"
          className="group relative overflow-hidden rounded-2xl bg-[#1C0A00] text-[#FAF6EF] p-12 min-h-[300px] flex flex-col justify-end"
        >
          <div className="absolute top-8 right-8 text-[90px] opacity-10 group-hover:opacity-[0.18] group-hover:scale-110 transition-all duration-500 leading-none">
            🍌
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C6862A] font-bold mb-3">6 Flavours</p>
          <h2 className="font-playfair text-4xl font-bold mb-3">Classic Range</h2>
          <p className="text-[#8A6A52] mb-7 leading-relaxed text-sm max-w-xs">
            Our original banana bread recipes — egg free, no added sugar, baked with love.
          </p>
          <span className="inline-flex w-fit items-center gap-2 bg-[#FAF6EF] text-[#1C0A00] px-6 py-3 rounded-xl font-semibold text-sm group-hover:bg-[#C6862A] group-hover:text-white transition-colors">
            Shop Classic →
          </span>
        </Link>

        <Link
          href="/products/gluten-free-vegan"
          className="group relative overflow-hidden rounded-2xl bg-[#0E3D26] text-white p-12 min-h-[300px] flex flex-col justify-end"
        >
          <div className="absolute top-8 right-8 text-[90px] opacity-10 group-hover:opacity-[0.18] group-hover:scale-110 transition-all duration-500 leading-none">
            🌿
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold mb-3">6 Flavours</p>
          <h2 className="font-playfair text-4xl font-bold mb-3">Gluten Free & Vegan</h2>
          <p className="text-[#5A9070] mb-7 leading-relaxed text-sm max-w-xs">
            All the flavour, none of the gluten. Made with coconut and rice flour — completely vegan.
          </p>
          <span className="inline-flex w-fit items-center gap-2 bg-white text-[#0E3D26] px-6 py-3 rounded-xl font-semibold text-sm group-hover:bg-emerald-400 group-hover:text-white transition-colors">
            Shop GF & Vegan →
          </span>
        </Link>
      </div>
    </div>
  )
}
