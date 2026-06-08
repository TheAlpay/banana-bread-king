'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-playfair text-4xl font-bold text-[#5C2B0F] mb-4">
        Thank you for your order!
      </h1>
      <p className="text-[#A08060] mb-8 max-w-md mx-auto">
        {"Your order is confirmed. You'll receive an email with your invoice and order details shortly."}
      </p>

      <div className="bg-[#F5EAD8] rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-semibold text-[#5C2B0F] mb-3">{"What's Next?"}</h2>
        <ul className="space-y-2 text-sm text-[#3D1A08]">
          <li className="flex items-start gap-2">
            <span className="text-[#5C2B0F] font-bold">1.</span>
            Check your email for your order confirmation and invoice PDF.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#5C2B0F] font-bold">2.</span>
            {"We'll bake your banana bread fresh and ship it from Brisbane."}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#5C2B0F] font-bold">3.</span>
            Track your order status in your account.
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/account/orders"
          className="bg-[#5C2B0F] text-[#FAF6EF] px-8 py-3 rounded-xl font-semibold hover:bg-[#3D1A08] transition-colors"
        >
          View My Orders
        </Link>
        <Link
          href="/products"
          className="bg-white border border-[#5C2B0F] text-[#5C2B0F] px-8 py-3 rounded-xl font-semibold hover:bg-[#FAF6EF] transition-colors"
        >
          Shop Again
        </Link>
      </div>
    </div>
  )
}
