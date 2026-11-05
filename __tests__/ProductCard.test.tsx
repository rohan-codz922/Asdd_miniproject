import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';
import { CartProvider } from '@/context/CartContext';

const mockProduct = {
  id: 1,
  name: 'Test Headphones',
  price: 299900,
  image: '/test.jpg',
  category: 'Electronics',
  description: 'A great test product',
};

function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('ProductCard component', () => {
  it('renders product name and formatted price', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
    expect(screen.getByText('₹2999.00')).toBeInTheDocument();
  });

  it('renders the product category', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('has an Add to Cart button', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('Add to Cart button is clickable', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    const btn = screen.getByRole('button', { name: /add to cart/i });
    expect(() => fireEvent.click(btn)).not.toThrow();
  });
});
