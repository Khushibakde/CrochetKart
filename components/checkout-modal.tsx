"use client"

import type React from "react"

import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle, Instagram, Tag, X } from "lucide-react"
import { submitOrder } from "@/lib/order-actions"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

// Simple demo coupon codes. Replace with real validation / backend lookup as needed.
const COUPONS: Record<string, { label: string; type: "percent" | "flat"; value: number }> = {
  WELCOME10: { label: "10% off your order", type: "percent", value: 10 },
  COZY20: { label: "20% off your order", type: "percent", value: 20 },
  FLAT5: { label: "₹5 off your order", type: "flat", value: 5 },
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState<"details" | "success">("details")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    address: "",
    city: "",
    pincode: "",
  })
  
  const [phoneError, setPhoneError] = useState("")
const [pincodeError, setPincodeError] = useState("")

const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone.trim())
const isValidPincode = (pincode: string) => /^[1-9]\d{5}$/.test(pincode.trim())
  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; label: string; type: "percent" | "flat"; value: number } | null>(
    null,
  )
  const [couponError, setCouponError] = useState("")

const subtotal = getTotalPrice()

const discount = appliedCoupon
  ? appliedCoupon.type === "percent"
    ? (subtotal * appliedCoupon.value) / 100
    : Math.min(appliedCoupon.value, subtotal)
  : 0

// Delivery is free for orders of ₹999 or more
const deliveryFee = subtotal < 999 ? 99 : 0

// Final amount
const total = Math.max(
  subtotal - discount + deliveryFee,
  0
)

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "phone") {
      setPhoneError(value.trim() && !isValidPhone(value) ? "Enter a valid 10-digit mobile number" : "")
    }
    if (name === "pincode") {
      setPincodeError(value.trim() && !isValidPincode(value) ? "Enter a valid 6-digit pincode" : "")
    }
  }

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    const match = COUPONS[code]
    if (!match) {
      setCouponError("Invalid or expired coupon code")
      setAppliedCoupon(null)
      return
    }
    setCouponError("")
    setAppliedCoupon({ code, ...match })
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput("")
    setCouponError("")
  }

  const confirmAndSubmit = async () => {
    if (!isValidPhone(formData.phone)) {
      setPhoneError("Enter a valid 10-digit mobile number")
      return
    }
    if (!isValidPincode(formData.pincode)) {
      setPincodeError("Enter a valid 6-digit pincode")
      return
    }

    const confirmed = confirm(
      `Please double-check your phone number before we place the order:\n\n${formData.phone}\n\nIs this correct?`
    )
    if (!confirmed) return

    setLoading(true)

    setLoading(true)
    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  total: item.price * item.quantity,
  note: item.note || "",
})),
        subtotal,
        couponCode: appliedCoupon?.code ?? "",
        discountAmount: discount,
        deliveryFee,
        totalAmount: total,
        orderTime: new Date().toISOString(),
      }

      const result = await submitOrder(orderData)
      if (!result.success) {
        alert(result.message || "Failed to submit your order. Please try again or contact us directly.")
        return
      }
      clearCart()
      setStep("success")
    } catch (error) {
      alert("Failed to submit order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep("details")
    setFormData({
      name: "",
      phone: "",
      email: "",
      instagram: "",
      address: "",
      city: "",
      pincode: "",
    })
    
    setCouponInput("")
    setAppliedCoupon(null)
    setCouponError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "details" && "Checkout Details"}
            {step === "success" && "Order Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              {items.map((item) => (
  <div key={`${item.id}-${item.note ?? ""}`} className="text-sm">
    <div className="flex justify-between">
      <span>
        {item.name} x {item.quantity}
      </span>
      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
    </div>
    {item.note && <p className="text-xs text-orange-600 italic mt-0.5">Note: {item.note}</p>}
  </div>
))}

              <div className="border-t pt-2 mt-2 space-y-1">
  {/* Subtotal */}
  <div className="flex justify-between text-sm text-gray-600">
    <span>Subtotal</span>
    <span>₹{subtotal.toFixed(2)}</span>
  </div>

  {/* Discount */}
  {appliedCoupon && (
    <div className="flex justify-between text-sm text-green-600">
      <span>Discount ({appliedCoupon.code})</span>
      <span>-₹{discount.toFixed(2)}</span>
    </div>
  )}

 {/* Delivery */}
  <div className="flex justify-between text-sm text-gray-600">
    <span>Delivery</span>

    {deliveryFee === 0 ? (
      <span className="text-green-600 font-medium">
        FREE
      </span>
    ) : (
      <span>
        ₹{deliveryFee.toFixed(2)}
      </span>
    )}
  </div>
  <p className="text-xs text-gray-400 italic">Delivery may take 5–12 days</p>

  {/* Total */}
  <div className="flex justify-between font-semibold pt-2 border-t mt-2">
    <span>Total</span>
    <span className="text-orange-600">
      ₹{total.toFixed(2)}
    </span>
  </div>
</div>
</div>

            {/* Coupon / Promo code */}
            <div className="space-y-2">
              <Label htmlFor="coupon" className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Coupon / Promo Code
              </Label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-green-700">{appliedCoupon.code} applied</p>
                    <p className="text-xs text-green-600">{appliedCoupon.label}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={removeCoupon}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value)
                      setCouponError("")
                    }}
                    placeholder="Enter code e.g. FLAT5"
                    className="uppercase"
                  />
                  <Button type="button" variant="outline" onClick={applyCoupon} disabled={!couponInput.trim()}>
                    Apply
                  </Button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500">{couponError}</p>}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="text-base" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  required
                />
                {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="text-base" />
              </div>

              <div>
                <Label htmlFor="instagram" className="flex items-center gap-1.5">
                  <Instagram className="h-6 w-3.5" />
                  Instagram Handle
                </Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="@yourusername"
                  className="text-base"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required className="text-base" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                  {pincodeError && <p className="text-xs text-red-500 mt-1">{pincodeError}</p>}
                </div>
              </div>
            </div>

            <p className="text-xs text-red-500 text-center leading-relaxed">
              Clicking "Place Order" confirms your order. We'll contact you shortly to arrange payment and delivery.
            </p>

            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={confirmAndSubmit}
              disabled={
                loading ||
                !formData.name ||
                !isValidPhone(formData.phone) ||
                !formData.address ||
                !formData.city ||
                !isValidPincode(formData.pincode)
              }
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Place Order
            </Button>
          </div>
        )}

        

        {step === "success" && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Order Placed Successfully!</h3>
            <p className="text-gray-600">
              Thank you for your order! We'll contact you soon to confirm the details and arrange delivery.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={handleClose}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

