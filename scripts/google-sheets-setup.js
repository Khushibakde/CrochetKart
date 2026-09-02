// Google Apps Script code to deploy as a web app
// This should be deployed in Google Apps Script and the URL should be added to your environment variables

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    // Open your Google Sheet (replace with your sheet ID)
    const sheet = SpreadsheetApp.openById("1psD2BmYaR3xxpKU_8jU2QNbBCQu7wn8wzHKQo9_YW4o").getActiveSheet()

    // If this is the first time, add headers
    if (sheet.getLastRow() === 0) {
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Timestamp", "Customer Name", "Phone", "Email", "Address", "Items", "Total Amount", "Status"]])
    }

    // Add the order data
    sheet.appendRow([
      data.timestamp,
      data.customerName,
      data.phone,
      data.email,
      data.address,
      data.items,
      data.totalAmount,
      data.status,
    ])

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

function doGet() {
  return ContentService.createTextOutput("Google Sheets Order API is running").setMimeType(ContentService.MimeType.TEXT)
}
