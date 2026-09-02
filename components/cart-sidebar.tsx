"use client"

import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CheckoutModal } from "./checkout-modal"

export function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore()
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </SheetTrigger>
       <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full">
  <SheetHeader className="px-6 pt-6 pb-4 flex-shrink-0">
    <SheetTitle>Shopping Cart ({getTotalItems()} items)</SheetTitle>
  </SheetHeader>

  <div className="flex-1 overflow-y-auto px-6">
    {items.length === 0 ? (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    ) : (
      <div className="space-y-4 pb-4">
        {items.map((item) => (
  <div
    key={`${item.id}-${item.note ?? ""}`}
    className="flex gap-4 bg-gray-50 p-4 rounded-lg"
  >
    {/* Product Image */}
    <div className="flex-shrink-0">
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        width={90}
        height={110}
        className="w-[90px] h-[110px] rounded-md object-cover"
      />
    </div>

    {/* Right Side */}
    <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[110px]">
      
      {/* Product Information */}
      <div>
        <h4 className="font-medium text-sm leading-snug break-words">
          {item.name}
        </h4>

        <p className="text-orange-600 font-semibold text-sm mt-1">
          ₹{item.price}
        </p>

        {item.note && (
          <p className="text-xs text-orange-600 mt-1 italic line-clamp-2">
            Note: {item.note}
          </p>
        )}
      </div>

      {/* Quantity + Delete */}
      <div className="flex items-center justify-end gap-3 mt-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
           onClick={() =>
              updateQuantity(item.id, item.quantity - 1, item.note)
            }
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="w-6 text-center text-sm font-medium">
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={() =>
              updateQuantity(item.id, item.quantity + 1, item.note)
            }
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => removeItem(item.id, item.note)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </div>
))}
      </div>
    )}
  </div>

  {items.length > 0 && (
    <div className="flex-shrink-0 border-t px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Total:</span>
        <span className="text-2xl font-bold text-orange-600">₹{getTotalPrice().toFixed(2)}</span>
      </div>
      <Button
        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        onClick={() => setShowCheckout(true)}
      >
        Proceed to Checkout
      </Button>
    </div>
  )}
</SheetContent>
      </Sheet>

      <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </>
  )
}
