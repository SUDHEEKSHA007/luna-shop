
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Heart,
  History,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: NavbarProps) {
  const { user, logout, setIsAuthModalOpen } = useAuth();

  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsHistoryOpen,
    cartHistory,
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { label: "All Pieces", value: "all" },
    { label: "Earrings", value: "Earrings" },
    { label: "Necklaces", value: "Necklaces" },
    { label: "Bracelets", value: "Bracelets" },
    { label: "Rings", value: "Rings" },
  ];

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setMobileMenuOpen(false);

    const shop = document.getElementById("shop");

    if (shop) {
      shop.scrollIntoView({ behavior: "smooth" });
    }
  };

  const iconButton =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all duration-300 hover:bg-white/15 hover:text-white";

  return (
    <header className="fixed top-0 left-0 z-50 w-full">

      {/* Main floating navigation */}
      <nav
        className={`w-full transition-all duration-500 ${isScrolled
            ? "border-b border-white/10 bg-[#17110D]/75 py-3 shadow-lg backdrop-blur-2xl"
            : "border-b border-white/10 bg-transparent py-5 md:py-7"
          }`}
      >
        <div className="mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-16">

          <div className="flex items-center justify-between gap-4">

            {/* Left: Brand */}
            <div className="flex flex-1 items-center">

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex flex-col items-center text-white"
                aria-label="Luna Atelier home"
              >
                <span className="font-serif text-[26px] font-normal leading-none tracking-[0.3em] transition-opacity group-hover:opacity-75 md:text-[30px]">
                  LUNA
                </span>

                <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.48em] text-white/65">
                  Atelier
                </span>
              </button>

            </div>

            {/* Center: Glass navigation pill */}
            <div className="hidden lg:flex items-center">

              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/[0.09] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl">

                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => selectCategory(category.value)}
                    className={`whitespace-nowrap rounded-full px-4 py-3 text-[10px] font-medium uppercase tracking-[0.13em] transition-all duration-300 ${selectedCategory === category.value
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {category.label}
                  </button>
                ))}

                <a
                  href="#about"
                  className="whitespace-nowrap rounded-full px-4 py-3 text-[10px] font-medium uppercase tracking-[0.13em] text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  About
                </a>

              </div>
            </div>

            {/* Right: Action icons */}
            <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">

              {/* Search */}
              <div className="relative">

                {searchOpen ? (
                  <div className="absolute right-0 top-1/2 z-50 flex w-[250px] -translate-y-1/2 items-center gap-2 rounded-full border border-white/25 bg-[#211810]/90 px-4 py-2.5 shadow-xl backdrop-blur-2xl sm:w-[290px]">

                    <Search size={17} className="shrink-0 text-white/60" />

                    <input
                      type="text"
                      placeholder="Search jewellery..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/40"
                    />

                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      aria-label="Close search"
                      className="text-white/60 transition hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className={iconButton}
                    aria-label="Search"
                  >
                    <Search size={19} strokeWidth={1.5} />
                  </button>
                )}

              </div>

              {/* Wishlist */}
              <button
                onClick={() => {
                  const shop = document.getElementById("shop");
                  if (shop) {
                    shop.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`${iconButton} hidden sm:flex`}
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.5} />

                {wishlist.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9B98E] px-1 text-[9px] font-semibold text-[#211810]">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Order history */}
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsHistoryOpen(true);
                  }
                }}
                className={`${iconButton} hidden sm:flex`}
                aria-label="Order history"
              >
                <History size={19} strokeWidth={1.5} />

                {cartHistory.length > 0 && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D9B98E]" />
                )}
              </button>

              {/* User account */}
              <div className="relative">

                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/[0.10] px-2.5 text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8D4B8] text-[10px] font-semibold text-[#211810]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="hidden max-w-[75px] truncate text-[10px] font-medium sm:inline">
                      {user.name.split(" ")[0]}
                    </span>

                    <ChevronDown size={13} className="text-white/60" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex h-10 items-center gap-2 rounded-full border border-white/30 bg-white/[0.08] px-3.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-xl transition hover:bg-white/20"
                  >
                    <UserIcon size={16} strokeWidth={1.5} />
                    <span className="hidden sm:inline">Account</span>
                  </button>
                )}

                {/* User dropdown */}
                {user && userDropdownOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#211810]/90 p-3 text-white shadow-2xl backdrop-blur-2xl">

                    <div className="border-b border-white/10 px-3 pb-3">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="mt-1 truncate text-[11px] text-white/50">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsHistoryOpen(true);
                      }}
                      className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-3 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <History size={16} />
                        Order History
                      </span>
                      <span className="text-white/40">
                        {cartHistory.length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingBag size={16} />
                        My Shopping Bag
                      </span>
                      <span className="text-white/40">
                        {cart.total_items}
                      </span>
                    </button>

                    <div className="mt-2 border-t border-white/10 pt-2">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-red-300 transition hover:bg-red-400/10"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Shopping bag */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="group relative ml-1 flex h-10 items-center gap-2 rounded-full border border-white/30 bg-white/[0.14] px-3.5 text-white shadow-sm backdrop-blur-xl transition hover:bg-white/25 sm:px-4"
                aria-label={`Shopping bag with ${cart.total_items} items`}
              >
                <ShoppingBag
                  size={17}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:-translate-y-0.5"
                />

                <span className="text-[11px] font-medium">
                  {cart.total_items}
                </span>
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${iconButton} lg:hidden`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="absolute left-4 right-4 top-full mt-3 overflow-hidden rounded-2xl border border-white/15 bg-[#211810]/90 p-4 shadow-2xl backdrop-blur-2xl lg:hidden">

            <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.3em] text-white/40">
              Explore Luna
            </p>

            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => selectCategory(category.value)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs uppercase tracking-[0.12em] transition ${selectedCategory === category.value
                      ? "bg-white/15 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {category.label}
                  <ArrowUpRight size={14} className="opacity-50" />
                </button>
              ))}

              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-xs uppercase tracking-[0.12em] text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Our Story
                <ArrowUpRight size={14} className="opacity-50" />
              </a>
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    setIsHistoryOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-white/70 hover:bg-white/10"
              >
                <History size={16} />
                Order History
              </button>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
}
