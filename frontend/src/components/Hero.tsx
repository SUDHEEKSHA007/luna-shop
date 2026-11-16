
"use client";

import React from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function Hero({
  onExploreClick,
}: {
  onExploreClick: () => void;
}) {
  return (
    <section className="relative isolate h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#211810] text-white">

      {/* Full bleed background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2400&q=90"
          alt="Luna Atelier jewellery campaign"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 -z-10 bg-black/10" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#17110D]/80 via-[#17110D]/35 to-transparent" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {/* Main content */}
      <div className="relative mx-auto flex h-full max-w-[1800px] flex-col justify-between px-6 sm:px-10 lg:px-20">

        {/* Editorial hero copy */}
        <div className="flex flex-1 items-center pt-10 md:pt-16">

          <div className="max-w-[650px]">

            <div className="mb-8 flex items-center gap-4">
              <span className="text-[9px] uppercase tracking-[0.38em] text-white/75 sm:text-[10px]">
                Autumn / Winter 2026
              </span>
              <span className="h-px w-14 bg-white/40" />
            </div>

            <h1 className="font-serif text-[56px] font-normal leading-[0.98] tracking-[-0.045em] sm:text-7xl md:text-[90px] lg:text-[104px]">
              Timeless
              <br />
              Jewellery,
              <br />
              <span className="italic text-[#EAD3B5]">
                Reimagined.
              </span>
            </h1>

            <p className="mt-8 max-w-[390px] text-[13px] font-light leading-[1.9] tracking-wide text-white/75 sm:text-[15px]">
              Sculptural pieces in gold and pearl, thoughtfully
              crafted for everyday elegance and lasting memories.
            </p>

            <button
              onClick={onExploreClick}
              className="group mt-10 inline-flex items-center gap-8 rounded-full border border-white/35 bg-white/[0.12] px-7 py-4 text-[10px] font-medium tracking-[0.2em] backdrop-blur-xl transition-all duration-300 hover:border-white/70 hover:bg-white/20"
            >
              EXPLORE COLLECTION
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>

          </div>
        </div>

        {/* Bottom controls and featured product */}
        <div className="mb-7 flex items-end justify-between gap-4 md:mb-10">

          {/* Slide indicators */}
          <div className="flex items-center gap-6">
            {["01", "02", "03", "04"].map((number, index) => (
              <span
                key={number}
                className={`relative pb-2 text-[11px] tracking-wider ${index === 0 ? "text-white" : "text-white/50"
                  }`}
              >
                {number}
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 h-px w-full bg-white" />
                )}
              </span>
            ))}
          </div>

          {/* Floating glass product card */}
          <div className="hidden sm:flex w-full max-w-[370px] items-center gap-4 rounded-2xl border border-white/25 bg-white/[0.13] p-3.5 shadow-[0_12px_45px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:p-4">

            <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=300&q=85"
                alt="Pearl jewellery"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">
                Featured piece
              </span>
              <h3 className="mt-1 font-serif text-lg text-white">
                Pearl Bloom Drops
              </h3>
              <p className="mt-1 text-xs text-white/75">
                ₹2,199
              </p>
            </div>

            <button
              onClick={onExploreClick}
              aria-label="Explore featured product"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/25"
            >
              <ArrowRight size={17} />
            </button>
          </div>

          <span className="hidden lg:block text-[9px] uppercase tracking-[0.3em] text-white/60">
            Designed to be treasured.
          </span>

        </div>
      </div>
    </section>
  );
}
