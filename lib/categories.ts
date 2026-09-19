export interface Category {
  name: string
  emoji: string
  href: string
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load categories")
  return res.json()
}

export async function addCategory(name: string, emoji: string): Promise<Category[]> {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, emoji }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to add category")
  }
  return getCategories()
}

export async function deleteCategory(name: string): Promise<Category[]> {
  const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete category")
  return getCategories()
}