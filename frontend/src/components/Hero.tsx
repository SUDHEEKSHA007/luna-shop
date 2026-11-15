"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Gem, Feather } from "lucide-react";

export default function Hero({ onExploreClick }: { onExploreClick: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1EB] to-[#FAF8F5] pt-12 pb-20 md:py-24 border-b border-[#E7E2DA]">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B8976C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#DFC4A1]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#B8976C]/40 backdrop-blur-xs text-[#91724B] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#B8976C]" />
              <span>Autumn / Winter Haute Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] leading-[1.08] tracking-tight">
              Timeless Elegance, <br />
              <span className="italic font-normal text-[#91724B]">Handcrafted</span> Luxury
            </h1>

            <p className="text-stone-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Discover our signature pieces crafted in recycled 18k gold vermeil and luminous freshwater pearls. Designed to elevate the quiet beauty of everyday rituals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1C1917] text-white hover:bg-[#292524] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-md hover:shadow-lg group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 text-[#DFC4A1] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-stone-300 hover:border-[#1C1917] text-[#1C1917] text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
              >
                The Luna Atelier
              </a>
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-8 border-t border-[#E7E2DA] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#B8976C] shadow-xs">
                  <Gem className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">18K Vermeil</p>
                  <p className="text-[10px] text-stone-500">2.5 micron thick</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#B8976C] shadow-xs">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">Cultured Pearls</p>
                  <p className="text-[10px] text-stone-500">Ethically harvested</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#B8976C] shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">Lifetime Care</p>
                  <p className="text-[10px] text-stone-500">Authentic guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 rounded-3xl border border-[#B8976C]/30 -rotate-1 hidden sm:block" />

              <div className="relative overflow-hidden rounded-2xl bg-stone-200 shadow-2xl aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
                  alt="Luna Signature Collection Jewelry"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#91724B] font-semibold">Featured Masterpiece</span>
                    <h3 className="font-serif text-base font-semibold text-stone-900">Luminescent Pearl Pendant</h3>
                  </div>
                  <span className="text-sm font-semibold text-[#1C1917] bg-[#FAF8F5] px-3 py-1 rounded-full border border-stone-200">
                    ₹2,199
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

