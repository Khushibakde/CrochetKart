import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-white/80 text-sm">
              Handcrafted crochet items made with love and attention to detail.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <Link href="/#home" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Policies</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Info</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors break-all">
                  crochetkart13@gmail.com
                </Link>
              </li>
              <li>
                
                  <a href="https://instagram.com/crochet.kart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @crochet.kart
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/30 mt-8 pt-6 text-center text-white/70 text-xs sm:text-sm">
          <p>&copy; 2025 CrochetKart. All rights reserved. Made with ❤️ for crochet lovers.</p>
        </div>
      </div>
    </footer>
  )
}