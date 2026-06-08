import { Suspense } from 'react'
import CheckoutSuccessContent from './CheckoutSuccessContent'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-24 text-center text-gray-400">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
