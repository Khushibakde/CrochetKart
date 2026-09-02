/**
 * Google Apps Script for CozyCraft Orders
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Replace "YOUR_GOOGLE_SHEET_ID" with your actual Sheet ID
 * 5. Save the project
 * 6. Deploy as Web App with "Anyone" access
 * 7. Copy the Web App URL and add it to your environment variables
 */

// Declare variables before using them
const ContentService = ContentService
const SpreadsheetApp = SpreadsheetApp

function doPost(e) {
  try {
    console.log("Received POST request")
    console.log("Request data:", e.postData.contents)

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents)
    console.log("Parsed data:", data)

    // 🚨 IMPORTANT: Replace this with your actual Google Sheet ID
    // You can find this in your Google Sheet URL:
    // https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
    const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o"

    // Check if Sheet ID has been updated
    if (SHEET_ID === "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o") {
      throw new Error("Please replace YOUR_GOOGLE_SHEET_ID with your actual Google Sheet ID in the script")
    }

    // Open your Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // If this is the first time, add headers and format them
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Order Date",
        "Customer Name",
        "Phone",
        "Email",
        "Full Address",
        "Items Ordered",
        "Total Amount",
        "Status",
      ]

      // Add headers
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])

      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setFontWeight("bold")
      headerRange.setBackground("#4285f4")
      headerRange.setFontColor("white")
      headerRange.setBorder(true, true, true, true, true, true)

      console.log("Headers added and formatted")
    }

    // Prepare the row data
    const rowData = [
      data.timestamp || new Date().toLocaleString(),
      data.customerName || "N/A",
      data.phone || "N/A",
      data.email || "Not provided",
      data.address || "N/A",
      data.items || "N/A",
      data.totalAmount || "$0.00",
      data.status || "New Order",
    ]

    // Add the order data to the sheet
    sheet.appendRow(rowData)
    console.log("Data added to sheet successfully")

    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 8)

    // Add some formatting to the new row
    const lastRow = sheet.getLastRow()
    const dataRange = sheet.getRange(lastRow, 1, 1, 8)
    dataRange.setBorder(true, true, true, true, true, true)

    // Alternate row colors for better readability
    if (lastRow % 2 === 0) {
      dataRange.setBackground("#f8f9fa")
    }

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Order added successfully to Google Sheets",
        timestamp: new Date().toISOString(),
        rowNumber: lastRow,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in doPost:", error)

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput("CozyCraft Google Sheets Order API is running successfully! ✅").setMimeType(
    ContentService.MimeType.TEXT,
  )
}

// Test function to verify the script works (you can run this in the Apps Script editor)
function testScript() {
  console.log("Testing the script...")

  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString(),
        customerName: "Test Customer",
        phone: "+1 (555) 123-4567",
        email: "test@example.com",
        address: "123 Test Street, Test City, TC 12345",
        items: "Cozy Chunky Blanket (Qty: 1, Price: $89.99); Baby Booties (Qty: 2, Price: $19.99)",
        totalAmount: "$129.97",
        status: "Test Order",
      }),
    },
  }

  const result = doPost(testData)
  console.log("Test result:", result.getContent())

  return "Test completed - check the logs and your Google Sheet"
}

// Function to get sheet info (helpful for debugging)
function getSheetInfo() {
  const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o"

  if (SHEET_ID === "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o") {
    return "Please update the SHEET_ID in the script"
  }

  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    return {
      sheetName: sheet.getName(),
      lastRow: sheet.getLastRow(),
      lastColumn: sheet.getLastColumn(),
      url: sheet.getParent().getUrl(),
    }
  } catch (error) {
    return "Error: " + error.toString()
  }
}
