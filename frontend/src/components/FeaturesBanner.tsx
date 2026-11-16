
"use client";

import React from "react";

export default function FeaturesBanner() {
  const features = [
    {
      title: "Considered delivery",
      description: "Complimentary insured shipping across India on orders above ₹2,000.",
    },
    {
      title: "The finest details",
      description: "18K gold vermeil over sterling silver, finished with natural pearls.",
    },
    {
      title: "Made to stay",
      description: "A 14-day exchange and return window, with doorstep collection.",
    },
    {
      title: "A beautiful arrival",
      description: "Every piece presented in our signature embossed jewellery box.",
    },
  ];

  return (
    <section className="bg-[#F7F4EF] text-[#28231E]">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-20">

        {/* Top divider */}
        <div className="h-px w-full bg-[#DCD4C9]" />

        {/* Editorial feature strip */}
        <div className="grid grid-cols-1 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">

          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`py-5 lg:px-8 lg:py-2 ${index === 0 ? "lg:pl-0" : ""
                } ${index !== 0
                  ? "border-t border-[#DCD4C9] lg:border-l lg:border-t-0"
                  : ""
                }`}
            >

              <h3 className="font-serif text-[21px] font-normal tracking-tight text-[#383027] sm:text-[23px]">
                {feature.title}
              </h3>

              <p className="mt-3 max-w-[260px] text-[12px] font-light leading-[1.9] text-[#82796F]">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

        {/* Bottom divider */}
        <div className="h-px w-full bg-[#DCD4C9]" />

      </div>
    </section>
  );
}
