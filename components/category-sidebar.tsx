"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategories, type Category } from "@/lib/categories"

export function CategorySidebar() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (open) setCategories(getCategories())
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open categories menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-xs p-0 flex flex-col">
        <SheetHeader className="px-5 pt-6 pb-4 bg-gradient-to-br from-orange-500 to-pink-500">
          <SheetTitle className="text-white flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5" />
            Shop by Category
          </SheetTitle>
          <p className="text-orange-50 text-sm">Handmade with love, just for you</p>
        </SheetHeader>

                <nav className="flex-1 overflow-y-auto py-2">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-5 py-3.5 text-gray-800 font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100 bg-orange-50/50"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">🧶</span>
              All Products
            </span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
          {categories.map((category) => (
           <Link
  key={category.name}
  href={`/?category=${encodeURIComponent(category.name)}`}
  onClick={() => setOpen(false)}
  className="flex items-center justify-between px-5 py-3.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100 last:border-0"
>
              <span className="flex items-center gap-3 font-medium">
                <span className="text-xl">{category.emoji}</span>
                {category.name}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 px-5 py-4 space-y-1 bg-gray-50">
          
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-medium text-gray-600 hover:text-orange-600"
          >
            Contact Us
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
