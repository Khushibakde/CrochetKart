// Test script to verify Google Sheets connection
// Run this to test if your Google Sheets setup is working

const SHEET_URL = process.env.GOOGLE_SHEETS_URL || "https://script.google.com/macros/s/AKfycbxEelFVdyYt6JWW-RKVs52fVweUwwuTuJIeannsI8CSetVW9pXqtSKbkBXqTpKeCMFw/exec"

async function testSheetsConnection() {
  console.log("Testing Google Sheets connection...")
  console.log("Sheet URL:", SHEET_URL)

  if (!SHEET_URL || SHEET_URL === "https://script.google.com/macros/s/AKfycbxEelFVdyYt6JWW-RKVs52fVweUwwuTuJIeannsI8CSetVW9pXqtSKbkBXqTpKeCMFw/exec") {
    console.error("❌ GOOGLE_SHEETS_URL environment variable is not set properly")
    console.log("Please set your Google Sheets Web App URL in the environment variables")
    return
  }

  try {
    // Test data
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

    console.log("Sending test data:", testData)

    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    console.log("Response status:", response.status)

    const responseText = await response.text()
    console.log("Response body:", responseText)

    if (response.ok) {
      console.log("✅ Google Sheets connection successful!")
      console.log("Check your Google Sheet to see if the test data was added")
    } else {
      console.error("❌ Google Sheets connection failed")
      console.error("Status:", response.status)
      console.error("Response:", responseText)
    }
  } catch (error) {
    console.error("❌ Error testing Google Sheets connection:", error)
  }
}

testSheetsConnection()
