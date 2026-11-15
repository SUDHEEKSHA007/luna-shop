"use client";

import React from "react";
import { Truck, Gem, RefreshCw, Gift } from "lucide-react";

export default function FeaturesBanner() {
  const features = [
    {
      icon: Truck,
      title: "Complimentary Delivery",
      desc: "Free insured shipping on orders over ₹2,000 across India.",
    },
    {
      icon: Gem,
      title: "Certified 18K Vermeil",
      desc: "Thick 2.5-micron gold over solid 925 sterling silver & natural pearls.",
    },
    {
      icon: RefreshCw,
      title: "14-Day Exchanges",
      desc: "Complimentary resizing and returns with door-step collection.",
    },
    {
      icon: Gift,
      title: "Artisanal Velvet Box",
      desc: "Each order arrives in signature embossed presentation box ready for gifting.",
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-2">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#B8976C] shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

