import { FinalTest } from "@/components/final-test"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Final Integration Test</h1>
          <p className="text-gray-600">CORS and authentication issues have been resolved</p>
        </div>
        <FinalTest />
      </div>
    </div>
  )
}
