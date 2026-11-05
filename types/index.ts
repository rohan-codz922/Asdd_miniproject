export interface Product {
  id: number;
  name: string;
  price: number; // in paise (₹1 = 100 paise)
  image: string;
  category: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
