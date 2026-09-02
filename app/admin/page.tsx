"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Pencil, Plus, LogOut, ImagePlus, X } from "lucide-react"
import { getCategories, addCategory, deleteCategory, type Category } from "@/lib/categories"
import { type Product, getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/products-store"

const ADMIN_PASSWORD = "crochetkart2026"

const emptyForm = {
  name: "",
  price: "",
  originalPrice: "",
  images: [] as string[],
  categories: [] as string[],
  reviews: "0",
  badge: "",
  description: "",
  color: "",
  colorHex: "#000000",
  size: "",
  variants: [] as { id: string; color: string; colorHex: string; image: string }[],
}

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset!)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) throw new Error("Cloudinary upload failed")
  const data = await res.json()
  return data.secure_url as string
}


export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("🧵")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("crochetkart_admin") === "true") {
      setAuthed(true)
    }
  }, [])

 useEffect(() => {
    if (authed) {
      getProducts().then(setProducts).catch(console.error)
      setCategoryList(getCategories())
    }
  }, [authed])

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("crochetkart_admin", "true")
      setAuthed(true)
    } else {
      alert("Incorrect password")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("crochetkart_admin")
    setAuthed(false)
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name) {
      alert("Enter a category name")
      return
    }
    try {
      const updated = addCategory(name, newCategoryEmoji.trim() || "🧵")
      setCategoryList(updated)
      setNewCategoryName("")
      setNewCategoryEmoji("🧵")
    } catch (err: any) {
      alert(err.message || "Failed to add category")
    }
  }

  const handleDeleteCategory = (name: string) => {
    const inUse = products.some((p) => p.categories?.includes(name))
    if (inUse) {
      if (
        !confirm(
          `"${name}" is used by one or more products. Delete anyway? Products will keep this tag but it won't appear as a filter.`,
        )
      ) {
        return
      }
    } else if (!confirm(`Delete category "${name}"?`)) {
      return
    }
    setCategoryList(deleteCategory(name))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) return false
      if (file.size > 3 * 1024 * 1024) return false
      return true
    })

    if (validFiles.length === 0) {
      alert("Please select image files under 3MB each")
      return
    }

    if (form.images.length + validFiles.length > 6) {
      alert("You can add up to 6 photos per product")
      return
    }

        setUploading(true)
    try {
      const uploadedUrls = await Promise.all(validFiles.map(uploadToCloudinary))
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }))
    } catch {
      alert("Failed to upload one or more images. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

    const addVariant = () => {
    if (form.variants.length >= 6) {
      alert("You can add up to 6 color variants")
      return
    }
    const newId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: newId, color: "", colorHex: "#000000", image: "" }],
    }))
  }

  const updateVariant = (id: string, field: "color" | "colorHex", value: string) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }))
  }

  const removeVariant = (id: string) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((v) => v.id !== id) }))
  }

  const handleVariantImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/") || file.size > 3 * 1024 * 1024) {
      alert("Please select an image file under 3MB")
      return
    }
    try {
      const url = await uploadToCloudinary(file)
      setForm((prev) => ({
        ...prev,
        variants: prev.variants.map((v) => (v.id === id ? { ...v, image: url } : v)),
      }))
    } catch {
      alert("Failed to upload variant image. Please try again.")
    }
  }

  const toggleCategory = (categoryName: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter((c) => c !== categoryName)
        : [...prev.categories, categoryName],
    }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || form.images.length === 0 || form.categories.length === 0) {
      alert("Name, price, at least one photo, and at least one category are required")
      return
    }

            const cleanVariants = form.variants.filter((v) => v.color.trim() && v.image)

        const payload = {
      name: form.name,
      price: Number.parseFloat(form.price),
      originalPrice: form.originalPrice ? Number.parseFloat(form.originalPrice) : undefined,
      images: form.images,
      categories: form.categories,
      rating: 4.8,
      reviews: Number.parseInt(form.reviews) || 0,
      badge: form.badge || undefined,
      description: form.description || undefined,
      color: form.color.trim() || undefined,
      colorHex: form.color.trim() ? form.colorHex : undefined,
      size: form.size.trim() || undefined,
      variants: cleanVariants.length > 0 ? cleanVariants : undefined,
    }

        try {
      if (editingId) {
        setProducts(await updateProduct(editingId, payload))
      } else {
        setProducts(await addProduct(payload))
      }
      resetForm()
    } catch (err) {
      alert("Failed to save product. Please try again.")
    }
  }

    const handleEdit = (product: Product) => {
    setEditingId(product.id)
            setForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      images: product.images || [product.image],
      categories: product.categories || [],
      reviews: product.reviews.toString(),
      badge: product.badge || "",
      description: product.description || "",
      color: product.color || "",
      colorHex: product.colorHex || "#000000",
      size: product.size || "",
      variants: product.variants || [],
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

    const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      setProducts(await deleteProduct(id))
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-xl font-bold text-center text-gray-800">Admin Login</h1>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Admin</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Add / Edit Product */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">{editingId ? "Edit Product" : "Add New Product"}</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="sm:col-span-2">
                <Label>Categories * (select one or more)</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {categoryList.map((c) => {
                    const selected = form.categories.includes(c.name)
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => toggleCategory(c.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          selected
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                        }`}
                      >
                        <span>{c.emoji}</span>
                        {c.name}
                      </button>
                    )
                  })}
                </div>
                {form.categories.length === 0 && (
                  <p className="text-xs text-red-400 mt-1">Select at least one category</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="originalPrice">Original Price (Rs., optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="color">Colour (optional)</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.colorHex}
                    onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer flex-shrink-0"
                  />
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="e.g. Beige, Multicolour"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="size">Size (optional)</Label>
                <Input
                  id="size"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  placeholder="e.g. Small, 30x30 cm, Free size"
                />
              </div>

              

              <div className="sm:col-span-2">
                <Label>Product Photos * (up to 6)</Label>
                <div className="mt-1 flex flex-wrap gap-3">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-50"
                      >
                        <X className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 rounded-b-lg">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {form.images.length < 6 && (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/50 cursor-pointer hover:bg-orange-50 transition-colors"
                    >
                      <ImagePlus className="h-6 w-6 text-orange-400" />
                      <span className="text-[11px] text-orange-600 font-medium text-center px-1">
                        {uploading ? "Uploading..." : "Add photo"}
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">First photo is used as the cover image.</p>
              </div>

              <div>
                <Label htmlFor="badge">Badge (optional)</Label>
                <Input
                  id="badge"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="New / Best Seller / Popular"
                />
              </div>

                            <div className="sm:col-span-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2 border-t border-gray-100 pt-4">
                <Label>Color Variants (optional — e.g. same scrunchie in different colors)</Label>
                <div className="mt-2 space-y-3">
                  {form.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        {variant.image ? (
                          <img
                            src={variant.image}
                            alt={variant.color || "variant"}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <label
                            htmlFor={`variant-image-${variant.id}`}
                            className="flex items-center justify-center w-full h-full rounded-lg border-2 border-dashed border-orange-200 bg-white cursor-pointer hover:bg-orange-50"
                          >
                            <ImagePlus className="h-5 w-5 text-orange-400" />
                          </label>
                        )}
                        <input
                          id={`variant-image-${variant.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVariantImageUpload(variant.id, e)}
                          className="hidden"
                        />
                        {variant.image && (
                          <label
                            htmlFor={`variant-image-${variant.id}`}
                            className="absolute -bottom-1 -right-1 bg-white border border-gray-300 rounded-full p-1 shadow-sm cursor-pointer hover:bg-gray-50"
                          >
                            <Pencil className="h-3 w-3 text-gray-600" />
                          </label>
                        )}
                      </div>

                      <input
                        type="color"
                        value={variant.colorHex}
                        onChange={(e) => updateVariant(variant.id, "colorHex", e.target.value)}
                        className="w-9 h-9 rounded border border-gray-200 cursor-pointer flex-shrink-0"
                      />

                      <Input
                        placeholder="Color name e.g. Beige"
                        value={variant.color}
                        onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                        className="flex-1"
                      />

                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {form.variants.length < 6 && (
                    <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Color Variant
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                onClick={handleSubmit}
              >
                <Plus className="h-4 w-4 mr-2" />
                {editingId ? "Update Product" : "Add Product"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Management */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">Manage Categories</h2>

            <div className="flex flex-wrap gap-2">
              {categoryList.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-sm"
                >
                  <span>{cat.emoji}</span>
                  <span className="text-gray-700">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.name)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {categoryList.length === 0 && <p className="text-sm text-gray-400">No categories yet.</p>}
            </div>

            <div className="flex gap-2 items-end pt-2 border-t border-gray-100">
              <div className="w-16">
                <Label htmlFor="newCategoryEmoji">Emoji</Label>
                <Input
                  id="newCategoryEmoji"
                  value={newCategoryEmoji}
                  onChange={(e) => setNewCategoryEmoji(e.target.value)}
                  maxLength={4}
                  className="text-center"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="newCategoryName">New Category Name</Label>
                <Input
                  id="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Keychains"
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddCategory}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg text-gray-800">All Products ({products.length})</h2>
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.categories?.join(", ")} - Rs.{product.price}
                    {product.originalPrice ? ` (was Rs.${product.originalPrice})` : ""}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}