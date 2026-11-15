"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, Heart, Star, ShoppingBag, ShieldCheck, Sparkles, Truck } from "lucide-react";

export default function ProductQuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAdd = async () => {
    setIsAdding(true);
    await addToCart(quickViewProduct, quantity);
    setIsAdding(false);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E7E2DA] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 shadow-sm transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-[#F5F1EB] overflow-hidden">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover object-center"
            />
            {quickViewProduct.is_bestseller && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1C1917] text-[#DFC4A1] text-xs font-semibold tracking-widest uppercase">
                Bestseller
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#91724B]">
                  {quickViewProduct.category}
                </span>
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 transition"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-900">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickViewProduct.rating)
                          ? "fill-amber-400 stroke-amber-400"
                          : "text-stone-300 stroke-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-stone-700">{quickViewProduct.rating}</span>
                <span className="text-xs text-stone-400">({quickViewProduct.reviews_count} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-semibold text-stone-900">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.original_price && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(quickViewProduct.original_price)}
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-stone-600 font-light leading-relaxed pt-2 border-t border-stone-100">
                {quickViewProduct.description}
              </p>

              {/* Atelier hallmarks */}
              <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-stone-600">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8976C]" />
                  <span>18K Gold Vermeil</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8976C]" />
                  <span>Hypoallergenic & Nickel-free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#B8976C]" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">●</span>
                  <span className="text-emerald-700 font-medium">Ready in Atelier</span>
                </div>
              </div>
            </div>

            {/* Quantity and CTA */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-semibold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isAdding}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#1C1917] hover:bg-[#B8976C] text-white text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#DFC4A1]" />
                  <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

