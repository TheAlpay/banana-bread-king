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
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-[2px]" onClick={closeCart} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#FAF6EF] z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1C0A00] text-[#FAF6EF]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} />
            <span className="font-playfair font-semibold text-lg">Your Cart</span>
            {totalItems > 0 && (
              <span className="bg-[#C6862A] text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="text-[#8A6A52] hover:text-white transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Carton progress */}
        {totalItems > 0 && !cartonDone && (
          <div className="px-6 py-3 bg-[#F5EAD8] border-b border-[#E8D5B8]">
            <div className="flex justify-between text-xs text-[#5C2B0F] font-medium mb-1.5">
              <span>Add {10 - progress} more for a full carton</span>
              <span className="tabular-nums">{progress} / 10</span>
            </div>
            <div className="h-1.5 bg-[#E8D5B8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5C2B0F] rounded-full transition-all duration-300"
                style={{ width: `${(progress / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {cartonDone && (
          <div className="px-6 py-3 bg-green-50 border-b border-green-100">
            <p className="text-xs text-green-700 font-semibold">🎉 Full carton — bulk order pricing applies!</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[#A08060]">
              <ShoppingBag size={36} className="mx-auto mb-4 opacity-25" />
              <p className="font-medium text-sm mb-4">Your cart is empty</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-block bg-[#5C2B0F] text-[#FAF6EF] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3D1A08] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variety}`} className="flex gap-3 bg-white rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="relative w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0 bg-[#F5EAD8]">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1A0800] truncate leading-tight">{item.name}</p>
                  <p className="text-xs text-[#A08060] mt-0.5">{item.variety}</p>
                  <p className="text-[#5C2B0F] font-bold text-sm mt-1">
                    ${(item.unitPrice / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <button
                    onClick={() => removeItem(item.productId, item.variety)}
                    className="text-[#D0B898] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="flex items-center gap-1.5 bg-[#F5EAD8] rounded-lg px-1.5 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variety, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center text-[#5C2B0F] hover:bg-[#E8D5B8] rounded transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-bold text-[#1A0800] w-4 text-center tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variety, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-[#5C2B0F] hover:bg-[#E8D5B8] rounded transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 bg-white border-t border-[#F2E4CE]">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#7A5A42]">Subtotal</span>
              <span className="font-bold text-[#1A0800]">${(subtotal / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-[#A08060] mb-4">GST included. Shipping at checkout.</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center w-full bg-[#5C2B0F] text-[#FAF6EF] py-3.5 rounded-xl font-semibold text-sm hover:bg-[#3D1A08] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center py-2.5 mt-2 text-[#5C2B0F] text-sm font-medium hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
