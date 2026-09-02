"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, Copy } from "lucide-react"
import { useState } from "react"

export function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Google Sheets Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                1
              </span>
              Create a Google Sheet
            </h3>
            <p className="text-gray-600 ml-8">
              Go to{" "}
              <a
                href="https://sheets.google.com"
                target="_blank"
                className="text-blue-500 hover:underline"
                rel="noreferrer"
              >
                Google Sheets
              </a>{" "}
              and create a new spreadsheet. Name it something like "Crochet Orders".
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                2
              </span>
              Get Your Sheet ID
            </h3>
            <p className="text-gray-600 ml-8">
              Copy the Sheet ID from your Google Sheet URL. It's the long string between "/d/" and "/edit":
            </p>
            <div className="ml-8 bg-gray-100 p-3 rounded text-sm font-mono">
              https://docs.google.com/spreadsheets/d/
              <span className="bg-yellow-200">1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o</span>/edit
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                3
              </span>
              Open Google Apps Script
            </h3>
            <p className="text-gray-600 ml-8">
              Go to{" "}
              <a
                href="https://script.google.com"
                target="_blank"
                className="text-blue-500 hover:underline flex items-center"
                rel="noreferrer"
              >
                script.google.com <ExternalLink className="h-4 w-4 ml-1" />
              </a>{" "}
              and create a new project.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                4
              </span>
              Paste the Script Code
            </h3>
            <p className="text-gray-600 ml-8">
              Replace the default code with this script (remember to update YOUR_GOOGLE_SHEET_ID):
            </p>
            <div className="ml-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    
    // ⚠️ REPLACE WITH YOUR ACTUAL SHEET ID
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
  return ContentService.createTextOutput("API is running")
}`,
                    4,
                  )
                }
                className="mb-2"
              >
                {copiedStep === 4 ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copiedStep === 4 ? "Copied!" : "Copy Script"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                5
              </span>
              Deploy as Web App
            </h3>
            <div className="ml-8 space-y-2 text-gray-600">
              <p>1. Click "Deploy" → "New deployment"</p>
              <p>2. Choose type: "Web app"</p>
              <p>3. Execute as: "Me"</p>
              <p>4. Who has access: "Anyone"</p>
              <p>5. Click "Deploy"</p>
              <p>6. Copy the Web App URL</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                6
              </span>
              Add Environment Variable
            </h3>
            <p className="text-gray-600 ml-8">Add your Web App URL to the environment variables:</p>
            <div className="ml-8 bg-gray-100 p-3 rounded text-sm font-mono">
              GOOGLE_SHEETS_URL=your_web_app_url_here
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Common Issues:</h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Make sure to replace YOUR_GOOGLE_SHEET_ID with your actual Sheet ID</li>
              <li>• Ensure the Web App is deployed with "Anyone" access</li>
              <li>• Check that the environment variable GOOGLE_SHEETS_URL is set correctly</li>
              <li>• The Web App URL should end with /exec</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
