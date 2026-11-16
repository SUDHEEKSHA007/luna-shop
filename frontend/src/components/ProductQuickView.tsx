
"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  X,
  Heart,
  Star,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";

export default function ProductQuickView() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setIsAdding(false);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickViewProduct(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const handleAdd = async () => {
    if (isAdding) return;

    setIsAdding(true);

    try {
      await addToCart(quickViewProduct, quantity);
      setQuickViewProduct(null);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#211B16]/45 px-3 py-6 backdrop-blur-md sm:px-6"
      onClick={() => setQuickViewProduct(null)}
    >
      {/* Translucent outer shell */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${quickViewProduct.name}`}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-[900px] rounded-[27px] border border-white/70 bg-white/55 p-[5px] shadow-[0_24px_90px_rgba(31,24,18,0.22)] backdrop-blur-2xl animate-fade-in"
      >
        {/* Inner white surface */}
        <div className="relative overflow-hidden rounded-[22px] bg-[#FCFBF9]">
          <button
            onClick={() => setQuickViewProduct(null)}
            aria-label="Close quick view"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/80 text-[#51483F] shadow-sm backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <X className="h-4 w-4" strokeWidth={1.7} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[1.02fr_0.98fr]">
            {/* Product image */}
            <div className="relative min-h-[320px] overflow-hidden bg-[#F0EDE7] md:min-h-[590px]">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />

              {quickViewProduct.is_bestseller && (
                <span className="absolute bottom-5 left-5 border border-white/50 bg-white/75 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#40372E] backdrop-blur-md">
                  Bestseller
                </span>
              )}

              <span className="absolute left-5 top-5 font-serif text-sm tracking-[0.12em] text-white drop-shadow">
                LUNA ATELIER
              </span>
            </div>

            {/* Product information */}
            <div className="flex flex-col justify-between px-6 py-7 sm:px-9 sm:py-10 md:px-10 md:py-12">
              <div>
                <div className="mb-5 flex items-center justify-between pr-10">
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#A18462]">
                    {quickViewProduct.category}
                  </span>

                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAE6DF] text-[#71685F] transition hover:border-[#C9A98A] hover:text-[#A18462]"
                  >
                    <Heart
                      className={`h-[17px] w-[17px] ${isWishlisted
                          ? "fill-[#A18462] text-[#A18462]"
                          : ""
                        }`}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <h2 className="max-w-[340px] font-serif text-[30px] font-normal leading-[1.15] tracking-[-0.035em] text-[#29251F] sm:text-[36px]">
                  {quickViewProduct.name}
                </h2>

                {/* Rating */}
                <div className="mt-5 flex items-center gap-2">
                  <div className="flex items-center gap-[2px]">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-3 w-3 ${index < Math.floor(quickViewProduct.rating)
                            ? "fill-[#A18462] text-[#A18462]"
                            : "text-[#D8D2C9]"
                          }`}
                        strokeWidth={1.3}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-[#51483F]">
                    {quickViewProduct.rating}
                  </span>

                  <span className="text-[11px] text-[#A49B91]">
                    ({quickViewProduct.reviews_count} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-7 flex items-baseline gap-3">
                  <span className="text-[23px] font-medium tracking-tight text-[#29251F]">
                    {formatPrice(quickViewProduct.price)}
                  </span>

                  {quickViewProduct.original_price && (
                    <span className="text-sm text-[#A49B91] line-through">
                      {formatPrice(quickViewProduct.original_price)}
                    </span>
                  )}
                </div>

                <div className="my-7 h-px w-full bg-[#EAE6DF]" />

                {/* Description */}
                <p className="text-[13px] font-light leading-[1.9] text-[#746B61]">
                  {quickViewProduct.description}
                </p>

                {/* Product details */}
                <div className="mt-8 space-y-3 border-t border-[#EAE6DF] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#A49B91]">
                      Collection
                    </span>

                    <span className="text-xs text-[#51483F]">
                      Luna Accessories Atelier
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#A49B91]">
                      Availability
                    </span>

                    <span className="text-xs text-[#746B61]">
                      Available to order
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase controls */}
              <div className="mt-9 border-t border-[#EAE6DF] pt-6">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex h-[46px] items-center border border-[#E5E0D8] bg-white">
                    <button
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      aria-label="Decrease quantity"
                      className="flex h-full w-10 items-center justify-center text-[#71685F] transition hover:bg-[#F4F1EC]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <span className="w-6 text-center text-xs text-[#29251F]">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity((current) => current + 1)
                      }
                      aria-label="Increase quantity"
                      className="flex h-full w-10 items-center justify-center text-[#71685F] transition hover:bg-[#F4F1EC]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAdd}
                    disabled={isAdding}
                    className="flex h-[46px] flex-1 items-center justify-center gap-3 bg-[#29251F] px-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#A18462] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag
                      className="h-4 w-4"
                      strokeWidth={1.5}
                    />

                    {isAdding ? "Adding..." : "Add to bag"}

                    {!isAdding && (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <p className="mt-4 text-center text-[9px] uppercase tracking-[0.17em] text-[#A49B91]">
                  Thoughtfully selected · Made to be treasured
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
