"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, TestTube } from "lucide-react"
import { submitOrder } from "@/lib/order-actions"

export function TestOrder() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null)

  const runTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const testOrderData = {
        name: "Test Customer - " + new Date().getTime(),
        phone: "+1 (555) 123-4567",
        email: "test@cozycraft.com",
        address: "123 Test Street",
        city: "Test City",
        pincode: "12345",
        items: [
          {
            name: "Cozy Chunky Blanket",
            price: 89.99,
            quantity: 1,
            total: 89.99,
          },
          {
            name: "Baby Booties",
            price: 19.99,
            quantity: 2,
            total: 39.98,
          },
        ],
        totalAmount: 129.97,
        orderTime: new Date().toISOString(),
      }

      console.log("🧪 Running test order submission...")
      const response = await submitOrder(testOrderData)

      setResult({
        success: response.success,
        message: response.message,
        details: response.details,
      })

      if (response.success) {
        console.log("✅ Test order submitted successfully!")
      }
    } catch (error) {
      console.error("❌ Test failed:", error)
      setResult({
        success: false,
        message: `Test failed: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TestTube className="h-5 w-5 mr-2" />
          Test Google Sheets Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Click the button below to test if your Google Sheets integration is working correctly. This will send a test
          order to your sheet.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Configuration:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>📊 Sheet ID: 1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o</p>
            <p>🔗 Web App URL: ...AKfycbxEelFVdyYt6JWW-RKVs52fVweUwwuTuJIeannsI8CSetVW9pXqtSKbkBXqTpKeCMFw/exec</p>
          </div>
        </div>

        <Button
          onClick={runTest}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          {isLoading ? "Testing..." : "Run Test Order"}
        </Button>

        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              <div className="space-y-2">
                <p className="font-semibold">{result.message}</p>
                {result.details && (
                  <pre className="text-xs bg-white/50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
                {result.success && <p className="text-sm">✅ Check your Google Sheet to see the test order!</p>}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            💡 <strong>What this test does:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Sends a test order with sample data</li>
            <li>Verifies the Google Sheets connection</li>
            <li>Checks if data is properly formatted</li>
            <li>Confirms the Web App is working</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
