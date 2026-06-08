import Link from 'next/link'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="font-playfair text-3xl font-bold text-[#8B4513] mb-4">
          Wholesale Account Pending
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for registering! Your wholesale account is currently under review.
          We typically approve accounts within 1 business day.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Once approved, you will receive an email at the address you registered with.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:info@bananabreadking.com.au"
            className="bg-[#8B4513] text-[#fdf8f0] px-6 py-3 rounded-xl font-semibold hover:bg-[#7a3b10] transition-colors text-sm"
          >
            Contact Us
          </a>
          <Link
            href="/"
            className="bg-white border border-[#8B4513] text-[#8B4513] px-6 py-3 rounded-xl font-semibold hover:bg-[#fdf8f0] transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
