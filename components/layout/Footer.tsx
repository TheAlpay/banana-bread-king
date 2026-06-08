import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1C0A00] text-[#FAF6EF] mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="font-playfair text-xl font-bold mb-3 flex items-center gap-2">
              <span className="text-[#C6862A]">🍌</span>
              <span>Banana Bread King</span>
            </div>
            <p className="text-sm text-[#8A6A52] leading-relaxed max-w-xs">
              Brisbane's favourite banana bread. Handcrafted with local Queensland bananas, baked fresh to order.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5C4030] mb-4">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">All Products</Link></li>
              <li><Link href="/products/classic" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">Classic Range</Link></li>
              <li><Link href="/products/gluten-free-vegan" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">Gluten Free & Vegan</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5C4030] mb-4">Account</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/account" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">Orders</Link></li>
              <li><Link href="/auth/register" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5C4030] mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:order@bananabreadking.com.au" className="text-[#8A6A52] hover:text-[#FAF6EF] transition-colors">
                  order@bananabreadking.com.au
                </a>
              </li>
              <li className="text-[#8A6A52]">Brisbane, QLD, Australia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5C4030]">
            © {new Date().getFullYear()} Banana Bread King. All rights reserved.
          </p>
          <p className="text-xs text-[#5C4030]">
            ABN — Brisbane, Queensland, Australia
          </p>
        </div>
      </div>
    </footer>
  )
}
