import { products, getProductById } from '@/lib/products';

describe('Products data', () => {
  it('has at least one product', () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it('every product has required fields with valid values', () => {
    products.forEach(p => {
      expect(typeof p.id).toBe('number');
      expect(typeof p.name).toBe('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.price).toBeGreaterThan(0);
      expect(typeof p.category).toBe('string');
    });
  });

  it('product ids are unique', () => {
    const ids = products.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getProductById returns the correct product', () => {
    const p = getProductById(1);
    expect(p).toBeDefined();
    expect(p?.id).toBe(1);
  });

  it('getProductById returns undefined for a non-existent id', () => {
    expect(getProductById(9999)).toBeUndefined();
  });
});
