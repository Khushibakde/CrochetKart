"use client"

export interface Category {
  name: string
  emoji: string
  href: string
}

const STORAGE_KEY = "crochetkart_categories"

const defaultCategories: Category[] = [
  { name: "Hair Accessories", emoji: "🎀", href: "#shop" },
  { name: "Bouquets", emoji: "💐", href: "#shop" },
  { name: "Blankets", emoji: "🧶", href: "#shop" },
  { name: "Amigurumi", emoji: "🧸", href: "#shop" },
  { name: "Home Decor", emoji: "🏡", href: "#shop" },
  { name: "Baby Items", emoji: "👶", href: "#shop" },
  { name: "Bags & Pouches", emoji: "👜", href: "#shop" },
]

export function getCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories))
    return defaultCategories
  }
  try {
    return JSON.parse(stored)
  } catch {
    return defaultCategories
  }
}

export function saveCategories(categories: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
}

export function addCategory(name: string, emoji: string) {
  const list = getCategories()
  if (list.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Category already exists")
  }
  const updated = [...list, { name, emoji, href: "#shop" }]
  saveCategories(updated)
  return updated
}

export function deleteCategory(name: string) {
  const list = getCategories()
  const updated = list.filter((c) => c.name !== name)
  saveCategories(updated)
  return updated
}

// Kept for any file still doing a static import; prefer getCategories() going forward.
export const categories: Category[] = defaultCategories