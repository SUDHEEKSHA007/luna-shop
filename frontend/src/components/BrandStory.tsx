"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function BrandStory() {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#FAF8F5] border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80"
                  alt="Luna Pearls"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs text-center">
                <p className="font-serif text-2xl font-semibold text-[#91724B]">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                  Recycled Precious Metals
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs text-center">
                <p className="font-serif text-2xl font-semibold text-[#91724B]">50k+</p>
                <p className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                  Women Adorned Globally
                </p>
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80"
                  alt="Luna Gold craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#B8976C]/30 text-[#91724B] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Atelier Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] leading-tight">
              Designed with Grace, <br />
              Crafted for a <span className="italic font-normal text-[#91724B]">Lifetime</span>
            </h2>

            <p className="text-stone-600 text-sm md:text-base font-light leading-relaxed">
              At Luna Accessories, we believe luxury should feel effortless and intimately personal. Born from a reverence for natural silhouettes and classical goldsmithing traditions, every creation is hand-finished in small batches.
            </p>

            <p className="text-stone-600 text-sm md:text-base font-light leading-relaxed">
              We exclusively select certified grade-AAA cultured freshwater pearls and coat solid recycled 925 silver in a luxurious 2.5-micron layer of 18-karat gold vermeil—ensuring luster that endures everyday wear without tarnishing.
            </p>

            <div className="pt-4 border-t border-[#E7E2DA] flex items-center gap-6">
              <div>
                <p className="font-serif text-lg font-semibold text-stone-900">Aria & Julian</p>
                <p className="text-xs text-stone-500">Founders & Master Jewelers</p>
              </div>
              <div className="font-serif text-2xl italic text-[#B8976C] select-none">
                Luna Atelier
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

