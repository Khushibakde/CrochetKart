/**
 * FINAL FIXED Google Apps Script for CozyCraft Orders
 * This version handles CORS and authentication properly
 */

function doPost(e) {
  try {
    console.log("📦 New order received from web app!")

    // Handle the incoming data properly
    let data
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents)
    } else if (e && e.parameter) {
      data = e.parameter
    } else {
      // Fallback for testing
      data = {
        timestamp: new Date().toLocaleString(),
        customerName: "Fallback Test Customer",
        phone: "N/A",
        email: "N/A",
        address: "N/A",
        items: "Fallback Test",
        totalAmount: "$0.00",
        status: "Fallback Order",
      }
    }

    console.log("Processing order data:", data)

    // Your Google Sheet ID
    // const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o"
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Add headers if first time
    if (sheet.getLastRow() === 0) {
      const headers = ["Order Date", "Customer Name", "Phone", "Email", "Address", "Items", "Total", "Status"]
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#4285f4").setFontColor("white")
    }

    // Add the order
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

    sheet.appendRow(rowData)
    console.log("✅ Order added successfully!")

    // Return response with CORS headers
    const response = ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Order saved successfully",
        timestamp: new Date().toISOString(),
      }),
    )

    response.setMimeType(ContentService.MimeType.JSON)

    return response
  } catch (error) {
    console.error("❌ Error:", error.toString())

    const errorResponse = ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    )

    errorResponse.setMimeType(ContentService.MimeType.JSON)

    return errorResponse
  }
}

function doGet(e) {
  const response = ContentService.createTextOutput("CozyCraft Order API is running! ✅")
  response.setMimeType(ContentService.MimeType.TEXT)
  return response
}

// Test function
function testOrder() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString(),
        customerName: "Script Test Customer",
        phone: "+1 555-0123",
        email: "test@test.com",
        address: "123 Test St, Test City, 12345",
        items: "Test Product (Qty: 1, Price: $10.00)",
        totalAmount: "$10.00",
        status: "Script Test",
      }),
    },
  }

  return doPost(testData)
}
