// Improved Google Apps Script code
// Deploy this as a web app in Google Apps Script

function doPost(e) {
  try {
    console.log("Received POST request")
    console.log("Request data:", e.postData.contents)

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents)
    console.log("Parsed data:", data)

    // Replace 'YOUR_GOOGLE_SHEET_ID' with your actual Google Sheet ID
    // You can find this in your Google Sheet URL: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
    const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o" // ⚠️ REPLACE THIS WITH YOUR ACTUAL SHEET ID

    if (SHEET_ID === "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o") {
      throw new Error("Please replace YOUR_GOOGLE_SHEET_ID with your actual Google Sheet ID")
    }

    // Open your Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // If this is the first time, add headers
    if (sheet.getLastRow() === 0) {
      const headers = ["Timestamp", "Customer Name", "Phone", "Email", "Address", "Items", "Total Amount", "Status"]
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])

      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setFontWeight("bold")
      headerRange.setBackground("#f0f0f0")
    }

    // Add the order data
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
    console.log("Data added to sheet successfully")

    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 8)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Order added successfully",
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in doPost:", error)

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
  return ContentService.createTextOutput(
    "Google Sheets Order API is running. Use POST method to submit orders.",
  ).setMimeType(ContentService.MimeType.TEXT)
}

// Test function to verify the script works
function testScript() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString(),
        customerName: "Test Customer",
        phone: "+1234567890",
        email: "test@example.com",
        address: "123 Test St, Test City, 12345",
        items: "Test Product (Qty: 1, Price: $10.00)",
        totalAmount: "$10.00",
        status: "Test Order",
      }),
    },
  }

  const result = doPost(testData)
  console.log("Test result:", result.getContent())
}
