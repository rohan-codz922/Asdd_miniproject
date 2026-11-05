import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 299900,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
  },
  {
    id: 2,
    name: 'Running Shoes',
    price: 459900,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Sports',
    description: 'Lightweight and breathable shoes built for daily runs and long distances.',
  },
  {
    id: 3,
    name: 'Coffee Maker',
    price: 349900,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    category: 'Kitchen',
    description: 'Brew rich, aromatic coffee with 12-cup capacity and programmable timer.',
  },
  {
    id: 4,
    name: 'Yoga Mat',
    price: 129900,
    image: 'https://images.unsplash.com/photo-1601925228560-7a1be9db9d6e?w=400&h=400&fit=crop',
    category: 'Sports',
    description: 'Non-slip premium TPE yoga mat, 6mm thick, eco-friendly and lightweight.',
  },
  {
    id: 5,
    name: 'Desk Lamp',
    price: 89900,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    category: 'Home',
    description: 'LED desk lamp with adjustable brightness, color temperature, and USB charging port.',
  },
  {
    id: 6,
    name: 'Backpack',
    price: 219900,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Durable 30L travel backpack with padded laptop compartment and waterproof base.',
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}
