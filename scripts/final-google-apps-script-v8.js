function doPost(e) {
  try {
    console.log("📦 New order received! (v8)")
    console.log("Full raw event object:", JSON.stringify(e, null, 2))
    console.log("e.postData:", e ? JSON.stringify(e.postData, null, 2) : "undefined")
    console.log("e.parameter:", e ? JSON.stringify(e.parameter, null, 2) : "undefined")
    console.log("e.queryString:", e ? e.queryString : "undefined")

    let data = {}

    // Attempt to parse JSON from postData.contents
    if (e && e.postData && e.postData.contents) {
      console.log("Attempting to parse JSON from postData.contents...")
      try {
        data = JSON.parse(e.postData.contents)
        console.log("✅ Successfully parsed JSON data.")
      } catch (jsonError) {
        console.log("⚠️ JSON parsing failed. Error:", jsonError.message)
        console.log("Falling back to e.parameter (form data)...")
        data = e.parameter || {}
      }
    }
    // If no postData.contents, or JSON parsing failed, try e.parameter (form data)
    else if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      console.log("✅ Using e.parameter (form data).")
      data = e.parameter
    }
    // Fallback if no data is found
    else {
      console.log("⚠️ No recognizable data format found in event object. Using fallback test data.")
      data = {
        timestamp: new Date().toLocaleString(),
        customerName: "Test Customer - No Data Received (v8)",
        phone: "N/A",
        email: "N/A",
        address: "N/A",
        items: "Test Order - Check Integration (v8)",
        totalAmount: "$0.00",
        status: "Test Order - Data Missing (v8)",
      }
    }

    console.log("📋 Final parsed data for sheet:", JSON.stringify(data, null, 2))

    // Open Google Sheet
    const SHEET_ID = "1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o" // <<< VERIFY THIS ID
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    console.log("✅ Successfully opened Google Sheet:", sheet.getName())

    // Set up headers if this is the first row
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
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setFontWeight("bold")
      headerRange.setBackground("#4285f4")
      headerRange.setFontColor("white")
      headerRange.setFontSize(11)
      headerRange.setBorder(true, true, true, true, true, true)
    }

    // Prepare row data
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

    // Add the row
    sheet.appendRow(rowData)
    const lastRow = sheet.getLastRow()
    console.log(`✅ Order added to row ${lastRow}`)

    // Format the new row
    const dataRange = sheet.getRange(lastRow, 1, 1, 8)
    dataRange.setBorder(true, true, true, true, true, true)
    if (lastRow % 2 === 0) {
      dataRange.setBackground("#f8f9fa")
    }

    console.log("🎉 Order successfully processed and saved!")

    // Return success response
    const successResponse = {
      success: true,
      message: "Order added successfully to CozyCraft Orders sheet",
      timestamp: new Date().toISOString(),
      rowNumber: lastRow,
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      receivedData: data,
    }

    return ContentService.createTextOutput(JSON.stringify(successResponse)).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("❌ Error processing order:", error.toString())
    console.error("❌ Error stack:", error.stack)

    const errorResponse = {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString(),
      message: "Failed to process order",
    }

    return ContentService.createTextOutput(JSON.stringify(errorResponse)).setMimeType(ContentService.MimeType.JSON)
  }
}

// 🌍 Handles GET request (for testing)
function doGet(e) {
  console.log("GET request received:", JSON.stringify(e))
  return ContentService.createTextOutput(
    "🎯 CozyCraft Google Sheets Order API is running!\n\n" +
      "✅ Ready to receive orders\n" +
      "📊 Sheet ID: 1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o\n" + // <<< VERIFY THIS ID
      "🔗 Status: Active\n" +
      "⏰ Last checked: " +
      new Date().toLocaleString(),
  ).setMimeType(ContentService.MimeType.TEXT)
}

// 🧪 Manual test function
function testManually() {
  console.log("🧪 Running manual test...")
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString(),
        customerName: "Manual Test Customer - " + new Date().getTime(),
        phone: "+1 (555) 999-8888",
        email: "manual-test@cozycraft.com",
        address: "456 Manual Test Ave, Test City, TC 67890",
        items: "Manual Test Blanket (Qty: 1, Price: $99.99)",
        totalAmount: "$99.99",
        status: "Manual Test Order",
      }),
      type: "application/json",
      length: 0, // Placeholder
    },
    parameter: {}, // Placeholder
  }
  const result = doPost(testEvent)
  console.log("Manual test result:", result.getContent())
  return "✅ Manual test completed! Check the logs and your Google Sheet."
}

// 🧪 Test with form data
function testWithFormData() {
  console.log("🧪 Running form data test...")
  const testEvent = {
    parameter: {
      timestamp: new Date().toLocaleString(),
      customerName: "Form Test Customer - " + new Date().getTime(),
      phone: "+1 (555) 888-7777",
      email: "form-test@cozycraft.com",
      address: "789 Form Test Blvd, Form City, FC 12345",
      items: "Form Test Scarf (Qty: 2, Price: $25.00)",
      totalAmount: "$50.00",
      status: "Form Test Order",
    },
    postData: {
      type: "application/x-www-form-urlencoded",
      contents: "", // Placeholder
      length: 0, // Placeholder
    },
  }
  const result = doPost(testEvent)
  console.log("Form test result:", result.getContent())
  return "✅ Form test completed! Check the logs and your Google Sheet."
}
