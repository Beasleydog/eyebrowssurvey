function doPost(e) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  try {
    // Parse the POST request data
    const postData = JSON.parse(e.postData.contents);
    const userId = e.parameter.userId;

    if (!userId) {
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "error",
          message: "userId parameter is required",
        })
      )
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // Get the points array from the post data
    const { image, yearGuess, confidence, points } = postData;

    // Process each point and add it as a new row
    points.forEach((point) => {
      // Ensure comparison operator is treated as text by prefixing with a single quote
      const safeComparison = `'${point.comparison}`;

      const rowData = [
        new Date(), // Timestamp
        userId,
        image,
        yearGuess,
        confidence,
        point.x,
        point.y,
        point.year,
        safeComparison,
        point.comment,
      ];

      sheet.appendRow(rowData);
    });

    // Return success response with CORS headers
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: `Successfully processed ${points.length} points`,
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  } catch (error) {
    // Return error response with CORS headers
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

// Handle preflight OPTIONS requests
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

// Optional: Add this function to set up the initial headers
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  const headers = [
    "Timestamp",
    "User ID",
    "Image",
    "Year Guess",
    "Confidence",
    "Point X",
    "Point Y",
    "Point Year",
    "Point Comparison",
    "Point Comment",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}
