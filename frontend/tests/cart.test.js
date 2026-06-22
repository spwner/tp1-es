const cartModule = require('../src/cart');

describe('cart module', () => {
  beforeEach(() => {
    cartModule.clearCart();
  });

  it('starts empty', () => {
    expect(cartModule.getCart()).toEqual([]);
    expect(cartModule.calculateTotal()).toBe(0);
    expect(cartModule.calculateShipping()).toBe(10);
  });

  it('adds a product to the cart and increases quantity', () => {
    cartModule.addToCart({ id: 1, name: 'A', price: 100, emoji: '🍪' });
    expect(cartModule.getCart()).toHaveLength(1);

    cartModule.addToCart({ id: 1, name: 'A', price: 100, emoji: '🍪' });
    expect(cartModule.getCart()[0].quantity).toBe(600);
  });

  it('updates quantity and removes item when quantity is zero', () => {
    cartModule.addToCart({ id: 1, name: 'A', price: 100, emoji: '🍪' });
    cartModule.updateQuantity(1, 0);
    expect(cartModule.getCart()).toEqual([]);
  });

  it('calculates totals correctly', () => {
    cartModule.addToCart({ id: 1, name: 'A', price: 100, emoji: '🍪' });
    cartModule.addToCart({ id: 2, name: 'B', price: 50, emoji: '🍪' });
    expect(cartModule.calculateTotal()).toBeCloseTo(100 * 0.5 + 50 * 0.5);
    expect(cartModule.calculateShipping()).toBeGreaterThanOrEqual(10);
  });
});
