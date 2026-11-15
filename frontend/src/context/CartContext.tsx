"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, Cart, CartItem, Order } from "@/types";
import { apiFetch } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart;
  cartHistory: Order[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCartHistory: () => Promise<void>;
  checkout: (shippingAddress?: string, paymentMethod?: string, promoCode?: string) => Promise<Order>;
  reorder: (order: Order) => Promise<void>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const initialCart: Cart = {
  items: [],
  total_items: 0,
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token, setIsAuthModalOpen } = useAuth();
  const [cart, setCart] = useState<Cart>(initialCart);
  const [cartHistory, setCartHistory] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Show temporary toast notification
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Helper to recompute guest cart totals locally
  const computeLocalCart = (items: CartItem[]): Cart => {
    const total_items = items.reduce((acc, it) => acc + it.quantity, 0);
    const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
    const discount = 0;
    const total = subtotal + shipping - discount;
    return {
      items,
      total_items,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      discount,
      total: Math.round(total * 100) / 100,
    };
  };

  // Load wishlist from local storage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("luna_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch cart history
  const fetchCartHistory = useCallback(async () => {
    if (!token) {
      setCartHistory([]);
      return;
    }
    try {
      const history = await apiFetch<Order[]>("/api/cart/history", {}, token);
      setCartHistory(history);
    } catch (err) {
      console.error("Failed to fetch cart history:", err);
    }
  }, [token]);

  // Load cart when auth state changes (syncing guest items if applicable)
  useEffect(() => {
    const loadCart = async () => {
      if (token) {
        // Check if there are local guest items to sync into user cart
        const savedGuestCart = localStorage.getItem("luna_guest_cart");
        if (savedGuestCart) {
          try {
            const guestItems: CartItem[] = JSON.parse(savedGuestCart);
            if (guestItems.length > 0) {
              const synced = await apiFetch<Cart>(
                "/api/cart/sync",
                {
                  method: "POST",
                  body: JSON.stringify({ items: guestItems }),
                },
                token
              );
              setCart(synced);
              localStorage.removeItem("luna_guest_cart");
              fetchCartHistory();
              return;
            }
          } catch {
            localStorage.removeItem("luna_guest_cart");
          }
        }

        // Normal authenticated cart fetch
        try {
          const serverCart = await apiFetch<Cart>("/api/cart", {}, token);
          setCart(serverCart);
        } catch {
          // fallback
        }
        fetchCartHistory();
      } else {
        // Guest mode: load from localStorage
        const savedGuestCart = localStorage.getItem("luna_guest_cart");
        if (savedGuestCart) {
          try {
            const items: CartItem[] = JSON.parse(savedGuestCart);
            setCart(computeLocalCart(items));
          } catch {
            setCart(initialCart);
          }
        } else {
          setCart(initialCart);
        }
        setCartHistory([]);
      }
    };

    loadCart();
  }, [token, fetchCartHistory]);

  // Add to cart
  const addToCart = async (product: Product, quantity = 1) => {
    if (token) {
      try {
        const updated = await apiFetch<Cart>(
          "/api/cart/add",
          {
            method: "POST",
            body: JSON.stringify({
              product_id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
              category: product.category,
            }),
          },
          token
        );
        setCart(updated);
        notify(`Added "${product.name}" to cart`);
        setIsCartOpen(true);
      } catch (err: any) {
        notify(err.message || "Failed to add to cart");
      }
    } else {
      // Guest cart
      const currentItems = [...cart.items];
      const existingIdx = currentItems.findIndex((it) => it.product_id === product.id);

      if (existingIdx > -1) {
        currentItems[existingIdx].quantity += quantity;
      } else {
        currentItems.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          category: product.category,
        });
      }

      const updated = computeLocalCart(currentItems);
      setCart(updated);
      localStorage.setItem("luna_guest_cart", JSON.stringify(currentItems));
      notify(`Added "${product.name}" to cart`);
      setIsCartOpen(true);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (token) {
      try {
        const updated = await apiFetch<Cart>(
          `/api/cart/update?product_id=${encodeURIComponent(productId)}`,
          {
            method: "PUT",
            body: JSON.stringify({ quantity }),
          },
          token
        );
        setCart(updated);
      } catch (err: any) {
        notify(err.message || "Failed to update quantity");
      }
    } else {
      let currentItems = [...cart.items];
      if (quantity <= 0) {
        currentItems = currentItems.filter((it) => it.product_id !== productId);
      } else {
        const idx = currentItems.findIndex((it) => it.product_id === productId);
        if (idx > -1) {
          currentItems[idx].quantity = quantity;
        }
      }
      const updated = computeLocalCart(currentItems);
      setCart(updated);
      localStorage.setItem("luna_guest_cart", JSON.stringify(currentItems));
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    if (token) {
      try {
        const updated = await apiFetch<Cart>(
          `/api/cart/item/${encodeURIComponent(productId)}`,
          { method: "DELETE" },
          token
        );
        setCart(updated);
        notify("Item removed from cart");
      } catch (err: any) {
        notify(err.message || "Failed to remove item");
      }
    } else {
      const filtered = cart.items.filter((it) => it.product_id !== productId);
      const updated = computeLocalCart(filtered);
      setCart(updated);
      localStorage.setItem("luna_guest_cart", JSON.stringify(filtered));
      notify("Item removed from cart");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (token) {
      try {
        const updated = await apiFetch<Cart>("/api/cart/clear", { method: "DELETE" }, token);
        setCart(updated);
      } catch (err: any) {
        notify(err.message || "Failed to clear cart");
      }
    } else {
      setCart(initialCart);
      localStorage.removeItem("luna_guest_cart");
    }
  };

  // Checkout and persist to cart history
  const checkout = async (
    shippingAddress = "42 Royal Crescent, Marine Drive",
    paymentMethod = "Credit Card / UPI",
    promoCode = ""
  ): Promise<Order> => {
    if (!token) {
      setIsAuthModalOpen(true);
      notify("Please sign in or use 1-Click Demo Login to save your cart & complete checkout.");
      throw new Error("Authentication required for checkout history");
    }

    if (cart.items.length === 0) {
      throw new Error("Your cart is empty");
    }

    try {
      const order = await apiFetch<Order>(
        "/api/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            shipping_address: shippingAddress,
            payment_method: paymentMethod,
            promo_code: promoCode,
          }),
        },
        token
      );

      // Reset cart and refresh cart history
      setCart(initialCart);
      await fetchCartHistory();
      notify(`Order ${order.order_number} confirmed! Saved to your Cart History.`);
      return order;
    } catch (err: any) {
      notify(err.message || "Checkout failed");
      throw err;
    }
  };

  // Reorder items from past history
  const reorder = async (order: Order) => {
    for (const item of order.items) {
      const p: Product = {
        id: item.product_id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category || "Jewelry",
        rating: 4.9,
        reviews_count: 50,
        description: "",
        in_stock: true,
        is_bestseller: false,
        is_new: false,
      };
      await addToCart(p, item.quantity);
    }
    setIsHistoryOpen(false);
    setIsCartOpen(true);
    notify(`Items from ${order.order_number} added back to your cart!`);
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    let next: string[];
    if (wishlist.includes(productId)) {
      next = wishlist.filter((id) => id !== productId);
      notify("Removed from your wishlist");
    } else {
      next = [...wishlist, productId];
      notify("Saved to your wishlist");
    }
    setWishlist(next);
    localStorage.setItem("luna_wishlist", JSON.stringify(next));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartHistory,
        isCartOpen,
        setIsCartOpen,
        isHistoryOpen,
        setIsHistoryOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCartHistory,
        checkout,
        reorder,
        wishlist,
        toggleWishlist,
        notification,
        setNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

