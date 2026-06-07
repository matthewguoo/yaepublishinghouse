'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    price: string;
    priceInCents: number;
    images: string[];
  };
}

interface CartData {
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
    } catch {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });
      fetchCart();
    } catch {
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
      fetchCart();
    } catch {
      setError('Failed to remove item');
    }
  };

  const checkout = async () => {
    setCheckoutLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Failed to start checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className={styles.container}>
          <p className={styles.loading}>Loading cart...</p>
        </div>
      </SiteLayout>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> › Cart
        </div>

        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Cart</h1>
          <div className={styles.titleLine} />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isEmpty ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <Link href="/products" className={styles.continueShopping}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div className={styles.cartItems}>
              {cart.items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <Link href={`/products/${item.product.slug}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>
                    <p className={styles.itemPrice}>{item.product.price}</p>
                  </div>
                  <div className={styles.itemQuantity}>
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className={styles.quantityBtn}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    ${((item.product.priceInCents * item.quantity) / 100).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.removeBtn}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${(cart.total / 100).toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.freeShipping}>Free</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${(cart.total / 100).toFixed(2)}</span>
              </div>
              <button
                onClick={checkout}
                className={styles.checkoutBtn}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <p className={styles.shippingNote}>
                Free shipping to US and Canada via Komaniya Express
              </p>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
