"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"

export function EnvironmentSetup() {
  const [sheetsUrl, setSheetsUrl] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    if (!sheetsUrl) {
      setTestResult({ success: false, message: "Please enter a Google Sheets URL" })
      return
    }

    setIsLoading(true)
    try {
      const testData = {
        timestamp: new Date().toLocaleString(),
        customerName: "Test Customer",
        phone: "+1234567890",
        email: "test@example.com",
        address: "123 Test St, Test City, 12345",
        items: "Test Product (Qty: 1, Price: $10.00)",
        totalAmount: "$10.00",
        status: "Test Order",
      }

      const response = await fetch(sheetsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      if (response.ok) {
        setTestResult({ success: true, message: "Connection successful! Check your Google Sheet." })
      } else {
        setTestResult({ success: false, message: `Connection failed: ${response.status} ${response.statusText}` })
      }
    } catch (error) {
      setTestResult({ success: false, message: `Connection error: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  const copyScript = () => {
    const script = `function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    
    // Replace with your actual Google Sheet ID
    const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    if (sheet.getLastRow() === 0) {
      const headers = ["Timestamp", "Customer Name", "Phone", "Email", "Address", "Items", "Total Amount", "Status"]
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f0f0f0")
    }

    const rowData = [
      data.timestamp,
      data.customerName,
      data.phone,
      data.email,
      data.address,
      data.items,
      data.totalAmount,
      data.status,
    ]

    sheet.appendRow(rowData)
    sheet.autoResizeColumns(1, 8)

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput("Google Sheets API is running")
}`

    navigator.clipboard.writeText(script)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Sheets Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your orders are currently being logged to the console. Follow these steps to set up Google Sheets
              integration.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Create Google Apps Script</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>
                Go to{" "}
                <a
                  href="https://script.google.com"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                  rel="noreferrer"
                >
                  script.google.com
                </a>
              </li>
              <li>Create a new project</li>
              <li>Replace the default code with the script below</li>
              <li>Replace "YOUR_GOOGLE_SHEET_ID" with your actual Google Sheet ID</li>
              <li>Deploy as Web App with "Anyone" access</li>
            </ol>

            <Button onClick={copyScript} variant="outline" className="w-full bg-transparent">
              <Copy className="h-4 w-4 mr-2" />
              Copy Google Apps Script Code
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Test Your Setup</h3>
            <div className="space-y-2">
              <Label htmlFor="sheets-url">Google Apps Script Web App URL</Label>
              <Input
                id="sheets-url"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
              />
            </div>

            <Button onClick={testConnection} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>

            {testResult && (
              <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Set Environment Variable</h3>
            <p className="text-sm text-gray-600">
              Once your test is successful, add the URL to your environment variables:
            </p>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              GOOGLE_SHEETS_URL={sheetsUrl || "your_web_app_url_here"}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>For now:</strong> Your orders are being logged to the browser console. Open Developer Tools (F12)
              → Console to see order details when customers place orders.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
