"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider, useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesBanner from "@/components/FeaturesBanner";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import CartDrawer from "@/components/CartDrawer";
import CartHistoryDrawer from "@/components/CartHistoryDrawer";
import AuthModal from "@/components/AuthModal";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import ToastNotification from "@/components/ToastNotification";
import {
  SlidersHorizontal,
  Sparkles,
  Heart,
  Search,
  X,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

// Fallback seed catalog in case backend is loading
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "pearl-earrings",
    name: "Pearl Earrings",
    category: "Earrings",
    price: 1499.0,
    original_price: 1899.0,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    reviews_count: 84,
    description: "Lustrous baroque freshwater pearls suspended from delicate 18k gold vermeil posts. Timeless refinement for daytime or gala evenings.",
    in_stock: true,
    is_bestseller: true,
    is_new: false,
  },
  {
    id: "golden-necklace",
    name: "Golden Sunburst Necklace",
    category: "Necklaces",
    price: 2899.0,
    original_price: 3499.0,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    reviews_count: 128,
    description: "Intricately engraved medallion suspended on an adjustable Figaro chain. Layer it or let it shine as your statement centerpiece.",
    in_stock: true,
    is_bestseller: true,
    is_new: false,
  },
  {
    id: "charm-bracelet",
    name: "Celestial Charm Bracelet",
    category: "Bracelets",
    price: 1899.0,
    original_price: 2299.0,
    image: "https://images.unsplash.com/photo-1611591475853-bc2a2c0f2a96?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    reviews_count: 49,
    description: "Delicate wristlet featuring lunar crescent and star motifs handset with sparkling micro-zirconia stones.",
    in_stock: true,
    is_bestseller: false,
    is_new: true,
  },
  {
    id: "minimal-ring",
    name: "Minimalist Stack Ring",
    category: "Rings",
    price: 1199.0,
    original_price: 1499.0,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    reviews_count: 67,
    description: "Clean geometric band with high-polish mirror finish. Designed for stacking effortlessly across fingers.",
    in_stock: true,
    is_bestseller: false,
    is_new: false,
  },
  {
    id: "pearl-pendant",
    name: "Luminescent Pearl Pendant",
    category: "Necklaces",
    price: 2199.0,
    original_price: 2699.0,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    reviews_count: 92,
    description: "A solitary teardrop cultured pearl encased in a sculptural warm-gold cradle. An heirloom-quality staple.",
    in_stock: true,
    is_bestseller: true,
    is_new: false,
  },
  {
    id: "floral-earrings",
    name: "Petal & Blossom Studs",
    category: "Earrings",
    price: 1699.0,
    original_price: 2099.0,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    reviews_count: 42,
    description: "Organic floral silhouette crafted with matte brushed gold petals and a luminous crystal core.",
    in_stock: true,
    is_bestseller: false,
    is_new: true,
  },
  {
    id: "emerald-cuff",
    name: "Emerald Accent Open Cuff",
    category: "Bracelets",
    price: 2499.0,
    original_price: 2999.0,
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    reviews_count: 38,
    description: "Sleek architectural cuff tipped with deep-green created emerald baguettes. Flexible fit for any wrist size.",
    in_stock: true,
    is_bestseller: false,
    is_new: true,
  },
  {
    id: "opal-solitaire",
    name: "Opal Horizon Ring",
    category: "Rings",
    price: 1799.0,
    original_price: 2199.0,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    reviews_count: 55,
    description: "Natural Australian crystal opal exhibiting mesmerizing iridescent play-of-color mounted in 14k gold bezel.",
    in_stock: true,
    is_bestseller: true,
    is_new: false,
  },
];

function StoreContent() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Fetch products from Python backend
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await apiFetch<Product[]>("/api/products");
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn("Backend not yet connected or starting up, using fallback catalog.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const categories = ["all", "Earrings", "Necklaces", "Bracelets", "Rings"];

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Wishlist filter
    if (showWishlistOnly) {
      list = list.filter((p) => wishlist.includes(p.id));
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "new") {
      list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    } else {
      // Default: bestsellers first
      list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    }

    return list;
  }, [products, showWishlistOnly, wishlist, selectedCategory, searchQuery, sortBy]);

  const scrollToShop = () => {
    const el = document.getElementById("shop");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Hero Banner */}
      <Hero onExploreClick={scrollToShop} />

      {/* Features Trust Banner */}
      <FeaturesBanner />

      {/* Shop Catalog Section */}
      <main id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full flex-1">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold text-[#91724B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Haute Pieces</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
            Our Signature Collection
          </h2>
          <div className="w-16 h-[2px] bg-[#B8976C] mx-auto mt-2" />
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto pt-1">
            Sculpted with recycled precious metals and organic freshwater pearls, hand-finished for everyday luminosity.
          </p>
        </div>

        {/* Filter and Controls Toolbar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E7E2DA]">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition shrink-0 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#1C1917] text-[#DFC4A1] shadow-xs"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {cat === "all" ? "All Pieces" : cat}
                </button>
              ))}
            </div>

            {/* Right Controls: Sort & Wishlist Toggle */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* Wishlist only button */}
              <button
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition border ${
                  showWishlistOnly
                    ? "bg-rose-50 border-rose-200 text-rose-600 shadow-xs"
                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? "fill-rose-500" : ""}`} />
                <span>Wishlist ({wishlist.length})</span>
              </button>

              {/* Sort Selector */}
              <div className="relative inline-flex items-center bg-white border border-stone-200 rounded-full px-3 py-1.5 shadow-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-stone-800 outline-none pr-3 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="new">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(searchQuery || selectedCategory !== "all" || showWishlistOnly) && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500 pt-1">
              <span>Active filters:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-800 font-medium">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-stone-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-800 font-medium">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-stone-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {showWishlistOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  Wishlist Only
                  <button onClick={() => setShowWishlistOnly(false)} className="hover:text-rose-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setShowWishlistOnly(false);
                }}
                className="text-[11px] text-[#91724B] hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E7E2DA] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-stone-400 mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-stone-800">
              No matching pieces found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find any jewelry matching your current filter criteria. Try adjusting your search term or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setShowWishlistOnly(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#B8976C] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Brand Story Editorial Section */}
      <BrandStory />

      {/* Footer */}
      <Footer />

      {/* Floating Drawers and Modals */}
      <ProductQuickView />
      <CartDrawer />
      <CartHistoryDrawer />
      <AuthModal />
      <ToastNotification />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreContent />
      </CartProvider>
    </AuthProvider>
  );
}
