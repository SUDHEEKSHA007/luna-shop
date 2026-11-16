
"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { setIsHistoryOpen } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      setSubscribed(true);
      setEmail("");

      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: "Collections",
      links: [
        ["Signature Pearls", "#shop"],
        ["Gold Essentials", "#shop"],
        ["Celestial Bracelets", "#shop"],
        ["Minimalist Rings", "#shop"],
        ["New Arrivals", "#shop"],
      ],
    },
    {
      title: "The Atelier",
      links: [
        ["Our Story", "#about"],
        ["The Craft", "#about"],
        ["Sustainable Sourcing", "#about"],
        ["Jewellery Care", "#about"],
        ["Authenticity", "#about"],
      ],
    },
    {
      title: "Client Care",
      links: [
        ["Shipping & Delivery", "#shop"],
        ["Returns & Exchanges", "#shop"],
        ["Track Your Order", "#shop"],
        ["Bespoke Enquiries", "#about"],
        ["Contact Us", "#about"],
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#171411] text-[#EAE3D9]">

      {/* Ambient background details */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#A88760]/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-20">

        {/* Newsletter section */}
        <section className="border-b border-white/[0.10] py-16 md:py-24">

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

            {/* Newsletter copy */}
            <div className="lg:col-span-6">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#BDA17E]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#BDA17E]">
                  An invitation from Luna
                </span>
              </div>

              <h2 className="max-w-xl font-serif text-4xl font-normal leading-[1.15] tracking-tight text-[#F5EFE6] sm:text-5xl md:text-6xl">
                A little more
                <br />
                <span className="italic text-[#C5A985]">
                  beauty in your inbox.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-[13px] font-light leading-7 text-[#A59B90]">
                Discover new collections, intimate atelier stories,
                exclusive previews and thoughtful notes from our world.
              </p>

            </div>

            {/* Newsletter glass panel */}
            <div className="lg:col-span-6">

              <div className="rounded-2xl border border-white/[0.12] bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-9">

                <div className="mb-7 flex items-center justify-between">

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A985]">
                      The Luna Circle
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-white">
                      Your first order, on us.
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A985]/30 bg-[#C5A985]/10">
                    <Sparkles
                      size={19}
                      className="text-[#C5A985]"
                      strokeWidth={1.3}
                    />
                  </div>

                </div>

                <p className="mb-6 text-xs leading-6 text-[#A59B90]">
                  Enjoy 10% off your first purchase when you join
                  our community.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-3 sm:flex-row"
                >

                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.12] bg-black/20 px-4 transition focus-within:border-[#BDA17E]/60">

                    <Mail size={16} className="shrink-0 text-[#A58B6B]" />

                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-[#746C64]"
                    />

                  </div>

                  <button
                    type="submit"
                    className="group flex h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#C5A985] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#211A13] transition duration-300 hover:bg-[#E0C9A9]"
                  >
                    {subscribed ? (
                      <>
                        <Check size={15} />
                        Subscribed
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>

                </form>

                <p className="mt-4 text-[10px] leading-5 text-[#746C64]">
                  By subscribing, you agree to receive occasional
                  updates from Luna Atelier.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* Main footer links */}
        <section className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-4 md:py-20">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">

            <a href="#" className="inline-flex flex-col">

              <span className="font-serif text-4xl font-normal tracking-[0.22em] text-[#F5EFE6]">
                LUNA
              </span>

              <span className="mt-1 text-[8px] uppercase tracking-[0.5em] text-[#BDA17E]">
                Accessories & Atelier
              </span>

            </a>

            <p className="mt-7 max-w-[240px] text-xs font-light leading-7 text-[#938980]">
              Jewellery made for the moments that matter.
              Thoughtfully designed, beautifully treasured.
            </p>

            <div className="mt-7 flex items-center gap-3">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-[16px] font-serif text-[#B9AA98] transition duration-300 hover:border-[#C5A985]/60 hover:bg-[#C5A985]/10 hover:text-[#E5CBAA]"
              >
                IG
              </a>

              <a
                href="mailto:concierge@luna-accessories.com"
                aria-label="Email Luna Atelier"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-[#B9AA98] transition duration-300 hover:border-[#C5A985]/60 hover:bg-[#C5A985]/10 hover:text-[#E5CBAA]"
              >
                <Mail size={17} strokeWidth={1.4} />
              </a>

            </div>

          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>

              <h4 className="mb-7 text-[10px] font-medium uppercase tracking-[0.24em] text-[#E6D5C1]">
                {group.title}
              </h4>

              <ul className="space-y-4">

                {group.links.map(([label, href]) => (
                  <li key={label}>

                    <a
                      href={href}
                      className="group inline-flex items-center gap-2 text-[12px] font-light text-[#968C82] transition duration-300 hover:text-[#E5CBAA]"
                    >
                      <span>{label}</span>

                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </a>

                  </li>
                ))}

              </ul>
            </div>
          ))}

          {/* Account column */}
          <div className="col-span-2 md:col-span-1">

            <h4 className="mb-7 text-[10px] font-medium uppercase tracking-[0.24em] text-[#E6D5C1]">
              Your Account
            </h4>

            <ul className="space-y-4">

              <li>
                <button
                  onClick={() => {
                    if (user) {
                      setIsHistoryOpen(true);
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className="text-left text-[12px] font-light text-[#968C82] transition hover:text-[#E5CBAA]"
                >
                  Orders & History
                </button>
              </li>

              <li>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-left text-[12px] font-light text-[#968C82] transition hover:text-[#E5CBAA]"
                >
                  {user ? `Hello, ${user.name}` : "Sign In / Register"}
                </button>
              </li>

            </ul>

            <div className="mt-9 border-t border-white/[0.10] pt-6">

              <p className="text-[9px] uppercase tracking-[0.22em] text-[#BDA17E]">
                Need assistance?
              </p>

              <a
                href="mailto:concierge@luna-accessories.com"
                className="mt-3 inline-block text-xs text-[#D5C8B8] transition hover:text-white"
              >
                concierge@luna-accessories.com
              </a>

            </div>

          </div>

        </section>

        {/* Brand statement */}
        <div className="relative overflow-hidden border-y border-white/[0.10] py-10 text-center md:py-14">

          <p className="font-serif text-3xl font-normal tracking-tight text-white/90 sm:text-5xl md:text-6xl">
            Made to be <span className="italic text-[#C5A985]">remembered.</span>
          </p>

          <p className="mt-4 text-[9px] uppercase tracking-[0.35em] text-[#81766B]">
            The art of everyday elegance
          </p>

        </div>

        {/* Bottom bar */}
        <section className="flex flex-col items-center justify-between gap-6 py-8 text-center md:flex-row md:text-left">

          <div className="flex flex-col items-center gap-2 md:items-start">

            <p className="text-[10px] tracking-wide text-[#81776D]">
              © {new Date().getFullYear()} Luna Accessories Atelier.
              All rights reserved.
            </p>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#81776D]">
              <ShieldCheck size={14} className="text-[#BDA17E]" />
              Secure Checkout
            </div>

            <span className="hidden h-4 w-px bg-white/10 sm:block" />

            <span className="text-[9px] tracking-[0.12em] text-[#81776D]">
              UPI · Cards · NetBanking
            </span>

          </div>

        </section>

      </div>
    </footer>
  );
}
