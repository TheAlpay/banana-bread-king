'use client'

import { useCartStore } from '@/store/cartStore'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalItems, isCarton, cartonProgress } = useCartStore()
  const subtotal = getSubtotal()
  const totalItems = getTotalItems()
  const cartonDone = isCarton()
  const progress = cartonProgress()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#fdf8f0] z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#8B4513] text-[#fdf8f0]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="font-playfair font-semibold text-lg">Your Cart</span>
            {totalItems > 0 && (
              <span className="bg-[#fdf8f0] text-[#8B4513] text-xs font-bold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {/* Carton progress */}
        {totalItems > 0 && !cartonDone && (
          <div className="px-5 py-3 bg-[#f5e6d3] text-sm text-[#8B4513]">
            <div className="flex justify-between mb-1">
              <span>Add {10 - progress} more for a full carton!</span>
              <span className="font-medium">{progress}/10</span>
            </div>
            <div className="h-2 bg-[#e8d5c0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B4513] rounded-full transition-all"
                style={{ width: `${(progress / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {cartonDone && (
          <div className="px-5 py-3 bg-green-100 text-green-800 text-sm font-medium">
            Full carton order! Bulk order discount may apply.
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p>Your cart is empty</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-block mt-4 text-[#8B4513] font-medium hover:underline"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variety}`} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#f5e6d3]">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.variety}</p>
                  <p className="text-[#8B4513] font-semibold text-sm mt-0.5">
                    ${(item.unitPrice / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId, item.variety)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2 bg-[#f5e6d3] rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variety, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#e8d5c0] rounded transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variety, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#e8d5c0] rounded transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 bg-white border-t border-[#f0e8da]">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${(subtotal / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">GST included. Shipping calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#8B4513] text-[#fdf8f0] text-center py-3 rounded-xl font-semibold hover:bg-[#7a3b10] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              onClick={closeCart}
              className="block w-full text-center py-2 mt-2 text-[#8B4513] text-sm hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
