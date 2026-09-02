export interface ProductVariant {
  id: string
  color: string
  colorHex: string
  image: string
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  image?: string
  categories: string[]
  rating: number
  reviews: number
  badge?: string
  description?: string
  color?: string
    colorHex?: string
  size?: string
  variants?: ProductVariant[]
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load products")
  return res.json()
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) ?? null
}

export async function addProduct(payload: Omit<Product, "id">): Promise<Product[]> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to add product")
  return getProducts()
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product[]> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update product")
  return getProducts()
}

export async function deleteProduct(id: string): Promise<Product[]> {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete product")
  return getProducts()
}