"use server"

interface OrderItem {
  name: string
  price: number
  quantity: number
  total: number
  note?: string
}

interface OrderData {
  name: string
  phone: string
  email: string
  instagram?: string
  address: string
  city: string
  pincode: string
  items: OrderItem[]
  subtotal?: number
  couponCode?: string
  discountAmount?: number
  deliveryFee: number
  totalAmount: number
  orderTime: string
}

const orderId = `CK-${Date.now()}`

export async function submitOrder(orderData: OrderData) {
  const SHEET_URL = process.env.GOOGLE_SHEETS_URL || "https://script.google.com/macros/s/AKfycbyNBuMU9xa2wm5Z3hELKMOmSMWyOb_hiGA-CkltcAkoyxYv_Y0GtIQPiCt87bu1rBhr/exec"

  // ------------------------------------------
  // Check Google Sheets URL
  // ------------------------------------------

  if (!SHEET_URL) {
    console.error("GOOGLE_SHEETS_URL is missing")

    return {
      success: false,
      message: "Google Sheets configuration is missing.",
    }
  }

  // ------------------------------------------
  // Prepare order payload
  // ------------------------------------------

  const payload = {
     orderId,

    timestamp: new Date(
      orderData.orderTime
    ).toLocaleString("en-IN"),

    customerName: orderData.name,

    phone: orderData.phone,

    email:
      orderData.email || "Not provided",

    instagramHandle:
      orderData.instagram || "Not provided",

    // Keep address fields separate
    address: orderData.address,

    city: orderData.city,

    pincode: orderData.pincode,

    // Keep every product separately
    items: orderData.items.map((item) => ({
      name: item.name,

      quantity: item.quantity,

      price: item.price,

      note: item.note || "",
    })),

    subtotal:
      orderData.subtotal !== undefined
        ? `₹${orderData.subtotal.toFixed(2)}`
        : "",

    couponCode:
      orderData.couponCode || "None",

    discountAmount:
      orderData.discountAmount !== undefined
        ? `₹${orderData.discountAmount.toFixed(2)}`
        : "₹0.00",

    deliveryFee:
  `₹${orderData.deliveryFee.toFixed(2)}`,

    totalAmount:
      `₹${orderData.totalAmount.toFixed(2)}`,
  }

  try {
    console.log(
      "🚀 Sending order to Google Sheets..."
    )

    console.log(
      "Payload:",
      JSON.stringify(payload, null, 2)
    )

    // ------------------------------------------
    // Send to Apps Script
    // ------------------------------------------

    const response = await fetch(
      SHEET_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),

        signal: AbortSignal.timeout(15000),

        redirect: "follow",
      }
    )

    // ------------------------------------------
    // Read response
    // ------------------------------------------

    const responseText =
      await response.text()

    console.log(
      "📨 Google Sheets response:",
      responseText
    )

    let result

    try {
      result = JSON.parse(responseText)
    } catch {
      throw new Error(
        "Invalid response received from Google Sheets"
      )
    }

    // ------------------------------------------
    // Check response
    // ------------------------------------------

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.error ||
        `Google Sheets returned status ${response.status}`
      )
    }

    console.log(
      "✅ Order saved successfully"
    )

    return {
      success: true,
      message: "Order placed successfully!",
    }

  } catch (error) {
    console.error(
      "❌ Google Sheets submission error:",
      error
    )

    return {
      success: false,
      message:
        "Unable to submit your order. Please try again.",
    }
  }
}