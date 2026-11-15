"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { setIsHistoryOpen } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Row */}
        <div className="pb-16 border-b border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#DFC4A1] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join the Luna Circle</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Receive 10% off your inaugural creation
            </h3>
            <p className="text-xs text-stone-400 font-light max-w-md">
              Enjoy private collector previews, bespoke jewelry concierge notes, and seasonal atelier invitations.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md lg:ml-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-stone-900/80 border border-stone-700 rounded-xl px-4 py-3 text-xs text-white placeholder:text-stone-500 outline-none focus:border-[#B8976C] transition"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#B8976C] hover:bg-[#91724B] text-white text-xs font-semibold tracking-widest uppercase transition flex items-center gap-2 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Links Column Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-light">
          <div>
            <h4 className="font-serif text-base font-normal text-white mb-4 tracking-wider uppercase">
              Collections
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li><a href="#shop" className="hover:text-white transition">Signature Baroque Pearls</a></li>
              <li><a href="#shop" className="hover:text-white transition">18K Sunburst Gold</a></li>
              <li><a href="#shop" className="hover:text-white transition">Celestial Charm Bracelets</a></li>
              <li><a href="#shop" className="hover:text-white transition">Minimalist Stack Rings</a></li>
              <li><a href="#shop" className="hover:text-white transition">New Arrivals</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-normal text-white mb-4 tracking-wider uppercase">
              Atelier & Care
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li><a href="#about" className="hover:text-white transition">Our Story & Craft</a></li>
              <li><a href="#about" className="hover:text-white transition">Sustainable Sourcing</a></li>
              <li><a href="#about" className="hover:text-white transition">Jewelry Care Guide</a></li>
              <li><a href="#about" className="hover:text-white transition">Hallmarking & Authenticity</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-normal text-white mb-4 tracking-wider uppercase">
              Client Service
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li><a href="#shop" className="hover:text-white transition">Complimentary Shipping</a></li>
              <li><a href="#shop" className="hover:text-white transition">14-Day Exchanges</a></li>
              <li><a href="#shop" className="hover:text-white transition">Track Your Parcel</a></li>
              <li><a href="#about" className="hover:text-white transition">Bespoke Inquiries</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-normal text-white mb-4 tracking-wider uppercase">
              Your Account
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    if (user) {
                      setIsHistoryOpen(true);
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className="hover:text-white transition text-left"
                >
                  Cart History & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hover:text-white transition text-left"
                >
                  {user ? `Logged in as ${user.name}` : "Sign In / Register"}
                </button>
              </li>
              <li className="pt-2 text-stone-500 text-[11px]">
                Customer Concierge: <br />
                <span className="text-stone-300">concierge@luna-accessories.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Monogram */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-[0.2em] font-semibold text-white">
              L U N A
            </span>
            <span className="text-stone-600">|</span>
            <span>© {new Date().getFullYear()} Luna Accessories Atelier. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span>Secured with 256-bit Encryption</span>
            <span>•</span>
            <span>UPI • NetBanking • Cards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

