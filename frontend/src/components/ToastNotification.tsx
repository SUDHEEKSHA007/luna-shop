"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, Sparkles, X } from "lucide-react";

export default function ToastNotification() {
  const { notification, setNotification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in shadow-2xl rounded-2xl bg-[#1C1917] text-white p-4 border border-[#B8976C]/30 flex items-center justify-between gap-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#B8976C]/20 border border-[#B8976C]/40 flex items-center justify-center text-[#DFC4A1] shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-sm font-medium tracking-wide text-stone-200">{notification}</p>
      </div>
      <button
        onClick={() => setNotification(null)}
        className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

