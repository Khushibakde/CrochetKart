import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ReturnPolicyPage() {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-2xl flex-1">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Return Policy</h1>

        <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Handmade Items</h2>
            <p>
              As each piece is handcrafted specifically for you, we generally do not accept returns or
              exchanges for change-of-mind reasons. We appreciate your understanding — every order supports
              a small, independent crochet business.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Damaged or Incorrect Items</h2>
            <p>
              If your order arrives damaged, defective, or different from what you ordered, please contact us
              within 48 hours of delivery with photos of the item and packaging. We'll happily arrange a
              replacement or refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">How to Report an Issue</h2>
            <p>
              Email us at{" "}
              <a href="mailto:crochetkart13@gmail.com" className="text-orange-600 hover:underline">
                crochetkart13@gmail.com
              </a>{" "}
              or message us on{" "}
              
                <a href="https://instagram.com/crochet.kart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                Instagram
              </a>{" "}
              with your order details, and we'll sort it out promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Refund Timeline</h2>
            <p>
              Approved refunds are processed within 5–7 business days to your original payment method.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}