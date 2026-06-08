import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#8B4513] text-[#fdf8f0] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-playfair text-lg font-bold mb-3">🍌 Banana Bread King</h3>
          <p className="text-sm text-[#f5d9b3] leading-relaxed">
            {"Brisbane's favourite banana bread, baked fresh with local Queensland bananas."}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-[#f5d9b3]">
            <li><Link href="/products/classic" className="hover:text-white transition-colors">Classic Range</Link></li>
            <li><Link href="/products/gluten-free-vegan" className="hover:text-white transition-colors">Gluten Free & Vegan</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm text-[#f5d9b3]">
            <li>
              <a href="mailto:order@bananabreadking.com.au" className="hover:text-white transition-colors">
                order@bananabreadking.com.au
              </a>
            </li>
            <li>Brisbane, QLD, Australia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#7a3b10] px-4 sm:px-6 py-4 text-center text-xs text-[#f5d9b3]">
        © {new Date().getFullYear()} Banana Bread King. All rights reserved.
      </div>
    </footer>
  )
}
