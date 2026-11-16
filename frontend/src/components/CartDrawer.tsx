
"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Check,
  CheckCircle2,
  Tag,
  History,
} from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    checkout,
    setIsHistoryOpen,
  } = useCart();

  const { user, setIsAuthModalOpen, demoLogin } = useAuth();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [shippingAddress] = useState(
    "14 Kensington Garden, Apt 4B, Mumbai"
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] =
    useState<any | null>(null);

  if (!isCartOpen) return null;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const shippingThreshold = 2000;
  const amountRemaining = Math.max(
    0,
    shippingThreshold - cart.subtotal
  );
  const progress = Math.min(
    100,
    (cart.subtotal / shippingThreshold) * 100
  );

  const discountAmount = appliedPromo
    ? Math.round(cart.subtotal * 0.1)
    : 0;

  const finalTotal = Math.max(0, cart.total - discountAmount);

  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutSuccessOrder(null);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();

    if (code === "LUNA10" || code === "WELCOME10") {
      setAppliedPromo(code);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckingOut(true);

    try {
      const order = await checkout(
        shippingAddress,
        "UPI / Card",
        appliedPromo || undefined
      );

      setCheckoutSuccessOrder(order);
    } catch {
      // Errors are handled by CartContext.
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={closeCart}
        className="absolute inset-0 bg-[#211B16]/35 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex w-full justify-end">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Shopping bag"
          className="flex h-full w-full max-w-[460px] flex-col bg-[#FCFBF9] shadow-2xl animate-slide-in"
        >
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-[#EAE7E1] px-6 py-6 sm:px-8">
            <div>
              <h2 className="font-serif text-[27px] font-normal tracking-tight text-[#29251F]">
                Shopping bag
                <span className="ml-2 font-sans text-sm text-[#999087]">
                  ({cart.total_items})
                </span>
              </h2>
              <p className="mt-1 text-[11px] text-[#928A80]">
                Your selected pieces
              </p>
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center text-[#70675D] transition-colors hover:text-[#29251F]"
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </header>

          {checkoutSuccessOrder ? (
            /* Success */
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#EDF0E9] text-[#65745C]">
                <CheckCircle2 size={27} strokeWidth={1.4} />
              </div>

              <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7956]">
                Order completed
              </span>

              <h3 className="mt-3 font-serif text-3xl font-normal text-[#29251F]">
                Thank you.
              </h3>

              <p className="mt-3 max-w-xs text-xs leading-6 text-[#898075]">
                Your order has been placed successfully. We hope you love
                your new pieces.
              </p>

              <div className="mt-8 w-full border-y border-[#EAE7E1] py-4 text-left">
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-[#928A80]">Order reference</span>
                  <span className="text-[#29251F]">
                    {checkoutSuccessOrder.order_number}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-[#928A80]">Total paid</span>
                  <span className="font-medium text-[#29251F]">
                    {formatPrice(checkoutSuccessOrder.total_amount)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-[#928A80]">Items</span>
                  <span className="text-[#29251F]">
                    {checkoutSuccessOrder.items.length}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCheckoutSuccessOrder(null);
                  setIsCartOpen(false);
                  setIsHistoryOpen(true);
                }}
                className="mt-8 flex w-full items-center justify-center gap-3 bg-[#29251F] px-5 py-4 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#80694E]"
              >
                View order history
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="mt-5 text-[10px] uppercase tracking-[0.16em] text-[#82786E] hover:text-[#29251F]"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              {/* Shipping progress */}
              {cart.items.length > 0 && (
                <div className="shrink-0 border-b border-[#EAE7E1] px-6 py-4 sm:px-8">
                  <div className="mb-2 flex justify-between gap-3 text-[11px]">
                    <span className="text-[#71685E]">
                      {amountRemaining > 0
                        ? `You're ${formatPrice(amountRemaining)} away from free shipping`
                        : "You've unlocked free shipping"}
                    </span>
                    <span className="shrink-0 text-[#8A795F]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="h-[3px] w-full bg-[#EAE6DF]">
                    <div
                      className="h-full bg-[#A18462] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8">
                {cart.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <h3 className="font-serif text-3xl font-normal text-[#29251F]">
                      Your bag is empty.
                    </h3>

                    <p className="mt-3 max-w-[250px] text-xs leading-6 text-[#928A80]">
                      Find something beautiful to make your own.
                    </p>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-7 border-b border-[#A18462] pb-1 text-[10px] uppercase tracking-[0.18em] text-[#80694E]"
                    >
                      Explore collection
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between py-5">
                      <span className="text-[10px] uppercase tracking-[0.17em] text-[#8C8175]">
                        Items in your bag
                      </span>
                      <span className="text-[10px] text-[#A49A8F]">
                        {cart.total_items} items
                      </span>
                    </div>

                    {cart.items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex gap-4 border-t border-[#EAE7E1] py-5"
                      >
                        <div className="h-[112px] w-[88px] shrink-0 overflow-hidden bg-[#F0EDE7]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-2">
                            <div className="min-w-0">
                              {item.category && (
                                <span className="mb-1 block text-[9px] uppercase tracking-[0.15em] text-[#9A7956]">
                                  {item.category}
                                </span>
                              )}

                              <h3 className="font-serif text-[17px] font-normal leading-snug text-[#29251F]">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-xs text-[#928A80]">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.product_id)
                              }
                              aria-label={`Remove ${item.name}`}
                              className="h-7 shrink-0 text-[#A69D92] transition hover:text-[#A65E5E]"
                            >
                              <Trash2 size={15} strokeWidth={1.4} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="text-[#82786E] hover:text-[#29251F]"
                              >
                                <Minus size={13} />
                              </button>

                              <span className="text-xs tabular-nums text-[#29251F]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                                className="text-[#82786E] hover:text-[#29251F]"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <span className="text-xs font-medium text-[#29251F]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout footer */}
              {cart.items.length > 0 && (
                <footer className="shrink-0 border-t border-[#EAE7E1] bg-white px-6 pb-6 pt-5 sm:px-8">
                  {/* Promo code */}
                  <div className="mb-5">
                    <div className="flex items-center gap-3 border-b border-[#E4DED5] pb-2">
                      <Tag size={14} className="text-[#9A7956]" />

                      <input
                        type="text"
                        value={promoInput}
                        disabled={!!appliedPromo}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError("");
                        }}
                        placeholder="Discount code"
                        className="min-w-0 flex-1 bg-transparent py-2 text-xs uppercase tracking-wider text-[#29251F] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A69D92]"
                      />

                      {appliedPromo ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedPromo(null);
                            setPromoInput("");
                          }}
                          className="text-[10px] uppercase tracking-wider text-[#A65E5E]"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="text-[10px] uppercase tracking-wider text-[#80694E] hover:text-[#29251F]"
                        >
                          Apply
                        </button>
                      )}
                    </div>

                    {promoError && (
                      <p className="mt-2 text-[10px] text-[#A65E5E]">
                        {promoError}
                      </p>
                    )}

                    {appliedPromo && (
                      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#65745C]">
                        <Check size={12} />
                        {appliedPromo} applied successfully
                      </p>
                    )}
                  </div>

                  {/* Price summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-[#81786E]">
                      <span>Subtotal</span>
                      <span className="text-[#29251F]">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-[#81786E]">
                      <span>Shipping</span>
                      <span className="text-[#65745C]">
                        {cart.shipping === 0
                          ? "Free"
                          : formatPrice(cart.shipping)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs text-[#65745C]">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[#EAE7E1] pt-4">
                      <span className="font-serif text-lg text-[#29251F]">
                        Total
                      </span>
                      <span className="font-serif text-[22px] text-[#29251F]">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Sign in */}
                  {!user && (
                    <div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-[#81786E]">
                      <span>Have a Luna account?</span>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsAuthModalOpen(true)}
                          className="text-[#80694E] underline underline-offset-2"
                        >
                          Sign in
                        </button>

                        <button
                          type="button"
                          onClick={demoLogin}
                          className="text-[#80694E] underline underline-offset-2"
                        >
                          Demo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Checkout */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="mt-5 flex w-full items-center justify-between bg-[#29251F] px-5 py-4 text-white transition-colors duration-300 hover:bg-[#80694E] disabled:cursor-wait disabled:opacity-60"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
                      {isCheckingOut
                        ? "Processing..."
                        : user
                          ? "Continue to checkout"
                          : "Sign in to checkout"}
                    </span>

                    <ArrowRight size={16} strokeWidth={1.5} />
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[9px] tracking-wide text-[#A0978C]">
                    <CheckCircle2 size={12} strokeWidth={1.4} />
                    Secure checkout
                  </div>

                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsHistoryOpen(true);
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-2 text-[10px] text-[#8A8075] transition hover:text-[#29251F]"
                    >
                      <History size={13} />
                      Order history
                    </button>
                  )}
                </footer>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
