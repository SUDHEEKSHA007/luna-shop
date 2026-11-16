
"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Heart, ArrowUpRight, Check, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
  } = useCart();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const discountPercent = product.original_price
    ? Math.round(
      ((product.original_price - product.price) /
        product.original_price) *
      100
    )
    : 0;

  const handleAddToCart = async () => {
    if (isAdding) return;

    try {
      setIsAdding(true);
      await addToCart(product, 1);
      setIsAdded(true);
      window.setTimeout(() => setIsAdded(false), 1800);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="group min-w-0 bg-transparent">
      {/* Product photography */}
      <div className="relative isolate aspect-[4/5] overflow-hidden bg-[#F3F0EA]">
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-[1] cursor-pointer"
        />

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.055]"
        />

        {/* Product labels */}
        <div className="pointer-events-none absolute left-4 top-4 z-[2] flex flex-col items-start gap-1.5">
          {product.is_new && (
            <span className="bg-[#FFFEFC]/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#4B4035] backdrop-blur-md">
              New arrival
            </span>
          )}

          {product.is_bestseller && (
            <span className="bg-[#FFFEFC]/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#4B4035] backdrop-blur-md">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          className={`absolute right-4 top-4 z-[3] flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${isWishlisted
              ? "bg-white text-[#A65E5E]"
              : "bg-white/75 text-[#302A24] hover:bg-white"
            }`}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>

        {/* Discount */}
        {discountPercent > 0 && (
          <span className="pointer-events-none absolute bottom-4 left-4 z-[2] bg-[#FFFEFC]/90 px-3 py-1.5 text-[9px] tracking-[0.12em] text-[#8B5E45] backdrop-blur-md">
            {discountPercent}% OFF
          </span>
        )}

        {/* Desktop hover action */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          className="absolute bottom-0 left-0 right-0 z-[2] hidden translate-y-full items-center justify-between bg-[#FFFEFC]/95 px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#302A24] backdrop-blur-lg transition-transform duration-500 group-hover:translate-y-0 md:flex"
        >
          <span>Discover piece</span>
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </button>
      </div>

      {/* Editorial product information */}
      <div className="pt-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-[9px] uppercase tracking-[0.22em] text-[#A18462]">
            {product.category}
          </span>

          {product.rating > 0 && (
            <span className="text-[10px] text-[#968B7F]">
              {product.rating.toFixed(1)}
              {product.reviews_count > 0 &&
                ` (${product.reviews_count})`}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          className="block text-left"
        >
          <h3 className="font-serif text-[19px] font-normal leading-snug text-[#29231E] transition-colors duration-300 group-hover:text-[#9C7952]">
            {product.name}
          </h3>
        </button>

        <div className="mt-2 flex min-h-8 items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[13px] font-medium tracking-wide text-[#29231E]">
              {formatPrice(product.price)}
            </span>

            {product.original_price && (
              <span className="text-[11px] text-[#A9A097] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Minimal add-to-bag action */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label={`Add ${product.name} to bag`}
            className={`group/add flex h-9 w-9 shrink-0 items-center justify-center transition-all duration-300 ${isAdded
                ? "bg-[#65745C] text-white"
                : "bg-transparent text-[#51483F] hover:bg-[#29231E] hover:text-white"
              } disabled:opacity-50`}
          >
            {isAdded ? (
              <Check size={16} strokeWidth={1.5} />
            ) : isAdding ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
            ) : (
              <Plus
                size={17}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover/add:rotate-90"
              />
            )}
          </button>
        </div>

        {/* Mobile quick view */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-[0.17em] text-[#9A8B7A] transition-colors hover:text-[#29231E] md:hidden"
        >
          View details
          <ArrowUpRight size={11} />
        </button>
      </div>
    </article>
  );
}
