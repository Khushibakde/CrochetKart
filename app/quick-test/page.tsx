import { QuickTest } from "@/components/quick-test"

export default function QuickTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quick Google Sheets Test</h1>
          <p className="text-gray-600">Test the Google Sheets integration with improved data handling</p>
        </div>
        <QuickTest />
      </div>
    </div>
  )
}
