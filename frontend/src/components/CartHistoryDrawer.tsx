"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  History,
  ShoppingBag,
  PackageCheck,
  RotateCcw,
  Calendar,
  MapPin,
  CreditCard,
  Sparkles,
} from "lucide-react";

export default function CartHistoryDrawer() {
  const { cartHistory, isHistoryOpen, setIsHistoryOpen, reorder, setIsCartOpen } = useCart();
  const { user } = useAuth();

  if (!isHistoryOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsHistoryOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#E7E2DA] animate-slide-in"
          aria-label="Cart & Order History"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E7E2DA] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#B8976C]" />
              <div>
                <h2 className="font-serif text-xl font-medium text-stone-900">
                  Cart History & Orders
                </h2>
                {user && (
                  <p className="text-[11px] text-stone-500 font-light">
                    Saved carts for {user.name} ({cartHistory.length} orders)
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-full transition"
              aria-label="Close cart history"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cartHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-stone-400">
                  <PackageCheck className="w-8 h-8 stroke-1" />
                </div>
                <p className="font-serif text-lg font-medium text-stone-700">No Cart History Yet</p>
                <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                  When you check out items from your cart, their permanent snapshots, receipts, and order tracking will appear here.
                </p>
                <button
                  onClick={() => {
                    setIsHistoryOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#B8976C] transition"
                >
                  View Active Cart
                </button>
              </div>
            ) : (
              cartHistory.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#E7E2DA] bg-[#FAF8F5]/50 overflow-hidden shadow-xs hover:border-[#B8976C]/60 transition"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs tracking-wider text-stone-900">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-stone-900">
                        {formatPrice(order.total_amount)}
                      </span>
                      <p className="text-[10px] text-stone-400">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Item Thumbnails / Snapshot */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-stone-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-stone-500">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-stone-800 shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}

                    {/* Metadata & Receipt Details */}
                    <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-1">
                      {order.shipping_address && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">Delivered to: {order.shipping_address}</span>
                        </div>
                      )}
                      {order.payment_method && (
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>Method: {order.payment_method}</span>
                        </div>
                      )}
                    </div>

                    {/* Reorder Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => reorder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-[#B8976C] text-white text-[11px] font-semibold tracking-wider uppercase transition shadow-xs"
                      >
                        <RotateCcw className="w-3 h-3 text-[#DFC4A1]" />
                        <span>Reorder Items</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

