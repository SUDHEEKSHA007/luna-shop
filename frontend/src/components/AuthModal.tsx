"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    demoLogin,
    authError,
    setAuthError,
  } = useAuth();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch {
      // error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setIsSubmitting(true);
    try {
      await demoLogin();
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E7E2DA] animate-fade-in p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setAuthError(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#91724B] font-semibold">
            Luna Accessories Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
            {tab === "login" ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Sign in to access your persistent cart, checkout, and order history.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] to-[#F5F1EB] border border-[#B8976C]/40 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#DFC4A1] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Instant Demo Login</p>
              <p className="text-[10px] text-stone-500">Pre-seeded with past orders in cart history</p>
            </div>
          </div>
          <button
            onClick={handleDemo}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#B8976C] text-white text-xs font-semibold uppercase tracking-wider transition shrink-0 active:scale-95 disabled:opacity-50"
          >
            1-Click Sign In
          </button>
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-stone-200 mb-6">
          <button
            onClick={() => {
              setTab("login");
              setAuthError(null);
            }}
            className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition border-b-2 -mb-[2px] ${
              tab === "login"
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab("register");
              setAuthError(null);
            }}
            className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold transition border-b-2 -mb-[2px] ${
              tab === "register"
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-900 outline-none focus:border-[#B8976C] focus:bg-white transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-900 outline-none focus:border-[#B8976C] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-stone-900 outline-none focus:border-[#B8976C] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#1C1917] hover:bg-[#B8976C] text-white text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
          >
            <span>{isSubmitting ? "Processing..." : tab === "login" ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 text-[#DFC4A1]" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-1 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B8976C]" />
          <span>Encrypted with 256-bit PBKDF2 & JWT Auth</span>
        </div>
      </div>
    </div>
  );
}

