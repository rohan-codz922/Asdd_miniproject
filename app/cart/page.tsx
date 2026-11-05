'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  formatPrice,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from '@/lib/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started.</p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(items);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-start"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-indigo-600 font-bold mt-1">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="border-t pt-3 mt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(total)}</span>
            </div>
          </div>
          <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors active:scale-95">
            Proceed to Checkout
          </button>
          <Link
            href="/"
            className="block text-center mt-3 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
