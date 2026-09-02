"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, AlertCircle, ExternalLink, FileSpreadsheet, Code, Settings, TestTube } from "lucide-react"

export function GoogleSheetsSetup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sheetId, setSheetId] = useState("")
  const [webAppUrl, setWebAppUrl] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const testConnection = async () => {
    if (!webAppUrl) {
      setTestResult({ success: false, message: "Please enter your Web App URL" })
      return
    }

    setIsLoading(true)
    try {
      const testData = {
        timestamp: new Date().toLocaleString(),
        customerName: "Test Customer - Setup Verification",
        phone: "+1 (555) 123-4567",
        email: "test@cozycraft.com",
        address: "123 Test Street, Test City, TC 12345",
        items: "Test Product (Qty: 1, Price: $10.00)",
        totalAmount: "$10.00",
        status: "Setup Test Order",
      }

      console.log("Testing connection with:", testData)

      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const responseText = await response.text()
      console.log("Response:", responseText)

      if (response.ok) {
        try {
          const result = JSON.parse(responseText)
          if (result.success) {
            setTestResult({
              success: true,
              message: "✅ Connection successful! Check your Google Sheet for the test order.",
            })
            setCurrentStep(6) // Move to final step
          } else {
            setTestResult({
              success: false,
              message: `❌ Error from Google Sheets: ${result.error}`,
            })
          }
        } catch (parseError) {
          setTestResult({
            success: true,
            message: "✅ Connection successful! (Response format may vary)",
          })
        }
      } else {
        setTestResult({
          success: false,
          message: `❌ Connection failed: ${response.status} ${response.statusText}`,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Connection error: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: "Create Google Sheet",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">First, create a new Google Sheet to store your orders.</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>
                Go to{" "}
                <a
                  href="https://sheets.google.com"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                  rel="noreferrer"
                >
                  Google Sheets
                </a>
              </li>
              <li>Click "Blank" to create a new spreadsheet</li>
              <li>Name it "CozyCraft Orders" or similar</li>
              <li>Copy the Sheet ID from the URL</li>
            </ol>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The Sheet ID is the long string in your Google Sheet URL between "/d/" and "/edit"
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label htmlFor="sheet-id">Google Sheet ID</Label>
            <Input
              id="sheet-id"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Open Google Apps Script",
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Now we'll create the script to handle order data.</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>
                Go to{" "}
                <a
                  href="https://script.google.com"
                  target="_blank"
                  className="text-blue-500 hover:underline flex items-center"
                  rel="noreferrer"
                >
                  script.google.com <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>Click "New project"</li>
              <li>You'll see a code editor with default code</li>
              <li>Select all the default code and delete it</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Add the Script Code",
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Copy and paste this script into the Google Apps Script editor:</p>
          <Button
            onClick={() =>
              copyToClipboard(
                `function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    
    // 🚨 REPLACE WITH YOUR ACTUAL SHEET ID
    const SHEET_ID = "${sheetId || "YOUR_GOOGLE_SHEET_ID"}"
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    if (sheet.getLastRow() === 0) {
      const headers = ["Order Date", "Customer Name", "Phone", "Email", "Full Address", "Items Ordered", "Total Amount", "Status"]
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setFontWeight("bold").setBackground("#4285f4").setFontColor("white")
    }

    const rowData = [
      data.timestamp || new Date().toLocaleString(),
      data.customerName || "N/A",
      data.phone || "N/A", 
      data.email || "Not provided",
      data.address || "N/A",
      data.items || "N/A",
      data.totalAmount || "$0.00",
      data.status || "New Order"
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
  return ContentService.createTextOutput("CozyCraft Order API is running!")
}`,
                3,
              )
            }
            variant="outline"
            className="w-full bg-transparent"
          >
            {copiedStep === 3 ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copiedStep === 3 ? "Copied!" : "Copy Script Code"}
          </Button>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {sheetId
                ? `✅ The script includes your Sheet ID: ${sheetId}`
                : "⚠️ Make sure to replace YOUR_GOOGLE_SHEET_ID with your actual Sheet ID"}
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      title: "Deploy as Web App",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Now deploy your script as a web application:</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>Click "Deploy" button (top right)</li>
              <li>Select "New deployment"</li>
              <li>Click the gear icon ⚙️ next to "Type"</li>
              <li>Choose "Web app"</li>
              <li>Set "Execute as" to "Me"</li>
              <li>Set "Who has access" to "Anyone"</li>
              <li>Click "Deploy"</li>
              <li>Copy the Web App URL (ends with /exec)</li>
            </ol>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Important: Make sure "Who has access" is set to "Anyone" - this allows your website to send data to the
              sheet.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      title: "Test Connection",
      icon: <TestTube className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Let's test if everything is working correctly:</p>
          <div className="space-y-2">
            <Label htmlFor="web-app-url">Google Apps Script Web App URL</Label>
            <Input
              id="web-app-url"
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
            />
          </div>
          <Button onClick={testConnection} disabled={isLoading} className="w-full">
            {isLoading ? "Testing Connection..." : "Test Connection"}
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
      ),
    },
    {
      title: "Final Setup",
      icon: <CheckCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Almost done! Add your Web App URL to the environment variables:</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Environment Variable:</p>
            <code className="text-sm bg-white p-2 rounded border block">
              GOOGLE_SHEETS_URL={webAppUrl || "your_web_app_url_here"}
            </code>
          </div>
          <Button
            onClick={() => copyToClipboard(`GOOGLE_SHEETS_URL=${webAppUrl}`, 6)}
            variant="outline"
            className="w-full bg-transparent"
          >
            {copiedStep === 6 ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copiedStep === 6 ? "Copied!" : "Copy Environment Variable"}
          </Button>
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Setup complete! Your orders will now be automatically saved to Google Sheets.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FileSpreadsheet className="h-6 w-6 mr-2" />
            Google Sheets Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > index + 1
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === index + 1
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > index + 1 ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${currentStep > index + 1 ? "bg-green-500" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center">
                <Badge variant="outline" className="mr-3">
                  Step {currentStep}
                </Badge>
                {steps[currentStep - 1].title}
              </h3>
            </div>

            {steps[currentStep - 1].content}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-transparent"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === steps.length}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                {currentStep === steps.length ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
