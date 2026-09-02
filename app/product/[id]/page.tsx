"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart } from "lucide-react"
import { getProductById, type Product } from "@/lib/products-store"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { CartSidebar } from "@/components/cart-sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Footer } from "@/components/footer"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [note, setNote] = useState("")

  useEffect(() => {
    const id = params.id as string
    getProductById(id).then(setProduct).catch(() => setProduct(null))
  }, [params.id])

  if (product === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  }

  if (product === null || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-xl font-semibold text-gray-700">Product not found</p>
        <Button onClick={() => router.push("/")}>Back to Shop</Button>
      </div>
    )
  }

    const baseImages = product.images && product.images.length > 0 ? product.images : [product.image]

  // Unified list: base photos (color tagged only on the first one) + each variant's photo
  type GalleryItem = { image: string; color?: string; colorHex?: string }
    const gallery: GalleryItem[] = [
    ...baseImages.map((img, i) => ({
      image: img as string,
      color: i === 0 ? product.color || undefined : undefined,
      colorHex: i === 0 ? product.colorHex : undefined,
    })),
    ...(product.variants || []).map((v) => ({ image: v.image, color: v.color, colorHex: v.colorHex })),
  ]
  const selected = gallery[selectedIndex] || gallery[0]
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Link href="/" className="font-bold text-lg bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            CrochetKart
          </Link>
          <CartSidebar />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={selected?.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                {gallery.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedIndex === index ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={`${product.name} ${item.color || index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-orange-600 mb-1">{product.categories?.join(" · ")}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">₹{product.price}</span>
              {product.originalPrice && discount && (
                <>
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            )}

            {product.size && (
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400">Size</p>
                  <p className="text-sm font-medium text-gray-700">{product.size}</p>
                </div>
              </div>
            )}

            {gallery.some((g) => g.color) && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Color{selected?.color ? `: ${selected.color}` : ""}
                </p>
                <div className="flex flex-wrap gap-3">
                  {gallery.map((item, index) =>
                    item.color ? (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-colors ${
                          selectedIndex === index
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: item.colorHex || "#d1d5db" }}
                        />
                        <span className="text-sm text-gray-700">{item.color}</span>
                      </button>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {/* Custom note */}
            <div className="mb-6">
              <Label htmlFor="note" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Any special request? (optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. specific colour, size adjustment, or a message you'd like added"
                maxLength={300}
                rows={3}
                style={{ fontSize: "16px" }}
                className="resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{note.length}/300</p>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4">
              <div className="[&_button]:w-full [&_button]:h-11">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: selected?.image || baseImages[0],
                    note: selected?.color
                      ? `${note.trim() ? note.trim() + " — " : ""}Color: ${selected.color}`
                      : note.trim() || undefined,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">✨ Free shipping on orders above Rs. 999/-</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}