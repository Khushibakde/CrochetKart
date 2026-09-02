import { GoogleSheetsSetup } from "@/components/google-sheets-setup"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Setup Google Sheets Integration</h1>
          <p className="text-gray-600">Follow this step-by-step guide to automatically save orders to Google Sheets</p>
        </div>
        <GoogleSheetsSetup />
      </div>
    </div>
  )
}
