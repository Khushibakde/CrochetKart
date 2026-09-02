"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, TestTube, ExternalLink, RefreshCw } from "lucide-react"
import { submitOrder } from "@/lib/order-actions"

export function FinalTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runFinalTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const testOrder = {
        name: "Final Test Customer - " + new Date().getTime(),
        phone: "+1 (555) 999-0000",
        email: "final-test@cozycraft.com",
        address: "789 Final Test Blvd",
        city: "Final City",
        pincode: "99999",
        items: [
          {
            name: "Final Test Blanket",
            price: 99.99,
            quantity: 1,
            total: 99.99,
          },
        ],
        totalAmount: 99.99,
        orderTime: new Date().toISOString(),
      }

      console.log("🧪 Running final test order submission...")
      const response = await submitOrder(testOrder)

      setResult({
        success: response.success,
        message: response.message,
        fallback: response.fallback,
        details: response.details,
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
          Final Integration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Configuration Check:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• **Sheet ID**: `1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o` (This is hardcoded in the script)</li>
            <li>
              • **Web App URL**:
              `https://script.google.com/macros/s/AKfycbxEelFVdyYt6JWW-RKVs52fVweUwwuTuJIeannsI8CSetVW9pXqtSKbkBXqTpKeCMFw/exec`
            </li>
            <li>• **CORS/Auth**: Handled by `mode: "no-cors"` on client and "Anyone" access on script deployment.</li>
          </ul>
        </div>

        <Button
          onClick={runFinalTest}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Testing Final Setup...
            </>
          ) : (
            "Run Final Test"
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
                {result.success && (
                  <>
                    <p className="text-sm">**Please check your Google Sheet** for the new order.</p>
                    <p className="text-sm font-medium">
                      **Also, check your Google Apps Script "Executions" logs** for server-side details.
                    </p>
                    <Button variant="outline" size="sm" asChild className="mt-2 bg-transparent">
                      <a
                        href="https://script.google.com/home/executions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Apps Script Logs
                      </a>
                    </Button>
                  </>
                )}
                {result.fallback && (
                  <p className="text-sm text-red-700">
                    ⚠️ This indicates the client-side request might have failed, and the order was logged to console.
                    Please check network tab and Apps Script logs.
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Important Notes:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              The `mode: "no-cors"` setting means the browser won't block the request, but it also means the client-side
              code cannot read the actual success/failure response from Google Apps Script.
            </li>
            <li>
              Therefore, the most reliable way to confirm success or debug failures is to **check the "Executions" tab
              in your Google Apps Script project**.
            </li>
            <li>
              Ensure your Google Apps Script is deployed with "Execute as: **Me**" and "Who has access: **Anyone**".
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
