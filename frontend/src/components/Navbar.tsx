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
  Sparkles,
  Menu,
  X,
  ChevronDown,
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
  const { user, logout, setIsAuthModalOpen, demoLogin } = useAuth();
  const { cart, wishlist, setIsCartOpen, setIsHistoryOpen, cartHistory } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#1C1917] text-[#DFC4A1] text-xs font-medium py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-3">
        <span className="hidden md:inline">✦</span>
        <span>Complimentary Express Shipping on Orders Over ₹2,000</span>
        <span className="hidden md:inline text-stone-500">|</span>
        <span className="hidden md:inline text-stone-300">Use code <strong className="text-white font-semibold">LUNA10</strong> for 10% off</span>
        <span className="hidden md:inline">✦</span>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E7E2DA] py-3"
            : "bg-[#FAF8F5] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1C1917] hover:text-[#B8976C] transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Monogram */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <a href="#" className="inline-block group">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-[#1C1917] group-hover:text-[#B8976C] transition">
                    L U N A
                  </span>
                  <span className="text-[9px] tracking-[0.35em] text-[#78716C] uppercase font-medium -mt-1">
                    Accessories & Atelier
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#1C1917]">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`hover:text-[#B8976C] transition pb-1 border-b-2 ${
                    selectedCategory === "all" ? "border-[#B8976C] text-[#B8976C]" : "border-transparent"
                  }`}
                >
                  All Pieces
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory("Earrings")}
                  className={`hover:text-[#B8976C] transition pb-1 border-b-2 ${
                    selectedCategory === "Earrings" ? "border-[#B8976C] text-[#B8976C]" : "border-transparent"
                  }`}
                >
                  Earrings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory("Necklaces")}
                  className={`hover:text-[#B8976C] transition pb-1 border-b-2 ${
                    selectedCategory === "Necklaces" ? "border-[#B8976C] text-[#B8976C]" : "border-transparent"
                  }`}
                >
                  Necklaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory("Bracelets")}
                  className={`hover:text-[#B8976C] transition pb-1 border-b-2 ${
                    selectedCategory === "Bracelets" ? "border-[#B8976C] text-[#B8976C]" : "border-transparent"
                  }`}
                >
                  Bracelets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory("Rings")}
                  className={`hover:text-[#B8976C] transition pb-1 border-b-2 ${
                    selectedCategory === "Rings" ? "border-[#B8976C] text-[#B8976C]" : "border-transparent"
                  }`}
                >
                  Rings
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-[#B8976C] transition">
                  Our Story
                </a>
              </li>
            </ul>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle / Input */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center bg-white border border-[#B8976C]/60 rounded-full px-3 py-1.5 shadow-sm">
                    <Search className="w-4 h-4 text-[#B8976C] mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search jewelry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-[#1C1917] outline-none w-32 sm:w-48 placeholder:text-stone-400"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      className="text-stone-400 hover:text-stone-600 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-[#1C1917] hover:text-[#B8976C] transition rounded-full hover:bg-white"
                    aria-label="Open search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Wishlist indicator */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    const el = document.getElementById("shop");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-2 text-[#1C1917] hover:text-[#B8976C] transition rounded-full hover:bg-white"
                  title="Your Wishlist"
                  aria-label="View wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#B8976C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Cart History (Past Orders) Shortcut */}
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsHistoryOpen(true);
                  }
                }}
                className="p-2 text-[#1C1917] hover:text-[#B8976C] transition rounded-full hover:bg-white relative"
                title="Cart History & Past Orders"
                aria-label="View cart history"
              >
                <History className="w-5 h-5" />
                {cartHistory.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#91724B] rounded-full"></span>
                )}
              </button>

              {/* User Account Button with Dropdown */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#E7E2DA] hover:border-[#B8976C] text-xs font-medium text-[#1C1917] transition shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1C1917] text-[#DFC4A1] flex items-center justify-center text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3 h-3 text-stone-500" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs font-medium tracking-wider transition uppercase"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}

                {/* Account dropdown menu */}
                {user && userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E7E2DA] p-3 text-xs z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="border-b border-stone-100 pb-3 mb-2 px-2">
                      <p className="font-semibold text-stone-900 text-sm">{user.name}</p>
                      <p className="text-stone-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsHistoryOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2 hover:bg-[#FAF8F5] rounded-xl text-stone-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-[#B8976C]" />
                        <span>Cart History ({cartHistory.length})</span>
                      </div>
                      <span className="text-[10px] text-stone-400">View</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2 hover:bg-[#FAF8F5] rounded-xl text-stone-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#B8976C]" />
                        <span>Active Cart ({cart.total_items})</span>
                      </div>
                      <span className="text-[10px] text-stone-400">Open</span>
                    </button>

                    <div className="border-t border-stone-100 pt-2 mt-2">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1C1917] text-white hover:bg-[#292524] transition shadow-sm group"
                aria-label={`Shopping Cart with ${cart.total_items} items`}
              >
                <ShoppingBag className="w-4 h-4 text-[#DFC4A1] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold tracking-wider">
                  {cart.total_items}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E2DA] bg-[#FAF8F5] px-6 py-4 space-y-3 animate-fade-in text-xs uppercase tracking-widest font-medium">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#B8976C]"
            >
              All Pieces
            </button>
            <button
              onClick={() => {
                setSelectedCategory("Earrings");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#B8976C]"
            >
              Earrings
            </button>
            <button
              onClick={() => {
                setSelectedCategory("Necklaces");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#B8976C]"
            >
              Necklaces
            </button>
            <button
              onClick={() => {
                setSelectedCategory("Bracelets");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#B8976C]"
            >
              Bracelets
            </button>
            <button
              onClick={() => {
                setSelectedCategory("Rings");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#B8976C]"
            >
              Rings
            </button>
            <div className="pt-2 border-t border-stone-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    setIsHistoryOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 py-2 text-[#B8976C]"
              >
                <History className="w-4 h-4" />
                <span>View Cart History & Orders</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

