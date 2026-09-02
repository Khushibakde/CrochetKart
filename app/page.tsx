"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Instagram, Mail, Search, X , ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartSidebar } from "@/components/cart-sidebar"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { CategorySidebar } from "@/components/category-sidebar"
import { getCategories, type Category } from "@/lib/categories"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef, Suspense } from "react"
import { getProducts, type Product } from "@/lib/products-store"
import { Footer } from "@/components/footer"

function CrochetWebsiteContent() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

useEffect(() => {
    getProducts().then(setFeaturedProducts).catch(console.error)
    setCategories(getCategories())
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const categoryScrollRef = useRef<HTMLDivElement>(null)

    const searchParams = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get("category")
    setSelectedCategory(cat)
  }, [searchParams])

    const [searchInput, setSearchInput] = useState("") // what's typed, live
  const [searchQuery, setSearchQuery] = useState("") // what's actually searched, on submit
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

   const handleSearchSubmit = () => {
    setSearchQuery(searchInput.trim())
    if (searchInput.trim()) {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })
      setSearchOpen(false)
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
  }

    const displayedProducts = featuredProducts.filter((p) => {
    const matchesCategory = selectedCategory ? p.categories?.includes(selectedCategory) : true
    const matchesSearch = searchQuery.trim()
      ? p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        p.categories?.some((c) => c.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      : true
    return matchesCategory && matchesSearch
  })
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Marquee - free shipping */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white overflow-hidden whitespace-nowrap py-2">
        <div className="animate-marquee inline-block">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 text-sm font-medium tracking-wide">
              ✨ Free shipping on orders above Rs. 999/-
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
                    {searchOpen ? (
            /* Full-width search takeover */
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearchSubmit()
              }}
              className="flex items-center gap-2 animate-in fade-in duration-150"
            >
              <button
                type="button"
                onClick={() => {
                  clearSearch()
                  setSearchOpen(false)
                }}
                aria-label="Close search"
                className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  enterKeyHint="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  style={{ fontSize: "16px" }}
                  className="w-full pl-9 pr-8 py-2 text-sm rounded-full border border-orange-100 bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <Button
                type="submit"
                className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full px-4 sm:px-5"
              >
                Search
              </Button>
            </form>
          ) : (
            /* Normal header */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {/* Hamburger - categories */}
                <CategorySidebar />

                <Link href="#home" className="flex items-center ml-1">
                  <Image
                    src="/logo.png"
                    alt="CrochetKart - Handmade Knits"
                    width={160}
                    height={70}
                    className="h-10 sm:h-14 w-auto object-contain"
                    priority
                  />
                  <h1 className="text-xl sm:text-2xl pl-2 font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    CrochetKart
                  </h1>
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <Link href="#home" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Home
                </Link>
                <Link href="#shop" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Shop
                </Link>
                <Link href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Contact
                </Link>
              </nav>

              <div className="flex items-center gap-1 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(true)
                    setTimeout(() => searchInputRef.current?.focus(), 50)
                  }}
                  aria-label="Search products"
                  className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* <Button variant="ghost" size="icon" className="hidden xs:inline-flex flex-shrink-0" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                </Button> */}
                <CartSidebar />
                <Button
                  asChild
                  className="hidden sm:inline-flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  <Link href="#shop">Shop Now</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-6 sm:py-20 px-4 scroll-mt-16">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-6 leading-tight">
              Handcrafted with
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> Love</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 mb-5 sm:mb-8 max-w-2xl mx-auto px-2">
              Discover our collection of handmade crochet pieces, crafted with care and premium yarn.
            </p>
            <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button
                asChild
                size="lg"
                className="w-auto ml-8 sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-base sm:text-lg px-4 shadow-lg shadow-orange-200"
              >
                <Link href="#shop">Browse Collection</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-auto mr-8 sm:w-auto border-orange-300 text-orange-600 hover:bg-orange-50 text-base sm:text-lg px-6 bg-transparent"
              >
                <Link href="#contact">Custom Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category quick strip (auto-scrolling + manually scrollable) */}
      <section className="px-4 pb-2 overflow-hidden">
        <div className="container mx-auto">
          <div
            ref={categoryScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x px-4 -mx-4"
            onTouchStart={() => setIsUserScrolling(true)}
            onMouseDown={() => setIsUserScrolling(true)}
          >
            <div className={`flex gap-3 w-max ${isUserScrolling ? "" : "animate-category-scroll"}`}>
              {[...categories, ...categories].map((category, index) => (
                <button
                  key={`${category.name}-${index}`}
                  onClick={() => {
                    setSelectedCategory(category.name)
                    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className={`flex-shrink-0 snap-start flex flex-col items-center justify-center gap-1.5 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all ${
                    selectedCategory === category.name
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "border-orange-100 hover:border-orange-300"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{category.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-medium text-gray-700 text-center leading-tight px-1">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="py-6 sm:py-20 px-4 bg-gradient-to-b from-orange-50 to-pink-50 scroll-mt-16">
        <div className="container mx-auto">
                    <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory
                  ? selectedCategory
                  : "Featured Collection"}
            </h2>
            {searchQuery && (
              <p className="text-gray-500 text-sm mb-2">
                {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""} found
              </p>
            )}
                       {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  clearSearch()
                }}
                className="mt-1 text-sm font-medium text-orange-600 hover:text-orange-700 underline"
              >
                Clear filters — show all products
              </button>
            )}
            
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {displayedProducts.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="block h-full">
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden rounded-xl sm:rounded-2xl h-full flex flex-col cursor-pointer">
                  <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative overflow-hidden">
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-gradient-to-r from-orange-500 to-pink-500 text-[10px] sm:text-xs px-2 py-0.5">
                        {product.badge}
                      </Badge>
                    )}
                                    
                    <Image
  src={product.images?.[0] || "/placeholder.svg"}
  alt={product.name}
  width={300}
  height={300}
  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
/>
                  </div>

                                   <div className="p-3 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                                                            <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className="text-base sm:text-2xl font-bold text-gray-800">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-xs sm:text-lg text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                              {Math.round(
                                ((product.originalPrice - product.price) / product.originalPrice) * 100,
                              )}
                              % OFF
                            </span>
                          </>
                        )}
                      </div>

                                            <div
                        onClick={(e) => e.preventDefault()}
                        className="flex justify-center [&_button]:w-full [&_button]:h-8 [&_button]:text-xs [&_button]:px-2.5 sm:[&_button]:h-10 sm:[&_button]:text-sm sm:[&_button]:px-4"
                      >
                       <AddToCartButton
  product={{
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0],
  }}
/>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
               </Link>
            ))}
          </div>

          {displayedProducts.length === 0 && (
            <p className="text-center text-gray-500 py-12">No products in this category yet.</p>
          )}

          <div className="text-center mt-10 sm:mt-12">
                                   <Button
              size="lg"
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 text-base sm:text-lg px-8 bg-transparent"
              onClick={() => {
                setSelectedCategory(null)
                clearSearch()
              }}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

     

      {/* Newsletter */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Stay Updated with New Collections</h2>
          <p className="text-base sm:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Be the first to know about new arrivals, special offers, and crochet tips!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
            <Button className="bg-white text-orange-600 hover:bg-orange-50 px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-14 sm:py-20 px-4 bg-orange-50/60 scroll-mt-16">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Get in Touch</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Have a question or want a custom order? Reach out — we'd love to hear from you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
            
              <a href="mailto:crochetkart13@gmail.com"
              className="flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email Us</h3>
                <p className="text-sm text-gray-500 break-all">crochetkart13@gmail.com</p>
              </div>
            </a>

            
              <a href="https://instagram.com/crochet.kart"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Instagram className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Instagram</h3>
                <p className="text-sm text-gray-500">@crochet.kart</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function CrochetWebsite() {
  return (
    <Suspense fallback={null}>
      <CrochetWebsiteContent />
    </Suspense>
  )
}