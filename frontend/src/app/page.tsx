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

      <main
        id="shop"
        className="mx-auto w-full max-w-[1600px] flex-1 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        {/* Editorial collection heading */}
        <section className="mb-14 lg:mb-20">
          <div className="flex flex-col items-center text-center">
            <span className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#A18462]">
              The Luna Collection
            </span>

            <h2 className="font-serif text-4xl font-normal tracking-[-0.04em] text-[#29231E] sm:text-5xl lg:text-6xl">
              Objects of Adornment
            </h2>

            <p className="mt-5 max-w-md text-xs font-light leading-7 tracking-wide text-[#898075] sm:text-sm">
              Considered details. Timeless silhouettes.
              Pieces made to become part of your story.
            </p>
          </div>
        </section>

        {/* Catalogue navigation */}
        <section>
          <div className="mb-8 flex flex-col gap-5 border-b border-[#E8E2D9] pb-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Categories */}
            <div className="flex items-center gap-7 overflow-x-auto scrollbar-none">
              {categories.map((cat) => {
                const active =
                  selectedCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative shrink-0 pb-2 text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${active
                        ? "text-[#29231E]"
                        : "text-[#A49A8F] hover:text-[#29231E]"
                      }`}
                  >
                    {cat === "all" ? "All pieces" : cat}

                    {active && (
                      <span className="absolute bottom-[-1px] left-0 h-[1px] w-full bg-[#29231E]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Catalogue controls */}
            <div className="flex items-center justify-between gap-5">
              <button
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] transition-colors ${showWishlistOnly
                    ? "text-[#A65E5E]"
                    : "text-[#81776D] hover:text-[#29231E]"
                  }`}
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  className={showWishlistOnly ? "fill-current" : ""}
                />
                Saved ({wishlist.length})
              </button>

              <div className="flex items-center gap-2 text-[#81776D]">
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  Sort
                </span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="max-w-[145px] cursor-pointer bg-transparent py-1 text-[10px] uppercase tracking-[0.1em] text-[#29231E] outline-none"
                >
                  <option value="popular">Most popular</option>
                  <option value="new">New arrivals</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery || selectedCategory !== "all" || showWishlistOnly) && (
            <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-[#94887B]">
              <span>Showing filtered results</span>

              {selectedCategory !== "all" && (
                <button onClick={() => setSelectedCategory("all")}>
                  {selectedCategory} ×
                </button>
              )}

              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  "{searchQuery}" ×
                </button>
              )}

              {showWishlistOnly && (
                <button onClick={() => setShowWishlistOnly(false)}>
                  Saved pieces ×
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setShowWishlistOnly(false);
                }}
                className="text-[#A18462] underline underline-offset-4"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product count */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#968B7F]">
              {filteredProducts.length} pieces
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[#968B7F] sm:block">
              Selected for everyday elegance
            </span>
          </div>

          {/* Product catalogue */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <h3 className="font-serif text-3xl font-normal text-[#29231E]">
                Nothing here just yet.
              </h3>

              <p className="mt-3 text-xs font-light text-[#898075]">
                Try another category or search for a different piece.
              </p>

              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setShowWishlistOnly(false);
                }}
                className="mt-7 border-b border-[#A18462] pb-1 text-[10px] uppercase tracking-[0.18em] text-[#8B704F]"
              >
                Explore all pieces
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-9 xl:grid-cols-4 xl:gap-x-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
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
