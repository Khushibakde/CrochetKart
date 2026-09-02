"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, TestTube, RefreshCw } from "lucide-react"
import { submitOrder } from "@/lib/order-actions"

export function QuickTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runQuickTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const testOrder = {
        name: "Quick Test Customer - " + new Date().getTime(),
        phone: "+1 (555) 123-4567",
        email: "quicktest@cozycraft.com",
        address: "123 Quick Test St",
        city: "Test City",
        pincode: "12345",
        items: [
          {
            name: "Quick Test Blanket",
            price: 49.99,
            quantity: 1,
            total: 49.99,
          },
        ],
        totalAmount: 49.99,
        orderTime: new Date().toISOString(),
      }

      console.log("🧪 Running quick test order submission...")
      const response = await submitOrder(testOrder)

      setResult({
        success: response.success,
        message: response.message,
        response: response.response,
        fallback: response.fallback,
      })
    } catch (error) {
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
          Quick Google Sheets Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">This test will:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Send a test order to Google Sheets using both methods</li>
            <li>• Try form data first, then JSON as fallback</li>
            <li>• Show you the actual response from Google Apps Script</li>
            <li>• Add a row to your Google Sheet if successful</li>
          </ul>
        </div>

        <Button
          onClick={runQuickTest}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Testing...
            </>
          ) : (
            "Run Quick Test"
          )}
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
                {result.response && (
                  <div className="text-xs bg-white p-2 rounded border">
                    <strong>Server Response:</strong>
                    <pre className="whitespace-pre-wrap">{result.response}</pre>
                  </div>
                )}
                {result.success && !result.fallback && (
                  <p className="text-sm">✅ Check your Google Sheet - a new test order should appear!</p>
                )}
                {result.fallback && (
                  <p className="text-sm text-orange-700">
                    ⚠️ Used fallback method. Check browser console and Google Apps Script logs.
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>Next Steps:</strong>
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Run this test</li>
            <li>Check your Google Sheet for the new test order</li>
            <li>If it works, your integration is ready!</li>
            <li>If not, check the Google Apps Script execution logs</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
