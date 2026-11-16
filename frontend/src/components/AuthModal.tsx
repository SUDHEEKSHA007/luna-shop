
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await demoLogin();
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#171411]/65 px-4 py-6 backdrop-blur-md sm:px-6"
      onClick={closeModal}
    >

      {/* OUTER GLASS SHELL */}
      <div
        className="relative my-auto w-full max-w-[460px] rounded-[32px] border border-white/40 bg-white/[0.18] p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-3"
        onClick={(e) => e.stopPropagation()}
      >

        {/* INNER WHITE CARD */}
        <div className="relative overflow-hidden rounded-[23px] border border-white/80 bg-[#FFFEFC] px-6 py-8 shadow-[0_8px_30px_rgba(30,24,18,0.08)] sm:px-9 sm:py-10">

          {/* Close button */}
          <button
            onClick={closeModal}
            aria-label="Close authentication"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/80 text-stone-400 transition hover:border-stone-400 hover:bg-stone-100 hover:text-stone-900"
          >
            <X size={17} strokeWidth={1.5} />
          </button>

          {/* Brand header */}
          <div className="mb-8 text-center">

            <span className="font-serif text-[25px] font-normal tracking-[0.28em] text-[#29231D]">
              LUNA
            </span>

            <div className="mt-1 text-[8px] uppercase tracking-[0.5em] text-[#A18460]">
              Accessories & Atelier
            </div>

            <div className="mx-auto mt-7 h-px w-12 bg-[#D8C3A6]" />

            <h2 className="mt-6 font-serif text-[30px] font-normal tracking-tight text-[#29231D] sm:text-[34px]">
              {tab === "login" ? (
                <>
                  Welcome <span className="italic text-[#A18460]">back.</span>
                </>
              ) : (
                <>
                  Join the <span className="italic text-[#A18460]">atelier.</span>
                </>
              )}
            </h2>

            <p className="mx-auto mt-2 max-w-[290px] text-[12px] font-light leading-6 text-stone-500">
              {tab === "login"
                ? "Your personal collection and saved moments await."
                : "Create an account and make every piece yours."}
            </p>

          </div>

          {/* Demo access */}
          <div className="mb-7 flex items-center justify-between gap-3 rounded-xl border border-[#E9E0D4] bg-[#F8F5F0] p-3.5">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DCC9AF] bg-white text-[#A18460]">
                <Sparkles size={16} strokeWidth={1.4} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#393128]">
                  Explore as a guest
                </p>
                <p className="mt-1 text-[10px] text-stone-500">
                  Pre-loaded demo account
                </p>
              </div>

            </div>

            <button
              onClick={handleDemo}
              disabled={isSubmitting}
              className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#96744E] transition hover:text-[#29231D] disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Try demo →"}
            </button>

          </div>

          {/* Tabs */}
          <div className="mb-7 grid grid-cols-2 border-b border-stone-200">

            <button
              onClick={() => {
                setTab("login");
                setAuthError(null);
              }}
              className={`relative pb-3 text-[10px] font-medium uppercase tracking-[0.2em] transition ${tab === "login"
                  ? "text-[#29231D]"
                  : "text-stone-400 hover:text-stone-700"
                }`}
            >
              Sign In

              {tab === "login" && (
                <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#A18460]" />
              )}
            </button>

            <button
              onClick={() => {
                setTab("register");
                setAuthError(null);
              }}
              className={`relative pb-3 text-[10px] font-medium uppercase tracking-[0.2em] transition ${tab === "register"
                  ? "text-[#29231D]"
                  : "text-stone-400 hover:text-stone-700"
                }`}
            >
              Create Account

              {tab === "register" && (
                <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#A18460]" />
              )}
            </button>

          </div>

          {/* Error */}
          {authError && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[11px] leading-5 text-rose-700">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            {tab === "register" && (
              <div>
                <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-stone-600">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    strokeWidth={1.4}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E8E2DA] bg-[#FAF9F6] pl-11 pr-4 text-xs text-[#29231D] outline-none transition placeholder:text-stone-400 focus:border-[#B99A73] focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-stone-600">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.4}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E8E2DA] bg-[#FAF9F6] pl-11 pr-4 text-xs text-[#29231D] outline-none transition placeholder:text-stone-400 focus:border-[#B99A73] focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-stone-600">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.4}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E8E2DA] bg-[#FAF9F6] pl-11 pr-4 text-xs text-[#29231D] outline-none transition placeholder:text-stone-400 focus:border-[#B99A73] focus:bg-white"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-3 flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-[#25201B] text-[10px] font-medium uppercase tracking-[0.2em] text-white shadow-md transition duration-300 hover:bg-[#8F7251] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Please wait..."
                : tab === "login"
                  ? "Sign In"
                  : "Create Account"}

              {!isSubmitting && (
                <ArrowRight
                  size={16}
                  className="text-[#D9C1A1] transition-transform group-hover:translate-x-1"
                />
              )}
            </button>

          </form>

          {/* Security footer */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-stone-100 pt-5">

            <ShieldCheck
              size={14}
              strokeWidth={1.4}
              className="text-[#A18460]"
            />

            <span className="text-[9px] tracking-wide text-stone-400">
              Secure authentication · Your details stay protected
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}
