import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ShippingPolicyPage() {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-2xl flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Shipping Policy</h1>

        <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Processing Time</h2>
            <p>
              Since every item is handmade to order, please allow 3–7 business days for your order to be
              crocheted and prepared for shipping. During high-demand periods (festivals, sales), this may
              extend slightly — we'll keep you updated via the contact details you provide at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delivery Time</h2>
            <p>
              Once shipped, orders typically arrive within 3–7 business days depending on your location within
              India. Remote areas may take a little longer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Charges</h2>
            <p>Free shipping on all orders above ₹999. Orders below ₹999 incur a flat shipping fee of ₹99.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Tracking</h2>
            <p>
              Once your order ships, we'll share tracking details via the phone number or email you provided
              at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Questions?</h2>
            <p>
              Reach out anytime at{" "}
              <a href="mailto:crochetkart13@gmail.com" className="text-orange-600 hover:underline">
                crochetkart13@gmail.com
              </a>{" "}
              or DM us on{" "}
              
                <a href="https://instagram.com/crochet.kart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                Instagram
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}