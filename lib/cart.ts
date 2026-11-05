import { CartItem } from '@/types';

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function calculateTax(subtotal: number, rate = 0.18): number {
  return Math.round(subtotal * rate);
}

export function calculateTotal(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items);
  return subtotal + calculateTax(subtotal);
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}
