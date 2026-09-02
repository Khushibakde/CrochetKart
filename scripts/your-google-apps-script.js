/**
 * Google Apps Script for CozyCraft Orders
 *
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Replace ALL the default code with this script
 * 4. Save the project (Ctrl+S)
 * 5. Click "Deploy" → "New deployment"
 * 6. Choose "Web app" type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy"
 *
 * Your Sheet ID: 1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o
 * Your Web App URL: https://script.google.com/macros/s/AKfycbxEelFVdyYt6JWW-RKVs52fVweUwwuTuJIeannsI8CSetVW9pXqtSKbkBXqTpKeCMFw/exec
 */

// Declare variables before using them
var SpreadsheetApp
var ContentService

function doPost(e) {
  try {
    console.log("📦 New order received!")
    console.log("Request data:", e.postData.contents)

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents)
    console.log("Parsed order data:", data)

    // Your Google Sheet ID (already configured)
    const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o"

    // Open your Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    console.log("✅ Successfully opened Google Sheet:", sheet.getName())

    // If this is the first time, add headers and format them beautifully
    if (sheet.getLastRow() === 0) {
      console.log("🎨 Setting up headers for the first time...")

      const headers = [
        "Order Date",
        "Customer Name",
        "Phone Number",
        "Email Address",
        "Full Address",
        "Items Ordered",
        "Total Amount",
        "Order Status",
      ]

      // Add headers
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])

      // Format headers beautifully
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setFontWeight("bold")
      headerRange.setBackground("#4285f4")
      headerRange.setFontColor("white")
      headerRange.setFontSize(11)
      headerRange.setBorder(true, true, true, true, true, true)

      // Set column widths for better readability
      sheet.setColumnWidth(1, 150) // Order Date
      sheet.setColumnWidth(2, 200) // Customer Name
      sheet.setColumnWidth(3, 150) // Phone
      sheet.setColumnWidth(4, 200) // Email
      sheet.setColumnWidth(5, 300) // Address
      sheet.setColumnWidth(6, 400) // Items
      sheet.setColumnWidth(7, 100) // Total
      sheet.setColumnWidth(8, 120) // Status

      console.log("✅ Headers added and formatted")
    }

    // Prepare the row data
    const rowData = [
      data.timestamp ||
        new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
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
    const lastRow = sheet.getLastRow()
    console.log(`✅ Order added to row ${lastRow}`)

    // Format the new row for better readability
    const dataRange = sheet.getRange(lastRow, 1, 1, 8)
    dataRange.setBorder(true, true, true, true, true, true)
    dataRange.setVerticalAlignment("middle")

    // Alternate row colors for better readability
    if (lastRow % 2 === 0) {
      dataRange.setBackground("#f8f9fa")
    }

    // Highlight new orders in light green
    if (data.status === "New Order") {
      sheet.getRange(lastRow, 8).setBackground("#d4edda").setFontColor("#155724")
    }

    console.log("🎉 Order successfully processed and saved!")

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Order added successfully to CozyCraft Orders sheet",
        timestamp: new Date().toISOString(),
        rowNumber: lastRow,
        customerName: data.customerName,
        totalAmount: data.totalAmount,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("❌ Error processing order:", error)

    // Return detailed error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString(),
        message: "Failed to process order - please check the script logs",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput(
    "🎯 CozyCraft Google Sheets Order API is running successfully!\n\n" +
      "✅ Ready to receive orders\n" +
      "📊 Sheet ID: 1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o\n" +
      "🔗 Web App URL: https://script.google.com/macros/s/AKfycbzT760unZmM0B6LVBbpmLCVdTQTDGZAC8APrYLGCISyhtrcedhGepHKShjQEzaOHgHW/exec\n\n" +
      "Last updated: " +
      new Date().toLocaleString(),
  ).setMimeType(ContentService.MimeType.TEXT)
}

// Test function - you can run this in the Apps Script editor to test
function testOrderSubmission() {
  console.log("🧪 Testing order submission...")

  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString(),
        customerName: "Test Customer - " + new Date().getTime(),
        phone: "+1 (555) 123-4567",
        email: "test@cozycraft.com",
        address: "123 Test Street, Test City, TC 12345",
        items: "Cozy Chunky Blanket (Qty: 1, Price: $89.99); Baby Booties (Qty: 2, Price: $19.99)",
        totalAmount: "$129.97",
        status: "Test Order",
      }),
    },
  }

  const result = doPost(testData)
  console.log("Test result:", result.getContent())

  return "✅ Test completed! Check your Google Sheet and the logs above."
}

// Function to get current sheet statistics
function getSheetStats() {
  try {
    const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o"
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    const stats = {
      sheetName: sheet.getName(),
      totalOrders: Math.max(0, sheet.getLastRow() - 1), // Subtract 1 for header
      lastOrderDate: sheet.getLastRow() > 1 ? sheet.getRange(sheet.getLastRow(), 1).getValue() : "No orders yet",
      sheetUrl: sheet.getParent().getUrl(),
    }

    console.log("📊 Sheet Statistics:", stats)
    return stats
  } catch (error) {
    console.error("Error getting sheet stats:", error)
    return { error: error.toString() }
  }
}
