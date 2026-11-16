
"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  RotateCcw,
  ArrowRight,
  PackageCheck,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";

export default function CartHistoryDrawer() {
  const {
    cartHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    reorder,
    setIsCartOpen,
  } = useCart();

  const { user } = useAuth();

  if (!isHistoryOpen) return null;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);

      if (Number.isNaN(date.getTime())) return dateStr;

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close order history"
        onClick={() => setIsHistoryOpen(false)}
        className="absolute inset-0 bg-[#211B16]/35 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex w-full justify-end">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Order history"
          className="flex h-full w-full max-w-[490px] flex-col bg-[#FCFBF9] shadow-2xl animate-slide-in"
        >
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-[#EAE7E1] px-6 py-6 sm:px-8">
            <div>
              <h2 className="font-serif text-[27px] font-normal tracking-tight text-[#29251F]">
                Your orders
              </h2>

              <p className="mt-1 text-[11px] text-[#928A80]">
                {user?.name
                  ? `A record of your Luna purchases`
                  : "Your purchase history"}
                <span className="ml-2 text-[#A18462]">
                  {cartHistory.length}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(false)}
              aria-label="Close order history"
              className="flex h-9 w-9 items-center justify-center text-[#70675D] transition-colors hover:text-[#29251F]"
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </header>

          {/* Order list */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8">
            {cartHistory.length === 0 ? (
              <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1EEE8] text-[#A18462]">
                  <PackageCheck size={28} strokeWidth={1.2} />
                </div>

                <h3 className="font-serif text-3xl font-normal text-[#29251F]">
                  No orders yet.
                </h3>

                <p className="mt-3 max-w-[260px] text-xs leading-6 text-[#928A80]">
                  Your purchases will find a home here. Explore the
                  collection and discover your next favourite piece.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsHistoryOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="mt-8 flex items-center gap-3 bg-[#29251F] px-6 py-3.5 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#80694E]"
                >
                  View shopping bag
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between py-5">
                  <span className="text-[10px] uppercase tracking-[0.17em] text-[#8C8175]">
                    Purchase history
                  </span>

                  <span className="text-[10px] text-[#A49A8F]">
                    {cartHistory.length} orders
                  </span>
                </div>

                <div>
                  {cartHistory.map((order) => (
                    <section
                      key={order.id}
                      className="border-t border-[#EAE7E1] py-6"
                    >
                      {/* Order heading */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xs font-medium tracking-wide text-[#29251F]">
                              {order.order_number}
                            </h3>

                            <span
                              className={`text-[9px] uppercase tracking-[0.13em] ${order.status === "Delivered"
                                  ? "text-[#65745C]"
                                  : "text-[#A18462]"
                                }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#928A80]">
                            <Calendar size={12} strokeWidth={1.4} />
                            {formatDate(order.created_at)}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-serif text-lg text-[#29251F]">
                            {formatPrice(order.total_amount)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#928A80]">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "piece" : "pieces"}
                          </p>
                        </div>
                      </div>

                      {/* Purchased products */}
                      <div className="mt-5 space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="h-[68px] w-[58px] shrink-0 overflow-hidden bg-[#F0EDE7]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="truncate font-serif text-[16px] text-[#29251F]">
                                {item.name}
                              </h4>

                              <p className="mt-1 text-[10px] text-[#928A80]">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <span className="shrink-0 text-xs text-[#51483F]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order metadata */}
                      {(order.shipping_address || order.payment_method) && (
                        <div className="mt-5 space-y-2 border-t border-[#EEEAE4] pt-4">
                          {order.shipping_address && (
                            <div className="flex items-start gap-2 text-[10px] text-[#928A80]">
                              <MapPin
                                size={13}
                                className="mt-0.5 shrink-0"
                                strokeWidth={1.4}
                              />
                              <span className="leading-5">
                                {order.shipping_address}
                              </span>
                            </div>
                          )}

                          {order.payment_method && (
                            <div className="flex items-center gap-2 text-[10px] text-[#928A80]">
                              <CreditCard
                                size={13}
                                strokeWidth={1.4}
                              />
                              <span>{order.payment_method}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reorder */}
                      <div className="mt-5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => reorder(order)}
                          className="flex items-center gap-2 border border-[#DCD4C9] px-4 py-2.5 text-[9px] uppercase tracking-[0.16em] text-[#51483F] transition-colors hover:border-[#29251F] hover:bg-[#29251F] hover:text-white"
                        >
                          <RotateCcw size={12} strokeWidth={1.5} />
                          Reorder
                        </button>
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
