"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Heart, Eye, ShoppingBag, Star, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, 1);
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E7E2DA] hover:border-[#B8976C] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F1EB]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_bestseller && (
            <span className="px-2.5 py-1 rounded-full bg-[#1C1917]/90 backdrop-blur-xs text-[#DFC4A1] text-[10px] font-semibold tracking-widest uppercase shadow-sm">
              ✦ Bestseller
            </span>
          )}
          {product.is_new && (
            <span className="px-2.5 py-1 rounded-full bg-[#B8976C]/90 backdrop-blur-xs text-white text-[10px] font-semibold tracking-widest uppercase shadow-sm">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[9px] font-bold tracking-wider uppercase shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            isWishlisted
              ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
              : "bg-white/80 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>

        {/* Quick View Floating Action */}
        <button
          onClick={() => setQuickViewProduct(product)}
          className="absolute inset-x-4 bottom-3 py-2.5 rounded-xl bg-white/95 backdrop-blur-md text-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-md"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="uppercase tracking-widest text-[10px] font-medium text-[#91724B]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviews_count})</span>
            </div>
          </div>

          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-serif text-lg font-medium text-stone-900 group-hover:text-[#B8976C] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">In Stock • Ready to Ship</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-xs ${
              isAdded
                ? "bg-emerald-700 text-white"
                : "bg-[#1C1917] text-white hover:bg-[#B8976C] active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

