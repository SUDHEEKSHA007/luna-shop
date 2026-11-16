
"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Hero({
  onExploreClick,
}: {
  onExploreClick: () => void;
}) {
  return (
    <section className="bg-[#F8F6F2] text-[#25221F] overflow-hidden">

      <div className="max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 pt-8 md:pt-12">

        {/* Editorial header */}
        <div className="flex items-center justify-between border-b border-[#DCD6CD] pb-4">
          <span className="text-[10px] tracking-[0.28em] uppercase text-[#887D70]">
            Fine Jewellery / 2026
          </span>

          <span className="text-[10px] tracking-[0.28em] uppercase text-[#887D70]">
            The Art of Being Timeless
          </span>
        </div>

        {/* Main editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-12 md:py-20">

          {/* Left content */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">

            <p className="text-[10px] tracking-[0.3em] uppercase text-[#A18460] mb-7">
              The New Collection — No. 01
            </p>

            <h1 className="font-serif text-[52px] sm:text-6xl md:text-7xl xl:text-[92px] leading-[0.98] tracking-[-0.045em] font-normal">
              Beauty in
              <br />
              <span className="italic text-[#9B8060]">
                the details.
              </span>
            </h1>

            <p className="mt-8 max-w-sm text-[14px] md:text-[15px] leading-[1.9] text-[#777067] font-light">
              Jewellery that speaks softly, yet stays with you.
              Thoughtfully crafted pieces designed to become
              part of your story.
            </p>

            <div className="mt-10">
              <button
                onClick={onExploreClick}
                className="group inline-flex items-center gap-5 border-b border-[#29241E] pb-3 text-[10px] tracking-[0.24em] uppercase font-medium hover:text-[#A18460] hover:border-[#A18460] transition-colors"
              >
                Discover the collection
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </div>

            <div className="hidden lg:block mt-24">
              <span className="text-[10px] tracking-[0.2em] text-[#A69B8E] uppercase">
                Designed to be treasured.
              </span>
            </div>
          </div>

          {/* Right editorial photography */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative w-full aspect-[4/5] md:aspect-[5/4] lg:aspect-[4/5] overflow-hidden bg-[#E8E1D7]">

              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=90"
                alt="Luna Atelier jewellery collection"
                className="w-full h-full object-cover object-center"
              />

              {/* Image caption */}
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                <span className="text-[9px] tracking-[0.25em] uppercase text-white/90">
                  Luna Atelier
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#93887B]">
                A study in simplicity
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#93887B]">
                01 / 04
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
