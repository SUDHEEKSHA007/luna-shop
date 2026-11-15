"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  History,
  Tag,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    setIsHistoryOpen,
  } = useCart();
  const { user, setIsAuthModalOpen, demoLogin } = useAuth();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("14 Kensington Garden, Apt 4B, Mumbai");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<any | null>(null);

  if (!isCartOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));
  const amountRemaining = Math.max(0, freeShippingThreshold - cart.subtotal);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "LUNA10" || code === "WELCOME10") {
      setAppliedPromo(code);
    } else {
      alert("Invalid code. Use code 'LUNA10' for 10% off!");
    }
  };

  const discountAmount = appliedPromo ? Math.round(cart.subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, cart.total - discountAmount);

  const handleCheckout = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckingOut(true);
    try {
      const order = await checkout(shippingAddress, "UPI / Card", appliedPromo || undefined);
      setCheckoutSuccessOrder(order);
    } catch {
      // handled in context
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          setIsCartOpen(false);
          setCheckoutSuccessOrder(null);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E7E2DA] animate-slide-in"
          aria-label="Shopping Cart Drawer"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E7E2DA] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B8976C]" />
              <h2 className="font-serif text-xl font-medium text-stone-900">
                Shopping Cart ({cart.total_items})
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutSuccessOrder(null);
              }}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-full transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State if just checked out */}
          {checkoutSuccessOrder ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-stone-900">
                Order Confirmed!
              </h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Order <strong className="text-stone-900">{checkoutSuccessOrder.order_number}</strong> has been placed and saved to your Cart History.
              </p>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 w-full text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Order Number:</span>
                  <span className="font-semibold text-stone-900">{checkoutSuccessOrder.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Paid:</span>
                  <span className="font-semibold text-stone-900">{formatPrice(checkoutSuccessOrder.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Items:</span>
                  <span className="text-stone-700">{checkoutSuccessOrder.items.length} pieces</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full pt-4">
                <button
                  onClick={() => {
                    setCheckoutSuccessOrder(null);
                    setIsCartOpen(false);
                    setIsHistoryOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#1C1917] text-white hover:bg-[#292524] text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4 text-[#DFC4A1]" />
                  <span>View All Cart History</span>
                </button>
                <button
                  onClick={() => {
                    setCheckoutSuccessOrder(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress Indicator */}
              <div className="bg-[#F5F1EB] px-5 py-3 border-b border-[#E7E2DA]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-stone-800">
                    {amountRemaining === 0 ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#B8976C]" />
                        Complimentary Express Shipping Unlocked!
                      </span>
                    ) : (
                      <>
                        Add <strong className="text-stone-900">{formatPrice(amountRemaining)}</strong> for Free Shipping
                      </>
                    )}
                  </span>
                  <span className="text-[11px] text-stone-500">{progressPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#B8976C] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-stone-400">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <p className="font-serif text-lg font-medium text-stone-700">Your cart is empty</p>
                    <p className="text-xs text-stone-400 max-w-xs">
                      Explore our handcrafted earrings, necklaces, and rings to begin your collection.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-2 px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-medium uppercase tracking-widest hover:bg-[#B8976C] transition"
                    >
                      Browse Jewelry
                    </button>
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-4 p-3 rounded-2xl border border-stone-100 hover:border-stone-200 bg-white transition group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-stone-900 line-clamp-1">
                              {item.name}
                            </h4>
                            {item.category && (
                              <p className="text-[10px] uppercase tracking-wider text-[#91724B]">
                                {item.category}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-stone-300 hover:text-rose-500 transition p-1"
                            title="Remove item"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity +/- */}
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-1 text-stone-600 hover:text-stone-900 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="p-1 text-stone-600 hover:text-stone-900 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-stone-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.items.length > 0 && (
                <div className="border-t border-[#E7E2DA] p-5 bg-[#FAF8F5] space-y-4">
                  {/* Promo Code Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. LUNA10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 uppercase placeholder:normal-case outline-none focus:border-[#B8976C]"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-800 tracking-wider transition"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <span>Code <strong>{appliedPromo}</strong> applied (10% off)</span>
                      <button onClick={() => setAppliedPromo(null)} className="text-stone-400 hover:text-stone-700">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Summary Rows */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-stone-900">{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium text-stone-900">
                        {cart.shipping === 0 ? "Complimentary" : formatPrice(cart.shipping)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Estimated Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Auth Callout if Guest */}
                  {!user && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-stone-700 flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-tight">
                          Sign in to sync your cart across devices and save your complete Cart & Order History.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsAuthModalOpen(true)}
                          className="flex-1 py-1.5 rounded-lg bg-[#1C1917] text-white text-[11px] font-semibold hover:bg-stone-800 transition"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={demoLogin}
                          className="flex-1 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-[11px] font-medium hover:bg-stone-50 transition"
                        >
                          1-Click Demo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Checkout CTA Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#1C1917] hover:bg-[#B8976C] text-white text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    <span>
                      {isCheckingOut
                        ? "Saving & Processing..."
                        : user
                        ? "Save & Complete Checkout"
                        : "Sign In to Checkout & Save History"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#DFC4A1]" />
                  </button>

                  {/* History shortcut link */}
                  {user && (
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsHistoryOpen(true);
                      }}
                      className="w-full text-center text-xs text-[#91724B] hover:text-[#1C1917] font-medium flex items-center justify-center gap-1.5 transition"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View Past Cart History & Orders</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

