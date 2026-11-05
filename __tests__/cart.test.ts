import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatPrice,
  getItemCount,
} from '@/lib/cart';
import { CartItem } from '@/types';

const mockItems: CartItem[] = [
  {
    product: { id: 1, name: 'Headphones', price: 299900, image: '', category: 'Electronics', description: '' },
    quantity: 2,
  },
  {
    product: { id: 2, name: 'Shoes', price: 459900, image: '', category: 'Sports', description: '' },
    quantity: 1,
  },
];

describe('Cart utilities', () => {
  it('calculates subtotal correctly', () => {
    // 299900 * 2 + 459900 * 1 = 1059700
    expect(calculateSubtotal(mockItems)).toBe(1059700);
  });

  it('calculates subtotal as 0 for empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('calculates GST tax at 18%', () => {
    expect(calculateTax(100000)).toBe(18000);
  });

  it('calculates total as subtotal plus tax', () => {
    const subtotal = calculateSubtotal(mockItems);
    const expected = subtotal + calculateTax(subtotal);
    expect(calculateTotal(mockItems)).toBe(expected);
  });

  it('formats price in rupees with 2 decimal places', () => {
    expect(formatPrice(299900)).toBe('₹2999.00');
    expect(formatPrice(0)).toBe('₹0.00');
  });

  it('counts total item quantity across all cart entries', () => {
    expect(getItemCount(mockItems)).toBe(3); // 2 + 1
  });

  it('returns 0 item count for empty cart', () => {
    expect(getItemCount([])).toBe(0);
  });
});
