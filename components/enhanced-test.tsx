"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, TestTube, ExternalLink, RefreshCw } from "lucide-react"
import { submitOrder } from "@/lib/order-actions"

export function EnhancedTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [testStep, setTestStep] = useState<"ready" | "testing" | "complete">("ready")

  const runDirectTest = async () => {
    setIsLoading(true)
    setTestStep("testing")
    setResult(null)

    try {
      console.log("🧪 Testing direct connection to Google Sheets...")

      const testData = {
        timestamp: new Date().toLocaleString(),
        customerName: "Direct Test Customer - " + Date.now(),
        phone: "+1 (555) 123-4567",
        email: "direct-test@cozycraft.com",
        address: "123 Direct Test St, Test City, TC 12345",
        items: "Direct Test Product (Qty: 1, Price: $50.00)",
        totalAmount: "$50.00",
        status: "Direct Test Order",
      }

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxEelFVdyYt6JWW-RKVs52fVweUwwuTuJIeannsI8CSetVW9pXqtSKbkBXqTpKeCMFw/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        },
      )

      const responseText = await response.text()

      setResult({
        type: "direct",
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        responseText: responseText,
        testData: testData,
      })

      setTestStep("complete")
    } catch (error) {
      setResult({
        type: "direct",
        success: false,
        error: error.message,
      })
      setTestStep("complete")
    } finally {
      setIsLoading(false)
    }
  }

  const runFullTest = async () => {
    setIsLoading(true)
    setTestStep("testing")
    setResult(null)

    try {
      console.log("🧪 Testing full order flow...")

      const testOrderData = {
        name: "Full Test Customer - " + Date.now(),
        phone: "+1 (555) 987-6543",
        email: "full-test@cozycraft.com",
        address: "456 Full Test Ave",
        city: "Test City",
        pincode: "54321",
        items: [
          {
            name: "Test Blanket",
            price: 75.99,
            quantity: 1,
            total: 75.99,
          },
          {
            name: "Test Booties",
            price: 25.99,
            quantity: 2,
            total: 51.98,
          },
        ],
        totalAmount: 127.97,
        orderTime: new Date().toISOString(),
      }

      const response = await submitOrder(testOrderData)

      setResult({
        type: "full",
        ...response,
        testData: testOrderData,
      })

      setTestStep("complete")
    } catch (error) {
      setResult({
        type: "full",
        success: false,
        error: error.message,
      })
      setTestStep("complete")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Enhanced Google Sheets Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Current Configuration:</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex items-center justify-between">
                <span>📊 Sheet ID:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o</code>
              </div>
              <div className="flex items-center justify-between">
                <span>🔗 Web App URL:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">...exec</code>
              </div>
              <div className="flex items-center justify-between">
                <span>📋 Status:</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Configured
                </Badge>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Direct API Test</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Tests the Google Apps Script directly without going through the order system.
                </p>
                <Button
                  onClick={runDirectTest}
                  disabled={isLoading}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {isLoading && testStep === "testing" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testing Direct...
                    </>
                  ) : (
                    "Test Direct Connection"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Full Order Flow Test</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Tests the complete order submission process including all data formatting.
                </p>
                <Button
                  onClick={runFullTest}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  {isLoading && testStep === "testing" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testing Full Flow...
                    </>
                  ) : (
                    "Test Full Order Flow"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {result.type === "direct" ? "Direct API Test" : "Full Order Flow Test"}
                    </span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "SUCCESS" : "FAILED"}
                    </Badge>
                  </div>

                  {result.success ? (
                    <div className="text-green-800">
                      <p className="font-medium">✅ Test completed successfully!</p>
                      <p className="text-sm">Check your Google Sheet to see the test data.</p>
                      {result.message && <p className="text-sm mt-1">{result.message}</p>}
                    </div>
                  ) : (
                    <div className="text-red-800">
                      <p className="font-medium">❌ Test failed</p>
                      {result.error && <p className="text-sm">Error: {result.error}</p>}
                      {result.status && <p className="text-sm">HTTP Status: {result.status}</p>}
                    </div>
                  )}

                  {/* Detailed Response */}
                  {result.responseText && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium">View Raw Response</summary>
                      <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto max-h-32">
                        {result.responseText}
                      </pre>
                    </details>
                  )}

                  {/* Test Data */}
                  {result.testData && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium">View Test Data Sent</summary>
                      <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(result.testData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <a
                href="https://script.google.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Apps Script
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <a
                href={`https://docs.google.com/spreadsheets/d/1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o/edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Google Sheet
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
